import { Router } from 'express';
import { login, register } from '../controllers/auth.js';
import {
  celebrateBodyAuth,
} from '../validators/user.js';

export const router = Router();

router.post('/signin', celebrateBodyAuth, login);
router.post('/signup', celebrateBodyAuth, register);
