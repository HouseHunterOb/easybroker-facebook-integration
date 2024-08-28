const axios = require('axios');
const readline = require('readline');

const facebookService = {
    async publishToFacebook(message, propertyImages, index, total, retries = 3) {
        const pageId = '405191686010275'; // Reemplaza con el ID correcto de tu página de Facebook
        let mediaFbIds = [];

        try {
            // Publicar cada imagen primero y guardar sus IDs
            for (const image of propertyImages) {
                const photoResponse = await axios.post(`https://graph.facebook.com/v12.0/${pageId}/photos`, {
                    url: image.url,
                    access_token: process.env.FACEBOOK_ACCESS_TOKEN,
                    published: false // No publicarla inmediatamente
                });
                mediaFbIds.push({ media_fbid: photoResponse.data.id });

                // Actualizar el progreso al subir cada imagen
                const imageProgress = Math.floor(((mediaFbIds.length / propertyImages.length) * 100) / total);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(`Progreso de la imagen ${mediaFbIds.length} de ${propertyImages.length} para la propiedad ${index + 1}: ${imageProgress}%`);
            }

            // Publicar el mensaje junto con las imágenes
            const postResponse = await axios.post(`https://graph.facebook.com/v12.0/${pageId}/feed`, {
                message: message,
                attached_media: mediaFbIds,
                access_token: process.env.FACEBOOK_ACCESS_TOKEN
            });

            // Mostrar progreso final para esta propiedad
            const percentage = (((index + 1) / total) * 100).toFixed(2);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`Publicación ${index + 1} de ${total} completada (${percentage}%).\n`);

            return true; // Indica éxito
        } catch (error) {
            if (error.response && error.response.status === 504 && retries > 0) {
                console.log(`Error 504 al publicar la propiedad ${index + 1}. Reintentando... (${3 - retries} de 3)`);
                return this.publishToFacebook(message, propertyImages, index, total, retries - 1);
            } else {
                console.error(`Error al publicar la propiedad ${index + 1}: ${error.response ? error.response.data.error.message : error.message}`);
                return false; // Indica fallo
            }
        }
    }
};

module.exports = facebookService;
