-- A /programtervezo kérdéssora eddig a legjobban illő sablon publikus
-- linkjét mutatta meg azonnal a vendégnek. A valós igény: a vendég
-- ("igénylő") csak beküldi az igényét, Viktória az admin panelben
-- átnézi, szükség szerint módosítja (sorrend, időpontok, tételek), és
-- csak utána teszi közzé / küldi ki a linket.
--
-- Ehhez a kérdéssor végén a legjobban illő sablon TARTALMÁT lemásoljuk
-- egy ÚJ, is_published=false, is_template=false trip_plans sorba (tehát a
-- meglévő admin vázlat→szerkesztés→közzététel folyamat változatlanul
-- kezeli), a vendég kapcsolati adataival és a kérdőív-válaszok rövid
-- összefoglalójával kiegészítve.

ALTER TABLE planner.trip_plans
  ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_notes TEXT;
