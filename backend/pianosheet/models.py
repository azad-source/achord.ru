from django.db import models
from .functions import path_and_rename, Translate, ImageConvert
from django.contrib.auth import get_user_model
from . import managers
User = get_user_model()


class Genre(models.Model):
    name = models.CharField(
        "имя",
        max_length=128,
        unique=True,
    )
    alias = models.CharField(
        "alias",
        max_length=128,
        null=True,
        blank=True,
        unique=True,
    )

    class Meta:
        verbose_name = 'Жанр'
        verbose_name_plural = 'Жанры'
        ordering = ('name',)

    def save(self, *args, **kwargs):
        self.alias = Translate.create_alias(self.name)
        super(Genre, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

class Author(models.Model):

    name = models.CharField(
        "имя",
        max_length=128,
        null=True,
        blank=True,
        unique=True,
    )
    alias = models.CharField(
        "alias",
        max_length=128,
        null=True,
        blank=True,
        unique=True,
    )
    info = models.CharField(
        "информация",
        max_length=4000,
        null=True,
        blank=True,
        default="",
    )
    preview = models.ImageField(
        "превью картинка",
        upload_to="previews/",
        default="default.png",
        blank=True,
        null=True,
    )
    preview_s = models.ImageField(
        "превью картинка",
        upload_to="previews_s/",
        default="default.png",
        blank=True,
        null=True,
    )
    preview_xs = models.ImageField(
        "превью картинка",
        upload_to="previews_xs/",
        default="default.png",
        blank=True,
        null=True,
    )
    rate = models.IntegerField(
        "рейтинг",
        default=0,
    )
    genres = models.ManyToManyField(
        Genre, 
        verbose_name='жанры', 
        related_name='authors',
        null=True, 
        blank=True, 
        default=None,
    )
    owner = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL,
        related_name='authors', 
        null=True,
        )
    verificated = models.BooleanField(
        'проверено', default=False,
    )
    objects = managers.AuthorManager()
    class Meta:
        verbose_name = "aвтор"
        verbose_name_plural = "aвторы"

    def save(self, *args, **kwargs):
        self.alias = Translate.create_alias(self.name)
        self.preview_xs = ImageConvert().resize_xs(self.preview, self.preview.name)
        self.preview_s = ImageConvert().resize_s(self.preview, self.preview.name)
        super(Author, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.name)

    def natural_key(self):
        return self.__str__()


class Note(models.Model):
    name = models.CharField(
        "имя",
        max_length=256,
        null=True,
        blank=True,
    )
    filename = models.FileField(
        "файл с нотами",
        upload_to=path_and_rename,
        max_length=500,
    )
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        verbose_name="Автор",
        blank=True,
        null=True,
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='notes', 
        null=True,
        )

    savedate = models.DateTimeField(
        "Дата сохранения",
        auto_now=True,
    )
    content_list = models.CharField(
        "содержание",
        max_length=2000,
        null=True,
        blank=True,
    )
    rate = models.IntegerField(
        "рейтинг",
        default=0,
    )
    verificated = models.BooleanField(
        'проверено', default=False,
    )
    objects = managers.NoteManager()
    class Meta:
        verbose_name = "ноты"
        verbose_name_plural = "ноты"

    def __str__(self):
        return str(self.name)

    def natural_key(self):
        return self.__str__()
