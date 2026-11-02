/* MOBILE MENU - CORRECT CLASSES */
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', function() {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.textContent = isOpen ? '✕' : '☰';
  });
}
// Set initial hamburger icon
if (navToggle) {
  navToggle.textContent = '☰';
}
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

//CONTACT FORM SUBMIT - FIXED FOR FORMSPREE
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const emailOut = document.getElementById('email-out');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

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

    contactStatus.textContent = "Sending...";
    contactStatus.style.color = "#fbbf24";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactStatus.textContent = "✓ Message sent! We'll get back to you shortly.";
        contactStatus.style.color = "#4ade80";
        if (emailOut) {
          emailOut.hidden = false;
          emailOut.innerHTML = `
            <div style="background:#0f2442; border:1px solid #fbbf24; padding:20px; border-radius:8px; margin-top:20px; color:white;">
              <h3 style="color:#fbbf24; margin-top:0;">Message Sent!</h3>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Type:</strong> ${type}</p>
              <p>Your message was sent to our team. Check your email for confirmation.</p>
            </div>
          `;
        }
        contactForm.reset();
        if (contactCount) contactCount.textContent = "0 / 1000";
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      contactStatus.textContent = "Error sending. Please try again or email us directly at kaysclothingweb@gmail.com";
      contactStatus.style.color = "#fca5a5";
    }
  });
}

// ENQUIRIES FORM SUBMIT - FIXED FOR FORMSPREE
const enquiryForm = document.getElementById('enquiry-form');
const enquiryStatus = document.getElementById('enquiry-status');
const quoteBox = document.getElementById('quote');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(enquiryForm);
    // honeypot check
    if (formData.get('_gotcha')) return;

    enquiryStatus.textContent = "Sending...";
    enquiryStatus.style.color = "#fbbf24";

    try {
      const response = await fetch(enquiryForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        enquiryStatus.textContent = "✓ Enquiry sent! We'll contact you soon.";
        enquiryStatus.style.color = "#4ade80";
        if (quoteBox) {
          quoteBox.hidden = false;
          quoteBox.innerHTML = `<div style="background:#0f2442; border:1px solid #fbbf24; padding:20px; border-radius:8px; color:white;">Enquiry received! We will reply to <strong>${formData.get('email')}</strong> within 24 hours.</div>`;
        }
        enquiryForm.reset();
        const len = document.getElementById('message-length');
        if (len) len.textContent = "0";
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      enquiryStatus.textContent = "Error. Please email us at kaysclothingweb@gmail.com";
      enquiryStatus.style.color = "#fca5a5";
    }
  });
}
