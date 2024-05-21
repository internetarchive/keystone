
# Custom DB Functions

This directory contains copies of the migration SQL files that were used to create the current version of each of our custom database functions.

Each time you create or update a function, copy the new migration file into this directory and update this README as appropriate.

## Functions Summary

| function name | args | returns | description | invoked by trigger |
| --- | --- | --- | --- | --- |
| user_on_insert | n/a | n/a | Enforces account.max_users | trig_user_insert |
| user_on_update | n/a | n/a | Prevents mutation of username and account_id | trig_user_update |
