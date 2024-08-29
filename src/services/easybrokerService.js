const axios = require('axios');

// Configuración de Axios para EasyBroker
const api = axios.create({
    baseURL: 'https://api.easybroker.com/v1',
    headers: {
        'X-Authorization': process.env.EB_API_KEY, // Asegúrate de tener esta variable en tu .env
        'Content-Type': 'application/json',
    }
});

const getPropertyDetails = async (propertyId) => {
    try {
        const response = await api.get(`/properties/${propertyId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalles de la propiedad ${propertyId}:`, error.message);
        throw error;
    }
};

module.exports = { getPropertyDetails };
