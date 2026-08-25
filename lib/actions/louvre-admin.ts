'use server'

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { access, chmod, copyFile, mkdtemp, readFile, rm, writeFile, constants as fsConstants } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import ffmpegStaticPath from 'ffmpeg-static'
import { createClient } from '@/lib/supabase/server'

const execFileAsync = promisify(execFile)
const BUCKET = 'louvre-media'

interface ConvertResult {
  url: string
  duration: number
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

function describeError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { message?: string; stderr?: string; code?: string }
    // ffmpeg hibáinál a lényeg a stderr utolsó, nem üres sorában van.
    if (e.stderr) {
      const lines = e.stderr.trim().split('\n').filter(Boolean)
      if (lines.length > 0) return lines[lines.length - 1].slice(0, 300)
    }
    if (e.message) return e.message.slice(0, 300)
  }
  return String(err).slice(0, 300)
}

/**
 * Néhány serverless környezetben (pl. Vercel) az ffmpeg-static bináris a
 * node_modules-ból bundle-özve elveszítheti a futtatási jogot, vagy nem
 * érhető el írásvédett fájlrendszerről indítva. Bemásoljuk egy biztosan
 * írható/futtatható /tmp helyre, és onnan futtatjuk.
 */
let resolvedFfmpegPromise: Promise<string> | null = null

async function resolveFfmpegBinary(): Promise<string> {
  if (!ffmpegStaticPath) {
    throw new Error('Az ffmpeg-static csomag nem szolgáltatott bináris elérési utat ezen a platformon.')
  }
  if (!resolvedFfmpegPromise) {
    resolvedFfmpegPromise = (async () => {
      const cachedPath = path.join(tmpdir(), 'louvre-ffmpeg-bin')
      try {
        await access(cachedPath, fsConstants.X_OK)
        return cachedPath
      } catch {
        // még nincs bemásolva vagy nem futtatható -- pótoljuk
      }
      try {
        await copyFile(ffmpegStaticPath as string, cachedPath)
        await chmod(cachedPath, 0o755)
        return cachedPath
      } catch (copyErr) {
        // Nem tudtuk bemásolni -- talán az eredeti útvonal is elérhető
        // közvetlenül futtatható formában, próbáljuk meg azt, mielőtt
        // feladnánk.
        try {
          await access(ffmpegStaticPath as string, fsConstants.X_OK)
          return ffmpegStaticPath as string
        } catch {
          throw new Error(
            `Az ffmpeg bináris nem érhető el sem a csomagolt (${ffmpegStaticPath}), sem a /tmp-be másolt helyen: ${describeError(copyErr)}`
          )
        }
      }
    })().catch((err) => {
      // Ne ragadjon be egy sikertelen felismerés a hidegindítás egész
      // élettartamára -- a következő próbálkozás induljon újra.
      resolvedFfmpegPromise = null
      throw err
    })
  }
  return resolvedFfmpegPromise
}

/**
 * WAV/M4A/MP3/stb. feltöltés -> AAC (.m4a, mono, ~56 kbps) konverzió
 * ffmpeg-static-tal, majd feltöltés a Supabase Storage-be. A böngészőben
 * nincs hangkódoló, ezért ennek szerver oldalon, Node futtatókörnyezetben
 * kell futnia.
 */
export async function convertAndUploadLouvreAudio(formData: FormData): Promise<ActionResult<ConvertResult>> {
  const file = formData.get('file')
  const pathHint = String(formData.get('pathHint') ?? 'audio')

  if (!(file instanceof File)) {
    return { success: false, error: 'Nem érkezett fájl.' }
  }
  if (file.size === 0) {
    return { success: false, error: 'A feltöltött fájl üres.' }
  }
  if (file.size > 40 * 1024 * 1024) {
    return { success: false, error: 'A fájl túl nagy (max. 40 MB).' }
  }

  let ffmpegBin: string
  try {
    ffmpegBin = await resolveFfmpegBinary()
  } catch (err) {
    console.error('Louvre ffmpeg elérési út hiba:', err)
    return { success: false, error: `A szerveren nem elérhető az ffmpeg -- a konverzió nem tud lefutni (${describeError(err)}).` }
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'louvre-audio-'))
  const inputPath = path.join(workDir, 'input')
  const outputPath = path.join(workDir, 'output.m4a')

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, bytes)

    try {
      await execFileAsync(ffmpegBin, ['-y', '-i', inputPath, '-ac', '1', '-ar', '44100', '-c:a', 'aac', '-b:a', '56k', outputPath])
    } catch (err) {
      console.error('Louvre ffmpeg konverziós hiba:', err)
      return { success: false, error: `Nem sikerült konvertálni a hangfájlt (${describeError(err)}).` }
    }

    const duration = await probeDuration(ffmpegBin, outputPath)
    const output = await readFile(outputPath)

    const supabase = await createClient()
    const objectPath = `audio/${pathHint}-${Date.now()}.m4a`
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, output, { contentType: 'audio/mp4', upsert: true })

    if (uploadError) {
      console.error('Louvre audio upload error:', uploadError)
      return {
        success: false,
        error: `A konverzió sikerült, de a feltöltés Supabase Storage-be nem (${uploadError.message}). Ellenőrizd, hogy lefuttattad-e a supabase-louvre-manifest-schema.sql-t (ez hozza létre a "louvre-media" bucketet).`,
      }
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)

    return { success: true, data: { url: publicUrl.publicUrl, duration } }
  } catch (err) {
    console.error('Louvre audio feldolgozási hiba:', err)
    return { success: false, error: `Váratlan hiba a feldolgozás közben (${describeError(err)}).` }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }
}

async function probeDuration(ffmpegBin: string, filePath: string): Promise<number> {
  try {
    // ffmpeg -i egy fájlra hibával tér vissza (nincs kimenet megadva), de a
    // stderr-be kiírja a "Duration: HH:MM:SS.xx" sort -- ebből olvassuk ki
    // a hosszt, ffprobe bináris telepítése nélkül.
    await execFileAsync(ffmpegBin, ['-i', filePath])
    return 0
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr ?? ''
    const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/)
    if (!match) return 0
    const [, h, m, s] = match
    return Math.round(Number(h) * 3600 + Number(m) * 60 + Number(s))
  }
}
