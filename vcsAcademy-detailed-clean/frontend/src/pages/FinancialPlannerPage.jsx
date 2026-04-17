import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, PiggyBank, Target,
  Calculator, PieChart, Wallet, CreditCard,
  Home, Car, Umbrella, GraduationCap, Heart,
  ArrowUp, ArrowDown, Info, Save, Plus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const DEMO_FINANCIAL_DATA = {
  currentIncome: {
    monthlyBase: 5000,
    monthlyCommissions: [4500, 5200, 4800, 6100, 5800, 7200],
    bonuses: 2000,
    totalMonthly: 12200
  },
  goals: [
    {
      id: 1,
      name: 'Emergency Fund',
      icon: Umbrella,
      target: 30000,
      current: 18500,
      deadline: '2026-12-31',
      priority: 'high',
      category: 'savings'
    },
    {
      id: 2,
      name: 'Down Payment',
      icon: Home,
      target: 80000,
      current: 32500,
      deadline: '2028-06-30',
      priority: 'high',
      category: 'savings'
    },
    {
      id: 3,
      name: 'New Car',
      icon: Car,
      target: 35000,
      current: 12000,
      deadline: '2027-03-31',
      priority: 'medium',
      category: 'savings'
    },
    {
      id: 4,
      name: 'Education Fund',
      icon: GraduationCap,
      target: 25000,
      current: 8500,
      deadline: '2027-09-30',
      priority: 'medium',
      category: 'investment'
    },
    {
      id: 5,
      name: 'Travel Fund',
      icon: Heart,
      target: 15000,
      current: 6500,
      deadline: '2026-12-31',
      priority: 'low',
      category: 'savings'
    }
  ],
  monthlyExpenses: [
    { category: 'Housing', amount: 2500, icon: Home },
    { category: 'Transportation', amount: 800, icon: Car },
    { category: 'Food', amount: 1200, icon: null },
    { category: 'Utilities', amount: 450, icon: null },
    { category: 'Insurance', amount: 600, icon: Shield },
    { category: 'Entertainment', amount: 400, icon: null },
    { category: 'Shopping', amount: 600, icon: null },
    { category: 'Savings', amount: 3000, icon: PiggyBank }
  ],
  projections: {
    conservative: {
      monthlyGrowth: 0.05,
      year1Income: 146400,
      year2Income: 175680,
      year3Income: 210816
    },
    moderate: {
      monthlyGrowth: 0.10,
      year1Income: 158400,
      year2Income: 201768,
      year3Income: 256946
    },
    aggressive: {
      monthlyGrowth: 0.15,
      year1Income: 172800,
      year2Income: 231456,
      year3Income: 310144
    }
  }
};

