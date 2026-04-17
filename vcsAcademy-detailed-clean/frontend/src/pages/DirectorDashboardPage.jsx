import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const DirectorDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/api/director/stats`, {
          withCredentials: true
        });
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching director stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020204] text-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-[Playfair Display] text-[#D4AF37] mb-2">
          Dashboard Director
        </h1>
        <p className="text-[#94A3B8] mb-8">
          Visibilidad completa de tus equipos y representantes
        </p>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                {stats.total_tours}
              </div>
              <div className="text-sm text-[#94A3B8]">Tours Esta Semana</div>
            </div>
            <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                {stats.total_closes}
              </div>
              <div className="text-sm text-[#94A3B8]">Cierres Esta Semana</div>
            </div>
            <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                {stats.avg_readiness}%
              </div>
              <div className="text-sm text-[#94A3B8]">Readiness Promedio</div>
            </div>
            <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                {stats.active_reps}/{stats.total_reps}
              </div>
              <div className="text-sm text-[#94A3B8]">Reps Activos Hoy</div>
            </div>
          </div>
        )}

        <div className="bg-[#0A0A0B] border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">
            🏢 Equipos
          </h2>
          <p className="text-[#94A3B8]">
            Próximamente: Lista de equipos con stats individuales...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboardPage;
