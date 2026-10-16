/**
 * Honda Fit 1.5 EX-L AT - Interactive Gallery & Lightbox Controller
 */

// Gallery item database
const galleryData = [
  {
    id: 1,
    base: 'fit-01',
    category: 'exterior',
    categoryLabel: 'Exterior',
    title: 'Vista Frontal 3/4',
    desc: 'Línea restyling con parrilla cromada facelift, ópticas estilizadas y llantas de aleación rodado 16".',
    isFeatured: true
  },
  {
    id: 2,
    base: 'fit-02',
    category: 'exterior',
    categoryLabel: 'Exterior',
    title: 'Frontal con Luces Encendidas',
    desc: 'Iluminación delantera completa. Líneas de carrocería y paragolpes delantero en óptimo estado.',
    isFeatured: true
  },
  {
    id: 3,
    base: 'fit-03',
    category: 'exterior',
    categoryLabel: 'Exterior',
    title: 'Perspectiva Lateral Delantera',
    desc: 'Pintura original Crystal Black Pearl (NH731P-18), espejos con repetidores de giro y vidrios polarizados.',
    isFeatured: false
  },
  {
    id: 4,
    base: 'fit-04',
    category: 'exterior',
    categoryLabel: 'Exterior',
    title: 'Vista Lateral Trasera 3/4',
    desc: 'Perfil posterior con molduras protectoras laterales, ópticas traseras envolventes y luneta térmica.',
    isFeatured: true
  },
  {
    id: 5,
    base: 'fit-05',
    category: 'exterior',
    categoryLabel: 'Exterior',
    title: 'Vista Trasera Directa',
    desc: 'Insignias FIT, Honda e i-VTEC con moldura cromada superior sobre portón trasero.',
    isFeatured: false
  },
  {
    id: 6,
    base: 'fit-06',
    category: 'interior',
    categoryLabel: 'Interior',
    title: 'Habitáculo & Tapizados en Cuero',
    desc: 'Interior completo con tapicería de cuero original de fábrica en impecable estado de conservación y amplio espacio interior.',
    isFeatured: true
  },
  {
    id: 7,
    base: 'fit-07',
    category: 'interior',
    categoryLabel: 'Interior',
    title: 'Cockpit, Volante con Levas & Climatizador',
    desc: 'Volante de cuero multifunción con Paddle Shift, control crucero, climatizador digital y consola ergonómica.',
    isFeatured: true
  },
  {
    id: 8,
    base: 'fit-08',
    category: 'detalles',
    categoryLabel: 'Detalles & Neumáticos',
    title: 'Neumáticos Fate & Llantas 16"',
    desc: 'Cubiertas con dibujo prácticamente nuevo (excelente profundidad de agarre) y llantas de aleación originales de 16".',
    isFeatured: false
  },
  {
    id: 9,
    base: 'fit-09',
    category: 'detalles',
    categoryLabel: 'Detalles & Mantenimiento',
    title: 'Etiquetas Oficiales de Fábrica & Service',
    desc: 'Código de color Honda NH731P-18, presión de neumáticos y registro de servicio oficial Honda.',
    isFeatured: false
  }
];

// Helper to get image filepaths
function getImagePaths(item) {
  return {
    thumb: `assets/images/thumbs/${item.base}.webp`,
    large: `assets/images/large/${item.base}.webp`,
    orig: `assets/images/large/${item.base}.webp`
  };
}

// State
let currentFilter = 'all';
let currentLightboxIndex = 0;
let currentLightboxList = [...galleryData];
let touchStartX = 0;
let touchEndX = 0;

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxOrigLinkTop = document.getElementById('lightboxOrigLinkTop');
const lightboxOrigLinkBottom = document.getElementById('lightboxOrigLinkBottom');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');
const btnCopyPhone = document.getElementById('btnCopyPhone');
const copyToast = document.getElementById('copyToast');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

