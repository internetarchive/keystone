
# Custom DB Triggers

This directory contains copies of the migration SQL files that were used to create the current version of each of our custom database triggers.

Each time you create or update a trigger, copy the new migration file into this directory and update this README as appropriate.

## Triggers Summary

| trigger name | table | event | invokes function |
| --- | --- | --- | --- |
| trig_user_insert | keystone_user | INSERT | user_on_insert |
| trig_user_update | keystone_user | UPDATE | user_on_update |
