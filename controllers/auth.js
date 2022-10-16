import bcrypt from 'bcryptjs';
import { User } from '../models/users.js';
import {
  HTTPError, NotFoundError, BadRequestError, ConflictError,
} from '../errors/index.js';

const errorNotFound = new NotFoundError('Запрашиваемый пользователь не найден');
const errorNotUnique = new ConflictError('Пользователь с такой почтой уже существует');

const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const login = (req, res, next) => {
  const user = new User(req.body);
  user.validate()
    .then(() => User.findOneAndValidatePassword(req.body))
    .then((userData) => res.send(userData))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(errorNotFound);
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
    .then(({ _id, email }) => res.send({ _id, email }))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === 11000) {
        next(errorNotUnique);
      } else {
        next(buildErrorBadRequest(err.message));
      }
    });
};
