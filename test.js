const { addMetaTagToProperty } = require('./src/services/easybrokerService');

const testPropertyId = 'EB-XXXXXX'; // Reemplaza con un ID de propiedad válido

(async () => {
    console.log("===== Iniciando Prueba: Agregar Etiqueta 'Meta' =====");

    try {
        console.log(`\nVerificando propiedad con ID: ${testPropertyId}`);
        const result = await addMetaTagToProperty(testPropertyId);

        if (result) {
            console.log("\n✅ Resultado: La etiqueta 'Meta' fue agregada exitosamente.");
            console.log("Detalles de la propiedad actualizada:");
            console.log(JSON.stringify(result, null, 2)); // Mostrar la respuesta formateada
        } else {
            console.log("\n⚠️ Aviso: La propiedad ya tiene la etiqueta 'Meta'. No se realizaron cambios.");
        }
    } catch (error) {
        console.error("\n❌ Error durante la prueba:");
        console.error(`Mensaje: ${error.message}`);
        console.error("Detalles del error:");
        console.error(error.stack); // Mostrar la pila de errores para ayudar en la depuración
    }

    console.log("\n===== Prueba Completada =====\n");
})();
