import path from 'path';
import { constants } from 'http2';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import pino from 'pino-http';
// modules
import { HTTPError } from './errors/index.js';
// routes
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';
import { router as authRouter } from './routes/auth.js';
import { auth } from './middlewares/auth.js';

export const run = async (envName) => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;
  if (!config) {
    throw new Error('Config not found');
  }
  config.NODE_ENV = envName;

  const app = express();
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    level: config.LOG_LEVEL,
  });

  app.set('config', config);
  app.use(logger);
  app.use(bodyParser.json());

  app.use('/', authRouter);
  app.use('/users', auth, userRouter);
  app.use('/cards', auth, cardRouter);
  app.all('/*', (req, res) => {
    res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
  });
  app.use((err, req, res, next) => {
    const isHttpError = err instanceof HTTPError;
    const isValidatorError = err.name === 'CastError';

    req.log.debug(err);
    if (isHttpError) {
      res.status(err.statusCode).send({
        message: err.message,
      });
    }
    if (isValidatorError) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message: `Переданы некоректные данные. ${err.message}`,
      });
    }
    if (!(isHttpError || isValidatorError)) {
      res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({
        message: err.message || 'Неизвестная ошибка',
      });
    }
    next();
  });

  // ('mongodb://localhost:27017/mestodb')
  mongoose.set('runValidators', true);
  await mongoose.connect(config.DB_URL);
  const server = app.listen(config.PORT, config.HOST, () => {
    console.log(`Server run on http://${config.HOST}:${config.PORT}`);
  });

  const stop = async () => {
    await mongoose.connection.close();
    server.close();
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
