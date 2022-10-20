import { Router } from 'express';
import {
  readOne,
  readAll,
  update,
} from '../controllers/users.js';
import {
  celebrateBodyAvatar,
  celebrateBodyProfile,
  celebrateParamsRouteMe,
} from '../validators/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', celebrateParamsRouteMe, readOne);
router.patch('/me', celebrateBodyProfile, update);
router.patch('/me/avatar', celebrateBodyAvatar, update);
