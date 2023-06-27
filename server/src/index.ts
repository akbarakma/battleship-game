import express from 'express';
import * as env from 'dotenv';
import { ErrorHandler } from './ui/middlewares/ErrorHandler';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import { SocketService } from './services/SocketService';

async function bootstrap(prefix: string) {
  // init env
  env.config();

  console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

  // init router
  const { mainRouter } = require('./ui/routes/mainRouter');

  const PORT = process.env.PORT || 4000;
  const app = express();

  // init socket
  SocketService.initialize(app);

  // app.use(cors());
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  
  // app.use(`/${prefix}`, mainRouter);

  // app.use((req, res) => {
  //   res.status(StatusCodes.NOT_FOUND).send('Endpoint Not Found');
  // });

  // app.use(ErrorHandler.handle);
  
  // app.listen(PORT, () => {
  //   console.log(`Server is listening on port ${PORT}`);
  // });
}

bootstrap('');