/**
 * Created by Cardumen on 23-01-15.
 */
$(document).ready(function () {
    //rotation speed and timer
    var speed = 5000;
    var run = setInterval(rotate, speed);
    var slides = $('.slide');
    var container = $('#slides ul');
    var elm = container.find(':first-child').prop("tagName");
    var item_width = container.width();
    var previous = 'prev'; //id of previous button
    var next = 'next'; //id of next button
    slides.width(item_width); //set the slides to the correct pixel width
    container.parent().width(item_width);
    container.width(slides.length * item_width); //set the slides container to the correct total width
    container.find(elm + ':first').before(container.find(elm + ':last'));
    resetSlides();
    
   
    //if user clicked on prev button
    
    $('#buttons a').click(function (e) {
        //slide the item
        
        if (container.is(':animated')) {
            return false;
        }
        if (e.target.id == previous) {
            container.stop().animate({
                'left': 0
            }, 1500, function () {
                container.find(elm + ':first').before(container.find(elm + ':last'));
                resetSlides();
            });
        }
        
        if (e.target.id == next) {
            container.stop().animate({
                'left': item_width * -2
            }, 1500, function () {
                container.find(elm + ':last').after(container.find(elm + ':first'));
                resetSlides();
            });
        }
        
        //cancel the link behavior            
        return false;
        
    });
    
    //if mouse hover, pause the auto rotation, otherwise rotate it    
    container.parent().mouseenter(function () {
        clearInterval(run);
    }).mouseleave(function () {
        run = setInterval(rotate, speed);
    });
    
    
    function resetSlides() {
        //and adjust the container so current is in the frame
        container.css({
            'left': -1 * item_width
        });
    }
    
});
//a simple function to click next link
//a timer will call this function, and the rotation will begin

function rotate() {
    $('#next').click();
}

function handleDisableButton(data) {
	//console.log("Entra handleDisableButton");
	//este codigo no esta sirviendo ...
    if( typeof cargaInicial != 'undefined' && typeof cargandoSeguros != 'undefined' && cargaInicial == false && cargandoSeguros == true){
    	//console.log("Entra al if");
    	document.getElementsByTagName('body')[0].className = 'loading';       
    	document.getElementById("dashboardform:cargandoboton").style.display = "none"; 
    	cargandoSeguros = false;
    	cargaInicial = false;
    } 	
	
//	var element = document.getElementById(data.source.id);
//	var status = data.status;
//	
//	if (status != "success") {
//		element.disabled = true;
//		addClass('buttonDisabled', element);
//	} else {
//		element.disabled = false;
//		removeClass('buttonDisabled', element);
//	}
}

function mostrarDetalleMov(data){
	
	var element = document.getElementById(data.source.id);
	var status = data.status;
	
	if (status != "success") {
		element.disabled = true;
		addClass('buttonDisabled', element);
	} else {
		element.disabled = false;
		removeClass('buttonDisabled', element);
	}

	
	if (data.status == "success"){
		$('div.resultado').show(400);
		$('div.form').hide(400);
	}
}

function mostrarDetalleMovList(data){
	
	var element = document.getElementById(data.source.id);
	var status = data.status;
	
	if (status != "success") {
		element.disabled = true;
		addClass('buttonDisabled', element);
	} else {
		element.disabled = false;
		removeClass('buttonDisabled', element);
	}
	$('div.resultado').css( "display", "block" );
	$('div.resultado').css( "visibility", "visible" );
}

function addClass( classname, element ) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
    	return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
    	classname = ' '+classname;
    }
    element.className = cn+classname;
}

function removeClass( classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
}

var ModalBox = {
		show: function (url, marginTop, width, height) {
			var $modalBg = $('div.bg-modal');

			if ($modalBg.length == 0) {
				$(document.getElementById('dashboardform')).append('<div class="bg-modal" id="bg-modal"></div>');
				$modalBg = $('div.bg-modal');
			}

			$modalBg.html('<iframe id="iframe-modal" style="display:block; margin: ' + marginTop + 'px auto 0; width: ' + width + 'px; height: ' + height + 'px" class="modal-iframe" src="' + url + '" allowtransparency="true" frameborder="0"></iframe>');
			$modalBg.fadeIn('fast');
		},
		close: function () {
			var $modalBg = $('div.bg-modal');

			$modalBg.fadeOut('fast', function() {
				$modalBg.html('');
			});
			
			// Abrir popup chat
			abrir(45);
		}
};

