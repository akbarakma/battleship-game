import express from 'express';
// import * as env from 'dotenv';
// import { ErrorHandler } from './ui/middlewares/ErrorHandler';
// import { StatusCodes } from 'http-status-codes';
// import cors from 'cors';
// import { SocketService } from './services/SocketService';
import http from 'http';
import { Server } from 'socket.io';

// async function bootstrap(prefix: string) {
//   // init env
//   env.config();

//   console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

//   // init router
//   const { mainRouter } = require('./ui/routes/mainRouter');

//   const PORT = process.env.PORT || 4000;
//   const app = express();

//   // init socket
//   SocketService.initialize(app);

//   // app.use(cors());
//   // app.use(express.json());
//   // app.use(express.urlencoded({ extended: true }));
  
//   // app.use(`/${prefix}`, mainRouter);

//   // app.use((req, res) => {
//   //   res.status(StatusCodes.NOT_FOUND).send('Endpoint Not Found');
//   // });

//   // app.use(ErrorHandler.handle);
  
//   // app.listen(PORT, () => {
//   //   console.log(`Server is listening on port ${PORT}`);
//   // });
// }

// bootstrap('');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('connect-code', (data: ISocketData) => {
    io.emit(data.to, data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
io.listen(4001)

module.exports = io;

interface ISocketData {
  from: string;
  to: string;
  gameConnected?: boolean;
  playerTurn?: number;
  playerNumber?: number;
  gameStarted?: boolean;
  fromGrid?: any;
  toGrid?: any;
  isGameFinished?: boolean;
  playerWon?: number;
}