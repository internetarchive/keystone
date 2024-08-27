# Generated by Django 4.2.7 on 2024-06-04 16:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0011_user_insert_update_triggers"),
    ]

    operations = [
        migrations.AlterField(
            model_name="account",
            name="max_users",
            field=models.PositiveIntegerField(default=10),
        ),
    ]