export default function FinancialPlannerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [incomeProjection, setIncomeProjection] = useState('moderate');
  const [financialData] = useState(DEMO_FINANCIAL_DATA);

  const calculateTotalExpenses = () => {
    return financialData.monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const calculateMonthlySavings = () => {
    const totalIncome = financialData.currentIncome.totalMonthly;
    const totalExpenses = calculateTotalExpenses();
    return totalIncome - totalExpenses;
  };

  const calculateSavingsRate = () => {
    const totalIncome = financialData.currentIncome.totalMonthly;
    const savings = calculateMonthlySavings();
    return ((savings / totalIncome) * 100).toFixed(1);
  };

  const calculateGoalProgress = (goal) => {
    return ((goal.current / goal.target) * 100).toFixed(1);
  };

  const calculateGoalCompletionDate = (goal) => {
    const remaining = goal.target - goal.current;
    const monthlyContribution = calculateMonthlySavings();
    if (monthlyContribution <= 0) return 'Never';
    const monthsNeeded = Math.ceil(remaining / monthlyContribution);
    const completionDate = new Date();
    completionDate.setMonth(completionDate.getMonth() + monthsNeeded);
    return completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getTotalSavings = () => {
    return financialData.goals.reduce((sum, goal) => sum + goal.current, 0);
  };

  const getProjectedIncome = (year) => {
    const projection = financialData.projections[incomeProjection];
    switch(year) {
      case 1: return projection.year1Income;
      case 2: return projection.year2Income;
      case 3: return projection.year3Income;
      default: return projection.year1Income;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bold tracking-tighter text-[#F8FAFC] font-['Playfair_Display']">
              Financial Planner
            </h1>
            <p className="text-lg text-[#94A3B8] mt-2">
              Plan your financial future and track your progress
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#94A3B8]">Monthly Income</span>
              <DollarSign className="text-green-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
              ${(financialData.currentIncome.totalMonthly).toLocaleString()}
            </p>
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <ArrowUp size={16} />
              +12% from last month
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#94A3B8]">Monthly Savings</span>
              <PiggyBank className="text-blue-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
              ${calculateMonthlySavings().toLocaleString()}
            </p>
            <p className="text-sm text-[#94A3B8] mt-2">
              {calculateSavingsRate()}% savings rate
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#94A3B8]">Total Savings</span>
              <Wallet className="text-purple-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
              ${getTotalSavings().toLocaleString()}
            </p>
            <p className="text-sm text-[#94A3B8] mt-2">
              Across {financialData.goals.length} goals
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#94A3B8]">Monthly Expenses</span>
              <CreditCard className="text-red-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
              ${calculateTotalExpenses().toLocaleString()}
            </p>
            <p className="text-sm text-[#94A3B8] mt-2">
              {financialData.monthlyExpenses.length} categories
            </p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'overview', label: 'Overview', icon: PieChart },
              { id: 'goals', label: 'Savings Goals', icon: Target },
              { id: 'income', label: 'Income Projections', icon: TrendingUp },
              { id: 'budget', label: 'Budget Planner', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-black'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="min-h-[500px]"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Income Chart Placeholder */}
              <div className="glass-card rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Income Trend (Last 6 Months)</h3>
                <div className="h-64 flex items-end justify-between gap-4 px-8">
                  {financialData.currentIncome.monthlyCommissions.map((income, index) => {
                    const maxIncome = Math.max(...financialData.currentIncome.monthlyCommissions);
                    const height = (income / maxIncome) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-[#D4AF37] to-[#B8860B] rounded-t-lg transition-all hover:from-[#B8860B] hover:to-[#D4AF37]" style={{ height: `${height}%` }} />
                        <span className="text-xs text-[#94A3B8]">Month {index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Goals */}
              <div className="glass-card rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Top Priority Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {financialData.goals
                    .filter(g => g.priority === 'high')
                    .slice(0, 3)
                    .map((goal) => {
                      const Icon = goal.icon;
                      const progress = calculateGoalProgress(goal);
                      return (
                        <div key={goal.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                              <Icon className="text-[#D4AF37]" size={24} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#F8FAFC]">{goal.name}</h4>
                              <p className="text-sm text-[#94A3B8]">{progress}% complete</p>
                            </div>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-[#94A3B8]">
                            <span>${goal.current.toLocaleString()}</span>
                            <span>${goal.target.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#F8FAFC]">Savings Goals</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8860B] transition-all">
                  <Plus size={18} />
                  Add Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialData.goals.map((goal) => {
                  const Icon = goal.icon;
                  const progress = calculateGoalProgress(goal);
                  const completionDate = calculateGoalCompletionDate(goal);

                  return (
                    <div key={goal.id} className="glass-card rounded-xl p-6 border border-white/10 hover:border-[#D4AF37]/30 transition-all">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
                          <Icon className="text-[#D4AF37]" size={32} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-lg font-semibold text-[#F8FAFC]">{goal.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {goal.priority}
                            </span>
                          </div>
                          <p className="text-sm text-[#94A3B8]">Target: ${goal.target.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#94A3B8]">Progress</span>
                          <span className="text-[#F8FAFC] font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] h-3 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div className="text-[#94A3B8]">
                          <span className="text-[#F8FAFC] font-medium">${goal.current.toLocaleString()}</span> saved
                        </div>
                        <div className="text-[#94A3B8]">
                          Est. completion: <span className="text-[#D4AF37] font-medium">{completionDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Income Projection Model</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { id: 'conservative', label: 'Conservative', growth: '5%', description: 'Steady growth' },
                    { id: 'moderate', label: 'Moderate', growth: '10%', description: 'Balanced approach' },
                    { id: 'aggressive', label: 'Aggressive', growth: '15%', description: 'Maximum growth' }
                  ].map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setIncomeProjection(model.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        incomeProjection === model.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <h4 className="font-semibold text-[#F8FAFC] mb-1">{model.label}</h4>
                      <p className="text-2xl font-bold text-[#D4AF37] mb-1">{model.growth}</p>
                      <p className="text-sm text-[#94A3B8]">{model.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-6">3-Year Income Projection</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((year) => (
                    <div key={year} className="bg-white/5 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-[#F8FAFC] mb-1">Year {year}</h4>
                          <p className="text-sm text-[#94A3B8]">Projected annual income</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                            ${getProjectedIncome(year).toLocaleString()}
                          </p>
                          <p className="text-sm text-green-400 flex items-center justify-end gap-1">
                            <ArrowUp size={16} />
                            {year === 1 ? '+30%' : year === 2 ? '+27%' : '+27%'} from previous year
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Info className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC] mb-2">Projection Assumptions</h4>
                    <ul className="space-y-1 text-sm text-[#94A3B8]">
                      <li>• Based on historical commission growth rates</li>
                      <li>• Assumes consistent performance and effort</li>
                      <li>• Actual results may vary based on market conditions</li>
                      <li>• Review and adjust projections quarterly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Summary */}
                <div className="glass-card rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Monthly Budget Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-[#94A3B8]">Total Income</span>
                      <span className="text-lg font-bold text-green-400 font-['JetBrains_Mono']">
                        ${financialData.currentIncome.totalMonthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-[#94A3B8]">Total Expenses</span>
                      <span className="text-lg font-bold text-red-400 font-['JetBrains_Mono']">
                        -${calculateTotalExpenses().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#D4AF37]/10 rounded-lg border-2 border-[#D4AF37]">
                      <span className="text-[#F8FAFC] font-medium">Net Savings</span>
                      <span className="text-lg font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                        ${calculateMonthlySavings().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings Rate */}
                <div className="glass-card rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Savings Rate</h3>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${calculateSavingsRate() * 4.4} 440`}
                          className="text-[#D4AF37]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                            {calculateSavingsRate()}%
                          </p>
                          <p className="text-sm text-[#94A3B8]">Savings Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-[#94A3B8] mt-4">
                    Recommended: 20% or higher
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="glass-card rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-4">Monthly Expenses</h3>
                <div className="space-y-3">
                  {financialData.monthlyExpenses.map((expense, index) => {
                    const Icon = expense.icon;
                    const percentage = ((expense.amount / calculateTotalExpenses()) * 100).toFixed(1);
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        {Icon && <Icon className="text-[#94A3B8]" size={20} />}
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[#F8FAFC]">{expense.category}</span>
                            <span className="text-[#F8FAFC] font-medium font-['JetBrains_Mono']">
                              ${expense.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-[#94A3B8] w-12 text-right">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
