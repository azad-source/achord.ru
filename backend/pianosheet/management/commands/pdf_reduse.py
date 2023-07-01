from django.core.management.base import BaseCommand
import os
from django.conf import settings
from PyPDF2 import PdfReader, PdfWriter
from PyPDF2.errors import PdfReadError


class Command(BaseCommand):
    def handle(self, *args, **options):
        cwd = settings.BASE_DIR.replace('\\', '/')
        note_path = os.path.abspath(os.path.join(cwd, "media", "notes"))
        list_authors = os.listdir(note_path)
        for author in list_authors:
            author_notes_path = os.path.abspath(os.path.join(note_path, author))
            notes = os.listdir(author_notes_path)
            for note in notes:
                try:
                    file_path = os.path.join(note_path, author, note)
                    if note.lower().endswith('pdf'):
                        print(note)
                        try:
                            reader = PdfReader(file_path)
                        except PdfReadError:
                            continue

                        writer = PdfWriter()
                        try:
                            pages = reader.pages
                        except AttributeError:
                            continue
                        for page in pages:
                            page.compress_content_streams()  # This is CPU intensive!
                            writer.add_page(page)

                        with open(file_path, "wb") as f:
                            writer.write(f)
                except Exception:
                    continue