const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const Message = require("../models/Message");

// Création d'un groupe
router.post("/dashboard/group", async (req, res) => {
  const { name, members } = req.body;
  try {
    // Convertir les emails en tableau
    const memberEmails = JSON.parse(members);

    // Trouver les users correspondants dans la BDD
    const users = await User.find({ email: { $in: memberEmails } });

    // Vérifie si les membres du groupe ont un compte
    if (users.lenght !== memberEmails.lenght) {
      return res.status(400).json({
        error:
          "Certains utlisateurs sont introuvables dans la base de données.",
      });
    }

    // Créer le groupe
    const newGroup = new Group({
      name: name,
      users: users.map((user) => user._id),
    });

    await newGroup.save();
    res.redirect("/dashboard/group");
  } catch (error) {
    console.error("Erreur lors de la création du groupe :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

router.get("/dashboard/group/", async (req, res) => {
  try {
    // Récupérer les groupes avec utilisateurs et dépenses
    const groups = await Group.find()
      .populate("users", "nom prenom") // Inclure les utilisateurs
      .populate("expenses");

    // Récuperer les messages d'un groupe
    const { groupId } = req.params;

    // Vérifie si l'utilisateur fait partie d'un groupe
    //const group = await Group.findById(groupId).populate("users");
    // if(!group.users.some((user) => user.equals(req.session.userId))) {

    // }
    res.render("group", { groups }); // Envoyer les groupes à la vue
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

module.exports = router;
