from django.core.management.base import BaseCommand
from pianosheet.models import Author, Note
import os

class Command(BaseCommand):

    def handle(self, *args, **options):
        authors = Author.objects.all()
        for author in authors:
            author.save()
     