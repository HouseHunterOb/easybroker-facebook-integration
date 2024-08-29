require('dotenv').config();

module.exports = {
    easybrokerApiKey: process.env.EASYBROKER_API_KEY,
    facebookPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    facebookPageId: process.env.FACEBOOK_PAGE_ID,  // Añadimos la variable de entorno para el ID de la página
};
