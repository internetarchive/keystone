# Generated by Django 4.2.7 on 2024-05-15 16:45

from django.db import migrations, models
import django.db.models.functions.text


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0009_jobtype_code_url_jobtype_info_url"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="team",
            constraint=models.UniqueConstraint(
                django.db.models.functions.text.Lower("name"),
                models.F("account"),
                name="team_unique",
            ),
        ),
    ]
