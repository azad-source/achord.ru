# Generated by Django 3.2 on 2021-11-08 17:57

from django.db import migrations, models
import pianosheet.functions


class Migration(migrations.Migration):

    dependencies = [
        ('pianosheet', '0002_note_owner'),
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='имя')),
                ('alias', models.CharField(blank=True, max_length=128, null=True, unique=True, verbose_name='alias')),
            ],
            options={
                'verbose_name': 'Жанр',
                'verbose_name_plural': 'Жанры',
                'ordering': ('name',),
            },
        ),
        migrations.AlterField(
            model_name='note',
            name='filename',
            field=models.FileField(max_length=500, upload_to=pianosheet.functions.PathAndRename('notes'), verbose_name='файл с нотами'),
        ),
        migrations.AddField(
            model_name='author',
            name='genres',
            field=models.ManyToManyField(blank=True, null=True, related_name='authors', to='pianosheet.Genre', verbose_name='жанры'),
        ),
    ]
