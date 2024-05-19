import dotenv from 'dotenv';
dotenv.config();
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as functions from 'firebase-functions/v1';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerComponents } from './components';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

const COOKIE_SECRET = process.env.COOKIE_SECRET as string;

app.use(cors());
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Willeder Backend Interview',
            version: '1.0.0',
            description: 'Documentation for your APIs',
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
          security: [{ bearerAuth: [] }],
        servers: [
            {
                url: 'http://127.0.0.1:5001/backend-task-willeder/asia-northeast1/api/'
            }
        ],
    },
    apis: ['./src/components/api/**/*.ts'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


registerComponents(app);

errorHandler(app);

module.exports.api = functions.region('asia-northeast1').https.onRequest(app);
