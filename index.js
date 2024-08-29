require('dotenv').config();
const readline = require('readline');
const { publishProperties } = require('./src/controllers/publishController');

// Verificar que las variables de entorno críticas estén definidas
if (!process.env.EASYBROKER_API_KEY || !process.env.FACEBOOK_PAGE_ACCESS_TOKEN || !process.env.FACEBOOK_PAGE_ID) {
    console.error('Error: Faltan variables de entorno necesarias. Verifica tu archivo .env.');
    process.exit(1); // Terminar la ejecución si faltan variables críticas
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingrese los IDs de las propiedades que desea publicar, separados por comas: ', (answer) => {
    const propertyIds = answer.split(',').map(id => id.trim());
    
    publishProperties(propertyIds)
        .then(() => {
            console.log('Proceso completado.');
        })
        .catch((error) => {
            console.error('Error durante el proceso:', error.message);
        })
        .finally(() => {
            rl.close();
        });
});
