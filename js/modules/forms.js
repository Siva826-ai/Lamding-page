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
    const selectElem = form.querySelector('select[name="interest"], select[name="config"]');
    const interest = selectElem && selectElem.value ? selectElem.value.trim() : 'Not Specified';
    const hpInput = form.querySelector('input[name="website_hp"]');
    const website_hp = hpInput ? hpInput.value.trim() : '';

    // Strict Mandatory Field Validation: Name and Phone Number are MANDATORY
    const cleanPhoneDigits = mobile.replace(/\D/g, '');
    if (!name || name.length < 2) {
      showCustomNotification('Name Required', 'Please enter your Full Name before submitting.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!mobile || cleanPhoneDigits.length < 10) {
      showCustomNotification('Valid Phone Number Required', 'Please enter a valid 10-digit Phone Number.');
      if (mobileInput) mobileInput.focus();
      return;
    }

    // Bot Defense: If honeypot is filled out by automated spam bot, stop processing
    if (website_hp) {
      showCustomNotification('Enquiry Submitted Successfully!', `Thank you, ${name}! Your enquiry for TVS Emerald AVALON has been received.`);
      form.reset();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    // 1. Submit to Web3Forms API (Delivers lead email)
    const web3Key = 'd97b2b67-f0c7-4f9c-ae6f-69394c2fc096';
    const messageDetails = `Project Name: TVS Emerald AVALON\nInterested Configuration: ${interest}\nForm Source: ${sourceName}`;

    const web3Promise = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        subject: `New Lead Enquiry - TVS Emerald AVALON (${sourceName})`,
        from_name: 'TVS Emerald AVALON Landing Page',
        name: name,
        email: email,
        replyto: email,
        phone: mobile,
        message: messageDetails
      })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Web3Forms Response Status:', data);
    })
    .catch((err) => console.warn('Web3Forms dispatch error:', err));

    // 2. Also submit to submit.php (Runs on cPanel/PHP host fallback with honeypot validation)
    const phpPromise = fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, mobile, email, interest, form_source: sourceName, project_name: 'TVS Emerald AVALON', website_hp })
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
