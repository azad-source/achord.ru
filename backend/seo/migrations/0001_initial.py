# Generated by Django 3.2 on 2021-08-22 20:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Robots',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('robots', models.TextField(verbose_name='robots.txt')),
            ],
            options={
                'verbose_name': 'robots.txt',
                'verbose_name_plural': 'robots.txt',
            },
        ),
    ]
