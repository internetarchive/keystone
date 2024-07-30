-- Enforce immutability of the username column.
CREATE OR REPLACE FUNCTION user_on_update()
RETURNS trigger AS $func$
  DECLARE
    errors TEXT[];
  BEGIN
    IF NEW.username IS DISTINCT FROM OLD.username THEN
      errors := array_append(errors, 'username is immutable');
    END IF;
    IF array_ndims(errors) > 0 THEN
      RAISE EXCEPTION '%', array_to_string(errors, ', ') USING ERRCODE='27000';
    END IF;
    RETURN NEW;
  END;
$func$ LANGUAGE plpgsql;
