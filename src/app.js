const express = require("express");
const path = require("path");
const app = express();
const router = express.Router();
const session = require("express-session");

// Middleware pour parser les données de type x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser les données de type JSON

// MongoDB
require("./db");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Config express-session
app.use(
  session({
    secret: "ton_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.set("view engine", "pug");
app.set("views", "../views");

// Authentification
const userRoutes = require("../routes/user");
app.use(userRoutes);

// Création d'une dépense
const expenseRoutes = require("../routes/expense");
app.use(expenseRoutes);

// Création d'un groupe
const groupRoutes = require("../routes/group");
app.use(groupRoutes);

// Création + affichage des messages + page notifications
const chatRoutes = require("../routes/chat");
app.use(chatRoutes);

// Tableau de bord
const dashboardRoutes = require("../routes/dashboard");
app.use(dashboardRoutes);

// Conflit MIME
const mime = require("mime");
app.use(
  "/public",
  express.static("public", {
    setHeaders: (res, path) => {
      const type = mime.getType(path);
      res.setHeader("Content-Type", type);
    },
  })
);

// Application non inscrit :
app.get("/", (req, res) => {
  res.render("layout", {
    title: "Landing page",
    message: "Bienvenue sur GestionPro",
  });
});

app.get("/login", (req, res) => {
  res.render("login"),
    {
      titre: "Page de connexion",
      message: "Bienvenue sur la page de connexion",
    };
});

app.get("/signup", (req, res) => {
  res.render("signup"), { title: "Page d'inscription" };
});

app.get("/about", (req, res) => {
  res.render("about"), { title: "A propos de nous" };
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
