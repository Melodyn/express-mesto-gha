import { Router } from 'express';
import {
  readOne,
  readAll,
  update,
} from '../controllers/users.js';
import {
  celebrateParamsRouteMe,
  celebrateBodyAvatarRequired,
  celebrateBodyProfileRequired,
} from '../validators/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', celebrateParamsRouteMe, readOne);
router.patch('/me', celebrateBodyProfileRequired, update);
router.patch('/me/avatar', celebrateBodyAvatarRequired, update);
