/**
 * Dynamic Floor Plan Controller with Locked/Unlocked Blur State
 */
export function initFloorPlans(openImageInLightbox) {
  const floorPlanData = {
    '2bhk': {
      title: '2 BHK CLASSIC',
      area: '965 – 1,245 Sq. Ft.',
      subtitle: '2 BHK CLASSIC <span>(TOWER A - 101 TO 1401) WEST FACING</span>',
      image: 'assets/images/floor_plan.png'
    },
    '3bhk': {
      title: '3 BHK CLASSIC',
      area: '1,430 – 1,550 Sq. Ft.',
      subtitle: '3 BHK CLASSIC <span>(TOWER B & C - 102 TO 1402) EAST FACING</span>',
      image: 'assets/images/floor3.png'
    },
    '4bhk': {
      title: '4 BHK DUPLEX',
      area: '2,600+ Sq. Ft.',
      subtitle: '4 BHK DUPLEX <span>(TOWER D - PENTHOUSE 1401) NORTH-EAST FACING</span>',
      image: 'assets/images/floor4.png'
    }
  };

  // Preload floor plan images for instant tab switching without lag or blank states
  Object.values(floorPlanData).forEach(item => {
    const img = new Image();
    img.src = item.image;
  });

  const planKeys = ['2bhk', '3bhk', '4bhk'];
  let currentPlanIndex = 0;
  let isFloorPlanUnlocked = false;

  const bhkTabBtns = document.querySelectorAll('.bhk-tab-btn');
  const thumbCards = document.querySelectorAll('.thumb-card-item');
  const planTitle = document.getElementById('planTitle');
  const planArea = document.getElementById('planArea');
  const viewerSubTitle = document.getElementById('viewerSubTitle');
  const mainFloorImg = document.getElementById('mainFloorImg');
  const thumbImgs = document.querySelectorAll('.thumb-img');
  const centerLockOverlayBtn = document.getElementById('centerLockOverlayBtn');
  const leftUnlockBtn = document.getElementById('leftUnlockBtn');
  const prevPlanBtn = document.getElementById('prevPlanBtn');
  const nextPlanBtn = document.getElementById('nextPlanBtn');
  const zoomPlanBtn = document.getElementById('zoomPlanBtn');

  function updateUnlockState(unlocked) {
    isFloorPlanUnlocked = unlocked;
    if (mainFloorImg) {
      mainFloorImg.classList.toggle('is-blurred', !unlocked);
      mainFloorImg.style.opacity = '1';
    }
    if (centerLockOverlayBtn) {
      centerLockOverlayBtn.classList.toggle('is-hidden', unlocked);
    }
    thumbImgs.forEach(img => {
      img.classList.toggle('is-blurred', !unlocked);
    });
    if (leftUnlockBtn) {
      const labelSpan = leftUnlockBtn.querySelector('span');
      if (labelSpan) {
        labelSpan.textContent = unlocked ? 'Inspect Floor Plan' : 'View Floor Plan';
      }
    }
  }

  // Ensure all floor plan images are blurred by default on page load
  updateUnlockState(false);

  function selectPlan(planKey) {
    currentPlanIndex = planKeys.indexOf(planKey);
    const data = floorPlanData[planKey];

    bhkTabBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-plan') === planKey));
    thumbCards.forEach(card => card.classList.toggle('active', card.getAttribute('data-plan') === planKey));

    if (data && mainFloorImg) {
      if (planTitle) planTitle.textContent = data.title;
      if (planArea) planArea.textContent = data.area;
      if (viewerSubTitle) viewerSubTitle.innerHTML = data.subtitle;

      // Extract the thumbnail's working browser-resolved URL to guarantee image loading on server
      const activeThumb = document.querySelector(`.thumb-card-item[data-plan="${planKey}"]`);
      const thumbImg = activeThumb ? activeThumb.querySelector('.thumb-img') : null;
      const targetSrc = (thumbImg && thumbImg.src) ? thumbImg.src : data.image;

      mainFloorImg.src = targetSrc;
      mainFloorImg.style.opacity = '1';
      mainFloorImg.style.display = 'block';
    }
  }

  if (leftUnlockBtn) {
    leftUnlockBtn.addEventListener('click', (e) => {
      if (isFloorPlanUnlocked && mainFloorImg) {
        e.stopPropagation();
        openImageInLightbox(mainFloorImg.src, planTitle ? planTitle.textContent : 'Floor Plan');
      }
    });
  }

  bhkTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectPlan(btn.getAttribute('data-plan'));
    });
  });

  thumbCards.forEach(card => {
    card.addEventListener('click', () => {
      selectPlan(card.getAttribute('data-plan'));
    });
  });

  if (prevPlanBtn) {
    prevPlanBtn.addEventListener('click', () => {
      currentPlanIndex = (currentPlanIndex - 1 + planKeys.length) % planKeys.length;
      selectPlan(planKeys[currentPlanIndex]);
    });
  }

  if (nextPlanBtn) {
    nextPlanBtn.addEventListener('click', () => {
      currentPlanIndex = (currentPlanIndex + 1) % planKeys.length;
      selectPlan(planKeys[currentPlanIndex]);
    });
  }

  if (zoomPlanBtn) {
    zoomPlanBtn.addEventListener('click', (e) => {
      if (isFloorPlanUnlocked && mainFloorImg) {
        e.stopPropagation();
        openImageInLightbox(mainFloorImg.src, planTitle ? planTitle.textContent : 'Floor Plan');
      }
    });
  }

  return { updateUnlockState };
}
