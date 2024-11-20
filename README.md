# GestionPro

# Gestionnaire de Budget Collaboratif

Ce projet est une application web collaborative de gestion de budget. Elle permet aux utilisateurs de créer des groupes, d’ajouter des dépenses partagées. Le projet inclut également un système de chat et une fonctionnalité pour quitter les groupes. L’application est développée en Node.js, avec Express, MongoDB, et utilise TailwindCSS pour le design.

# Structure du Projet

Architecture

Le projet suit une structure MVC (Model-View-Controller) classique, divisée en trois parties principales :

	•	Modèles (Models) : Définition des schémas de base de données avec Mongoose pour MongoDB.
	•	User : Stocke les informations des utilisateurs.
	•	Group : Contient les groupes avec les utilisateurs et leurs dépenses.
	•	Message : Gère les notifications liées aux groupes et aux dépenses.
 	 •	Expense : Gère les dépenses liées aux groupes et aux utilisateurs.
 	 •	Category : Intègre directement en BDD des catégories prédéfini pour la création d'une dépense.
	•	Vues (Views) : Géré avec Pug pour générer les pages HTML dynamiques.
	•	Contrôleurs (Routes) : Implémentation des routes pour gérer les actions utilisateur (création de groupe, ajout de dépenses, suppression de messages, etc.).

 Technologies

	•	Backend : Node.js, Express.js
	•	Base de données : MongoDB (via Mongoose)
	•	Frontend : Pug (templates HTML) et TailwindCSS (design)
	•	Gestion des dépendances : npm
	•	Authentification : Basée sur la session avec express-session.

Fichiers et Dossiers

	•	/models : Contient les schémas Mongoose (User, Group, Message).
	•	/routes : Gère les différentes routes de l’application (dashboard, notifications, groupes).
	•	/views : Fichiers Pug pour les interfaces utilisateurs.
	•	/public : Fichiers statiques (CSS, JS personnalisés, etc.).
	•	/app.js : Point d’entrée de l’application, contenant la configuration principale.
	•	db.js : Initialise la connection à la BDD et insère dedans les categories.

 # Installation

	1 - Ne pas utliser le wifi "eduroam" car ce dernier bloque la connection à la BDD
	2 - Se placer à la racine du projet
	3 - Lancer la commande "npm install --force"
	4 - Lancer le serveur : "node src/app.js"
	5 - Ouvrir le navigateur et rentrer l'URL : http://127.0.0.1:3000/
	6 - Vous pouvez vous connecter avec le compte administrateur avec les identifiants suivant : 
	email : admin@gestionpro.com
	password : admin
 Pour la création des comptes, vous pouvez uniquement créer des comptes ayant comme role "user" par mesures de sécurité.

# Fonctionnalités

	•	Création de groupes : Ajoutez des utilisateurs par email, et créez un groupe pour partager des dépenses. Attention vous ne pouvez appartenir qu'a un seul groupe sinon cela crée des erreurs non gérées
	•	Ajout de dépenses : Gérez des dépenses associées à un groupe.
	•	Chat : Vous pou.
	•	Quitter un groupe : Option pour supprimer un utilisateur d’un groupe.
	•	Suppression de messages : Supprimez toutes les notifications en une seule action.
 	•	Compte administrateur : suppression de tous les groupes, dépenses et chat
  	•	Compte utilisateur : Créer un groupe, créer une dépense, envoyer un message et quitter un groupe.
   
# Choix de conception

	1.	Backend
		•	Utilisation de MongoDB pour sa flexibilité avec les données imbriquées.
		•	Routes RESTful bien définies pour des opérations CRUD claires.
	2.	Frontend
		•	Pug a été choisi pour générer des vues dynamiques côté serveur, simplifiant la gestion des données utilisateur.
		•	TailwindCSS a été utilisé pour son efficacité dans le design avec des classes utilitaires.
	3.	Gestion des sessions
	•	Authentification basée sur les sessions via express-session, simple à mettre en place pour ce projet.


 
