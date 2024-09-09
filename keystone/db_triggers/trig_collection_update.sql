DROP TRIGGER IF EXISTS trig_collection_update on keystone_collection;
CREATE TRIGGER trig_collection_update
BEFORE UPDATE ON keystone_collection
FOR EACH ROW
EXECUTE PROCEDURE collection_on_update();
