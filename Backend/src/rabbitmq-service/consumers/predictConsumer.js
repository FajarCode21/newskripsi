import { getChannel } from "../config/rabbitmq.js";
import predictService from "../../services/predictService.js";

const predictConsumer = {
  start: async () => {
    const channel = getChannel();

    channel.consume("prediction_result_queue", async (msg) => {
      if (!msg) return;

      try {
        const result = JSON.parse(msg.content.toString());

        await predictService.createPrediction(result);

        channel.ack(msg);
      } catch (error) {
        console.error(error);

        channel.nack(msg, false, false);
      }
    });

    console.log("Prediction consumer started");
  },
};

export default predictConsumer;
