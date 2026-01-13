# Flashcards / Csomagok Funkció Kapcsoló

## 📋 Áttekintés

A flashcards/csomagok funkciók (Város Útmutató Flashcardok, Csomagok, Városi Árazás, Rendelések) egy **feature flag** (funkció kapcsoló) mögött vannak, így egyetlen környezeti változó módosításával be- és kikapcsolhatók.

## 🔧 Hogyan működik?

A `.env.local` fájlban található egy `NEXT_PUBLIC_ENABLE_FLASHCARDS` változó, amely szabályozza a flashcard funkciók láthatóságát.

## 🚀 Használat

### Flashcards funkció ELREJTÉSE (jelenlegi állapot)

1. Nyisd meg a `.env.local` fájlt
2. Állítsd be: `NEXT_PUBLIC_ENABLE_FLASHCARDS=false`
3. Indítsd újra a dev szervert: `npm run dev`

**Eredmény:**
- ❌ "Város Útmutató Flashcardok" szekció ELTŰNIK a főoldalról
- ❌ "Városbérletek" menüpont ELTŰNIK a navigációból
- ❌ Admin navbar-ban a FLASHCARDS szekció és menüpontjai ELTŰNNEK:
  - Csomagok
  - Városi Árazás
  - Rendelések

### Flashcards funkció MEGJELENÍTÉSE

1. Nyisd meg a `.env.local` fájlt
2. Állítsd be: `NEXT_PUBLIC_ENABLE_FLASHCARDS=true`
3. Indítsd újra a dev szervert: `npm run dev`

**Eredmény:**
- ✅ "Város Útmutató Flashcardok" szekció MEGJELENIK a főoldalon
- ✅ "Városbérletek" menüpont MEGJELENIK a navigációban
- ✅ Admin navbar-ban a FLASHCARDS szekció és menüpontjai MEGJELENNEK

## 📝 Fontos megjegyzések

1. **Dev szerver újraindítása kötelező!** A környezeti változók csak a szerver indulásakor töltődnek be.
2. **Production build:** Ha production buildet készítesz (`npm run build`), a build időpontjában érvényes érték kerül bele a kódba.
3. **Git:** A `.env.local` fájl a `.gitignore`-ban van, így nem kerül feltöltésre GitHub-ra.

## 🛠️ Érintett fájlok

### Módosított fájlok a feature flag implementációjához:

1. **`.env.local`**
   - Tartalmazza a `NEXT_PUBLIC_ENABLE_FLASHCARDS` változót

2. **`app/page.tsx`**
   - Feltételesen jeleníti meg a `ParisFlashcardsPromoSection` komponenst

3. **`components/Navigation.tsx`**
   - Feltételesen jeleníti meg a "Városbérletek" menüpontot

4. **`components/admin/admin-nav.tsx`**
   - Feltételesen jeleníti meg a FLASHCARDS szekció menüpontjait (Csomagok, Városi Árazás, Rendelések)

## 🔄 Jövőbeli fejlesztés

Ha a marketplace funkcionalitás teljesen kész, egyszerűen állítsd át az értéket `true`-ra, és minden flashcard funkció azonnal elérhető lesz a felhasználók számára - módosítás nélkül!

## 📞 Kapcsolat

Ha bármilyen kérdésed van ezzel kapcsolatban, keresd a fejlesztőt.
