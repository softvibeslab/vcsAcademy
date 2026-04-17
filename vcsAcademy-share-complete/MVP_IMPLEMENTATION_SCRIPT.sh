#!/bin/bash

################################################################################
# VCSA INSIGHT MVP - IMPLEMENTATION SCRIPT
# Ejecuta este script para crear el MVP en 1 día
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# PHASE 1: SETUP
################################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 VCSA INSIGHT MVP - SETUP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Install desde https://nodejs.org${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js versión: $(node --version)${NC}"

# Create PWA project
echo -e "\n${YELLOW}📦 Creando PWA React...${NC}"
npx create-react-app vcsa-insight --template cra-template
cd vcsa-insight

# Install dependencies
echo -e "\n${YELLOW}📦 Instalando dependencias...${NC}"
npm install @tanstack/react-query axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install workbox-webpack-plugin workbox-precaching

echo -e "${GREEN}✅ Dependencias instaladas${NC}"

################################################################################
# PHASE 2: CONFIGURATION
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}⚙️  CONFIGURANDO PWA${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Initialize Tailwind
echo -e "${YELLOW}🎨 Configurando Tailwind CSS...${NC}"
npx tailwindcss init -p

# Create components directory
mkdir -p src/components
mkdir -p src/services
mkdir -p public

################################################################################
# PHASE 3: CREATE FILES
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📝 CREANDO COMPONENTES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Create components
echo -e "${YELLOW}📄 Creando: src/components/AICoachChat.jsx${NC}"
cat > src/components/AICoachChat.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function AICoachChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai-assistant/chat/enhanced`,
        {
          message: input,
          conversation_history: messages
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.data.response,
        sentiment: response.data.data.sentiment,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, estoy teniendo problemas. Intenta de nuevo.',
        isError: true
      }]);
    }

    setIsLoading(false);
  };

  const suggestedPrompts = [
    "¿Cómo puedo mejorar mi cierre hoy?",
    "Tengo una objeción de precio, ¿qué hago?",
    "Necesito motivación para mi próximo tour",
    "¿Cómo manejo 'necesito pensarlo'?"
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mr-3">
            🤖
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">VCSA Coach</h1>
            <p className="text-blue-200 text-sm">Tu asistente personal 24/7</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-10">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-white text-xl font-bold mb-2">¡Hola! Soy tu AI Coach</h2>
            <p className="text-blue-200 mb-6">Pregúntame anything sobre ventas</p>
            <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm p-3 rounded-xl text-left transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : msg.isError
                  ? 'bg-red-900/50 text-red-200'
                  : 'bg-gray-800 text-gray-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sentiment && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs text-gray-400">
                      Estado: {msg.sentiment === 'positive' ? '😊 Positivo' : msg.sentiment === 'negative' ? '😟 Preocupado' : '😐 Neutral'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/30 backdrop-blur-lg border-t border-white/10">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

echo -e "${GREEN}✅ AICoachChat.jsx creado${NC}"

# Create InsightDashboard
echo -e "${YELLOW}📄 Creando: src/components/InsightDashboard.jsx${NC}"
cat > src/components/InsightDashboard.jsx << 'EOF'
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function InsightDashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      // Get user context
      const response = await axios.get(
        `${API_URL}/api/development/progress`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInsights({
        readiness_score: response.data.readiness_score || 75,
        points: response.data.points || 0,
        level: response.data.level || 1,
        prediction: "Hoy tienes un 85% de probabilidad de cerrar. Tu confianza está alta y has aplicado 3 Quick Wins esta semana.",
        actions: [
          { icon: '🎯', title: 'Hacer 3 tours', impact: 'Alto impacto en cierre', priority: 'URGENTE' },
          { icon: '⚡', title: 'Aplicar Quick Win: Objection Handling', impact: 'Mejora tasa de cierre 20%', priority: 'HOY' },
          { icon: '📚', title: 'Completar módulo Value Architecture', impact: '+10 puntos toward level up', priority: 'ESTA SEMANA' }
        ],
        gaps: [
          { area: 'Closing Rate', issue: '15% below target - necesita práctica' }
        ]
      });

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando tus insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 pb-24">
      {/* Header */}
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-bold text-white mb-1">👋 ¡Buenos días!</h1>
        <p className="text-blue-200">Aquí están tus insights de hoy</p>
      </div>

      {/* Readiness Score Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Readiness Score</h2>
            <p className="text-blue-200 text-sm">Tu nivel de preparación hoy</p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {insights.readiness_score}
            </span>
            <p className="text-blue-200 text-xs mt-1">/ 100</p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${insights.readiness_score}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="text-center">
            <p className="text-blue-200">Nivel</p>
            <p className="text-white font-bold text-lg">{insights.level}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200">Puntos</p>
            <p className="text-white font-bold text-lg">{insights.points}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200">Streak</p>
            <p className="text-white font-bold text-lg">🔥 7</p>
          </div>
        </div>
      </div>

      {/* AI Prediction */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 mb-4 border border-white/20">
        <div className="flex items-start">
          <span className="text-4xl mr-4">🤖</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Prediction</h3>
            <p className="text-white/90 text-sm leading-relaxed">{insights.prediction}</p>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-4 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ Acciones Recomendadas</h3>
        <div className="space-y-3">
          {insights.actions.map((action, i) => (
            <div key={i} className="flex items-center bg-black/20 rounded-xl p-4">
              <span className="text-3xl mr-4">{action.icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{action.title}</p>
                <p className="text-blue-200 text-xs">{action.impact}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                action.priority === 'URGENTE' ? 'bg-red-500/20 text-red-300' :
                action.priority === 'HOY' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {action.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      {insights.gaps && insights.gaps.length > 0 && (
        <div className="bg-red-500/10 backdrop-blur-lg rounded-3xl p-6 border border-red-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">⚠️ Areas de Mejora</h3>
          {insights.gaps.map((gap, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-white font-medium text-sm">{gap.area}</p>
              <p className="text-red-300 text-xs">{gap.issue}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

echo -e "${GREEN}✅ InsightDashboard.jsx creado${NC}"

# Create QuickWinsLibrary
echo -e "${YELLOW}📄 Creando: src/components/QuickWinsLibrary.jsx${NC}"
cat > src/components/QuickWinsLibrary.jsx << 'EOF'
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function QuickWinsLibrary() {
  const [quickWins, setQuickWins] = useState([
    {
      id: 1,
      title: "Recover After Losing Control",
      description: "Cómo regain control cuando el customer toma el主导",
      category: "objections",
      impact: 5,
      key_move: "Pause, acknowledge, then redirect with a question"
    },
    {
      id: 2,
      title: "Handle 'Think About It'",
      description: "Preventa the 'need to think about it' objection",
      category: "closing",
      impact: 5,
      key_move: "Identify real concern before price reveal"
    },
    {
      id: 3,
      title: "Create Urgency",
      description: "Generate urgency without being pushy",
      category: "before_tour",
      impact: 4,
      key_move: "Tie to personal goals, not scarcity"
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  const categories = [
    { value: 'all', label: 'ALL' },
    { value: 'before_tour', label: 'PRE-TOUR' },
    { value: 'closing', label: 'CLOSING' },
    { value: 'objections', label: 'OBJECTIONS' },
    { value: 'discovery', label: 'DISCOVERY' }
  ];

  const filtered = quickWins.filter(qw => {
    const matchesFilter = filter === 'all' || qw.category === filter;
    const matchesSearch = qw.title.toLowerCase().includes(search.toLowerCase()) ||
                         qw.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 pb-24">
      {/* Header */}
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-bold text-white mb-2">⚡ Quick Wins</h1>
        <p className="text-blue-200">50+ tácticas probadas de ventas</p>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Buscar tácticas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto py-4 -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-black/30 text-gray-300 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Wins Grid */}
      <div className="space-y-4">
        {filtered.map(qw => (
          <div key={qw.id} className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                qw.category === 'before_tour' ? 'bg-blue-500/20 text-blue-300' :
                qw.category === 'closing' ? 'bg-green-500/20 text-green-300' :
                qw.category === 'objections' ? 'bg-red-500/20 text-red-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {qw.category.toUpperCase()}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400 text-sm">
                  {'⭐'.repeat(qw.impact)}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{qw.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{qw.description}</p>
            <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/10">
              <p className="text-blue-300 text-xs font-medium mb-1">KEY MOVE:</p>
              <p className="text-white text-sm">{qw.key_move}</p>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Apply Now 🚀
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

echo -e "${GREEN}✅ QuickWinsLibrary.jsx creado${NC}"

echo -e "\n${GREEN}✅ Todos los componentes creados${NC}"

################################################################################
# PHASE 4: CONFIGURE APP
################################################################################

echo -e "\n${YELLOW}📝 Configurando App.js y Layout...${NC}"

cat > src/components/Layout.jsx << 'EOF'
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/chat', icon: '🤖', label: 'AI Coach' },
    { path: '/quick-wins', icon: '⚡', label: 'Quick Wins' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <main>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-2 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
EOF

cat > src/App.js << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InsightDashboard from './components/InsightDashboard';
import AICoachChat from './components/AICoachChat';
import QuickWinsLibrary from './components/QuickWinsLibrary';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<InsightDashboard />} />
          <Route path="/chat" element={<AICoachChat />} />
          <Route path="/quick-wins" element={<QuickWinsLibrary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo -e "${GREEN}✅ App configurada${NC}"

################################################################################
# PHASE 5: PWA MANIFEST
################################################################################

echo -e "\n${YELLOW}📱 Creando PWA manifest y service worker...${NC}"

cat > public/manifest.json << 'EOF'
{
  "short_name": "VCSA Insight",
  "name": "VCSA Insight - AI Sales Coach",
  "icons": [
    {
      "src": "https://via.placeholder.com/192/1E3A8A/FFFFFF?text=V",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://via.placeholder.com/512/1E3A8A/FFFFFF?text=V",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1E3A8A",
  "background_color": "#020204",
  "orientation": "portrait"
}
EOF

cat > public/service-worker.js << 'EOF'
const CACHE_NAME = 'vcsa-insight-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/static/css/main.css',
        '/static/js/main.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
EOF

cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('SW registered: ', registration);
      }).catch(
      registrationError => {
        console.log('SW registration failed: ', registrationError);
      }
    );
  });
}
EOF

echo -e "${GREEN}✅ PWA configurada${NC}"

################################################################################
# PHASE 6: ENVIRONMENT
################################################################################

echo -e "\n${YELLOW}🔐 Creando archivo .env...${NC}"

cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
EOF

echo -e "${GREEN}✅ .env creado${NC}"

################################################################################
# PHASE 7: BUILD
################################################################################

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🔨 BUILDING APP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

npm run build

echo ""
echo -e "${GREEN}✅ BUILD COMPLETADO${NC}"

################################################################################
# PHASE 8: INSTRUCTIONS
################################################################################

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 MVP CREADO EXITOSAMENTE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 SIGUIENTES PASOS:${NC}"
echo ""
echo -e "1. ${GREEN}TEST LOCAL:${NC}"
echo -e "   cd vcsa-insight"
echo -e "   npm start"
echo -e "   Abre http://localhost:3000"
echo ""
echo -e "2. ${GREEN}TEST MOBILE:${NC}"
echo -e "   Asegúrate de estar en la misma WiFi"
echo -e "   Abre http://TU_IP:3000 en tu móvil"
echo -e "   Prueba instalar la PWA"
echo ""
echo -e "3. ${GREEN}DEPLOY:${NC}"
echo -e "   npm i -g vercel"
echo -e "   vercel --prod"
echo ""
echo -e "4. ${GREEN}BACKEND:${NC}"
echo -e "   Asegúrate de que el backend esté corriendo:"
echo -e "   cd /Users/newproject/Documents/GitHub/vcsAcademy"
echo -e "   docker-compose up -d"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ MVP VCSA INSIGHT LISTO PARA VENDER 🚀${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
