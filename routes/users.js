import { Router } from 'express';
import {
  readAll, readOne, create, updateInfo, updateAvatar,
} from '../controllers/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', readOne);
router.post('/', create);
router.patch('/me', updateInfo);
router.patch('/me/avatar', updateAvatar);
