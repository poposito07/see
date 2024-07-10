import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

interface GameState {
    word: string;
    guesses: string[];
    maxAttempts: number;
    attemptsLeft: number;
    hint: string;
    message?: string; 
}

let gameState: GameState = {
    word: '',
    guesses: [],
    maxAttempts: 6,
    attemptsLeft: 6,
    hint: ''
};

const initializeGameState = () => {
    gameState = {
        word: '',
        guesses: [],
        maxAttempts: 6,
        attemptsLeft: 6,
        hint: '',
        message: undefined
    };
};

initializeGameState();

function sendGameState(res: Response) {
    res.write(`data: ${JSON.stringify(gameState)}\n\n`);
}

app.get('/game-events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    function sendInitialStateAndKeepAlive() {
        sendGameState(res);

        const intervalId = setInterval(() => {
            sendGameState(res);
        }, 5000);

        req.on('close', () => {
            clearInterval(intervalId);
            console.log('Cliente SSE desconectado.');
        });
    }

    sendInitialStateAndKeepAlive();
});

app.post('/set-word', (req: Request, res: Response) => {
    const { word, hint } = req.body;
    if (!word || typeof word !== 'string' || !hint || typeof hint !== 'string') {
        return res.status(400).json({ success: false, message: 'Ingrese una palabra y una pista válidas.' });
    }

    gameState.word = word.toLowerCase();
    gameState.hint = hint;
    gameState.guesses = [];
    gameState.attemptsLeft = gameState.maxAttempts;
    gameState.message = 'El juego ha comenzado.';

    res.status(200).json({ success: true, message: 'Palabra y pista configuradas correctamente.' });
});

app.post('/guess', (req: Request, res: Response) => {
    const { letter } = req.body;
    if (!letter || typeof letter !== 'string' || letter.length !== 1 || !letter.match(/[a-z]/i)) {
        return res.status(400).json({ error: 'Ingrese una letra válida.' });
    }

    const lowerCaseLetter = letter.toLowerCase();

    if (gameState.guesses.includes(lowerCaseLetter)) {
        return res.status(400).json({ error: 'Esta letra ya ha sido adivinada.' });
    }

    gameState.guesses.push(lowerCaseLetter);

    if (!gameState.word.includes(lowerCaseLetter)) {
        gameState.attemptsLeft--;
        gameState.message = 'Letra incorrecta.';
    } else {
        const remainingLetters = gameState.word.split('').filter(letter => !gameState.guesses.includes(letter));
        if (remainingLetters.length === 0) {
            gameState.message = '¡Felicidades! Has adivinado la palabra.';
            initializeGameState();
        } else {
            gameState.message = 'Letra correcta.';
        }
    }

    if (gameState.attemptsLeft === 0) {
        gameState.message = `¡Perdiste! La palabra era "${gameState.word}".`;
        initializeGameState();
    }

    res.status(200).json({ message: gameState.message });
});

app.get('/hint', (req: Request, res: Response) => {
    res.status(200).json({ hint: gameState.hint });
});

app.post('/reset', (req: Request, res: Response) => {
    initializeGameState();
    res.status(200).json({ message: 'Juego reiniciado correctamente.' });
});

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});