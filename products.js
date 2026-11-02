/* FIND THE PAGE ELEMENTS*/
const productGrid = document.getElementById('product-grid');
const searchBox = document.getElementById('product-search');
const categoryDropdown = document.getElementById('product-category');
const sortDropdown = document.getElementById('product-sort');
const resultCount = document.getElementById('result-count');
const noResults = document.getElementById('no-results');

// A list of every product card on the page
const productCards = document.querySelectorAll('.product-card');

// Run the search / filter / sort again whenever the visitor changes something
searchBox.addEventListener('input', showProducts);
categoryDropdown.addEventListener('change', showProducts);
sortDropdown.addEventListener('change', showProducts);

// Stop the page from reloading if Enter is pressed in the search box
document.getElementById('product-filters').addEventListener('submit', function (event) {
    event.preventDefault();
});

// Connect the buttons on every card
for (let i = 0; i < productCards.length; i++) {
    productCards[i].querySelector('.thumb').addEventListener('click', openProductPhoto);
    productCards[i].querySelector('.details-btn').addEventListener('click', openProductDetails);
}


/*SEARCH, FILTER AND SORT */
function showProducts() {
    const searchText = searchBox.value.trim().toLowerCase();
    const chosenCategory = categoryDropdown.value;
    const visibleCards = [];

    // STEP 1: filter - hide the cards that do not match
    for (let i = 0; i < productCards.length; i++) {
        const card = productCards[i];

        // The words we search in: name, category and description
        const allText = (card.getAttribute('data-name') + ' ' +
                         card.getAttribute('data-category') + ' ' +
                         card.querySelector('.description').textContent).toLowerCase();

        const matchesSearch = (searchText === '') || (allText.indexOf(searchText) !== -1);
        const matchesCategory = (chosenCategory === '') || (card.getAttribute('data-category') === chosenCategory);

        if (matchesSearch && matchesCategory) {
            card.hidden = false;
            visibleCards.push(card);
        } else {
            card.hidden = true;
        }
    }

    // STEP 2: sort - put the visible cards in the order the visitor chose
    const sortWay = sortDropdown.value;
    visibleCards.sort(function (a, b) {
        if (sortWay === 'price-asc') {
            return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));     // cheapest first
        } else if (sortWay === 'price-desc') {
            return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));     // most expensive first
        } else if (sortWay === 'stock') {
            return Number(b.getAttribute('data-stock')) - Number(a.getAttribute('data-stock'));     // most stock first
        } else {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));          // A to Z
        }
    });

    // Adding a card to the grid again moves it, so this puts them in the new order
    for (let i = 0; i < visibleCards.length; i++) {
        productGrid.appendChild(visibleCards[i]);
    }

    // STEP 3: update the message and the "no results" text
    if (visibleCards.length === 1) {
        resultCount.textContent = '1 product shown';
    } else {
        resultCount.textContent = visibleCards.length + ' products shown';
    }
    noResults.hidden = (visibleCards.length > 0);
}

// Show the count when the page first loads
showProducts();


/* ---------- CLICKING A PRODUCT PHOTO (uses the lightbox from script.js) ---------- */
function openProductPhoto(event) {
    const clickedCard = event.currentTarget.parentNode;     // the button sits inside the card

    // Make a list of pictures from the cards that are showing, in their current order
    const pictures = [];
    let startPosition = 0;
    const cardsNow = productGrid.querySelectorAll('.product-card');

    for (let i = 0; i < cardsNow.length; i++) {
        if (cardsNow[i].hidden === false) {
            const image = cardsNow[i].querySelector('img');
            if (cardsNow[i] === clickedCard) {
                startPosition = pictures.length;        // remember where the clicked one is
            }
            pictures.push({
                src: image.getAttribute('src'),
                alt: image.getAttribute('alt'),
                caption: cardsNow[i].getAttribute('data-name')
            });
        }
    }

    openLightbox(pictures, startPosition);
}


/* ---------- DETAILS POP-UP (modal) ---------- */
const productModal = document.getElementById('product-modal');

function openProductDetails(event) {
    // "closest" finds the card that the clicked button is inside
    const card = event.currentTarget.closest('.product-card');
    const image = card.querySelector('img');

    // Copy the card's information into the pop-up
    document.getElementById('modal-name').textContent = card.getAttribute('data-name');
    document.getElementById('modal-image').src = image.getAttribute('src');
    document.getElementById('modal-image').alt = image.getAttribute('alt');
    document.getElementById('modal-description').textContent = card.querySelector('.description').textContent;
    document.getElementById('modal-price').textContent = 'From ' + money(Number(card.getAttribute('data-price'))) + ' per item (excl. VAT)';

    const stockLine = document.getElementById('modal-stock');
    stockLine.textContent = card.querySelector('.stock').textContent;
    stockLine.className = card.querySelector('.stock').className;

    // The link takes the visitor to the enquiry form with this product already chosen
    document.getElementById('modal-link').href = 'enquiries.html?product=' + encodeURIComponent(card.getAttribute('data-name'));

    productModal.classList.add('open');
}

function closeProductDetails() {
    productModal.classList.remove('open');
}

document.getElementById('product-modal-close').addEventListener('click', closeProductDetails);

// Clicking outside the white box closes it
productModal.addEventListener('click', function (event) {
    if (event.target === productModal) {
        closeProductDetails();
    }
});

// Pressing Escape closes it
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeProductDetails();
    }
});