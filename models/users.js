import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/index.js';

const { Schema } = mongoose;

const urlRegex = /^http[s]*:\/\/.+$/;
const emailRegex = /^.+@.+$/;

const schema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Аватар должен быть http(s)-URL',
    },
  },
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
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
            throw new UnauthorizedError('Пользователь с такими данными не найден');
          }

          return bcrypt.compare(password, user.password)
            .then((isSuccess) => {
              if (!isSuccess) {
                throw new UnauthorizedError('Неправильный логин или пароль');
              }
              const { password: removed, ...fields } = user.toObject();
              return fields;
            });
        });
    },
  },
});

export const User = mongoose.model('User', schema);
