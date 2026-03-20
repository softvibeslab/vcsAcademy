/**
 * Content Upload Page - AI-Assisted Content Creation
 *
 * Feature 7: Two-tab interface for content creation
 * Tab A: Chat with AI assistant (generates title, description, timestamps)
 * Tab B: Large dropzone with auto-fill + "Optimize with AI" (before/after comparison)
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, Upload, Sparkles, Bot, User, Send, FileVideo, FileText,
  Wand2, CheckCircle2, ArrowRight, Copy, Download, Eye, EyeOff,
  Clock, BookOpen, Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// MOCK AI RESPONSES
// ============================================
const mockAIResponses = {
  copywriting: {
    title: 'Copywriting Persuasivo para Ventas de Alto Ticket',
    description: 'Aprende las técnicas de copywriting que utilizan los mejores cerradores para crear mensajes que venden. Domina la estructura AIDA, el poder de las historias y los gatillos mentales que transforman prospectos en clientes.',
    timestamps: [
      { time: '00:00', title: 'Introducción: ¿Por qué el copywriting es crucial?' },
      { time: '04:30', title: 'La estructura AIDA explicada' },
      { time: '09:15', title: 'Gatillo mental 1: Escasez' },
      { time: '14:20', title: 'Gatillo mental 2: Autoridad' },
      { time: '19:45', title: 'Gatillo mental 3: Prueba social' },
      { time: '25:00', title: 'Ejemplo práctico: Email de venta' },
      { time: '31:30', title: 'Ejercicio: Tu primer copy' }
    ]
  },
  videoOptimization: {
    before: {
      title: 'Video de Ventas',
      description: 'Un video sobre ventas',
      content: 'bla bla bla',
      ctaText: 'Click aquí',
      ctaLink: '/click'
    },
    after: {
      title: 'Masterclass: Cerrar Ventas de $10,000 en 3 Llamadas',
      description: 'Descubre el framework exacto que utilizo para cerrar ventas de cinco cifras en solo 3 llamadas telefónicas. Aprende a calificar, presentar y cerrar con técnicas probadas.',
      content: `# Framework de 3 Llamadas

## Llamada 1: Descubrimiento
- Identificar el problema real
- Calificar presupuesto y autoridad
- Crear urgencia

## Llamada 2: Presentación
- Mostrar el ROI específico
- Manejar objeciones principales
- Crear un plan de acción

## Llamada 3: Cierre
- Pedir el negocio con confianza
- Superar la objeción final
- Formalizar el compromiso

💡 **Pro tip:** Siempre cierra en la primera llamada que tengas autoridad para decidir.`,
      ctaText: 'Aplicar al Programa de Ventas',
      ctaLink: '/apply',
      ctaOptimized: true
    }
  }
};

// ============================================
// TAB A: CHAT WITH ASSISTANT
// ============================================
function ChatAssistantTab() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de creación de contenido. Puedo ayudarte a:\n\n✨ Generar títulos atractivos\n📝 Escribir descripciones optimizadas\n⏱️ Crear timestamps automáticamente\n🎯 Sugerir CTAs efectivos\n\n¿Qué contenido estás creando hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const suggestions = [
    { text: 'Dame un guion de copywriting', icon: Wand2 },
    { text: 'Genera timestamps para un video de 30min', icon: Clock },
    { text: 'Crea un CTA irresistible', icon: Target },
    { text: 'Optimiza mi descripción', icon: Sparkles }
  ];

  const handleSend = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = {
        role: 'assistant',
        content: '',
        type: 'text',
        data: null
      };

      const lowerText = userMessage.toLowerCase();

      if (lowerText.includes('copywriting') || lowerText.includes('guion')) {
        response.content = `¡Perfecto! Aquí tienes una estructura completa para tu lección de copywriting:

---

**Título sugerido:**
${mockAIResponses.copywriting.title}

**Descripción optimizada:**
${mockAIResponses.copywriting.description}

**Timestamps generados:**
${mockAIResponses.copywriting.timestamps.map(t => `• ${t.time} - ${t.title}`).join('\n')}

---

¿Te gustaría que ajuste algo o genere más contenido?`;
        response.type = 'generation';
        response.data = mockAIResponses.copywriting;
      } else if (lowerText.includes('timestamp')) {
        response.content = `Generando timestamps para video de 30 minutos... ¡Listo! Aquí tienes una estructura optimizada:

${mockAIResponses.copywriting.timestamps.map(t => `• ${t.time} - ${t.title}`).join('\n')}

Basado en best practices, los timestamps más importantes aparecen en los primeros 5 segundos para retención inicial.`;
        response.type = 'timestamps';
        response.data = { timestamps: mockAIResponses.copywriting.timestamps };
      } else if (lowerText.includes('cta') || lowerText.includes('llamada')) {
        response.content = `Para ventas de alto ticket, los CTAs más efectivos son:

1. **Directos:** "Aplica al programa" (tasa de conversión: 12%)
2. **Urgencia:** "Solo 5 cupos disponibles" (tasa de conversión: 18%)
3. **Resultado:** "Empieza a cerrar $10k+ hoy" (tasa de conversión: 15%)

Mi recomendación: **"Aplicar al Programa de Ventas"** - es directo, claro y establece valor.`;
        response.type = 'cta';
        response.data = { ctaText: 'Aplicar al Programa de Ventas', ctaLink: '/apply' };
      } else {
        response.content = `Entendido. Para crear contenido optimizado, necesito saber más:

1. ¿Qué tema vas a cubrir?
2. ¿Cuál es el nivel del alumno (principiante/avanzado)?
3. ¿Qué acción quieres que tomen al final?

Cuéntame más y te generaré el contenido perfecto 🎯`;
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);

      // Auto-scroll
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  const handleUseContent = (data) => {
    toast.success('Contenido aplicado', {
      description: 'Redirigiendo al editor de lecciones...',
      duration: 2000
    });
    // TODO: Pass data to lesson editor
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={cn(
                "max-w-[80%] rounded-2xl p-4",
                msg.role === 'user'
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-slate-800/50 border border-slate-700/50"
              )}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>

                {msg.type === 'generation' && msg.data && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <Button
                      onClick={() => handleUseContent(msg.data)}
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Usar este contenido
                    </Button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-purple-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-2 h-2 rounded-full bg-purple-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 rounded-full bg-purple-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 py-4 border-t border-slate-800/50">
          {suggestions.map((suggestion, idx) => (
            <Button
              key={idx}
              onClick={() => handleSend(suggestion.text)}
              size="sm"
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white text-xs"
            >
              <suggestion.icon className="w-3.5 h-3.5 mr-1.5" />
              {suggestion.text}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-slate-800/50">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pídele ayuda a la IA para crear contenido..."
          className="flex-1 bg-slate-800/50 border-slate-700"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// TAB B: FILE DROPZONE
// ============================================
function FileDropzoneTab() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState(null);

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

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const processedFiles = newFiles.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      thumbnail: null
    }));

    setFiles(prev => [...prev, ...processedFiles]);

    // Auto-fill mock data
    toast.success(`${newFiles.length} archivo(s) subido(s)`, {
      description: 'He extraído información básica automáticamente',
      duration: 2000
    });
  };

  const handleOptimizeWithAI = () => {
    if (files.length === 0) {
      toast.error('Sube un archivo primero', {
        description: 'Necesito contenido para optimizar',
        duration: 2000
      });
      return;
    }

    setIsOptimizing(true);

    // Simulate AI optimization
    setTimeout(() => {
      setOptimizedContent(mockAIResponses.videoOptimization);
      setShowComparison(true);
      setIsOptimizing(false);

      toast.success('¡Optimización completada!', {
        description: 'Revisa la comparación antes/después',
        duration: 3000
      });
    }, 2500);
  };

  const handleApplyOptimization = () => {
    toast.success('Contenido optimizado aplicado', {
      description: 'Abriendo editor de lecciones...',
      duration: 2000
    });
    // TODO: Navigate to lesson editor with optimized content
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200",
          isDragging
            ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
            : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
        )}
      >
        <input
          type="file"
          multiple
          accept="video/*,audio/*,.pdf,.doc,.docx,.txt"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
        />
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center"
        >
          <Upload className="w-10 h-10 text-purple-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Arrastra tu contenido aquí
        </h3>
        <p className="text-slate-400 mb-4">
          Videos, audios, PDFs, documentos o archivos de texto
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <FileVideo className="w-4 h-4" />
            MP4, MOV
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            PDF, DOC, TXT
          </span>
          <span className="flex items-center gap-1">
            Máx. 500MB por archivo
          </span>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="border-slate-800/50 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Archivos subidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <FileVideo className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{file.size}</p>
                  </div>
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimize Button */}
      <AnimatePresence>
        {files.length > 0 && !showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              onClick={handleOptimizeWithAI}
              disabled={isOptimizing}
              className={cn(
                "w-full h-14 text-lg font-semibold",
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                "shadow-lg shadow-purple-500/25"
              )}
            >
              {isOptimizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Optimizando con IA...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Optimizar con IA
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Before/After Comparison */}
      <AnimatePresence>
        {showComparison && optimizedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Comparación: Antes vs Después
              </h3>
              <Button
                onClick={() => setShowComparison(false)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                Cerrar
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <Card className="border-slate-800/50 bg-slate-900/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-slate-600/50 text-slate-300 border-slate-600">
                      Antes
                    </Badge>
                    <span className="text-sm text-slate-400">Contenido original</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Título</label>
                    <p className="text-sm text-white">{optimizedContent.before.title}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
                    <p className="text-sm text-slate-300">{optimizedContent.before.description}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CTA</label>
                    <p className="text-sm text-slate-300">{optimizedContent.before.ctaText}</p>
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border-purple-500/50 bg-purple-950/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Después
                    </Badge>
                    <span className="text-sm text-slate-400">Optimizado por IA</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Título</label>
                    <p className="text-sm text-white font-medium">{optimizedContent.after.title}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Descripción</label>
                    <p className="text-sm text-slate-300">{optimizedContent.after.description}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CTA</label>
                    <p className="text-sm text-emerald-400 font-medium">{optimizedContent.after.ctaText}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Preview */}
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <CardTitle className="text-white text-lg">Contenido optimizado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                    {optimizedContent.after.content}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleApplyOptimization}
                className={cn(
                  "flex-1 h-12 font-semibold",
                  "bg-gradient-to-r from-purple-600 to-blue-600"
                )}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aplicar optimización
              </Button>
              <Button
                onClick={() => setShowComparison(false)}
                variant="outline"
                className="h-12 border-slate-700 bg-slate-800/50 text-white"
              >
                Descartar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ContentUploadPage() {
  const navigate = useNavigate();

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
                Creación de Contenido con IA
              </h1>
              <p className="text-sm text-slate-400">
                Asistente inteligente para crear y optimizar lecciones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/lessons/new/edit')}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Editor manual
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="w-full justify-start bg-slate-800/50 border border-slate-700/50">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Chat con Asistente
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Archivos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-6">
                  <ChatAssistantTab />
                </TabsContent>

                <TabsContent value="upload" className="mt-6">
                  <FileDropzoneTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

// Target icon import (used in suggestions)
function Target({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
