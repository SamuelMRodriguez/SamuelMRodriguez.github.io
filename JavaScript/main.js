// --- TYPED.JS INITIALIZATIONS ---

new Typed(".auto-type", {
    strings: ['print("Hello World!")', 
      'console.log("Hello World!")', 
      '&#60;p&#62;Hello World!&#60;&#47;p&#62;',
      'System.out.println("Hello World!")'], 
    typeSpeed: 100,
    backSpeed: 100,
    loop: true
});

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

// --- "PRESS ME" BUTTON & PAINT EFFECT LOGIC ---

// DOM references for the moving button and its container
const c = document.querySelector(".container");
const b = document.querySelector(".moving-button");

let pressCount = 0;
const refWidth = 1920; // Reference screen width for vw calculations

// Main function: moves the button, creates paint sprays, and handles drips
function change() {
  pressCount++;
  if (pressCount > 7) return;

  // Calculate new random position for the button within the container
  const
    { width: cWidth, height: cHeight, left: cLeft, top: cTop } = c.getBoundingClientRect(),
    { width: bWidth, height: bHeight } = b.getBoundingClientRect(),
    i = Math.floor(Math.random() * (cWidth - bWidth)), // i is in pixels
    j = Math.floor(Math.random() * (cHeight - bHeight)); // j is in pixels

  // Position the button using pixel values relative to its container
  b.style.left = i + "px";
  b.style.top = j + "px";
  // console.log(b.getBoundingClientRect()); // You can keep or remove this for debugging

  setTimeout(() => {
    // Paint effect: creates 4 spray clusters of blobs at the button's new location
    const paintBg = document.getElementById('paint-bg');
    const rect = b.getBoundingClientRect(); // rect values are in pixels
    const x = rect.left + rect.width / 2; // x is in pixels
    const y = rect.top + rect.height / 2; // y is in pixels

    for (let spray = 0; spray < 4; spray++) {
      // Each spray: random offset, color, and cluster of blobs
      const sprayAngle = Math.random() * 2 * Math.PI;
      const sprayRadiusPx = Math.random() * 700; // sprayRadiusPx is in pixels
      const sprayX = x + Math.cos(sprayAngle) * sprayRadiusPx; // sprayX is in pixels
      const sprayY = y + Math.sin(sprayAngle) * sprayRadiusPx; // sprayY is in pixels

      const r = Math.floor(Math.random() * 80);
      const g = Math.floor(Math.random() * 80);
      const bColor = Math.floor(Math.random() * 80);
      const color = `rgb(${r},${g},${bColor})`;

      const numBlobs = 180;
      const baseMaxDistance = 180; // Original pixel value
      const baseMaxSize = 60;      // Original pixel value
      const baseMinSize = 4;       // Original pixel value
      
      const blobs = [];

      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';

        const angle = Math.random() * 2 * Math.PI;
        // distance is a factor, not a direct pixel value for final offset calculation yet
        const distanceFactor = Math.sqrt(Math.random()); 
        const currentMaxDistancePx = baseMaxDistance; // Assuming baseMaxDistance is the pixel radius of the spray cluster
        
        const offsetX = Math.cos(angle) * distanceFactor * currentMaxDistancePx; // offsetX in pixels
        const offsetY = Math.sin(angle) * distanceFactor * currentMaxDistancePx; // offsetY in pixels

        // size calculation based on original pixel logic
        let sizePx = baseMaxSize - Math.pow(distanceFactor, 1.5) * (baseMaxSize - baseMinSize);
        sizePx = Math.max(baseMinSize, sizePx); // Ensure min size

        blob.style.width = (sizePx / refWidth * 100) + "vw";
        blob.style.height = (sizePx / refWidth * 100) + "vw"; // Use vw for height for proportional scaling
        
        const blobLeftPx = sprayX - sizePx / 2 + offsetX;
        const blobTopPx = sprayY - sizePx / 2 + offsetY;

        blob.style.left = (blobLeftPx / refWidth * 100) + "vw";
        blob.style.top = (blobTopPx / refWidth * 100) + "vw"; // Use vw for top

        blob.style.background = color;
        // Opacity calculation based on distanceFactor (0 to 1)
        blob.style.opacity = 0.8 - 0.7 * distanceFactor + (Math.random() * 0.1);
        blob.style.setProperty('--blob-color', color);

        paintBg.appendChild(blob);
        // Store pixel values for drip calculation if needed, or convert drip calculations too
        blobs.push({
            blob, 
            x: blobLeftPx + sizePx / 2, // center x in px
            y: blobTopPx + sizePx / 2, // center y in px
            size: sizePx, 
            color
        });
      }

      const ys = blobs.map(b => b.y);
      const medianY = ys.sort((a, b) => a - b)[Math.floor(ys.length / 2)];
      const bottomBlobs = blobs.filter(b => b.y >= medianY);

      const dripCount = 2 + Math.floor(Math.random() * 2); 
      const chosenIndexes = [];
      while (chosenIndexes.length < dripCount && bottomBlobs.length > 0) {
        const idx = Math.floor(Math.random() * bottomBlobs.length);
        if (!chosenIndexes.includes(idx)) chosenIndexes.push(idx);
      }

      for (const idx of chosenIndexes) {
        const {x: blobCenterXpx, y: blobCenterYpx, size: blobSizePx, color: dripColor} = bottomBlobs[idx];
        const drip = document.createElement('div');
        drip.className = 'paint-drip';
        drip.style.background = dripColor;
        
        const dripLeftPx = blobCenterXpx;
        const dripTopPx = blobCenterYpx + blobSizePx / 2;
        const dripWidthPx = Math.max(2, blobSizePx * 0.12);

        drip.style.left = (dripLeftPx / refWidth * 100) + "vw";
        drip.style.top = (dripTopPx / refWidth * 100) + "vw"; // Use vw for top
        drip.style.width = (dripWidthPx / refWidth * 100) + "vw";
        drip.style.transform = "translateX(-50%)"; // This should still work as expected
        paintBg.appendChild(drip);

        const baseMinDripPx = 60; 
        // Assuming 1080px height for reference, maxDrip was Math.max(120, 1080 * 0.5) = 540
        const baseMaxDripPx = Math.max(120, 1080 * 0.5); // Reference max drip length in px
        
        const dripLengthPx = baseMinDripPx + Math.random() * (baseMaxDripPx - baseMinDripPx);
        setTimeout(() => {
          drip.style.height = (dripLengthPx / refWidth * 100) + "vw"; // Use vw for height
        }, 20);
      }
    }
  }, 100);

  if (pressCount === 7) {
    b.disabled = true;
    b.style.display = "none"; 
  }
}

