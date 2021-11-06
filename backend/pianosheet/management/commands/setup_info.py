from django.core.management.base import BaseCommand
from pianosheet.models import Author, Note
import os
import pandas as pd
import xlrd
from django.contrib.auth import settings
from django.db.utils import IntegrityError


class Command(BaseCommand):

    def handle(self, *args, **options):
        filename = "/media/авторы.xlsx"
        filepath = settings.BASE_DIR.replace('\\', '/') + filename
        excel = pd.ExcelFile(filepath)
        df = excel.parse('sheet')
        df = df.fillna("")  # заполнение пустых ячеек NaN на ""
        for _, row in df.iterrows():
            name = row['author']
            info = row['info']
            try:
                author_obj = Author.objects.get_or_create(name=name)[0]
            except IntegrityError:
                print(f'найден дубликат автора: {name}')
                continue

            author_obj.info = info
            author_obj.save()