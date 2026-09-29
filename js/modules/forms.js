/**
 * Form Submissions & Lead Conversion Handler
 */
export function initForms(updateUnlockState, closeModal) {
  function showCustomNotification(title, message) {
    let toast = document.getElementById('customNotificationToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'customNotificationToast';
      toast.className = 'custom-toast-container';
      toast.innerHTML = `
        <div class="custom-toast-icon">✓</div>
        <div class="custom-toast-content">
          <div class="custom-toast-title" id="toastTitle"></div>
          <div class="custom-toast-message" id="toastMessage"></div>
        </div>
        <button class="custom-toast-close" aria-label="Close">&times;</button>
      `;
      document.body.appendChild(toast);
      toast.querySelector('.custom-toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
      });
    }

    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  }

  async function handleFormSubmit(e, sourceName) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[name="name"]');
    const mobileInput = form.querySelector('input[name="mobile"]');
    const emailInput = form.querySelector('input[name="email"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!name || !mobile || !email) {
      showCustomNotification('Required Fields Missing', 'Please complete all required fields before submitting.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    // 1. Submit to Web3Forms API (Delivers lead email directly to muthupattan@propfinder.org.in)
    const web3Key = 'd97b2b67-f0c7-4f9c-ae6f-69394c2fc096';
    const web3Promise = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        subject: `New Lead Enquiry - TVS Emerald AVALON (${sourceName})`,
        from_name: 'TVS Emerald AVALON Landing Page',
        to_email: 'muthupattan@propfinder.org.in',
        name: name,
        email: email,
        replyto: email,
        phone: mobile,
        form_source: sourceName,
        project_name: 'TVS Emerald AVALON'
      })
    }).catch((err) => console.warn('Web3Forms dispatch error:', err));

    // 2. Also submit to submit.php (Runs on cPanel/PHP host fallback)
    const phpPromise = fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, mobile, email, form_source: sourceName, project_name: 'TVS Emerald AVALON' })
    }).catch(() => {});

    // Show Custom Luxury Toast Notification IMMEDIATELY
    showCustomNotification(
      'Enquiry Submitted Successfully!',
      `Thank you, ${name}! Your enquiry for TVS Emerald AVALON has been received. Our sales team will get back to you shortly.`
    );

    // Unlock floor plan upon submission
    if (typeof updateUnlockState === 'function') {
      updateUnlockState(true);
    }

    form.reset();
    if (typeof closeModal === 'function') {
      closeModal();
    }

    await Promise.allSettled([web3Promise, phpPromise]);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }

  const heroCardForm = document.getElementById('heroCardForm');
  const callbackForm = document.getElementById('callbackForm');
  const popupForm = document.getElementById('popupForm');

  if (heroCardForm) heroCardForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Hero Floating Form'));
  if (callbackForm) callbackForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Callback Form'));
  if (popupForm) popupForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Popup Modal Form'));
}
