import mongoose from "mongoose";
import MagicienModel from "../model/Magicien/MagicienModel.js";
import Magicien from "../model/Magicien/Magicien.js";
import Grimoire from "../model/Grimoire/Grimoire.js";
import Sort from "../model/Sort/Sort.js";
import Effet from "../model/Effet/Effet.js";

//seed conditionnel qui s'execute automatiquement au démarrage
//vérifie si DB contient déjà des magiciens, si aucune, insère des données de départ

export function initialiserDB() {
    MagicienModel.countDocuments()
    //1e étape : les 3 effets
     .then((nbMagesExistants) => {
        if(nbMagesExistants > 0) return Promise.resolve(null);

        //effets de base
        const effetRouille = new Effet({
            id: new mongoose.Types.ObjectId("444000000000000000000001"),
            nom: {
                fr: "Transformation en rouille",
                en: "Transform to rust"
            },
            niveau: 1,
            ecole: "alteration",
            type: ["mauvais"]
        });
        const effetFormeHumaine = new Effet({
            id: new mongoose.Types.ObjectId("444000000000000000000002"),
            nom: { 
                fr: "Forme humaine",
                en: "Human form"
            },
            niveau: 2,
            ecole: "illusion",
            type: ["neutre"]
        });
        const effetOrteils = new Effet({
            id: new mongoose.Types.ObjectId("444000000000000000000003"),
            nom: {
                fr: "Perte d'utilisation des orteils",
                en: "Loss of toes usage"
            },
            niveau: 2,
            ecole: "alteration",
            type: ["chaotique"]
        });

        ///Promise.all([Promise.resolve(1), Promise.resolve(2)])
        /// .then(([a, b]) => {
        ///   console.log(a) -> resultat va être 1 
        ///   console.log(b) -> resultat va être 2
        ///   })
        return Promise.all([
            effetRouille.sauvegarder(),
            effetFormeHumaine.sauvegarder(),
            effetOrteils.sauvegarder() 
        ]);
     })
    //2e étape : les 2 sorts (dont celui avec 2 effets)
     .then((effets) => {
        if(!effets) return Promise.resolve(null); //les effets sont déjà dans la bd
        const [effetRouilleSauve, effetFormeHumaineSauve, effetOrteilsSauve] = effets;

        //sorts de base
        const sortRouille = new Sort({
            id: new mongoose.Types.ObjectId("333000000000000000000001"),
            nom: {
                fr: "Création de rouille",
                en: "Rust Creation"
            },
            niveau: 1,
            ecole: "alteration",
            effet: [effetRouilleSauve._id]
        });
        const sortFormeHumaine = new Sort({
            id: new mongoose.Types.ObjectId("333000000000000000000002"),
            nom: {
                fr: "Forme humaine",
                en: "Human form"
            },
            niveau: 2,
            ecole: "illusion",
            effet: [effetFormeHumaineSauve._id, effetOrteilsSauve._id]
        });
        return Promise.all([
            sortRouille.sauvegarder(),
            sortFormeHumaine.sauvegarder()
        ]);
     })
    //3e étape : les 2 grimoires (1 par magicien)
     .then((sorts) => {
        if (!sorts) return Promise.resolve(null); //les sorts sont déjà dans la bd
        const [sortRouilleSauve, sortFormeHumaineSauve] = sorts;
        const grimoire1 = new Grimoire({
            id: new mongoose.Types.ObjectId("222000000000000000000001"),
            nom: {
                fr: "Livre de Sombre Metallurgie",
                en: "Book of Dark Metalurgy"
            },
            ecole: ["alteration"],
            sorts: [sortRouilleSauve._id]
        });
        const grimoire2 = new Grimoire({
            id: new mongoose.Types.ObjectId("222000000000000000000002"),
            nom: {
                fr: "Arts du Pangolin Illusoire",
                en: "Arts of the Illusory Pangolin"
            },
            ecole: ["illusion", "alteration"],
            sorts: [sortFormeHumaineSauve._id]
        })
        return Promise.all([
            grimoire1.sauvegarder(),
            grimoire2.sauvegarder()
        ]);
     })
     .then((grimoires) => {
        if(!grimoires) return Promise.resolve(null); //les grimoires sont déjà dans la bd
        const [grimoire1Sauve, grimoire2Sauve] = grimoires

        const idBillybob = new mongoose.Types.ObjectId("111000000000000000000001");
        const idGandolin = new mongoose.Types.ObjectId("111000000000000000000002"); //leur attribue des id fixes pour faciliter les tests postman si delete->rebuild la bd

        const billybob = new Magicien({
            id: idBillybob,
            nom: {
                fr: "Billybob Johny Magic",
                en: "Billybob Johny Magic"
            },
            niveau: 1,
            apparance: {
                tenue: "Salopette Magique",
                yeux: "verts",
                cheveux: "poivré sel",
                barbe: "dense",
                baton: "fourchette géante"
            },
            statistique: {
                force: 8,
                dexterite: 12,
                intelligence: 15,
                constitution: 10,
                charisme: 14,
                sagesse: 7
            },
            ecole: ["alteration"],
            alignement: "chaotique neutre",
            grimoires: [grimoire1Sauve._id]
        });
        const gandolin = new Magicien({
            id: idGandolin,
            nom: {
                fr:"Gandolin le Pangolin",
                en:"Gandolin the Pangolin"

            },
            niveau: 2,
            apparance: {
                tenue: "Piercings magiques",
                yeux: "noirs",
                cheveux: "n/a",
                barbe: "n/a",
                baton: "queue enroulée"
            },
            statistique: {
                force: 11,
                dexterite: 15,
                intelligence: 13,
                constitution: 13,
                charisme: 9,
                sagesse: 12
            },
            ecole: ["illusion"],
            alignement: "neutre bon",
            grimoires: [grimoire2Sauve._id]
        });

        return Promise.all([
            billybob.sauvegarder(),
            gandolin.sauvegarder()
        ])
     })
     .then((result) => {
        if (result !== null) {
            console.log("Base de donnée initialisée!")
        }
     })
     .catch((e) => {
        console.error("Erreur lors de l'initialisation de la base de donnée : ", e);  
     })
}