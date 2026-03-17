/**
 * Dynamic Theme System for VCSA White-Label Platform
 *
 * Applies organization branding dynamically to the application.
 * Handles colors, fonts, logos, and custom CSS.
 */

import React, { useState, useEffect } from 'react';

/**
 * Apply organization branding to the application
 *
 * This function updates CSS variables, fonts, logos, and other
 * visual elements based on the organization's branding configuration.
 *
 * @param {Object} branding - Organization branding object
 * @param {string} branding.logo_url - URL to organization logo
 * @param {string} branding.primary_color - Primary brand color (hex)
 * @param {string} branding.secondary_color - Secondary brand color (hex)
 * @param {string} branding.background_color - Background color (hex)
 * @param {string} branding.text_primary - Primary text color (hex)
 * @param {string} branding.text_secondary - Secondary text color (hex)
 * @param {string} branding.font_heading - Heading font family
 * @param {string} branding.font_body - Body text font family
 * @param {string} branding.site_name - Site name for page title
 * @param {string} branding.favicon_url - URL to favicon
 * @param {string} branding.custom_css - Custom CSS to inject
 */
export function applyOrganizationTheme(branding) {
  if (!branding) {
    console.warn('No branding provided, using defaults');
    applyDefaultTheme();
    return;
  }

  const root = document.documentElement;

  // Apply color theme as CSS custom properties
  applyColorTheme(root, branding);

  // Apply typography
  applyTypography(root, branding);

  // Update document metadata
  updateDocumentMetadata(branding);

  // Inject custom CSS if provided
  injectCustomCSS(branding.custom_css);

  // Apply theme to body
  applyBodyTheme(branding);
}

/**
 * Apply color theme using CSS custom properties
 */
