DROP TRIGGER IF EXISTS trig_user_update on keystone_user;
CREATE TRIGGER trig_user_update
BEFORE UPDATE ON keystone_user
FOR EACH ROW
EXECUTE PROCEDURE user_on_update();
