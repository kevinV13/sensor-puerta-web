const apiUrl1 = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/sensor1/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';
const apiUrl2 = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/sensor2/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';
const buzzerApiUrl = 'https://industrial.api.ubidots.com/api/v1.6/devices/esp32-iot-puerta/buzzer/values/?token=BBUS-s9v0GaUQ94fObiXsMJRFVezGc8BFN7';

let intervalId;
let eventosPuerta = []; // Lista para almacenar eventos


function activarDesactivarObtenerEstado() {
    const estadoInterruptor = interruptor.checked;
    if (estadoInterruptor) {
        obtenerEstadoPuertas();
        intervalId = setInterval(obtenerEstadoPuertas, 2000); // Cambiado a 2000 milisegundos (2 segundos)
    } else {
        clearInterval(intervalId);
        document.getElementById('Puerta1').innerText = '';
        document.getElementById('Puerta2').innerText = '';
    }
}

function obtenerEstadoPuertas() {
    obtenerEstadoPuerta(apiUrl1, 'Puerta1');
    obtenerEstadoPuerta(apiUrl2, 'Puerta2');
}
function obtenerEstadoPuerta(apiUrl, elementId) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const estadoPuerta = data.results[0].value === 1.0 ? 'Abierto' : 'Cerrado';
            document.getElementById(elementId).innerText = `Estado: ${estadoPuerta}`;

            if (data.results[0].value === 1.0) {
                // Puerta abierta, enviar valor 1.0 al buzzer
                enviarValorBuzzer(1.0);

                // Guardar evento cuando la puerta se abre
                guardarEvento(elementId, estadoPuerta);
            }
        })
        .catch(error => {
            console.error(`Error al obtener el estado de la puerta (${elementId}):`, error);
            document.getElementById(elementId).innerText = `Error al obtener el estado`;
        });
}

function enviarValorBuzzer(valor) {
    fetch(buzzerApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: valor,
        }),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error al enviar el valor al buzzer:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error al enviar el valor al buzzer:', error);
    });
}

function detenerAlarma() {
    enviarValorBuzzer(0.0);
}


function guardarEvento(puerta, estado) {
    const fecha = new Date();
    const evento = {
        puerta: puerta,
        estado: estado,
        fecha: fecha.toLocaleString(),
    };

    eventosPuerta.push(evento);
    mostrarEventos();
}

function mostrarEventos() {
    const eventosContainer = document.getElementById('eventosContainer');
    eventosContainer.innerHTML = '<h1>HISTORIAL</h1>';

    eventosPuerta.forEach(evento => {
        const eventoElement = document.createElement('p');
        eventoElement.innerText = `Puerta: ${evento.puerta}, Estado: ${evento.estado}, Fecha: ${evento.fecha}`;
        eventosContainer.appendChild(eventoElement);
    });
}





const interruptor = document.getElementById('interruptor');
interruptor.addEventListener('change', activarDesactivarObtenerEstado);

// Agregar botón para detener la alarma
const detenerAlarmaButton = document.getElementById('detenerAlarma');
detenerAlarmaButton.addEventListener('click', detenerAlarma);
