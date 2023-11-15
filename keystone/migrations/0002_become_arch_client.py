# Generated by Django 4.2.5 on 2024-01-22 22:44

import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("keystone", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="JobCategory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("description", models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name="collection",
            name="arch_id",
            field=models.CharField(default="", max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="collection",
            name="metadata",
            field=models.JSONField(
                encoder=django.core.serializers.json.DjangoJSONEncoder, null=True
            ),
        ),
        migrations.AddField(
            model_name="collection",
            name="size_bytes",
            field=models.PositiveBigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="jobstart",
            name="collection",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                to="keystone.collection",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="jobtype",
            name="description",
            field=models.TextField(default=""),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="jobcomplete",
            name="job_start",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.PROTECT, to="keystone.jobstart"
            ),
        ),
        migrations.AlterField(
            model_name="jobevent",
            name="event_type",
            field=models.CharField(
                choices=[
                    ("SUBMITTED", "Submitted"),
                    ("QUEUED", "Queued"),
                    ("RUNNING", "Running"),
                    ("FINISHED", "Finished"),
                    ("FAILED", "Failed"),
                    ("CANCELLED", "Cancelled"),
                ],
                max_length=16,
            ),
        ),
        migrations.CreateModel(
            name="JobFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("filename", models.CharField(max_length=255)),
                ("size_bytes", models.PositiveBigIntegerField()),
                ("mime_type", models.CharField(max_length=255)),
                ("line_count", models.IntegerField()),
                ("file_type", models.CharField(max_length=32)),
                ("creation_time", models.DateTimeField()),
                ("md5_checksum", models.CharField(max_length=128, null=True)),
                (
                    "job_complete",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="keystone.jobcomplete",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Dataset",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "state",
                    models.CharField(
                        choices=[
                            ("SUBMITTED", "Submitted"),
                            ("QUEUED", "Queued"),
                            ("RUNNING", "Running"),
                            ("FINISHED", "Finished"),
                            ("FAILED", "Failed"),
                            ("CANCELLED", "Cancelled"),
                        ],
                        max_length=16,
                    ),
                ),
                ("start_time", models.DateTimeField(auto_now_add=True)),
                ("finished_time", models.DateTimeField(null=True)),
                (
                    "job_start",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="keystone.jobstart",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="collection",
            name="latest_dataset",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="keystone.dataset",
            ),
        ),
        migrations.AddField(
            model_name="jobtype",
            name="category",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                to="keystone.jobcategory",
            ),
            preserve_default=False,
        ),
        migrations.AddConstraint(
            model_name="jobfile",
            constraint=models.UniqueConstraint(
                fields=("job_complete", "filename"), name="jobfile_unique"
            ),
        ),
    ]
