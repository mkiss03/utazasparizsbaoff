-- ============================================
-- EMERGENCY RLS POLICY FIX
-- Az RLS engedélyezés után hiányzó policy-k pótlása
-- Futtasd a Supabase SQL Editorban
-- ============================================

-- ============================================
-- 1. profiles tábla
-- A vendor/felhasználói szerepkör ellenőrzések
-- ============================================

-- Bejelentkezett felhasználó olvassa saját profilját
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON profiles FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Super admin olvas minden profilt (is_super_admin() SECURITY DEFINER függvény segítségével — nincs rekurzió)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Super admins can read all profiles'
  ) THEN
    -- Csak akkor futtatja, ha az is_super_admin() függvény létezik
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_super_admin') THEN
      EXECUTE '
        CREATE POLICY "Super admins can read all profiles"
          ON profiles FOR SELECT TO authenticated
          USING (is_super_admin())
      ';
    END IF;
  END IF;
END $$;

-- Vendor profilok publikus olvasása (piactér oldalhoz szükséges)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Public can read vendor profiles'
  ) THEN
    CREATE POLICY "Public can read vendor profiles"
      ON profiles FOR SELECT
      USING (role IN ('vendor', 'super_admin'));
  END IF;
END $$;

-- ============================================
-- 2. bundles tábla
-- ============================================

-- Publikus olvasás a közzétett csomagokhoz (anon is)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bundles' AND policyname='Public can view published bundles'
  ) THEN
    CREATE POLICY "Public can view published bundles"
      ON bundles FOR SELECT
      USING (is_published = true);
  END IF;
END $$;

-- Vendorok látják a saját csomagjaikat (publikált és nem publikált egyaránt)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bundles' AND policyname='Vendors can view own bundles'
  ) THEN
    CREATE POLICY "Vendors can view own bundles"
      ON bundles FOR SELECT TO authenticated
      USING (auth.uid() = author_id);
  END IF;
END $$;

-- Vendorok létrehozhatnak csomagot
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bundles' AND policyname='Vendors can create bundles'
  ) THEN
    CREATE POLICY "Vendors can create bundles"
      ON bundles FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

-- Vendorok szerkeszthetik a saját csomagjaikat
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bundles' AND policyname='Vendors can update own bundles'
  ) THEN
    CREATE POLICY "Vendors can update own bundles"
      ON bundles FOR UPDATE TO authenticated
      USING (auth.uid() = author_id)
      WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

-- Vendorok törölhetik a saját csomagjaikat
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='bundles' AND policyname='Vendors can delete own bundles'
  ) THEN
    CREATE POLICY "Vendors can delete own bundles"
      ON bundles FOR DELETE TO authenticated
      USING (auth.uid() = author_id);
  END IF;
END $$;

-- ============================================
-- 3. flashcards tábla
-- ============================================

-- Demo kártyák és közzétett bundle-hez tartozó kártyák publikusan olvashatók
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='flashcards' AND policyname='Public can read flashcards from published bundles'
  ) THEN
    CREATE POLICY "Public can read flashcards from published bundles"
      ON flashcards FOR SELECT
      USING (
        is_demo = true
        OR EXISTS (
          SELECT 1 FROM bundles
          WHERE bundles.id = flashcards.bundle_id
          AND bundles.is_published = true
        )
      );
  END IF;
END $$;

-- Vendorok kezelhetik a saját kártyáikat
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='flashcards' AND policyname='Vendors can manage own flashcards'
  ) THEN
    CREATE POLICY "Vendors can manage own flashcards"
      ON flashcards FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM bundles
          WHERE bundles.id = flashcards.bundle_id
          AND bundles.author_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM bundles
          WHERE bundles.id = flashcards.bundle_id
          AND bundles.author_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ============================================
-- 4. menu_settings tábla — policy ellenőrzés és javítás
-- ============================================

ALTER TABLE menu_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read menu settings" ON menu_settings;
CREATE POLICY "Public can read menu settings"
  ON menu_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update menu settings" ON menu_settings;
CREATE POLICY "Authenticated can update menu settings"
  ON menu_settings FOR UPDATE TO authenticated
  USING (true);

-- ============================================
-- 5. menu_settings adatok helyreállítása
-- (az is_active értékeket NEM írja felül, csak a hiányzó sorokat szúrja be)
-- Kivétel: louvre_guide marad rejtett
-- ============================================

INSERT INTO menu_settings (menu_key, label, href, is_active, sort_order, parent_group) VALUES
  ('walking_tours', 'Sétatúrák',       '/walking-tours', true,  1, 'parisian_experiences'),
  ('louvre_guide',  'Louvre Guide',    '/museum-guide',  false, 2, 'parisian_experiences'),
  ('bundles',       'Kártyacsomagok',  '/marketplace',   true,  3, 'parisian_experiences'),
  ('experiences',   'Párizsi Élmények','/elmenyek',      true,  4, 'parisian_experiences'),
  ('blog',          'Párizsi Napló',   '/blog',          true,  1, 'inspiration'),
  ('gallery',       'Galéria',         '/galeria',       true,  2, 'inspiration')
ON CONFLICT (menu_key) DO UPDATE SET
  label        = EXCLUDED.label,
  href         = EXCLUDED.href,
  sort_order   = EXCLUDED.sort_order,
  parent_group = EXCLUDED.parent_group;
  -- SZÁNDÉKOSAN nem írja felül az is_active értékeket

-- Louvre Guide biztosan rejtett maradjon:
UPDATE menu_settings SET is_active = false WHERE menu_key = 'louvre_guide';

-- ============================================
-- 6. Ellenőrzés — futtasd utána ezt a SELECT-et
-- ============================================

SELECT
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('profiles', 'bundles', 'flashcards', 'menu_settings')
ORDER BY tablename, policyname;
