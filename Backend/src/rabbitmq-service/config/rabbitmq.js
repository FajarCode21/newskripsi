import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL);

  channel = await connection.createChannel();

  await channel.assertQueue("prediction_queue", {
    durable: true,
  });

  await channel.assertQueue("prediction_result_queue", {
    durable: true,
  });

  console.log("RabbitMQ Connected");
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ belum terkoneksi");
  }

  return channel;
};

export const closeRabbitMQ = async () => {
  await channel?.close();
  await connection?.close();
};
