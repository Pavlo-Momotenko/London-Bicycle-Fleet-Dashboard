FROM python:3.10

ENV FLASK_APP=src
ENV FLASK_DEBUG=true
ENV FLASK_ENV=development

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt
