/**
 * Interview Page - AI Assistant Onboarding
 *
 * Second step in the school creation flow.
 * The AI Assistant interviews the user to customize their academy.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, ArrowRight, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [schoolData, setSchoolData] = useState(null);

  useEffect(() => {
    // Get school data from navigation state or sessionStorage
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolData') || '{}');
    setSchoolData(data);

    if (!data.schoolName) {
      // Redirect back if no school data
      navigate('/onboarding/create-school');
    }
  }, [location.state, navigate]);

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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"
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
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg shadow-green-500/25"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Tu academia está lista!
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            El Asistente IA está aprendiendo sobre tu escuela y personalizará todo para ti.
          </p>
        </motion.div>

        {/* School Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                    {schoolData && getInitials(schoolData.schoolName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white">
                    {schoolData?.schoolName || 'Tu Academia'}
                  </CardTitle>
                  {schoolData?.learningOutcome && (
                    <CardDescription className="text-slate-400 text-base mt-1">
                      Objetivo: {schoolData.learningOutcome}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-300 font-medium">Escuela creada exitosamente</p>
                    <p className="text-sm text-slate-400">Tu academia ya está en el sistema</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-blue-300 font-medium">Asistente IA configurado</p>
                    <p className="text-sm text-slate-400">Listo para personalizar contenido y entrenamientos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-purple-300 font-medium">Próximos pasos</p>
                    <p className="text-sm text-slate-400">Configura tu branding, contenido y equipo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            className="h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir al Dashboard
          </Button>

          <Button
            onClick={() => navigate('/onboarding/branding')}
            variant="outline"
            className="h-14 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            Configurar Branding
          </Button>

          <Button
            onClick={() => navigate('/organization/settings')}
            variant="outline"
            className="h-14 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Configuración Avanzada
          </Button>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center"
        >
          <p className="text-slate-400 text-sm">
            💡 <span className="text-slate-300">Tip:</span> Puedes volver a configurar tu academia en cualquier momento desde Configuración
          </p>
        </motion.div>
      </div>
    </div>
  );
}