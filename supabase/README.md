# Supabase Database Setup

## Térkép Flashcard Tartalom Rendszer

Ez a könyvtár tartalmazza az adatbázis migrációs fájlokat a térképes flashcard rendszerhez.

### Telepítési Útmutató

#### 1. Jelentkezz be a Supabase Dashboardba

Látogass el a [Supabase Dashboard](https://app.supabase.com)-ra és jelentkezz be a projekteddel.

#### 2. SQL Editor Megnyitása

A bal oldali menüben kattints a **SQL Editor** gombra.

#### 3. Migrations Futtatása

Futtasd le a következő SQL fájlokat **ebben a sorrendben**:

##### Step 1: Tábla létrehozása
```sql
-- Másold be és futtasd le a migrations/001_create_map_flashcard_content.sql tartalmát
```

##### Step 2: Kezdő adatok betöltése
```sql
-- Másold be és futtasd le a migrations/002_seed_map_flashcard_data.sql tartalmát
```

#### 4. Ellenőrzés

A migrations futtatása után ellenőrizd, hogy minden rendben van:

1. Nyisd meg a **Table Editor**-t
2. Keress rá a `map_flashcard_content` táblára
3. Ellenőrizd, hogy 4 sor adat jelenik meg (point-1, point-2, point-3, point-4)

### Admin Felület Használata

Miután az adatbázis tábla létrejött:

1. Látogasd meg az admin felületet: `/admin/map-content`
2. Látni fogod a 4 térkép pontot kártyákon
3. Kattints bármelyik kártyára a szerkesztéshez
4. Módosítsd a tartalmat:
   - **Kártya 1**: Flip card (kérdés és válasz)
   - **Kártya 2**: Előnyök és hátrányok listája
   - **Kártya 3**: Használati lépések
   - **Kártya 4**: Viktória titkos tippje
5. Kattints a "Mentés" gombra

### Komponens Működése

A `DraggableMapSection` komponens automatikusan betölti az adatokat az adatbázisból:

- Ha az adatbázis rendelkezésre áll → dinamikusan tölti az adatokat
- Ha az adatbázis nem elérhető → fallback a hardcoded `MAP_CONTENT_DATA` objektumra

### Fontosabb Fájlok

- `migrations/001_create_map_flashcard_content.sql` - Tábla létrehozása
- `migrations/002_seed_map_flashcard_data.sql` - Kezdő adatok
- `app/admin/map-content/page.tsx` - Admin felület
- `components/sections/DraggableMapSection.tsx` - Frontend komponens

### Gyakori Problémák

**Q: "RLS policy error" hibát kapok**
A: Ellenőrizd, hogy a Row Level Security (RLS) policy-k helyesen lettek létrehozva a migration során.

**Q: Az admin oldalon nem látszanak az adatok**
A: Ellenőrizd, hogy lefutott-e a seed migration és van-e 4 sor adat a táblában.

**Q: A frontend továbbra is a régi adatokat mutatja**
A: Frissítsd az oldalt (hard refresh: Ctrl+Shift+R vagy Cmd+Shift+R). Az adatok automatikusan betöltődnek az adatbázisból.
