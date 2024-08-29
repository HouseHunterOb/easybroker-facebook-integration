const axios = require('axios');

const publishToFacebook = async (message, images) => {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    const url = `https://graph.facebook.com/v12.0/${pageId}/feed`;

    // Construir el cuerpo del mensaje
    let body = {
        message: message,
        access_token: accessToken
    };

    // Si tienes imágenes, necesitarás subirlas y luego incluirlas en la publicación
    if (images && images.length > 0) {
        const imageUrls = images.map(image => image.url).join(', ');
        body.message += `\n\nImágenes: ${imageUrls}`;
    }

    try {
        const response = await axios.post(url, body);
        console.log('Publicación exitosa en Facebook:', response.data);
    } catch (error) {
        console.error('Error al publicar en Facebook:', error.response.data);
        throw error;
    }
};

module.exports = {
    publishToFacebook,
};
