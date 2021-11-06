from django.core.management.base import BaseCommand
from pianosheet.models import Author, Note
import os
from django.db.utils import IntegrityError
from django.contrib.auth import settings

class Command(BaseCommand):

    def handle(self, *args, **options):
        cwd = settings.BASE_DIR.replace('\\', '/')
        author_path = os.path.abspath(os.path.join(cwd, "media", "previews"))
        list_previews = os.listdir(author_path)
        for preview in list_previews:
            name = preview.rsplit('.', 1)[0]
            try:
                author = Author.objects.get_or_create(name=name)[0]
            except IntegrityError:
                print(f'найден дубликат автора: {name}')
            author.preview = f"previews/{preview}"
            author.save()


