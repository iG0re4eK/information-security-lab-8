const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const aSlider = document.getElementById("aSlider");
const aValue = document.getElementById("aValue");
const bSlider = document.getElementById("bSlider");
const bValue = document.getElementById("bValue");

const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const scale = 20;
const padding = 20;

function updateValues() {
  aValue.value = aSlider.value;
  bValue.value = bSlider.value;
  drawGrid();
  drawGraph();
  drawText();
}

function updateSliders() {
  aSlider.value = aValue.value;
  bSlider.value = bValue.value;
  drawGrid();
  drawGraph();
  drawText();
}

aSlider.addEventListener("input", () => {
  updateValues();
});

bSlider.addEventListener("input", () => {
  updateValues();
});

aValue.addEventListener("change", () => {
  updateSliders();
});

bValue.addEventListener("change", () => {
  updateSliders();
});

window.addEventListener("load", function () {
  updateValues();
});

function drawGrid() {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 0.5;

  for (let x = 0; x < width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(padding, centerY);
  ctx.lineTo(width - padding, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - padding, centerY);
  ctx.lineTo(width - padding - padding / 2, centerY - padding / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - padding, centerY);
  ctx.lineTo(width - padding - padding / 2, centerY + padding / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, padding);
  ctx.lineTo(centerX, height - padding);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, padding);
  ctx.lineTo(centerX - padding / 2, padding + padding / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, padding);
  ctx.lineTo(centerX + padding / 2, padding + padding / 2);
  ctx.stroke();
}

function drawGraph() {
  const a = parseInt(aSlider.value);
  const b = parseInt(bSlider.value);

  for (let x = -10; x <= 10; x += 0.001) {
    const ySquared = Math.pow(x, 3) + a * x + b;

    if (ySquared >= 0) {
      const y = Math.sqrt(ySquared);
      const pixelX = centerX + x * scale;

      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.arc(pixelX, centerY - y * scale, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pixelX, centerY + y * scale, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawText() {
  ctx.fillStyle = "black";
  ctx.font = "1rem Arial";
  ctx.fillText("x", width - padding * 2, centerY + padding * 1.5);
  ctx.fillText("y", centerX + padding, padding * 2);

  ctx.fillStyle = "black";
  ctx.font = "0.5rem Arial";

  for (let x = -18; x < 19; x++) {
    if (x === 0) continue;
    const pixelX = centerX + x * scale;
    ctx.beginPath();
    ctx.moveTo(pixelX, centerY - 5);
    ctx.lineTo(pixelX, centerY + 5);
    ctx.stroke();
    ctx.fillText(x.toString(), pixelX - 2, centerY + 13);
  }

  for (let y = 13; y > -14; y--) {
    if (y === 0) continue;
    ctx.beginPath();
    const pixelY = centerY - y * scale;
    ctx.moveTo(centerX + 5, pixelY);
    ctx.lineTo(centerX - 5, pixelY);
    ctx.stroke();
    ctx.fillText(y.toString(), centerX - 20, pixelY + 4);
  }

  ctx.fillText("0", centerX + 5, centerY + 13);
}

drawGrid();
drawGraph();
drawText();
