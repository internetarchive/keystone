# Generated by Django 4.2.7 on 2024-04-23 21:00

from django.db import migrations, models
import keystone.validators


class Migration(migrations.Migration):
    dependencies = [
        ("keystone", "0004_jobtype_parameters_schema"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(
                editable=False,
                max_length=150,
                unique=True,
                validators=[keystone.validators.validate_username],
            ),
        ),
    ]
