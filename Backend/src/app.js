import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { connectRabbitMQ } from './brokers/rabbitmq.js';
import predictionConsumer from './consummers/predictConsummer.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import routes from './routes/index.js';

const PORT = process.env.PORT || 3000;


const app = express();
await connectRabbitMQ();
await predictionConsumer.start();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
