/**
 * VCSA V2 - Dashboard Page
 * Following design specification from docs/design/dashboard/code.html
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { ProgressRing, AchievementChip, MetricHero, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    readinessScore: 72,
    trend: { value: 5, label: 'this week' },
    dailyGoals: [
      {
        id: 1,
        title: 'Tours',
        current: 2,
        target: 3,
        icon: 'tour',
        color: 'text-[#f2ca50]'
      },
      {
        id: 2,
        title: 'Sales',
        current: 1,
        target: 2,
        icon: 'shopping_cart',
        color: 'text-[#9db2ff]'
      },
      {
        id: 3,
        title: 'Volume',
        current: 8500,
        target: 15000,
        icon: 'payments',
        color: 'text-[#c3cee6]',
        prefix: '$'
      }
    ],
    weeklyHighlights: [
      {
        id: 1,
        title: 'Closed 3 deals this week',
        impact: 'high',
        trend: 'up'
      },
      {
        id: 2,
        title: 'Improved objection handling by 20%',
        impact: 'medium',
        trend: 'up'
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Group Coaching: Advanced Closing',
        date: 'Today, 3:00 PM',
        type: 'group-coaching'
      },
      {
        id: 2,
        title: 'Role Play: Handling Price Objections',
        date: 'Tomorrow, 10:00 AM',
        type: 'roleplay'
      }
    ],
    quickActions: [
      {
        id: 1,
        title: 'Log Tour',
        icon: 'add_circle',
        path: '/v2/performance'
      },
      {
        id: 2,
        title: 'Continue Training',
        icon: 'play_circle',
        path: '/v2/training'
      },
      {
        id: 3,
        title: 'View Analytics',
        icon: 'insights',
        path: '/v2/analytics'
      }
    ]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch strategy data
      const strategyResponse = await axios.get(`${API}/api/dashboard/strategy`, {
        withCredentials: true
      });

      // Fetch performance data
      const performanceResponse = await axios.get(`${API}/api/dashboard/performance`, {
        withCredentials: true
      });

      // Merge data with defaults
      setData(prevData => ({
        ...prevData,
        readinessScore: strategyResponse.data.readinessScore || prevData.readinessScore,
        dailyGoals: performanceResponse.data.tours ? [
          { ...prevData.dailyGoals[0], current: performanceResponse.data.toursCompleted || 0 },
          ...prevData.dailyGoals.slice(1)
        ] : prevData.dailyGoals
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use default data (demo mode)
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131317] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#d0c5af]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32">
      {/* Top App Bar */}
      <TopAppBar
        title="The Vault"
        user={{ name: 'Carlos' }}
      />

      {/* Main Content */}
      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero Section: Readiness Score */}
        <section className="mb-16 animate-fade-in">
          <ProgressRing
            value={data.readinessScore}
            size={256}
            strokeWidth={12}
            label="Readiness Score"
            trend={data.trend}
          />
        </section>

        {/* Daily Goals Grid */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold text-[#e5e1e8] font-headline">Daily Goals</h2>
            <span className="text-xs text-[#d0c5af] font-medium">Monday, Oct 24</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.dailyGoals.map((goal) => (
              <GlassCard
                key={goal.id}
                variant="default"
                padding="lg"
                className="flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/10 flex items-center justify-center">
                    <span className={`material-symbols-outlined ${goal.color}`}>{goal.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-[#e5e1e8]">
                    {goal.prefix || ''}{goal.current}/{goal.target}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#e5e1e8] font-headline">
                  {goal.title}
                </h3>

                {/* Progress Bar */}
                <div className="w-full bg-[#353439] h-1 rounded-full overflow-hidden">
                  <div
                    className="achievement-gradient h-full transition-all duration-1000"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Weekly Highlights */}
          <section>
            <h2 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6 flex items-center gap-3">
              <div className="w-2 h-8 achievement-gradient rounded-full"></div>
              Weekly Highlights
            </h2>

            <div className="space-y-4">
              {data.weeklyHighlights.map((highlight) => (
                <GlassCard
                  key={highlight.id}
                  variant="default"
                  padding="md"
                  className="flex items-start gap-4"
                >
                  <span className={`material-symbols-outlined ${
                    highlight.impact === 'high' ? 'text-[#f2ca50]' : 'text-[#9db2ff]'
                  }`}>
                    {highlight.trend === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                  <p className="text-[#e5e1e8] text-sm">{highlight.title}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <h2 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-[#264191] rounded-full"></div>
              Upcoming Events
            </h2>

            <div className="space-y-4">
              {data.upcomingEvents.map((event) => (
                <GlassCard
                  key={event.id}
                  variant="default"
                  padding="md"
                  className="hover-lift cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#e5e1e8] mb-1 font-headline">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#d0c5af]">{event.date}</p>
                    </div>
                    <AchievementChip
                      label={event.type === 'group-coaching' ? 'Live' : 'Practice'}
                      variant={event.type === 'group-coaching' ? 'success' : 'secondary'}
                      size="sm"
                    />
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.path}
                className="group"
              >
                <GlassCard
                  variant="elevated"
                  padding="lg"
                  className="flex items-center gap-4 group-hover:border-[#f2ca50]/30"
                >
                  <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
                    {action.icon}
                  </span>
                  <span className="text-base font-semibold text-[#e5e1e8] font-headline">
                    {action.title}
                  </span>
                  <span className="material-symbols-outlined text-[#d0c5af] ml-auto">
                    arrow_forward
                  </span>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
