const easybrokerService = require('../services/easybrokerService');
const facebookService = require('../services/facebookService');

const META_TAG = "Meta";

const formatPropertyMessage = (property) => {
    let message = '';

    if (property.title) {
        message += `🏠 ${property.title}\n\n`;
    }

    if (property.operations && property.operations[0]) {
        const operationType = property.operations[0].type === 'rent' ? '🏡 En Renta' : '🏡 En Venta';
        message += `${operationType}\n\n`;
    }

    if (property.property_type) {
        message += `🏢 Tipo de Inmueble: ${property.property_type}\n\n`;
    }

    if (property.operations && property.operations[0] && property.operations[0].formatted_amount) {
        message += `💰 Precio: ${property.operations[0].formatted_amount}\n\n`;
    }

    if (property.construction_size) {
        message += `📐 Metros de Construcción: ${property.construction_size} m²\n\n`;
    }

    if (property.location && property.location.name) {
        message += `📍 Ubicación: ${property.location.name}\n\n`;
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

            // Verificar si la propiedad tiene la etiqueta "Meta"
            if (property.tags && property.tags.includes(META_TAG)) {
                console.log(`La propiedad "${property.title}" ya fue subida a Facebook.`);
                continue; // Saltar esta propiedad y pasar a la siguiente
            }

            const formattedMessage = formatPropertyMessage(property);

            // Verificar si la propiedad tiene imágenes
            const propertyImages = property.property_images || [];

            if (propertyImages.length > 0) {
                const success = await facebookService.publishToFacebook(formattedMessage, propertyImages, i, total);
                if (success) {
                    // Agregar la etiqueta "Meta" a la propiedad en EasyBroker
                    await easybrokerService.addTagToProperty(propertyId, META_TAG);
                } else {
                    allSuccessful = false;
                }
            } else {
                console.log(`La propiedad ${propertyId} no tiene imágenes. Publicando solo el texto.`);
                const success = await facebookService.publishToFacebook(formattedMessage, [], i, total);
                if (success) {
                    // Agregar la etiqueta "Meta" a la propiedad en EasyBroker
                    await easybrokerService.addTagToProperty(propertyId, META_TAG);
                } else {
                    allSuccessful = false;
                }
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
