import fr from "./langues/fr.json" assert {type:"json"};
//wip : ajouter aussi les imports pour "en" et "el"

const dictionnaire = {
    fr,
};

export function traduire(langue, clé) {
    const fallback = "message non def";
    return dictionnaire[langue]?.clé || dictionnaire["fr"]?.[clé] || fallback;
}

//exemple d'utilisation dans le controlleur => 
    //import {traduire} from ../middleware/FonctionTraduire.js;
    //res.status(404).json({message: traduire(req.langue, "magicien_introuvable")});