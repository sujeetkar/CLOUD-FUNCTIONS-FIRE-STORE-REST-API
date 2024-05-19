import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions/v1';
import { decodeJwt, encodeJwt } from '../../../utils/jwt';
import * as service from './auth.service';
import { getCurrentJST } from '../../../utils/dayjs';
import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
} from '../../../utils/apiErrorHandler';
import { getUser, getUserByEmail, updateUserFields } from '../../../models/user';
import { messaging } from 'firebase-admin';
import { comparePassword } from '../../../utils/bcrypt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, address } = req.body;
    await service.createUser(email, password, name, phone, address);
    res.status(200).json({message: 'User Registered Successfully.'});
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail( email );
    console.log('user data', user)
    if (!user) throw badImplementationException('user is not set properly');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;
    const validatePassword = comparePassword(password, user[0].password)
    if (!validatePassword) {
      return dataNotExistException( "Invalid password." );
    }
    const accessToken = encodeJwt({ user_id: user[0].user_id }, ACCESS_TOKEN_EXPIRED_IN || '1h', 'access');
    const refreshToken = encodeJwt({ user_id: user[0].user_id }, REFRESH_TOKEN_EXPIRED_IN || '2h', 'refresh');

    // TODO update refresh token
    await updateUserFields(user[0].user_id, { refresh_token: refreshToken, updated_at: getCurrentJST() });

    res.status(200).json({ message: 'Login Successful', accessToken, refreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');

    // TODO updateUser for make the refresh token to be null
    await updateUserFields(user_id, { refresh_token: null, updated_at: getCurrentJST() });

    res.status(200).json({message: "Logout Successful"});
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // TODO implment getUserByEmail to get user detail
    const users = await getUserByEmail(email);
    if (users.length === 0) throw dataNotExistException('Email does not register');
    if (users.length > 1) throw badImplementationException('Something went wrong. Email is more than 1.');
    if (users[0].status !== 'active') throw unauthorizedException('This user is unauthorized.');

    service.forgotPassword(users[0]);

    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('request ################### ', req)
    const { password, tokenId } = req.body;

    await service.updatePassword(password, tokenId);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};


export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('request ################### ', req)
    const { refreshToken } = req.body;

    const decoded = decodeJwt(refreshToken, 'refresh');

    if (typeof decoded === 'string') {
      // Handle the case where the token could not be decoded properly
      throw new Error('Token could not be decoded');
    }

    // TODO get user by id
    const user = await getUser(decoded.user_id);
    if (!user) throw unauthorizedException('User does not exist');
    if (user.status !== 'active') throw unauthorizedException('This user is not active');
    if (user.refresh_token !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken = encodeJwt({ id: user.user_id }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: user.user_id }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    // update refresh token
    await updateUserFields(user.user_id, { refresh_token: newRefreshToken, updated_at: getCurrentJST() });

    res.status(200).json({ message: 'Token refreshed', accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};
