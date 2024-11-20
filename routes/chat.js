const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");

// Route pour récupérer les messages d'un groupe
router.post("/dashboard/notifications/", async (req, res) => {
  try {
    const { content } = req.body;
    if (!req.session.userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const newMessage = new Message({
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

router.get("/dashboard/notifications/", async (req, res) => {
  try {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }
    const { messagesId } = req.params;
    const messages = await Message.find({ messages: messagesId })
      .populate("user", "nom prenom")
      .sort({ createdAt: 1 }); // Tri par ordre croissant de date
    if (user === "6733ca5894cb83d9638ef56e") {
      res.render("chat_admin", { messages });
    } else {
      res.render("notifications", { messages });
    }
    // Envoyer les groupes à la vue
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Routes pour supprimer les messages (réserver admin)
router.post("/dashboard/notifications/delete", async (req, res) => {
  try {
    const userId = req.session.userId; // ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est authentifié
    if (!userId) {
      return res.status(401).send("Utilisateur non authentifié.");
    }

    const { messagesId } = req.params;
    const messages = await Message.find({ messages: messagesId });

    // Supprimer les messages correspondant aux IDs fournis
    await Message.deleteMany({});
    // Rediriger vers la page des groupes
    res.redirect("/dashboard/notifications/");
  } catch (error) {
    console.error("Erreur lors du retrait du groupe :", error);
    res.status(500).send("Erreur serveur.");
  }
});

module.exports = router;
