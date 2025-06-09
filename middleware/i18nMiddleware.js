export default function detecterLangue(req, res, next) {
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

// https://phrase.com/blog/posts/node-js-i18n-guide/
// https://lokalise.com/blog/node-js-i18n-express-js-localization/