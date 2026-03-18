/**
 * Create School Page - Onboarding Flow
 *
 * A streamlined onboarding experience for creating a new school/academy.
 * Features:
 * - Hero section with compelling title
 * - Simple form with school name and optional learning outcome
 * - AI Assistant launch simulation
 * - Auto-generated school avatar
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateSchoolPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    learningOutcome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Generate avatar preview based on school name
  const generateAvatar = (name) => {
    if (!name) return '';
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return initials;
  };

  const handleSchoolNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, schoolName: value }));
    setAvatarPreview(generateAvatar(value));
  };

  const handleOutcomeChange = (e) => {
    setFormData(prev => ({ ...prev, learningOutcome: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.schoolName.trim()) {
      toast.error('Por favor ingresa el nombre de tu escuela');
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      // Call the real API to create the school
      const response = await axios.post(
        `${backendUrl}/api/schools/create`,
        {
          name: formData.schoolName,
          learning_outcome: formData.learningOutcome || undefined,
          primary_color: '#D4AF37',
          secondary_color: '#1E3A8A',
          industry: 'Sales Training'
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Show success toast
        toast.success('¡Escuela creada exitosamente! 🎉', {
          description: 'Tu Asistente IA está listo para ayudarte a personalizar tu academia.',
          duration: 3000,
        });

        // Store school data and ID
        const schoolData = {
          ...formData,
          schoolId: response.data.school_id,
          slug: response.data.school.slug
        };
        sessionStorage.setItem('schoolData', JSON.stringify(schoolData));

        // Navigate to interview page
        navigate('/onboarding/interview', { state: { schoolData } });
      } else {
        throw new Error(response.data.message || 'Error creating school');
      }
    } catch (error) {
      console.error('Error creating school:', error);
      toast.error('Error al crear la escuela', {
        description: error.response?.data?.detail || error.message || 'Por favor intenta nuevamente',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.schoolName.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
      {/* Animated Background Elements */}
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
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Asistente IA Incluido</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100 font-sans leading-tight">
            Construye tu escuela
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              en 7 minutos
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Crea una academia personalizada con IA que entrena, motiva y transforma a tus alumnos en profesionales de alto rendimiento.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>

              <CardTitle className="text-3xl font-bold text-center text-white">
                Comienza tu academia
              </CardTitle>
              <CardDescription className="text-center text-slate-400 text-base">
                Responde unas preguntas simples y nuestra IA personalizará todo para ti
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* School Name Input with Avatar Preview */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <span>Nombre de tu escuela</span>
                    <span className="text-red-400">*</span>
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Avatar Preview */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex-shrink-0"
                    >
                      <Avatar className="w-16 h-16 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                          {avatarPreview || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {/* Input Field */}
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Ej: Academia de Ventas Pro, Instituto de Liderazgo..."
                        value={formData.schoolName}
                        onChange={handleSchoolNameChange}
                        disabled={isSubmitting}
                        className={cn(
                          "h-14 text-lg bg-slate-800/50 border-slate-700",
                          "focus:border-purple-500 focus:ring-purple-500/20",
                          "placeholder:text-slate-500",
                          "transition-all duration-200"
                        )}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Learning Outcome Textarea */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <span>¿Qué resultado quieres que tus alumnos logren?</span>
                    <span className="text-xs text-slate-500 font-normal">(Opcional)</span>
                  </label>

                  <Textarea
                    placeholder="Ej: Cerrar 50% más ventas, Dominar técnicas de negociación, Convertirse en líderes de equipo..."
                    value={formData.learningOutcome}
                    onChange={handleOutcomeChange}
                    disabled={isSubmitting}
                    rows={4}
                    className={cn(
                      "bg-slate-800/50 border-slate-700",
                      "focus:border-purple-500 focus:ring-purple-500/20",
                      "placeholder:text-slate-500",
                      "transition-all duration-200",
                      "resize-none"
                    )}
                  />
                  <p className="text-xs text-slate-500">
                    Esto ayudará a tu Asistente IA a personalizar el contenido y ejemplos.
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    size="lg"
                    className={cn(
                      "w-full h-16 text-lg font-semibold",
                      "bg-gradient-to-r from-purple-600 to-blue-600",
                      "hover:from-purple-700 hover:to-blue-700",
                      "disabled:from-slate-700 disabled:to-slate-700",
                      "disabled:cursor-not-allowed",
                      "shadow-lg shadow-purple-500/25",
                      "transition-all duration-300",
                      "transform hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creando tu academia...
                      </>
                    ) : (
                      <>
                        <span>Lanzar mi Asistente IA</span>
                        <Sparkles className="w-5 h-5 ml-2" />
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-6 pt-6 text-sm text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Sin compromiso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Configuración en 7 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span>IA 24/7 incluida</span>
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}