/**
 * TVS Emerald Favicon Controller
 * Renders vector TVS Emerald logo and generates sharp favicon data URLs across all browsers.
 */
export function initFavicon() {
  try {
    const svgUrl = '/favicon.svg';

    // Ensure SVG Favicon link is attached with cache-busting timestamp
    let svgLink = document.querySelector('link[type="image/svg+xml"]');
    if (!svgLink) {
      svgLink = document.createElement('link');
      svgLink.rel = 'icon';
      svgLink.type = 'image/svg+xml';
      document.head.appendChild(svgLink);
    }
    svgLink.href = svgUrl + '?v=' + Date.now();

    // Convert SVG to Canvas PNGs for legacy browser compatibility
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      [16, 32, 180].forEach(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const pngData = canvas.toDataURL('image/png');

        if (size === 32) {
          let icoLink = document.querySelector('link[rel="icon"][type="image/x-icon"]');
          if (icoLink) icoLink.href = pngData;
          let png32 = document.querySelector('link[sizes="32x32"]');
          if (png32) png32.href = pngData;
        } else if (size === 16) {
          let png16 = document.querySelector('link[sizes="16x16"]');
          if (png16) png16.href = pngData;
        } else if (size === 180) {
          let appleLink = document.querySelector('link[rel="apple-touch-icon"]');
          if (appleLink) appleLink.href = pngData;
        }
      });
    };
    img.src = svgUrl;
  } catch (err) {
    // Fallback handled by browser
  }
}
