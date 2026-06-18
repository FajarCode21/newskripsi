import { getChannel } from "../config/rabbitmq.js";

const predictProducer = {
  sendPredictionJob: async (data) => {
    const channel = getChannel();

    channel.sendToQueue("prediction_queue", Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });

    console.log("Data sensor berhasil dikirim ke antrian prediksi");
  },
};

export default predictProducer;
