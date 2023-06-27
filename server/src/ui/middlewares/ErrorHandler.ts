import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export class ErrorHandler {
  static handle (err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.message);
    console.log(req.originalUrl);
    console.log(err);
    console.log("\n");
    if (err.status && err.message) {
      res
        .status(err.status)
        .json({
          message: err.message,
          status: err.status,
        })
    } else {
      if (err.name === 'SequelizeUniqueConstraintError' && err.original.constraint === 'users_email_key') {
        res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          message: 'email already exist',
          status: StatusCodes.BAD_REQUEST,
        })
      } else {
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'internal_server_error',
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        })
      }
    }
  }
}