import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import "dotenv/config";

import { connectRabbitMQ } from "./brokers/rabbitmq.js";
import predictionConsumer from "./consummers/predictConsummer.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 3000;

const app = express();
await connectRabbitMQ();
await predictionConsumer.start();

app.use(cors());
app.use(cookieParser());
app.use(
  express.json({
    limit: "10mb",
  }),
);
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

console.log("BASE_URL =", process.env.BASE_URL);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
