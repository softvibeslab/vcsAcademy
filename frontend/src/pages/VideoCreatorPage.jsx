/**
 * Video Creator Page - AI Video Generation Wizard
 *
 * Feature 9: 5-step wizard to create AI-generated lesson videos
 * - Step 1: Script (Textarea + AI improvement)
 * - Step 2: Avatar selection (6 cards with categories)
 * - Step 3: Voice selection (5 cards with Spanish filters)
 * - Step 4: Template selection (4 templates grid)
 * - Step 5: Customization (color picker, CTA, duration, toggles)
 * - Final: Progress screen (5 stages, 8s) → Video player mock + actions
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, ArrowRight, Sparkles, Wand2, Check, ChevronRight,
  User, Users, Briefcase, Smile, Ghost, Play, Download, Edit, Eye,
  Subtitles, Music, Palette, Clock, Target, Volume2, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// STEPPER CONFIG
// ============================================
const steps = [
  { id: 1, name: 'Guion', icon: Sparkles },
  { id: 2, name: 'Avatar', icon: User },
  { id: 3, name: 'Voz', icon: Volume2 },
  { id: 4, name: 'Template', icon: Briefcase },
  { id: 5, name: 'Personalizar', icon: Palette }
];

// ============================================
// AVATAR OPTIONS
// ============================================
const avatarCategories = [
  {
    id: 'masculine',
    name: 'Masculino',
    avatars: [
      { id: 'm1', name: 'James', role: 'Executive', thumbnail: '👨‍💼', color: 'from-blue-500 to-cyan-500' },
      { id: 'm2', name: 'Marcus', role: 'Coach', thumbnail: '👨‍🏫', color: 'from-purple-500 to-pink-500' },
      { id: 'm3', name: 'Jake', role: 'Presenter', thumbnail: '🎤', color: 'from-emerald-500 to-teal-500' }
    ]
  },
  {
    id: 'feminine',
    name: 'Femenino',
    avatars: [
      { id: 'f1', name: 'Sarah', role: 'Executive', thumbnail: '👩‍💼', color: 'from-rose-500 to-pink-500' },
      { id: 'f2', name: 'Elena', role: 'Coach', thumbnail: '👩‍🏫', color: 'from-amber-500 to-orange-500' },
      { id: 'f3', name: 'Maya', role: 'Presenter', thumbnail: '🎤', color: 'from-violet-500 to-purple-500' }
    ]
  }
];

// ============================================
// VOICE OPTIONS
// ============================================
const voices = [
  { id: 'v1', name: 'Carlos', accent: 'Spain (Castilian)', gender: 'Male', tone: 'Professional', thumbnail: '🇪🇸' },
  { id: 'v2', name: 'María', accent: 'Mexico', gender: 'Female', tone: 'Warm', thumbnail: '🇲🇽' },
  { id: 'v3', name: 'Javier', accent: 'Argentina', gender: 'Male', tone: 'Energetic', thumbnail: '🇦🇷' },
  { id: 'v4', name: 'Carmen', accent: 'Colombia', gender: 'Female', tone: 'Friendly', thumbnail: '🇨🇴' },
  { id: 'v5', name: 'AI Neutral', accent: 'Neutral Spanish', gender: 'AI', tone: 'Neutral', thumbnail: '🤖' }
];

// ============================================
// TEMPLATE OPTIONS
// ============================================
const templates = [
  {
    id: 'corporate',
    name: 'Modern Corporate',
    description: 'Limpio, profesional, minimalista',
    thumbnail: '🏢',
    color: 'from-slate-700 to-slate-900',
    features: ['Solid colors', 'Clean typography', 'Subtle animations']
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrativo, cinematográfico, inmersivo',
    thumbnail: '🎬',
    color: 'from-purple-700 to-indigo-900',
    features: ['Cinematic transitions', 'Mood lighting', 'Story frames']
  },
  {
    id: 'whiteboard',
    name: 'Whiteboard',
    description: 'Educativo, animado drawings',
    thumbnail: '📝',
    color: 'from-emerald-700 to-teal-900',
    features: ['Hand-drawn animations', 'Sketch style', 'Step-by-step']
  },
  {
    id: 'talking',
    name: 'Talking Head',
    description: 'Presenter focus, minimal background',
    thumbnail: '👤',
    color: 'from-blue-700 to-cyan-900',
    features: ['Avatar centered', 'Blur background', 'Focus on speaker']
  }
];

// ============================================
// PROGRESS STAGES (for generation)
// ============================================
const generationStages = [
  { id: 1, name: 'Analizando guion...', duration: 1500 },
  { id: 2, name: 'Generando avatar...', duration: 2000 },
  { id: 3, name: 'Sintetizando voz...', duration: 2500 },
  { id: 4, name: 'Renderizando video...', duration: 3000 },
  { id: 5, name: 'Aplicando efectos finales...', duration: 1500 }
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function VideoCreatorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);

  // Form state
  const [script, setScript] = useState(`Bienvenidos a esta lección sobre ventas de alto ticket.

Hoy vamos a aprender los 3 pilares fundamentales para cerrar ventas de $10,000 o más.

Primero, la calificación. Solo debes hablar con prospectos que tengan capacidad de pago.

Segundo, el valor. No vendas características, vende resultados transformadores.

Tercero, la confianza. La gente compra de personas en las que confían.

En los próximos minutos, profundizaremos en cada uno de estos pilares con ejemplos prácticos.`);
  const [improvedScript, setImprovedScript] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarCategories[0].avatars[0]);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customization, setCustomization] = useState({
    primaryColor: '#8B5CF6',
    ctaText: 'Continuar al siguiente módulo',
    ctaEnabled: true,
    duration: 120,
    subtitles: true,
    backgroundMusic: true,
    logo: false
  });

  // ============================================
  // HANDLERS
  // ============================================
  const handleImproveScript = () => {
    setImprovedScript(`Bienvenidos a esta lección sobre **ventas de alto ticket** 🎯

Hoy vamos a descubrir los **3 pilares fundamentales** para dominar el arte de cerrar ventas de $10,000+.

📌 **Pilar 1: Calificación Inteligente**
Solo invierte tiempo en prospectos con capacidad de compra verificada.

📌 **Pilar 2: Valor Transformador**
No vendas características, vende **resultados que cambian vidas**.

📌 **Pilar 3: Confidencia Inquebrantable**
Las personas compran de líderes en quienes confían plenamente.

En los próximos minutos, desglosaremos cada pilar con **ejemplos del mundo real** que puedes aplicar hoy mismo.`);
    toast.success('Guion mejorado', {
      description: 'He optimizado tu texto con emojis, formato y estructura',
      duration: 2000
    });
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);

    // Run through all stages
    for (let i = 0; i < generationStages.length; i++) {
      setGenerationStage(i);
      await new Promise(resolve => setTimeout(resolve, generationStages[i].duration));
    }

    setIsGenerating(false);
    setGeneratedVideo({
      id: Date.now(),
      thumbnail: '🎬',
      duration: customization.duration,
      url: 'https://www.youtube.com/embed/HmZPlXY6Dqk',
      youtubeId: 'HmZPlXY6Dqk',
      config: { script, avatar: selectedAvatar, voice: selectedVoice, template: selectedTemplate, customization }
    });

    toast.success('¡Video generado! 🎉', {
      description: 'Tu video está listo para usar',
      duration: 3000
    });
  };

  const handleDownload = () => {
    toast.success('Descarga iniciada', {
      description: 'Tu video se está descargando...',
      duration: 2000
    });
  };

  const handleEdit = () => {
    setCurrentStep(5);
    setGeneratedVideo(null);
  };

  const handleUse = () => {
    toast.success('Video aplicado a lección', {
      description: 'El video ahora está asociado a tu lección',
      duration: 2000
    });
    navigate('/lessons/1/edit');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return script.trim().length > 0;
      case 2: return selectedAvatar !== null;
      case 3: return selectedVoice !== null;
      case 4: return selectedTemplate !== null;
      case 5: return true;
      default: return false;
    }
  };

  // ============================================
  // RENDER STEP
  // ============================================
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Tu Guion
                </CardTitle>
                <CardDescription>
                  Escribe o pega el guion que el avatar leerá
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Escribe tu guion aquí..."
                  rows={12}
                  className="bg-slate-800/50 border-slate-700 resize-none"
                />

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleImproveScript}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Mejorar con IA
                  </Button>
                  <div className="text-sm text-slate-400">
                    {script.trim().length} caracteres
                  </div>
                </div>

                {improvedScript && (
                  <Card className="border-emerald-500/30 bg-emerald-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Guion Mejorado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300 whitespace-pre-line">{improvedScript}</p>
                      <Button
                        onClick={() => {
                          setScript(improvedScript);
                          setImprovedScript('');
                        }}
                        size="sm"
                        className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Usar esta versión
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-6">
              {avatarCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">{category.name}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {category.avatars.map((avatar) => (
                      <motion.button
                        key={avatar.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                          selectedAvatar.id === avatar.id
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                        )}
                      >
                        {selectedAvatar.id === avatar.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                        <div className={cn(
                          "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-3xl mb-3",
                          avatar.color
                        )}>
                          {avatar.thumbnail}
                        </div>

                        <p className="text-sm font-medium text-white">{avatar.name}</p>
                        <p className="text-xs text-slate-400">{avatar.role}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-400">Selecciona una voz</h3>

              {voices.map((voice) => (
                <motion.button
                  key={voice.id}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedVoice(voice)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedVoice.id === voice.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                    {voice.thumbnail}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{voice.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{voice.accent}</span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{voice.gender}</span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{voice.tone}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                    <Play className="w-4 h-4" />
                  </Button>

                  {selectedVoice.id === voice.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all duration-200 text-left",
                    selectedTemplate.id === template.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                  )}
                >
                  {selectedTemplate.id === template.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className={cn(
                    "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-4xl mb-4",
                    template.color
                  )}>
                    {template.thumbnail}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{template.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, idx) => (
                      <Badge key={idx} className="text-xs bg-slate-800/50 text-slate-300">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Personalización</CardTitle>
                <CardDescription>
                  Ajusta los detalles finales de tu video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Color */}
                <div>
                  <label className="text-sm text-white mb-2 block">Color principal</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customization.primaryColor}
                      onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={customization.primaryColor}
                      onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                      className="flex-1 bg-slate-800/50 border-slate-700"
                    />
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <label className="text-sm text-white mb-2 flex items-center justify-between">
                    <span>Duración del video</span>
                    <span className="text-slate-400">{customization.duration} segundos</span>
                  </label>
                  <Slider
                    value={[customization.duration]}
                    onValueChange={([value]) => setCustomization({ ...customization, duration: value })}
                    min={30}
                    max={300}
                    step={10}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>30s</span>
                    <span>5min</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="cta"
                      checked={customization.ctaEnabled}
                      onChange={(e) => setCustomization({ ...customization, ctaEnabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="cta" className="text-sm text-white">Mostrar CTA al final</label>
                  </div>
                  <Input
                    value={customization.ctaText}
                    onChange={(e) => setCustomization({ ...customization, ctaText: e.target.value })}
                    disabled={!customization.ctaEnabled}
                    placeholder="Continuar al siguiente módulo"
                    className="w-64 bg-slate-800/50 border-slate-700"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'subtitles', icon: Subtitles, label: 'Subtítulos' },
                    { id: 'backgroundMusic', icon: Music, label: 'Música de fondo' },
                    { id: 'logo', icon: Target, label: 'Incluir logo' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCustomization({ ...customization, [item.id]: !customization[item.id] })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        customization[item.id]
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                      )}
                    >
                      <item.icon className={cn(
                        "w-6 h-6",
                        customization[item.id] ? "text-purple-400" : "text-slate-400"
                      )} />
                      <span className={cn(
                        "text-xs",
                        customization[item.id] ? "text-white" : "text-slate-400"
                      )}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Resumen del video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avatar</span>
                    <span className="text-white">{selectedAvatar.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voz</span>
                    <span className="text-white">{selectedVoice.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Template</span>
                    <span className="text-white">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duración</span>
                    <span className="text-white">{customization.duration}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  // ============================================
  // GENERATION SCREEN
  // ============================================
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-12 text-center space-y-8">
              {/* Animated Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Generando tu video...
                </h2>
                <p className="text-slate-400">
                  {generationStages[generationStage]?.name}
                </p>
              </div>

              <Progress
                value={((generationStage + 1) / generationStages.length) * 100}
                className="h-3 bg-slate-800/50"
              />

              <div className="flex justify-center gap-2">
                {generationStages.map((stage, idx) => (
                  <motion.div
                    key={stage.id}
                    animate={{
                      scale: idx <= generationStage ? 1 : 0.8,
                      backgroundColor: idx <= generationStage ? '#8B5CF6' : '#334155'
                    }}
                    className="w-3 h-3 rounded-full transition-colors duration-300"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // GENERATED VIDEO SCREEN
  // ============================================
  if (generatedVideo) {
    return (
      <div className="min-h-screen bg-slate-950">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Video Generado</h1>
                <p className="text-sm text-slate-400">Tu video está listo</p>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Video Preview */}
            <Card className="border-slate-800/50 bg-slate-900/50 overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={generatedVideo.url}
                  title="Generated Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={handleDownload}
                className="h-14 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar MP4
              </Button>

              <Button
                onClick={handleEdit}
                variant="outline"
                className="h-14 border-slate-700 bg-slate-800/50 text-white"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar
              </Button>

              <Button
                onClick={handleUse}
                className="h-14 bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Eye className="w-5 h-5 mr-2" />
                Usar en lección
              </Button>
            </div>

            {/* Video Details */}
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">Detalles del video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white">Configuración</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avatar</span>
                        <span className="text-white">{generatedVideo.config.avatar.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Voz</span>
                        <span className="text-white">{generatedVideo.config.voice.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Template</span>
                        <span className="text-white">{generatedVideo.config.template.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white">Opciones</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duración</span>
                        <span className="text-white">{generatedVideo.duration}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtítulos</span>
                        <span className="text-white">{generatedVideo.config.customization.subtitles ? 'Sí' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Música</span>
                        <span className="text-white">{generatedVideo.config.customization.backgroundMusic ? 'Sí' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // ============================================
  // MAIN WIZARD SCREEN
  // ============================================
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30"
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Creador de Videos con IA
              </h1>
              <p className="text-sm text-slate-400">
                Genera videos profesionales en minutos
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stepper */}
      <div className="border-b border-slate-800/50 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-colors",
                    currentStep === step.id ? "text-purple-400" : currentStep > step.id ? "text-emerald-400" : "text-slate-500"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                    currentStep === step.id && "border-purple-500 bg-purple-500/10",
                    currentStep > step.id && "border-emerald-500 bg-emerald-500/10",
                    currentStep < step.id && "border-slate-700 bg-slate-900/50"
                  )}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                </button>

                {idx < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    currentStep > step.id ? "bg-emerald-500" : "bg-slate-700"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="p-8 max-w-5xl mx-auto">
        <div className="flex gap-8">
          {/* Step Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-64">
            <Card className="border-slate-800/50 bg-slate-900/50 sticky top-32">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-medium text-white mb-4">Progreso</h3>

                <div className="space-y-3">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.id} className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-colors",
                        currentStep === step.id && "bg-purple-500/10"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          currentStep === step.id && "bg-purple-500",
                          currentStep > step.id && "bg-emerald-500",
                          currentStep < step.id && "bg-slate-700"
                        )}>
                          {currentStep > step.id ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <StepIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          currentStep >= step.id ? "text-white" : "text-slate-500"
                        )}>{step.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Completado</span>
                    <span className="text-white font-medium">{currentStep}/{steps.length}</span>
                  </div>
                  <Progress value={(currentStep / steps.length) * 100} className="h-2 bg-slate-800/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-800/50">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            variant="outline"
            className="h-12 border-slate-700 bg-slate-800/50 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleGenerateVideo}
              className={cn(
                "h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                "shadow-lg shadow-purple-500/25"
              )}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Video con IA
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
