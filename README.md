### Planification TP3 – Monde Magique / RESTFUL Api / Structure MVC

# Phase 1 - Middlewares

## 1.1 Implementer le middleware d'erreur
- Importation du middleware custom d'Alex

## 1.2 Implementer le middleware de langue (Francais, anglais, elfique)
- Fichiers : `fr.json`, `en.json`, `el.json`
- Chargé via le middleware Express (`i18n.init`)
- Exemple de structure typique :
  ```json
  {
    "fireball": {
      "fr": "Boule de feu",
      "en": "Fireball",
      "el": "Naurnîn"
    }
  }
  ```

# Phase 2 – Modèles et schema Mongoose

## 2.1 Coder les classes et constructeur de base
  
- `Magicien`, possede plusieurs grimoire, a des ecoles de magies, un niveau, un apparence, etc.
  - Fonctions creerMagicien() 
- `Grimoire`, possede plusieurs sorts, a des ecoles de magies, appartient a un magicien mais peu etre null.
  - Fonction creerGrimoire()
- `Sort`, possede contient plusieurs effets, a un niveau et un ecole
  - Fonction creerSort()
- `Effet`, decris l'effet d'un sort. (Type, ecole, bon ou mauvais, etc)
  - Fonction creerEffect()


## 2.2 Implementer les fonctionaliters metiers autres tel que:
  - ajouterSortAuGrimoire()
  - acquerirGrimoire()
  - lancerSort()
  - genereEffetsAleatoires()

## 2.3 Entrees et sorties des fonctions
  ### Fonction creerMagicien(magicienObj)
  - parametre: 
  ```JSON
  {
    "nom": { fr: "Jean-Mage", en: "John Mage", el: "Jh’Mazh" },
    "apparence": { cheveux: "longs", couleurCheveux: "gris", robe: "bleue" },
    "caractéristiques": { force: 10, intelligence: 15 },
    "niveau": Number,
    "écoles": ["illusion", "évocation"],
    "alignement": "chaotique bon"
  }
  ```
  - retour: Un objet de type magicien avec `_id` et `grimoires = []`
  
  ### Fonction creerSort(idMagicien, sortObj)
  - parametre:
  ```JSON
  {
    "nom": { fr: "", en: "", el: ""},
    "niveau": Number,
    "ecole": "string",
    "effets":[ new Object.Effet, Effet secondaire peut etre? ]
  }
   
  Aleatoire
  {
    "nom": { fr: "", en: "", el: ""}, 
  }

  ```
  - retour: Un sort generer avec ces effets ou erreur si regles metiers son non respectees.
  
  ### Fonction creerGrimoire(idMagicien, grimoireObj)
  - parametre:
  ```JSON
  {
    "nom": { "fr": "Grimoire de base"},
    "ecoles": ["Illusions"],
    "sorts": ["Tous les sorts valides de cette ecoles"]
  }
  ```
  - retour: Un grimoire sauvegarder avec un proprietaire = Magicien

  ### Fonction ajouterSortAuGrimoire(idMagicien, idGrimoire, idSort) 
  - parametre:
  ```JSON
  {
    "idMagicien": _id.Magicien,
    "idGrimoire": _id.Grimoire,
    "idSort": _id.Sort
  }
  ```
  - regles: Le magicien doit etre proprietaire du grimoire et si l'ecole du sort n'apartient pas aux ecoles du grimoire, elle y est ajoutee.
    
  - retour: Un grimoire mis a jour.

  ### Fonction acquerirGrimoire(idMagicien, idGrimoire)
  - parametre: 
  ```JSON
  {
    "idMagicien": _id.Magicien,
    "idGrimoire": _id.Grimoire
  }
  ```
  - retour: L'objet magicien est mis a jour avec le grimoire ajouter.

  ### Fonction lancerSort(idMagicien, idSort)
  - parametre: 
  ```JSON
  {
    "idMagicien": _id.Magicien,
    "idSort": _id.Sort
  }
  ```
  - regles: Le sort doit etre dans un des grimoires du magiciens. L'ecole doit etre apprise par le magicien. Le niveau du magicien doit etre superier ou egale au niveau du sort.
  - retour: Objet de resultat (succes, effets declenches ou erreur metier)

 ## 2.4 Model mongoose

  ### EffetModel
  - _id (ObjectId), 
  - description (objet JS multilingue)
  - ecole (String)
  - types ([String])

  ### SortModel
  - _id (ObjectId)
  - nom (objet JS multilingue)
  - niveau (Number)
  - ecole (String)
  - effets ([EffetModel.ObjectId, ref: "effet"])

  ### GrimoireModel
  - _id (ObjectId)
  - nom (objet JS multilingue)
  - ecoles ([String])
  - sort ([SortModel]) 
  - propietaire (idMagicien || null)

 ### MagicienModel
  - _id (ObjectId)
  - nom (objet JS multilingue)
  - apparence (Objet JS)
  - statistique (Objet JS) 
  - niveau (Number)
  - ecoles ([String]) , conditions au moins une.
  - alignement (String)
  - grimoires ([GrimoireModel.ObjectId])


