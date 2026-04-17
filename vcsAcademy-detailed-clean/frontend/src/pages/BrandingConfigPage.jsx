import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBranding } from '../contexts/BrandingContext';
import { toast } from 'sonner';
import {
  Save,
  Trash2,
  Plus,
  Eye,
  Edit,
  Palette,
  Type,
  Image,
  Settings,
  Globe,
  Code,
  Sparkles
} from 'lucide-react';

const BrandingConfigPage = () => {
  const navigate = useNavigate();
  const { getAllBrandingConfigs, createBranding, updateBranding, deleteBranding, activateBranding, branding: activeBranding } = useBranding();

  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: 'Default Branding',
    is_active: false,
    colors: {
      primary: '#D4AF37',
      secondary: '#1E3A8A',
      accent: '#F59E0B',
      background: '#020204',
      card_background: '#0A0A0B',
      text_main: '#F8FAFC',
      text_muted: '#94A3B8'
    },
    images: {
      logo_url: '',
      logo_dark_url: '',
      favicon_url: '',
      hero_background: '',
      login_background: ''
    },
    typography: {
      font_heading: 'Playfair Display',
      font_body: 'DM Sans',
      font_mono: 'JetBrains Mono'
    },
    texts: {
      site_name: 'Vacation Club Sales Academy',
      tagline: 'The Performance Operating System',
      site_description: 'Premium sales training platform'
    },
    ui_config: {
      border_radius: '0',
      button_style: 'sharp',
      card_style: 'glass',
      animation_level: 'normal'
    },
    gradients: {
      primary_gradient: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
      secondary_gradient: 'linear-gradient(180deg, #020204 0%, #0F172A 100%)'
    },
    social: {
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      linkedin_url: '',
      youtube_url: ''
    },
    advanced: {
      custom_css: '',
      head_scripts: '',
      body_scripts: ''
    }
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const result = await getAllBrandingConfigs(0, 50);
      if (result.success) {
        setConfigs(result.data);
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConfig = async (config) => {
    setSelectedConfig(config);
    setFormData(config);
    setIsEditing(true);
    setActiveTab('colors');
  };

  const handleCreateNew = () => {
    setSelectedConfig(null);
    setIsEditing(false);
    setFormData({
      name: 'New Branding Config',
      is_active: false,
      colors: {
        primary: '#D4AF37',
        secondary: '#1E3A8A',
        accent: '#F59E0B',
        background: '#020204',
        card_background: '#0A0A0B',
        text_main: '#F8FAFC',
        text_muted: '#94A3B8'
      },
      images: {
        logo_url: '',
        logo_dark_url: '',
        favicon_url: '',
        hero_background: '',
        login_background: ''
      },
      typography: {
        font_heading: 'Playfair Display',
        font_body: 'DM Sans',
        font_mono: 'JetBrains Mono'
      },
      texts: {
        site_name: 'Vacation Club Sales Academy',
        tagline: 'The Performance Operating System',
        site_description: 'Premium sales training platform'
      },
      ui_config: {
        border_radius: '0',
        button_style: 'sharp',
        card_style: 'glass',
        animation_level: 'normal'
      },
      gradients: {
        primary_gradient: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
        secondary_gradient: 'linear-gradient(180deg, #020204 0%, #0F172A 100%)'
      },
      social: {
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: ''
      },
      advanced: {
        custom_css: '',
        head_scripts: '',
        body_scripts: ''
      }
    });
    setActiveTab('colors');
  };

  const handleSave = async () => {
    try {
      if (isEditing && selectedConfig) {
        await updateBranding(selectedConfig.config_id, formData);
      } else {
        await createBranding(formData);
      }
      await loadConfigs();
      setIsEditing(true);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleDelete = async (configId) => {
    if (!confirm('Are you sure you want to delete this branding configuration?')) return;

    try {
      await deleteBranding(configId);
      await loadConfigs();
      if (selectedConfig?.config_id === configId) {
        setSelectedConfig(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  const handleActivate = async (configId) => {
    try {
      await activateBranding(configId);
      await loadConfigs();
    } catch (error) {
      console.error('Error activating config:', error);
    }
  };

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateRootField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'texts', label: 'Texts', icon: Settings },
    { id: 'ui', label: 'UI Config', icon: Sparkles },
    { id: 'gradients', label: 'Gradients', icon: Palette },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text_main mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Branding Configuration
            </h1>
            <p className="text-text_muted">Customize your platform's appearance and feel</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider hover:opacity-90 transition-all"
          >
            <Plus size={20} />
            Create New
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Config List */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-md border border-white/5 p-6">
              <h2 className="text-xl font-semibold text-text_main mb-4">Configurations</h2>

              {loading ? (
                <div className="text-center text-text_muted py-8">Loading...</div>
              ) : configs.length === 0 ? (
                <div className="text-center text-text_muted py-8">No configurations found</div>
              ) : (
                <div className="space-y-3">
                  {configs.map((config) => (
                    <motion.div
                      key={config.config_id}
                      whileHover={{ x: 4 }}
                      className={`p-4 border transition-all cursor-pointer ${
                        selectedConfig?.config_id === config.config_id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => handleSelectConfig(config)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-text_main">{config.name}</h3>
                          {config.is_active && (
                            <span className="text-xs text-primary uppercase tracking-wider">Active</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {config.is_active ? null : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActivate(config.config_id);
                              }}
                              className="p-2 hover:bg-white/5 transition-colors"
                              title="Activate"
                            >
                              <Eye size={16} className="text-text_muted" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(config.config_id);
                            }}
                            className="p-2 hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Color Preview */}
                      <div className="flex gap-1 mt-3">
                        <div
                          className="w-6 h-6 rounded border border-white/10"
                          style={{ backgroundColor: config.colors?.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded border border-white/10"
                          style={{ backgroundColor: config.colors?.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-6 h-6 rounded border border-white/10"
                          style={{ backgroundColor: config.colors?.background }}
                          title="Background"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Editor */}
          <div className="lg:col-span-2">
            {selectedConfig || isEditing ? (
              <div className="bg-card/50 backdrop-blur-md border border-white/5 p-6">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 transition-all ${
                          activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text_muted hover:text-text_main'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_muted mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateRootField('name', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.is_active}
                        onChange={(e) => updateRootField('is_active', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isActive" className="text-text_muted">Set as Active</label>
                    </div>
                  </div>

                  {/* Colors Tab */}
                  {activeTab === 'colors' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Color Palette</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(formData.colors).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => updateField('colors', key, e.target.value)}
                                className="w-12 h-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => updateField('colors', key, e.target.value)}
                                className="flex-1 bg-black/50 border border-white/10 focus:border-primary/50 text-white p-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typography Tab */}
                  {activeTab === 'typography' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Typography</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(formData.typography).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <select
                              value={value}
                              onChange={(e) => updateField('typography', key, e.target.value)}
                              className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                            >
                              <option value="Playfair Display">Playfair Display</option>
                              <option value="DM Sans">DM Sans</option>
                              <option value="JetBrains Mono">JetBrains Mono</option>
                              <option value="Inter">Inter</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Open Sans">Open Sans</option>
                              <option value="Lato">Lato</option>
                              <option value="Montserrat">Montserrat</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Images Tab */}
                  {activeTab === 'images' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Images & Logos</h3>
                      <div className="space-y-4">
                        {Object.entries(formData.images).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateField('images', key, e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Texts Tab */}
                  {activeTab === 'texts' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Brand Texts</h3>
                      <div className="space-y-4">
                        {Object.entries(formData.texts).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            {key === 'site_description' ? (
                              <textarea
                                value={value}
                                onChange={(e) => updateField('texts', key, e.target.value)}
                                rows={3}
                                className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => updateField('texts', key, e.target.value)}
                                className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UI Config Tab */}
                  {activeTab === 'ui' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">UI Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Border Radius</label>
                          <select
                            value={formData.ui_config.border_radius}
                            onChange={(e) => updateField('ui_config', 'border_radius', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                          >
                            <option value="0">0px (Sharp)</option>
                            <option value="4">4px</option>
                            <option value="8">8px</option>
                            <option value="12">12px</option>
                            <option value="16">16px</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Button Style</label>
                          <select
                            value={formData.ui_config.button_style}
                            onChange={(e) => updateField('ui_config', 'button_style', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                          >
                            <option value="sharp">Sharp</option>
                            <option value="rounded">Rounded</option>
                            <option value="pill">Pill</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Card Style</label>
                          <select
                            value={formData.ui_config.card_style}
                            onChange={(e) => updateField('ui_config', 'card_style', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                          >
                            <option value="flat">Flat</option>
                            <option value="elevated">Elevated</option>
                            <option value="glass">Glass</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Animation Level</label>
                          <select
                            value={formData.ui_config.animation_level}
                            onChange={(e) => updateField('ui_config', 'animation_level', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                          >
                            <option value="none">None</option>
                            <option value="minimal">Minimal</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradients Tab */}
                  {activeTab === 'gradients' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Gradients</h3>
                      <div className="space-y-4">
                        {Object.entries(formData.gradients).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateField('gradients', key, e.target.value)}
                              className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3 font-mono text-sm"
                            />
                            <div
                              className="mt-2 h-12 rounded border border-white/10"
                              style={{ background: value }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Tab */}
                  {activeTab === 'social' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Social Media</h3>
                      <div className="space-y-4">
                        {Object.entries(formData.social).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-text_muted mb-2 capitalize">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <input
                              type="text"
                              value={value || ''}
                              onChange={(e) => updateField('social', key, e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advanced Tab */}
                  {activeTab === 'advanced' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-text_main">Advanced Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Custom CSS</label>
                          <textarea
                            value={formData.advanced.custom_css}
                            onChange={(e) => updateField('advanced', 'custom_css', e.target.value)}
                            rows={8}
                            placeholder="/* Custom CSS */"
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Head Scripts (Analytics, etc.)</label>
                          <textarea
                            value={formData.advanced.head_scripts}
                            onChange={(e) => updateField('advanced', 'head_scripts', e.target.value)}
                            rows={4}
                            placeholder="<script>...</script>"
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3 font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text_muted mb-2">Body Scripts</label>
                          <textarea
                            value={formData.advanced.body_scripts}
                            onChange={(e) => updateField('advanced', 'body_scripts', e.target.value)}
                            rows={4}
                            placeholder="<script>...</script>"
                            className="w-full bg-black/50 border border-white/10 focus:border-primary/50 text-white p-3 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedConfig(null);
                      setIsEditing(false);
                    }}
                    className="px-6 py-3 border border-white/10 text-text_muted hover:text-text_main hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                  >
                    <Save size={20} />
                    Save Configuration
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card/50 backdrop-blur-md border border-white/5 p-12 text-center">
                <Palette size={64} className="mx-auto text-text_muted mb-4" />
                <h3 className="text-xl font-semibold text-text_main mb-2">No Configuration Selected</h3>
                <p className="text-text_muted mb-6">Select an existing configuration or create a new one</p>
                <button
                  onClick={handleCreateNew}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  <Plus size={20} />
                  Create New Configuration
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingConfigPage;
