import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  // Cargar configuración de branding activa
  const fetchBranding = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/branding/config`);
      if (!response.ok) {
        throw new Error('Failed to fetch branding configuration');
      }

      const result = await response.json();

      if (result.success) {
        setBranding(result.data);
        applyBrandingToDOM(result.data);
      }
    } catch (err) {
      console.error('Error fetching branding:', err);
      setError(err.message);
      // Aplicar branding por defecto en caso de error
      applyDefaultBranding();
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Aplicar branding al DOM
  const applyBrandingToDOM = (brandingData) => {
    if (!brandingData) return;

    const root = document.documentElement;

    // Aplicar colores como CSS variables
    if (brandingData.colors) {
      const { colors } = brandingData;
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-accent', colors.accent);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-card', colors.card_background);
      root.style.setProperty('--color-text-main', colors.text_main);
      root.style.setProperty('--color-text-muted', colors.text_muted);
    }

    // Aplicar tipografía
    if (brandingData.typography) {
      const { typography } = brandingData;
      root.style.setProperty('--font-heading', typography.font_heading);
      root.style.setProperty('--font-body', typography.font_body);
      root.style.setProperty('--font-mono', typography.font_mono);
    }

    // Aplicar border radius
    if (brandingData.ui_config) {
      const { ui_config } = brandingData;
      const radiusMap = {
        '0': '0px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px'
      };
      root.style.setProperty('--border-radius', radiusMap[ui_config.border_radius] || '0px');
    }

    // Aplicar gradientes
    if (brandingData.gradients) {
      const { gradients } = brandingData;
      root.style.setProperty('--gradient-primary', gradients.primary_gradient);
      root.style.setProperty('--gradient-secondary', gradients.secondary_gradient);
    }

    // Actualizar favicon
    if (brandingData.images?.favicon_url) {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = brandingData.images.favicon_url;
      }
    }

    // Actualizar título
    if (brandingData.texts?.site_name) {
      document.title = brandingData.texts.site_name;
    }

    // Inyectar CSS personalizado
    if (brandingData.advanced?.custom_css) {
      let customStyle = document.getElementById('custom-branding-css');
      if (!customStyle) {
        customStyle = document.createElement('style');
        customStyle.id = 'custom-branding-css';
        document.head.appendChild(customStyle);
      }
      customStyle.textContent = brandingData.advanced.custom_css;
    }

    // Inyectar scripts head
    if (brandingData.advanced?.head_scripts) {
      let headScriptContainer = document.getElementById('custom-head-scripts');
      if (!headScriptContainer) {
        headScriptContainer = document.createElement('div');
        headScriptContainer.id = 'custom-head-scripts';
        document.head.appendChild(headScriptContainer);
      }
      headScriptContainer.innerHTML = brandingData.advanced.head_scripts;
    }
  };

  // Aplicar branding por defecto
  const applyDefaultBranding = () => {
    const defaultBranding = {
      colors: {
        primary: '#D4AF37',
        secondary: '#1E3A8A',
        accent: '#F59E0B',
        background: '#020204',
        card_background: '#0A0A0B',
        text_main: '#F8FAFC',
        text_muted: '#94A3B8'
      },
      typography: {
        font_heading: 'Playfair Display',
        font_body: 'DM Sans',
        font_mono: 'JetBrains Mono'
      },
      ui_config: {
        border_radius: '0'
      },
      gradients: {
        primary_gradient: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
        secondary_gradient: 'linear-gradient(180deg, #020204 0%, #0F172A 100%)'
      }
    };

    applyBrandingToDOM(defaultBranding);
  };

  // Crear configuración de branding
  const createBranding = async (configData) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });

      if (!response.ok) {
        throw new Error('Failed to create branding configuration');
      }

      const result = await response.json();
      toast.success('Branding configuration created successfully');

      // Si la nueva configuración está activa, recargar
      if (result.data.is_active) {
        await fetchBranding();
      }

      return result.data;
    } catch (err) {
      toast.error('Error creating branding configuration');
      throw err;
    }
  };

  // Actualizar configuración de branding
  const updateBranding = async (configId, updateData) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update branding configuration');
      }

      const result = await response.json();
      toast.success('Branding configuration updated successfully');

      // Si la configuración actualizada está activa, recargar
      if (result.data.is_active || branding?.config_id === configId) {
        await fetchBranding();
      }

      return result.data;
    } catch (err) {
      toast.error('Error updating branding configuration');
      throw err;
    }
  };

  // Eliminar configuración de branding
  const deleteBranding = async (configId) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config/${configId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete branding configuration');
      }

      toast.success('Branding configuration deleted successfully');

      // Si se eliminó la configuración activa, recargar
      if (branding?.config_id === configId) {
        await fetchBranding();
      }

      return true;
    } catch (err) {
      toast.error('Error deleting branding configuration');
      throw err;
    }
  };

  // Activar configuración de branding
  const activateBranding = async (configId) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config/${configId}/activate`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to activate branding configuration');
      }

      toast.success('Branding configuration activated successfully');
      await fetchBranding();

      return true;
    } catch (err) {
      toast.error('Error activating branding configuration');
      throw err;
    }
  };

  // Obtener todas las configuraciones
  const getAllBrandingConfigs = async (skip = 0, limit = 20) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config/all?skip=${skip}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch branding configurations');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      toast.error('Error fetching branding configurations');
      throw err;
    }
  };

  // Obtener configuración por ID
  const getBrandingById = async (configId) => {
    try {
      const response = await fetch(`${API_URL}/api/branding/config/${configId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch branding configuration');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      toast.error('Error fetching branding configuration');
      throw err;
    }
  };

  // Cargar branding al montar
  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const value = {
    branding,
    loading,
    error,
    fetchBranding,
    createBranding,
    updateBranding,
    deleteBranding,
    activateBranding,
    getAllBrandingConfigs,
    getBrandingById
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
