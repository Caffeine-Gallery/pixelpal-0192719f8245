import { backend } from 'declarations/backend';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const paintMode = document.getElementById('paint-mode');
const viewMode = document.getElementById('view-mode');
const savedImage = document.getElementById('saved-image');
const shareUrl = document.getElementById('share-url');

let isDrawing = false;

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
}

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!isDrawing) return;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function saveAndShare() {
  const imageData = canvas.toDataURL();
  try {
    const id = await backend.saveImage(imageData);
    const url = `${window.location.origin}?id=${id}`;
    shareUrl.value = url;
    savedImage.src = imageData;
    paintMode.style.display = 'none';
    viewMode.style.display = 'block';
  } catch (error) {
    console.error('Error saving image:', error);
  }
}

async function loadImage(id) {
  try {
    const imageData = await backend.getImage(id);
    if (imageData) {
      savedImage.src = imageData;
      paintMode.style.display = 'none';
      viewMode.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
clearBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', saveAndShare);

resizeCanvas();

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
if (id) {
  loadImage(id);
}