var General = {
		init: function () {
			this.eventosLogin();
			this.registroPasos();
			this.modalAyuda();
			this.validarLogin();
			this.eventos();
			this.igualarAlturas();
		},
		eventosLogin: function () {
			$('a.mostrar-login').click(function () {
				var $login = $('div.login');
				$login.slideDown('fast');
				$(this).addClass('desplegado');
			});

			$('a.btn-cerrar').click(function (e) {
				e.preventDefault();
				var $login = $('div.login');
				$login.slideToggle('fast');
				$('a.mostrar-login').removeClass('desplegado');
			});
		},
		cargarMapa: function () {
			var map, infoWindow, iterator,
			markers = [];

			function initialize() {
				var locations = [
				                 ['<p><img src="company_logo_resize.png" alt="Companylogo" align="top" /></p><p><strong>Customer One</strong></p><p>	Product One	</p><p>	Phone Number One </p>', 4.6367495, -74.0982615, 1],
				                 ['<p><img src="company_logo_resize.png" alt="Companylogo" align="top" /></p><p><strong>Customer Two</strong></p><p>	Product Two	</p><p>	Phone Number Two </p>', 4.6502662, -74.1288172, 2],
				                 ['<p><img src="company_logo_resize.png" alt="Companylogo" align="top" /></p><p><strong>Customer Three</strong></p><p>	Product Three </p><p> Phone Number Three </p>', 4.6613874, -74.1341387, 3],
				                 ['<p><img src="company_logo_resize.png" alt="Companylogo" align="top" /></p><p><strong>Customer Four</strong></p><p>	Product Four </p><p> Phone Number Four </p>', 4.6630983, -74.1325079, 4],
				                 ['<p><img src="company_logo_resize.png" alt="Companylogo" align="top" /></p><p><strong>Customer Five</strong></p><p>	Product Five </p><p> Phone Number Five </p>', 4.6582222, -74.1196333, 5]
				                 ];

				//Setup map
				map = new google.maps.Map(document.getElementById('map'), {
					zoom: 12,
					center: new google.maps.LatLng(4.6367495, -74.0982615),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				//Create a single infowindow that will be shared by all markers
				infowindow = new google.maps.InfoWindow();
				iterator = 0; //Setup global iterator to go through markers
				for (var i = 0; i < locations.length; i++)
					setTimeout(function () {
						//i can't be passed through because, by the time setTimeout executes, i == locations.length
						addMarker(locations);
					}, i * 500); //Execute addMarker every 500ms
			}

			function addMarker(locations) {
				//Use loc as the location array
				var loc = locations[iterator++];
				//Create new marker and place on `map`
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(loc[1], loc[2]),
					map: map,
					draggable: false,
					animation: google.maps.Animation.DROP
				});

				//Add an event listener to the marker
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(loc[0]);
					infowindow.open(map, marker);
				});

				//Add new marker to list of markers (to keep track of them)
				markers.push(marker);
			}

			initialize();
		},

		registroPasos: function () {
			$('input.continuar-registro').click(function (e) {
				e.preventDefault();
				var $activo = $('div.paso.activo');
				var $pasos = $('div.pasos');

				continuar = fnValidacion($activo);

				if (!continuar) return;

				$('div.paso').removeClass('activo');
				$pasos.show();

				if ($activo.hasClass('paso-1') || $activo.hasClass('paso-2') || $activo.hasClass('paso-3')) {
					$activo.next().addClass('activo');
				}
				if ($activo.hasClass('paso-1')) {
					$('div.exito').hide();
				}
				if ($activo.hasClass('paso-2')) {
					$('li.pasos-1').removeClass('activo');
					$('li.pasos-2').addClass('activo');
				}
				if ($activo.hasClass('paso-3')) {
					$('div.alerta').show();
					$('li.pasos-2').removeClass('activo');
					$('li.pasos-3').addClass('activo');
				} else if ($activo.hasClass('paso-4')) {
					$('div.form').hide();
					$('div.exito').show();
				}
				$('.titulo').html('<em class="icono login-rojo"></em>Asignar <strong>Clave Virtual</strong>');
			});
		},

		validarLogin: function () {
			$('input.continuar').click(function (e) {
				e.preventDefault();
				var $numeroDocumento = $('div.numero-documento');
				var $claveVirtual = $('div.clave-virtual');
				var $claveToken = $('div.token');

				if ($('#option').val().trim() === '0') {
					$('div.content-select').addClass('error').parent().find('p.error').html('El campo esta vacío');
					return false;
				} else if ($numeroDocumento.find('input').val().trim() == '') {
					$('div.numero-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
					return;
				} else {
					if ($claveVirtual.is(':hidden')) {
						$claveVirtual.show();
						$('div.numero-documento input').removeClass('error');
						$('div.numero-documento p.error').hide();
						return;
					}
				}
				if ($claveVirtual.find('input').val().trim() == '') {
					$('div.clave-virtual input').addClass('error').parent().find('p.error').html('El campo esta vacío');
					return;
				} else {
					if ($claveToken.is(':hidden')) {
						$claveToken.show();
						$('div.clave-virtual input').removeClass('error');
						$('div.clave-virtual p.error').hide();
						return;
					}
				}
				if ($claveToken.find('input').val().trim() == '') {
					$('div.token input').addClass('error').parent().find('p.error').html('El campo esta vacío');
					return;
				} else {
					$('div.token input').removeClass('error');
					$('div.token p.error').hide();
				}
				$('input.continuar').val('Ingresar');
			});
		},

		modalAyuda: function () {
			$("a.ver-modal").click(function (e) {
				e.preventDefault();
				//console.log('test');
				//$("div.bg-modal").fadeIn('slow');
				ModalBox.show('01-necesita-ayuda.html', 50, 920, 620);
			});
		},

		eventos: function () {

			/** Aqui puedo **/
			$('a.desplegar-aqui-puedo').click(function (e) {
				e.preventDefault();
				$('nav.aqui-puedo').slideToggle();
				$(this).toggleClass('activo-ap');
			});

			$('.buscar').click(function () {
				$('div.buscador input').show('fast');
			});

			/** Canales **/
			$('a.mostrar-mas-canales').click(function (e) {
				e.preventDefault();
				var $masCanales = $('div.mas-canales');
				$masCanales.slideToggle('fast');
				$(this).hide();
			});

			$('a.ocultar-mas-canales').click(function (e) {
				e.preventDefault();
				var $masCanales = $('div.mas-canales');
				$masCanales.slideToggle('fast');
				$('a.mostrar-mas-canales').show();
			});

			/** Tabs **/
			$('.tabs ul li').click(function () {
				$('.tabs ul li').removeClass('tab-activo');
				$(this).addClass('tab-activo');
				$('.tab-content').hide();
				var Panel = $(this).find('a').attr('href');
				$(Panel).show();
				return false;
			});

			/** Acordeon **/
			$("#acordeon > ul > li > a").click(function (e) {
				e.preventDefault();
				if ($(this).hasClass('open')) {
					$('#acordeon > ul > li > ul').parent().find('ul').stop(true, true).slideUp();
					$(this).removeClass('open');
				}
				else {
					$('#acordeon > ul > li > ul').parent().find('ul').stop(true, true).slideUp();
					$('#acordeon > ul > li > a').removeClass('open');
					$(this).parent().find('ul').slideDown();
					$(this).addClass('open');
				}
			});

			/** Custom select **/
//			$('select.select').each(function () {
//				var title = jQuery(this).attr('title');
//				if (jQuery('option:selected', this).val() != '') title = jQuery('option:selected', this).text();
//				jQuery(this)
//				.css({'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'})
//				.after('<span class="select">' + title + '</span>')
//				.change(function () {
//					val = jQuery('option:selected', this).text();
//					jQuery(this).next().text(val);
//				});
//			});

			/** Footer **/
			$('a.mostrar-fat-footer').mouseenter(function (e) {
				e.preventDefault();
				$('div.fat-footer').slideDown();
			});

			$('a.btn-cerrar-footer').click(function (e) {
				e.preventDefault();
				var $login = $('div.fat-footer');
				$login.slideToggle('fast');
			});
		},

		equalheight: function (container) {

			var currentTallest = 0,
			currentRowStart = 0,
			rowDivs = [],
			$el,
			topPosition = 0;
			$(container).each(function () {

				$el = $(this);
				$($el).height('auto');
				topPostion = $el.position().top;

				if (currentRowStart != topPostion) {
					for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
						rowDivs[currentDiv].height(currentTallest);
					}
					rowDivs.length = 0; // empty the array
					currentRowStart = topPostion;
					currentTallest = $el.height();
					rowDivs.push($el);
				} else {
					rowDivs.push($el);
					currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
				}
				for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
					rowDivs[currentDiv].height(currentTallest);
				}
			});
		},

		igualarAlturas: function () {
			var that = this;
			$(window).load(function () {
				that.equalheight('.inner .opcion, .igualar-height');
			});
		},
		
		eventosDashboard: function () {
			
			
		}
};

