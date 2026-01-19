-- Custom SQL migration file, put your code below! --
-- Add to your migration after table creation
CREATE
OR REPLACE FUNCTION update_updated_at_column () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_titles_updated_at BEFORE
UPDATE ON titles FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_title_metas_updated_at BEFORE
UPDATE ON title_metas FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_title_queue_updated_at BEFORE
UPDATE ON title_queue FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();