import mongoose from 'mongoose';

const { Schema } = mongoose;

const urlRegex = /^http[s]*:\/\/.+$/;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegex.test(value),
      message: () => 'Ссылка должна быть http(s)-URL',
    },
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [{ type: Schema.ObjectId, ref: 'User' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export const Card = mongoose.model('Card', schema);
