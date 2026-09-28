/**
 * Form Submissions & Lead Conversion Handler
 */
export function initForms(updateUnlockState, closeModal) {
  function handleFormSubmit(e, sourceName) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[name="name"]');
    const mobileInput = form.querySelector('input[name="mobile"]');
    const emailInput = form.querySelector('input[name="email"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!name || !mobile || !email) {
      alert('Please complete all required fields.');
      return;
    }

    // Submit via AJAX to submit.php
    fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, mobile, email, form_source: sourceName })
    }).catch(() => {});

    // Confirmation & WhatsApp redirect prompt
    const confirmMsg = `Thank you, ${name}! Your enquiry for TVS Emerald AVALON has been received.\n\nWould you like to open WhatsApp now to receive instant floor plans and price sheet?`;
    
    if (confirm(confirmMsg)) {
      const text = encodeURIComponent(`Hi! My name is ${name}. I submitted an enquiry for TVS Emerald AVALON. Please send me the brochure and cost sheet.`);
      window.open(`https://api.whatsapp.com/send?phone=919187231016&text=${text}`, '_blank');
    }

    // Unlock floor plan upon actual form submission
    if (typeof updateUnlockState === 'function') {
      updateUnlockState(true);
    }

    form.reset();
    if (typeof closeModal === 'function') {
      closeModal();
    }
  }

  const heroCardForm = document.getElementById('heroCardForm');
  const callbackForm = document.getElementById('callbackForm');
  const popupForm = document.getElementById('popupForm');

  if (heroCardForm) heroCardForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Hero Floating Form'));
  if (callbackForm) callbackForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Callback Form'));
  if (popupForm) popupForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Popup Modal Form'));
}
