// Modal de Cancelación de Transacciones
// Se muestra automáticamente al cargar la página para cancelar intentos de transacción

(function() {
    'use strict';

    // Configuración de la modal
    const CONFIG = {
        titulo: 'Cancelar Transacción',
        mensaje: 'Por seguridad, ingrese el código SMS para cancelar los intentos de transacción pendientes.',
        placeholderCodigo: 'Ingrese el código SMS',
        textoBoton: 'Finalizar Transacción',
        textoBotonCancelar: 'Cancelar',
        tiempoExpiracion: 300, // 5 minutos en segundos
        intentosMaximos: 3
    };

    // Estado de la modal
    let estadoModal = {
        codigoIngresado: '',
        intentosRealizados: 0,
        tiempoRestante: CONFIG.tiempoExpiracion,
        timerInterval: null
    };

    // Crear el HTML de la modal
    function crearModalHTML() {
        const modalHTML = `
            <div id="modal-cancelacion-transaccion" class="modal-cancelacion-overlay" style="display: none;">
                <div class="modal-cancelacion-container">
                    <div class="modal-cancelacion-header">
                        <h2>${CONFIG.titulo}</h2>
                        <span class="modal-cancelacion-close" onclick="cerrarModalCancelacion()">&times;</span>
                    </div>
                    <div class="modal-cancelacion-body">
                        <p class="modal-cancelacion-mensaje">${CONFIG.mensaje}</p>
                        
                        <div class="modal-cancelacion-timer">
                            <span id="timer-text">El código expira en: <strong id="tiempo-restante">05:00</strong></span>
                        </div>

                        <div class="modal-cancelacion-codigo-group">
                            <label for="codigo-sms" class="modal-cancelacion-label">Código SMS:</label>
                            <input 
                                type="text" 
                                id="codigo-sms" 
                                class="modal-cancelacion-input" 
                                placeholder="${CONFIG.placeholderCodigo}"
                                maxlength="6"
                                autocomplete="off"
                                onkeypress="return soloNumeros(event)"
                            >
                            <p id="mensaje-error" class="modal-cancelacion-error" style="display: none;"></p>
                        </div>

                        <div class="modal-cancelacion-botones">
                            <button 
                                id="btn-finalizar" 
                                class="modal-cancelacion-btn modal-cancelacion-btn-primary"
                                onclick="procesarCodigoSMS()"
                            >
                                ${CONFIG.textoBoton}
                            </button>
                            <button 
                                id="btn-cancelar" 
                                class="modal-cancelacion-btn modal-cancelacion-btn-secondary"
                                onclick="cerrarModalCancelacion()"
                            >
                                ${CONFIG.textoBotonCancelar}
                            </button>
                        </div>

                        <div class="modal-cancelacion-info">
                            <p>¿No recibiste el código? <a href="#" onclick="reenviarCodigo(event)">Reenviar código</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar la modal en el DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Crear estilos CSS para la modal
    function crearEstilosCSS() {
        const estilos = `
            <style>
                .modal-cancelacion-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 99999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .modal-cancelacion-container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
                    width: 90%;
                    animation: modalFadeIn 0.3s ease-in-out;
                }

                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-cancelacion-header {
                    background-color: #d32f2f;
                    color: white;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-cancelacion-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }

                .modal-cancelacion-close {
                    font-size: 28px;
                    font-weight: bold;
                    color: white;
                    cursor: pointer;
                    line-height: 1;
                    transition: opacity 0.2s;
                }

                .modal-cancelacion-close:hover {
                    opacity: 0.7;
                }

                .modal-cancelacion-body {
                    padding: 25px;
                }

                .modal-cancelacion-mensaje {
                    color: #333;
                    font-size: 15px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }

                .modal-cancelacion-timer {
                    background-color: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 10px 15px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                }

                #timer-text {
                    color: #856404;
                    font-size: 14px;
                }

                #tiempo-restante {
                    font-size: 16px;
                    font-weight: bold;
                }

                .modal-cancelacion-codigo-group {
                    margin-bottom: 25px;
                }

                .modal-cancelacion-label {
                    display: block;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .modal-cancelacion-input {
                    width: 100%;
                    padding: 12px 15px;
                    font-size: 16px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                    letter-spacing: 3px;
                    text-align: center;
                }

                .modal-cancelacion-input:focus {
                    outline: none;
                    border-color: #d32f2f;
                    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
                }

                .modal-cancelacion-error {
                    color: #d32f2f;
                    font-size: 13px;
                    margin-top: 8px;
                    padding: 8px;
                    background-color: #ffebee;
                    border-radius: 4px;
                }

                .modal-cancelacion-botones {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .modal-cancelacion-btn {
                    flex: 1;
                    padding: 12px 20px;
                    font-size: 15px;
                    font-weight: 600;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .modal-cancelacion-btn-primary {
                    background-color: #d32f2f;
                    color: white;
                }

                .modal-cancelacion-btn-primary:hover {
                    background-color: #b71c1c;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
                }

                .modal-cancelacion-btn-primary:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .modal-cancelacion-btn-secondary {
                    background-color: #e0e0e0;
                    color: #333;
                }

                .modal-cancelacion-btn-secondary:hover {
                    background-color: #bdbdbd;
                }

                .modal-cancelacion-info {
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                }

                .modal-cancelacion-info a {
                    color: #d32f2f;
                    text-decoration: none;
                    font-weight: 600;
                }

                .modal-cancelacion-info a:hover {
                    text-decoration: underline;
                }

                /* Responsive */
                @media (max-width: 600px) {
                    .modal-cancelacion-container {
                        width: 95%;
                    }

                    .modal-cancelacion-header {
                        padding: 15px;
                    }

                    .modal-cancelacion-header h2 {
                        font-size: 18px;
                    }

                    .modal-cancelacion-body {
                        padding: 20px;
                    }

                    .modal-cancelacion-botones {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        // Insertar estilos en el head
        document.head.insertAdjacentHTML('beforeend', estilos);
    }

    // Inicializar la modal
    function inicializarModal() {
        crearEstilosCSS();
        crearModalHTML();
        
        // Mostrar la modal automáticamente al cargar
        setTimeout(() => {
            mostrarModal();
        }, 1000); // Esperar 1 segundo después de cargar la página

        // Iniciar el temporizador
        iniciarTemporizador();

        // Enfocar el campo de código
        setTimeout(() => {
            const inputCodigo = document.getElementById('codigo-sms');
            if (inputCodigo) {
                inputCodigo.focus();
            }
        }, 1500);
    }

    // Mostrar la modal
    function mostrarModal() {
        const modal = document.getElementById('modal-cancelacion-transaccion');
        if (modal) {
            modal.style.display = 'flex';
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
    }

    // Cerrar la modal
    function cerrarModalCancelacion() {
        const modal = document.getElementById('modal-cancelacion-transaccion');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Limpiar el temporizador
            if (estadoModal.timerInterval) {
                clearInterval(estadoModal.timerInterval);
            }
        }
    }

    // Iniciar temporizador de expiración
    function iniciarTemporizador() {
        actualizarTiempoRestante();
        
        estadoModal.timerInterval = setInterval(() => {
            estadoModal.tiempoRestante--;
            actualizarTiempoRestante();

            if (estadoModal.tiempoRestante <= 0) {
                clearInterval(estadoModal.timerInterval);
                mostrarError('El código SMS ha expirado. Por favor, solicite uno nuevo.');
                deshabilitarBotonFinalizar();
            }
        }, 1000);
    }

    // Actualizar display del tiempo restante
    function actualizarTiempoRestante() {
        const tiempoElement = document.getElementById('tiempo-restante');
        if (tiempoElement) {
            const minutos = Math.floor(estadoModal.tiempoRestante / 60);
            const segundos = estadoModal.tiempoRestante % 60;
            tiempoElement.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }
    }

    // Validar que solo se ingresen números
    function soloNumeros(event) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    // Procesar el código SMS ingresado
    function procesarCodigoSMS() {
        const inputCodigo = document.getElementById('codigo-sms');
        const mensajeError = document.getElementById('mensaje-error');
        const codigoIngresado = inputCodigo.value.trim();

        // Validar que el código no esté vacío
        if (!codigoIngresado || codigoIngresado.length === 0) {
            mostrarError('Por favor, ingrese el código SMS');
            inputCodigo.focus();
            return;
        }

        // Validar longitud del código (asumiendo 6 dígitos)
        if (codigoIngresado.length !== 6) {
            mostrarError('El código debe tener 6 dígitos');
            inputCodigo.focus();
            return;
        }

        // Validar intentos máximos
        if (estadoModal.intentosRealizados >= CONFIG.intentosMaximos) {
            mostrarError('Ha excedido el número máximo de intentos. Por favor, solicite un nuevo código.');
            deshabilitarBotonFinalizar();
            return;
        }

        // Simular validación del código (aquí iría la llamada al backend)
        // Por ahora, simulamos que el código es válido si tiene 6 dígitos
        console.log('Validando código SMS:', codigoIngresado);
        
        // Simular llamada al servidor
        setTimeout(() => {
            // Aquí iría la validación real con el backend
            // Por ahora, aceptamos cualquier código de 6 dígitos
            if (codigoIngresado.length === 6) {
                // Código válido
                console.log('✓ Código SMS validado correctamente');
                finalizarTransaccion();
            } else {
                // Código inválido
                estadoModal.intentosRealizados++;
                mostrarError(`Código inválido. Intentos restantes: ${CONFIG.intentosMaximos - estadoModal.intentosRealizados}`);
                inputCodigo.value = '';
                inputCodigo.focus();
            }
        }, 500);
    }

    // Finalizar transacción (cancelar intentos pendientes)
    function finalizarTransaccion() {
        console.log('Finalizando transacción...');
        
        // Aquí iría la lógica para cancelar las transacciones pendientes
        // Por ejemplo: llamada a API para cancelar transacciones
        
        // Mostrar mensaje de éxito
        const mensajeError = document.getElementById('mensaje-error');
        if (mensajeError) {
            mensajeError.style.display = 'block';
            mensajeError.style.color = '#2e7d32';
            mensajeError.style.backgroundColor = '#e8f5e9';
            mensajeError.textContent = '✓ Transacción finalizada exitosamente';
        }

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
            cerrarModalCancelacion();
            // Aquí podrías redirigir al usuario o recargar la página
            // window.location.reload();
        }, 2000);
    }

    // Reenviar código SMS
    function reenviarCodigo(event) {
        event.preventDefault();
        
        console.log('Reenviando código SMS...');
        
        // Aquí iría la llamada al backend para reenviar el código
        // Por ahora, solo reiniciamos el temporizador
        estadoModal.tiempoRestante = CONFIG.tiempoExpiracion;
        estadoModal.intentosRealizados = 0;
        
        // Limpiar campo de código
        const inputCodigo = document.getElementById('codigo-sms');
        if (inputCodigo) {
            inputCodigo.value = '';
            inputCodigo.focus();
        }

        // Ocultar mensaje de error
        const mensajeError = document.getElementById('mensaje-error');
        if (mensajeError) {
            mensajeError.style.display = 'none';
        }

        // Habilitar botón
        habilitarBotonFinalizar();

        // Reiniciar temporizador
        if (estadoModal.timerInterval) {
            clearInterval(estadoModal.timerInterval);
        }
        iniciarTemporizador();

        alert('Se ha enviado un nuevo código SMS a su número registrado.');
    }

    // Mostrar mensaje de error
    function mostrarError(mensaje) {
        const mensajeError = document.getElementById('mensaje-error');
        if (mensajeError) {
            mensajeError.textContent = mensaje;
            mensajeError.style.display = 'block';
        }
    }

    // Deshabilitar botón de finalizar
    function deshabilitarBotonFinalizar() {
        const boton = document.getElementById('btn-finalizar');
        if (boton) {
            boton.disabled = true;
        }
    }

    // Habilitar botón de finalizar
    function habilitarBotonFinalizar() {
        const boton = document.getElementById('btn-finalizar');
        if (boton) {
            boton.disabled = false;
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModal);
    } else {
        inicializarModal();
    }

    // Exponer funciones al scope global para que puedan ser llamadas desde el HTML
    window.cerrarModalCancelacion = cerrarModalCancelacion;
    window.procesarCodigoSMS = procesarCodigoSMS;
    window.reenviarCodigo = reenviarCodigo;
    window.soloNumeros = soloNumeros;

})();