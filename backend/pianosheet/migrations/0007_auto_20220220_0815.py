# Generated by Django 3.2 on 2022-02-20 08:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pianosheet', '0006_genre_preview'),
    ]

    operations = [
        migrations.CreateModel(
            name='NoteStat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('favorite', models.BooleanField(default=False, verbose_name='избранное')),
                ('like', models.BooleanField(default=False, verbose_name='лайк')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itemstat', to='pianosheet.note')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AuthorStat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('favorite', models.BooleanField(default=False, verbose_name='избранное')),
                ('like', models.BooleanField(default=False, verbose_name='лайк')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itemstat', to='pianosheet.author')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='author',
            name='stats',
            field=models.ManyToManyField(related_name='author_stats', through='pianosheet.AuthorStat', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='note',
            name='stats',
            field=models.ManyToManyField(related_name='note_stats', through='pianosheet.NoteStat', to=settings.AUTH_USER_MODEL),
        ),
    ]
