import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, { versionKey: false });

export const Card = mongoose.model('Card', schema);