##  Phase 3 – Contrôleurs et Routes

### 3.1 Effet

- `GET - /api/effets`
  -> Route seulement pour des raisons de debug et de developpement seulement

### 3.2 Sort

- `GET - /api/sorts`
  -> Obtenir tous les sorts

- `GET - /api/sorts/:id`
  -> Obtenir un sort spécifique

### 3.3 Grimoire

- `POST - /api/grimoires/:id/sorts`
  -> Ajouter un sort a un grimoire

- `GET - /api/grimoires`
  -> Obtenir tous les grimoires

- `GET - /api/grimoires/:id`
  -> Obtenir un grimoire spécifique

### 3.4 Magicien
- `POST - /api/magiciens/create`
  -> Creer un magicien

- `POST /api/magiciens/:id/sorts`  
  -> Créer un sort (manuel ou aléatoire)

- `POST - /api/magiciens/:id/grimoires`
  -> Creer un grimoire pour un magicien

- `POST - /api/magiciens/:id/ajout/:grimoire`
  -> Ajouter une grimoire existant

- `POST /api/magiciens/:id/lancer/:sortId`  
  -> Lancer un sort (vérifie niveau + école)

- `GET /api/magiciens`
  -> Obtenir tous les magiciens

- `GET /api/magiciens/:id`
  -> Obtenir un magicien spécifique

- `GET /api/magiciens/:id/grimoires`
  -> Eager fetch d'un magiciens avec les details des grimoires

- `PUT /api/magiciens/`
  -> A definir WIP

- `DEL /api/magiciens/:id`
  -> Supprimer un magicien


## Phase 4 – WIP Logger

- Recherche sur le module **Winston**

## Phase 5 – Tests

- Utilisation d'une suite de testes sur Postman 

---

## Phase 6 – Verification finales

- A vérifier :
  - Architecture MVC respectée
  - Logs présents pour toutes actions
  - Aucune donnée sensible commise (dans `.env`)
  - README complet

---

## Phase 7 - Remise finale

- Commit avec un tag "REMISE FINALE"


## Exemples d’objets

```json
// Magicien
{
  "id": Un id fix de 24 charactere de type MongoDb,
  "nom": "Gandalf",
  "apparance": { "cheveu": "long", "couleurCheveu": "gris", "linge": "blanc" },
  "statistique": { "force": 12, "intelligence": 18 },
  "niveau": 10,
  "ecoles": ["illusion", "divination"],
  "alignement": "Bon"
}
```

```json
// Sort
{
  "id": Un id fix de 24 charactere de type MongoDb,
  "nom": "Create Water",
  "ecole": "abjuration",
  "niveau": 1,
  "effets": [
    { "description": "Crée de l'eau pure", "ecole": "abjuration", "types": ["bon"] }
  ]
}
```