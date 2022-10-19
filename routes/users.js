import { Router } from 'express';
import {
  readOne, readAll, create, update,
} from '../controllers/users.js';

export const router = Router();

router.get('/', readAll);
router.get('/:id', readOne);
router.post('/', create);
router.patch('/me', update);
router.patch('/me/avatar', update);
