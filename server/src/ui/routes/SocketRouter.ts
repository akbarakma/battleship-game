
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import { UserController } from '../controllers/UserController';
import createError from 'http-errors';
import { SocketService } from '../../services/SocketService';

export const socketRouter = express.Router({
  strict: true
});

// const userController = new UserController();


socketRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('masuk endpoint');
    res.json({ msg: 'connected' });
  } catch (err) {
    next(err);
  }
});