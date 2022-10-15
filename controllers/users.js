import { User } from '../models/users.js';

const responseReadError = (res) => res.status(404).send({
  message: 'Запрашиваемый пользователь не найден'
});

const responseUpdateError = (res, message) => res.status(400).send({
  message: `Некорректные данные для пользователя. ${message}`
});

export const read = (req, res) => {
  const { id } = req.params;
  const promise = id ? User.findOne({ id }) : User.find({});

  promise
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        responseReadError(res);
      }
    })
    .catch((err) => {
      console.error(err);
      responseReadError(res);
    })
};

export const create = (req, res) => {
  const user = req.body;

  User.create(user)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      responseUpdateError(res, err.message);
    });
};

export const update = (req, res) => {
  const user = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, user, { new: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        responseReadError(res);
      }
    })
    .catch((err) => {
      console.error(err);
      responseUpdateError(res, err.message);
    });
};
