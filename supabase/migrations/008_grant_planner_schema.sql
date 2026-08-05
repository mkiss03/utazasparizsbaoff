-- A `planner` séma PostgREST "Exposed schemas" listához adása önmagában
-- nem elég -- az anon/authenticated adatbázis-szerepeknek explicit
-- GRANT-ot is kell kapniuk a sémára és a táblákra, különben minden
-- lekérdezés "permission denied for schema planner" hibát ad, még a
-- meglévő RLS policy-k mellett is (a GRANT egy a policy-k ELŐTTI réteg).
--
-- A tényleges hozzáférést továbbra is a 004_planner_rls.sql-ben definiált
-- RLS policy-k korlátozzák -- ez a migráció csak a Postgres-szintű
-- alap jogosultságot nyitja meg, amit a RLS aztán tovább szűkít.

GRANT USAGE ON SCHEMA planner TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA planner TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA planner TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA planner TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA planner
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA planner
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA planner
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
