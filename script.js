const apiUrl = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/sensor/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';

const audio = document.getElementById('audio');
const detenerAlarmaButton = document.getElementById('detenerAlarma');
const interruptor = document.getElementById('interruptor');

let detenerAudioPresionado = false;
let intervalId;

function detenerAlarma() {
    audio.pause();
    audio.currentTime = 0;
    detenerAudioPresionado = true;
    mostrarOcultarBotonDetener(false);
}

function mostrarOcultarBotonDetener(mostrar) {
    detenerAlarmaButton.style.display = mostrar ? 'inline-block' : 'none';
}

function activarDesactivarObtenerEstado() {
    const estadoInterruptor = interruptor.checked;
    if (estadoInterruptor) {
        obtenerEstadoPuerta();
        intervalId = setInterval(obtenerEstadoPuerta, 1000);
    } else {
        clearInterval(intervalId);
        mostrarOcultarBotonDetener(false);
        document.getElementById('estadoPuerta').innerText = '';
    }
}

function obtenerEstadoPuerta() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const estadoPuerta = data.results[0].value === 1.0 ? 'Abierto' : 'Cerrado';
            document.getElementById('estadoPuerta').innerText = `Estado: ${estadoPuerta}`;

            if (data.results[0].value === 1.0) {
                mostrarOcultarBotonDetener(true); 
                if (!detenerAudioPresionado) {
                    audio.play();
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                }
            } else {
                mostrarOcultarBotonDetener(false); 
                detenerAudioPresionado = false;
                audio.pause();
                audio.currentTime = 0;
            }
        })
        .catch(error => {
            console.error('Error al obtener el estado de la puerta:', error);
            document.getElementById('estadoPuerta').innerText = 'Error al obtener el estado';
        });
}

interruptor.addEventListener('change', activarDesactivarObtenerEstado);
detenerAlarmaButton.addEventListener('click', detenerAlarma);
