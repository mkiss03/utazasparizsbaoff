-- A programterv-modul valós használati módja kiderült: nem (csak) egyedi,
-- foglaláshoz kötött, privát linken kiküldött tervek kellenek, hanem
-- Viktória előre elkészített, ÚJRAFELHASZNÁLHATÓ sablonjai (pl. "Alap 3
-- éj/4 nap", "Disneyland-nappal", "+1 éjszaka") is, amiket a vendég a
-- nyilvános oldalon saját maga választ ki kártyák közül -- lásd a
-- tervdokumentum kiegészítését.
--
-- Ugyanazt a planner.trip_plans táblát bővítjük, nem külön táblát hozunk
-- létre: egy sablon és egy egyedi, foglaláshoz kötött terv szerkezetileg
-- azonos (napok, tételek, kurátori üzenet), csak a megjelenés/kiválasztás
-- módja tér el.

ALTER TABLE planner.trip_plans
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS template_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS template_teaser TEXT,
  ADD COLUMN IF NOT EXISTS template_image TEXT,
  ADD COLUMN IF NOT EXISTS sort_order SMALLINT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_planner_trip_plans_templates
  ON planner.trip_plans(destination_id, sort_order)
  WHERE is_template = true AND is_published = true;
