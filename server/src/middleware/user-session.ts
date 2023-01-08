import { NextFunction, Request, Response } from 'express';
import { getUserIdFromToken } from '../utils/user/user-utils';

export default function setCurrentUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies.jwt;
  const userId = getUserIdFromToken(token);

  if (userId) {
    // @ts-ignore - will resolve this soon
    req.session.userId = userId;
  }

  next();
}
