// src/controllers/gameController.ts
import { Request, Response } from 'express';
import Game from '../models/game';

export const getGame = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el juego' });
  }
};

export const createGame = async (req: Request, res: Response) => {
  const { word, maxAttempts } = req.body;
  const game = new Game({
    word,
    guesses: '',
    maxAttempts,
    attemptsLeft: maxAttempts,
  });

  try {
    const savedGame = await game.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el juego' });
  }
};

export const guessLetter = async (req: Request, res: Response) => {
  const { letter } = req.body;
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    game.guesses += letter.toLowerCase();
    game.attemptsLeft--;

    await game.save();

    res.json({ message: 'Letra adivinada correctamente', game });
  } catch (error) {
    res.status(500).json({ error: 'Error al adivinar la letra' });
  }
};
