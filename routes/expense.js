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

router.get("/dashboard/expense", async (req, res) => {
  try {
    const categories = await Category.find({});
    const userId = req.session.userId;
    const expenses = await Expense.find({ users: userId })
      .populate("category")
      .populate("group");
    const expenses_all = await Expense.find({});
    // Récupérer les groupes auxquelles l'utilisateur appartient
    const groups = await Group.find({ users: userId });
    if (!userId) {
      return res.redirect("/login");
    }
    if (userId === "6733ca5894cb83d9638ef56e") {
      res.render("expense_admin", {
        expenses_all,
        categories,
        groups: groups,
      });
    } else {
      res.render("expense", { expenses: expenses, categories, groups: groups });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catégories.",
      error: error.message,
    });
  }
});

// Route pour supprimer une dépense (réservé admin)
router.post("/dashboard/expense/delete", async (req, res) => {
  try {
    const userId = req.session.userId; // ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est authentifié
    if (!userId) {
      return res.status(401).send("Utilisateur non authentifié.");
    }

    const { expensesId } = req.params;
    const expenses = await Expense.find({ expenses: expensesId });

    // Supprimer les messages correspondant aux IDs fournis
    await Expense.deleteMany({});
    // Rediriger vers la page des groupes
    res.redirect("/dashboard/expense/");
  } catch (error) {
    console.error("Erreur lors du retrait du groupe :", error);
    res.status(500).send("Erreur serveur.");
  }
});
module.exports = router;
