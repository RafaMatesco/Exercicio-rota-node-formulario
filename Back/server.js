const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/exercicio_usuarios';


mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));


const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.get('/', (req, res) => {
    res.send('Servidor Online.');
});


app.post('/api/usuarios', async (req, res) => {
    try {
        const { nome } = req.body || {};
        console.log('Dados recebidos:', req.body);

        if (!nome || !nome.trim()) {
            return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
        }

        const novoUsuario = await Usuario.create({ nome: nome.trim() });
        res.status(201).json(novoUsuario);
    } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        res.status(500).json({ erro: 'Erro interno ao salvar no banco de dados.' });
    }
});


app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find().sort({ createdAt: -1 });
        res.status(200).json(usuarios);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ erro: 'Erro interno ao buscar usuários no banco de dados.' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
