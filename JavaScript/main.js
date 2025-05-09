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

// --- TESTIMONIALS SLIDER/CAROUSEL LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    // --- HAMBURGER MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = navbar.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- "PRESS ME" BUTTON & PAINT EFFECT LOGIC (Ensure it's inside DOMContentLoaded if it manipulates DOM) ---
    const c = document.querySelector(".container"); // Moved from global scope
    const b = document.querySelector(".moving-button"); // Moved from global scope
    let pressCount = 0; // Moved from global scope
    const refWidth = 1920; // Moved from global scope, or define where needed

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

      setTimeout(() => {
        // Paint effect: creates 4 spray clusters of blobs at the button's new location
        const paintBg = document.getElementById('paint-bg');
        const rect = b.getBoundingClientRect(); 
        const x = rect.left + rect.width / 2; 
        const y = rect.top + rect.height / 2; 

        for (let spray = 0; spray < 4; spray++) {
          const sprayAngle = Math.random() * 2 * Math.PI;
          const sprayRadiusPx = Math.random() * 700; 
          const sprayX = x + Math.cos(sprayAngle) * sprayRadiusPx; 
          const sprayY = y + Math.sin(sprayAngle) * sprayRadiusPx; 

          const r = Math.floor(Math.random() * 80);
          const g = Math.floor(Math.random() * 80);
          const bColor = Math.floor(Math.random() * 80);
          const color = `rgb(${r},${g},${bColor})`;

          const numBlobs = 180;
          const baseMaxDistance = 180; 
          const baseMaxSize = 60;      
          const baseMinSize = 4;       
          
          const blobs = [];

          for (let i = 0; i < numBlobs; i++) {
            const blob = document.createElement('div');
            blob.className = 'blob';

            const angle = Math.random() * 2 * Math.PI;
            const distanceFactor = Math.sqrt(Math.random()); 
            const currentMaxDistancePx = baseMaxDistance; 
            
            const offsetX = Math.cos(angle) * distanceFactor * currentMaxDistancePx; 
            const offsetY = Math.sin(angle) * distanceFactor * currentMaxDistancePx; 

            let sizePx = baseMaxSize - Math.pow(distanceFactor, 1.5) * (baseMaxSize - baseMinSize);
            sizePx = Math.max(baseMinSize, sizePx); 

            blob.style.width = (sizePx / refWidth * 100) + "vw";
            blob.style.height = (sizePx / refWidth * 100) + "vw"; 
            
            const blobLeftPx = sprayX - sizePx / 2 + offsetX;
            const blobTopPx = sprayY - sizePx / 2 + offsetY;

            blob.style.left = (blobLeftPx / refWidth * 100) + "vw";
            blob.style.top = (blobTopPx / refWidth * 100) + "vw"; 

            blob.style.background = color;
            blob.style.opacity = 0.8 - 0.7 * distanceFactor + (Math.random() * 0.1);
            blob.style.setProperty('--blob-color', color);

            paintBg.appendChild(blob);
            blobs.push({
                blob, 
                x: blobLeftPx + sizePx / 2, 
                y: blobTopPx + sizePx / 2, 
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
            drip.style.top = (dripTopPx / refWidth * 100) + "vw"; 
            drip.style.width = (dripWidthPx / refWidth * 100) + "vw";
            drip.style.transform = "translateX(-50%)"; 
            paintBg.appendChild(drip);

            const baseMinDripPx = 60; 
            const baseMaxDripPx = Math.max(120, 1080 * 0.5); 
            
            const dripLengthPx = baseMinDripPx + Math.random() * (baseMaxDripPx - baseMinDripPx);
            setTimeout(() => {
              drip.style.height = (dripLengthPx / refWidth * 100) + "vw"; 
            }, 20);
          }
        }
      }, 100);

      if (pressCount === 7) {
        b.disabled = true;
        b.style.display = "none"; 
      }
    }

    if (b && c) { // Check if button b and container c exist
        b.addEventListener("click", change);
    }


    // DOM Element Selections for Testimonials
    const testimonialsContainer = document.querySelector('.testimonials');
    const projectRadios = document.querySelectorAll('.slider input[type="radio"]');
    const sliderItems = testimonialsContainer ? Array.from(testimonialsContainer.querySelectorAll('.item')) : [];

    if (!testimonialsContainer) {
        console.warn("Testimonials container not found. Slider functionality will be limited.");
        // return; // Consider if you want to stop execution if testimonials are not found
    }
    
    // Ensure data-index is present and add click listeners for navigation
    sliderItems.forEach((item, index) => {
        if (!item.dataset.index) {
            item.dataset.index = index;
        }
        item.addEventListener('click', function() {
            const link = this.dataset.link;
            const radioId = this.getAttribute('for'); 
            
            if (radioId) {
                const radioInput = document.getElementById(radioId);
                if (radioInput && radioInput.checked) {
                    if (link) {
                        window.open(link, '_blank'); 
                    }
                }
            }
        });
    });

    // State Variables for Testimonials
    let isDragging = false;
    let startX;
    let scrollLeftStart;
    let currentSnappedIndex = 0; 

    // Helper Function: Center Selected Project
    function centerSelectedProject(behavior = 'auto') { 
        if (!testimonialsContainer) return;

        if (window.innerWidth <= 768) { 
            const checkedRadio = document.querySelector('.slider input[type="radio"]:checked');
            let itemToCenter = null;

            if (checkedRadio) {
                const radioId = checkedRadio.id; 
                const targetIndex = parseInt(radioId.split('-')[1]) - 1; 
                itemToCenter = testimonialsContainer.querySelector(`.item[data-index="${targetIndex}"]`);
                currentSnappedIndex = targetIndex;
            } else {
                itemToCenter = testimonialsContainer.querySelector(`.item[data-index="2"]`);
                currentSnappedIndex = 2;
            }
            
            if (itemToCenter) {
                const containerWidth = testimonialsContainer.offsetWidth;
                const itemWidth = itemToCenter.offsetWidth;
                const scrollPosition = itemToCenter.offsetLeft - (containerWidth - itemWidth) / 2;
                
                testimonialsContainer.scrollTo({
                    left: scrollPosition,
                    behavior: behavior 
                });
            }
        } else { 
            // Desktop logic
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
        e.preventDefault(); 
        const x = (e.touches ? e.touches[0].pageX : e.pageX) - testimonialsContainer.offsetLeft;
        const walk = (x - startX) * 1.5; 
        testimonialsContainer.scrollLeft = scrollLeftStart - walk;
    }

    function handleDragEnd() {
        if (window.innerWidth > 768 || !isDragging || !testimonialsContainer) return;
        isDragging = false;
        testimonialsContainer.style.cursor = 'grab';
    }

    // Initialization for Testimonials
    if (window.innerWidth <= 768) {
        centerSelectedProject('auto'); 
    } else {
        // Desktop init
    }
    
    // Event Listeners for Testimonials
    if (testimonialsContainer) { // Add checks before adding listeners
        testimonialsContainer.addEventListener('mousedown', handleDragStart);
        testimonialsContainer.addEventListener('touchstart', handleDragStart, { passive: false });
    }
    // These listeners are on document, so they are fine
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    
    window.addEventListener('resize', () => {
        isDragging = false; 
        if (testimonialsContainer) {
            if (window.innerWidth <= 768) {
                centerSelectedProject('auto');
            } else {
                // Desktop resize logic
            }
        }
    });
    
    projectRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (window.innerWidth > 768) { 
                // Desktop radio change logic
            } else { 
                centerSelectedProject('smooth'); 
            }
        });
    });

}); // End of DOMContentLoaded
