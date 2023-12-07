
  
const apiUrlSensor1 = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/sensor1/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';
const apiUrlSensor2 = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/sensor2/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';

obtenerEstadoPuerta(apiUrlSensor1, 'estadoPuerta1');
obtenerEstadoPuerta(apiUrlSensor2, 'estadoPuerta2');


function obtenerEstadoPuerta(apiUrl, elementoId) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const estadoPuerta = data.results[0].value === 1.0 ? 'Abierto' : 'Cerrado';
            document.getElementById(elementoId).innerText = `Estado: ${estadoPuerta}`;
        })
        .catch(error => {
            console.error(`Error al obtener el estado de la puerta (${elementoId}):`, error);
            document.getElementById(elementoId).innerText = `Error al obtener el estado`;
        });
}

interruptor.addEventListener('change', activarDesactivarObtenerEstado);
