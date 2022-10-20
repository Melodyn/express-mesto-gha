import { Router } from 'express';
import {
  read, create, update, remove,
} from '../controllers/cards.js';
import {
  celebrateBodyCard,
  celebrateParamsRouteId,
} from '../validators/cards.js';

export const router = Router();

router.get('/', read);
router.post('/', celebrateBodyCard, create);
router.put('/:id/likes', celebrateParamsRouteId, (req, ...other) => {
  req.params.isLike = true;
  update(req, ...other);
});
router.delete('/:id/likes', celebrateParamsRouteId, update);
router.delete('/:id', celebrateParamsRouteId, remove);
