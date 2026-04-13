import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function DailyPerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get(`${API}/api/dashboard/performance?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance:', error);
      // Use demo data
      setPerformance({
        date: new Date().toISOString().split('T')[0],
        tours_completed: 3,
        sales_count: 1,
        total_volume: 4500,
        avg_deal_size: 4500,
        conversion_rate: 33,
        active_hours: 6,
        tours: [
          { id: 1, time: '10:00 AM', outcome: 'Sale', volume: 4500, duration: 45 },
          { id: 2, time: '11:30 AM', outcome: 'No Sale', volume: 0, duration: 30 },
          { id: 3, time: '2:00 PM', outcome: 'No Sale', volume: 0, duration: 35 }
        ],
        daily_goal: {
          tours_target: 5,
          sales_target: 2,
          volume_target: 8000
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const addTour = async (tourData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/dashboard/performance/tour`, tourData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowAddForm(false);
      fetchPerformance(); // Refresh data
    } catch (error) {
      console.error('Error adding tour:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const toursRemaining = performance?.daily_goal?.tours_target - performance?.tours_completed || 0;
  const salesRemaining = performance?.daily_goal?.sales_target - performance?.sales_count || 0;
  const volumeRemaining = performance?.daily_goal?.volume_target - performance?.total_volume || 0;

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Daily Performance
              </h1>
              <p className="text-on-surface-variant text-base">
                {performance?.date || new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Tour
            </button>
          </div>
        </div>

        {/* Add Tour Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-card rounded-xl p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-on-surface mb-4">Log Today's Tour</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addTour({
                time: formData.get('time'),
                outcome: formData.get('outcome'),
                volume: parseFloat(formData.get('volume') || '0'),
                duration: parseInt(formData.get('duration') || '0')
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full px-4 py-2 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">Outcome</label>
                  <select
                    name="outcome"
                    required
                    className="w-full px-4 py-2 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                  >
                    <option value="">Select outcome</option>
                    <option value="Sale">Sale</option>
                    <option value="No Sale">No Sale</option>
                    <option value="Follow Up">Follow Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">Volume ($)</label>
                  <input
                    type="number"
                    name="volume"
                    min="0"
                    step="100"
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    min="0"
                    placeholder="30"
                    className="w-full px-4 py-2 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90"
                >
                  Save Tour
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-container/80"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tours Completed"
            value={performance?.tours_completed || 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Sales Today"
            value={performance?.sales_count || 0}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Volume"
            value={`$${(performance?.total_volume || 0).toLocaleString()}`}
            icon={TrendingUp}
            color="gold"
          />
          <StatCard
            title="Conversion Rate"
            value={`${performance?.conversion_rate || 0}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Daily Goals Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-on-surface">Tours Goal</h3>
              <span className="text-2xl font-bold text-primary">
                {performance?.tours_completed || 0}/{performance?.daily_goal?.tours_target || 0}
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${((performance?.tours_completed || 0) / (performance?.daily_goal?.tours_target || 1)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-on-surface-variant">
              {toursRemaining > 0 ? `${toursRemaining} tours remaining` : 'Goal achieved!'}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-on-surface">Sales Goal</h3>
              <span className="text-2xl font-bold text-green-400">
                {performance?.sales_count || 0}/{performance?.daily_goal?.sales_target || 0}
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 mb-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all"
                style={{ width: `${((performance?.sales_count || 0) / (performance?.daily_goal?.sales_target || 1)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-on-surface-variant">
              {salesRemaining > 0 ? `${salesRemaining} sales remaining` : 'Sales goal achieved!'}
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-on-surface">Volume Goal</h3>
              <span className="text-2xl font-bold text-primary">
                ${((performance?.total_volume || 0) / 1000).toFixed(1)}k/${(performance?.daily_goal?.volume_target / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                style={{ width: `${((performance?.total_volume || 0) / (performance?.daily_goal?.volume_target || 1)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-on-surface-variant">
              {volumeRemaining > 0 ? `$${volumeRemaining.toLocaleString()} remaining` : 'Volume goal achieved!'}
            </p>
          </div>
        </div>

        {/* Today's Tours */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-on-surface mb-6">Today's Tours</h2>

          {performance?.tours && performance.tours.length > 0 ? (
            <div className="space-y-4">
              {performance.tours.map((tour) => (
                <div
                  key={tour.id}
                  className={`p-4 rounded-xl ${
                    tour.outcome === 'Sale'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : tour.outcome === 'Follow Up'
                      ? 'bg-yellow-500/10 border border-yellow-500/20'
                      : 'bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock size={18} className="text-on-surface-variant" />
                      <span className="text-on-surface font-medium">{tour.time}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        tour.outcome === 'Sale' ? 'text-green-400' :
                        tour.outcome === 'Follow Up' ? 'text-yellow-400' :
                        'text-on-surface-variant'
                      }`}>
                        {tour.outcome}
                      </p>
                      {tour.volume > 0 && (
                        <p className="text-xs text-on-surface-variant">
                          ${tour.volume.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-on-surface-variant" size={48} />
              <p className="text-on-surface-variant mb-4">No tours logged today yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium"
              >
                Log First Tour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
