import { Router } from 'express';
import { read, create, update } from '../controllers/cards.js';

export const router = Router();

router.get('/', read);
router.post('/', create);
router.patch('/', update);
