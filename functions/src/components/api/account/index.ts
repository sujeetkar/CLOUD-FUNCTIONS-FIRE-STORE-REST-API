import express from 'express';
import { checkSchema } from 'express-validator';

import { ACCOUNT_PASSWORD_SCHEMA, ACCOUNT_SCHEMA } from './account.validation';

import * as controller from './account.controller';
import { checkValidation } from '../../../utils/validation';
import { isAuth } from '../../../utils/auth';

const router = express.Router();

/**
 * @swagger
 * /account:
 *   put:
 *     summary: Update account information
 *     tags: [Account]
 *     description: Update the account information for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: Account information updated successfully
 *       '400':
 *         description: Bad request or validation error
 *       '500':
 *         description: Internal server error
 */
router.put('', checkSchema(ACCOUNT_SCHEMA), checkValidation, isAuth, controller.updateAccount);

/**
 * @swagger
 * /account/password:
 *   put:
 *     summary: Update account password
 *     tags: [Account]
 *     description: Update the password for the authenticated user's account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordUpdateRequest'
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '400':
 *         description: Bad request or validation error
 *       '500':
 *         description: Internal server error
 */
router.put('/password', checkSchema(ACCOUNT_PASSWORD_SCHEMA), checkValidation, controller.updatePassword);

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get account information
 *     tags: [Account]
 *     description: Get the account information for the authenticated user.
 *     responses:
 *       '200':
 *         description: Account information retrieved successfully
 *       '500':
 *         description: Internal server error
 */
router.get('', isAuth, controller.getAccountInfo);

export default router;
