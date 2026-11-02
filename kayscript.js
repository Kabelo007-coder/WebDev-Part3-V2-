  /* SHARED HELPER */
// Turn a number like 189 into the text "R189.00" (used on the services and enquiries pages)
function money(amount) {
    return 'R' + amount.toFixed(2);
}


/*1. ACCORDION */
const accordionButtons = document.querySelectorAll('.accordion-trigger');
for (let i = 0; i < accordionButtons.length; i++) {
    accordionButtons[i].addEventListener('click', toggleAccordion);
}
function toggleAccordion(event) {
    const button = event.currentTarget;
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
    } else {
        panel.hidden = false;
        button.setAttribute('aria-expanded', 'true');
    }
}


/*2. TABS*/
const tabButtons = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tabpanel');

// Show one panel (by its number) and hide all the others
function showTab(number) {
    for (let i = 0; i < tabButtons.length; i++) {
        if (i === number) {
            tabPanels[i].hidden = false;
            tabButtons[i].setAttribute('aria-selected', 'true');
        } else {
            tabPanels[i].hidden = true;
            tabButtons[i].setAttribute('aria-selected', 'false');
        }
    }
}

// Make each tab button show its own panel when clicked
for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function () {
        showTab(i);
    });
}

// When the page loads, start on the first tab (only if the page has tabs)
if (tabButtons.length > 0) {
    showTab(0);
}


/* 3. FADE IN WHEN SCROLLING*/
// Any element with the class "reveal" fades in once it comes into view
const revealItems = document.querySelectorAll('.reveal');

function checkReveal() {
    for (let i = 0; i < revealItems.length; i++) {
        const position = revealItems[i].getBoundingClientRect().top;  // distance from top of screen
        if (position < window.innerHeight - 40) {
            revealItems[i].classList.add('in');
        }
    }
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);
checkReveal();


/*4. LIGHTBOX (big image viewer) */
// These two variables remember which images are being shown and which one is on screen
let lightboxImages = [];
let lightboxPosition = 0;

// The lightbox HTML is already written in the page, so we just find the pieces
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

// Open the lightbox. "images" is a list, "position" is which one to start on
function openLightbox(images, position) {
    lightboxImages = images;
    lightboxPosition = position;
    showLightboxImage();
    lightbox.classList.add('open');
}

// Put the current image and its caption into the lightbox
function showLightboxImage() {
    const current = lightboxImages[lightboxPosition];
    lightboxImage.src = current.src;
    lightboxImage.alt = current.alt;
    lightboxCaption.textContent = current.caption + ' (' + (lightboxPosition + 1) + ' of ' + lightboxImages.length + ')';
}

function closeLightbox() {
    lightbox.classList.remove('open');
}

function nextImage() {
    lightboxPosition = lightboxPosition + 1;
    if (lightboxPosition >= lightboxImages.length) {
        lightboxPosition = 0;               // go back to the first image
    }
    showLightboxImage();
}

function previousImage() {
    lightboxPosition = lightboxPosition - 1;
    if (lightboxPosition < 0) {
        lightboxPosition = lightboxImages.length - 1;   // jump to the last image
    }
    showLightboxImage();
}

// Only connect the lightbox buttons if this page has a lightbox
if (lightbox) {
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-next').addEventListener('click', nextImage);
    document.getElementById('lightbox-prev').addEventListener('click', previousImage);

    // Clicking the dark area outside the picture also closes it
    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard: Escape closes, arrow keys change picture
    document.addEventListener('keydown', function (event) {
        if (!lightbox.classList.contains('open')) {
            return;     // do nothing if the lightbox is closed
        }
        if (event.key === 'Escape') {
            closeLightbox();
        }
        if (event.key === 'ArrowRight') {
            nextImage();
        }
        if (event.key === 'ArrowLeft') {
            previousImage();
        }
    });
}

/* 5. GALLERY CLICKS */
const galleryButtons = document.querySelectorAll('.gallery button, .gallery-item');

