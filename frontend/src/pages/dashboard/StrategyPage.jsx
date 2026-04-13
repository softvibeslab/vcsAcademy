import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Award, Zap, ArrowRight, Calendar } from 'lucide-react';
import { StatCard } from '@/components/shared';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function StrategyPage() {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategy();
  }, []);

  const fetchStrategy = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/api/dashboard/strategy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStrategy(response.data);
    } catch (error) {
      console.error('Error fetching strategy:', error);
      // Use demo data if API fails
      setStrategy({
        monthly_objective: {
          target_income: 15000,
          current_income: 9750,
          progress: 65,
          days_remaining: 12
        },
        key_metrics: {
          sales_trend: '+15%',
          achievements: 12,
          action_items: 5,
          conversion_rate: 22
        },
        weekly_highlights: [
          { id: 1, title: 'Closed 3 deals this week', impact: 'positive' },
          { id: 2, title: 'Completed Value Architecture module', impact: 'positive' },
          { id: 3, title: 'Avg deal size increased by $200', impact: 'positive' }
        ],
        upcoming_events: [
          { id: 1, title: 'Group Coaching: Advanced Closing', date: 'Tomorrow, 2 PM', type: 'group-coaching' },
          { id: 2, title: 'Role Play Session', date: 'Friday, 3 PM', type: 'roleplay' }
        ]
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Strategy Panel
              </h1>
              <p className="text-on-surface-variant text-base">
                Your strategic overview and action items for success
              </p>
            </div>
            <Link
              to="/dashboard/analytics"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center"
            >
              View Analytics
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </motion.div>

        {/* Monthly Objective */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Target className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-on-surface">Monthly Objective</h2>
                  <p className="text-on-surface-variant text-sm">
                    {strategy?.monthly_objective?.days_remaining || 0} days remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-on-surface-variant text-sm mb-1">Target Income</p>
                <p className="text-3xl font-bold text-primary">
                  ${strategy?.monthly_objective?.target_income?.toLocaleString() || '0'}
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm mb-1">Current Income</p>
                <p className="text-3xl font-bold text-on-surface">
                  ${strategy?.monthly_objective?.current_income?.toLocaleString() || '0'}
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm mb-1">Gap to Goal</p>
                <p className="text-3xl font-bold text-red-400">
                  ${((strategy?.monthly_objective?.target_income || 0) - (strategy?.monthly_objective?.current_income || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-on-surface-variant">Progress to Goal</span>
                <span className="text-on-surface font-medium">{strategy?.monthly_objective?.progress || 0}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strategy?.monthly_objective?.progress || 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-4 bg-gradient-to-r from-primary to-secondary rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Sales Trend"
            value={strategy?.key_metrics?.sales_trend || '+0%'}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Achievements"
            value={strategy?.key_metrics?.achievements || 0}
            icon={Award}
            color="gold"
          />
          <StatCard
            title="Action Items"
            value={strategy?.key_metrics?.action_items || 0}
            icon={Zap}
            color="primary"
          />
          <StatCard
            title="Conversion Rate"
            value={`${strategy?.key_metrics?.conversion_rate || 0}%`}
            icon={TrendingUp}
            color="blue"
          />
        </motion.div>

        {/* Weekly Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-on-surface mb-6">Weekly Highlights</h2>
            <div className="space-y-4">
              {strategy?.weekly_highlights?.map((highlight, index) => (
                <div
                  key={highlight.id}
                  className={`p-4 rounded-xl ${
                    highlight.impact === 'positive'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  <p className="text-on-surface font-medium">{highlight.title}</p>
                </div>
              )) || (
                <p className="text-on-surface-variant">No highlights yet this week</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-on-surface">Upcoming Events</h2>
              <Link
                to="/coaching/events"
                className="text-primary hover:text-primary/80 font-medium flex items-center text-sm"
              >
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {strategy?.upcoming_events?.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-on-surface font-medium">{event.title}</p>
                      <p className="text-on-surface-variant text-sm">{event.date}</p>
                    </div>
                  </div>
                  <Link
                    to={`/coaching/events/${event.id}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Details →
                  </Link>
                </div>
              )) || (
                <p className="text-on-surface-variant text-center py-8">
                  No upcoming events scheduled
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            to="/training"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-all">
                <Target className="text-primary" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Continue Training</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Pick up where you left off</p>
          </Link>

          <Link
            to="/dashboard/financial"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/10 p-2 rounded-lg group-hover:bg-green-500/20 transition-all">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Update Goals</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Adjust your financial targets</p>
          </Link>

          <Link
            to="/coaching/group"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-all">
                <Users className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Join Coaching</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Next group session starts soon</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
