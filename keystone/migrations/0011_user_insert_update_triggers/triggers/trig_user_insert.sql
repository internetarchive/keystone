DROP TRIGGER IF EXISTS trig_user_insert on keystone_user;
CREATE TRIGGER trig_user_insert
BEFORE INSERT ON keystone_user
FOR EACH ROW
EXECUTE PROCEDURE user_on_insert();
