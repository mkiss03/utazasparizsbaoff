'use server'

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import { createClient } from '@/lib/supabase/server'

const execFileAsync = promisify(execFile)
const BUCKET = 'louvre-media'

interface ConvertResult {
  url: string
  duration: number
}

/**
 * WAV feltöltés -> AAC (.m4a, mono, ~56 kbps) konverzió ffmpeg-static-tal,
 * majd feltöltés a Supabase Storage-be. A böngészőben nincs hangkódoló,
 * ezért ennek szerver oldalon, Node futtatókörnyezetben kell futnia.
 */
export async function convertAndUploadLouvreAudio(formData: FormData): Promise<
  { success: true; data: ConvertResult } | { success: false; error: string }
> {
  const file = formData.get('file')
  const pathHint = String(formData.get('pathHint') ?? 'audio')

  if (!(file instanceof File)) {
    return { success: false, error: 'Nem érkezett fájl.' }
  }
  if (file.size > 40 * 1024 * 1024) {
    return { success: false, error: 'A fájl túl nagy (max. 40 MB).' }
  }
  if (!ffmpegPath) {
    return { success: false, error: 'A szerveren nem elérhető az ffmpeg -- a konverzió nem tud lefutni.' }
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'louvre-audio-'))
  const inputPath = path.join(workDir, 'input')
  const outputPath = path.join(workDir, 'output.m4a')

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(inputPath, bytes)

    await execFileAsync(ffmpegPath, [
      '-y',
      '-i', inputPath,
      '-ac', '1',
      '-ar', '44100',
      '-c:a', 'aac',
      '-b:a', '56k',
      outputPath,
    ])

    const duration = await probeDuration(outputPath)
    const output = await readFile(outputPath)

    const supabase = await createClient()
    const objectPath = `audio/${pathHint}-${Date.now()}.m4a`
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, output, { contentType: 'audio/mp4', upsert: true })

    if (uploadError) {
      console.error('Louvre audio upload error:', uploadError)
      return { success: false, error: 'Nem sikerült feltölteni a konvertált hangfájlt.' }
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)

    return { success: true, data: { url: publicUrl.publicUrl, duration } }
  } catch (err) {
    console.error('Louvre audio conversion error:', err)
    return {
      success: false,
      error: 'Nem sikerült feldolgozni a hangfájlt. Ellenőrizd, hogy érvényes audiófájlt töltöttél-e fel.',
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }
}

async function probeDuration(filePath: string): Promise<number> {
  if (!ffmpegPath) return 0
  try {
    // ffmpeg -i egy fájlra hibával tér vissza (nincs kimenet megadva), de a
    // stderr-be kiírja a "Duration: HH:MM:SS.xx" sort -- ebből olvassuk ki
    // a hosszt, ffprobe bináris telepítése nélkül.
    await execFileAsync(ffmpegPath, ['-i', filePath])
    return 0
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr ?? ''
    const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/)
    if (!match) return 0
    const [, h, m, s] = match
    return Math.round(Number(h) * 3600 + Number(m) * 60 + Number(s))
  }
}
