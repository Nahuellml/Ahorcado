
document.addEventListener("DOMContentLoaded", function () {
    const cabeza = document.querySelector('.cabeza');
    const cuerpo = document.querySelector('.cuerpo');
    const brazoDer = document.querySelector('.brazo-der');
    const brazoIzq = document.querySelector('.brazo-izq');
    const piernaDer = document.querySelector('.pierna-der');
    const piernaIzq = document.querySelector('.pierna-izq');
    const palabraIngresada = document.getElementById('palabra-ingresada');
    const adivinarPalabra = document.getElementById('adivinar-palabra');
    const btnListo = document.getElementById('mandar-palabra');
    const btnReiniciarPerder = document.getElementById('reiniciar-perder');
    const btnReiniciarGanar = document.getElementById('reiniciar-ganar');
    const abecedario = document.querySelectorAll('.letra');
    const modalBackground = document.querySelector('.modal-background');
    const modalGanar = document.querySelector('.modal-ganar');
    const modalPerder = document.querySelector('.modal-perder');

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
        modalGanar.style.display = 'none';
        modalPerder.style.display = 'none';
        modalBackground.style.visibility = 'hidden';
    }

    function mostrarModalPerder() {
        modalBackground.style.visibility = 'visible';
        modalPerder.style.display = 'block';
        btnReiniciarPerder.style.display = 'block';
    }

    function mostrarModalGanar() {
        modalBackground.style.visibility = 'visible';
        modalGanar.style.display = 'block';
        btnReiniciarGanar.style.display = 'block';
    }
    
    function reiniciarPartesDelCuerpo(){
        cabeza.style.opacity = '0';
        cuerpo.style.opacity = '0';
        brazoDer.style.opacity = '0';
        brazoIzq.style.opacity = '0';
        piernaDer.style.opacity = '0';
        piernaIzq.style.opacity = '0';
    }

    abecedario.forEach((letra) => {
        letra.addEventListener('click', (e) => {
            const letraSeleccionada = e.target.textContent;
            const palabra = palabraIngresada.value.toUpperCase();
            const spans = adivinarPalabra.querySelectorAll('span');
            let letraEncontrada = false;

            if (errores < 6) {
                for (let i = 0; i < palabra.length; i++) {
                    if (palabra[i].toUpperCase() === letraSeleccionada) {
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
                cabeza.style.opacity = '1';
                break;
            case 2:
                cuerpo.style.opacity = '1';
                break;
            case 3:
                brazoDer.style.opacity = '1';
                break;
            case 4:
                brazoIzq.style.opacity = '1';
                break;
            case 5:
                piernaDer.style.opacity = '1';
                break;
            case 6:
                piernaIzq.style.opacity = '1';
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
