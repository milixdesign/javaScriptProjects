const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2 - 40; // Adjusted radius to leave space for numbers
const center = { x: canvas.width / 2, y: canvas.height / 2 }; // Center of the circle

// Array to store the colors and titles for the 60 minutes
let timeBlocks = [];
let minuteColors = Array(60).fill("#cccccc"); // Default gray for the entire clock

// Function to draw the clock
function drawClock() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the main circle
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#f5f5f5"; // Light background
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#333333"; // Dark border
  ctx.stroke();
  ctx.closePath();

  // Draw minute lines with their respective colors
  for (let i = 0; i < 60; i++) {
    const angle = ((i * 6 - 90) * Math.PI) / 180; // Convert minutes to angles
    const x1 = center.x + radius * Math.cos(angle); // Outer point
    const y1 = center.y + radius * Math.sin(angle);
    const x2 = center.x; // Center of the circle
    const y2 = center.y;

    // Draw the minute line with the assigned color
    ctx.beginPath();
    ctx.strokeStyle = minuteColors[i];
    ctx.lineWidth = 2.5;
    ctx.moveTo(x2, y2); // From the center
    ctx.lineTo(x1, y1); // To the edge
    ctx.stroke();
    ctx.closePath();
  }

  // Draw numbers (multiples of 5) around the circle
  for (let i = 0; i < 60; i += 5) {
    const angle = ((i * 6 - 90) * Math.PI) / 180; // Convert to angle
    const x = center.x + (radius + 20) * Math.cos(angle); // Position slightly outside the radius
    const y = center.y + (radius + 20) * Math.sin(angle);

    let number = i === 0 ? 60 : i; // Display 60 instead of 0 for the first number
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number.toString(), x, y);
  }

  // Display the legend below the clock
  displayLegend();
}

// Function to display the legend (titles and colors)
function displayLegend() {
  const legendContainer = document.getElementById("legendContainer");
  legendContainer.innerHTML = ""; // Clear the previous legend

  timeBlocks.forEach((block) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";

    const colorBox = document.createElement("div");
    colorBox.style.width = "20px";
    colorBox.style.height = "20px";
    colorBox.style.backgroundColor = block.color;
    colorBox.style.marginRight = "10px";

    const titleText = document.createElement("span");
    titleText.textContent = block.title;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(titleText);
    legendContainer.appendChild(legendItem);
  });
}

// Function to update the clock with user input
function updateClock() {
  const title = document.getElementById("title").value.trim();
  const duration = parseInt(document.getElementById("duration").value, 10);
  const color = document.getElementById("color").value;

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  if (isNaN(duration) || duration <= 0 || duration > 60) {
    alert("Please enter a valid duration (1-60).");
    return;
  }

  const totalMinutesUsed = timeBlocks.reduce((sum, block) => sum + block.duration, 0);

  if (totalMinutesUsed + duration > 60) {
    alert("The total duration exceeds 60 minutes. Please adjust your input.");
    return;
  }

  // Add the new block to the timeBlocks array
  timeBlocks.push({ title, duration, color });

  // Update the colors for the defined block
  let currentMinute = totalMinutesUsed;
  for (let i = 0; i <= duration; i++) {
    minuteColors[currentMinute] = color;
    currentMinute++;
  }

  // Redraw the clock with updated data
  drawClock();
}

// Initial clock rendering
drawClock();
