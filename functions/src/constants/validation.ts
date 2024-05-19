import { ParamSchema, Location } from 'express-validator';

export const VALIDATION_STRING = (where: Location): ParamSchema => ({
  in: [where],
  isString: {
    errorMessage: 'Must be a string',
  },
  notEmpty: {
    errorMessage: 'Must not be empty',
  },
});

export const VALIDATION_EMAIL_NOT_EXIST = (where: Location): ParamSchema => ({
  in: [where],
  isEmail: {
    errorMessage: 'Must be a valid email address',
  },
  optional: true,
});

export const VALIDATION_PASSWORD = (where: Location): ParamSchema => ({
  in: [where],
  isString: {
    errorMessage: 'Must be a string',
  },
  notEmpty: {
    errorMessage: 'Password must not be empty',
  },
});

export const VALIDATION_ACCOUNT_TEL = (where: Location): ParamSchema => ({
  in: [where],
  notEmpty: {
    errorMessage: 'Phone number must not be empty',
  },
  isMobilePhone: {
    options: ['any'],
    errorMessage: 'Must be a valid mobile phone number',
  },
});

export const VALIDATION_EMAIL_EXIST = (where: Location): ParamSchema => ({
  in: [where],
  isEmail: {
    errorMessage: 'Must be a valid email address',
  },
  notEmpty: {
    errorMessage: 'Email must not be empty',
  },
});

export const VALIDATION_PASSWORD_CHECK = (where: Location, email: string): ParamSchema => ({
  in: [where],
  isString: {
    errorMessage: 'Must be a string',
  },
  notEmpty: {
    errorMessage: 'Password must not be empty',
  },
});

export const VALIDATION_TOKEN = (where: Location): ParamSchema => ({
  in: [where],
  notEmpty: {
    errorMessage: 'Token must not be empty',
  },
});
