DROP TRIGGER IF EXISTS trig_collection_insert on keystone_collection;
CREATE TRIGGER trig_collection_insert
BEFORE INSERT ON keystone_collection
FOR EACH ROW
EXECUTE PROCEDURE collection_on_insert();
