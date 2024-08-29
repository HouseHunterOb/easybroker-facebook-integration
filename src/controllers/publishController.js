const { getPropertyDetails } = require('../services/easybrokerService');
const facebookService = require('../services/facebookService');

// Generar la descripción con emojis basada en los detalles de la propiedad
const generatePropertyDescription = (property) => {
    const { bedrooms, bathrooms, parking_spaces, construction_size, expenses, property_type } = property;
    
    let description = '';

    // Tipo de propiedad con emoji
    const propertyTypeEmoji = {
        'casa': '🏠',
        'departamento': '🏢',
        'terreno': '🌍',
        'oficina': '🏢',
        'bodega': '🏬',
        'local': '🏪',
        'otro': '🏡'
    };

    description += `${propertyTypeEmoji[property_type.toLowerCase()] || '🏡'} Tipo de Propiedad: ${property_type}\n`;

    // Habitaciones
    if (bedrooms) {
        description += `🛏️ Habitaciones: ${bedrooms}\n`;
    }

    // Baños
    if (bathrooms) {
        description += `🛁 Baños: ${bathrooms}\n`;
    }

    // Espacios de estacionamiento
    if (parking_spaces) {
        description += `🚗 Estacionamientos: ${parking_spaces}\n`;
    }

    // Tamaño de la construcción
    if (construction_size) {
        description += `📐 Tamaño de la construcción: ${construction_size} m²\n`;
    }

    // Gastos
    if (expenses && expenses !== "0") {
        description += `💸 Gastos adicionales: ${expenses}\n`;
    } else {
        description += `💸 Gastos adicionales: No especificados\n`;
    }

    return description;
};

const publishProperties = async (propertyIds) => {
    for (const propertyId of propertyIds) {
        try {
            // 1. Obtener los detalles de la propiedad desde EasyBroker
            const property = await getPropertyDetails(propertyId);

            // 2. Generar la nueva descripción usando nuestra función personalizada
            const description = generatePropertyDescription(property);

            // 3. Construir el mensaje para Facebook
            const message = `${property.title}\n\n${description}\n\nMás información: ${property.public_url}`;

            // 4. Publicar en Facebook utilizando el servicio correspondiente
            await facebookService.publishToFacebook(message, property.property_images);

            console.log(`Propiedad ${propertyId} publicada con éxito.`);
        } catch (error) {
            console.error(`Error al publicar la propiedad ${propertyId}:`, error.message);
        }
    }
};

module.exports = {
    publishProperties,
};
