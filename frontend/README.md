StudySpace

Description du projet :
StudySpace est une application web de gestion des travaux et des échéances scolaires, réalisée dans le cadre du cours.

L'application permet aux étudiants de gérer leurs travaux, de consulter leurs dates de remise et de suivre leurs tâches scolaires. Elle permet notamment d'ajouter, de consulter et de supprimer des travaux.

Le projet est développé avec React, JavaScript, CSS, Node.js et Express. Les données sont stockées dans un fichier JSON et échangées entre le frontend et le backend à l'aide d'une API.


Code – Pourcentage d'écriture :
Code réutilisé / provenant d'autres sources : À compléter
Code original développé par l'équipe : À compléter
Code généré avec l'aide de l'IA : À compléter
Toute aide ou tout code provenant d'une autre source doit être indiqué dans les fichiers avec des commentaires.


Instructions pour exécuter l'application :

1. Installer les dépendances
Ouvrir un premier terminal dans le dossier backend et exécuter : cd backend, puis npm install.
Ouvrir un deuxième terminal dans le dossier frontend et exécuter : cd frontend, puis npm install.

2. Lancer le backend
Dans le premier terminal, à partir du dossier backend, exécuter : npm start.
Le serveur backend démarre à l'adresse http://localhost:3000.

3. Lancer le frontend
Dans le deuxième terminal, à partir du dossier frontend, exécuter : npm run dev.
Ouvrir ensuite l'adresse locale affichée dans le terminal par Vite (généralement http://localhost:5173).
Les deux serveurs doivent rester ouverts pendant l'utilisation de l'application.


Endpoints API :
GET /api : Vérifier que le serveur fonctionne.
GET /api/assignments : Obtenir la liste des travaux.
GET /api/courses : Obtenir la liste des cours.
POST /api/assignments : Ajouter un travail.
PATCH /api/assignments/:id : Modifier un travail.
DELETE /api/assignments/:id : Supprimer un travail.


Instructions pour exécuter les tests :

Les requêtes API peuvent être vérifiées manuellement avec Postman.

Les tests manuels peuvent inclure la vérification de l'affichage des travaux, l'ajout d'un nouveau travail, la modification d'un travail, sa suppression et la vérification que les données sont correctement enregistrées dans le fichier JSON.

Les tests automatisés ne sont pas actuellement configurés.

https://github.com/kellyannlessardd/StudySpace