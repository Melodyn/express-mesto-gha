import { HTTPError, NotFoundError, BadRequestError } from '../errors/index.js';
import { User } from '../models/users.js';

const notFoundError = new NotFoundError('Запрашиваемый пользователь не найден');

const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для пользователя. ${message}`);

export const read = (req, res, next) => {
  const id = (req.params.id === 'me') ? req.user._id : req.params.id;
  const promise = id ? User.findById(id) : User.find({});

  promise
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
        next(buildErrorBadRequest(res, err.message));
      } else {
        next(notFoundError);
      }
    });
};

export const create = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(buildErrorBadRequest(err.message));
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
      } else {
        next(buildErrorBadRequest(err.message));
      }
    });
};
