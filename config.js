require('dotenv').config(); // Carga las variables de entorno desde .env

module.exports = {
    facebook: {
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
        // Puedes agregar el ID de la página de Facebook aquí si lo necesitas
        // pageId: process.env.FACEBOOK_PAGE_ID, 
    },
    easyBroker: {
        apiKey: process.env.EASYBROKER_API_KEY
    },
    openAI: {
        apiKey: process.env.OPENAI_API_KEY
    }
};
