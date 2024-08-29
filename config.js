require('dotenv').config(); // Carga las variables de entorno desde .env

module.exports = {
    facebook: {
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        pageId: process.env.FACEBOOK_PAGE_ID
    },
    easyBroker: {
        apiKey: process.env.EB_API_KEY
    }
};
