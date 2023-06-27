
import express from 'express';
import { socketRouter } from './SocketRouter';

export const mainRouter = express.Router({
  strict: true
});

// mainRouter.use('/socket.io', socketRouter);