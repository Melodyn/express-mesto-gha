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
  celebrateParamsRouteMe,
} from '../validators/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', celebrateParamsRouteMe, readOne);
router.post('/', celebrateBodyUser, create);
router.patch('/me', celebrateBodyProfile, update);
router.patch('/me/avatar', celebrateBodyAvatar, update);
