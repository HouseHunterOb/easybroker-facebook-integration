const easybrokerService = require('../services/easybrokerService');
const facebookService = require('../services/facebookService');

const formatPropertyMessage = (property) => {
    let message = '';

    if (property.title) {
        message += `🏠 *${property.title}*\n\n`;
    }
    if (property.operations && property.operations[0] && property.operations[0].formatted_amount) {
        message += `💰 Precio: ${property.operations[0].formatted_amount}\n\n`;
    }
    if (property.description) {
        message += `📄 Descripción:\n${property.description}\n\n`;
    }
    message += `🔗 Más información: ${property.public_url}`;

    return message;
};

const publishProperties = async (propertyIds) => {
    const total = propertyIds.length;
    let allSuccessful = true;

    for (let i = 0; i < total; i++) {
        try {
            const propertyId = propertyIds[i];
            const property = await easybrokerService.getPropertyDetails(propertyId);

            // Verificar si la propiedad tiene imágenes
            const propertyImages = property.property_images || [];

            if (propertyImages.length > 0) {
                // Formatear el mensaje y publicar la propiedad con las imágenes
                const formattedMessage = formatPropertyMessage(property);
                const success = await facebookService.publishToFacebook(formattedMessage, propertyImages, i, total);
                if (!success) allSuccessful = false;
            } else {
                console.log(`La propiedad ${propertyId} no tiene imágenes. Publicando solo el texto.`);
                const formattedMessage = formatPropertyMessage(property);
                const success = await facebookService.publishToFacebook(formattedMessage, [], i, total);
                if (!success) allSuccessful = false;
            }

        } catch (error) {
            console.error(`Error general al manejar la propiedad ${i + 1}: ${error.message}`);
            allSuccessful = false;
        }
    }

    if (allSuccessful) {
        console.log('Todas las propiedades se publicaron exitosamente.');
    } else {
        console.log('Hubo errores al publicar algunas propiedades.');
    }
};

module.exports = { publishProperties };
