FROM python:3.9

ENV PYTHONUNBUFFERED=1

WORKDIR /

COPY . .

RUN pip install -r requirements.txt

RUN python -m venv env

EXPOSE 8000