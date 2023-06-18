import { NotAuthorizedError } from '@ticket0/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

require('dotenv').config();

interface UserPayload {
  id: string;
  email: string;
}

//adding a new property to an already declared object
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

//Current user middleware
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.session) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.cookies.session,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {}

  next();
};
