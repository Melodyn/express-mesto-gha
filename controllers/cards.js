import { Card } from '../models/cards.js';
import { HTTPError, BadRequestError, NotFoundError } from '../errors/index.js';

const notFoundError = new NotFoundError('Запрашиваемая карточка не найдена');

const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для карточки. ${message}`);

// TODO перепроверить обработку ошибок

export const read = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send(cards);
      } else {
        throw notFoundError;
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

export const create = (req, res, next) => {
  const { name, link } = req.body;
  const card = { name, link, owner: req.user._id };

  Card.create(card)
    .then((newCard) => {
      if (newCard) {
        res.send(newCard);
      } else {
        throw notFoundError;
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

export const update = (req, res, next) => {
  const { id, isLike = false } = req.params;
  const userId = req.user._id;
  const updateParams = isLike
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };

  Card.findByIdAndUpdate(id, updateParams, { new: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw notFoundError;
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

export const remove = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndDelete(id)
    .then((card) => {
      console.log('card', card);
      if (card) {
        res.send(card);
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
        next(notFoundError);
      }
    });
};
