const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Route POST pour gérer la création de l'utilisateur
router.post("/signup", async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  try {
    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Cet utilisateur existe déjà.");
    }

    // Hachage du mot de passe
    const salt = 10;
    const hashedPassword = await bcrypt.hashSync(password, salt);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      nom: nom,
      prenom: prenom,
      email: email,
      password: hashedPassword,
      role: "user",
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await newUser.save();

    // Redirection vers le tableau de bord ou la page de connexion
    res.redirect("/login");
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).send("Une erreur est survenue");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    // Comparaison du mot de passe avec le mot de passe haché en BDD
    console.time("Password Compare");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.timeEnd("Password Compare");

    console.time("Login process");
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect." });
    }
    req.session.userId = user._id;
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});
module.exports = router;
