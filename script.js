
document.addEventListener("DOMContentLoaded", function () {
    const cabeza =  document.getElementById('cabeza').querySelector('path');
    const cuerpo =  document.getElementById('torso').querySelector('path');
    const brazoDer =  document.getElementById('brazo-der').querySelector('path');
    const brazoIzq =  document.getElementById('brazo-izq').querySelector('path');
    const piernaDer =  document.getElementById('pierna-der').querySelector('path');
    const piernaIzq =  document.getElementById('pierna-izq').querySelector('path');
    const palabraIngresada = document.getElementById('palabra-ingresada');
    const adivinarPalabra = document.getElementById('adivinar-palabra');
    const btnListo = document.getElementById('mandar-palabra');
    const btnReiniciarPerder = document.getElementById('reiniciar-perder');
    const btnReiniciarGanar = document.getElementById('reiniciar-ganar');
    const abecedario = document.querySelectorAll('.letra');
    const modalBackground = document.querySelector('.modal-background');
    const modalGanar = document.querySelector('.modal-ganar');
    const modalPerder = document.querySelector('.modal-perder');
    const hacha = document.querySelector('.hacha');
    const palabraNoAdivinada = document.getElementById('palabra-no-adivinada');

    let letrasDeshabilitadas = true;
    let totalLetrasAcertadas = 0;
    let errores = 0;
    btnListo.disabled = true;
    deshabilitarLetras();

    

    palabraIngresada.addEventListener('keydown', function (e) {
        const teclaPresionada = e.key;
        if (!/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$/.test(teclaPresionada) && teclaPresionada !== 'Enter') {
            e.preventDefault();
        }
    });

    palabraIngresada.addEventListener('input', function () {
        const palabra = palabraIngresada.value.trim();
        const soloLetras = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$/.test(palabra);

        btnListo.disabled = palabra.length === 0 || !soloLetras;
    });

    function deshabilitarLetras() {
        if(letrasDeshabilitadas){
            abecedario.forEach((letras) => {
                letras.classList.add('deshabilitada');
            });
        } else {
            abecedario.forEach((letras) => {
                letras.classList.remove('deshabilitada');
            });
        }
    }
    
    function habilitarLetras() {
        letrasDeshabilitadas = false;
        deshabilitarLetras();
    }

    function ponerPalabra() {
        const palabra = palabraIngresada.value.toUpperCase();
        adivinarPalabra.innerHTML = '';
        adivinarPalabra.style.display = 'block';
        for (let i = 0; i < palabra.length; i++) {
            const letra = palabra[i];
            const span = document.createElement('span');
            span.textContent = '';
            adivinarPalabra.appendChild(span);
        }
        palabraIngresada.style.display = 'none';
        habilitarLetras();
        btnListo.style.display = 'none';
    }

    function reiniciar() {
        errores = 0;
        totalLetrasAcertadas = 0;
        letraEncontrada = false;
        btnListo.disabled = true;
        palabraIngresada.style.display = 'block';
        palabraIngresada.value = '';
        adivinarPalabra.textContent = '';
        adivinarPalabra.style.display = 'none';
        btnListo.style.display = 'block'
        reiniciarPartesDelCuerpo();
        ocultarModales();
        letrasDeshabilitadas = true;
        deshabilitarLetras();
        abecedario.forEach((letra) => {
            letra.classList.remove('correcta', 'incorrecta');
        });
        palabraIngresada.focus();
    }

    function ocultarModales() {
        hacha.style.display = 'none';
        hacha.classList.remove('animacion-hacha');
        modalGanar.style.display = 'none';
        modalPerder.style.display = 'none';
        modalBackground.style.visibility = 'hidden';
    }

    function mostrarModalPerder() {
        hacha.style.display = 'block';
        hacha.classList.add('animacion-hacha');
        modalBackground.style.visibility = 'visible';
        modalPerder.style.display = 'block';
        btnReiniciarPerder.style.display = 'block';
        palabraNoAdivinada.textContent = 'La palabra ingresada era: ' + palabraIngresada.value;
    }

    function mostrarModalGanar() {
        hacha.style.display = 'block';
        hacha.classList.add('animacion-hacha');
        modalBackground.style.visibility = 'visible';
        modalGanar.style.display = 'block';
        btnReiniciarGanar.style.display = 'block';
    }
    
    function reiniciarPartesDelCuerpo(){
        cabeza.setAttribute('fill', '#0005');
        cuerpo.setAttribute('fill', '#0005');
        brazoDer.setAttribute('fill', '#0005');
        brazoIzq.setAttribute('fill', '#0005');
        piernaDer.setAttribute('fill', '#0005');
        piernaIzq.setAttribute('fill', '#0005');
    }

    function quitarAcentos(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    
    abecedario.forEach((letra) => {
        letra.addEventListener('click', (e) => {
            const letraSeleccionada = e.target.textContent;
            const palabra = palabraIngresada.value.toUpperCase();
            const spans = adivinarPalabra.querySelectorAll('span');
            let letraEncontrada = false;

            if (errores < 6) {
                for (let i = 0; i < palabra.length; i++) {
                    if (quitarAcentos(palabra[i].toUpperCase()) === quitarAcentos(letraSeleccionada)) {
                        spans[i].textContent = letraSeleccionada;
                        letraEncontrada = true;
                        totalLetrasAcertadas ++;
                    }
                }
                if (letraEncontrada) {
                        letra.classList.add('correcta');
                } else {
                    letra.classList.add('incorrecta');
                    errores++;
                    mostrarPartesDelCuerpo(errores);
                }
                if (totalLetrasAcertadas === palabra.length) {
                    mostrarModalGanar();
                }
            } else {
                mostrarModalPerder();
            }
        });
    });
    
    function mostrarPartesDelCuerpo(errores) {
        switch (errores) {
            case 1:
                cabeza.setAttribute('fill', 'url(#grad1)');
                break;
            case 2:
                cuerpo.setAttribute('fill', 'url(#grad1)');
                break;
            case 3:
                brazoDer.setAttribute('fill', 'url(#grad1)');
                break;
            case 4:
                brazoIzq.setAttribute('fill', 'url(#grad1)');
                break;
            case 5:
                piernaDer.setAttribute('fill', 'url(#grad1)');
                break;
            case 6:
                piernaIzq.setAttribute('fill', 'url(#grad1)');
                break;
        }
    }
    
    palabraIngresada.addEventListener('keyup', function (e) {
        if(e.key === 'Enter') {
            btnListo.click();
        }
    })   
    
    btnListo.addEventListener('click', ponerPalabra);
    btnReiniciarPerder.addEventListener('click', reiniciar);
    btnReiniciarGanar.addEventListener('click', reiniciar);
});
