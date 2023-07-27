const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const files = __dirname + "/src/";
const path_pages = files + "pages";
const path_css = files + "css";
const path_js = files + "js";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const loginFilePath = path.join(path_pages, "index.html");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static(path_css, { type: "text/css" }));
router.use(express.static(path_js, { type: "text/javascript" }));
router.use(express.static(path_pages));

const db = JSON.parse(fs.readFileSync("src/data/db.json"));

router.get("/forbidden", (req, res) => {
  res.sendFile(forbiddenFilePath);
});
router.get("/data", (req, res) => {
  fs.readFile("src/data/db.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao ler o arquivo de db.");
    }
    console.log("SISTEMA <OBTER>: " + req.url);
    const db = JSON.parse(data);
    res.json(db);
  });
});

router.get("/logout", (req, res) => {
  res.sendFile(loginFilePath);
});

// ...
// RECEBER ENVIOS DO CLIENTE

router.post("/login", (req, res) => {
  console.log("SISTEMA <ENVIAR>: " + req.url);
  const { usuario, senha } = req.body;
  const userToken = generateServerToken();

  if (usuario == "" && senha == "") {
    console.log("login efetuado!");
    res.json({ redirectUrl: "/db" });
  } else {
    res.status(401).send("Credenciais inválidas");
    console.log("Credenciais inválidas!");
  }
});

router.post("/add", (req, res) => {
  console.log("SISTEMA <ENVIAR>: " + req.url);

  fs.readFile(
    path.join(__dirname, "src", "data", "db.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao ler o arquivo de db.");
      }

      const db = JSON.parse(data);
      db.push({ disciplina });

      fs.writeFile(
        path.join(__dirname, "src", "data", "db.json"),
        JSON.stringify(db, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("Erro ao atualizar o arquivo de db.");
          }

          res.sendStatus(200);
        }
      );
    }
  );
});

router.post("/atualizar", (req, res) => {
  console.log("SISTEMA <ENVIAR>: " + req.url);
  
  fs.readFile(
    path.join(__dirname, "src", "data", "db.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao ler o arquivo de db.");
      }

      const db = JSON.parse(data);

      fs.writeFile(
        path.join(__dirname, "src", "data", "db.json"),
        JSON.stringify(db, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("Erro ao atualizar o arquivo de db.");
          }

          res.sendStatus(200);
        }
      );
    }
  );
});

// Função auxiliar para comparar strings sem distinção entre maiúsculas e minúsculas
function compareStrings(str1, str2) {
  return str1.localeCompare(str2, undefined, { sensitivity: "accent" }) === 0;
}

function generateServerToken() {
  const random = Math.random() * 255 * 255 * 255;
  const strRandom = random.toString(10);
  const serverToken = Math.floor(strRandom);
  const serverTokenData = { userID: serverToken };

  // Grava o token em um arquivo JSON
  fs.writeFileSync(tokenFilePath, JSON.stringify(serverTokenData));
  return serverToken;
}

module.exports = router;
