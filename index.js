require('dotenv').config();
const readline = require('readline');
const { publishProperties } = require('./src/controllers/publishController');

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
