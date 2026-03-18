/**
 * Branding Customization Page
 *
 * Advanced branding customization with logo upload and color selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Palette, Eye, CheckCircle, ArrowRight, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Predefined color palettes
const COLOR_PALETTES = [
  {
    name: 'Morado Azul (Default)',
    primary: '#D4AF37',
    secondary: '#1E3A8A',
    background: '#020204',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8'
  },
  {
    name: 'Verde Esmeralda',
    primary: '#10B981',
    secondary: '#047857',
    background: '#022C22',
    textPrimary: '#ECFDF5',
    textSecondary: '#6EE7B7'
  },
  {
    name: 'Rojo Intenso',
    primary: '#EF4444',
    secondary: '#B91C1C',
    background: '#1C0A0A',
    textPrimary: '#FEF2F2',
    textSecondary: '#FCA5A5'
  },
  {
    name: 'Naranja Vibrante',
    primary: '#F97316',
    secondary: '#EA580C',
    background: '#1C0A02',
    textPrimary: '#FFF7ED',
    textSecondary: '#FDBA74'
  },
  {
    name: 'Rosa Moderno',
    primary: '#EC4899',
    secondary: '#BE185D',
    background: '#1C0214',
    textPrimary: '#FDF2F8',
    textSecondary: '#F9A8D4'
  },
  {
    name: 'Azul Cielo',
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    background: '#020C1B',
    textPrimary: '#EFF6FF',
    textSecondary: '#93C5FD'
  }
];

export default function BrandingCustomizationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [schoolData, setSchoolData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [customColors, setCustomColors] = useState({
    primary: '#D4AF37',
    secondary: '#1E3A8A',
    background: '#020204'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    // Get school data from navigation state or sessionStorage
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolData') || '{}');
    setSchoolData(data);

    if (!data.schoolName) {
      navigate('/onboarding/create-school');
    }
  }, [location.state, navigate]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|gif|svg\+xml)/)) {
      toast.error('Formato de archivo no válido', {
        description: 'Por favor sube una imagen (JPG, PNG, GIF, SVG)'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Archivo muy grande', {
        description: 'El tamaño máximo es 5MB'
      });
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    toast.success('Logo cargado', {
      description: 'Vista previa generada exitosamente'
    });
  };

  const handlePaletteSelect = (palette) => {
    setSelectedPalette(palette);
    setCustomColors({
      primary: palette.primary,
      secondary: palette.secondary,
      background: palette.background
    });
  };

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSaveBranding = async () => {
    setIsSaving(true);

    try {
      // Use relative URLs in production, full URL in development
      const isProduction = process.env.NODE_ENV === 'production';
      const backendUrl = isProduction ? '' : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

      // Prepare branding data
      const brandingData = {
        primary_color: customColors.primary,
        secondary_color: customColors.secondary,
        background_color: customColors.background,
        text_primary: selectedPalette.textPrimary,
        text_secondary: selectedPalette.textSecondary
      };

      // If there's a logo file, upload it first
      if (logoFile) {
        // In a real implementation, you'd upload to a service like AWS S3, Cloudinary, etc.
        // For now, we'll use a data URL or placeholder
        brandingData.logo_url = logoPreview || `https://ui-avatars.com/api/?name=${schoolData?.schoolName}&background=${customColors.primary.replace('#', '')}&color=fff&size=256`;
      }

      // Update organization branding
      await axios.patch(
        `${backendUrl}/api/organizations/${schoolData?.schoolId}`,
        { branding: brandingData },
        { withCredentials: true }
      );

      toast.success('¡Branding personalizado! 🎨', {
        description: 'Tu academia ahora tiene una identidad única'
      });

      // Navigate to dashboard or next step
      setTimeout(() => {
        navigate('/dashboard', { state: { schoolData } });
      }, 1500);

    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Error al guardar branding', {
        description: error.response?.data?.detail || error.message || 'Por favor intenta nuevamente'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Personaliza tu Identidad 🎨
          </h1>
          <p className="text-xl text-slate-400">
            Sube tu logo y elige los colores que representan tu academia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Palette className="w-6 h-6 text-purple-400" />
                  Configuración de Branding
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia visual de tu academia
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-slate-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Logo
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="data-[state=active]:bg-slate-700">
                      <Palette className="w-4 h-4 mr-2" />
                      Colores
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-6 mt-6">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <Label>Logo de tu academia</Label>

                      <div className="flex items-center gap-6">
                        {/* Current Logo */}
                        <div className="flex-shrink-0">
                          <Avatar className="w-24 h-24 border-2 border-purple-500/30">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                                {schoolData && getInitials(schoolData.schoolName)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1 space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />

                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Subir Logo
                          </Button>

                          <p className="text-xs text-slate-500">
                            Formatos: JPG, PNG, GIF, SVG (máx. 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                      <Label className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Vista Previa
                      </Label>

                      <div className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                {schoolData && getInitials(schoolData.schoolName)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white">{schoolData?.schoolName || 'Tu Academia'}</h3>
                            <p className="text-sm text-slate-400">Academia de Ventas</p>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          style={{
                            background: `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
                          }}
                        >
                          Botón de Ejemplo
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6 mt-6">
                    {/* Predefined Palettes */}
                    <div className="space-y-4">
                      <Label>Paletas Predefinidas</Label>

                      <div className="grid grid-cols-2 gap-3">
                        {COLOR_PALETTES.map((palette) => (
                          <button
                            key={palette.name}
                            onClick={() => handlePaletteSelect(palette)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all hover:scale-[1.02]",
                              selectedPalette.name === palette.name
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                            )}
                          >
                            <div className="flex gap-2 mb-2">
                              <div
                                className="w-6 h-6 rounded-full border border-white/20"
                                style={{ backgroundColor: palette.primary }}
                              />
                              <div
                                className="w-6 h-6 rounded-full border border-white/20"
                                style={{ backgroundColor: palette.secondary }}
                              />
                            </div>
                            <p className="text-xs text-slate-300">{palette.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                      <Label>Colores Personalizados</Label>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Label className="w-32 text-sm">Principal:</Label>
                          <input
                            type="color"
                            value={customColors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-0"
                          />
                          <Input
                            type="text"
                            value={customColors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="flex-1 bg-slate-800/50 border-slate-700"
                            placeholder="#D4AF37"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Label className="w-32 text-sm">Secundario:</Label>
                          <input
                            type="color"
                            value={customColors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-0"
                          />
                          <Input
                            type="text"
                            value={customColors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="flex-1 bg-slate-800/50 border-slate-700"
                            placeholder="#1E3A8A"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Label className="w-32 text-sm">Fondo:</Label>
                          <input
                            type="color"
                            value={customColors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-0"
                          />
                          <Input
                            type="text"
                            value={customColors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                            className="flex-1 bg-slate-800/50 border-slate-700"
                            placeholder="#020204"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Eye className="w-6 h-6 text-purple-400" />
                  Vista Previa en Vivo
                </CardTitle>
                <CardDescription>
                  Así se verá tu academia con los cambios aplicados
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div
                  className="rounded-xl p-6 space-y-6 border border-slate-700/50"
                  style={{ backgroundColor: customColors.background }}
                >
                  {/* Header Preview */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                    <Avatar className="w-12 h-12">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: customColors.primary, color: '#fff' }}>
                          {schoolData && getInitials(schoolData.schoolName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-bold" style={{ color: selectedPalette.textPrimary }}>
                        {schoolData?.schoolName || 'Tu Academia'}
                      </h3>
                      <p className="text-sm" style={{ color: selectedPalette.textSecondary }}>
                        Academia de Ventas Pro
                      </p>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold" style={{ color: selectedPalette.textPrimary }}>
                      Bienvenido a tu Academia
                    </h4>
                    <p className="text-sm" style={{ color: selectedPalette.textSecondary }}>
                      Este es un ejemplo de cómo se verá el contenido con tu personalización.
                    </p>

                    <Button
                      className="w-full"
                      style={{
                        background: `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
                      }}
                    >
                      Comenzar Ahora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Dashboard
          </Button>

          <Button
            onClick={handleSaveBranding}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isSaving ? (
              <>Guardando...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Aplicar Cambios
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}