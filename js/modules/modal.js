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
      if (isRecurring && !isFirstTime) {
        modalOverlay.classList.add('no-backdrop', 'corner-pop');
      } else {
        modalOverlay.classList.remove('no-backdrop', 'corner-pop');
      }
      modalOverlay.classList.add('open');
      if (!isRecurring || isFirstTime) {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open', 'no-backdrop', 'corner-pop');
      document.body.style.overflow = '';
      isFirstTime = false;
    }
  }

  // Auto-open first time Enquiry Popup (Centered modal with full background backdrop overlay)
  setTimeout(() => {
    openModal('Priority Assistance - TVS Emerald Avalon', false);
  }, 1500);

  // Auto-open Enquiry Popup every 10 seconds if closed (Corner popup with NO background overlay)
  let autoModalInterval = setInterval(() => {
    if (modalOverlay && !modalOverlay.classList.contains('open')) {
      openModal('Priority Assistance - TVS Emerald Avalon', true);
    }
  }, 10000);

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
