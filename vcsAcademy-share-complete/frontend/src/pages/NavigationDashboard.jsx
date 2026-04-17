/**
 * Navigation Dashboard - Interactive Library
 *
 * A comprehensive navigation hub for accessing all VCSA features
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Video,
  FileText,
  Settings,
  BarChart3,
  PlayCircle,
  MessageSquare,
  Shield,
  Zap,
  ChevronRight,
  Search,
  Grid3x3,
  Home,
  LogIn,
  UserPlus,
  Sparkles
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  // Core Navigation
  {
    category: "Core Navigation",
    icon: Home,
    color: "from-blue-500 to-blue-600",
    items: [
      {
        title: "App Principal",
        path: "/",
        icon: Home,
        description: "Página de inicio de VCSA",
        badge: "Home"
      },
      {
        title: "Login",
        path: "/login",
        icon: LogIn,
        description: "Iniciar sesión en la plataforma",
        badge: "Auth"
      },
      {
        title: "Registro",
        path: "/register",
        icon: UserPlus,
        description: "Crear cuenta nueva",
        badge: "Auth"
      },
      {
        title: "Onboarding",
        path: "/get-started",
        icon: Sparkles,
        description: "Configuración inicial para nuevos usuarios (5 pasos)",
        badge: "NEW"
      },
      {
        title: "Dashboard Principal",
        path: "/dashboard",
        icon: LayoutDashboard,
        description: "Panel principal de control",
        badge: "Main"
      }
    ]
  },

  // Dashboard Module
  {
    category: "Dashboard Module",
    icon: LayoutDashboard,
    color: "from-purple-500 to-purple-600",
    items: [
      {
        title: "Strategy Panel",
        path: "/dashboard/strategy",
        icon: Target,
        description: "Planificación estratégica y objetivos mensuales",
        badge: "Planning"
      },
      {
        title: "Daily Performance",
        path: "/dashboard/performance",
        icon: TrendingUp,
        description: "Seguimiento diario de tours y métricas",
        badge: "Tracking"
      }
    ]
  },

  // Training Module
  {
    category: "Training Module",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
    items: [
      {
        title: "Training Library",
        path: "/training",
        icon: BookOpen,
        description: "Biblioteca completa con 36 video sessions",
        badge: "36 Videos"
      },
      {
        title: "Top Producer Path",
        path: "/path",
        icon: Award,
        description: "Sistema de desarrollo en 4 etapas",
        badge: "Phase 1"
      },
      {
        title: "Track Detail",
        path: "/path/track/pro-mindset",
        icon: PlayCircle,
        description: "Ver módulos de un track específico",
        badge: "Training"
      },
      {
        title: "Deal Breakdowns",
        path: "/path/breakdowns",
        icon: FileText,
        description: "15 escenarios de deals reales",
        badge: "Scenarios"
      },
      {
        title: "Quick Wins",
        path: "/path/quickwins",
        icon: Zap,
        description: "20 tácticas rápidas para aplicar",
        badge: "Tactics"
      },
      {
        title: "Session Detail Example",
        path: "/training/session/1",
        icon: Video,
        description: "Ejemplo de sesión de training",
        badge: "Demo"
      }
    ]
  },

  // Coaching Module
  {
    category: "Coaching Module",
    icon: Users,
    color: "from-orange-500 to-orange-600",
    items: [
      {
        title: "Coaching Hub",
        path: "/coaching",
        icon: Users,
        description: "Centro principal de coaching",
        badge: "Hub"
      },
      {
        title: "Events Calendar",
        path: "/coaching/events",
        icon: Calendar,
        description: "Calendario de eventos próximos y pasados",
        badge: "Schedule"
      },
      {
        title: "Group Coaching",
        path: "/coaching/group",
        icon: Users,
        description: "Sesiones grupales en vivo y grabaciones",
        badge: "Live"
      },
      {
        title: "Role Play Sessions",
        path: "/coaching/roleplay",
        icon: PlayCircle,
        description: "Práctica de escenarios con role play",
        badge: "Practice"
      },
      {
        title: "Q&A Sessions",
        path: "/coaching/qa",
        icon: MessageSquare,
        description: "Sesiones de preguntas y respuestas",
        badge: "Interactive"
      }
    ]
  },

  // Resources Module
  {
    category: "Resources Module",
    icon: BookOpen,
    color: "from-yellow-500 to-yellow-600",
    items: [
      {
        title: "Resources Library",
        path: "/resources",
        icon: FileText,
        description: "PDFs, Ebooks, Templates, Checklists",
        badge: "Downloads"
      },
      {
        title: "Masterclasses",
        path: "/masterclasses",
        icon: Video,
        description: "Clases magistrales de expertos",
        badge: "Advanced"
      },
      {
        title: "Community",
        path: "/community",
        icon: Users,
        description: "Feed de la comunidad VCSA",
        badge: "Social"
      }
    ]
  },

  // Planning & Analytics
  {
    category: "Planning & Analytics",
    icon: BarChart3,
    color: "from-pink-500 to-pink-600",
    items: [
      {
        title: "Goal Sheets",
        path: "/goals",
        icon: Target,
        description: "Hojas de metas y objetivos",
        badge: "Planning"
      },
      {
        title: "Financial Planning",
        path: "/financial",
        icon: TrendingUp,
        description: "Planificación financiera personal",
        badge: "Finance"
      },
      {
        title: "Analytics Dashboard",
        path: "/analytics",
        icon: BarChart3,
        description: "Análisis detallado de performance",
        badge: "Metrics"
      },
      {
        title: "Strategy Planning",
        path: "/strategy",
        icon: Shield,
        description: "Planificación estratégica avanzada",
        badge: "Strategy"
      }
    ]
  },

  // User Settings
  {
    category: "User Settings",
    icon: Settings,
    color: "from-gray-500 to-gray-600",
    items: [
      {
        title: "Profile",
        path: "/profile",
        icon: Settings,
        description: "Configuración de perfil",
        badge: "Settings"
      },
      {
        title: "Membership",
        path: "/membership",
        icon: Award,
        description: "Planes de suscripción",
        badge: "Plans"
      }
    ]
  },

  // Admin
  {
    category: "Admin",
    icon: Shield,
    color: "from-red-500 to-red-600",
    items: [
      {
        title: "Admin Panel",
        path: "/admin",
        icon: Shield,
        description: "Panel de administración",
        badge: "Admin"
      },
      {
        title: "Organization Settings",
        path: "/settings/organization",
        icon: Settings,
        description: "Configuración de organización",
        badge: "Admin"
      }
    ]
  }
];

const CATEGORIES = [
  { id: "all", name: "Todos", icon: Grid3x3 },
  { id: "core", name: "Core", icon: Home },
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "training", name: "Training", icon: GraduationCap },
  { id: "coaching", name: "Coaching", icon: Users },
  { id: "resources", name: "Resources", icon: BookOpen },
  { id: "planning", name: "Planning", icon: Target },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function NavigationDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Filter items based on search and category
  const filteredSections = useMemo(() => {
    return NAVIGATION_ITEMS.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === "all" ||
                               section.category.toLowerCase().includes(selectedCategory);

        return matchesSearch && matchesCategory;
      })
    })).filter(section => section.items.length > 0);
  }, [searchQuery, selectedCategory]);

  const totalItems = useMemo(() => {
    return filteredSections.reduce((acc, section) => acc + section.items.length, 0);
  }, [filteredSections]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#020204] text-[#F1F5F9]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#020204]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">
                Navigation Dashboard
              </h1>
              <p className="text-[#94A3B8] mt-1">
                Biblioteca interactiva de todos los flujos de VCSA
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#D4AF37]">{totalItems}</div>
              <div className="text-sm text-[#94A3B8]">páginas disponibles</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar páginas, descripciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#020204] font-semibold"
                      : "bg-white/5 text-[#94A3B8] hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSections.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#F1F5F9] mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-[#94A3B8]">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              return (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color}`}>
                      <SectionIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#F1F5F9]">
                      {section.category}
                    </h2>
                    <span className="text-sm text-[#94A3B8]">
                      ({section.items.length} páginas)
                    </span>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          className="group relative bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all cursor-pointer"
                          onClick={() => handleCardClick(item.path)}
                        >
                          {/* Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#F4D03F]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                              {item.badge}
                            </span>
                          </div>

                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                            <ItemIcon className="w-6 h-6 text-white" />
                          </div>

                          {/* Content */}
                          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2 group-hover:text-[#D4AF37] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Path */}
                          <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono">
                            <span>{item.path}</span>
                            <ChevronRight className="w-4 h-4 ml-auto group-hover:text-[#D4AF37] transition-colors" />
                          </div>

                          {/* Hover Effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#F4D03F]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                {NAVIGATION_ITEMS.length}
              </div>
              <div className="text-sm text-[#94A3B8]">Categorías</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                {NAVIGATION_ITEMS.reduce((acc, s) => acc + s.items.length, 0)}
              </div>
              <div className="text-sm text-[#94A3B8]">Páginas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                {36}
              </div>
              <div className="text-sm text-[#94A3B8]">Training Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#D4AF37] mb-1">
                100%
              </div>
              <div className="text-sm text-[#94A3B8]">Funcional</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
