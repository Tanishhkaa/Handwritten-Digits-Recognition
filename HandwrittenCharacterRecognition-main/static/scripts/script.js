// Get the canvas element and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions for drawing area
const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Set initial background color to black
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// Variables to keep track of mouse position and drawing state
let painting = false;
let lastX = 0;
let lastY = 0;

// Event listeners to track mouse movements
canvas.addEventListener('mousedown', (e) => {
  painting = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
  if (painting) {
    draw(e.offsetX, e.offsetY);
  }
});

canvas.addEventListener('mouseup', () => {
  painting = false;
});

canvas.addEventListener('mouseleave', () => {
  painting = false;
});

// Function to draw on the canvas
function draw(x, y) {
  ctx.strokeStyle = '#fff'; // Set ink color to white
  ctx.lineWidth = 25; // Set line width
  ctx.lineCap = 'round'; // Set line cap style
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

// Clear button functionality
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
  ctx.fillStyle = '#000'; // Reset background color to black
  ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Fill with black
});

// Predict button functionality
const predictBtn = document.getElementById('predictBtn');
predictBtn.addEventListener('click', () => {
  // Get image data from canvas
  const imageData = canvas.toDataURL('image/png')

  // Send image data to Flask backend for prediction
  fetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageData }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Prediction:', data.prediction);
    console.log('Possibility:', data.possibility);
    document.getElementById('predictionResult').innerText = `Prediction\t:\t${data.prediction}\nPossibility\t:\t${data.possibility}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
