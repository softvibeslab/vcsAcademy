/**
 * VCSA V2 - Analytics Dashboard Page
 * Charts, trends, and performance insights
 */

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const [salesData] = useState([
    { month: 'Jan', sales: 12000, tours: 45, closing: 27 },
    { month: 'Feb', sales: 15000, tours: 52, closing: 29 },
    { month: 'Mar', sales: 13500, tours: 48, closing: 28 },
    { month: 'Apr', sales: 18000, tours: 55, closing: 33 },
    { month: 'May', sales: 22000, tours: 62, closing: 35 },
    { month: 'Jun', sales: 25000, tours: 68, closing: 37 }
  ]);

  const [objectionData] = useState([
    { name: 'Price', value: 35, color: '#f2ca50' },
    { name: 'Timing', value: 25, color: '#9db2ff' },
    { name: 'Spouse', value: 20, color: '#c3cee6' },
    { name: 'Competition', value: 12, color: '#ffb4ab' },
    { name: 'Other', value: 8, color: '#d0c5af' }
  ]);

  const [performanceData] = useState([
    { metric: 'Tours/Day', current: 5.2, target: 5, trend: 'up' },
    { metric: 'Closing Rate', current: 28, target: 25, trend: 'up' },
    { metric: 'Avg Sale', current: 3800, target: 3500, trend: 'up' },
    { metric: 'Follow-up', current: 65, target: 80, trend: 'down' }
  ]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(`${API}/api/analytics?range=${timeRange}`, {
        withCredentials: true
      });

      // Process response data
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131317] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32">
      <TopAppBar title="The Vault" subtitle="Analytics Dashboard" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#e5e1e8] font-headline leading-tight mb-4">
              Performance <span className="text-[#f2ca50]">Analytics</span>
            </h1>
            <p className="text-[#d0c5af] text-lg">
              Track your progress and identify growth opportunities
            </p>
          </div>

          <div className="flex gap-3">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                  timeRange === range
                    ? 'achievement-gradient text-[#3c2f00]'
                    : 'bg-[#1b1b20] text-[#d0c5af] hover:text-[#e5e1e8]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <GlassCard variant="default" padding="lg">
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-[#e5e1e8] font-headline mb-1">$105,000</div>
            <div className="text-sm text-[#9db2ff]">↑ 12% vs last period</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Tours Completed</div>
            <div className="text-3xl font-bold text-[#e5e1e8] font-headline mb-1">330</div>
            <div className="text-sm text-[#9db2ff]">↑ 8% vs last period</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Closing Rate</div>
            <div className="text-3xl font-bold text-[#e5e1e8] font-headline mb-1">31%</div>
            <div className="text-sm text-[#9db2ff]">↑ 5% vs last period</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Avg Sale Value</div>
            <div className="text-3xl font-bold text-[#e5e1e8] font-headline mb-1">$3,180</div>
            <div className="text-sm text-[#c3cee6]">→ 0% vs last period</div>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sales Trend */}
          <GlassCard variant="default" padding="lg">
            <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-6">
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#353439" />
                <XAxis dataKey="month" stroke="#d0c5af" />
                <YAxis stroke="#d0c5af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#201f24', border: '1px solid #4d4635', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e1e8' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#f2ca50" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Tours vs Closing */}
          <GlassCard variant="default" padding="lg">
            <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-6">
              Tours & Closing
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#353439" />
                <XAxis dataKey="month" stroke="#d0c5af" />
                <YAxis stroke="#d0c5af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#201f24', border: '1px solid #4d4635', borderRadius: '8px' }}
                  labelStyle={{ color: '#e5e1e8' }}
                />
                <Legend />
                <Bar dataKey="tours" fill="#9db2ff" />
                <Bar dataKey="closing" fill="#f2ca50" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Objections Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <GlassCard variant="default" padding="lg" className="lg:col-span-1">
            <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-6">
              Objections Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={objectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {objjectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard variant="default" padding="lg" className="lg:col-span-2">
            <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-6">
              Performance vs Targets
            </h3>
            <div className="space-y-6">
              {performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#e5e1e8] font-medium">{item.metric}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#d0c5af] text-sm">Target: {item.target}</span>
                      <span className={`text-sm font-semibold ${
                        item.trend === 'up' ? 'text-[#9db2ff]' : 'text-[#ffb4ab]'
                      }`}>
                        Current: {item.current}
                      </span>
                      <span className={`material-symbols-outlined text-sm ${
                        item.trend === 'up' ? 'text-[#9db2ff]' : 'text-[#ffb4ab]'
                      }`}>
                        {item.trend === 'up' ? 'trending_up' : 'trending_down'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#353439] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.trend === 'up' ? 'bg-[#f2ca50]' : 'bg-[#ffb4ab]'}`}
                      style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Insights */}
        <GlassCard variant="default" padding="lg">
          <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-6">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#f2ca50]/5 border border-[#f2ca50]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#f2ca50]">lightbulb</span>
                <span className="font-semibold text-[#f2ca50]">Strength</span>
              </div>
              <p className="text-sm text-[#e5e1e8]">
                Your closing rate has improved 5% this period, indicating better qualification techniques.
              </p>
            </div>

            <div className="p-4 bg-[#9db2ff]/5 border border-[#9db2ff]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#9db2ff]">trending_up</span>
                <span className="font-semibold text-[#9db2ff]">Opportunity</span>
              </div>
              <p className="text-sm text-[#e5e1e8]">
                Price objections are 35% of total. Consider the Value Architecture training track.
              </p>
            </div>

            <div className="p-4 bg-[#ffb4ab]/5 border border-[#ffb4ab]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#ffb4ab]">priority_high</span>
                <span className="font-semibold text-[#ffb4ab]">Action Needed</span>
              </div>
              <p className="text-sm text-[#e5e1e8]">
                Follow-up rate is 15% below target. Focus on post-tour engagement strategies.
              </p>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
