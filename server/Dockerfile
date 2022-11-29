FROM python:3.10
WORKDIR /usr/src/server

ENV FLASK_APP=run.py
ENV FLASK_DEBUG=true
ENV FLASK_ENV=development

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./server .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["sh", "-c", "sleep 5 && \
flask db migrate && \
flask db upgrade && \
python -m flask run --host=0.0.0.0 --port=8000"]
EXPOSE 8000
