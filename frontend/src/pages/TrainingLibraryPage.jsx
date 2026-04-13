import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Play, Clock, Target, TrendingUp, Award,
  ChevronRight, CheckCircle, Circle, Lock, Unlock,
  FileText, Video, Users, Star, Flame, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TrainingLibraryPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('all');
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    fetchTrainingLibrary();
  }, []);

  const fetchTrainingLibrary = async () => {
    try {
      // Fetch Skool courses with lessons
      const skoolCourseResp = await axios.get(`${API}/public/courses/skool_free_resources`);
      const courseData = skoolCourseResp.data;

      if (courseData.success && courseData.lessons) {
        // Transform lessons into module format
        const freeResources = courseData.lessons.slice(0, 5).map((lesson, index) => ({
          id: index + 1,
          title: lesson.title,
          video_id: lesson.video_id,
          video_url: lesson.video_url,
          duration: lesson.duration || '15:00',
          difficulty: index < 2 ? 'beginner' : index < 4 ? 'intermediate' : 'advanced',
          category: lesson.title.includes('Breaking') ? 'Mindset' :
                    lesson.title.includes('Visit') ? 'Technique' :
                    lesson.title.includes('Residence') ? 'Storytelling' :
                    lesson.title.includes('Concept') ? 'Presentation' :
                    lesson.title.includes('Price') ? 'Objections' : 'General',
          description: lesson.description || 'Aprende técnicas avanzadas de ventas',
          key_takeaway: `Aplica ${lesson.title.toLowerCase()} en tus presentaciones diarias`,
          completed: false
        }));

        const frontToBackChallenge = courseData.lessons.slice(5).map((lesson, index) => ({
          id: 6,
          title: lesson.title,
          video_id: lesson.video_id,
          video_url: lesson.video_url,
          duration: lesson.duration || '20:00',
          difficulty: 'advanced',
          category: 'Complete Process',
          description: lesson.description || 'Domina el proceso completo de ventas',
          key_takeaway: 'Sigue los 5 pasos: conexión, descubrimiento, presentación, objeciones, cierre',
          completed: false
        }));

        setCourses({
          free_resources: {
            ...courseData.course,
            modules: freeResources,
            total_duration: '75 min',
            points_available: 50
          },
          front_to_back: {
            title: 'FRONT TO BACK CHALLENGE',
            subtitle: 'Complete Sales Process',
            description: 'Domina el proceso completo de ventas desde el contacto inicial hasta el cierre',
            modules: frontToBackChallenge,
            total_duration: '20 min',
            points_available: 10,
            is_challenge: true
          }
        });
      }
    } catch (error) {
      console.error('Error fetching training library:', error);
      // Fallback to hardcoded data if API fails
      setCourses({
        free_resources: { modules: [] },
        front_to_back: { modules: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  // Icons and colors for sections
  const sectionIcons = {
    free_resources: Target,
    front_to_back: Flame
  };

  const sectionColors = {
    free_resources: 'from-blue-500/20 to-blue-600/20',
    front_to_back: 'from-orange-500/20 to-orange-600/20'
  };

  const markModuleComplete = (sectionId, moduleId) => {
    setCompletedModules([...completedModules, `${sectionId}-${moduleId}`]);
    // TODO: Call API to mark complete
  };

  const getSectionProgress = (sectionId) => {
    const sectionModules = courses[sectionId].modules;
    const completed = sectionModules.filter(m =>
      completedModules.includes(`${sectionId}-${m.id}`)
    ).length;
    return {
      completed,
      total: sectionModules.length,
      percentage: Math.round((completed / sectionModules.length) * 100)
    };
  };

  if (loading || !courses.free_resources || !courses.front_to_back) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#020204] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4" />
            <p className="text-[#94A3B8]">Cargando biblioteca de entrenamiento...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#020204]" data-testid="training-library-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#F1F5F9] mb-2">
                Training Library
              </h1>
              <p className="text-[#94A3B8] text-lg">
                Domina las ventas de Vacation Club con nuestros recursos estructurados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
                <BookOpen className="w-3 h-3 mr-1" />
                6 Videos
              </Badge>
              <Badge className="bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30">
                <Target className="w-3 h-3 mr-1" />
                60 Puntos
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B4942D]/10 border border-[#D4AF37]/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F5F9] mb-1">Tu Progreso</h3>
                  <p className="text-sm text-[#94A3B8]">
                    {completedModules.length} de 6 módulos completados
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {Math.round((completedModules.length / 6) * 100)}%
                  </div>
                  <p className="text-xs text-[#94A3B8]">Completado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Training Sections */}
        <div className="space-y-8">
          {/* FREE RESOURCES Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1E293B] border border-white/10 overflow-hidden">
              {/* Section Header */}
              <div className={`${sectionColors.free_resources} p-6 border-b border-white/10`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <sectionIcons.free_resources className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F1F5F9] font-['Playfair_Display']">
                        {courses.free_resources.title}
                      </h2>
                      <p className="text-[#94A3B8] font-medium">
                        {courses.free_resources.subtitle}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {courses.free_resources.points_available} pts
                  </Badge>
                </div>
                <p className="text-[#94A3B8] text-sm">
                  {courses.free_resources.description}
                </p>
              </div>

              {/* Modules Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.free_resources.modules.map((module, index) => {
                    const isCompleted = completedModules.includes(`free_resources-${module.id}`);
                    const progress = getSectionProgress('free_resources');

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                      >
                        <Card className="bg-[#0F172A] border border-white/10 hover:border-[#D4AF37]/30 transition-all cursor-pointer group">
                          <CardContent className="p-4">
                            {/* Module Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[#94A3B8] text-sm font-medium">
                                    {index + 1}.
                                  </span>
                                  <Badge
                                    className={`text-[10px] ${
                                      module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                      module.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {module.difficulty}
                                  </Badge>
                                </div>
                                <h4 className="text-[#F1F5F9] font-semibold mb-1 group-hover:text-[#D4AF37] transition-colors">
                                  {module.title}
                                </h4>
                                <p className="text-xs text-[#94A3B8] mb-2">
                                  {module.category}
                                </p>
                              </div>
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#94A3B8] flex-shrink-0" />
                              )}
                            </div>

                            {/* Video Thumbnail */}
                            <div className="relative mb-3 rounded-lg overflow-hidden bg-[#020204] group-hover:ring-2 ring-[#D4AF37]/50 transition-all">
                              <img
                                src={`https://img.youtube.com/vi/${module.video_id}/maxresdefault.jpg`}
                                alt={module.title}
                                className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                            </div>

                            {/* Module Details */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                <Clock className="w-3 h-3" />
                                <span>{module.duration}</span>
                                <Award className="w-3 h-3 ml-auto" />
                                <span>{10} pts</span>
                              </div>
                              <p className="text-xs text-[#94A3B8] line-clamp-2">
                                {module.description}
                              </p>
                            </div>

                            {/* Key Takeaway */}
                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-2 mb-3">
                              <p className="text-xs text-[#D4AF37] font-medium mb-1">
                                💡 Key Takeaway
                              </p>
                              <p className="text-xs text-[#F8FAFC]">
                                {module.key_takeaway}
                              </p>
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => markModuleComplete('free_resources', module.id)}
                              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B4942D] hover:from-[#C49427] hover:to-[#A3843D] text-black font-medium"
                              disabled={isCompleted}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Completado
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  {isCompleted ? 'Completado' : 'Ver Módulo'}
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* FRONT TO BACK CHALLENGE Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-orange-500/30 overflow-hidden">
              {/* Section Header with Flame Effect */}
              <div className={`${sectionColors.front_to_back} p-6 border-b border-white/10 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 animate-pulse" />
                </div>
                <div className="relative flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <sectionIcons.front_to_back className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F1F5F9] font-['Playfair_Display']">
                        {courses.front_to_back.title}
                      </h2>
                      <p className="text-[#94A3B8] font-medium">
                        {courses.front_to_back.subtitle}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    CHALLENGE
                  </Badge>
                </div>
                <p className="text-[#94A3B8] text-sm relative">
                  {courses.front_to_back.description}
                </p>
              </div>

              {/* Challenge Module */}
              <div className="p-6">
                <div className="max-w-3xl mx-auto">
                  {courses.front_to_back.modules.map((module, index) => {
                    const isCompleted = completedModules.includes(`front_to_back-${module.id}`);

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                      >
                        <Card className="bg-[#020204] border-2 border-orange-500/50 hover:border-orange-500/80 transition-all">
                          <CardContent className="p-8">
                            {/* Challenge Badge */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1">
                                  <Zap className="w-3 h-3 mr-1" />
                                  AVANZADO
                                </Badge>
                                <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 px-3 py-1">
                                  20 MINUTOS
                                </Badge>
                              </div>
                              <div className="text-right">
                                <Award className="w-6 h-6 text-[#D4AF37]" />
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-[#F1F5F9] mb-3 font-['Playfair_Display']">
                              {module.title}
                            </h3>

                            {/* Video Thumbnail */}
                            <div className="relative mb-6 rounded-xl overflow-hidden bg-[#020204]">
                              <img
                                src={`https://img.youtube.com/vi/${module.video_id}/maxresdefault.jpg`}
                                alt={module.title}
                                className="w-full h-64 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                                <div className="text-center">
                                  <Play className="w-16 h-16 text-white mb-2" />
                                  <p className="text-white font-medium">Comienza el Challenge</p>
                                </div>
                              </div>
                            </div>

                            {/* 5 Steps Preview */}
                            <div className="grid grid-cols-5 gap-3 mb-6">
                              {['Conexión', 'Descubrimiento', 'Presentación', 'Objeciones', 'Cierre'].map((step, i) => (
                                <div key={i} className="text-center">
                                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                                    <span className="text-orange-400 font-bold text-sm">{i + 1}</span>
                                  </div>
                                  <p className="text-[10px] text-[#94A3B8]">{step}</p>
                                </div>
                              ))}
                            </div>

                            {/* Description */}
                            <p className="text-[#94A3B8] mb-4">
                              {module.description}
                            </p>

                            {/* Key Takeaway */}
                            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                              <p className="text-sm text-[#F8FAFC] mb-2 font-medium">
                                🎯 Objetivo del Challenge
                              </p>
                              <p className="text-sm text-[#F8FAFC]">
                                {module.key_takeaway}
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-[#94A3B8]">Tu progreso</span>
                                <span className="text-[#D4AF37] font-medium">
                                  {isCompleted ? '100%' : '0%'}
                                </span>
                              </div>
                              <div className="w-full bg-[#0F172A] rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    isCompleted
                                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                      : 'bg-[#D4AF37]/20'
                                  }`}
                                  style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                              </div>
                            </div>

                            {/* Start Button */}
                            <Button
                              onClick={() => markModuleComplete('front_to_back', module.id)}
                              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 text-lg"
                              disabled={isCompleted}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="w-5 h-5 mr-2" />
                                  ¡Challenge Completado! 🎉
                                </>
                              ) : (
                                <>
                                  <Flame className="w-5 h-5 mr-2" />
                                  Comenzar Challenge
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-[#1E293B] border border-white/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">6</div>
                  <p className="text-sm text-[#94A3B8]">Módulos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#22c55e] mb-1">{courses.free_resources.total_duration}</div>
                  <p className="text-sm text-[#94A3B8]">Videos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">60</div>
                  <p className="text-sm text-[#94A3B8]">Puntos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#22c55e] mb-1">{Math.round((completedModules.length / 6) * 100)}%</div>
                  <p className="text-sm text-[#94A3B8]">Completado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
