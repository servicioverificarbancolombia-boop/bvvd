let initLoader = 0;
let velocidad = 5; // entre mayor sea el numero mayor carga el boton solo numeros enteros

const loaderBtn = () =>{
    let elemento = document.getElementById('popupChat:idBtnHelp');
    if(initLoader === 0){
        elemento.children[1].innerHTML = 'Cargando...';
        console.log(elemento.children[1].innerHTML);
    }
    if(initLoader < 100){
        requestAnimationFrame(loaderBtn)
        initLoader = initLoader + velocidad;
        let valor = 'linear-gradient(90deg, #B70412 ' + initLoader + '%, #E1111C 0px)';
        elemento.style.backgroundImage = valor;
    }
}

const ocultBtn = () =>{
    let elemento = document.getElementById('popupChat:idBtnHelp');
    elemento.children[1].innerHTML = '¿Necesita ayuda?';
    elemento.style.backgroundImage = '';
    elemento.style.display = 'none';
}

const viewBtn = () =>{
	let elemento = document.getElementById('popupChat:idBtnHelp');
	elemento.style.display = 'flex';
}