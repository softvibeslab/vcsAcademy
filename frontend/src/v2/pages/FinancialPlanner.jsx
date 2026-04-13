/**
 * VCSA V2 - Financial Planner Page
 * Goal setting and income tracking
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { ProgressRing, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const FinancialPlanner = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({
    monthlyIncome: {
      target: 15000,
      current: 8500,
      currency: 'USD'
    },
    annualTarget: 180000,
    toursPerDay: 5,
    closingPercentage: 25,
    averageSale: 3500
  });

  const [projections] = useState({
    month1: 8500,
    month2: 10500,
    month3: 12500,
    month6: 18000,
    year1: 150000
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // This endpoint would need to be created
      const response = await axios.get(`${API}/api/financial/goals`, {
        withCredentials: true
      });

      if (response.data) {
        setGoals(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    try {
      await axios.post(`${API}/api/financial/goals`, goals, {
        withCredentials: true
      });
      alert('Goals saved successfully!');
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131317] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const monthlyProgress = (goals.monthlyIncome.current / goals.monthlyIncome.target) * 100;
  const annualProgress = (goals.monthlyIncome.current * 12 / goals.annualTarget) * 100;

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32">
      <TopAppBar title="The Vault" subtitle="Financial Planner" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#e5e1e8] font-headline leading-tight mb-4">
            Financial <span className="text-[#f2ca50]">Planning</span>
          </h1>
          <p className="text-[#d0c5af] text-lg max-w-2xl mx-auto">
            Set your income targets and track your progress toward financial freedom.
          </p>
        </section>

        {/* Income Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <GlassCard variant="default" padding="xl">
            <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
              Monthly Income Target
            </h2>

            <div className="flex items-center justify-center mb-8">
              <ProgressRing
                value={monthlyProgress}
                size={200}
                strokeWidth={10}
                label="Completed"
              />
            </div>

            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-[#f2ca50] font-headline mb-2">
                ${goals.monthlyIncome.current.toLocaleString()}
              </div>
              <div className="text-[#d0c5af]">
                of ${goals.monthlyIncome.target.toLocaleString()} target
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider">
                Monthly Target ($)
              </label>
              <input
                type="number"
                value={goals.monthlyIncome.target}
                onChange={(e) => setGoals({
                  ...goals,
                  monthlyIncome: { ...goals.monthlyIncome.target, target: Number(e.target.value) }
                })}
                className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
              />
            </div>
          </GlassCard>

          <GlassCard variant="default" padding="xl">
            <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
              Annual Projection
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-[#131317] rounded-lg">
                <span className="text-[#d0c5af]">Target</span>
                <span className="text-2xl font-bold text-[#e5e1e8] font-headline">
                  ${goals.annualTarget.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#131317] rounded-lg">
                <span className="text-[#d0c5af]">On Track</span>
                <span className="text-2xl font-bold text-[#f2ca50] font-headline">
                  ${(goals.monthlyIncome.current * 12).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#131317] rounded-lg">
                <span className="text-[#d0c5af]">Gap to Close</span>
                <span className="text-2xl font-bold text-[#c3cee6] font-headline">
                  ${(goals.annualTarget - (goals.monthlyIncome.current * 12)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                Annual Target ($)
              </label>
              <input
                type="number"
                value={goals.annualTarget}
                onChange={(e) => setGoals({ ...goals, annualTarget: Number(e.target.value) })}
                className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
              />
            </div>
          </GlassCard>
        </div>

        {/* Performance Metrics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
            Performance Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" padding="lg">
              <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-4">
                Tours Per Day
              </label>
              <input
                type="number"
                value={goals.toursPerDay}
                onChange={(e) => setGoals({ ...goals, toursPerDay: Number(e.target.value) })}
                className="w-full text-4xl font-bold text-[#e5e1e8] font-headline bg-transparent border-none focus:outline-none mb-2"
              />
              <p className="text-sm text-[#d0c5af]">Daily target</p>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-4">
                Closing Rate
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={goals.closingPercentage}
                  onChange={(e) => setGoals({ ...goals, closingPercentage: Number(e.target.value) })}
                  className="w-24 text-4xl font-bold text-[#e5e1e8] font-headline bg-transparent border-none focus:outline-none mb-2"
                />
                <span className="text-2xl text-[#f2ca50]">%</span>
              </div>
              <p className="text-sm text-[#d0c5af]">Conversion rate</p>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-4">
                Average Sale
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-[#f2ca50]">$</span>
                <input
                  type="number"
                  value={goals.averageSale}
                  onChange={(e) => setGoals({ ...goals, averageSale: Number(e.target.value) })}
                  className="w-full text-4xl font-bold text-[#e5e1e8] font-headline bg-transparent border-none focus:outline-none mb-2"
                />
              </div>
              <p className="text-sm text-[#d0c5af]">Per sale average</p>
            </GlassCard>
          </div>
        </div>

        {/* Projections */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
            Growth Projections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <GlassCard variant="default" padding="lg">
              <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Month 1</div>
              <div className="text-2xl font-bold text-[#e5e1e8] font-headline">
                ${projections.month1.toLocaleString()}
              </div>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Month 2</div>
              <div className="text-2xl font-bold text-[#e5e1e8] font-headline">
                ${projections.month2.toLocaleString()}
              </div>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Month 3</div>
              <div className="text-2xl font-bold text-[#e5e1e8] font-headline">
                ${projections.month3.toLocaleString()}
              </div>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Month 6</div>
              <div className="text-2xl font-bold text-[#9db2ff] font-headline">
                ${projections.month6.toLocaleString()}
              </div>
            </GlassCard>

            <GlassCard variant="default" padding="lg">
              <div className="text-sm text-[#d0c5af] uppercase tracking-wider mb-2">Year 1</div>
              <div className="text-2xl font-bold text-[#f2ca50] font-headline">
                ${projections.year1.toLocaleString()}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSaveGoals}
            className="achievement-gradient text-[#3c2f00] font-bold py-4 px-12 rounded-lg shadow-[0_10px_20px_-5px_rgba(242,202,80,0.3)] hover:scale-[1.02] transition-transform"
          >
            Save Goals
          </button>

          <button className="bg-[#1b1b20] text-[#e5e1e8] font-bold py-4 px-12 rounded-lg border border-[#4d4635]/10 hover:border-[#f2ca50]/30 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </main>
    </div>
  );
};

export default FinancialPlanner;