for (let i = 0; i < galleryButtons.length; i++) {
  galleryButtons[i].addEventListener('click', function() {
    // Build list of all gallery images
    let items = [];
    for (let j = 0; j < galleryButtons.length; j++) {
      let btn = galleryButtons[j];
      let img = btn.querySelector('img');
      items.push({
        src: btn.dataset.src || img.src,
        alt: img.alt || '',
        caption: btn.dataset.caption || img.alt || ''
      });
    }
    openLightbox(items, i); // open at the one you clicked
  });
}

// Also handle index.html hero images if they have data-src
const heroImages = document.querySelectorAll('.hero-img[data-src]');
for (let i = 0; i < heroImages.length; i++) {
  heroImages[i].style.cursor = 'zoom-in';
  heroImages[i].addEventListener('click', function() {
    openLightbox([{ src: this.dataset.src || this.src, alt: this.alt, caption: this.alt }], 0);
  });
}

//MAP TOGGLE
const pretoriaMap = document.getElementById('map-pretoria');
const jhbMap = document.getElementById('map-johannesburg');
const btnPretoria = document.getElementById('go-pretoria');
const btnJhb = document.getElementById('go-johannesburg');
const btnBoth = document.getElementById('go-both');

function showOnly(which) {
  if (!pretoriaMap || !jhbMap) return;
  
  if (which === 'pretoria') {
    pretoriaMap.style.display = 'block';
    jhbMap.style.display = 'none';
  } else if (which === 'johannesburg') {
    pretoriaMap.style.display = 'none';
    jhbMap.style.display = 'block';
  } else {
    pretoriaMap.style.display = 'block';
    jhbMap.style.display = 'block';
  }
}

if (btnPretoria) btnPretoria.addEventListener('click', () => showOnly('pretoria'));
if (btnJhb) btnJhb.addEventListener('click', () => showOnly('johannesburg'));
if (btnBoth) btnBoth.addEventListener('click', () => showOnly('both'));

//CONTACT FORM COUNTER
const contactMsg = document.getElementById('message');
const contactCount = document.getElementById('message-count');

if (contactMsg && contactCount) {
  const updateCount = () => {
    contactCount.textContent = `${contactMsg.value.length} / 1000`;
  };
  contactMsg.addEventListener('input', updateCount);
  updateCount(); // set initial 0/1000
}

//CONTACT FORM SUBMIT
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const emailOut = document.getElementById('email-out');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // stops Outlook

    // basic validation (same as enquiries)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const type = document.getElementById('type').value;

    if (!name || name.length < 2) {
      contactStatus.textContent = "Please enter your name.";
      contactStatus.style.color = "#fca5a5";
      return;
    }
    if (!email) {
      contactStatus.textContent = "Please enter your email.";
      contactStatus.style.color = "#fca5a5";
      return;
    }
    if (!type) {
      contactStatus.textContent = "Please choose a message type.";
      contactStatus.style.color = "#fca5a5";
      return;
    }
    if (!message || message.length < 10) {
      contactStatus.textContent = "Please write at least 10 characters.";
      contactStatus.style.color = "#fca5a5";
      return;
    }

    // success - same style as enquiries
    contactStatus.textContent = "✓ Message ready! We'll get back to you shortly.";
    contactStatus.style.color = "#4ade80";
    
    // show formatted quote like enquiries page does
    if (emailOut) {
      emailOut.hidden = false;
      emailOut.innerHTML = `
        <div style="background:#0f2442; border:1px solid #fbbf24; padding:20px; border-radius:8px; margin-top:20px; color:white;">
          <h3 style="color:#fbbf24; margin-top:0;">Your Message</h3>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          <p style="font-size:13px; color:#94a3b8; margin-top:15px;">In a real site this would email to info@kaysclothingco.co.za - for now it's showing here for your assignment.</p>
        </div>
      `;
    }

    contactForm.reset();
    // reset counter
    if (contactCount) contactCount.textContent = "0 / 1000";
  });
}
