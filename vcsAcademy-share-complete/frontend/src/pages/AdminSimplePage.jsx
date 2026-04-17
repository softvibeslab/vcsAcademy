import React, { useState, useEffect } from 'react';
import {
  BarChart3, BookOpen, Brain, Users, ChevronRight,
  Trophy, TrendingUp, LogOut, Home, Settings, FolderOpen
} from 'lucide-react';
import TeamStatsDashboard from '@/components/admin/TeamStatsDashboard';
import KnowledgeManagement from '@/components/admin/KnowledgeManagement';
import { FileManagement } from '@/components/admin/FileManagement';
import { AIAssistantButton } from '@/components/ai/AIAssistantButton';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminSimplePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('stats');
  const [loading, setLoading] = useState(false);

  // NO AUTH CHECK - Panel accesible sin login para testing

  const sections = [
    {
      id: 'stats',
      icon: BarChart3,
      title: 'Team Statistics',
      description: 'Ver rendimiento del equipo'
    },
    {
      id: 'knowledge',
      icon: BookOpen,
      title: 'Knowledge Base',
      description: 'Subir PDFs y generar contenido con AI'
    },
    {
      id: 'files',
      icon: FolderOpen,
      title: 'File Management',
      description: 'Subir y gestionar archivos'
    },
    {
      id: 'ai',
      icon: Brain,
      title: 'AI Configuration',
      description: 'Configuración del asistente AI'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Auth check removed - admin panel accessible without login for testing

  return (
    <div className="min-h-screen bg-[#020204]">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4942D] flex items-center justify-center">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F1F5F9]">Admin Panel</h1>
              <p className="text-sm text-[#94A3B8]">VCSA Management Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#F1F5F9] rounded-lg transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="bg-[#0F172A] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
          <div className="bg-[#1E293B] rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-[#94A3B8]">Total Users</p>
                <p className="text-2xl font-bold text-[#F1F5F9]">156</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-xs text-[#94A3B8]">Active Today</p>
                <p className="text-2xl font-bold text-[#F1F5F9]">89</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-xs text-[#94A3B8]">Training Items</p>
                <p className="text-2xl font-bold text-[#F1F5F9]">42</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <p className="text-xs text-[#94A3B8]">AI Chats</p>
                <p className="text-2xl font-bold text-[#F1F5F9]">234</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-6 rounded-xl border transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/10 border-[#D4AF37]/50'
                    : 'bg-[#1E293B] border-white/10 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isActive ? 'bg-[#D4AF37]/20' : 'bg-white/5'}`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-[#D4AF37]' : 'text-[#94A3B8]'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${isActive ? 'text-[#D4AF37]' : 'text-[#F1F5F9]'}`}>
                      {section.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8]">{section.description}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-[#94A3B8]'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden">
          {activeSection === 'stats' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Team Statistics</h2>
                <p className="text-[#94A3B8]">Monitor your team's performance in real-time</p>
              </div>
              <TeamStatsDashboard />
            </div>
          )}

          {activeSection === 'knowledge' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Knowledge Management</h2>
                <p className="text-[#94A3B8]">Upload PDFs and let AI generate training content automatically</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 rounded-full">
                  <Brain className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#D4AF37] font-medium">AI Powered - Upload PDFs & Auto-Generate Content</span>
                </div>
              </div>
              <KnowledgeManagement />
            </div>
          )}

          {activeSection === 'files' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">File Management</h2>
                <p className="text-[#94A3B8]">Sube y gestiona archivos (PDFs, imágenes, videos)</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 rounded-full">
                  <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#D4AF37] font-medium">Admin Only - Gestión completa de archivos</span>
                </div>
              </div>
              <FileManagement />
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">AI Configuration</h2>
                <p className="text-[#94A3B8]">Configure AI assistant settings and features</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0F172A] border border-white/10 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F1F5F9] text-lg">Ollama LLM</h3>
                      <p className="text-green-400 text-sm">● Connected & Healthy</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[#94A3B8]">Model</span>
                      <span className="text-[#F1F5F9] font-medium">llama3.1</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[#94A3B8]">API Endpoint</span>
                      <span className="text-[#F1F5F9] font-medium text-sm">host.docker.internal:11434</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#94A3B8]">Status</span>
                      <span className="text-green-400 font-medium">● Operational</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-white/10 rounded-lg p-6">
                  <h3 className="font-semibold text-[#F1F5F9] mb-4">Active AI Features</h3>

                  <div className="space-y-3">
                    {[
                      { feature: 'Enhanced Chat', status: 'active' },
                      { feature: 'PDF Processing', status: 'active' },
                      { feature: 'Role Playing', status: 'active' },
                      { feature: 'Sentiment Analysis', status: 'active' },
                      { feature: 'Proactive Suggestions', status: 'active' },
                      { feature: 'Knowledge Generation', status: 'active' }
                    ].map((item) => (
                      <div key={item.feature} className="flex items-center gap-3 py-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <span className="text-[#F1F5F9]">{item.feature}</span>
                        {item.status === 'active' && (
                          <span className="ml-auto text-xs text-green-400">● On</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistantButton />
    </div>
  );
}
