-- ============================================
-- Louvre Audio Guide -- Voucher adatmodell (fizetés/Stripe NÉLKÜL, egyelőre)
-- ============================================
-- Ez a réteg a kódok kézi kiadását és nyomon követését teszi lehetővé,
-- mielőtt a Stripe/Barion checkout élesedne. Viktória az admin felületen
-- (Louvre Audio Túra -> Voucherek) tud kódokat generálni (pl. banki
-- utalás után kézzel), az aktiválás/lejárat/eszközcsere-logika pedig már
-- most valós és tesztelhető -- csak a nyilvános beváltó felület és a
-- Stripe webhook nincs még rákötve a látogatói PWA-ra.

CREATE TABLE IF NOT EXISTS louvre_vouchers (
  code TEXT PRIMARY KEY,              -- LVR-XXXX-XXXX
  email TEXT,
  batch_size INTEGER DEFAULT 1,       -- hány voucher volt egy "rendelésben" (megjelenítéshez)
  notes TEXT,                         -- Viktória szabad szöveges jegyzete (pl. "banki utalás, Kovács Éva")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  device_id TEXT,
  device_swaps INTEGER DEFAULT 0,
  revoked BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_louvre_vouchers_created ON louvre_vouchers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_louvre_vouchers_email ON louvre_vouchers(email);

ALTER TABLE louvre_vouchers ENABLE ROW LEVEL SECURITY;

-- Nincs nyilvános (anon) hozzáférés: a lista/generálás/visszavonás csak az
-- admin felületről megy (bejelentkezett felhasználó), az aktiválást pedig
-- egy szerver oldali action végzi service role kulccsal, ami megkerüli az
-- RLS-t -- így a kód ismerete maga az "engedély", anélkül hogy a teljes
-- táblát megnyitnánk anonim olvasásra/írásra.
CREATE POLICY "Authenticated users can manage Louvre vouchers"
  ON louvre_vouchers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
