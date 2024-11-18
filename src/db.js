const mongoose = require("mongoose");
const Category = require("../models/Category");
const categories = [
  { id: 1, name: "Transport" },
  { id: 2, name: "Alimentation" },
  { id: 3, name: "Divertissement" },
  { id: 4, name: "Santé" },
  { id: 5, name: "Logement" },
  { id: 6, name: "Autres" },
];

mongoose
  .connect(
    "mongodb+srv://root:root@cluster.uat2o.mongodb.net/gestionpro?retryWrites=true&w=majority&appName=Cluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    console.log("Connexion à MongoDB réussie.");
    // Supprimez les anciennes données pour éviter les doublons
    await Category.deleteMany({});
    // Insérez les nouvelles données
    await Category.insertMany(categories);
    console.log("Catégories insérées avec succès.");
  })
  .catch((err) => console.error("Erreur de connexion : ", err));
