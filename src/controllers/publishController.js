const easybrokerService = require('../services/easybrokerService');
const facebookService = require('../services/facebookService');

const formatPropertyMessage = (property) => {
    let message = '';

    // Agregar título de la propiedad
    if (property.title) {
        message += `🏠 ${property.title}\n\n`;
    }

    // Agregar tipo de operación (renta o venta)
    if (property.operations && property.operations[0]) {
        const operationType = property.operations[0].type === 'rent' ? '🏡 En Renta' : '🏡 En Venta';
        message += `${operationType}\n\n`;
    }

    // Agregar tipo de inmueble
    if (property.property_type) {
        message += `🏢 Tipo de Inmueble: ${property.property_type}\n\n`;
    }

    // Agregar precio de la propiedad
    if (property.operations && property.operations[0] && property.operations[0].formatted_amount) {
        message += `💰 Precio: ${property.operations[0].formatted_amount}\n\n`;
    }

    // Agregar metros de construcción
    if (property.construction_size) {
        message += `📐 Metros de Construcción: ${property.construction_size} m²\n\n`;
    }

    // Agregar ubicación de la propiedad
    if (property.location && property.location.name) {
        message += `📍 Ubicación: ${property.location.name}\n\n`;
    }

    // Incluir la descripción tal como proviene de EasyBroker, sin formato adicional
    if (property.description) {
        message += `📄 Descripción:\n${property.description}\n\n`;
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
