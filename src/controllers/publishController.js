const easybrokerService = require('../services/easybrokerService');
const facebookService = require('../services/facebookService');

const formatPropertyMessage = (property) => {
    let message = '';

    // Agregar título en negritas
    if (property.title) {
        message += `**🏠 ${property.title}**\n\n`;
    }

    // Agregar precio en negritas
    if (property.operations && property.operations[0] && property.operations[0].formatted_amount) {
        message += `**💰 Precio: ${property.operations[0].formatted_amount}**\n\n`;
    }

    // Formatear la descripción en bullets
    if (property.description) {
        const bullets = property.description.split('\n').map(line => `- ${line}`).join('\n');
        message += `📄 Descripción:\n${bullets}\n\n`;
    }

    // Agregar enlace a la propiedad
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

            const formattedMessage = formatPropertyMessage(property);

            // Verificar si la propiedad tiene imágenes
            const propertyImages = property.property_images || [];

            if (propertyImages.length > 0) {
                const success = await facebookService.publishToFacebook(formattedMessage, propertyImages, i, total);
                if (!success) allSuccessful = false;
            } else {
                console.log(`La propiedad ${propertyId} no tiene imágenes. Publicando solo el texto.`);
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
