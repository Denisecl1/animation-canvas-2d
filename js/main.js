const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight / 2;
const window_width = window.innerWidth / 2;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.radius = radius;
    // IMPORTANTE: Aquí usamos el radio aleatorio para calcular los límites de nacimiento
    this.posX = Math.max(this.radius, Math.min(x, window_width - this.radius));
    this.posY = Math.max(this.radius, Math.min(y, window_height - this.radius));
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
    
    // Ajustamos el tamaño de la fuente según el radio para que siempre quepa el número
    let fontSize = Math.floor(this.radius * 0.8);
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

    // Rebotes considerando el radio individual de cada círculo
    if ((this.posX + this.radius) >= window_width || (this.posX - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.posY + this.radius) >= window_height || (this.posY - this.radius) <= 0) {
      this.dy = -this.dy;
    }

    this.posX += this.dx;
    this.posY += this.dy;
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// --- GENERACIÓN CON RADIOS VARIABLES ---

const numeroAzar = Math.floor(Math.random() * 10) + 1;
let arrayCirculos = [];

for (let i = 0; i < numeroAzar; i++) {
  // 1. Generamos un radio aleatorio entre 20 y 50 para cada uno
  let radioAleatorio = randomInRange(20, 50);
  
  // 2. Velocidad aleatoria
  let velocidadIndividual = randomInRange(4, 10);
  
  // 3. Color aleatorio
  let color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  arrayCirculos.push(
    new Circle(
      randomInRange(radioAleatorio, window_width - radioAleatorio),
      randomInRange(radioAleatorio, window_height - radioAleatorio),
      radioAleatorio,
      color,
      (i + 1).toString(),
      velocidadIndividual
    )
  );
}

let updateCircle = function () {
  requestAnimationFrame(updateCircle);
  ctx.clearRect(0, 0, window_width, window_height);
  
  arrayCirculos.forEach(circulo => {
    circulo.update(ctx);
  });
};

updateCircle();