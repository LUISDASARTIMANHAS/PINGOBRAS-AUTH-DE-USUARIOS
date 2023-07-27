const express = require("express");
const app = express();
const port = 3000;
const rotas = require("./rotas");
// const autenticacao = require("./auth");

app.use(rotas);
// app.use(autenticacao);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