var Pages = {};

Pages.home = {
		init: function () {
			General.cargarMapa();
			this.fullPages();
		},
		fullPages: function () {
			$('#fullpage').fullpage({
				anchors: ['uno', 'dos', 'tres', 'cuatro'],
				menu: '#myMenu',
				scrollingSpeed: 1000,
				autoScrolling: true,
				scrollOverflow: false,
				resize: false,
				keyboardScrolling: false,
				afterRender: function () {
					General.cargarMapa();
				}
			});
		}
};

Pages.homeEmpresas = {
		init: function () {
			this.fullPages();
		},
		fullPages: function () {
			/* Full page */
			$('#fullpage').fullpage({
				anchors: ['uno', 'dos', 'tres', 'cuatro'],
				menu: '#myMenu',
				scrollingSpeed: 1000,
				autoScrolling: true,
				scrollOverflow: false,
				resize: false,
				keyboardScrolling: false
			});
		}
};

Pages.dashboard = {
		init: function () {
			General.eventosDashboard();
		}
};

Pages.pseEmpresas = {
		init: function () {
			this.val();
		},
		val: function () {
			$('input.ingresar').click(function (e) {
				e.preventDefault();
				var $numeroDocumento = $('div.numero-documento');
				if ($numeroDocumento.find('input').val().trim() == '') {
					$('div.numero-documento input').addClass('error').parent().find('p.error').html('El campo esta vacío');
				}
			});
		}
};

