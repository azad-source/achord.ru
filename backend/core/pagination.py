from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    @property
    def page_size_from_request(self):
        page_size = self.request.GET.get(self.page_size_query_param)
        return page_size if page_size else self.page_size

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page_size', self.page_size_from_request),
            ('page_count', self.page.paginator.num_pages),
            ('results', data),
        ]))

