from django.core.management.base import BaseCommand
from pianosheet.models import Author, Note
import os
from django.db.utils import IntegrityError, DataError

from django.contrib.auth import settings

class Command(BaseCommand):
    def handle(self, *args, **options):
        cwd = settings.BASE_DIR.replace('\\', '/')
        note_path = os.path.abspath(os.path.join(cwd, "media", "notes"))
        list_authors = os.listdir(note_path)
        for author in list_authors:
            author_notes_path = os.path.abspath(os.path.join(note_path, author))
            notes = os.listdir(author_notes_path)
            try:
                author_obj = Author.objects.get_or_create(name=author)[0]
            except IntegrityError:
                print(f'найден дубликат автора: {author}')
                continue
            for note in notes:
                name = str(note).rsplit(".", 1)[0]
                filename = f"notes/{author}/{note}"
                try:
                    Note.objects.get_or_create(
                        name=name,
                        filename=filename,
                        author=author_obj,
                    )
                except DataError:
                    print(name)
                    print(filename)
                    print(author)

