# Cadastro de Usuários (Node.js + MongoDB + jQuery)

### 🚀 Como Rodar

1. **Subir o Banco (Docker):**
   ```bash
   docker run -d --name mongodb_exercicio -p 27017:27017 -v mongo_data:/data/db mongo:latest
   ```
   *(Caso já tenha criado o container antes: `docker start mongodb_exercicio`)*

2. **Iniciar o Backend:**
   ```bash
   cd Back
   npm install
   npm start
   ```

3. **Abrir o Frontend:**
   Abra o arquivo `Front/index.html` no navegador.

---

### 🛑 Como Parar

- **Backend:** `Ctrl + C` no terminal.
- **Banco:** `docker stop mongodb_exercicio`
