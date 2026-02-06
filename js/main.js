/**
 * Proyecto: Simulador de Partículas 2D - POO
 * Autora: Diana Denise Campos Lozano
 * Carrera: Ingeniería en TIC, 9° Semestre
 */

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Referencias a los desplazadores (Sliders)
const sliderCant = document.getElementById("slider");
const sliderAncho = document.getElementById("sliderAncho");
const sliderAlto = document.getElementById("sliderAlto");

// Referencias a las etiquetas de texto
const valorLabel = document.getElementById("valorSlider");
const valorAncho = document.getElementById("valorAncho");
const valorAlto = document.getElementById("valorAlto");

// --- LÓGICA DE LÍMITES AL 75% ---
// Calculamos el máximo permitido según la pantalla del usuario (75% máximo)
const maxW = Math.floor(window.innerWidth * 0.75);
const maxH = Math.floor(window.innerHeight * 0.75);

// Configuramos los límites máximos de los sliders dinámicamente
sliderAncho.max = maxW;
sliderAlto.max = maxH;

// Configuración inicial del canvas (Inicia al 80% del límite permitido)
canvas.width = Math.floor(maxW * 0.8);
canvas.height = Math.floor(maxH * 0.8);

// Sincronizamos los sliders con el tamaño inicial
sliderAncho.value = canvas.width;
sliderAlto.value = canvas.height;
valorAncho.innerText = canvas.width + "px";
valorAlto.innerText = canvas.height + "px";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.radius = radius;
    // Asegura que el círculo no nazca fuera de los bordes actuales
    this.posX = Math.max(this.radius, Math.min(x, canvas.width - this.radius));
    this.posY = Math.max(this.radius, Math.min(y, canvas.height - this.radius));
    this.color = color;
    this.text = text;
    this.speed = speed;

    // Ángulo aleatorio para que cada uno salga hacia un lado distinto (360 grados)
    let randomAngle = Math.random() * Math.PI * 2; 
    this.dx = Math.cos(randomAngle) * this.speed;
    this.dy = Math.sin(randomAngle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    // El tamaño de la fuente se adapta al radio del círculo
    let fontSize = Math.floor(this.radius * 0.7);
    context.font = `bold ${fontSize}px Arial`;
    
    // Texto en blanco para resaltar sobre el fondo oscuro del canvas
    context.fillStyle = "white"; 
    context.fillText(this.text, this.posX, this.posY);
    
    context.lineWidth = 3;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // --- REBOTE DINÁMICO ---
    // Detecta los bordes actuales del canvas (por si se movieron los sliders)
    if ((this.posX + this.radius) >= canvas.width || (this.posX - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.posY + this.radius) >= canvas.height || (this.posY - this.radius) <= 0) {
      this.dy = -this.dy;
    }

    this.posX += this.dx;
    this.posY += this.dy;
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

let arrayCirculos = [];

// Función para generar los círculos con parámetros aleatorios
function crearCirculos(cantidad) {
  arrayCirculos = []; 
  for (let i = 0; i < cantidad; i++) {
    // Genera un radio distinto para cada círculo
    let radioAleatorio = randomInRange(15, 40); 
    let velocidad = randomInRange(3, 8);
    let color = `hsl(${Math.random() * 360}, 70%, 50%)`;

    arrayCirculos.push(
      new Circle(
        randomInRange(radioAleatorio, canvas.width - radioAleatorio),
        randomInRange(radioAleatorio, canvas.height - radioAleatorio),
        radioAleatorio,
        color,
        (i + 1).toString(), // Enumeración del 1 al 12
        velocidad
      )
    );
  }
}

// --- EVENTOS DE LOS DESPLAZADORES ---

sliderCant.addEventListener("input", (e) => {
  const num = e.target.value;
  valorLabel.innerText = num;
  crearCirculos(num);
});

sliderAncho.addEventListener("input", (e) => {
  canvas.width = e.target.value;
  valorAncho.innerText = e.target.value + "px";
  // Ajuste inmediato de posición si el círculo queda fuera al achicar
  arrayCirculos.forEach(c => {
    if (c.posX + c.radius > canvas.width) c.posX = canvas.width - c.radius;
  });
});

sliderAlto.addEventListener("input", (e) => {
  canvas.height = e.target.value;
  valorAlto.innerText = e.target.value + "px";
  arrayCirculos.forEach(c => {
    if (c.posY + c.radius > canvas.height) c.posY = canvas.height - c.radius;
  });
});

// Función para el botón de reinicio (Cambia tamaños y posiciones sin recargar la página)
function reiniciarSimulacion() {
    crearCirculos(sliderCant.value);
}

// Inicialización de la primera tanda de círculos
crearCirculos(sliderCant.value);

// Bucle de animación
let updateAnimation = function () {
  requestAnimationFrame(updateAnimation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrayCirculos.forEach(circulo => circulo.update(ctx));
};

updateAnimation();