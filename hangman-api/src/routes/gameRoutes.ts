import { Router } from 'express';
import { getGame, createGame, guessLetter } from '../controllers/gameController';

const router = Router();

router.get('/games/:id', getGame);
router.post('/games', createGame);
router.post('/games/:id/guess', guessLetter);

export default router;
