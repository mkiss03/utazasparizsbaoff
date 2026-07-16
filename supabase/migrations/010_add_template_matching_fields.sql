-- A vendégoldali /programtervezo mostantól pár gyors kérdéssel (költségkeret,
-- Disneyland-nap, éjszakák száma) tereli a vendéget a hozzáillő KÉSZ
-- sablonhoz, ahelyett hogy azonnal az összes sablont kártyaként dobná ki.
--
-- Ehhez a sablonok kapnak néhány opcionális, strukturált "illesztési" mezőt.
-- NULL = a sablon bármelyik válaszra illik (nincs preferenciája ebben a
-- szempontban) -- ez szándékos: Viktória nem köteles minden sablont minden
-- dimenzió mentén kategorizálni.

ALTER TABLE planner.trip_plans
  ADD COLUMN IF NOT EXISTS template_budget VARCHAR(20)
    CHECK (template_budget IS NULL OR template_budget IN ('economy', 'mid', 'premium')),
  ADD COLUMN IF NOT EXISTS template_disney_day BOOLEAN,
  ADD COLUMN IF NOT EXISTS template_extra_night BOOLEAN;
