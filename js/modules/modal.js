/**
 * Modal Popup Controller for Enquiry Forms
 */
export function initModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');

  let isFirstTime = true;

  function openModal(titleText = 'Enquire Now', isRecurring = false) {
    if (modalTitle) modalTitle.textContent = titleText;
    if (modalOverlay) {
      if (isRecurring) {
        modalOverlay.classList.add('no-backdrop');
        document.body.style.overflow = '';
      } else {
        modalOverlay.classList.remove('no-backdrop');
        document.body.style.overflow = 'hidden';
      }
      modalOverlay.classList.add('open');
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open', 'no-backdrop');
      document.body.style.overflow = '';
      isFirstTime = false;
    }
  }

  // Auto-open first time Enquiry Popup on initial page load (Centered on screen with backdrop blur)
  setTimeout(() => {
    openModal('Priority Assistance - TVS Emerald Avalon', false);
  }, 1500);

  // Auto-open Enquiry Popup every 45 seconds if closed (NO BACKDROP BLUR - website stays visible & scrollable!)
  setInterval(() => {
    if (modalOverlay && !modalOverlay.classList.contains('open')) {
      openModal('Priority Assistance - TVS Emerald Avalon', true);
    }
  }, 45000);

  // Event Delegation for All Modal Triggers Across the Website
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      const triggerSource = trigger.getAttribute('data-modal-trigger') || 'Enquire Now';
      openModal(triggerSource, false);
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  return { openModal, closeModal };
}
