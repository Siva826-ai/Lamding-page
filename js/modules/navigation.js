/**
 * Navigation & Smooth Scroll Controller
 * Handles navbar navigation, section scrolling, mobile drawer closing,
 * sticky header offset, and active link highlighting via IntersectionObserver.
 */
export function initNavigation() {
  const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-drawer a[href^="#"]');
  const sections = document.querySelectorAll('#overview, #highlights, #price, #floor-plans, #amenities, #gallery, #location, #developer, #callback');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileToggle = document.getElementById('mobileToggle');

  // Smooth scroll handler for all internal anchor links
  function scrollToSection(targetId) {
    if (targetId === 'overview' || targetId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Add click listeners to all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        
        // Close mobile drawer if open
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          if (mobileToggle) mobileToggle.innerHTML = '☰';
        }

        scrollToSection(targetId);
      }
    });
  });

  // Active Link Highlighting using IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          updateActiveLink(currentId);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  function updateActiveLink(activeId) {
    if (!activeId) return;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}` || (activeId === 'overview' && (href === '#overview' || href === '#top'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
