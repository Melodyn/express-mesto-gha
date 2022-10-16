import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { NotFoundError, BadRequestError } from '../errors/index.js';

const { Schema } = mongoose;

const urlRegex = /^http[s]*:\/\/.+$'/;
const emailRegex = /^.+@.+$/;

const schema = new Schema({
  name: {
    type: String,
    default: 'Меместо',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Место ваших мемов',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://memepedia.ru/wp-content/uploads/2017/08/1492860042_e-news.su_ohuitelnye-istorii.gif',
    required: true,
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Аватар должен быть http(s)-URL',
    },
  },
  email: {
    type: String,
    required: true,
    minLength: 3,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: () => 'Почта должна быть вида a@b.c',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
}, {
  versionKey: false,
  statics: {
    findOneAndValidatePassword({ password, ...where }) {
      return this.findOne(where)
        .select('+password')
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Пользователь с такими данными не найден');
          }

          return bcrypt.compare(password, user.password)
            .then((isSuccess) => {
              if (!isSuccess) {
                throw new BadRequestError('Неправильный логин или пароль');
              }
              return user;
            });
        });
    },
  },
});

export const User = mongoose.model('User', schema);
