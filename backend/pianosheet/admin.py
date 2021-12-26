from django.contrib import admin
from . import models
from django.utils.html import format_html

admin.site.site_header = "PianoSheet.ru admin"


def img_html(url):
    return format_html(f'<img src="/media/{url}" style="max-height:24px;max-width:24px"/>')


class NoteInline(admin.TabularInline):
    extra = 0
    model = models.Note


class AuthorAdmin(admin.ModelAdmin):
    list_display = ("print_avatar", 'name', 'alias')
    list_display_links = ("print_avatar", 'name')
    inlines = [NoteInline]

    def print_avatar(self, obj):
        return img_html(obj.preview_xs) if obj.preview_xs else '-'
    print_avatar.short_description = ""


class GenreAdmin(admin.ModelAdmin):
    list_display = ("print_avatar", 'name', 'alias')
    list_display_links = ("print_avatar", 'name')

    def print_avatar(self, obj):
        return img_html(obj.preview) if obj.preview else '-'
    print_avatar.short_description = ""


admin.site.register(models.Author, AuthorAdmin)
admin.site.register(models.Note)
admin.site.register(models.Genre, GenreAdmin)
