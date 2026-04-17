import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, TrendingUp, Upload, Settings,
  Trophy, Target, BarChart3, LogOut, Menu,
  Home, Bell, ChevronRight, FileText, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamStatsDashboard from '@/components/admin/TeamStatsDashboard';
import KnowledgeManagement from '@/components/admin/KnowledgeManagement';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminEnhancedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('team-stats');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verify admin access
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const menuItems = [
    {
      id: 'team-stats',
      icon: BarChart3,
      label: 'Team Stats',
      description: 'Ver rendimiento del equipo'
    },
    {
      id: 'knowledge',
      icon: BookOpen,
      label: 'Knowledge Base',
      description: 'Subir y gestionar contenido'
    },
    {
      id: 'users',
      icon: Users,
      label: 'Users',
      description: 'Gestionar usuarios'
    },
    {
      id: 'ai-settings',
      icon: Brain,
      label: 'AI Settings',
      description: 'Configurar asistente AI'
    }
  ];

  const quickStats = [
    { label: 'Total Users', value: '156', icon: Users, color: 'text-blue-400' },
    { label: 'Active Today', value: '89', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Training Items', value: '42', icon: BookOpen, color: 'text-purple-400' },
    { label: 'AI Chats Today', value: '234', icon: Brain, color: 'text-[#D4AF37]' }
  ];

  return (
    <div className="min-h-screen bg-[#020204]">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6 text-[#F1F5F9]" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4942D] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#F1F5F9]">VCSA Admin</h1>
              <p className="text-[10px] text-[#94A3B8]">Management Console</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-white/10 text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>

          <Button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8]">{stat.label}</p>
                  <p className="text-xl font-bold text-[#F1F5F9]">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1E293B] border border-white/10 w-full h-auto p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#D4AF37]/20 data-[state=active]:text-[#D4AF37]"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            {/* Team Stats Tab */}
            <TabsContent value="team-stats" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#F1F5F9]">Team Statistics</h2>
                  <p className="text-[#94A3B8]">Monitor your team's performance in real-time</p>
                </div>
              </div>

              <TeamStatsDashboard />
            </TabsContent>

            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#F1F5F9]">Knowledge Management</h2>
                  <p className="text-[#94A3B8]">Upload PDFs and let AI generate training content</p>
                </div>
                <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                  AI Powered
                </Badge>
              </div>

              <KnowledgeManagement />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#F1F5F9]">User Management</h2>
                  <p className="text-[#94A3B8]">Manage user roles and permissions</p>
                </div>
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B4942D] text-black">
                  <Users className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-lg p-8 text-center">
                <Users className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">User Management</h3>
                <p className="text-[#94A3B8]">This feature is coming soon. For now, manage users through the API.</p>
              </div>
            </TabsContent>

            {/* AI Settings Tab */}
            <TabsContent value="ai-settings" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#F1F5F9]">AI Configuration</h2>
                  <p className="text-[#94A3B8]">Configure AI assistant settings</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400">
                  Ollama Connected
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F1F5F9]">Ollama LLM</h3>
                      <p className="text-sm text-green-400">● Connected</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Model:</span>
                      <span className="text-[#F1F5F9]">llama3.1</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>API:</span>
                      <span className="text-[#F1F5F9]">host.docker.internal:11434</span>
                    </div>
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Status:</span>
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F1F5F9]">AI Features</h3>
                      <p className="text-sm text-[#D4AF37]">All Active</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[#F1F5F9]">Enhanced Chat</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[#F1F5F9]">PDF Processing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[#F1F5F9]">Role Playing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[#F1F5F9]">Sentiment Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-[#F1F5F9]">Proactive Suggestions</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
