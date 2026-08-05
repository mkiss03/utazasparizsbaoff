-- Bővítés valós tesztfelhasználói visszajelzés alapján:
--   1. A Disneyland-kérdés a sima igen/nem helyett a tényleges parkkombinációt
--      kérdezze (egy nap egy park / egy nap két park / két nap két park).
--   2. A vendég kipipálhassa, mely nevezetességeket szeretné biztosan látni
--      -- ez is csak sablonválasztást befolyásol, a fix napi bontást nem
--      módosítja.
--   3. Repülőjegy- és szállás-tanácsokat Viktória az admin panelből írja be
--      (nem kódba égetett szöveg) -- ez desztináció-szintű, nem
--      sablononkénti tartalom, ezért a planner.configs táblába kerül.
--
-- A régi template_disney_day BOOLEAN oszlopot szándékosan nem töröljük
-- (elkerülve a felesleges destruktív migrációt), csak az alkalmazás nem
-- hivatkozik rá többé -- a template_disney_intensity váltja fel.

ALTER TABLE planner.trip_plans
  ADD COLUMN IF NOT EXISTS template_disney_intensity VARCHAR(30)
    CHECK (template_disney_intensity IS NULL OR template_disney_intensity IN (
      'none', 'one_day_one_park', 'one_day_two_parks', 'two_days_two_parks'
    )),
  ADD COLUMN IF NOT EXISTS template_highlights TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE planner.configs
  ADD COLUMN IF NOT EXISTS guide_content JSONB NOT NULL DEFAULT '{"flightTips": [], "hotelTips": []}'::jsonb;
