const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Group = require("../models/Group");

// Route pour récupérer les messages d'un groupe
router.post("/dashboard/notifications/:groupId/messages", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    // Vérifie si l'utilisateur fait partie d'un groupe
    const group = await Group.findById(groupId).populate("users");
    if (!group.users.some((user) => user.equals(req.session.userId))) {
      return res
        .status(403)
        .json({ error: "Vous ne faites pas partie d'un groupe" });
    }

    const newMessage = new Message({
      group: groupId,
      user: req.session.userId,
      content: content,
    });

    await newMessage.save();
    res.redirect("/dashboard/group");
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.get("/dashboard/notifications/:groupId", async (req, res) => {
  try {
    const groups = await Group.find().populate("users", "nom prenom");

    const { groupId } = req.params;

    // Vérifie si l'utilisateur fait partie d'un groupe
    //const group = await Group.findById(groupId).populate("users");
    // if(!group.users.some((user) => user.equals(req.session.userId))) {

    // }

    const messages = await Message.find({ group: groupId })
      .populate("user", "nom prenom")
      .sort({ createdAt: 1 }); // Tri par ordre croissant de date
    res.render("notifications", { groups, messages }); // Envoyer les groupes à la vue
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

module.exports = router;
