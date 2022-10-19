import { Router } from 'express';
import {
  readOne,
  readAll,
  create,
  update,
} from '../controllers/users.js';
import {
  celebrateBodyUser,
  celebrateBodyAvatar,
  celebrateBodyProfile,
} from '../validators/user.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', readOne);
router.post('/', celebrateBodyUser, create);
router.patch('/me', celebrateBodyProfile, update);
router.patch('/me/avatar', celebrateBodyAvatar, update);
