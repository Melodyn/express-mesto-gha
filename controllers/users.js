import { constants } from 'http2';
import { User } from '../models/users.js';

const responseReadError = (res) => res.status(constants.HTTP_STATUS_NOT_FOUND).send({
  message: 'Запрашиваемый пользователь не найден',
});

const responseUpdateError = (res, message) => res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
  message: `Некорректные данные для пользователя. ${message}`,
});

const responseServerError = (res, message) => res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
  message: `На сервере произошла ошибка. ${message}`,
});

export const readOne = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        responseReadError(res);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseUpdateError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const readAll = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseUpdateError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const create = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        responseUpdateError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        responseReadError(res);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        responseUpdateError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

export const updateInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        responseReadError(res);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        responseUpdateError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};
