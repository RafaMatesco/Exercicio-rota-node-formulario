const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

let usuarios = [];

app.get('/', (req, res) => {
    res.send('Servidor Online.');
});

app.post('/api/usuarios', (req, res) => {
    const { nome } = req.body || {};
    console.log('Dados recebidos:', req.body);

    if (!nome || !nome.trim()) {
        return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }

    const novoUsuario = { id: Date.now(), nome: nome.trim() };
    usuarios.push(novoUsuario);

    res.status(201).json(novoUsuario);
});

app.get('/api/usuarios', (req, res) => {
    res.status(200).json(usuarios);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
