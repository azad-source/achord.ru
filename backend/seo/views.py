from django.http import HttpResponse
from .models import Robots
from pianosheet.models import Author, Note, Genre
from urllib.parse import quote as url_encode
from django.views.generic import View


def robots(request):
    robots = Robots.objects.all().last()
    text = robots.robots if robots else ''
    return HttpResponse(text , content_type="text/plain")


class Sitemap(View):
    host = 'https://achord.ru'

    def __init__(self, **kwargs):
        self.locations = []
        self.sitemap_xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            f'<sitemap>\n<loc>{self.host}/</loc>\n</sitemap>'
        ]
        return super().__init__(**kwargs)

    def get(self, request):
        sitemap_xml = self.sitemap_xml
        self.get_authors()
        self.get_notes()
        self.get_genres()
        sitemap_xml.extend(self.locations)
        sitemap_xml.append('</sitemapindex>')
        xml = '\n'.join(sitemap_xml)
        return HttpResponse(xml, content_type="application/xml; charset=utf-8")

    def get_genres(self):
        genres = Genre.objects.all()
        for genre in genres:
            alias = genre.alias
            self.add_location(f'/genres/{alias}')

    def get_authors(self):
        authors = Author.objects.all()
        for author in authors:
            alias = author.alias
            letter = str(author.name).lower()[0]
            self.add_location(f'/sheets/{letter}/{alias}')

    def get_notes(self):
        notes = Note.objects.all().select_related('author')
        for note in notes:
            author = note.author
            alias = author.alias
            letter = str(author.name).lower()[0]
            self.add_location(f'/sheets/{letter}/{alias}/{note.id}')

    def add_location(self, uri):
            url = self.host + url_encode(uri)
            self.locations.append(f'<sitemap>\n<loc>{url}</loc>\n</sitemap>')