// Render Gallery Cards
function renderGallery(filter = 'all') {
  currentFilter = filter;
  const filtered = filter === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  currentLightboxList = filtered;

  galleryGrid.innerHTML = '';

  filtered.forEach((item, index) => {
    const paths = getImagePaths(item);
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-id', item.id);
    card.tabIndex = 0;

    card.innerHTML = `
      <img src="${paths.thumb}" alt="${item.title}" loading="lazy" width="600" height="400" />
      <div class="gallery-card-overlay">
        <div class="gallery-tag-row">
          <span class="gallery-category">${item.categoryLabel}</span>
          <svg class="gallery-zoom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h4 class="gallery-title">${item.title}</h4>
        <p class="gallery-desc">${item.desc}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(index);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(card);
  });
}

// Lightbox Open & Update
function openLightbox(index) {
  if (index < 0 || index >= currentLightboxList.length) return;
  currentLightboxIndex = index;
  updateLightbox();
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = currentLightboxList[currentLightboxIndex];
  if (!item) return;

  const paths = getImagePaths(item);

  // Set image and data
  lightboxImg.src = paths.large;
  lightboxImg.alt = item.title;
  lightboxTitle.textContent = item.title;
  lightboxDesc.textContent = item.desc;
  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxList.length}`;
  if (lightboxOrigLinkTop) lightboxOrigLinkTop.href = paths.orig;
  if (lightboxOrigLinkBottom) lightboxOrigLinkBottom.href = paths.orig;

  // Preload next image for buttery smoothness
  const nextIdx = (currentLightboxIndex + 1) % currentLightboxList.length;
  const nextPaths = getImagePaths(currentLightboxList[nextIdx]);
  const preloader = new Image();
  preloader.src = nextPaths.large;
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
  updateLightbox();
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
  updateLightbox();
}

// Handle Touch Swipes for Mobile Lightbox
lightboxModal.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightboxModal.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 45) {
    if (diff > 0) {
      prevLightbox();
    } else {
      nextLightbox();
    }
  }
}

// Lightbox Event Listeners
lightboxCloseBtn.addEventListener('click', closeLightbox);
lightboxPrevBtn.addEventListener('click', prevLightbox);
lightboxNextBtn.addEventListener('click', nextLightbox);

// Close on backdrop click
lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-img-wrap')) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (!lightboxModal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    prevLightbox();
  } else if (e.key === 'ArrowRight') {
    nextLightbox();
  }
});

// Filter Buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    renderGallery(filter);
  });
});

// Copy Phone Number Functionality
if (btnCopyPhone) {
  btnCopyPhone.addEventListener('click', () => {
    const phoneNumber = '+5491165559171';
    const displayPhone = '11 6555-9171';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        showCopyToast('¡Número copiado: ' + displayPhone + '!');
      }).catch(() => {
        fallbackCopy(phoneNumber);
      });
    } else {
      fallbackCopy(phoneNumber);
    }
  });
}

function fallbackCopy(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showCopyToast('¡Número copiado: 11 6555-9171!');
}

function showCopyToast(msg) {
  if (!copyToast) return;
  copyToast.textContent = msg;
  copyToast.classList.add('show');
  setTimeout(() => {
    copyToast.classList.remove('show');
  }, 2500);
}

// Mobile Menu Toggle
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });
}

// Hero Thumbnails Quick Click
document.querySelectorAll('.hero-thumb-item').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const targetBase = thumb.getAttribute('data-base');
    const targetIdx = currentLightboxList.findIndex(item => item.base === targetBase);
    if (targetIdx !== -1) {
      openLightbox(targetIdx);
    } else {
      // Find index in full galleryData
      const fullIdx = galleryData.findIndex(item => item.base === targetBase);
      if (fullIdx !== -1) {
        currentLightboxList = [...galleryData];
        openLightbox(fullIdx);
      }
    }
  });
});

// Main Hero Image Click
const heroMainCard = document.getElementById('heroMainCard');
if (heroMainCard) {
  heroMainCard.addEventListener('click', () => {
    currentLightboxList = [...galleryData];
    openLightbox(0);
  });
}

// Navbar Shadow on Scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 30) {
      navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }
});

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  renderGallery('all');
});

