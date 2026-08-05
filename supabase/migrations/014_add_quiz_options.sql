-- A /programtervezo kérdéssorának teljes szövege és a nevezetesség-lista
-- mostantól admin-szerkeszthető adat (lásd lib/planner/quiz-config-types.ts),
-- nem kódba égetett -- ugyanabban a configs táblában tároljuk, mint a
-- repülő/szállás tippeket (guide_content).

ALTER TABLE planner.configs
  ADD COLUMN IF NOT EXISTS quiz_options JSONB NOT NULL DEFAULT '{}'::jsonb;
