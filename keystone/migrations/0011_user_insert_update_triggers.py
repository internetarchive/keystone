# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from pathlib import Path

from django.db import migrations, models

sql_path = "{}/0011_user_insert_update_triggers".format(Path(__file__).parent)
func_sql = lambda x: open("{}/functions/{}.sql".format(sql_path, x), "r").read()
trig_sql = lambda x: open("{}/triggers/{}.sql".format(sql_path, x), "r").read()


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0010_team_team_unique"),
    ]

    operations = [
        migrations.RunSQL(
            sql=func_sql("user_on_insert"), reverse_sql="DROP FUNCTION user_on_insert"
        ),
        migrations.RunSQL(
            sql=func_sql("user_on_update"), reverse_sql="DROP FUNCTION user_on_update"
        ),
        migrations.RunSQL(
            sql=trig_sql("trig_user_insert"),
            reverse_sql="DROP TRIGGER trig_user_insert ON keystone_user",
        ),
        migrations.RunSQL(
            sql=trig_sql("trig_user_update"),
            reverse_sql="DROP TRIGGER trig_user_update ON keystone_user",
        ),
    ]
