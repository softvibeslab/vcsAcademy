import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload, FileText, Sparkles, CheckCircle, AlertCircle,
  BookOpen, Clock, Target, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export const KnowledgeManagement = () => {
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    target_audience: 'reps',
    difficulty_level: 'intermediate',
    file: null
  });

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  const fetchKnowledgeItems = async () => {
    try {
      const response = await fetch('/api/ai-assistant/knowledge/items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setKnowledgeItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadForm({ ...uploadForm, file });
    } else {
      alert('Por favor sube un archivo PDF válido');
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.description) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress('Subiendo archivo...');

      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('tags', uploadForm.tags);
      formData.append('target_audience', uploadForm.target_audience);
      formData.append('difficulty_level', uploadForm.difficulty_level);

      setUploadProgress('Procesando con AI...');

      const response = await fetch('/api/ai-assistant/knowledge/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        setUploadProgress(`¡Éxito! ${data.notified_users} reps notificados. Recursos generados: ${data.additional_resources}`);

        // Reset form
        setUploadForm({
          title: '',
          description: '',
          tags: '',
          target_audience: 'reps',
          difficulty_level: 'intermediate',
          file: null
        });

        // Refresh items
        fetchKnowledgeItems();

        setTimeout(() => {
          setUploadSuccess(false);
          setUploadProgress('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setUploadProgress('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#F1F5F9]">Gestión del Conocimiento</h2>
        <p className="text-[#94A3B8] mt-1">Sube y gestiona material de entrenamiento para el equipo</p>
      </div>

      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#D4AF37]" />
            Subir Nuevo Material
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PDF Upload */}
          <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#D4AF37]/30 transition-all">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={uploading}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[#F1F5F9] font-semibold">
                  {uploadForm.file ? uploadForm.file.name : 'Haz clic o arrastra un PDF aquí'}
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">Máximo 50MB</p>
              </div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Título *</label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Ej: Técnicas Avanzadas de Cierre"
                className="bg-[#0F172A] border-white/10 text-[#F1F5F9]"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Etiquetas (separadas por coma)</label>
              <Input
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="Ej: ventas, cierre, objections"
                className="bg-[#0F172A] border-white/10 text-[#F1F5F9]"
                disabled={uploading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#94A3B8] mb-2 block">Descripción *</label>
            <Textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Describe brevemente el contenido y objetivos del material..."
              rows={3}
              className="bg-[#0F172A] border-white/10 text-[#F1F5F9]"
              disabled={uploading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Audiencia Objetivo</label>
              <select
                value={uploadForm.target_audience}
                onChange={(e) => setUploadForm({ ...uploadForm, target_audience: e.target.value })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2 text-[#F1F5F9]"
                disabled={uploading}
              >
                <option value="reps">Sales Representatives</option>
                <option value="managers">Sales Managers</option>
                <option value="admins">Administrators</option>
                <option value="all">Todos</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Nivel de Dificultad</label>
              <select
                value={uploadForm.difficulty_level}
                onChange={(e) => setUploadForm({ ...uploadForm, difficulty_level: e.target.value })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2 text-[#F1F5F9]"
                disabled={uploading}
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center justify-between">
            <div>
              {uploadProgress && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  {uploadSuccess ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                  )}
                  {uploadProgress}
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.file}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B4942D] text-black font-semibold hover:opacity-90"
            >
              {uploading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Procesando con AI...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir y Procesar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Items List */}
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            Biblioteca de Conocimiento ({knowledgeItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {knowledgeItems.map((item, index) => (
                <motion.div
                  key={item.item_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-[#0F172A] border border-white/5 rounded-lg hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#F1F5F9]">{item.title}</h3>
                        <Badge className={getDifficultyColor(item.difficulty_level)}>
                          {getDifficultyLabel(item.difficulty_level)}
                        </Badge>
                      </div>

                      <p className="text-sm text-[#94A3B8] mb-3">{item.description}</p>

                      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.estimated_study_time} min
                        </div>

                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {item.related_skills?.length || 0} habilidades
                        </div>

                        {item.content_type === 'pdf' && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF
                          </div>
                        )}
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              className="bg-[#D4AF37]/10 text-[#D4AF37] border-none text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {item.content_type === 'pdf' && item.key_points && (
                      <div className="ml-4 p-3 bg-[#D4AF37]/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-sm font-semibold text-[#D4AF37]">AI Procesado</span>
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          <p>• {item.key_points?.length || 0} puntos clave</p>
                          <p>• Preguntas y ejercicios generados</p>
                          <p>• Recursos adicionales creados</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeManagement;
