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
    },
    {
      id: 4,
      title: "Build Value Before Numbers",
      description: "Establish value antes de presentar precio",
      category: "discovery",
      impact: 5,
      key_move: "Focus on benefits, not features"
    },
    {
      id: 5,
      title: "Handle Price Objections",
      description: "Responde a 'too expensive' efectivamente",
      category: "objections",
      impact: 5,
      key_move: "Reframe price vs value"
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [token] = useState(localStorage.getItem('token') || 'demo-token');

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
