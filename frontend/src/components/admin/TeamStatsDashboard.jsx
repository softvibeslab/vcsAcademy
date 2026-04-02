import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users, TrendingUp, DollarSign, Award, Target,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TeamStatsDashboard = () => {
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchTeamStats();
  }, [selectedMonth]);

  const fetchTeamStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-assistant/admin/team-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTeamStats(data.team_stats);
      }
    } catch (error) {
      console.error('Error fetching team stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceIcon = (progress) => {
    if (progress >= 100) return <Award className="w-4 h-4 text-[#D4AF37]" />;
    if (progress >= 75) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (progress >= 50) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <ChevronDown className="w-4 h-4 text-red-500" />;
  };

  const getPerformanceColor = (progress) => {
    if (progress >= 100) return 'text-[#D4AF37]';
    if (progress >= 75) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateTotalVolume = () => {
    return teamStats.reduce((sum, rep) => sum + (rep.monthly_volume || 0), 0);
  };

  const calculateAverageProgress = () => {
    if (teamStats.length === 0) return 0;
    const total = teamStats.reduce((sum, rep) => sum + (rep.goal_progress || 0), 0);
    return (total / teamStats.length).toFixed(1);
  };

  const getTopPerformer = () => {
    if (teamStats.length === 0) return null;
    return teamStats.reduce((top, rep) =>
      (rep.monthly_volume || 0) > (top.monthly_volume || 0) ? rep : top
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-[#D4AF37]">Cargando estadísticas del equipo...</div>
      </div>
    );
  }

  const topPerformer = getTopPerformer();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#F1F5F9]">Dashboard del Equipo</h2>
          <p className="text-[#94A3B8] mt-1">Visualización de rendimiento del equipo</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2 text-[#F1F5F9]"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8] text-sm">Total Ventas</p>
                <p className="text-2xl font-bold text-[#F1F5F9] mt-1">
                  ${calculateTotalVolume().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8] text-sm">Total Reps</p>
                <p className="text-2xl font-bold text-[#F1F5F9] mt-1">{teamStats.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8] text-sm">Progreso Promedio</p>
                <p className="text-2xl font-bold text-[#F1F5F9] mt-1">{calculateAverageProgress()}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8] text-sm">Top Performer</p>
                <p className="text-sm font-bold text-[#D4AF37] mt-1">
                  {topPerformer ? topPerformer.name : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9]">Rendimiento Individual</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {teamStats.map((rep, index) => (
                <motion.div
                  key={rep.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-[#0F172A] border border-white/5 rounded-lg hover:border-[#D4AF37]/30 transition-all"
                >
                  {/* Ranking */}
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-[#D4AF37]">#{index + 1}</span>
                  </div>

                  {/* Rep Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[#F1F5F9]">{rep.name}</h3>
                      <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-none">
                        Nivel {rep.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#94A3B8] mt-1">{rep.email}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    {/* Monthly Sales */}
                    <div className="text-center">
                      <p className="text-xs text-[#94A3B8]">Ventas</p>
                      <p className="text-lg font-semibold text-[#F1F5F9]">{rep.monthly_sales}</p>
                    </div>

                    {/* Volume */}
                    <div className="text-center">
                      <p className="text-xs text-[#94A3B8]">Volumen</p>
                      <p className="text-lg font-semibold text-[#F1F5F9]">
                        ${(rep.monthly_volume || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-center">
                      <p className="text-xs text-[#94A3B8]">Puntos</p>
                      <p className="text-lg font-semibold text-[#F1F5F9]">{rep.points}</p>
                    </div>

                    {/* Goal Progress */}
                    <div className="text-center min-w-[120px]">
                      <p className="text-xs text-[#94A3B8]">Meta</p>
                      <div className="flex items-center gap-2">
                        {getPerformanceIcon(rep.goal_progress)}
                        <p className={`text-lg font-semibold ${getPerformanceColor(rep.goal_progress)}`}>
                          {rep.goal_progress}%
                        </p>
                      </div>
                    </div>

                    {/* Active Days */}
                    <div className="text-center">
                      <p className="text-xs text-[#94A3B8]">Días Activos</p>
                      <p className="text-lg font-semibold text-[#F1F5F9]">{rep.active_days}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStatsDashboard;
