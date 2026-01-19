-- Custom SQL migration file, put your code below! --
CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "vector";

CREATE EXTENSION "pgroonga"
WITH
  SCHEMA "extensions";