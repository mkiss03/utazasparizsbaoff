-- A vendég által a /programtervezo checklistáján kiválasztott
-- nevezetesség-tag-eket külön, strukturált oszlopban is eltároljuk (nem
-- csak a guest_notes szabadszöveges összefoglalójában), hogy az admin
-- szerkesztő ezekből konkrét, kattintható "add hozzá a X. naphoz"
-- gombokat tudjon építeni -- ne kelljen a szöveget visszafejteni.

ALTER TABLE planner.trip_plans
  ADD COLUMN IF NOT EXISTS guest_highlights TEXT[] NOT NULL DEFAULT '{}';
