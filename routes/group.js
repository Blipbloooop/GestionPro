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

// Routes pour quitter un groupe
router.post("/dashboard/group/leave", async (req, res) => {
  try {
    const userId = req.session.userId; // Utilisateur connecté
    // Retirer l'utilisateur du groupe
    const groups = await Group.find({ users: userId });
    if (!groups) {
      return res.status(404).send("Groupe non trouvé.");
    }
    for (const group of groups) {
      group.users = group.users.filter(
        (id) => id.toString() !== userId.toString()
      );
      await group.save(); // Sauvegarder les changements pour chaque groupe
    }
    // Rediriger vers la page des groupes
    res.redirect("/dashboard/group/");
  } catch (error) {
    console.error("Erreur lors du retrait du groupe :", error);
    res.status(500).send("Erreur serveur.");
  }
});

router.get("/dashboard/group/", async (req, res) => {
  try {
    // Récupérer les groupes avec utilisateurs et dépenses
    const userId = req.session.userId;
    const groups = await Group.find({ users: userId })
      .populate("users", "nom prenom") // Inclure les utilisateurs
      .populate("expenses");
    const groups_all = await Group.find({});

    if (!userId) {
      return res.redirect("/login");
    }
    if (userId === "6733ca5894cb83d9638ef56e") {
      res.render("group_admin", { groups_all });
    } else {
      res.render("group", { groups });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Routes pour supprimer tous les groupes (reservé admin)
router.post("/dashboard/group/delete", async (req, res) => {
  try {
    const userId = req.session.userId; // ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est authentifié
    if (!userId) {
      return res.status(401).send("Utilisateur non authentifié.");
    }

    const { groupsId } = req.params;
    const groups = await Group.find({ groups: groupsId });

    // Supprimer les messages correspondant aux IDs fournis
    await Group.deleteMany({});
    // Rediriger vers la page des groupes
    res.redirect("/dashboard/group/");
  } catch (error) {
    console.error("Erreur lors du retrait du groupe :", error);
    res.status(500).send("Erreur serveur.");
  }
});
module.exports = router;
