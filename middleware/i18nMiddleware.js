export default function detecterLangue(req,res,next) {
    const langueDemandee = req.query.langue;
    const langueHeader = req.headers["accept-language"];

    const langueSupportees = ["fr", "en"];
    const langueParDefault = "fr";

    const langue =  
        langueSupportees.includes(langueDemandee) ? langueDemandee :
        langueSupportees.includes(langueHeader) ? langueHeader :
        langueParDefault;

    req.langue = langue;
    next();
}