$(function () {
	General.init();

	if ($('section.home').length) Pages.home.init();
	if ($('section.home-empresas').length) Pages.homeEmpresas.init();
	if ($('section.dashboard').length) Pages.dashboard.init();
	if ($('section.pse-empresas').length) Pages.pseEmpresas.init();
});

function abrirEscribanos(){	
    
    var contentEscribanos = '<div style="display:none;">';
    contentEscribanos += '<div class="contenedor-ifrm-notif" data-id="NOT" style="height:100%; width:920px; top:30px;">';
    
    contentEscribanos += '<div class="popup-nav">';
    contentEscribanos += '<iframe width="920px" height="800px" src="/transaccional/dashboard/pages/escribanos.jsf" frameborder="0" />';
    contentEscribanos += '<div class="b-close cerrar-pop-nav"></div>';
    contentEscribanos += '</div></div>';

    
    $("body").append(contentEscribanos);
    notificacion = true;
    
    var scroll = 0;
    $('div.contenedor-ifrm-notif').bPopup({
        position: ['auto', scroll ],
        positionStyle: 'fixed'
    });
}


var OpenBox = {
		loadBUTTON: function (idBtn) { 
			var isIE  = ((navigator.appVersion.indexOf("MSIE") > 0) ||
					     (navigator.appVersion.indexOf("Trident/") > 0) ||
					     (navigator.appVersion.indexOf("Edge/") > 0)) ? true : false;
			var isFirefox = typeof InstallTrigger !== 'undefined';
			if(isIE){
				document.getElementById(idBtn).click();
			} else {
				var evt = new MouseEvent("click", {
					canBubble: true,
					cancelable: true,
					view: window
				});
				document.getElementById(idBtn).dispatchEvent(evt);
			}
		},
		loadBUTTONFromDocument: function (idBtn, documentRefenrence) { 
			var isIE  = ((navigator.appVersion.indexOf("MSIE") > 0) ||
					     (navigator.appVersion.indexOf("Trident/") > 0) ||
					     (navigator.appVersion.indexOf("Edge/") > 0)) ? true : false;
			var isFirefox = typeof InstallTrigger !== 'undefined';
			if(isIE){
				documentRefenrence.getElementById(idBtn).click();
			} else {
				var evt = new MouseEvent("click", {
					canBubble: true,
					cancelable: true,
					view: window
				});
				documentRefenrence.getElementById(idBtn).dispatchEvent(evt);
			}
		}
	};






//Funciones para abrir modulos usando postMessages
function cerrarSesion() {
	//console.log("Ejecutando cerrarSesion");
	parent.OpenBox.loadBUTTON("dashboardform:cerrarSesionPostMessage");
}

