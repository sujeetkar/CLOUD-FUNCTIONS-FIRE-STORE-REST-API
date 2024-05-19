import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from './apiErrorHandler';
import { logger } from 'firebase-functions/v1';
import { decodeJwt } from './jwt';

interface JwtPayload {
  admin_id?: string;
  user_id?: string;
  name: string;
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) {
      throw unauthorizedException('No token provided');
    }

    const token = bearer.split(' ')[1];
    if (!token) throw unauthorizedException('Invalid token format');

    try {
      const decoded: JwtPayload = decodeJwt(token, 'refresh') as JwtPayload;
      req.user = decoded;
      if (decoded.user_id) {
        req.body.user_id = decoded.user_id;
      } else {
        throw unauthorizedException('user_id not found in token');
      }
      next();
    } catch (err) {
      throw unauthorizedException('Token verification failed');
    }
  } catch (err) {
    logger.warn(err);
    next(err);
  }
};
