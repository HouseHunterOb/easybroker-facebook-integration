const { getPropertyDetails } = require('../services/easybrokerService');
const inquirer = require('inquirer');

const propertiesToCheck = ['EB-XXXXXX1', 'EB-XXXXXX2']; // Reemplaza con tus IDs de propiedades

const checkPublishedAndMetaTag = async () => {
    const propertiesWithoutMeta = [];
    const publishedProperties = [];

    for (const propertyId of propertiesToCheck) {
        try {
            const property = await getPropertyDetails(propertyId);

            // Asumimos que una propiedad está publicada si tiene algún campo específico (ajústalo según tu estructura)
            const isPublished = property.operations && property.operations.length > 0;
            if (isPublished) {
                publishedProperties.push({
                    id: propertyId,
                    title: property.title || 'Sin título',
                    tags: property.tags || [],
                    hasMetaTag: property.tags && property.tags.includes('Meta'),
                });
                if (!property.tags || !property.tags.includes('Meta')) {
                    propertiesWithoutMeta.push({
                        id: propertyId,
                        title: property.title || 'Sin título',
                    });
                }
            }
        } catch (error) {
            console.error(`Error al verificar la propiedad ${propertyId}: ${error.message}`);
        }
    }

    console.log("\n===== Propiedades Publicadas en EasyBroker =====");
    console.table(publishedProperties);

    console.log("\n===== Propiedades Publicadas sin Etiqueta 'Meta' =====");
    console.table(propertiesWithoutMeta);

    if (propertiesWithoutMeta.length > 0) {
        const { proceed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: '¿Deseas proceder con la publicación de las propiedades que no tienen la etiqueta "Meta"?',
                default: false,
            },
        ]);

        if (proceed) {
            const propertyIdsToPublish = propertiesWithoutMeta.map(prop => prop.id);
            // Aquí puedes llamar a la función que maneje la publicación de estas propiedades
            console.log("Publicando propiedades...");
            // Ejemplo: await publishProperties(propertyIdsToPublish);
        } else {
            console.log("No se publicó ninguna propiedad.");
        }
    } else {
        console.log("Todas las propiedades publicadas ya tienen la etiqueta 'Meta'.");
    }
};

checkPublishedAndMetaTag();
