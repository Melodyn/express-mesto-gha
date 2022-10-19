import { User } from '../models/users.js';
import {
  HTTPError,
  BadRequestError,
  NotFoundError,
  ServerError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Запрашиваемый пользователь не найден');
const buildErrorServer = (message) => new ServerError(message);
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const readOne = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;

  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const readAll = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const create = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.send(user))
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

export const update = (req, res, next) => {
  const user = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, user, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        throw buildErrorBadRequest('Не удалось обновить пользователя');
      }
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
