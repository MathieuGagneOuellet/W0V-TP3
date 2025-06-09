### Planification TP3 – Monde Magique / RESTFUL Api / Structure MVC

---
# Phase 1 - Middlewares

### 1.1 Middleware d'erreur
- ~~Importation du middleware custom d'Alex~~
- Gestion des erreurs avec Winston (Incluant les logs)

### 1.2 Middleware de langue (Francais, anglais)
- ~~Fichiers : `fr.json`, `en.json`~~
- ~~Chargé via le middleware Express (`i18n.init`)~~
- Traduction des messages client, écoles, effets, alignements

---
# Phase 2 – Modèles et schema Mongoose

### 2.1 Modèles de base

- ~~User : username, password (non chiffré), role (admin, mage)~~
- ~~Magicien : userId, nom, apparence, stats, niveau, écoles, alignement, grimoires~~
- ~~Grimoire : nom, écoles, sorts, propriétaire~~
- ~~Sort : nom, niveau, école, effets~~
- ~~Effet : description, école, types~~

### 2.2 Règles métier à implémenter

- Niveau du sort ≤ niveau du magicien
- École du sort ∈ écoles du magicien
- Sorts du grimoire doivent être dans ses écoles
- Seul l’auteur ou un admin peut modifier un grimoire
- Lancer un sort : magicien doit connaître l’école, posséder le sort, avoir le bon niveau

### 2.3 Fonctions métiers principales

- ~~creerMagicien( magicienObj )~~
- creerSort( idMagicien, sortObj )
- creerGrimoire( idMagicien, grimoireObj )
- ajouterSortAuGrimoire( idMagicien, idGrimoire, idSort )
- acquerirGrimoire( idMagicien, idGrimoire )
- lancerSort( idMagicien, idSort )
- genereEffetsAleatoires()

### 2.4 Exemple d'entrée JSON

```json
{
  "nom": { "fr": "Jean-Mage", "en": "John Mage" },
  "apparence": { "tenue": "", "yeux": "", "cheveux": "", "barbe": "", "barbe": "" },
  "statistique": { "force": 10, "intelligence": 15 },
  "niveau": 5,
  "ecoles": ["illusion", "restauration"],
  "alignement": "chaotique bon"
}
```

# Phase 3 – Authentification

### 3.1 Routes

- ~~POST /api/register : créer un utilisateur~~
- POST /api/login : retourner un token JWT

### 3.2 Middleware d'authentification

- Protège les routes de création et modification
- Vérifie si l’utilisateur est admin ou créateur

### 3.3 Ajouts à la structure

- ~~Ajout de userId dans le modèle Magicien~~
- Vérification du token JWT dans les headers
- Rôle : admin ou mage

---
# Phase 4 – Contrôleurs et Routes

### 4.1 Effet

- GET /api/effets : route de debug seulement

### 4.2 Sort

- GET /api/sorts
- GET /api/sorts/:id

### 4.3 Grimoire

- GET /api/grimoires
- GET /api/grimoires/:id
- POST /api/grimoires/:id/sorts (protégé)

### 4.4 Magicien

- ~~GET /api/magiciens~~
- ~~GET /api/magiciens/:id~~
- GET /api/magiciens/:id/grimoires
- POST /api/magiciens/create (protégé)
- POST /api/magiciens/:id/sorts
- POST /api/magiciens/:id/grimoires (protégé)
- POST /api/magiciens/:id/ajout/:grimoire
- POST /api/magiciens/:id/lancer/:sortId
- PUT /api/magiciens/ (WIP)
- DELETE /api/magiciens/:id

---
# Phase 5 – Logger

- Winston utilisé
- Logger chaque action d’un magicien
- Logger chaque erreur (try/catch)
- Aucun console.log (sauf démarrage serveur ou debug validé)

---
# Phase 6 – Tests

- Utilisation de Postman
- Vérification des cas d’authentification
- Traduction via header Accept-Language
- Cas de refus d’accès (non-propriétaire, non-admin)

---
# Phase 7 – Vérification finales

- Architecture MVC respectée
- Validation métier appliquée
- Logger présent
- Traductions correctes
- ~~README complet~~
- Fichier `.env.example` fourni

---
# Phase 8 – Remise finale

- Branches mergées dans main
- Tag : REMISE
- Dernier push avant 13 juin minuit

---
# Exemples d’objets

```json
{
  "username": "jeanmage",
  "password": "123456",
  "role": "mage"
}
```

```json
{
  "description": { "fr": "Inflige une douleur mentale", "en": "Inflicts mental pain" },
  "school": "illusion",
  "types": ["chaotique", "mauvais"]
}
```