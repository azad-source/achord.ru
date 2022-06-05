
from rest_framework.filters import BaseFilterBackend


class SimpleFilter(BaseFilterBackend):
    lookup_view_field = 'filter_config'
    def filter_queryset(self, request, queryset, view):
        filter_config = getattr(view, self.lookup_view_field)
        filter_kwargs = {}
        for key, value in filter_config.items():
            param = request.GET.get(key)
            if param:
                filter_kwargs[value] = param
        return queryset.filter(**filter_kwargs)
