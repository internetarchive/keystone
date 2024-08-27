# Generated by Django 4.2.7 on 2024-05-06 16:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0007_alter_user_username"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="collection",
            name="latest_dataset",
        ),
        migrations.AddField(
            model_name="dataset",
            name="teams",
            field=models.ManyToManyField(
                blank=True, related_name="datasets", to="keystone.team"
            ),
        ),
    ]