function applyColorTheme(root, branding) {
  const colors = {
    '--primary': branding.primary_color || '#D4AF37',
    '--secondary': branding.secondary_color || '#1E3A8A',
    '--background': branding.background_color || '#020204',
    '--foreground': branding.text_primary || '#F1F5F9',
    '--text-primary': branding.text_primary || '#F1F5F9',
    '--text-secondary': branding.text_secondary || '#94A3B8',
    '--muted': blendColor(branding.background_color || '#020204', branding.text_primary || '#F1F5F9', 0.1),
    '--accent': branding.primary_color || '#D4AF37',
    '--border': blendColor(branding.text_secondary || '#94A3B8', branding.background_color || '#020204', 0.1),
  };

  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Generate RGB variants for alpha transparency
  if (branding.primary_color) {
    const rgb = hexToRgb(branding.primary_color);
    if (rgb) {
      root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }

  if (branding.secondary_color) {
    const rgb = hexToRgb(branding.secondary_color);
    if (rgb) {
      root.style.setProperty('--secondary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }
}

/**
 * Apply typography settings
 */
function applyTypography(root, branding) {
  const headingFont = branding.font_heading || 'Playfair Display';
  const bodyFont = branding.font_body || 'DM Sans';

  // Set font families as CSS variables
  root.style.setProperty('--font-heading', headingFont);
  root.style.setProperty('--font-body', bodyFont);

  // Load Google Fonts
  loadGoogleFonts([headingFont, bodyFont]);

  // Apply font family to body
  document.body.style.fontFamily = bodyFont;
}

/**
 * Update document metadata (title, favicon)
 */
function updateDocumentMetadata(branding) {
  // Update page title
  const siteName = branding.site_name || 'Sales Academy';
  document.title = `${siteName} - Sales Training Platform`;

  // Update favicon
  if (branding.favicon_url) {
    updateFavicon(branding.favicon_url);
  }

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    const tagline = branding.tagline || 'Transform Your Sales Team';
    metaDescription.setAttribute('content', `${siteName} - ${tagline}`);
  }
}

/**
 * Inject custom CSS from organization branding
 */
function injectCustomCSS(customCSS) {
  if (!customCSS) {
    return;
  }

  let styleElement = document.getElementById('org-custom-css');

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'org-custom-css';
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = customCSS;
}

/**
 * Apply theme to body element
 */
function applyBodyTheme(branding) {
  const body = document.body;

  // Set background color
  body.style.backgroundColor = branding.background_color || '#020204';

  // Set text color
  body.style.color = branding.text_primary || '#F1F5F9';

  // Add theme class for CSS targeting
  body.classList.add('org-theme-applied');
}

/**
 * Apply default VCSA theme
 */
function applyDefaultTheme() {
  applyOrganizationTheme({
    logo_url: '/logo.png',
    primary_color: '#D4AF37',
    secondary_color: '#1E3A8A',
    background_color: '#020204',
    text_primary: '#F1F5F9',
    text_secondary: '#94A3B8',
    font_heading: 'Playfair Display',
    font_body: 'DM Sans',
    site_name: 'Vacation Club Sales Academy',
    tagline: 'Transform Your Sales Team',
  });
}

/**
 * Load Google Fonts for custom fonts
 */
function loadGoogleFonts(fonts) {
  // Convert font names to URL format
  const fontParams = fonts
    .map(font => font.replace(/ /g, '+'))
    .join('|');

  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontParams}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;

  // Check if already loaded
  const existingLink = document.querySelector(`link[href*="${fontParams}"]`);

  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.setAttribute('data-google-fonts', 'true');
    document.head.appendChild(link);
  }
}

/**
 * Update favicon
 */
function updateFavicon(faviconUrl) {
  let favicon = document.querySelector('link[rel="icon"]');

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = faviconUrl;
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Blend two colors for transparency effects
 */
function blendColor(color1, color2, opacity) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return color1;
  }

  const r = Math.round(rgb1.r * (1 - opacity) + rgb2.r * opacity);
  const g = Math.round(rgb1.g * (1 - opacity) + rgb2.g * opacity);
  const b = Math.round(rgb1.b * (1 - opacity) + rgb2.b * opacity);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * React Hook for using dynamic theme
 *
 * Automatically applies theme when organization branding changes
 *
 * @param {Object} branding - Organization branding object
 * @returns {Object} Theme utility functions
 */
export function useDynamicTheme(branding) {
  const [currentBranding, setCurrentBranding] = useState(branding);

  useEffect(() => {
    if (branding && branding !== currentBranding) {
      applyOrganizationTheme(branding);
      setCurrentBranding(branding);
    }
  }, [branding, currentBranding]);

  return {
    applyTheme: applyOrganizationTheme,
    resetTheme: applyDefaultTheme,
  };
}

/**
 * Get current theme values as object
 *
 * Useful for inline styles or dynamic styling
 *
 * @returns {Object} Current theme values
 */
export function getCurrentTheme() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);

  return {
    primary: styles.getPropertyValue('--primary').trim(),
    secondary: styles.getPropertyValue('--secondary').trim(),
    background: styles.getPropertyValue('--background').trim(),
    textPrimary: styles.getPropertyValue('--text-primary').trim(),
    textSecondary: styles.getPropertyValue('--text-secondary').trim(),
    fontHeading: styles.getPropertyValue('--font-heading').trim(),
    fontBody: styles.getPropertyValue('--font-body').trim(),
  };
}

/**
 * Create a styled component with dynamic theme colors
 *
 * @param {string} styleString - CSS string with theme variables
 * @returns {string} Processed CSS string
 */
export function themedCSS(styleString) {
  return styleString.replace(
    /var\((--[\w-]+)\)/g,
    (_, varName) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return styles.getPropertyValue(varName).trim() || '';
    }
  );
}

/**
 * Generate theme-aware Tailwind classes
 *
 * @param {Object} options - Style options
 * @returns {string} CSS classes
 */
export function themeClasses(options = {}) {
  const {
    bg = true,
    text = true,
    border = false,
  } = options;

  const classes = [];

  if (bg) {
    classes.push('bg-background');
  }

  if (text) {
    classes.push('text-foreground');
  }

  if (border) {
    classes.push('border-border');
  }

  return classes.join(' ');
}

export default applyOrganizationTheme;
