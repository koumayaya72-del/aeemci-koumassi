# Guide de Déploiement et Sécurité du CMS Privé — AEEMCI Koumassi

Ce guide explique comment activer l'authentification sécurisée privée via **Netlify Identity & Git Gateway** pour que seul l'administrateur du Sous-Comité puisse se connecter à l'URL `/admin` et modifier le site sans toucher au code.

---

## 🔒 ÉTAPE 1 : Hébergement sur Netlify (Gratuit & Rapide)
1. Publiez votre dépôt Git (GitHub ou GitLab) contenant ce projet.
2. Rendez-vous sur [Netlify.com](https://www.netlify.com) et connectez votre dépôt `AEEMCI`.

---

## 🔑 ÉTAPE 2 : Activation de Netlify Identity (Authentification Privée)
1. Dans votre tableau de bord Netlify, allez dans **Site configuration > Identity**.
2. Cliquez sur **Enable Identity**.
3. Dans la section **Registration preferences**, sélectionnez **Invite only** (Ceci empêche tout visiteur public de créer un compte).
4. Cliquez sur **Invite users** et entrez votre propre adresse e-mail administrateur. Vous recevrez un lien d'activation sécurisé par e-mail.

---

## 🛠️ ÉTAPE 3 : Activation de Git Gateway
1. Dans Netlify, allez dans **Site configuration > Identity > Services**.
2. Cliquez sur **Enable Git Gateway**.
3. Associez votre compte GitHub/GitLab pour autoriser le CMS à sauvegarder directement les modifications et les images téléversées dans votre projet.

---

## 🚀 ÉTAPE 4 : Connexion à votre Panneau d'Administration
1. Rendez-vous sur l'adresse privée de votre site : `https://votre-site.netlify.app/admin/`.
2. Connectez-vous avec vos identifiants administrateur.
3. Vous pouvez désormais ajouter des actualités, modifier les événements, changer les photos et la bannière sans toucher une seule ligne de code HTML !