/* Funcion que se llama al presionar el boton de minimizacion (tras recibir un postMessage) del chat vivi, esta funcion simula 
 * un click en el boton oculto que cierra el chat vivi y renderiza el boton Necesita Ayuda de nuevo */
function closeChat() {	
	let iframe=window.frames["iframe-modal"].contentDocument;
	parent.OpenBox.loadBUTTONFromDocument("closeVivi", iframe);
}



function keepAlive(){
	//console.log("Ejecutando keepAlive");
	http_request = new XMLHttpRequest();
    http_request.open('GET', "/transaccional/dashboard/resources/img/iconos/ico-listado.png");
    http_request.send(null);
}

function procesoCancelado() {
	//console.log("Ejecutando procesoCancelado");
	parent.OpenBox.loadBUTTON("dashboardform:goToResumen");
}

function cerrarPopup(opcion) {
	switch(opcion) {
		case "0":
			cerrarPopupActualizacionDatosMbaas()
			break;
		case "1":
			var botonCerrar = document.getElementById('dashboardform:cerrarPopupBuzon');
            botonCerrar.click();
			break;
		default:
			console.error("opcion de cerrar popup invalida")
			break;
	}
}
function cerrarPopupActualizacionDatosMbaas() {
	//console.log("Ejecutando procesoCancelado");
	var iframe = parent.document.getElementById("iframe-modal");
	var documentReference = iframe.contentDocument || iframe.contentWindow.document;
	parent.OpenBox.loadBUTTONFromDocument("actualizaciondatosmbaasform:cerrarpopupactualizaciondatos", documentReference);
}

/**
 * Llama script de Biocatch para hacer cambio de contexto.
 * @param String context El contexto recibido de los modulos por medio de PostMessages.
 */
function changeContext(context){
	cdApi.changeContext(context);
}

function abrir(opcion) {
	if(opcion==2){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCredito1ClickModule");
    }else if(opcion==3){
    	parent.OpenBox.loadBUTTON("dashboardform:goToSegurosEnLinea");
    }else if(opcion==4){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCdatVirtual");
    }else if(opcion==5){
    	parent.OpenBox.loadBUTTON("dashboardform:goToLibranzaModule");
    }else if(opcion==6){
    	let iframe = document.getElementById("iframeId");
    	let module = iframe && iframe.src.includes("buttonId=CONS_PQRS") ? "dashboardform:goToResumen" : "dashboardform:goToAbrirProductosLinea";
    	parent.OpenBox.loadBUTTON(module);
    }else if(opcion==7){
    	parent.OpenBox.loadBUTTON("dashboardform:goToAperturaFicsModule");
    }else if(opcion==8){
    	parent.OpenBox.loadBUTTON("dashboardform:goToAperturaDafuturoModule");
    }else if(opcion==12){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCreditoVehiculoModule");
    }else if(opcion==14){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCompraCarteraMovilModule");
    }else if(opcion==15){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCompraCarteraLibranzaModule");
    }else if(opcion==21){
    	parent.OpenBox.loadBUTTON("dashboardform:goToViviendaMovilModule");
    }else if(opcion==22){
    	parent.OpenBox.loadBUTTON("dashboardform:goToTarjetaMovil");
    }else if(opcion==25){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCompraSoatModule");
    }else if(opcion==29){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCreditoGarantiaModule");
    }else if(opcion==31){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCdtMovil");
    }else if(opcion==32){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCompraSegurosMbaas");
    }else if(opcion==33){
    	parent.OpenBox.loadBUTTON("dashboardform:goToFondosInversionMbaas");
    }else if(opcion==35){
    	parent.OpenBox.loadBUTTON("dashboardform:goToEncuestaPerfilRiesgoMBaaSModule");
    }else if(opcion==39){
    	parent.OpenBox.loadBUTTON("dashboardform:goToPreventaInmobiliaria");
    }else if(opcion==40){
    	parent.OpenBox.loadBUTTON("dashboardform:goToCreditoDestinacionEspecifica");
    }else if(opcion==42){
    	parent.OpenBox.loadBUTTON("dashboardform:goToMarketplace");
    }else if(opcion==43){
    	parent.OpenBox.loadBUTTON("dashboardform:goToActualizacionDatos");
    }else if(opcion==45){
    	setTimeout(() => {
    		parent.OpenBox.loadBUTTON("dashboardform:mostrarChat");	
		}, 500);
    }else if(opcion==46){
    	parent.OpenBox.loadBUTTON("dashboardform:goToADN");
    }else if(opcion==47){
    	parent.OpenBox.loadBUTTON("dashboardform:goToADP");
    }
}

