/**
 * Gallery Category Filtering & Lightbox Controller
 */
export function initGallery() {
  const galleryFilterBtns = document.querySelectorAll('.gallery-pill-btn');
  const galleryCards = document.querySelectorAll('.gallery-card-item');
  const galleryLightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const viewFullGalleryBtn = document.getElementById('viewFullGalleryBtn');

  let currentGalleryIndex = 0;
  const galleryList = Array.from(galleryCards).map(card => ({
    img: card.getAttribute('data-img') || card.querySelector('img')?.src,
    title: card.getAttribute('data-title') || card.querySelector('.badge-text')?.textContent || 'Amenity View',
    desc: card.getAttribute('data-desc') || 'TVS Emerald AVALON Pallavaram',
    category: card.getAttribute('data-category') || card.closest('[data-category]')?.getAttribute('data-category')
  }));

  function openLightbox(index) {
    if (typeof index === 'string') {
      // Direct image URL passed
      if (galleryLightbox && lightboxImg) {
        lightboxImg.src = index;
        if (lightboxTitle) lightboxTitle.textContent = arguments[1] || 'Floor Plan Layout';
        if (lightboxDesc) lightboxDesc.textContent = arguments[2] || 'TVS Emerald AVALON Pallavaram';
        galleryLightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    currentGalleryIndex = index;
    const item = galleryList[currentGalleryIndex];
    if (item && galleryLightbox) {
      if (lightboxImg) lightboxImg.src = item.img;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxDesc) lightboxDesc.textContent = item.desc;
      galleryLightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (galleryLightbox) {
      galleryLightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Filtering
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category') || card.closest('[data-category]')?.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.visibility = 'visible';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
        }
      });
    });
  });

  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  if (viewFullGalleryBtn) {
    viewFullGalleryBtn.addEventListener('click', () => openLightbox(0));
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (galleryLightbox) {
    galleryLightbox.addEventListener('click', (e) => {
      if (e.target === galleryLightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryList.length) % galleryList.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryList.length;
      openLightbox(currentGalleryIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (galleryLightbox && galleryLightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    }
  });

  return { openLightbox, closeLightbox };
}
