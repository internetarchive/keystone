-- Enforce collection.metadata.input_spec uniqueness.
CREATE OR REPLACE FUNCTION collection_on_update()
RETURNS trigger AS $func$
  BEGIN
    IF NEW.metadata::jsonb ? 'input_spec' AND EXISTS (
      SELECT null
      FROM keystone_collection
      WHERE
        id != NEW.id
        AND metadata::jsonb ? 'input_spec'
        AND metadata::jsonb->>'input_spec' = NEW.metadata::jsonb->>'input_spec'
    ) THEN
      RAISE EXCEPTION 'metadata.input_spec violates unique constraint' USING ERRCODE='27000';
    END IF;
    RETURN NEW;
  END;
$func$ LANGUAGE plpgsql;
