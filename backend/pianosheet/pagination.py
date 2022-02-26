from core.pagination import CustomPagination


class GenrePagination(CustomPagination):
    page_size = 1000


class AuthorPagination(CustomPagination):
    page_size = 10


class NotePagination(CustomPagination):
    page_size = 10