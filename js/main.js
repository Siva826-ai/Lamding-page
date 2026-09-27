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

document.addEventListener('DOMContentLoaded', () => {
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
});
