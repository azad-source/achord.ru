from django.db import models

class Robots(models.Model):
    robots = models.TextField('robots.txt')
    class Meta:
        verbose_name = 'robots.txt'
        verbose_name_plural = 'robots.txt'
    def __str__(self):
        return f'robots.txt {self.id}'
