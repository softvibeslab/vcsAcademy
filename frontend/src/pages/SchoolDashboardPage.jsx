/**
 * School Dashboard Page - Main School Hub
 *
 * Feature 5: School dashboard with KPIs, checklist, and course preview
 * - Sidebar with navigation
 * - Header with school info
 * - 4 KPI cards (students, revenue, completion, engagement)
 * - "Next steps" checklist
 * - Course grid preview
 * - "Launch assistant" button
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  LayoutDashboard, BookOpen, Users, DollarSign, TrendingUp,
  Settings, Home, ChevronRight, Sparkles, CheckCircle2,
  Circle, Plus, MoreVertical, ArrowUpRight, Target, Award,
  Clock, Star, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// MOCK DATA
// ============================================
const mockKPIs = {
  totalStudents: 147,
  activeStudents: 89,
  revenue: 45800,
  completionRate: 73,
  engagementScore: 8.4
};

const mockChecklist = [
  { id: 1, text: 'Completa el perfil de tu escuela', completed: true, category: 'setup' },
  { id: 2, text: 'Personaliza los colores y branding', completed: true, category: 'setup' },
  { id: 3, text: 'Configura tu primera comunidad', completed: false, category: 'setup' },
  { id: 4, text: 'Crea tu primer módulo de contenido', completed: false, category: 'content' },
  { id: 5, text: 'Sube tu primera lección en video', completed: false, category: 'content' },
  { id: 6, text: 'Invita a tus primeros 5 alumnos', completed: false, category: 'growth' },
  { id: 7, text: 'Programa tu primer live session', completed: false, category: 'engagement' },
  { id: 8, text: 'Revisa las analytics de la primera semana', completed: false, category: 'analytics' }
];

const mockCourses = [
  {
    id: 1,
    title: 'Foundations of Sales',
    description: 'Domina los fundamentos de ventas de alto ticket',
    progress: 75,
    enrolledStudents: 42,
    modules: 6,
    totalLessons: 24,
    completedLessons: 18,
    thumbnail: '🎯',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 2,
    title: 'Advanced Negotiation',
    description: 'Técnicas avanzadas de cierre y negociación',
    progress: 45,
    enrolledStudents: 28,
    modules: 8,
    totalLessons: 32,
    completedLessons: 14,
    thumbnail: '🤝',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    title: 'Leadership Mastery',
    description: 'Conviértete en un líder de ventas inspirador',
    progress: 20,
    enrolledStudents: 15,
    modules: 5,
    totalLessons: 20,
    completedLessons: 4,
    thumbnail: '👑',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 4,
    title: 'Team Management',
    description: 'Gestiona y escala equipos de ventas de alto rendimiento',
    progress: 0,
    enrolledStudents: 0,
    modules: 7,
    totalLessons: 28,
    completedLessons: 0,
    thumbnail: '🚀',
    color: 'from-rose-500 to-pink-500'
  }
];

// ============================================
// SIDEBAR NAVIGATION
// ============================================
const sidebarNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: 'dashboard', active: true },
  { icon: BookOpen, label: 'Cursos', href: 'courses/manage', active: false },
  { icon: Users, label: 'Alumnos', href: 'students', active: false },
  { icon: Target, label: 'Comunidad', href: 'community/feed', active: false },
  { icon: TrendingUp, label: 'Analytics', href: 'analytics', active: false },
  { icon: Settings, label: 'Configuración', href: 'settings', active: false }
];

// ============================================
// KPI CARD COMPONENT
// ============================================
function KPICard({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }) {
  const isPositive = change >= 0;

  return (
    <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl hover:border-slate-700/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white">
                {prefix}{value.toLocaleString()}{suffix}
              </h3>
              {change !== null && (
                <Badge variant="outline" className={cn(
                  "text-xs",
                  isPositive ? "text-emerald-400 border-emerald-500/30" : "text-red-400 border-red-500/30"
                )}>
                  {isPositive ? '+' : ''}{change}%
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Badge>
              )}
            </div>
          </div>
          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// CHECKLIST ITEM COMPONENT
// ============================================
function ChecklistItem({ item, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors group"
    >
      <Checkbox
        id={`checklist-${item.id}`}
        checked={item.completed}
        onCheckedChange={() => onToggle(item.id)}
        className="mt-0.5"
      />
      <label
        htmlFor={`checklist-${item.id}`}
        className={cn(
          "flex-1 text-sm cursor-pointer",
          item.completed ? "text-slate-500 line-through" : "text-slate-300"
        )}
      >
        {item.text}
      </label>
      {item.completed && (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      )}
    </motion.div>
  );
}

// ============================================
// COURSE CARD COMPONENT
// ============================================
function CourseCard({ course, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(139, 92, 246, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl cursor-pointer hover:border-purple-500/30 transition-all duration-300 h-full"
      >
        <CardHeader className="space-y-3 pb-4">
          {/* Thumbnail */}
          <div className={cn(
            "w-full h-32 rounded-xl bg-gradient-to-br flex items-center justify-center text-5xl",
            course.color
          )}>
            {course.thumbnail}
          </div>

          <div>
            <CardTitle className="text-lg text-white line-clamp-1">
              {course.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progreso</span>
              <span className="text-white font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 bg-slate-800/50" />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{course.enrolledStudents} alumnos</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>{course.modules} módulos</span>
            </div>
          </div>

          {/* Badge */}
          {course.enrolledStudents === 0 ? (
            <Badge className="w-full justify-center py-2 bg-slate-800 text-slate-400">
              Sin publicar
            </Badge>
          ) : course.progress === 100 ? (
            <Badge className="w-full justify-center py-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <Award className="w-3.5 h-3.5 mr-1" />
              Completado
            </Badge>
          ) : (
            <Badge className="w-full justify-center py-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Clock className="w-3.5 h-3.5 mr-1" />
              En progreso
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function SchoolDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolId } = useParams();

  // ============================================
  // STATE
  // ============================================
  const [schoolData, setSchoolData] = useState(null);
  const [checklist, setChecklist] = useState(mockChecklist);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    // Get school data from sessionStorage or location state
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolBlueprint') || '{}');

    // Mock school data
    setSchoolData({
      id: schoolId || 'default',
      name: data?.schoolName || 'Mi Academia',
      description: data?.learningOutcome || 'Transforma a tus alumnos en profesionales de alto rendimiento',
      logo: data?.schoolName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'MA',
      primaryColor: '#8B5CF6',
      createdAt: new Date().toISOString()
    });
  }, [schoolId]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleToggleChecklist = (id) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));

    // Show celebration toast
    const item = checklist.find(c => c.id === id);
    if (!item?.completed) {
      toast.success('¡Progreso completado!', {
        description: item.text,
        duration: 2000
      });
    }
  };

  const handleLaunchAssistant = () => {
    navigate('/content/upload');
  };

  const handleCourseClick = (course) => {
    // Navigate to lesson editor for the first lesson of the course
    navigate(`/lessons/${course.id}-1/edit`, {
      state: { schoolData, course }
    });
  };

  const completedTasks = checklist.filter(t => t.completed).length;
  const progressPercentage = Math.round((completedTasks / checklist.length) * 100);

  // ============================================
  // RENDER
  // ============================================
  if (!schoolData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 h-screen border-r border-slate-800/50 bg-slate-900/95 backdrop-blur-xl z-40 transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">{schoolData.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-white truncate">{schoolData.name}</h2>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <ChevronRight className={cn(
              "w-5 h-5 text-slate-400 transition-transform duration-300",
              !sidebarCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarNavItems.map((item) => (
            <button
              key={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                item.active
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size={sidebarCollapsed ? "icon" : "default"}
            className={cn(
              "w-full border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white",
              sidebarCollapsed && "h-10 w-10 p-0"
            )}
          >
            <Home className="w-5 h-5" />
            {!sidebarCollapsed && <span className="ml-2">Mis Escuelas</span>}
          </Button>
        </div>
      </motion.aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Bienvenido de vuelta 👋
              </h1>
              <p className="text-sm text-slate-400">
                Aquí está lo que está pasando en <span className="text-purple-400">{schoolData.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleLaunchAssistant}
                className={cn(
                  "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
                  "shadow-lg shadow-purple-500/25"
                )}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Crear contenido
              </Button>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center cursor-pointer">
                <span className="text-sm font-bold text-white">YO</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="p-8">
          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <KPICard
              title="Alumnos Activos"
              value={mockKPIs.activeStudents}
              change={12}
              icon={Users}
              color="from-blue-500 to-cyan-500"
            />
            <KPICard
              title="Ingresos Totales"
              value={mockKPIs.revenue}
              change={24}
              icon={DollarSign}
              prefix="$"
              color="from-emerald-500 to-teal-500"
            />
            <KPICard
              title="Tasa de Finalización"
              value={mockKPIs.completionRate}
              change={8}
              icon={Target}
              suffix="%"
              color="from-purple-500 to-pink-500"
            />
            <KPICard
              title="Engagement"
              value={mockKPIs.engagementScore}
              change={15}
              icon={Star}
              suffix="/10"
              color="from-amber-500 to-orange-500"
            />
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Checklist - 1/3 width */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-24">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Próximos pasos</CardTitle>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {completedTasks}/{checklist.length}
                    </Badge>
                  </div>
                  <CardDescription>
                    Configura tu academia para lanzarla
                  </CardDescription>
                  <Progress value={progressPercentage} className="h-2 bg-slate-800/50" />
                </CardHeader>

                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-1">
                      {checklist.map((item) => (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          onToggle={handleToggleChecklist}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Courses Grid - 2/3 width */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Tus Cursos</h2>
                  <p className="text-sm text-slate-400">
                    {mockCourses.filter(c => c.enrolledStudents > 0).length} publicados • {mockCourses.filter(c => c.enrolledStudents === 0).length} borradores
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/courses/manage')}
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ver todos los cursos
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CourseCard
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* ============================================ */}
      {/* ASSISTANT OVERLAY (triggered by button) */}
      {/* ============================================ */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssistant(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="border-slate-700 bg-slate-900/95 backdrop-blur-xl">
                <CardHeader className="space-y-4 pb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center space-y-2">
                    <CardTitle className="text-2xl text-white">
                      Asistente IA
                    </CardTitle>
                    <CardDescription>
                      Puedo ayudarte con contenido, estructura, analytics, o cualquier pregunta sobre tu academia
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    { icon: BookOpen, text: 'Crear nueva lección', shortcut: '⌘K' },
                    { icon: Users, text: 'Analizar progreso de alumnos', shortcut: '⌘A' },
                    { icon: TrendingUp, text: 'Generar reporte de ventas', shortcut: '⌘R' },
                    { icon: Zap, text: 'Optimizar contenido existente', shortcut: '⌘O' }
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="flex-1 text-left text-white group-hover:text-purple-300 transition-colors">
                        {action.text}
                      </span>
                      <kbd className="px-2 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-400">
                        {action.shortcut}
                      </kbd>
                    </button>
                  ))}

                  <Button
                    onClick={() => setShowAssistant(false)}
                    variant="outline"
                    className="w-full mt-4 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                  >
                    Cerrar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
