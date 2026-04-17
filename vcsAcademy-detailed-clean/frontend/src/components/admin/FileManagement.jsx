import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload, FileText, Image, Video, Trash2, Download,
  FolderOpen, File, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  const [filter, setFilter] = useState({
    category: 'all',
    type: 'all'
  });

  useEffect(() => {
    fetchFiles();
  }, [filter]);

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category !== 'all') params.append('category', filter.category);
      if (filter.type !== 'all') params.append('file_type', filter.type);

      const response = await fetch(`/api/ai-assistant/public/files/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 50MB');
        return;
      }

      // Validar tipo
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mpeg',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Usa PDF, imágenes, videos o texto');
        return;
      }

      setSelectedFile(file);
      if (!uploadForm.title) {
        setUploadForm({ ...uploadForm, title: file.name });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);

      const response = await fetch('/api/ai-assistant/public/files/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);

        // Reset form
        setSelectedFile(null);
        setUploadForm({
          title: '',
          description: '',
          category: 'general'
        });

        // Refresh files
        fetchFiles();

        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        alert('Error al subir archivo: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-assistant/public/files/${fileId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchFiles();
      } else {
        alert('Error al eliminar archivo');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error al eliminar archivo');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (fileType?.includes('image')) return <Image className="w-5 h-5 text-blue-400" />;
    if (fileType?.includes('video')) return <Video className="w-5 h-5 text-purple-400" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'bg-gray-500/20 text-gray-400',
      'training': 'bg-blue-500/20 text-blue-400',
      'marketing': 'bg-green-500/20 text-green-400',
      'sales': 'bg-purple-500/20 text-purple-400',
      'documents': 'bg-orange-500/20 text-orange-400'
    };
    return colors[category] || colors['general'];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-[#1E293B] border border-white/10">
        <CardHeader>
          <CardTitle className="text-[#D4AF37] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Archivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[#94A3B8]">Archivo *</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.txt"
                  className="bg-[#0F172A] border-white/10 text-white"
                  disabled={uploading}
                />
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{selectedFile.name}</span>
                  <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#94A3B8]">Categoría</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white"
                disabled={uploading}
              >
                <option value="general">General</option>
                <option value="training">Entrenamiento</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Ventas</option>
                <option value="documents">Documentos</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#94A3B8]">Título *</label>
            <Input
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="Nombre del archivo"
              className="bg-[#0F172A] border-white/10 text-white"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#94A3B8]">Descripción</label>
            <Textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Descripción del contenido..."
              className="bg-[#0F172A] border-white/10 text-white"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B4942D] text-black hover:from-[#C49427] hover:to-[#A3843D]"
            >
              {uploading ? (
                <>Subiendo...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Archivo
                </>
              )}
            </Button>

            {uploadSuccess && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">¡Archivo subido exitosamente!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#94A3B8] border-t border-white/10 pt-3">
            <span>Formatos aceptados: PDF, JPG, PNG, GIF, MP4, TXT</span>
            <span>•</span>
            <span>Tamaño máximo: 50MB</span>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="bg-[#1E293B] border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#D4AF37] flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Archivos Subidos ({files.length})
            </CardTitle>

            <div className="flex items-center gap-2">
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="all">Todas las categorías</option>
                <option value="general">General</option>
                <option value="training">Entrenamiento</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Ventas</option>
                <option value="documents">Documentos</option>
              </select>

              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="pdf">PDF</option>
                <option value="image">Imágenes</option>
                <option value="video">Videos</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-12 text-[#94A3B8]">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>No hay archivos subidos</p>
              <p className="text-sm mt-2">Sube tu primer archivo usando el formulario de arriba</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {files.map((file, index) => (
                  <motion.div
                    key={file.file_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-[#0F172A] border border-white/10 rounded-lg hover:border-[#D4AF37]/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                      {getFileIcon(file.file_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#F1F5F9] font-medium truncate">{file.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#94A3B8]">{file.filename}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-xs text-[#94A3B8]">{formatFileSize(file.file_size)}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <Badge className={`text-[10px] ${getCategoryColor(file.category)}`}>
                          {file.category}
                        </Badge>
                      </div>
                      {file.description && (
                        <p className="text-sm text-[#94A3B8] mt-1 line-clamp-2">{file.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94A3B8]">
                        {new Date(file.uploaded_at).toLocaleDateString('es-ES')}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.file_id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
