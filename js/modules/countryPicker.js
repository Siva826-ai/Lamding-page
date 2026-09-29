/**
 * International Country Selector with Flag Images, Native Names, Search & Dialing Codes
 */
export const COUNTRIES = [
  { code: 'IN', name: 'India', native: 'भारत', dial: '+91', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', native: '', dial: '+62', region: 'Asia' },
  { code: 'IR', name: 'Iran', native: 'ایران', dial: '+98', region: 'Middle East Asia' },
  { code: 'HU', name: 'Hungary', native: 'Magyarország', dial: '+36', region: 'Europe' },
  { code: 'IS', name: 'Iceland', native: 'Ísland', dial: '+354', region: 'Europe' },
  { code: 'HK', name: 'Hong Kong', native: '香港', dial: '+852', region: 'Asia' },
  { code: 'IQ', name: 'Iraq', native: 'العراق', dial: '+964', region: 'Middle East Asia' },
  { code: 'AE', name: 'United Arab Emirates', native: 'الإمارات العربية المتحدة', dial: '+971', region: 'Middle East Asia' },
  { code: 'SA', name: 'Saudi Arabia', native: 'المملكة العربية السعودية', dial: '+966', region: 'Middle East Asia' },
  { code: 'QA', name: 'Qatar', native: 'قطر', dial: '+974', region: 'Middle East Asia' },
  { code: 'OM', name: 'Oman', native: 'عُمان', dial: '+968', region: 'Middle East Asia' },
  { code: 'KW', name: 'Kuwait', native: 'الكويت', dial: '+965', region: 'Middle East Asia' },
  { code: 'BH', name: 'Bahrain', native: 'البحرين', dial: '+973', region: 'Middle East Asia' },
  { code: 'SG', name: 'Singapore', native: 'Singapore', dial: '+65', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', native: 'Malaysia', dial: '+60', region: 'Asia' },
  { code: 'US', name: 'United States', native: 'USA', dial: '+1', region: 'America' },
  { code: 'GB', name: 'United Kingdom', native: 'UK', dial: '+44', region: 'Europe' },
  { code: 'AU', name: 'Australia', native: 'Australia', dial: '+61', region: 'Oceania' },
  { code: 'CA', name: 'Canada', native: 'Canada', dial: '+1', region: 'America' },
  { code: 'JP', name: 'Japan', native: '日本', dial: '+81', region: 'Asia' },
  { code: 'CN', name: 'China', native: '中国', dial: '+86', region: 'Asia' },
  { code: 'KR', name: 'South Korea', native: '대한민국', dial: '+82', region: 'Asia' },
  { code: 'DE', name: 'Germany', native: 'Deutschland', dial: '+49', region: 'Europe' },
  { code: 'FR', name: 'France', native: 'France', dial: '+33', region: 'Europe' },
  { code: 'IT', name: 'Italy', native: 'Italia', dial: '+39', region: 'Europe' },
  { code: 'ES', name: 'Spain', native: 'España', dial: '+34', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', native: 'Nederland', dial: '+31', region: 'Europe' },
  { code: 'RU', name: 'Russia', native: 'Россия', dial: '+7', region: 'Europe Asia' },
  { code: 'BD', name: 'Bangladesh', native: 'বাংলাদেশ', dial: '+880', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', native: 'پاکستان', dial: '+92', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', native: 'இலங்கை', dial: '+94', region: 'Asia' },
  { code: 'NP', name: 'Nepal', native: 'नेपाल', dial: '+977', region: 'Asia' },
  { code: 'PH', name: 'Philippines', native: 'Pilipinas', dial: '+63', region: 'Asia' },
  { code: 'TH', name: 'Thailand', native: 'ไทย', dial: '+66', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', native: 'Việt Nam', dial: '+84', region: 'Asia' },
  { code: 'BR', name: 'Brazil', native: 'Brasil', dial: '+55', region: 'America' },
  { code: 'MX', name: 'Mexico', native: 'México', dial: '+52', region: 'America' },
  { code: 'ZA', name: 'South Africa', native: 'South Africa', dial: '+27', region: 'Africa' },
  { code: 'EG', name: 'Egypt', native: 'مصر', dial: '+20', region: 'Africa Middle East' },
  { code: 'IE', name: 'Ireland', native: 'Éire', dial: '+353', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', native: 'Schweiz', dial: '+41', region: 'Europe' },
  { code: 'SE', name: 'Sweden', native: 'Sverige', dial: '+46', region: 'Europe' },
  { code: 'TR', name: 'Turkey', native: 'Türkiye', dial: '+90', region: 'Europe Asia' },
  { code: 'NZ', name: 'New Zealand', native: 'Aotearoa', dial: '+64', region: 'Oceania' },
  { code: 'PL', name: 'Poland', native: 'Polska', dial: '+48', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', native: 'Україна', dial: '+380', region: 'Europe' },
  { code: 'GR', name: 'Greece', native: 'Ελλάδα', dial: '+30', region: 'Europe' },
  { code: 'PT', name: 'Portugal', native: 'Portugal', dial: '+351', region: 'Europe' },
  { code: 'AT', name: 'Austria', native: 'Österreich', dial: '+43', region: 'Europe' },
  { code: 'BE', name: 'Belgium', native: 'België', dial: '+32', region: 'Europe' },
  { code: 'DK', name: 'Denmark', native: 'Danmark', dial: '+45', region: 'Europe' },
  { code: 'FI', name: 'Finland', native: 'Suomi', dial: '+358', region: 'Europe' },
  { code: 'NO', name: 'Norway', native: 'Norge', dial: '+47', region: 'Europe' }
];

export function initCountryPickers() {
  const prefixContainers = document.querySelectorAll('.phone-flag-prefix');

  prefixContainers.forEach(container => {
    let selectedCountry = COUNTRIES[0]; // Default India (+91)

    container.innerHTML = '';
    container.className = 'phone-flag-prefix country-select-wrapper';

    const triggerBtn = document.createElement('div');
    triggerBtn.className = 'country-select-btn';
    triggerBtn.innerHTML = `
      <span class="country-flag-icon"><img src="https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png" width="20" height="14" alt="${selectedCountry.name}" style="border-radius:2px; object-fit:cover; display:block; border: 0.5px solid rgba(0,0,0,0.15);"></span>
      <span class="country-dial-code">${selectedCountry.dial}</span>
      <span class="country-arrow">▴</span>
    `;

    const panel = document.createElement('div');
    panel.className = 'country-select-panel';

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'country-search-wrapper';
    searchWrapper.innerHTML = `
      <span class="search-icon">🔍</span>
    `;

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'country-search-input';
    searchBox.placeholder = 'Search';
    searchWrapper.appendChild(searchBox);

    const listScroll = document.createElement('div');
    listScroll.className = 'country-list-scroll';

    function renderOptions(filterText = '') {
      listScroll.innerHTML = '';
      const query = filterText.toLowerCase().trim();
      const filtered = COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(query) || 
        (c.native && c.native.toLowerCase().includes(query)) ||
        c.dial.includes(query) || 
        c.code.toLowerCase().includes(query) ||
        (c.region && c.region.toLowerCase().includes(query))
      );

      if (filtered.length === 0) {
        listScroll.innerHTML = `<div style="padding:12px; font-size:0.85rem; color:#94A3B8; text-align:center;">No countries found</div>`;
        return;
      }

      filtered.forEach(c => {
        const item = document.createElement('div');
        item.className = `country-option-item ${c.code === selectedCountry.code ? 'selected' : ''}`;
        
        const labelText = c.native && c.native !== c.name ? `${c.name} (${c.native})` : c.name;
        
        item.innerHTML = `
          <img src="https://flagcdn.com/w40/${c.code.toLowerCase()}.png" width="20" height="14" alt="${c.name}" style="border-radius:2px; object-fit:cover; margin-right:8px; display:inline-block; border: 0.5px solid rgba(0,0,0,0.15);">
          <span style="font-weight:500; color:#1E293B; flex:1; font-size:0.88rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${labelText}</span>
          <span class="dial-code">${c.dial}</span>
        `;

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedCountry = c;
          triggerBtn.querySelector('.country-flag-icon').innerHTML = `<img src="https://flagcdn.com/w40/${c.code.toLowerCase()}.png" width="20" height="14" alt="${c.name}" style="border-radius:2px; object-fit:cover; display:block; border: 0.5px solid rgba(0,0,0,0.15);">`;
          triggerBtn.querySelector('.country-dial-code').textContent = c.dial;
          panel.classList.remove('open');

          // Trigger input event to clear validation errors if present
          const phoneInput = container.closest('.phone-input-flex')?.querySelector('input[name="mobile"]');
          if (phoneInput) {
            phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        listScroll.appendChild(item);
      });
    }

    renderOptions();

    searchBox.addEventListener('input', (e) => {
      renderOptions(e.target.value);
    });

    searchBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    panel.appendChild(searchWrapper);
    panel.appendChild(listScroll);
    container.appendChild(triggerBtn);
    container.appendChild(panel);

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.country-select-panel.open').forEach(p => {
        if (p !== panel) p.classList.remove('open');
      });
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        searchBox.value = '';
        renderOptions('');
        setTimeout(() => searchBox.focus(), 50);
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.country-select-panel.open').forEach(p => p.classList.remove('open'));
  });
}
