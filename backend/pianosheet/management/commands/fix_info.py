from django.core.management.base import BaseCommand
from pianosheet.models import Author

class Command(BaseCommand):

    def handle(self, *args, **options):
        rstr = '_x000D_'
        authors = Author.objects.filter(info__icontains=rstr)
        for author in authors:
            info = str(author.info) if author.info else ''
            print('before')
            print(info)
            author.info = info.replace(rstr, '')
            print('after')
            print(author.info)
            author.save()
