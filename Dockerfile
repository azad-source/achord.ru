FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
WORKDIR /usr/src/pianosheet/backend
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# COPY . .
# RUN apt update
# RUN apt -y upgrade

