import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function InsightDashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token') || 'demo-token');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/development/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      const readinessScore = data.readiness_score || 75;
      const points = data.points || 0;
      const level = data.level || 1;

      setInsights({
        readiness_score: readinessScore,
        points: points,
        level: level,
        prediction: `Hoy tienes un ${readinessScore}% de probabilidad de cerrar. Tu nivel ${level} muestra que estás en el camino correcto.`,
        actions: [
          { icon: '🎯', title: 'Hacer 3 tours', impact: 'Alto impacto en cierre', priority: 'URGENTE' },
          { icon: '⚡', title: 'Aplicar Quick Win: Objection Handling', impact: 'Mejora tasa de cierre 20%', priority: 'HOY' },
          { icon: '📚', title: 'Completar módulo Value Architecture', impact: '+10 puntos toward level up', priority: 'ESTA SEMANA' }
        ],
        gaps: points < 100 ? [
          { area: 'Training Progress', issue: 'Necesitas más puntos para alcanzar el siguiente nivel' }
        ] : []
      });

    } catch (error) {
      console.error('Error fetching insights:', error);
      // Use demo data if API fails
      setInsights({
        readiness_score: 75,
        points: 50,
        level: 2,
        prediction: "Hoy tienes un 75% de probabilidad de cerrar. Tu nivel 2 muestra progreso sólido.",
        actions: [
          { icon: '🎯', title: 'Hacer 3 tours', impact: 'Alto impacto en cierre', priority: 'URGENTE' },
          { icon: '⚡', title: 'Aplicar Quick Win', impact: 'Mejora tasa de cierre', priority: 'HOY' }
        ],
        gaps: []
      });
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
