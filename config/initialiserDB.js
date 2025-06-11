import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import MagicienModel from "../model/Magicien/MagicienModel.js";
import Magicien from "../model/Magicien/Magicien.js";
import Grimoire from "../model/Grimoire/Grimoire.js";
import Sort from "../model/Sort/Sort.js";
import Effet from "../model/Effet/Effet.js";
import Utilisateur from "../model/Utilisateur/Utilisateur.js";

//seed conditionnel qui s'execute automatiquement au démarrage
//vérifie si DB contient déjà des magiciens, si aucune, insère des données de départ

export function initialiserDB() {
    MagicienModel.countDocuments()
        //1e étape : les 3 effets
        .then((nbMagesExistants) => {
            if (nbMagesExistants > 0) return Promise.resolve(null);
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
            const effetBrulure = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000004"),
                nom: { fr: "Brûlure", en: "Burn" },
                niveau: 1,
                ecole: "destruction",
                type: ["mauvais", "chaotique"]
            });
            const effetEngelure = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000005"),
                nom: { fr: "Engelure", en: "Frostbite" },
                niveau: 1,
                ecole: "destruction",
                type: ["neutre", "mauvais"]
            });
            const effetGeler = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000006"),
                nom: { fr: "Geler", en: "Freeze" },
                niveau: 2,
                ecole: "alteration",
                type: ["neutre", "mauvais", "chaotique"]
            });
            const effetElectrocuter = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000007"),
                nom: { fr: "Électrocuter", en: "Electrocute" },
                niveau: 2,
                ecole: "destruction",
                type: ["mauvais", "chaotique"]
            });
            const effetSaignement = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000008"),
                nom: { fr: "Saignement", en: "Bleeding" },
                niveau: 1,
                ecole: "alteration",
                type: ["mauvais"]
            });
            const effetAssommer = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000009"),
                nom: { fr: "Assommer", en: "Knockout" },
                niveau: 2,
                ecole: "illusion",
                type: ["neutre", "mauvais"]
            });
            const effetPetrifier = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000010"),
                nom: { fr: "Pétrifier", en: "Petrify" },
                niveau: 3,
                ecole: "alteration",
                type: ["mauvais", "chaotique"]
            });
            const effetTrebucher = new Effet({
                id: new mongoose.Types.ObjectId("444000000000000000000011"),
                nom: { fr: "Trébucher", en: "Trip" },
                niveau: 1,
                ecole: "illusion",
                type: ["neutre", "chaotique"]
            });
            return Promise.all([
                effetRouille.sauvegarder(),
                effetFormeHumaine.sauvegarder(),
                effetOrteils.sauvegarder(),
                effetBrulure.sauvegarder(),
                effetEngelure.sauvegarder(),
                effetGeler.sauvegarder(),
                effetElectrocuter.sauvegarder(),
                effetSaignement.sauvegarder(),
                effetAssommer.sauvegarder(),
                effetPetrifier.sauvegarder(),
                effetTrebucher.sauvegarder()
            ]);
        })
        //2e étape : les 2 sorts (dont celui avec 2 effets)
        .then((effets) => {
            if (!effets) return Promise.resolve(null); //les effets sont déjà dans la bd
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
        .then(async (sorts) => {
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

            const admin = new Utilisateur({
                id: new mongoose.Types.ObjectId("000000000000000000000001"),
                nomUtilisateur: "admin",
                motDePasse: await bcrypt.hash("admin", 10),
                role: "admin"
            });

            const utilisateur = new Utilisateur({
                id: new mongoose.Types.ObjectId("000000000000000000000002"),
                nomUtilisateur: "Billybob",
                motDePasse: await bcrypt.hash("Billybob", 10),
                role: "utilisateur"
            });

            return Promise.all([
                grimoire1.sauvegarder(),
                grimoire2.sauvegarder(),
                admin.sauvegarder(),
                utilisateur.sauvegarder()
            ]);
        })
        .then((grimoires) => {
            if (!grimoires) return Promise.resolve(null); //les grimoires sont déjà dans la bd
            const [grimoire1Sauve, grimoire2Sauve, admin, utilisateur] = grimoires;

            const idBillybob = new mongoose.Types.ObjectId("111000000000000000000001");
            const idGandolin = new mongoose.Types.ObjectId("111000000000000000000002"); //leur attribue des id fixes pour faciliter les tests postman si delete->rebuild la bd

            const billybob = new Magicien({
                userId: [utilisateur._id],
                id: idBillybob,
                nom: {
                    fr: "Billybob Johny Magic",
                    en: "Billybob Johny Magic"
                },
                niveau: 1,
                apparence: {
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
                userId: [admin._id],
                id: idGandolin,
                nom: {
                    fr: "Gandolin le Pangolin",
                    en: "Gandolin the Pangolin"

                },
                niveau: 2,
                apparence: {
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
                .then((result) => {
                    if (result !== null) {
                        console.log("Base de donnée initialisée!")
                    }
                })
                .catch((e) => {
                    console.error("Erreur lors de l'initialisation de la base de donnée : ", e);
                })
        })
}