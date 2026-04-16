/**
 * ═══════════════════════════════════════════════════════════════
 * Image Optimization Utilities
 * ═══════════════════════════════════════════════════════════════
 *
 * Utilities for optimizing images and loading strategies
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(baseUrl, sizes = [320, 640, 960, 1280]) {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Get optimal image size based on container
 */
export function getOptimalImageSize(containerWidth, pixelRatio = 1) {
  const baseSizes = [320, 640, 960, 1280, 1920];
  const requiredSize = Math.ceil(containerWidth * pixelRatio);

  return baseSizes.find(size => size >= requiredSize) || baseSizes[baseSizes.length - 1];
}

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.01,
      ...options
    };

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.onIntersect.bind(this),
        this.options
      );
    }

    this.images = new Map();
  }

  observe(img, src) {
    if (!this.observer) {
      img.src = src;
      return;
    }

    this.images.set(img, src);
    this.observer.observe(img);
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = this.images.get(img);

        if (src) {
          img.src = src;
          img.classList.add('loaded');
        }

        this.observer.unobserve(img);
        this.images.delete(img);
      }
    });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.images.clear();
  }
}

/**
 * Progressive image loading (blurhash → low-res → high-res)
 */
export function loadProgressiveImage(imgElement, blurhash, lowResUrl, highResUrl) {
  // Start with blurhash placeholder
  if (blurhash) {
    imgElement.style.filter = 'blur(20px)';
  }

  // Load low-res image
  const lowResImg = new Image();
  lowResImg.src = lowResUrl;

  lowResImg.onload = () => {
    imgElement.src = lowResUrl;
  };

  // Load high-res image
  const highResImg = new Image();
  highResImg.src = highResUrl;

  highResImg.onload = () => {
    imgElement.src = highResUrl;
    imgElement.style.filter = 'none';
    imgElement.classList.add('loaded');
  };
}

/**
 * Convert image to WebP format (if supported)
 */
export function getSupportedImageUrl(originalUrl, webpUrl) {
  if (supportsWebP()) {
    return webpUrl || originalUrl;
  }
  return originalUrl;
}

/**
 * Check if browser supports WebP
 */
function supportsWebP() {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Calculate image aspect ratio
 */
export function getAspectRatio(width, height) {
  return width / height;
}

/**
 * Generate placeholder image (data URI)
 */
export function generatePlaceholder(width, height, color = '#e0e0e0') {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Preload critical images
 */
export function preloadImages(urls) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Get image dimensions from URL
 */
export async function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
}
