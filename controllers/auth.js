import bcrypt from 'bcryptjs';
import { User } from '../models/users.js';
import { NotFoundError, BadRequestError } from '../errors/index.js';

const errorNotFound = new NotFoundError('Запрашиваемый пользователь не найден');

const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const login = (req, res, next) => {
  User.findOneAndValidatePassword(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(errorNotFound);
      }
    });
};

export const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((password) => {
      req.body.password = password;

      return User.create(req.body);
    })
    .then(({ _id, email }) => {
      res.send({ _id, email });
    })
    .catch((err) => {
      console.error(err);
      next(buildErrorBadRequest(err.message));
    });
};
