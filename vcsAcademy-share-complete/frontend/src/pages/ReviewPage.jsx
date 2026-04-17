/**
 * Review Page - Editable Structure Tree
 *
 * Feature 4: Human review with nested editable tree
 * - School → Courses → Modules → Lessons hierarchy
 * - Inline editing for all items
 * - Add/Remove buttons at each level
 * - Auto-save to state
 * - Publish button
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown, ChevronRight, Plus, Trash2, Edit2, Check, X,
  BookOpen, FolderOpen, FileText, Save, ArrowRight, Home, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// INITIAL STRUCTURE (MOCK DATA)
// ============================================
const createInitialStructure = (blueprint) => {
  const moduleCount = blueprint?.generatedStructure?.modules || 8;
  const lessonsPerModule = blueprint?.generatedStructure?.lessonsPerModule || 6;

  return {
    id: 'school-root',
    name: blueprint?.schoolName || 'Mi Academia',
    type: 'school',
    description: blueprint?.learningOutcome || 'Descripción de la academia',
    expanded: true,
    children: Array.from({ length: moduleCount }, (_, i) => ({
      id: `course-${i + 1}`,
      name: `Curso ${i + 1}`,
      type: 'course',
      description: `Descripción del curso ${i + 1}`,
      expanded: i === 0, // Only first course expanded by default
      children: Array.from({ length: lessonsPerModule }, (_, j) => ({
        id: `module-${i + 1}-${j + 1}`,
        name: `Módulo ${j + 1}`,
        type: 'module',
        description: `Descripción del módulo ${j + 1}`,
        expanded: false,
        children: [
          {
            id: `lesson-${i + 1}-${j + 1}-1`,
            name: 'Lección 1: Introducción',
            type: 'lesson',
            duration: '15 min',
            expanded: false,
            children: []
          },
          {
            id: `lesson-${i + 1}-${j + 1}-2`,
            name: 'Lección 2: Conceptos clave',
            type: 'lesson',
            duration: '25 min',
            expanded: false,
            children: []
          },
          {
            id: `lesson-${i + 1}-${j + 1}-3`,
            name: 'Lección 3: Práctica',
            type: 'lesson',
            duration: '20 min',
            expanded: false,
            children: []
          }
        ]
      }))
    }))
  };
};

// ============================================
// TREE NODE COMPONENT
// ============================================
function TreeNode({ item, level = 0, onUpdate, onDelete, onAdd, onToggleExpand }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState({ name: item.name, description: item.description || '' });
  const [showChildren, setShowChildren] = useState(item.expanded || false);

  const hasChildren = item.children && item.children.length > 0;

  const handleSave = () => {
    onUpdate(item.id, { ...item, name: editValue.name, description: editValue.description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue({ name: item.name, description: item.description || '' });
    setIsEditing(false);
  };

  const handleToggle = () => {
    const newExpanded = !showChildren;
    setShowChildren(newExpanded);
    onToggleExpand?.(item.id, newExpanded);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'school': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'course': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'module': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'lesson': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'school': return BookOpen;
      case 'course': return FolderOpen;
      case 'module': return FolderOpen;
      case 'lesson': return FileText;
      default: return FileText;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'school': return 'Escuela';
      case 'course': return 'Curso';
      case 'module': return 'Módulo';
      case 'lesson': return 'Lección';
      default: return type;
    }
  };

  const Icon = getTypeIcon(item.type);

  return (
    <div className={cn("w-full", level > 0 && "ml-4 md:ml-6")}>
      {/* Node Content */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
          "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50",
          isEditing && "ring-2 ring-purple-500/50"
        )}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-slate-700/50 transition-colors"
          >
            {showChildren ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}

        {/* Icon */}
        <div className={cn(
          "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          getTypeColor(item.type)
        )}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-white truncate">
                  {item.name}
                </h3>
                <Badge variant="outline" className={cn("text-xs", getTypeColor(item.type))}>
                  {getTypeLabel(item.type)}
                </Badge>
                {item.type === 'lesson' && item.duration && (
                  <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                    {item.duration}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Input
                value={editValue.name}
                onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                placeholder="Nombre"
                className="h-8 text-sm bg-slate-900/50 border-slate-600"
                autoFocus
              />
              {item.type !== 'lesson' && (
                <Textarea
                  value={editValue.description}
                  onChange={(e) => setEditValue({ ...editValue, description: e.target.value })}
                  placeholder="Descripción"
                  rows={2}
                  className="text-xs bg-slate-900/50 border-slate-600 resize-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-slate-400 hover:text-white"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              {item.type !== 'lesson' && (
                <Button
                  onClick={() => onAdd(item.id, item.type)}
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-400"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              )}
              {item.type !== 'school' && (
                <Button
                  onClick={() => onDelete(item.id)}
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300"
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && showChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {item.children.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                level={level + 1}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [schoolBlueprint, setSchoolBlueprint] = useState(null);
  const [structure, setStructure] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolBlueprint') || '{}');

    if (!data.schoolName) {
      navigate('/onboarding/create-school');
      return;
    }

    setSchoolBlueprint(data);
    setStructure(createInitialStructure(data));
  }, []);

  // ============================================
  // TREE OPERATIONS
  // ============================================
  const updateNode = (nodeId, updates) => {
    const updateRecursive = (node) => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive)
        };
      }
      return node;
    };

    setStructure(prev => {
      const updated = updateRecursive(prev);
      triggerAutoSave();
      return updated;
    });
  };

  const deleteNode = (nodeId) => {
    const deleteRecursive = (node) => {
      if (node.children) {
        return {
          ...node,
          children: node.children
            .filter(child => child.id !== nodeId)
            .map(deleteRecursive)
        };
      }
      return node;
    };

    setStructure(prev => {
      const updated = deleteRecursive(prev);
      triggerAutoSave();
      return updated;
    });

    toast.success('Elemento eliminado');
  };

  const addNode = (parentId, parentType) => {
    const getNewNode = (type) => {
      const id = `${type}-${Date.now()}`;
      switch (type) {
        case 'school':
          return {
            id: `course-${Date.now()}`,
            name: 'Nuevo Curso',
            type: 'course',
            description: 'Descripción del nuevo curso',
            expanded: true,
            children: []
          };
        case 'course':
          return {
            id: `module-${Date.now()}`,
            name: 'Nuevo Módulo',
            type: 'module',
            description: 'Descripción del nuevo módulo',
            expanded: false,
            children: []
          };
        case 'module':
          return {
            id: `lesson-${Date.now()}`,
            name: 'Nueva Lección',
            type: 'lesson',
            duration: '20 min',
            expanded: false,
            children: []
          };
        default:
          return null;
      }
    };

    const addRecursive = (node) => {
      if (node.id === parentId) {
        const newNode = getNewNode(node.type);
        if (newNode) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
            expanded: true
          };
        }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addRecursive)
        };
      }
      return node;
    };

    setStructure(prev => {
      const updated = addRecursive(prev);
      triggerAutoSave();
      return updated;
    });

    toast.success('Elemento agregado');
  };

  const toggleExpand = (nodeId, expanded) => {
    const toggleRecursive = (node) => {
      if (node.id === nodeId) {
        return { ...node, expanded };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(toggleRecursive)
        };
      }
      return node;
    };

    setStructure(prev => toggleRecursive(prev));
  };

  // ============================================
  // AUTO-SAVE
  // ============================================
  const triggerAutoSave = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  // ============================================
  // PUBLISH
  // ============================================
  const handlePublish = async () => {
    setIsPublishing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save to sessionStorage
    const finalBlueprint = {
      ...schoolBlueprint,
      structure: structure,
      publishedAt: new Date().toISOString()
    };
    sessionStorage.setItem('schoolBlueprint', JSON.stringify(finalBlueprint));

    setIsPublishing(false);

    toast.success('¡Estructura publicada exitosamente! 🎉', {
      description: 'Tu academia está lista para usar',
      duration: 3000
    });

    setTimeout(() => {
      navigate(`/dashboard/${schoolBlueprint?.schoolId || 'default'}`);
    }, 1500);
  };

  // ============================================
  // CALCULATIONS
  // ============================================
  const countNodes = (node, type) => {
    if (node.type === type) return 1;
    if (node.children) {
      return node.children.reduce((acc, child) => acc + countNodes(child, type), 0);
    }
    return 0;
  };

  const stats = structure ? {
    courses: countNodes(structure, 'course'),
    modules: countNodes(structure, 'module'),
    lessons: countNodes(structure, 'lesson')
  } : null;

  // ============================================
  // RENDER
  // ============================================
  if (!structure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl min-h-screen flex flex-col">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Revisión de estructura
              </h1>
              <p className="text-sm text-slate-400">
                {structure?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm">
              {autoSaveStatus === 'saving' ? (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Guardado</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* STATS */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.courses || 0}</p>
                  <p className="text-xs text-slate-400">Cursos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.modules || 0}</p>
                  <p className="text-xs text-slate-400">Módulos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.lessons || 0}</p>
                  <p className="text-xs text-slate-400">Lecciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============================================ */}
        {/* TREE */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <Card className="flex-1 border-slate-800/50 bg-slate-900/50 backdrop-blur-xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-lg text-white">Estructura de contenido</CardTitle>
              <CardDescription>
                Edita los elementos inline, agrega o elimina según necesites
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 p-6">
              <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="space-y-2 pr-4">
                  <TreeNode
                    item={structure}
                    onUpdate={updateNode}
                    onDelete={deleteNode}
                    onAdd={addNode}
                    onToggleExpand={toggleExpand}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* PUBLISH BUTTON */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              size="lg"
              className={cn(
                "w-full h-16 text-lg font-semibold",
                "bg-gradient-to-r from-purple-600 to-blue-600",
                "hover:from-purple-700 hover:to-blue-700",
                "shadow-lg shadow-purple-500/25",
                "transition-all duration-300"
              )}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publicando estructura...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Publicar estructura
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-3">
              Podrás editar esta estructura en cualquier momento desde el dashboard
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
