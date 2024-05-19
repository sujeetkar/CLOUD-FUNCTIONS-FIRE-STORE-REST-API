import { Schema } from 'express-validator';
import { VALIDATION_ACCOUNT_TEL, VALIDATION_EMAIL_EXIST, VALIDATION_EMAIL_NOT_EXIST, VALIDATION_PASSWORD, VALIDATION_PASSWORD_CHECK, VALIDATION_STRING, VALIDATION_TOKEN } from '../../../constants/validation';

export const REGISTER_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  password: VALIDATION_PASSWORD('body'),
  name: VALIDATION_STRING('body'),
  phone: VALIDATION_ACCOUNT_TEL('body'),
  address: VALIDATION_STRING('body'),
};

export const LOGIN_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_EXIST('body'),
  password: VALIDATION_PASSWORD_CHECK('body', 'email'),
};

export const FORGOT_PASSWORD_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_EXIST('body'),
};

export const UPDATE_PASSWORD_SCHEMA: Schema = {
    password: VALIDATION_PASSWORD('body'),
};

export const REFRESH_TOKEN_SCHEMA: Schema = {
  refreshToken: VALIDATION_STRING('body'),
};
