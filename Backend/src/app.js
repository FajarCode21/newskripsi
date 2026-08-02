import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import { connectRabbitMQ } from "./rabbitmq-service/config/rabbitmq.js";
import predictionConsumer from "./rabbitmq-service/consumers/predictConsumer.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 3000;

const app = express();
await connectRabbitMQ();
await predictionConsumer.start();

app.use(
  cors({
    origin: "http://localhost:5173", // Domain frontend Vite Anda (WAJIB spesifik, jangan '*')
    credentials: true, // Wajib true jika frontend mengirim cookie/session
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
