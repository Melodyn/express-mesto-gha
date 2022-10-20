import { Router } from 'express';
import { login, register } from '../controllers/auth.js';
import {
  celebrateBodyUser,
  celebrateBodyAuth,
} from '../validators/users.js';

export const router = Router();

router.post('/signin', celebrateBodyAuth, login);
router.post('/signup', celebrateBodyUser, register);
