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
    this.posX = Math.max(this.radius, Math.min(x, window_width - this.radius));
    this.posY = Math.max(this.radius, Math.min(y, window_height - this.radius));
    this.color = color;
    this.text = text;
    this.speed = speed;

    // --- MEJORA: Dirección basada en un ángulo aleatorio (0 a 360 grados) ---
    // Esto asegura que casi NUNCA sigan la misma trayectoria exacta
    let randomAngle = Math.random() * Math.PI * 2; 
    this.dx = Math.cos(randomAngle) * this.speed;
    this.dy = Math.sin(randomAngle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 20px Arial";
    context.fillStyle = this.color;
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 3;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Rebotes
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

// --- CONFIGURACIÓN DE VELOCIDAD RÁPIDA ---
const VELOCIDAD_RAPIDA = 7; // Puedes subir este número para más locura

let radius1 = 40;
let miCirculo = new Circle(
    randomInRange(radius1, window_width - radius1), 
    randomInRange(radius1, window_height - radius1), 
    radius1, "blue", "Tec1", VELOCIDAD_RAPIDA
);

let radius2 = 40;
let miCirculo2 = new Circle(
    randomInRange(radius2, window_width - radius2), 
    randomInRange(radius2, window_height - radius2), 
    radius2, "red", "Tec2", VELOCIDAD_RAPIDA
);

let updateCircle = function () {
  requestAnimationFrame(updateCircle);
  ctx.clearRect(0, 0, window_width, window_height);
  miCirculo.update(ctx);
  miCirculo2.update(ctx);
};

updateCircle();