/**
 * Branding Settings Section
 *
 * Manage visual identity: logo, colors, fonts, and text content
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, Type, Save, Loader2 } from 'lucide-react';

export default function BrandingSection({ organization, onSave, saving }) {
  const [branding, setBranding] = useState(organization.branding || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (field, value) => {
    setBranding((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ branding });
    setHasChanges(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      // In production, upload to storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo_url', reader.result);
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadingLogo(false);
    }
  };

  const presetPalettes = [
    { name: 'Gold & Navy', primary: '#D4AF37', secondary: '#1E3A8A' },
    { name: 'Blue & Gray', primary: '#3B82F6', secondary: '#6B7280' },
    { name: 'Green & Teal', primary: '#10B981', secondary: '#0D9488' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Branding</h2>
          <p className="text-muted-foreground">
            Customize your academy's visual identity
          </p>
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Logo</h3>
          </div>

          {branding.logo_url && (
            <div className="mb-4 p-4 rounded-lg bg-accent/5">
              <img
                src={branding.logo_url}
                alt="Organization logo"
                className="max-h-20 mx-auto"
              />
            </div>
          )}

          <label className="block w-full p-4 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-colors">
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {uploadingLogo ? 'Uploading...' : 'Click to upload new logo'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploadingLogo}
              className="hidden"
            />
          </label>
        </div>

        {/* Colors */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Colors</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presetPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => {
                      handleChange('primary_color', palette.primary);
                      handleChange('secondary_color', palette.secondary);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors text-sm"
                  >
                    <div className="flex">
                      <div
                        className="w-4 h-4 rounded-l"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-r"
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <span>{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Primary
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={branding.primary_color || '#D4AF37'}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primary_color || '#D4AF37'}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Secondary
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={branding.secondary_color || '#1E3A8A'}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.secondary_color || '#1E3A8A'}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3 mb-4">
            <Type className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Typography</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Heading Font
              </label>
              <select
                value={branding.font_heading || 'Playfair Display'}
                onChange={(e) => handleChange('font_heading', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Body Font
              </label>
              <select
                value={branding.font_body || 'DM Sans'}
                onChange={(e) => handleChange('font_body', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="DM Sans">DM Sans</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <h3 className="font-semibold mb-4">Text Content</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Site Name
              </label>
              <input
                type="text"
                value={branding.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="Sales Academy"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Tagline
              </label>
              <input
                type="text"
                value={branding.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Transform Your Sales Team"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Hero Title
              </label>
              <input
                type="text"
                value={branding.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Become a Top Producer"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
