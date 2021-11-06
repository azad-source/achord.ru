FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
WORKDIR /usr/src/pianosheet
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

RUN apt update
RUN apt -y upgrade
RUN apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

RUN apt-get install -y nodejs
WORKDIR /usr/src/pianosheet/frontend/pianosheet

