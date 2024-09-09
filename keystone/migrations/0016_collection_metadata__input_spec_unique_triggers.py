# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from pathlib import Path

from django.db import migrations, models

sql_path = "{}/0016_collection_metadata__input_spec_unique_triggers".format(
    Path(__file__).parent
)
func_sql = lambda x: open("{}/functions/{}.sql".format(sql_path, x), "r").read()
trig_sql = lambda x: open("{}/triggers/{}.sql".format(sql_path, x), "r").read()


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0015_collection_metadata__input_spec_idx"),
    ]

    operations = [
        migrations.RunSQL(
            sql=func_sql("collection_on_insert"),
            reverse_sql="DROP FUNCTION collection_on_insert",
        ),
        migrations.RunSQL(
            sql=func_sql("collection_on_update"),
            reverse_sql="DROP FUNCTION collection_on_update",
        ),
        migrations.RunSQL(
            sql=trig_sql("trig_collection_insert"),
            reverse_sql="DROP TRIGGER trig_collection_insert ON keystone_collection",
        ),
        migrations.RunSQL(
            sql=trig_sql("trig_collection_update"),
            reverse_sql="DROP TRIGGER trig_collection_update ON keystone_collection",
        ),
    ]
