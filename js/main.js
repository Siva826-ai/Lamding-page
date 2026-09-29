/**
 * TVS EMERALD | AVALON - MASTER APPLICATION CONTROLLER
 * Imports and initializes all modular JS feature components.
 */

import { initMobileMenu } from './modules/mobileMenu.js';
import { initFloorPlans } from './modules/floorPlans.js';
import { initModal } from './modules/modal.js';
import { initForms } from './modules/forms.js';
import { initGallery } from './modules/gallery.js';
import { initConnectivity } from './modules/connectivity.js';
import { initCountryPickers } from './modules/countryPicker.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Country Pickers
  initCountryPickers();

  // 1. Mobile Navigation
  initMobileMenu();

  // 2. Gallery & Lightbox Controller
  const { openLightbox } = initGallery();

  // 3. Floor Plans Controller (with blur & unlock state)
  const { updateUnlockState } = initFloorPlans(openLightbox);

  // 4. Modal Controller
  const { closeModal } = initModal();

  // 5. Form Submissions & WhatsApp Lead Conversion
  initForms(updateUnlockState, closeModal);

  // 6. Connectivity Small Cards & Modal Controller
  initConnectivity();

  // 7. Hero Section Motion & Interactive 3D Parallax Effect (Desktop Pointer Only)
  const heroSection = document.querySelector('.hero-section');
  const motionLayer = document.querySelector('.hero-bg-motion-layer');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

  if (heroSection && motionLayer && !isTouchDevice) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xOffset = ((clientX / innerWidth) - 0.5) * 12;
      const yOffset = ((clientY / innerHeight) - 0.5) * 12;
      motionLayer.style.transform = `scale(1.04) translate3d(${xOffset}px, ${yOffset}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      motionLayer.style.transform = '';
    });
  }
});
