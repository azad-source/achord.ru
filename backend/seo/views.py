from django.http import HttpResponse
from .models import Robots
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime
from pianosheet.models import Author, Note
import urllib
from urllib.parse import quote as url_encode
def robots(request):
    robots = Robots.objects.all().last()
    text = robots.robots if robots else ''
    return HttpResponse(text , content_type="text/plain")


def sitemap(request):
    authors = Author.objects.all()
    notes = Note.objects.all().select_related('author')
    host = 'https://achord.ru'
    sitemap_xml= [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'<sitemap>\n<loc>{host}/</loc>\n</sitemap>'
        ]
    author_list = []
    for author in authors:
        alias = author.alias
        letter = str(author.name).lower()[0]
        uri = f'/sheets/{letter}/{alias}'
        url = host + url_encode(uri)
        author_list.append(f'<sitemap>\n<loc>{url}</loc>\n</sitemap>')
    
    for note in notes:
        author = note.author
        alias = author.alias
        letter = str(author.name).lower()[0]
        uri = f'/sheets/{letter}/{alias}/{note.id}'
        url = host + url_encode(uri)
        author_list.append(f'<sitemap>\n<loc>{url}</loc>\n</sitemap>')

    sitemap_xml.extend(author_list)
    sitemap_xml.append('</sitemapindex>')

    xml = '\n'.join(sitemap_xml)
    return HttpResponse(xml, content_type="application/xml; charset=utf-8")