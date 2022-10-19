import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import {
  HTTPError,
  BadRequestError,
  ConflictError,
  ServerError,
} from '../errors/index.js';

const buildErrorServer = (message) => new ServerError(message);
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const login = (req, res, next) => {
  const user = new User(req.body);
  user.validate()
    .then(() => User.findOneAndValidatePassword(req.body))
    .then((userData) => {
      const { JWT_SALT } = req.app.get('config');
      const token = jwt.sign({ _id: userData._id }, JWT_SALT, { expiresIn: '1h' });
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const register = (req, res, next) => {
  const user = new User(req.body);
  user.validate()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((hash) => {
      req.body.password = hash;

      return User.create(req.body);
    })
    .then(({ _id, email }) => res.send({ ...user, _id, email }))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === 11000) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};
