from django.apps import apps
from django.contrib.postgres.search import SearchVector
from django.db import models
from django.db.models import Q
from functools import reduce
import operator


def complex_filter(string, field='name'):
    '''
    example using
    return Model.objects.filter(*complex_query('abra cadabra'))
    '''
    words = string.split(' ')
    query = [Q(**{f'{field}__icontains': w}) for w in words]
    query.append(Q(search=string))
    return reduce(operator.or_, query)


class AuthorManager(models.Manager):
    
    def complex_search(self, query, field):
        return super().get_queryset()\
            .annotate(search=SearchVector(field))\
            .filter(complex_filter(query, field))\
            .distinct()


class NoteManager(models.Manager):
    
    def complex_search(self, query, field):
        return super().get_queryset()\
            .annotate(search=SearchVector(field))\
            .filter(complex_filter(query, field))\
            .select_related("author")\
            .distinct()