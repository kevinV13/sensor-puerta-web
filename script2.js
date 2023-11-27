let estadoLed = 0; // Inicialmente apagado

document.getElementById('toggleBtn').addEventListener('click', function () {
    estadoLed = 1 - estadoLed; // Alternar entre 0 y 1
    actualizarTextoBoton();
    enviarDato(estadoLed);
});

function enviarDato(valor) {
    const apiUrl = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/led/values/';
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

function actualizarTextoBoton() {
    const boton = document.getElementById('toggleBtn');
    boton.textContent = estadoLed === 1 ? 'Apagar LED' : 'Encender LED';
}
