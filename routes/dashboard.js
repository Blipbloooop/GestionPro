const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const User = require("../models/User");

router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.session.userId;
    const userGroups = await Group.find({ users: userId });
    const userExpenses = await Expense.find({ user: userId }).populate("group");

    if (!userId) {
      return res.redirect("/login");
    }

    res.render("dashboard", {
      groups: userGroups,
      expenses: userExpenses,
    });
  } catch (error) {
    console.error("Erreur lors du chargement du tableau de bord :", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

module.exports = router;
