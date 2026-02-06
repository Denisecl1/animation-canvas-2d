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
// Calculamos el máximo permitido según la pantalla del usuario
const maxW = Math.floor(window.innerWidth * 0.75);
const maxH = Math.floor(window.innerHeight * 0.75);

// Configuramos los límites máximos de los sliders dinámicamente
sliderAncho.max = maxW;
sliderAlto.max = maxH;

// Configuración inicial del canvas
canvas.width = Math.floor(maxW * 0.8); // Inicia un poco más pequeño que el límite
canvas.height = Math.floor(maxH * 0.8);
canvas.style.background = "#ff8";

// Sincronizamos los sliders con el tamaño inicial
sliderAncho.value = canvas.width;
sliderAlto.value = canvas.height;
valorAncho.innerText = canvas.width + "px";
valorAlto.innerText = canvas.height + "px";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.radius = radius;
    // Usamos el ancho/alto actual del canvas para posicionar al nacer
    this.posX = Math.max(this.radius, Math.min(x, canvas.width - this.radius));
    this.posY = Math.max(this.radius, Math.min(y, canvas.height - this.radius));
    this.color = color;
    this.text = text;
    this.speed = speed;

    let randomAngle = Math.random() * Math.PI * 2; 
    this.dx = Math.cos(randomAngle) * this.speed;
    this.dy = Math.sin(randomAngle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    let fontSize = Math.floor(this.radius * 0.7);
    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = this.color;
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 3;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // --- REBOTE DINÁMICO ---
    // Usamos canvas.width y canvas.height directamente para que el rebote se adapte al slider
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

function crearCirculos(cantidad) {
  arrayCirculos = []; 
  for (let i = 0; i < cantidad; i++) {
    let radioAleatorio = randomInRange(15, 40); 
    let velocidad = randomInRange(3, 8);
    let color = `hsl(${Math.random() * 360}, 70%, 50%)`;

    arrayCirculos.push(
      new Circle(
        randomInRange(radioAleatorio, canvas.width - radioAleatorio),
        randomInRange(radioAleatorio, canvas.height - radioAleatorio),
        radioAleatorio,
        color,
        (i + 1).toString(),
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
  // Evitamos que los círculos se queden fuera si achicamos el canvas
  arrayCirculos.forEach(c => {
    if (c.posX + c.radius > canvas.width) c.posX = canvas.width - c.radius;
  });
});

sliderAlto.addEventListener("input", (e) => {
  canvas.height = e.target.value;
  valorAlto.innerText = e.target.value + "px";
  // Evitamos que los círculos se queden fuera si achicamos el canvas
  arrayCirculos.forEach(c => {
    if (c.posY + c.radius > canvas.height) c.posY = canvas.height - c.radius;
  });
});

// Inicialización
crearCirculos(sliderCant.value);

let updateAnimation = function () {
  requestAnimationFrame(updateAnimation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrayCirculos.forEach(circulo => circulo.update(ctx));
};

updateAnimation();