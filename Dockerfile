FROM python:3.11-alpine3.18
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apk update
RUN apk add gcc 
RUN apk add libpq-dev
RUN apk add postgresql-dev
RUN apk add build-base

WORKDIR /usr/src/pianosheet
COPY ./requirements.txt .
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt
