// Typed.js initialization: animates the auto-type effect for code samples in the header
new Typed(".auto-type", {
    strings: ['print("Hello World!")', 
      'console.log("Hello World!")', 
      '&#60;p&#62;Hello World!&#60;&#47;p&#62;',
      'System.out.println("Hello World!")'], 
    typeSpeed: 100,
    backSpeed: 100,
    loop: true
})

new Typed(".terminal", {
  strings: [
    'samuelred2004@gmail.com',
    '267-984-0589',
    'github.com/SamuelMRodriguez',
    'leetcode.com/u/Samuel-Rodriguez'
  ],
  typeSpeed: 80,
  backSpeed: 20,
  backDelay: 6000,
  smartBackspace: false,
  showCursor: true,
  cursorChar: "|",
  loop: true,
  contentType: 'html'
});

// DOM references for the moving button and its container
const c = document.querySelector(".container");
const b = document.querySelector(".moving-button");

let pressCount = 0;

// Main function: moves the button, creates paint sprays, and handles drips
function change() {
  pressCount++;
  if (pressCount > 7) return;

  // Calculate new random position for the button within the container
  const
    { width: cWidth, height: cHeight, left: cLeft, top: cTop } = c.getBoundingClientRect(),
    { width: bWidth, height: bHeight } = b.getBoundingClientRect(),
    i = Math.floor(Math.random() * (cWidth - bWidth)),
    j = Math.floor(Math.random() * (cHeight - bHeight));

  b.style.left = i + "px";
  b.style.top = j + "px";
  console.log(b.getBoundingClientRect());

  setTimeout(() => {
    // Paint effect: creates 4 spray clusters of blobs at the button's new location
    const paintBg = document.getElementById('paint-bg');
    const rect = b.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let spray = 0; spray < 4; spray++) {
      // Each spray: random offset, color, and cluster of blobs
      const sprayAngle = Math.random() * 2 * Math.PI;
      const sprayRadius = Math.random() * 700;
      const sprayX = x + Math.cos(sprayAngle) * sprayRadius;
      const sprayY = y + Math.sin(sprayAngle) * sprayRadius;

      const r = Math.floor(Math.random() * 80);
      const g = Math.floor(Math.random() * 80);
      const bColor = Math.floor(Math.random() * 80);
      const color = `rgb(${r},${g},${bColor})`;

      const numBlobs = 180;
      const maxDistance = 180;
      const maxSize = 60;
      const minSize = 4;
      // Store blobs for this spray
      const blobs = [];

      // Generate blobs for the spray cluster
      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.sqrt(Math.random()) * maxDistance;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        const size = maxSize - Math.pow(distance / maxDistance, 1.5) * (maxSize - minSize);

        blob.style.width = size + "px";
        blob.style.height = size + "px";
        blob.style.left = (sprayX - size / 2 + offsetX) + "px";
        blob.style.top = (sprayY - size / 2 + offsetY) + "px";
        blob.style.background = color;
        blob.style.opacity = 0.8 - 0.7 * (distance / maxDistance) + (Math.random() * 0.1);
        blob.style.setProperty('--blob-color', color);

        paintBg.appendChild(blob);
        blobs.push({blob, x: sprayX - size / 2 + offsetX + size / 2, y: sprayY - size / 2 + offsetY + size / 2, size, color});
      }

      // Drip effect: pick 2–3 random blobs from the bottom half of the cluster to create slow, random-length drips
      const ys = blobs.map(b => b.y);
      const medianY = ys.sort((a, b) => a - b)[Math.floor(ys.length / 2)];
      const bottomBlobs = blobs.filter(b => b.y >= medianY);

      const dripCount = 2 + Math.floor(Math.random() * 2); // 2 or 3
      const chosenIndexes = [];
      while (chosenIndexes.length < dripCount && bottomBlobs.length > 0) {
        const idx = Math.floor(Math.random() * bottomBlobs.length);
        if (!chosenIndexes.includes(idx)) chosenIndexes.push(idx);
      }

      for (const idx of chosenIndexes) {
        const {x, y, size, color} = bottomBlobs[idx];
        const drip = document.createElement('div');
        drip.className = 'paint-drip';
        drip.style.background = color;
        drip.style.left = `${x}px`;
        drip.style.top = `${y + size / 2}px`;
        drip.style.width = Math.max(2, size * 0.12) + "px";
        drip.style.transform = "translateX(-50%)";
        paintBg.appendChild(drip);

        // Animate the drip's height to a random length, very slowly
        const minDrip = 60; // minimum drip length in px
        const maxDrip = Math.max(120, window.innerHeight * 0.5); // max drip length (adjust as desired)
        const dripLength = minDrip + Math.random() * (maxDrip - minDrip);
        setTimeout(() => {
          drip.style.height = dripLength + "px";
        }, 20);
      }
    }
  }, 100);

  // Disable and hide the button after 7 presses
  if (pressCount === 7) {
    b.disabled = true;
    b.style.display = "none"; 
  }
}
// --- End of main paint and button logic ---

// Event listener for button click to trigger the paint effect
b.addEventListener("click", change);

document.addEventListener("DOMContentLoaded", function () {
  // Project slider click-to-link logic
  document.querySelectorAll('.slider .item').forEach(function(label, idx) {
    label.addEventListener('click', function(e) {
      // Find the corresponding radio input
      const radioId = label.getAttribute('for');
      const radio = document.getElementById(radioId);
      // Only open link if this laptop is centered (checked)
      if (radio && radio.checked) {
        const link = label.getAttribute('data-link');
        if (link) {
          window.open(link, '_blank');
        }
      }
    });
  });
});