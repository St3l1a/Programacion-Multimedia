const canvas = document.getElementById("gameCanvasNave");
const ctx = canvas.getContext("2d");

// Cargar la imagen de la nave y del enemigo
let imagenNave = new Image();
imagenNave.src = "Imagenes/nave.png"; 
let imagenEnemigo = new Image();
imagenEnemigo.src = "Imagenes/enemigo.png";
let imagenEnemigoTintada = null; // Almacenar la imagen tintada
let nave = { x: 375, y: 550, width: 50, height: 50, color: "#00ff00" };
let balas = [];
let enemigos = [];
let juegoActivo = false;
let direccionEnemigos = 1;
let ultimaActualizacion = Date.now();
let nombreJugador = "";
let imagenesCargadas = 0;

// Verificar carga de imágenes
function verificarCargaImagenes() {
    imagenesCargadas++;
    if (imagenesCargadas === 2) {
        console.log("Todas las imágenes cargadas correctamente");
        actualizarColorEnemigo(); // Tintar enemigo al cargar
    }
}

imagenNave.onload = verificarCargaImagenes;
imagenNave.onerror = function() {
    console.log("Error al cargar la imagen de la nave");
};
imagenEnemigo.onload = verificarCargaImagenes;
imagenEnemigo.onerror = function() {
    console.log("Error al cargar la imagen del enemigo");
};

// Función para tintar la imagen del enemigo
function actualizarColorEnemigo() {
    if (!imagenEnemigo.complete) return;

    // Crear un canvas temporal para manipular la imagen
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imagenEnemigo.width;
    tempCanvas.height = imagenEnemigo.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Dibujar la imagen original
    tempCtx.drawImage(imagenEnemigo, 0, 0);

    // Obtener los datos de los píxeles
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Obtener el color seleccionado
    const colorHex = document.getElementById("colorEnemigo").value;
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);

    // Aplicar el tinte
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // Solo tintar píxeles no transparentes
            data[i] = (data[i] + r) / 2;     // Mezclar rojo
            data[i + 1] = (data[i + 1] + g) / 2; // Mezclar verde
            data[i + 2] = (data[i + 2] + b) / 2; // Mezclar azul
        }
    }

    // Guardar la imagen tintada
    tempCtx.putImageData(imageData, 0, 0);
    imagenEnemigoTintada = new Image();
    imagenEnemigoTintada.src = tempCanvas.toDataURL();
}

function iniciarJuego() {
    if (juegoActivo) return;
    if (!imagenNave.complete || !imagenEnemigo.complete) {
        alert("Esperando a que las imágenes se carguen...");
        return;
    }
    nombreJugador = document.getElementById("playerName").value || "Jugador";
    juegoActivo = true;
    if (enemigos.length === 0) generarEnemigos();
    loop();
}

function pararJuego() {
    juegoActivo = false;
}

function generarEnemigos() {
    enemigos = [];
    for (let i = 0; i < 5; i++) {
        enemigos.push({ x: i * 150 + 50, y: 50, width: 40, height: 30 });
    }
}

function dibujarNave() {
    if (imagenNave.complete) {
        ctx.drawImage(imagenNave, nave.x, nave.y, nave.width, nave.height);
    } else {
        ctx.fillStyle = nave.color;
        ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
    }
}

function dibujarBalas() {
    ctx.fillStyle = "red";
    balas.forEach((bala, index) => {
        ctx.fillRect(bala.x, bala.y, 5, 10);
        bala.y -= 5;
        if (bala.y < 0) balas.splice(index, 1);
    });
}

function dibujarEnemigos() {
    if (imagenEnemigoTintada && imagenEnemigoTintada.complete) {
        enemigos.forEach(enemigo => {
            ctx.drawImage(imagenEnemigoTintada, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        });
    } else if (imagenEnemigo.complete) {
        enemigos.forEach(enemigo => {
            ctx.drawImage(imagenEnemigo, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        });
    } else {
        ctx.fillStyle = "purple";
        enemigos.forEach(enemigo => {
            ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        });
    }
}

function moverEnemigos() {
    let ahora = Date.now();
    if (ahora - ultimaActualizacion < 50) return;
    ultimaActualizacion = ahora;
    
    let cambiarDireccion = false;
    enemigos.forEach(enemigo => {
        enemigo.x += direccionEnemigos * 2;
        if (enemigo.x + enemigo.width > canvas.width || enemigo.x < 0) {
            cambiarDireccion = true;
        }
    });
    if (cambiarDireccion) {
        direccionEnemigos *= -1;
        enemigos.forEach(enemigo => enemigo.y += 20);
    }
}

function detectarColisiones() {
    balas.forEach((bala, balaIndex) => {
        enemigos.forEach((enemigo, enemigoIndex) => {
            if (
                bala.x < enemigo.x + enemigo.width &&
                bala.x + 5 > enemigo.x &&
                bala.y < enemigo.y + enemigo.height &&
                bala.y + 10 > enemigo.y
            ) {
                enemigos.splice(enemigoIndex, 1);
                balas.splice(balaIndex, 1);
            }
        });
    });
}

function dibujarNombre() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Jugador: " + nombreJugador, 10, 30);
}

function mostrarVictoria() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("¡Victoria!", canvas.width / 2, canvas.height / 2);
    juegoActivo = false;
}

function loop() {
    if (!juegoActivo) return;

    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarNave();
    dibujarBalas();
    moverEnemigos();
    dibujarEnemigos();
    detectarColisiones();
    dibujarNombre();
    if (enemigos.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mostrarVictoria();
    } else {
        requestAnimationFrame(loop);
    }
    
}

document.addEventListener("keydown", (event) => {
    if (!juegoActivo) return;
    if (event.key === "ArrowLeft" || event.key === "a" && nave.x > 0) 
        nave.x -= 10;
    if (event.key === "ArrowRight" || event.key === "d" && nave.x < canvas.width - nave.width) 
        nave.x += 10;
    if (event.key === " ") {
        balas.push({ x: nave.x + 22, y: nave.y });
    }
});