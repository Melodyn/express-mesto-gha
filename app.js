import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
// routes
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';

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

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    req.user = {
      _id: '5d8b8592978f8bd833ca8133',
    };

    if (req.headers['User-ID'] || req.headers['user-id']) {
      req.user._id = req.headers['User-ID'] || req.headers['user-id'];
    }

    next();
  });
  app.use('/users', userRouter);
  app.use('/cards', cardRouter);

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
