import dataSensorService from "../services/dataSensorService.js";
import predictProducer from "../producers/predictProducer.js";

const predictController = {
  post: async (req, res, next) => {
    try {
      const data = req.body;
      const results = await dataSensorService.create(data);
      for (const sensor of results) {
        await predictProducer.sendPredictionJob(sensor);
      }
      res.status(201).json({
        status: "success",
        message: "Data sensor berhasil dibuat dan dikirim ke antrian prediksi",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default predictController;
