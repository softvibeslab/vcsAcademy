/**
 * Courses Management Page - CMS Course List
 *
 * Feature 6: Course management for creators
 * - Grid of course cards with stats
 * - Create new course button
 * - Edit/delete actions
 * - Publish/draft status
 * - Search and filters
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Search, MoreVertical, Edit, Trash2, Eye, EyeOff,
  BookOpen, Users, Clock, TrendingUp, FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// MOCK DATA
// ============================================
const mockCourses = [
  {
    id: 1,
    title: 'Foundations of Sales',
    description: 'Domina los fundamentos de ventas de alto ticket',
    thumbnail: '🎯',
    color: 'from-purple-500 to-blue-500',
    status: 'published',
    enrolledStudents: 42,
    modules: 6,
    totalLessons: 24,
    avgCompletionRate: 75,
    createdAt: '2024-01-15',
    price: 997
  },
  {
    id: 2,
    title: 'Advanced Negotiation',
    description: 'Técnicas avanzadas de cierre y negociación',
    thumbnail: '🤝',
    color: 'from-emerald-500 to-teal-500',
    status: 'published',
    enrolledStudents: 28,
    modules: 8,
    totalLessons: 32,
    avgCompletionRate: 68,
    createdAt: '2024-02-01',
    price: 1497
  },
  {
    id: 3,
    title: 'Leadership Mastery',
    description: 'Conviértete en un líder de ventas inspirador',
    thumbnail: '👑',
    color: 'from-amber-500 to-orange-500',
    status: 'draft',
    enrolledStudents: 0,
    modules: 5,
    totalLessons: 20,
    avgCompletionRate: 0,
    createdAt: '2024-02-20',
    price: 1997
  },
  {
    id: 4,
    title: 'Team Management',
    description: 'Gestiona y escala equipos de ventas de alto rendimiento',
    thumbnail: '🚀',
    color: 'from-rose-500 to-pink-500',
    status: 'draft',
    enrolledStudents: 0,
    modules: 7,
    totalLessons: 28,
    avgCompletionRate: 0,
    createdAt: '2024-03-01',
    price: 2497
  },
  {
    id: 5,
    title: 'Social Selling',
    description: 'Domina las redes sociales para vender más',
    thumbnail: '📱',
    color: 'from-cyan-500 to-blue-500',
    status: 'published',
    enrolledStudents: 15,
    modules: 4,
    totalLessons: 16,
    avgCompletionRate: 82,
    createdAt: '2024-03-10',
    price: 497
  }
];

// ============================================
// COURSE CARD COMPONENT
// ============================================
function CourseCard({ course, onEdit, onDelete, onTogglePublish, onView }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "border-slate-800/50 bg-slate-900/50 backdrop-blur-xl h-full transition-all duration-300",
        "hover:shadow-xl hover:shadow-purple-500/10 hover:border-slate-700/50"
      )}>
        <CardHeader className="space-y-3 pb-4">
          {/* Thumbnail */}
          <div className={cn(
            "w-full h-40 rounded-xl bg-gradient-to-br flex items-center justify-center text-6xl relative overflow-hidden",
            course.color
          )}>
            {course.thumbnail}
            {course.status === 'published' && (
              <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white border-emerald-400">
                Publicado
              </Badge>
            )}
            {course.status === 'draft' && (
              <Badge className="absolute top-3 right-3 bg-slate-600/90 text-white border-slate-500">
                Borrador
              </Badge>
            )}
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
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <Users className="w-4 h-4 text-purple-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Alumnos</p>
                <p className="text-sm font-medium text-white">{course.enrolledStudents}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Lecciones</p>
                <p className="text-sm font-medium text-white">{course.totalLessons}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Completación</p>
                <p className="text-sm font-medium text-white">{course.avgCompletionRate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">Módulos</p>
                <p className="text-sm font-medium text-white">{course.modules}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={() => onView(course)}
              className="flex-1 h-10 text-sm bg-slate-800/50 hover:bg-slate-700/50 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver
            </Button>
            <Button
              onClick={() => onEdit(course)}
              className="flex-1 h-10 text-sm bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <div className="relative">
              <Button
                onClick={() => setShowActions(!showActions)}
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {/* Dropdown Actions */}
              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => {
                      onTogglePublish(course);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-slate-800 transition-colors"
                  >
                    {course.status === 'published' ? (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    )}
                    {course.status === 'published' ? 'Archivar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => {
                      onDelete(course);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function CoursesManagePage() {
  const navigate = useNavigate();

  // ============================================
  // STATE
  // ============================================
  const [courses, setCourses] = useState(mockCourses);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // ============================================
  // FILTERS & SORT
  // ============================================
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || course.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'students':
          return b.enrolledStudents - a.enrolledStudents;
        case 'completion':
          return b.avgCompletionRate - a.avgCompletionRate;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((acc, c) => acc + c.enrolledStudents, 0)
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleCreateCourse = () => {
    toast.success('Crear nuevo curso', {
      description: 'Abriendo formulario de creación...',
      duration: 2000
    });
    // TODO: Open create course modal
  };

  const handleEditCourse = (course) => {
    navigate(`/courses/${course.id}/edit`, { state: { course } });
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/${course.id}`, { state: { course } });
  };

  const handleDeleteCourse = (course) => {
    toast.success('Curso eliminado', {
      description: course.title,
      duration: 2000
    });
    setCourses(prev => prev.filter(c => c.id !== course.id));
  };

  const handleTogglePublish = (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    setCourses(prev => prev.map(c =>
      c.id === course.id ? { ...c, status: newStatus } : c
    ));

    toast.success(newStatus === 'published' ? 'Curso publicado' : 'Curso archivado', {
      description: course.title,
      duration: 2000
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30"
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gestión de Cursos
            </h1>
            <p className="text-sm text-slate-400">
              Crea y edita el contenido de tu academia
            </p>
          </div>

          <Button
            onClick={handleCreateCourse}
            className={cn(
              "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              "shadow-lg shadow-purple-500/25"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo curso
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <main className="p-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-slate-400">Total cursos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.published}</p>
                  <p className="text-xs text-slate-400">Publicados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.draft}</p>
                  <p className="text-xs text-slate-400">Borradores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                  <p className="text-xs text-slate-400">Alumnos totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-11 bg-slate-900/50 border-slate-800/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className={cn(
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800/50'
              )}
            >
              Todos ({stats.total})
            </Button>
            <Button
              onClick={() => setFilter('published')}
              variant={filter === 'published' ? 'default' : 'outline'}
              className={cn(
                filter === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800/50'
              )}
            >
              Publicados ({stats.published})
            </Button>
            <Button
              onClick={() => setFilter('draft')}
              variant={filter === 'draft' ? 'default' : 'outline'}
              className={cn(
                filter === 'draft'
                  ? 'bg-slate-600 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800/50'
              )}
            >
              Borradores ({stats.draft})
            </Button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 bg-slate-900/50 border border-slate-800/50 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="students">Más alumnos</option>
            <option value="completion">Mejor completación</option>
            <option value="name">A-Z</option>
          </select>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, idx) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onTogglePublish={handleTogglePublish}
                  onView={handleViewCourse}
                />
              ))}
            </div>
          ) : (
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardContent className="p-12 text-center">
                <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron cursos
                </h3>
                <p className="text-slate-400 mb-6">
                  {search ? 'Intenta con otra búsqueda' : 'Crea tu primer curso para comenzar'}
                </p>
                {!search && (
                  <Button
                    onClick={handleCreateCourse}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primer curso
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
