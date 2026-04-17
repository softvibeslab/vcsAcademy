/**
 * Step 1: Branding Customization
 *
 * Allows organizations to customize their visual identity:
 * - Logo upload
 * - Primary and secondary colors
 * - Site name and tagline
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, Type, Eye } from 'lucide-react';

export default function BrandingStep({ formData, updateFormData, onNext, onBack }) {
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      // In a real implementation, you would upload to a storage service
      // For now, we'll use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ logoUrl: reader.result });
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadingLogo(false);
    }
  };

  const presetColorPalettes = [
    { name: 'Gold & Navy', primary: '#D4AF37', secondary: '#1E3A8A' },
    { name: 'Blue & Gray', primary: '#3B82F6', secondary: '#6B7280' },
    { name: 'Green & Teal', primary: '#10B981', secondary: '#0D9488' },
    { name: 'Purple & Pink', primary: '#8B5CF6', secondary: '#EC4899' },
    { name: 'Red & Orange', primary: '#EF4444', secondary: '#F97316' },
    { name: 'Monochrome', primary: '#18181B', secondary: '#71717A' },
  ];

  const applyPreset = (palette) => {
    updateFormData({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold">Customize Your Brand</h2>
        <p className="text-muted-foreground">
          Make your academy feel like home with your own branding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Settings */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="p-6 rounded-xl border border-border/50 bg-background/50">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Logo</h3>
            </div>

            <div className="space-y-4">
              {formData.logoUrl && (
                <div className="flex items-center justify-center p-4 border border-border rounded-lg bg-accent/5">
                  <img
                    src={formData.logoUrl}
                    alt="Organization logo"
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              )}

              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-colors">
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="p-6 rounded-xl border border-border/50 bg-background/50">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Colors</h3>
            </div>

            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Quick Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetColorPalettes.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => applyPreset(palette)}
                      className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
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
                      <span className="text-xs">{palette.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        updateFormData({ primaryColor: e.target.value })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        updateFormData({ primaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono"
                      placeholder="#D4AF37"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        updateFormData({ secondaryColor: e.target.value })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        updateFormData({ secondaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono"
                      placeholder="#1E3A8A"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site Identity */}
          <div className="p-6 rounded-xl border border-border/50 bg-background/50">
            <div className="flex items-center space-x-3 mb-4">
              <Type className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Site Identity</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="e.g., Acme Sales Academy"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be your organization's official name
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  URL Slug *
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => {
                      // Convert to lowercase and replace spaces with hyphens
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      updateFormData({ slug });
                    }}
                    placeholder="acme-academy"
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background font-mono text-sm"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lowercase letters, numbers, and hyphens only. This will be your unique URL.
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Site Display Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => updateFormData({ siteName: e.target.value })}
                  placeholder="e.g., Acme Sales Academy"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateFormData({ tagline: e.target.value })}
                  placeholder="e.g., Transform Your Sales Team"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Live Preview</h3>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Toggle Preview</span>
            </button>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-background/50">
            {/* Preview Card */}
            <div
              className="p-6 rounded-lg space-y-4"
              style={{
                backgroundColor: `${formData.primaryColor}10`,
                border: `2px solid ${formData.primaryColor}30`,
              }}
            >
              {formData.logoUrl && (
                <img
                  src={formData.logoUrl}
                  alt="Logo preview"
                  className="h-12 w-auto object-contain"
                />
              )}

              <div>
                <h4
                  className="text-2xl font-heading font-bold"
                  style={{ color: formData.primaryColor }}
                >
                  {formData.siteName || 'Your Academy Name'}
                </h4>
                <p className="text-muted-foreground">{formData.tagline || 'Your tagline'}</p>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Get Started
                </button>
                <button
                  className="px-4 py-2 rounded-lg border-2 font-medium"
                  style={{
                    borderColor: formData.secondaryColor,
                    color: formData.secondaryColor,
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium">Your Color Palette</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-10 h-10 rounded-lg shadow-inner"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Primary</div>
                    <div className="text-sm font-mono">{formData.primaryColor}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-10 h-10 rounded-lg shadow-inner"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Secondary</div>
                    <div className="text-sm font-mono">{formData.secondaryColor}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
