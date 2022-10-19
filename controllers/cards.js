import { Card } from '../models/cards.js';
import {
  HTTPError,
  BadRequestError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '../errors/index.js';

const buildErrorServer = (message) => new ServerError(message);
const notFoundError = new NotFoundError('Запрашиваемая карточка не найдена');
const unauthorizedError = new UnauthorizedError('Это действие выполнить можно только со своими карточками');
const buildErrorBadRequest = (message) => new BadRequestError(`Некорректные данные для карточки. ${message}`);

export const read = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
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
  const { name, link } = req.body;
  const card = { name, link, owner: req.user._id };

  Card.create(card)
    .then((newCard) => {
      res.send(newCard);
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
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(buildErrorBadRequest(err.message));
      } else {
        next(buildErrorServer(err.message));
      }
    });
};

export const remove = (req, res, next) => {
  Card.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw unauthorizedError;
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
