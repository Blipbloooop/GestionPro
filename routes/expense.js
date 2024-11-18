const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const User = require("../models/User");
const Group = require("../models/Group");
const Category = require("../models/Category");

// Route POST pour gérer la création d'une dépense
router.post("/dashboard/expense/", async (req, res) => {
  const { category, amount, description, groupId } = req.body;
  const userId = req.session.userId;
  try {
    // Verification des données reçu
    console.log("Données reçus : ", req.body);
    console.log("Session utilisateur :", req.session.userId);

    if (!req.session.userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const newExpense = new Expense({
      category: category,
      amount: amount,
      description: description,
      user: userId,
      group: groupId,
    });
    await newExpense.save();
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $push: { expenses: newExpense._id } },
      { new: true }
    );
    res.redirect("/dashboard/expense");
  } catch (error) {
    console.error("Erreur lors de la création de la dépense:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Route pour récupérer les catégories
router.get("/dashboard/expense", async (req, res) => {
  try {
    const categories = await Category.find({});
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect("/login");
    }

    // Récupérer les groupes auxquelles l'utilisateur appartient
    const groups = await Group.find({ users: userId });
    res.render("expense", { categories, groups });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catégories.",
      error: error.message,
    });
  }
});

module.exports = router;