// Event listener for button click to trigger the paint effect
if (b) { // Check if button b exists
    b.addEventListener("click", change);
}

// --- TESTIMONIALS SLIDER/CAROUSEL LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    // DOM Element Selections
    const testimonialsContainer = document.querySelector('.testimonials');
    const projectRadios = document.querySelectorAll('.slider input[type="radio"]'); // Still needed for desktop
    const sliderItems = testimonialsContainer ? Array.from(testimonialsContainer.querySelectorAll('.item')) : [];

    if (!testimonialsContainer) {
        console.warn("Testimonials container not found. Slider functionality will be limited.");
        return;
    }
    
    // Ensure data-index is present on original items for centering logic
    sliderItems.forEach((item, index) => {
        if (!item.dataset.index) {
            item.dataset.index = index;
        }
        // Add click listener for navigation
        item.addEventListener('click', function() {
            const link = this.dataset.link;
            const radioId = this.getAttribute('for'); // Get the ID of the radio button this label is for
            
            if (radioId) {
                const radioInput = document.getElementById(radioId);

                // Check if the radio button associated with THIS clicked label is currently checked
                if (radioInput && radioInput.checked) {
                    if (link) {
                        window.open(link, '_blank'); // Open link in a new tab
                    }
                }
            }
            // We don't call e.preventDefault() here because we still want the label
            // to check/uncheck the associated radio button for the carousel functionality.
        });
    });

    // State Variables
    let isDragging = false;
    let startX;
    let scrollLeftStart;
    let currentSnappedIndex = 0; // To keep track of the current item

    // Helper Function: Center Selected Project
    function centerSelectedProject(behavior = 'auto') { // 'auto' for instant, 'smooth' for animation
        if (!testimonialsContainer) return;

        if (window.innerWidth <= 768) { // Mobile logic
            const checkedRadio = document.querySelector('.slider input[type="radio"]:checked');
            let itemToCenter = null;

            if (checkedRadio) {
                const radioId = checkedRadio.id; // e.g., "t-3"
                const targetIndex = parseInt(radioId.split('-')[1]) - 1; // "t-1" -> 0, "t-2" -> 1, etc.
                itemToCenter = testimonialsContainer.querySelector(`.item[data-index="${targetIndex}"]`);
                currentSnappedIndex = targetIndex;
            } else {
                // Fallback to t-3 (index 2) if no radio is checked in HTML
                itemToCenter = testimonialsContainer.querySelector(`.item[data-index="2"]`);
                currentSnappedIndex = 2;
            }
            
            if (itemToCenter) {
                // Calculate scroll position to center the item
                const containerWidth = testimonialsContainer.offsetWidth;
                const itemWidth = itemToCenter.offsetWidth;
                const scrollPosition = itemToCenter.offsetLeft - (containerWidth - itemWidth) / 2;
                
                testimonialsContainer.scrollTo({
                    left: scrollPosition,
                    behavior: behavior 
                });
            }
        } else { // Desktop logic (if any specific centering is needed beyond CSS)
            // Your existing desktop logic that might react to radio changes for the 3D effect
            // or any other desktop-specific centering.
            // For now, this function primarily handles mobile centering.
            // If desktop also needs programmatic centering based on radios, it can be added here.
        }
    }

    // Drag/Swipe Event Handlers
    function handleDragStart(e) {
        if (window.innerWidth > 768 || !testimonialsContainer) return;
        isDragging = true;
        startX = (e.touches ? e.touches[0].pageX : e.pageX) - testimonialsContainer.offsetLeft;
        scrollLeftStart = testimonialsContainer.scrollLeft;
        testimonialsContainer.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging || window.innerWidth > 768 || !testimonialsContainer) return;
        e.preventDefault(); // Prevent page scroll during drag on touch devices
        const x = (e.touches ? e.touches[0].pageX : e.pageX) - testimonialsContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Drag multiplier
        testimonialsContainer.scrollLeft = scrollLeftStart - walk;
    }

    function handleDragEnd() {
        if (window.innerWidth > 768 || !isDragging || !testimonialsContainer) return;
        isDragging = false;
        testimonialsContainer.style.cursor = 'grab';
        // CSS scroll-snap will handle snapping.
    }

    // Initialization
    if (window.innerWidth <= 768) {
        centerSelectedProject('auto'); // Center initial item instantly on mobile
    } else {
        // For desktop, if you have specific logic that relied on radio changes for 3D carousel
        // or other initialization.
        // centerSelectedProject('auto'); // Or however desktop initializes if needed
    }
    
    // Event Listeners
    // Drag/Swipe listeners
    testimonialsContainer.addEventListener('mousedown', handleDragStart);
    testimonialsContainer.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    
    // Resize listener
    window.addEventListener('resize', () => {
        isDragging = false; // Reset dragging state
        if (testimonialsContainer) {
            if (window.innerWidth <= 768) {
                centerSelectedProject('auto');
            } else {
                // Potentially re-apply desktop setup or clear mobile specific inline styles
                // centerSelectedProject('auto'); // Or however desktop re-initializes
            }
        }
    });
    
    // Radio button change listener (primarily for desktop 3D carousel, but can also trigger mobile centering)
    projectRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (window.innerWidth > 768) { // Desktop 3D carousel logic
                // Your existing desktop logic that reacts to radio changes for the 3D effect.
            } else { // Mobile
                centerSelectedProject('smooth'); // Smoothly center the selected item on mobile
            }
        });
    });

}); // End of DOMContentLoaded
