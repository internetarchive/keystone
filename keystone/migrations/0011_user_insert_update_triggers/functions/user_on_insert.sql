-- Enforce user.account.max_users
CREATE OR REPLACE FUNCTION user_on_insert()
RETURNS trigger AS $func$
  BEGIN
    IF (SELECT COUNT(*) FROM keystone_user WHERE account_id=NEW.account_id) >=
       (SELECT max_users FROM keystone_account WHERE id=NEW.account_id) THEN
      RAISE EXCEPTION 'account max users limit reached' USING ERRCODE='27000';
    END IF;
    RETURN NEW;
  END;
$func$ LANGUAGE plpgsql;
