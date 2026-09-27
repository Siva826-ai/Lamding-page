/**
 * Modal Popup Controller for Enquiry Forms
 */
export function initModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');

  function openModal(titleText = 'Enquire Now') {
    if (modalTitle) modalTitle.textContent = titleText;
    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Auto-open Enquiry Popup when visitor opens the website
  setTimeout(() => {
    openModal('Priority Assistance - TVS Emerald Avalon');
  }, 1000);

  // Event Delegation for All Modal Triggers Across the Website
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      const triggerSource = trigger.getAttribute('data-modal-trigger') || 'Enquire Now';
      openModal(triggerSource);
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
