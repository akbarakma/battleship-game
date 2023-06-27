
import http from 'http';
import { Server } from 'socket.io';
import * as core from 'express-serve-static-core';

type instance = any | null;

let modelsInitialized = false;
let models: instance = null;

export class SocketService {
  public static initialize(app: core.Express): void {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "https://battleship-game-vert.vercel.app",
      },
      path: '/battleship-game/socket.io'
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
    io.listen(4000)
    models = io;
    modelsInitialized = true;
  }

  public static getInstance(): Promise<any> {
    if (!modelsInitialized) {
      throw new Error('Socket Not initialize');
    }
    return models;
  }
}

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