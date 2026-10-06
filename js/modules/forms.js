/**
 * Form Submissions & Custom Lead Validation Handler
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

  function clearFormErrors(form) {
    form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  }

  function showInlineFieldError(inputElement, targetGroup, messageText) {
    if (!targetGroup) return;

    let errorSpan = targetGroup.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('form-error-msg')) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'form-error-msg';
      targetGroup.insertAdjacentElement('afterend', errorSpan);
    }
    errorSpan.textContent = messageText;

    if (inputElement) {
      inputElement.classList.add('has-error');
      if (targetGroup && targetGroup !== inputElement) {
        targetGroup.classList.add('has-error');
      }

      const removeError = () => {
        if (errorSpan && errorSpan.parentNode) {
          errorSpan.remove();
        }
        inputElement.classList.remove('has-error');
        if (targetGroup && targetGroup !== inputElement) {
          targetGroup.classList.remove('has-error');
        }
        inputElement.removeEventListener('input', removeError);
        inputElement.removeEventListener('change', removeError);
      };

      inputElement.addEventListener('input', removeError);
      inputElement.addEventListener('change', removeError);
    }
  }

  // Enforce digits only & 10 digits maximum limit across all mobile fields
  document.querySelectorAll('input[name="mobile"]').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  });

  async function handleFormSubmit(e, sourceName) {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const nameInput = form.querySelector('input[name="name"]');
    const mobileInput = form.querySelector('input[name="mobile"]');
    const emailInput = form.querySelector('input[name="email"]');
    const selectElem = form.querySelector('select[name="interest"], select[name="config"]');
    const hpInput = form.querySelector('input[name="website_hp"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const interest = selectElem && selectElem.value ? selectElem.value.trim() : '';
    const website_hp = hpInput ? hpInput.value.trim() : '';

    let firstErrorInput = null;

    // 1. Full Name Validation
    if (nameInput) {
      const nameGroup = nameInput.closest('.input-icon-group') || nameInput.closest('.form-field-group') || nameInput;
      if (!name || name.length < 2) {
        showInlineFieldError(nameInput, nameGroup, 'Name field is required.');
        if (!firstErrorInput) firstErrorInput = nameInput;
      }
    }

    // 2. Phone Number Validation (Strict 10 digits)
    if (mobileInput) {
      const phoneContainer = mobileInput.closest('.phone-input-flex') || mobileInput.closest('.input-icon-group') || mobileInput;
      const cleanPhoneDigits = mobile.replace(/\D/g, '');
      if (!mobile) {
        showInlineFieldError(mobileInput, phoneContainer, 'Mobile field is required.');
        if (!firstErrorInput) firstErrorInput = mobileInput;
      } else if (cleanPhoneDigits.length !== 10) {
        showInlineFieldError(mobileInput, phoneContainer, 'Please enter a valid 10-digit mobile number.');
        if (!firstErrorInput) firstErrorInput = mobileInput;
      }
    }

    // 3. Email Address Validation
    if (emailInput) {
      const emailGroup = emailInput.closest('.input-icon-group') || emailInput.closest('.form-field-group') || emailInput;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        showInlineFieldError(emailInput, emailGroup, 'Email field is required.');
        if (!firstErrorInput) firstErrorInput = emailInput;
      } else if (!emailRegex.test(email)) {
        showInlineFieldError(emailInput, emailGroup, 'Please enter a valid email address.');
        if (!firstErrorInput) firstErrorInput = emailInput;
      }
    }

    // 4. Interested Configuration Validation (only if field exists in this form)
    if (selectElem) {
      const selectGroup = selectElem.closest('.input-icon-group') || selectElem.closest('.select-wrapper-custom') || selectElem;
      if (!interest || interest === '' || interest === 'Not Specified') {
        showInlineFieldError(selectElem, selectGroup, 'Please select your configuration.');
        if (!firstErrorInput) firstErrorInput = selectElem;
      }
    }

    // Stop processing if any validation errors exist
    if (firstErrorInput) {
      firstErrorInput.focus();
      return;
    }

    // Bot Defense: Honeypot check
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

    const msgInput = form.querySelector('input[name="message"], textarea[name="message"]');
    const userMessage = msgInput ? msgInput.value.trim() : '';

    const locationInput = form.querySelector('input[name="location"]');
    const userLocation = locationInput && locationInput.value.trim() ? locationInput.value.trim() : 'Pallavaram, Chennai';

    const budgetInput = form.querySelector('input[name="budget"], select[name="budget"]');
    const userBudget = budgetInput && budgetInput.value.trim() ? budgetInput.value.trim() : (interest || '');

    const stateInput = form.querySelector('input[name="state"]');
    const userState = stateInput && stateInput.value.trim() ? stateInput.value.trim() : 'Tamil Nadu';

    const cityInput = form.querySelector('input[name="city"]');
    const userCity = cityInput && cityInput.value.trim() ? cityInput.value.trim() : 'Chennai';

    // 1. Submit to Web3Forms API (Delivers lead email)
    const web3Key = 'd97b2b67-f0c7-4f9c-ae6f-69394c2fc096';
    const messageDetails = `Project Name: TVS Emerald AVALON\nInterested Configuration: ${interest || 'Not Specified'}\nForm Source: ${sourceName}`;

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

    // 2. Also submit to submit.php (Runs on cPanel/PHP host fallback with LeadRat cURL)
    const phpPromise = fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name,
        mobile,
        email,
        interest: interest || 'Not Specified',
        form_source: sourceName,
        project_name: 'TVS Emerald AVALON',
        message: userMessage,
        location: userLocation,
        budget: userBudget,
        state: userState,
        city: userCity,
        website_hp
      })
    }).catch(() => {});

    // 3. LeadRat CRM Integration (Netlify Serverless Proxy)
    let leadNotes = '';
    if (userMessage && interest) {
      leadNotes = `${userMessage} | Configuration: ${interest} | Source: ${sourceName}`;
    } else if (userMessage) {
      leadNotes = `${userMessage} | Source: ${sourceName}`;
    } else if (interest) {
      leadNotes = `Interested Configuration: ${interest} | Source: ${sourceName}`;
    } else {
      leadNotes = `Source: ${sourceName}`;
    }

    const leadratPayload = [
      {
        name: name,
        state: userState,
        city: userCity,
        location: userLocation,
        budget: userBudget,
        notes: leadNotes,
        email: email,
        countryCode: '91',
        mobile: mobile.replace(/\D/g, ''),
        project: 'TVS Emerald AVALON'
      }
    ];

    const leadratPromise = fetch('leadrat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadratPayload)
    })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log('LeadRat CRM submission success (200 OK):', data);
      } else {
        console.warn(`LeadRat CRM submission status ${res.status}:`, data);
      }
    })
    .catch((err) => {
      console.warn('LeadRat CRM non-blocking error:', err);
    });

    // Google Analytics & Google Ads Event Tracking Integration
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Engagement',
        event_label: sourceName,
        value: 1
      });
    }

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

    await Promise.allSettled([web3Promise, phpPromise, leadratPromise]);

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
