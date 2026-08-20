const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Servidor Online.');
});

let usuario = {}
app.post('/api/usuarios', (req, res) => {
    const { nome } = req.body
    if (!nome) {
        return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' })
    }
    const novoUsuario = { id: Date.now(), nome }
    if (novoUsuario) {
        usuario = novoUsuario
        res.status(201).json(novoUsuario)
    }
});

app.get('/api/usuarios', (req, res) => {
    if (usuario) {
        res.status(200).json(usuario)
    }
});


