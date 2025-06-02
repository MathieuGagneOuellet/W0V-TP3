export default function detecterLangue(req,res,next) {
    const langueDemandee = req.headers["accept-language"];

    const langueSupportees = ["fr", "en", "el"];
    const langueParDefault = "fr";

    const langue = langueSupportees.includes(langueDemandee) ? langueDemandee : langueParDefault;

    req.langue = langue;
    next();
}