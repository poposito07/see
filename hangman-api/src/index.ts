// src/index.ts
import express from 'express';
import { json } from 'body-parser';
import { getGame, createGame, guessLetter } from './controllers/gameController';
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

app.use(json());

// Permitir acceso desde cualquier origen (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rutas
app.get('/game/:id', getGame);
app.post('/game', createGame);
app.post('/game/:id/guess', guessLetter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