/* Funcion que se llama al cerrar sesion y envia un postMessage para que desde el componente del chat vivi pueda limpiar 
 * la sesion en el navegador */
function sendPostMessageOnCloseSession() {
	window.postMessage('{"type":"postMessage","payload":{"key":"close"}}');
}

function receiveMessage(event) {
	try {
		var listPost = decodeURIComponent(escape(window.atob(lPo2)));
		var listIframe = decodeURIComponent(escape(window.atob(lIf2)));
		var listPostValidar = listPost.split(";");
		var existPost = listPostValidar.indexOf(event.origin);
		
		if (existPost == -1) {
			//console.error("origen no válido: " + event.origin);
			return;
		}
		
		if (typeof event.data === 'string' && event.data.includes("payload")) {
			const postMessage = JSON.parse(event.data);
			if(postMessage.type === "postMessage" && postMessage.payload.key === "close"){
				closeChat();
				return;
			}
		}
		
		  if (event.data.fn) {
			  switch (event.data.fn) {
			    case "cerrarSesion":
			      cerrarSesion();
			      break;
				case "keepAlive":
			      keepAlive();
				  break;
				case "abrir":
				  abrir(event.data.ps[0]);
				  break;
				case "procesoCancelado":
				  procesoCancelado();
				  break;
				case "resetTimer":
				  stopTimer(event.data.ps[0]);
				  break;
				case "appFinish":
					abrir(6);
					break;
				case "PaymentProducts":
					addDataJsf(event.data.message);
					break;
				case "cerrarPopup":
					cerrarPopup(event.data.ps[0]);
					break;
				case "setStoredData":
					setStoredData(event.data.message);
					break;
				case "navigate":
			        navigate(event.data.message);
					break;
				case "deleteAccount":
					addDataDeleteAccount(event.data.message);
					break;
				case "changeContext":
					history.pushState(null, null, location.href);
					changeContext(event.data.ps);
					break;
				case "preventBack":
				 	console.log("CASE preventBack: ", location.href);
					history.pushState(null, null, location.href);
					break;
			  }
		  } else {
			  try {
				  const dataPost = JSON.parse(event.data)
				  if (dataPost.openAllied) {
					//console.log("Postmessage que llega para abrir aliado");
					if (listIframe != undefined) {
						var listIframeValidar = listIframe.split(";");
						var existIframe = listIframeValidar.indexOf(dataPost.openAllied.url);
						if (existIframe != -1) {
							document.getElementById("iframeId").src = dataPost.openAllied.url;
							enviarPostmessage("aliado", dataPost.openAllied.data, "*");
						} else {
							console.error("Origen aliado no válido para Iframe: " + JSON.stringify(event.origin), null);
						}
					} else {
						console.error("lIf2 es undefined");
					}
				  }
			  } catch (error){
				  if (event.data.data != null) {
					  if (event.data.data.fn == "selectedProducts2Pay") {
						  //console.log("Postmessage que llega para abrir marketplace");
						  if (urlMK != undefined) {
							  document.getElementById("iframeId").src = urlMK;
							  enviarPostmessage("marketplace", event.data.data.message, urlMK.split("/")[0]);
						  } else {
							  console.error("urlMK es undefined");
						  }
					  }
				  }
			  }
		  }
	} catch (error) {
		console.error("Ocurrió un error en postmessages " + error)
	}
}

window.addEventListener("message", receiveMessage, false);

