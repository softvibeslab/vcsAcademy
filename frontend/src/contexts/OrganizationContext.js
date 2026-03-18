/**
 * Organization Context for VCSA White-Label Platform
 *
 * Provides organization data and branding throughout the application.
 * Detects organization from subdomain and loads configuration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OrganizationContext = createContext(null);

/**
 * Organization Provider Component
 *
 * Wraps the application and provides organization data to all components.
 * Detects organization from subdomain (e.g., acme.vcsa.com) and loads
 * branding configuration, settings, and feature flags.
 */
export function OrganizationProvider({ children }) {
  const [organization, setOrganization] = useState(null);
  const [branding, setBranding] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Extract organization slug from current hostname
   * e.g., "acme.vcsa.com" → "acme"
   *       "vcsa.com" → "vcsa"
   *       "localhost" → "vcsa"
   */
  const extractSlugFromHostname = useCallback(() => {
    const hostname = window.location.hostname;

    // Handle localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'vcsa'; // Default for local development
    }

    // Handle subdomains
    const parts = hostname.split('.');

    // acme.vcsa.com → ['acme', 'vcsa', 'com']
    if (parts.length >= 3) {
      const subdomain = parts[0];

      // Skip www
      if (subdomain !== 'www') {
        return subdomain;
      }
    }

    // Default to vcsa
    return 'vcsa';
  }, []);

  /**
   * Fetch organization data from API
   */
  const fetchOrganization = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);

      // Use relative URLs in production, full URL in development
      const isProduction = process.env.NODE_ENV === 'production';
      const backendUrl = isProduction ? '' : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

      // Try to get organization by slug
      const response = await axios.get(`${backendUrl}/api/organizations/by-slug/${slug}`);

      const orgData = response.data;

      setOrganization(orgData);
      setBranding(orgData.branding);
      setSettings(orgData.settings);

      // Apply branding theme
      if (orgData.branding) {
        applyOrganizationTheme(orgData.branding);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading organization:', err);

      if (err.response?.status === 404) {
        setError('Organization not found');
      } else {
        setError('Failed to load organization configuration');
      }

      // Set default branding as fallback
      const defaultBranding = {
        logo_url: '/logo.png',
        primary_color: '#D4AF37',
        secondary_color: '#1E3A8A',
        background_color: '#020204',
        text_primary: '#F1F5F9',
        text_secondary: '#94A3B8',
        font_heading: 'Playfair Display',
        font_body: 'DM Sans',
        site_name: 'Sales Academy',
        tagline: 'Transform Your Sales Team',
        hero_title: 'Become a Top Producer',
      };

      setBranding(defaultBranding);
      setLoading(false);
    }
  }, []);

  /**
   * Apply organization branding to DOM
   */
  const applyOrganizationTheme = (branding) => {
    const root = document.documentElement;

    // Apply colors as CSS variables
    if (branding.primary_color) {
      root.style.setProperty('--primary', branding.primary_color);
    }

    if (branding.secondary_color) {
      root.style.setProperty('--secondary', branding.secondary_color);
    }

    if (branding.background_color) {
      root.style.setProperty('--background', branding.background_color);
    }

    if (branding.text_primary) {
      root.style.setProperty('--text-primary', branding.text_primary);
    }

    if (branding.text_secondary) {
      root.style.setProperty('--text-secondary', branding.text_secondary);
    }

    // Update page title
    if (branding.site_name) {
      document.title = `${branding.site_name} - Sales Training Platform`;
    }

    // Update favicon
    if (branding.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = branding.favicon_url;
      }
    }

    // Update fonts if custom
    if (branding.font_heading || branding.font_body) {
      const headingFont = branding.font_heading || 'Playfair Display';
      const bodyFont = branding.font_body || 'DM Sans';

      // Create or update Google Fonts link
      let fontsLink = document.querySelector('link[data-google-fonts]');

      if (!fontsLink) {
        fontsLink = document.createElement('link');
        fontsLink.rel = 'stylesheet';
        fontsLink.setAttribute('data-google-fonts', 'true');
        document.head.appendChild(fontsLink);
      }

      // Build font URL (simple version, could be enhanced)
      const fonts = [headingFont.replace(' ', '+'), bodyFont.replace(' ', '+')].join('|');
      fontsLink.href = `https://fonts.googleapis.com/css2?family=${fonts}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
    }

    // Inject custom CSS if provided
    if (branding.custom_css) {
      let customStyle = document.querySelector('#org-custom-css');

      if (!customStyle) {
        customStyle = document.createElement('style');
        customStyle.id = 'org-custom-css';
        document.head.appendChild(customStyle);
      }

      customStyle.textContent = branding.custom_css;
    }
  };

  /**
   * Initialize organization on mount
   */
  useEffect(() => {
    const slug = extractSlugFromHostname();
    fetchOrganization(slug);
  }, [extractSlugFromHostname, fetchOrganization]);

  /**
   * Context value
   */
  const value = {
    organization,
    branding,
    settings,
    loading,
    error,
    // Convenience getters
    siteName: branding?.site_name || 'Sales Academy',
    tagline: branding?.tagline || 'Transform Your Sales Team',
    heroTitle: branding?.hero_title || 'Become a Top Producer',
    logoUrl: branding?.logo_url || '/logo.png',
    primaryColor: branding?.primary_color || '#D4AF37',
    secondaryColor: branding?.secondary_color || '#1E3A8A',

    // Feature flags
    isGamificationEnabled: settings?.enable_gamification ?? true,
    isCommunityEnabled: settings?.enable_community ?? true,
    isEventsEnabled: settings?.enable_events ?? true,
    isAIAssistantEnabled: settings?.enable_ai_assistant ?? true,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

/**
 * Hook to use organization context
 *
 * Usage:
 *   const { organization, branding, siteName } = useOrganization();
 *
 * @returns {Object} Organization context value
 */
export const useOrganization = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }

  return context;
};

/**
 * Hook to use organization branding
 *
 * Convenience hook that returns only branding-related values
 *
 * Usage:
 *   const { logoUrl, primaryColor, siteName } = useOrganizationBranding();
 *
 * @returns {Object} Branding values
 */
export const useOrganizationBranding = () => {
  const { branding, siteName, logoUrl, primaryColor, secondaryColor } = useOrganization();

  return {
    branding,
    siteName,
    logoUrl,
    primaryColor,
    secondaryColor,
  };
};

/**
 * Hook to use organization settings
 *
 * Convenience hook that returns only settings-related values
 *
 * Usage:
 *   const { isGamificationEnabled, isCommunityEnabled } = useOrganizationSettings();
 *
 * @returns {Object} Settings values
 */
export const useOrganizationSettings = () => {
  const {
    settings,
    isGamificationEnabled,
    isCommunityEnabled,
    isEventsEnabled,
    isAIAssistantEnabled,
  } = useOrganization();

  return {
    settings,
    isGamificationEnabled,
    isCommunityEnabled,
    isEventsEnabled,
    isAIAssistantEnabled,
  };
};

export default OrganizationContext;
