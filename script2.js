// Lista de URLs de LEDs
const ledUrls = [
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led1/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led2/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led3/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led4/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led5/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led6/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led7/values/',
    'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led8/values/',
    // Agrega más URLs según sea necesario
];

// Estado inicial de los LEDs
let estadosLed = Array(ledUrls.length).fill(0); // Inicialmente todos apagados

// Configurar eventos para cada botón
for (let i = 0; i < ledUrls.length; i++) {
    const buttonId = `toggleBtn${i + 1}`;
    const button = document.getElementById(buttonId);

    button.addEventListener('click', function () {
        // Alternar el estado del LED asociado al botón
        estadosLed[i] = 1 - estadosLed[i];
        actualizarTextoBoton(button, estadosLed[i]);
        enviarDato(ledUrls[i], estadosLed[i]);
    });

    // Inicializar texto del botón
    actualizarTextoBoton(button, estadosLed[i]);
}

function enviarDato(apiUrl, valor) {
    const token = 'BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';  // Reemplaza con tu token de Ubidots

    // Datos que deseas enviar
    const dataToSend = {
        value: valor
    };

    // Configuración de la solicitud
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
        },
        body: JSON.stringify(dataToSend)
    };

    // Realizar la solicitud
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Datos enviados correctamente:', data);
        })
        .catch(error => {
            console.error('Error al enviar datos:', error);
        });
}

function actualizarTextoBoton(boton, estado) {
    boton.textContent = estado === 1 ? 'Apagar' : 'Encender';
}