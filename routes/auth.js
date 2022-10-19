import { Router } from 'express';
import { celebrate } from 'celebrate';
import { login, register } from '../controllers/auth.js';
import {
  segmentBodyAuth,
} from '../validators/user.js';

export const router = Router();

const middleware = celebrate(segmentBodyAuth);

router.post('/signin', middleware, login);
router.post('/signup', middleware, register);
