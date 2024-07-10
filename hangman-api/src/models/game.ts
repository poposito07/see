// src/models/game.ts
import { Schema, model, Document } from 'mongoose';

export interface Game extends Document {
  word: string;
  guesses: string;
  maxAttempts: number;
  attemptsLeft: number;
}

const gameSchema = new Schema<Game>({
  word: { type: String, required: true },
  guesses: { type: String, required: true },
  maxAttempts: { type: Number, required: true },
  attemptsLeft: { type: Number, required: true },
});

export default model<Game>('Game', gameSchema);
