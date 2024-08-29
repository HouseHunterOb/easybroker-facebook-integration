const axios = require('axios');

const EB_API_KEY = process.env.EB_API_KEY;
const EB_API_BASE_URL = "https://api.easybroker.com/v1";

// Configurar axios para usar la API de EasyBroker
const api = axios.create({
    baseURL: EB_API_BASE_URL,
    headers: {
        'X-Authorization': EB_API_KEY,
        'Content-Type': 'application/json',
    }
});

// Función para obtener los detalles de la propiedad
const getPropertyDetails = async (propertyId) => {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data;
};

// Función para agregar la etiqueta "Meta" si no está presente
const addMetaTagToProperty = async (propertyId) => {
    // Obtener los detalles de la propiedad
    const property = await getPropertyDetails(propertyId);

    // Verificar si la etiqueta "Meta" ya existe
    if (property.tags && property.tags.includes('Meta')) {
        console.log(`La propiedad ${propertyId} ya tiene la etiqueta "Meta".`);
        return;
    }

    // Agregar la etiqueta "Meta"
    const updatedTags = property.tags ? [...property.tags, 'Meta'] : ['Meta'];

    // Enviar la solicitud PATCH para actualizar la propiedad
    const response = await api.patch(`/properties/${propertyId}`, {
        tags: updatedTags,
    });

    console.log(`Etiqueta "Meta" agregada a la propiedad ${propertyId}.`);
    return response.data;
};

module.exports = {
    getPropertyDetails,
    addMetaTagToProperty,
};
