import { getChannel } from '../brokers/rabbitmq.js';

const predictProducer = {
  sendPredictionJob: async (data) => {
    const channel = getChannel();

    channel.sendToQueue(
      'prediction_queue',
      Buffer.from(JSON.stringify(data)),
      {
        persistent: true,
      },
    );

    console.log('Prediction job sent');
  },
};

export default predictProducer;