// src/services/easybrokerService.js
const axios = require('axios');

const easybrokerService = {
    async getPropertyDetails(propertyId) {
        if (!propertyId || typeof propertyId !== 'string') {
            throw new Error('Invalid property ID');
        }

        const response = await axios.get(`https://api.easybroker.com/v1/properties/${propertyId}`, {
            headers: {
                'X-Authorization': process.env.EASYBROKER_API_KEY,
            },
        });

        return response.data;
    }
};

module.exports = easybrokerService;
