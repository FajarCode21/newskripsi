import pika
import json
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://admin:admin123@localhost:5672")

connection = None
channel = None


def connect_rabbitmq():
    global connection, channel

    connection = pika.BlockingConnection(
        pika.URLParameters(RABBITMQ_URL)
    )

    channel = connection.channel()

    channel.queue_declare(queue="prediction_queue", durable=True)
    channel.queue_declare(queue="prediction_result_queue", durable=True)

    print("RabbitMQ Connected")


def get_channel():
    if channel is None:
        raise Exception("RabbitMQ not connected")
    return channel


def close_rabbitmq():
    global connection, channel
    if connection:
        connection.close()