/**
 * Lesson Editor Page - CMS Lesson Editor
 *
 * Feature 6: Rich lesson editor for creators
 * - Rich textarea for content
 * - Drag & drop file upload (simulated)
 * - Duration, timestamps, CTA fields
 * - Video embed preview
 * - Save with loading state
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Save, ArrowLeft, Eye, Upload, X, Clock, Link2, FileText,
  Video, Image as ImageIcon, File, Check, Loader2, Play,
  Plus, Trash2, GripVertical, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// MOCK DATA
// ============================================
const mockLesson = {
  id: 'lesson-1',
  title: 'Introducción a las Ventas de Alto Ticket',
  description: 'Aprende los fundamentos de ventas de alto valor',
  content: `# Introducción

Bienvenido a esta lección sobre ventas de alto ticket.

## Conceptos Clave

1. **Calificación**: Identifica prospectos con capacidad de compra
2. **Valor**: Vende resultados, no características
3. **Confianza**: Construye credibilidad antes de cerrar

## Ejemplo Práctico

Cuando hables con un prospecto, enfócate en:

- El problema que resuelves
- El resultado que logran
- La inversión vs retorno`,
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  duration: '25:30',
  ctaText: 'Continuar al siguiente módulo',
  ctaLink: '/modules/2',
  resources: [
    { id: 1, name: 'guia-ventas.pdf', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'script-llamadas.docx', type: 'doc', size: '156 KB' }
  ],
  timestamps: [
    { id: 1, time: '00:00', title: 'Introducción' },
    { id: 2, time: '05:30', title: 'Concepto 1: Calificación' },
    { id: 3, time: '12:45', title: 'Concepto 2: Valor' },
    { id: 4, time: '18:20', title: 'Ejemplo práctico' },
    { id: 5, time: '23:00', title: 'Cierre' }
  ],
  published: true
};

// ============================================
// TIMESTAMP ITEM COMPONENT
// ============================================
function TimestampItem({ timestamp, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState(timestamp.time);
  const [title, setTitle] = useState(timestamp.title);

  const handleSave = () => {
    onEdit(timestamp.id, { time, title });
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
      <GripVertical className="w-4 h-4 text-slate-600 cursor-move" />

      {!isEditing ? (
        <>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {time}
          </Badge>
          <span className="flex-1 text-sm text-white">{title}</span>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </>
      ) : (
        <>
          <Input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-20 h-8 bg-slate-900/50 border-slate-600 text-xs"
            placeholder="00:00"
          />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 h-8 bg-slate-900/50 border-slate-600 text-xs"
            placeholder="Título"
          />
          <Button
            onClick={handleSave}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-emerald-400"
          >
            <Check className="w-3.5 h-3.5" />
          </Button>
        </>
      )}

      <Button
        onClick={() => onDelete(timestamp.id)}
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

// ============================================
// RESOURCE ITEM COMPONENT
// ============================================
function ResourceItem({ resource, onDelete }) {
  const getIcon = () => {
    switch (resource.type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'image': return ImageIcon;
      default: return File;
    }
  };

  const Icon = getIcon();

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{resource.name}</p>
        <p className="text-xs text-slate-400">{resource.size}</p>
      </div>
      <Button
        onClick={() => onDelete(resource.id)}
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

// ============================================
// DROPZONE COMPONENT
// ============================================
function Dropzone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    // Simulate file upload
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
        isDragging
          ? "border-purple-500 bg-purple-500/10"
          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
      )}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) {
            onUpload(files);
          }
        }}
      />
      <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
      <p className="text-sm text-slate-300 mb-1">
        Arrastra archivos aquí o haz clic para subir
      </p>
      <p className="text-xs text-slate-500">
        PDF, DOC, imágenes, videos (máx. 50MB)
      </p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonEditorPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [lesson, setLesson] = useState(mockLesson);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showPreview, setShowPreview] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveStatus('saved');

    toast.success('Lección guardada', {
      description: lesson.title,
      duration: 2000
    });
  };

  const handleFieldChange = (field, value) => {
    setLesson(prev => ({ ...prev, [field]: value }));
    setSaveStatus('unsaved');
  };

  const handleAddTimestamp = () => {
    const newTimestamp = {
      id: Date.now(),
      time: '00:00',
      title: 'Nuevo marcador'
    };
    setLesson(prev => ({
      ...prev,
      timestamps: [...prev.timestamps, newTimestamp]
    }));
    setSaveStatus('unsaved');
  };

  const handleEditTimestamp = (id, updates) => {
    setLesson(prev => ({
      ...prev,
      timestamps: prev.timestamps.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
    setSaveStatus('unsaved');
  };

  const handleDeleteTimestamp = (id) => {
    setLesson(prev => ({
      ...prev,
      timestamps: prev.timestamps.filter(t => t.id !== id)
    }));
    setSaveStatus('unsaved');
  };

  const handleUploadFiles = (files) => {
    const newResources = files.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    }));

    setLesson(prev => ({
      ...prev,
      resources: [...prev.resources, ...newResources]
    }));

    toast.success(`${files.length} archivo(s) subido(s)`, {
      duration: 2000
    });

    setSaveStatus('unsaved');
  };

  const handleDeleteResource = (id) => {
    setLesson(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id)
    }));
    setSaveStatus('unsaved');
  };

  // Auto-save on change (debounced)
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // ============================================
  // RENDER
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
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">
                  {lesson.title || 'Nueva Lección'}
                </h1>
                {lesson.published && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Publicado
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Editando lección
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Status */}
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' ? (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : saveStatus === 'saved' ? (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Sin guardar</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista previa
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving || saveStatus === 'saved'}
              className={cn(
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                isSaving && "opacity-70"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Información básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Título de la lección</Label>
                    <Input
                      value={lesson.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="Ej: Introducción a las ventas de alto ticket"
                      className="mt-2 bg-slate-800/50 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Descripción breve</Label>
                    <Textarea
                      value={lesson.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Descripción corta que aparecerá en la tarjeta de la lección"
                      rows={2}
                      className="mt-2 bg-slate-800/50 border-slate-700 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Contenido de la lección</CardTitle>
                  <CardDescription>
                    Usa Markdown para formatear. Soporta títulos, listas, negritas, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={lesson.content}
                    onChange={(e) => handleFieldChange('content', e.target.value)}
                    placeholder="# Título

## Subtítulo

- Punto 1
- Punto 2

**Texto en negrita** y *cursivo*"
                    rows={20}
                    className="bg-slate-800/50 border-slate-700 resize-none font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Recursos adjuntos</CardTitle>
                  <CardDescription>
                    PDFs, documentos, imágenes o videos de apoyo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dropzone onUpload={handleUploadFiles} />

                  {lesson.resources.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {lesson.resources.map((resource) => (
                        <ResourceItem
                          key={resource.id}
                          resource={resource}
                          onDelete={handleDeleteResource}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Video Embed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Video</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">URL del video (YouTube/Vimeo)</Label>
                    <Input
                      value={lesson.videoUrl}
                      onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="mt-2 bg-slate-800/50 border-slate-700"
                    />
                  </div>

                  {lesson.videoUrl && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={lesson.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-white">Duración</Label>
                    <Input
                      value={lesson.duration}
                      onChange={(e) => handleFieldChange('duration', e.target.value)}
                      placeholder="25:30"
                      className="mt-2 bg-slate-800/50 border-slate-700"
                    />
                  </div>

                  {/* AI Video Creator Button */}
                  <Button
                    onClick={() => navigate(`/lessons/${lessonId || 'new'}/video-creator`)}
                    className={cn(
                      "w-full h-12 text-base font-semibold",
                      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                      "shadow-lg shadow-purple-500/25"
                    )}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Crear video con IA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Marcadores</CardTitle>
                    <Button
                      onClick={handleAddTimestamp}
                      size="sm"
                      className="h-7 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  <CardDescription>
                    Navegación rápida por secciones del video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {lesson.timestamps.map((timestamp) => (
                        <TimestampItem
                          key={timestamp.id}
                          timestamp={timestamp}
                          onEdit={handleEditTimestamp}
                          onDelete={handleDeleteTimestamp}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Call to Action</CardTitle>
                  <CardDescription>
                    Botón al finalizar la lección
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Texto del botón</Label>
                    <Input
                      value={lesson.ctaText}
                      onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                      placeholder="Continuar al siguiente módulo"
                      className="mt-2 bg-slate-800/50 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Enlace</Label>
                    <Input
                      value={lesson.ctaLink}
                      onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
                      placeholder="/modules/2"
                      className="mt-2 bg-slate-800/50 border-slate-700"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Publish Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Estado de publicación</p>
                      <p className="text-sm text-slate-400">
                        {lesson.published ? 'Visible para alumnos' : 'Borrador privado'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleFieldChange('published', !lesson.published)}
                      variant={lesson.published ? 'default' : 'outline'}
                      className={cn(
                        lesson.published
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'border-slate-700 bg-slate-800/50 text-white'
                      )}
                    >
                      {lesson.published ? 'Publicado' : 'Borrador'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