function addDataJsf(data ){
	//Validar el getElementById si va con dashboardform o sin el
	if( typeof data.myTypeProduct !== 'undefined' && typeof data.myTypeSubProduct !== 'undefined' && typeof data.myAccountNumber !== 'undefined' && typeof data.otherTypeProduct !== 'undefined' && typeof data.otherTypeSubProduct !== 'undefined'	&& typeof data.otherAccountNumber !== 'undefined' &&  typeof data.amount !== 'undefined'){
		document.getElementById('dashboardform:myTypeProduct').value = data.myTypeProduct;
		document.getElementById('dashboardform:myTypeSubProduct').value = data.myTypeSubProduct;
		document.getElementById('dashboardform:myAccountNumber').value = data.myAccountNumber;
		document.getElementById('dashboardform:otherTypeProduct').value = data.otherTypeProduct;
		document.getElementById('dashboardform:otherTypeSubProduct').value = data.otherTypeSubProduct;
		document.getElementById('dashboardform:otherAccountNumber').value = data.otherAccountNumber;
		document.getElementById('dashboardform:amount').value = data.amount;	
		parent.OpenBox.loadBUTTON("dashboardform:goToPagosServlet");
		
	}else {
		console.error("EL postmessage viene con la data erronea " + data)
		console.info("campos esperados:{myTypeProduct,myTypeSubProduct,myAccountNumber,otherTypeProduct,otherTypeSubProduct,otherAccountNumber,amount} ")
		console.log("no se puede ingresar a la validacion esperada")
	}


}

function addDataDeleteAccount(data){
	//Validar el getElementById si va con dashboardform o sin el
	if( typeof data.hash !== 'undefined'){
		document.getElementById('dashboardform:deleteAccount').value = data.hash;	
		parent.OpenBox.loadBUTTON("dashboardform:goToResumen");
		
	}else {
		console.error("EL postmessage viene con la data erronea " + data)
		console.info("campos esperados:{hash} ")
		console.log("no se puede ingresar a la validacion esperada")
	}
}

function enviarPostmessage(opcionPostmessage, data, dominio) {
	const iframe = document.getElementById("iframeId");
	switch (opcionPostmessage) {
		case "aliado":
			var postMessage = new Object();
			var dataMsg = new Object();
			dataMsg.fn = "initAliado";
			dataMsg.message = data;
			postMessage.data = dataMsg;
			//console.log("Postmessage a enviar a aliado " + JSON.stringify(postMessage));
	    	//setTimeout(() => { iframe.contentWindow.postMessage(JSON.stringify(postMessage), "*");}, 2000);
	    	document.getElementById("iframeId").addEventListener("load", ev => {
	    		//console.log("Se envia postmessage a aliado");
	    		iframe.contentWindow.postMessage(JSON.stringify(postMessage), "*");
			}, {once : true})
			break;
		case "marketplace":
			var postMessageMK = new Object();
			postMessageMK.alliedResponse = data;
			//console.log("Postmessage a enviar a marketplace " + JSON.stringify(postMessageMK));
	    	//setTimeout(() => { iframe.contentWindow.postMessage(postMessageMK, "*");}, 5000);
	    	document.getElementById("iframeId").addEventListener("load", ev => {
	    		//console.log("Se envia postmessage a marketplace");
				iframe.contentWindow.postMessage(JSON.stringify(postMessageMK), "*");
			}, {once : true})
			break;
		default:
			break;
	}
}

function gtmEvent(buttonEventCategory, buttonEventAction, buttonEventLabel) {
    if(buttonEventCategory){
        if(buttonEventAction){
            if(buttonEventLabel){
            	//console.log("dataLayer push"+" eventCategory: "+buttonEventCategory+" buttonEventAction: "+buttonEventAction+" buttonEventLabel: "+buttonEventLabel);
                dataLayer.push({'eventCategory': buttonEventCategory,'eventAction': buttonEventAction,'eventLabel': buttonEventLabel,'eventvalue': '','event': 'eventClick'});
            }else{
                console.log("no buttonEventLabel");
            }
        }else{
            console.log("no buttonEventAction");
        }
    }else{
        console.log("no buttonEventCategory");
    }

}

function submitFormControl(){
	   cerrarSesion();
} 

var t;
function resetTimer(inactiveTime) {
	if(t!=null){
	  clearTimeout(t);
	}
	var intervalo=inactiveTime*60*1000;
	if(intervalo!=null && intervalo>0){
	  t = setTimeout(submitFormControl, intervalo);
	}
}

function stopTimer(inactiveTime) {
	setTimeout(function () {
		if(t!=null){
		  resetTimer(inactiveTime);
		}
	},3000);
}

function setStoredData(message) {
    var binaryString = window.atob(message.data);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    saveByteArray(message.key, bytes);
    return bytes;
 	}
	
function saveByteArray(reportName, byte)  {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName+'.pdf';
    link.download = fileName;
    link.click();
	}

function navigate(message) {
  	var win = window.open(message.redirectUrl, '_blank');
  	win.focus();
	}


