import { Card } from '../models/cards.js';

const responseReadError = (res) => res.status(404).send({
  message: 'Запрашиваемая карточка не найдена'
});

export const read = (req, res) => {
  const { id } = req.params;
  const promise = id ? Card.findOne({ id }) : Card.find({});

  promise
    .then((card) => {
      if (card) {
        res.send(card);
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
  res.send('ok');
};

export const update = (req, res) => {
  res.send('ok');
};
