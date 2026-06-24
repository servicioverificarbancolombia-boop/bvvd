
var Modal = {
	init: function () {
		this.validacion();
		this.tipoSolicitudFalse();
	},

	validacion: function () {
		/* Validación preguntas modal token responder ----------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/

		$('input.continuar-cambio').click(function () {
			var $nDocumento = $('div.numero-documento');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nDocumento.find('input').val().trim() == '') {
				$('div.numero-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token responder ----------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/

		$('input.continuar-modal').click(function () {
			var $lugarTuristico = $('div.lugar-turistico');
			var $pelicula = $('div.pelicula');
			var $escritor = $('div.escritor');
			var $mascota = $('div.mascota');

			if ($lugarTuristico.find('input').val().trim() == '') {
				$('div.lugar-turistico input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($pelicula.find('input').val().trim() == '') {
				$('div.pelicula input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($escritor.find('input').val().trim() == '') {
				$('div.escritor input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($mascota.find('input').val().trim() == '') {
				$('div.mascota input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token cambiar clave ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.cambiar-clave').click(function () {
			var $numeroDocumento = $('div.n-documento');
			var $clave = $('div.clave');
			var $confirmarClave = $('div.confirmar-clave');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($numeroDocumento.find('input').val().trim() == '') {
				$('div.n-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($clave.find('input').val().trim() == '') {
				$('div.clave input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($confirmarClave.find('input').val().trim() == '') {
				$('div.confirmar-clave input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token asignar clave ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.asignar-token').click(function () {
			var $nDocumento = $('div.n-documento');
			var $codigoActivacíon = $('div.codigo-activacíon');
			var $nSerial = $('div.n-serial');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nDocumento.find('input').val().trim() == '') {
				$('div.n-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($codigoActivacíon.find('input').val().trim() == '') {
				$('div.codigo-activacíon input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nSerial.find('input').val().trim() == '') {
				$('div.n-serial input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token asignar clave personal ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.asignar-clave').click(function () {
			var $nDocumento = $('div.n-documento');
			var $clavePersonal = $('div.clave-personal');
			var $clavePersonalCon = $('div.clave-personal-confirmar');
			var $claveDinamica = $('div.clave-dinamica-token');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nDocumento.find('input').val().trim() == '') {
				$('div.n-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($clavePersonal.find('input').val().trim() == '') {
				$('div.clave-personal input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($clavePersonalCon.find('input').val().trim() == '') {
				$('div.clave-personal-confirmar input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($claveDinamica.find('input').val().trim() == '') {
				$('div.clave-dinamica-token input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token asignar clave personal ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.continuar-config').click(function () {
			var $nDocumento = $('div.n-documento');
			var $clavePersonal = $('div.clave-personal');
			var $clavePersonalCon = $('div.clave-personal-confirmar');
			var $claveDinamica = $('div.clave-dinamica-token');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nDocumento.find('input').val().trim() == '') {
				$('div.n-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($clavePersonal.find('input').val().trim() == '') {
				$('div.clave-personal input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($claveDinamica.find('input').val().trim() == '') {
				$('div.clave-dinamica-token input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token asignar clave personal ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.finalizar-config').click(function (e) {
			e.preventDefault();
			var $pregunta = $('div.pregunta');
			var $respuesta = $('div.respuesta');

			if ($pregunta.find('input').val().trim() == '') {
				$('div.pregunta input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($respuesta.find('input').val().trim() == '') {
				$('div.respuesta input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});

		/* Validación preguntas modal token asignar clave personal ------------------------------------------------------------------
		 ------------------------------------------------------------------------------------------------------------------*/
		$('input.continuar-id').click(function () {

			var $nDocumento = $('div.numero-documento');
			var $nombres = $('div.nombres');
			var $primerApellido = $('div.primer-apellido');
			var $segundoApellido = $('div.segundo-apellido');

			if ($('#option').val().trim() === '0') {
				$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nDocumento.find('input').val().trim() == '') {
				$('div.numero-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($nombres.find('input').val().trim() == '') {
				$('div.nombres input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($primerApellido.find('input').val().trim() == '') {
				$('div.primer-apellido input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			} else if ($segundoApellido.find('input').val().trim() == '') {
				$('div.segundo-apellido input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				return false;
			}
		});
	},
	
	tipoSolicitudFalse : function () {
		$('input:radio[name=formEscribanos\\:solicitud]').attr('checked',false);
	}
};

$(function () {
	Modal.init();

});

function validateEscribamosForm(e) {
	
	var complete = true;
	
	if (e.className === 'btn btn-red enviar-solicitud') {
		var $nCelular = $('div.numero-celular');
		var $tOpcional = $('div.telefono-opcional');
		var $correo = $('div.correo');
		var $correoCon = $('div.correo-confirmar');
		var citySelect = $('#formEscribanos\\:option2');
		var terminos = $('#formEscribanos\\:terminosYCondiciones');
		var mailexpr = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@‌​"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;		
		
		if (citySelect.val().trim() === '-1') {
			$('div.content-select').addClass('error').parent().find('p.error').html('El campo está vacío');
			complete =  false;
		}
		if ($nCelular.find('input').val().trim() == '') {
			$('div.numero-celular input').addClass('error').parent().find('p.error').html('El campo esta vacío');
			complete =  false;
		} 
		if ($nCelular.find('input').val().trim().length < 10 || $nCelular.find('input').val().trim().length > 10 || !/^([0-9])*$/.test($nCelular.find('input').val().trim())) {
			$('div.numero-celular input').addClass('error').parent().find('p.error2').html('El télefono celular ingresado no es válido.');
			complete =  false;
		}
		
		if ( !/^([0-9])*$/.test($tOpcional.find('input').val().trim())) {
			$('div.telefono-opcional input').addClass('error').parent().find('p.error').html('El télefono ingresado no es válido.');
			complete =  false;
		} 
		if ($correo.find('input').val().trim() == '') {
			$('div.correo input').addClass('error').parent().find('p.error2').html('El campo está vacío');
			complete =  false;
		} 
		
		if ($correoCon.find('input').val().trim() == '') {
			$('div.correo-confirmar input').addClass('error').parent().find('p.error').html('El campo esta vacío');
			complete =  false;
		}else if ($correo.find('input').val().trim() !== $correoCon.find('input').val().trim()) {
			$('div.correo-confirmar input').addClass('error').parent().find('p.error').html('Los correos no coinciden');
			complete =  false;
		}  
		
		if($correo.find('input').val().trim().length > 0){
			if (!mailexpr.test($correo.find('input').val().trim())) {
				$('div.correo input').addClass('error').parent().find('p.error2').html('\''+ $correo.find('input').val() +'\' no es válido');
				complete =  false;
			} 
		}
		
		if($correoCon.find('input').val().trim().length > 0){
			if (!mailexpr.test($correoCon.find('input').val().trim())) {
				$('div.correo-confirmar input').addClass('error').parent().find('p.error').html('\''+ $correoCon.find('input').val() +'\' no es válido');
				complete =  false;
			} 
		}
		if ($('#formEscribanos\\:terminosYCondiciones').prop("checked") == false) {
			$('div.botonLeft input').parent().find('p.error').css({'margin': '5px 0px 0px', 'padding' : '0px', 'font-size': '14px', 'color': 'rgb(193, 25, 31)', 'font-family': '"HelveticaNeueLTStdCn"', 'font-style': 'italic'}).html('Debe aceptar terminar y condiciones');
			complete =  false;
		}
		
		return complete;
	}
	
	if (e.className === 'btn btn-red') {
		var $descSolicitud = $('div.desc-solicitud');
		var $arrayTipoSolicitud = $('div.radioSolicitud');
		var $arrayInputTipoSolicitud = $arrayTipoSolicitud.find('input');
		var returnF =  true;
		if ($descSolicitud.find('textarea').val().trim() == '' || $descSolicitud.find('textarea').val().trim() == 'Ingrese el texto aquí...') {
			$('div.desc-solicitud textarea').addClass('error').parent().find('p.error').html('El campo esta vacío');
			returnF =  false;
		}
		
		var tempCont = 0;
		$arrayInputTipoSolicitud.each(function(){
			var isChecked = this.checked;
			if(false == isChecked){
				tempCont++;
			}
		});
		if($arrayInputTipoSolicitud.length === tempCont){
			$arrayInputTipoSolicitud.each(function(){
				var label = $("label[for='"+$(this).attr('id')+"']");
				label.css('color','red');
			});
			returnF =  false;
		}
		
		if(!returnF){
			return false;
		}
		
	}
	
	return true;

}
