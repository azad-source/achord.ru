import os
from django.utils.deconstruct import deconstructible
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
from PIL import Image

# Модуль для редактирования загруженного изображения

MAX_WIDTH = 400
MAX_HEIGHT = 400

MAX_WIDTH_S = 300
MAX_HEIGHT_S = 300

MAX_WIDTH_XS = 200
MAX_HEIGHT_XS = 200


class ImageConvert():
    def resize_s(
        self,
        image,
        name,
    ):
        '''
        Метод изменяет размер изображения
        '''
        if image:
            image = Image.open(image)

            if image.size[0] > MAX_WIDTH_S:
                width = MAX_WIDTH_S
                height = image.size[1] * width // image.size[0]
            else:
                width = image.size[0]
                height = image.size[1]

            image = image.convert('RGB')
            image = image.resize((width, height), Image.ANTIALIAS)
            output = io.BytesIO()
            image.save(output, format='png', quality=85)
            output.seek(0)
            return InMemoryUploadedFile(output,
                                        'ImageField', name, 'image/png',
                                        sys.getsizeof(output), None)
        else:
            return None

    def resize_xs(
        self,
        image,
        name,
    ):
        '''
        Метод изменяет размер изображения
        '''
        if image:
            image = Image.open(image)

            if image.size[0] > MAX_WIDTH_XS:
                width = MAX_WIDTH_XS
                height = image.size[1] * width // image.size[0]
            else:
                width = image.size[0]
                height = image.size[1]

            image = image.convert('RGB')
            image = image.resize((width, height), Image.ANTIALIAS)
            output = io.BytesIO()
            image.save(output, format='png', quality=85)
            output.seek(0)
            return InMemoryUploadedFile(output,
                                        'ImageField', name, 'image/png',
                                        sys.getsizeof(output), None)
        else:
            return None

    def crop(self, image, name):
        '''
        Метод обрезает картинку до квадратной
        '''
        if image:
            image = Image.open(image)

            if image.size[1] > image.size[0]:
                x1 = 0
                x2 = image.size[0]
                y1 = (image.size[1] - image.size[0]) // 2
                y2 = y1 + x2
            elif image.size[1] < image.size[0]:
                y1 = 0
                y2 = image.size[1]
                x1 = (image.size[0] - image.size[1]) // 2
                x2 = x1 + y2
            else:
                y1 = 0
                y2 = image.size[1]
                x1 = 0
                x2 = image.size[0]

            image = image.convert('RGB')
            image = image.crop((x1, y1, x2, y2))
            image = image.resize((MAX_WIDTH, MAX_HEIGHT), Image.ANTIALIAS)
            output = io.BytesIO()
            image.save(output, format='png', quality=85)
            output.seek(0)
            return InMemoryUploadedFile(output,
                                        'ImageField', name, 'image/png',
                                        sys.getsizeof(output), None)
        else:
            return None


class Translate():

    cyr = ('Ы', 'ы', 'Е', 'е', 'æ', 'ç', 'ê', 'é', 'è', 'ô', 'â', 'à', 'î',
           'û', 'ù', 'ú', 'œ', 'ü', 'ё', 'ï', 'ж', 'ч', 'щ', 'ш', 'ю', 'а',
           'б', 'в', 'г', 'д', 'e', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'э',
           'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ъ', 'ь', 'я', 'Ж', 'Ч',
           'Щ', 'Ш', 'Ю', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'З', 'И', 'Й', 'К', 'Ё',
           'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ъ', 'Э',
           'Ь', 'Я', '/', '\\', ':', '?', '<', '>', '"', '|', '*', '.', ',', ' ')

    lat = ('Y', 'y', 'E', 'e', 'ae', 'c', 'e', 'e', 'e', 'o', 'a', 'a', 'i',
           'u', 'u', 'u', 'oe', 'u', 'e', 'i', 'zh', 'ch', 'sht', 'sh', 'yu', 'a', 
           'b', 'v', 'g', 'd', 'e', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'e',
           'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'y', 'x', 'ya', 'Zh', 'Ch', 
           'Sht', 'Sh', 'Yu', 'A', 'B', 'V', 'G', 'D', 'E', 'Z', 'I', 'J', 'K', 'E',
           'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'c', 'Y', 'E',
           'Y', 'Ya', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-')


    @staticmethod
    def create_alias(string):
        if not string:
            return ''
        for i, char in enumerate(Translate.cyr):
            string = string.replace(Translate.cyr[i], Translate.lat[i])
        return string.lower()


@deconstructible
class PathAndRename(object):
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, filename):
        author = instance.author.name
        return str(os.path.join(self.path, author, filename))


path_and_rename = PathAndRename('notes')


def safe_list_get(list, index, default=None):
    '''Безопасный способ взятия элемента из массива.'''
    try:
        return list[index]
    except IndexError:
        return default
