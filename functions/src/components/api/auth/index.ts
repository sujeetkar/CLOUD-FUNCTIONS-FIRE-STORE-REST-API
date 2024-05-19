import express from 'express';
import { checkSchema } from 'express-validator';
import {
  FORGOT_PASSWORD_SCHEMA,
  LOGIN_SCHEMA,
  REFRESH_TOKEN_SCHEMA,
  REGISTER_SCHEMA,
  UPDATE_PASSWORD_SCHEMA,
} from './auth.validation';
import * as controller from './auth.controller';
import { checkValidation } from '../../../utils/validation';
import { isAuth } from '../../../utils/auth';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', checkSchema(REGISTER_SCHEMA), checkValidation, controller.register);

/**
 * @swagger
 * /auth/login:
 *   put:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.put('/login', checkSchema(LOGIN_SCHEMA), checkValidation, controller.login);

/**
 * @swagger
 * /auth/logout:
 *   put:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/logout', isAuth, controller.logout);

/**
 * @swagger
 * /auth/password/forgot:
 *   put:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent for password reset
 *       400:
 *         description: Bad request
 */
router.put('/password/forgot', checkSchema(FORGOT_PASSWORD_SCHEMA), checkValidation, controller.forgotPassword);

/**
 * @swagger
 * /auth/password/reset:
 *   put:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.put('/password/reset', checkSchema(UPDATE_PASSWORD_SCHEMA), checkValidation, controller.updatePassword);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       400:
 *         description: Bad request
 */
router.post('/refresh', checkSchema(REFRESH_TOKEN_SCHEMA), checkValidation, controller.refresh);

export default router;
