/**
 * Location Connectivity Small Cards & Modal Controller
 */
export function initConnectivity() {
  const connModalOverlay = document.getElementById('connModalOverlay');
  const connModalClose = document.getElementById('connModalClose');
  const connModalIcon = document.getElementById('connModalIcon');
  const connModalTitle = document.getElementById('connModalTitle');
  const connModalSubtitle = document.getElementById('connModalSubtitle');
  const connModalList = document.getElementById('connModalList');
  const connViewBtns = document.querySelectorAll('[data-conn-category]');

  const connData = {
    it: {
      title: 'IT Hubs',
      icon: '💼',
      subtitle: '14 Major Tech Parks & Corporate Employment Hubs nearby',
      items: [
        { name: 'International Tech Park', dist: '230 m' },
        { name: 'Embassy TechZone a quick', dist: '750 m' },
        { name: 'Featherlite the Address', dist: '750 m' },
        { name: 'Brigade Tech Boulevard', dist: '1 km' },
        { name: 'Fortune Towers', dist: '3.9 km' },
        { name: 'SRM Tech Park', dist: '4.7 km' },
        { name: 'MPL Silicon Towers', dist: '6 km' },
        { name: 'Shell Centre', dist: '6.4 km' },
        { name: 'Chennai One IT SEZ', dist: '7.1 km' },
        { name: 'MEPZ', dist: '8.8 km' },
        { name: 'Brigade World Trade Centre', dist: '9.4 km' },
        { name: 'Global Infocity\'s', dist: '10.6 km' },
        { name: 'TIDEL Park', dist: '12.9 km' },
        { name: 'DLF IT Park', dist: '16.2 km' }
      ]
    },
    edu: {
      title: 'Educational Institutions',
      icon: '🎓',
      subtitle: '15 Top Schools, Colleges & Universities nearby',
      items: [
        { name: 'Narayana e-Techno School', dist: '250 m' },
        { name: 'Sri Chaitanya Techno School', dist: '400 m' },
        { name: 'Vels University', dist: '1.4 km' },
        { name: 'Vels Global School', dist: '2.2 km' },
        { name: 'ORCHIDS The International School', dist: '2.4 km' },
        { name: 'Vels Vidyashram', dist: '2.5 km' },
        { name: 'Maharishi Vidya Mandir', dist: '2.9 km' },
        { name: 'VISTAS', dist: '2.9 km' },
        { name: 'SDNB Vaishnav College', dist: '4.5 km' },
        { name: 'Vista Billabong High International School Medavakkam', dist: '5.1 km' },
        { name: 'Jerusalem College of Engineering', dist: '5.4 km' },
        { name: 'Madras Institute of Technology', dist: '6.1 km' },
        { name: 'Bharat University', dist: '8 km' },
        { name: 'DAV Public School', dist: '8.4 km' },
        { name: 'Madras Christian College', dist: '9.7 km' }
      ]
    },
    ent: {
      title: 'Shopping & Leisure Hubs',
      icon: '🛍️',
      subtitle: '9 Premier Malls, Shopping Centers & Theaters nearby',
      items: [
        { name: 'Saravana Selvarathanam Ultimate Store', dist: '1.8 km' },
        { name: 'Super Saravana Stores', dist: '4.7 km' },
        { name: 'Pothys', dist: '6.4 km' },
        { name: 'The Chennai Silks', dist: '6.5 km' },
        { name: 'AEROHUB Mall', dist: '7 km' },
        { name: 'PVR Grand Galada Center', dist: '7.4 km' },
        { name: 'Grand Square Mall', dist: '8.1 km' },
        { name: 'Phoenix Mall (Market City)', dist: '10 km' },
        { name: 'BSR Mall', dist: '11 km' }
      ]
    }
  };

  function openConnModal(catKey) {
    const cat = connData[catKey];
    if (!cat || !connModalOverlay) return;

    if (connModalIcon) connModalIcon.textContent = cat.icon;
    if (connModalTitle) connModalTitle.textContent = cat.title;
    if (connModalSubtitle) connModalSubtitle.textContent = cat.subtitle;

    if (connModalList) {
      connModalList.innerHTML = cat.items.map(item => `
        <li>
          <span>${item.name}</span>
          <strong>${item.dist}</strong>
        </li>
      `).join('');
    }

    connModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeConnModal() {
    if (connModalOverlay) {
      connModalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  connViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catKey = btn.getAttribute('data-conn-category');
      openConnModal(catKey);
    });
  });

  if (connModalClose) connModalClose.addEventListener('click', closeConnModal);
  if (connModalOverlay) {
    connModalOverlay.addEventListener('click', (e) => {
      if (e.target === connModalOverlay) closeConnModal();
    });
  }
}
