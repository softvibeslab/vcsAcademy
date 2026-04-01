import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, DollarSign, Calculator, ArrowRight, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API } from '@/App';
import axios from 'axios';

const EXPENSE_CATEGORIES = [
  { id: 'rent', label: 'Rent/Mortgage', icon: '🏠', amount: 0 },
  { id: 'car_payment', label: 'Car Payment', icon: '🚗', amount: 0 },
  { id: 'electricity', label: 'Electricity', icon: '⚡', amount: 0 },
  { id: 'food', label: 'Food/Groceries', icon: '🛒', amount: 0 },
  { id: 'water_bill', label: 'Water Bill', icon: '💧', amount: 0 },
  { id: 'credit_card', label: 'Credit Card(s)', icon: '💳', amount: 0 },
  { id: 'gas', label: 'Gas/Fuel', icon: '⛽', amount: 0 },
  { id: 'school', label: 'School/Education', icon: '📚', amount: 0 },
  { id: 'insurance', label: 'Insurance', icon: '🛡️', amount: 0 },
  { id: 'doctor', label: 'Doctor/Medical', icon: '🏥', amount: 0 },
  { id: 'dentist', label: 'Dentist', icon: '🦷', amount: 0 },
  { id: 'gym', label: 'Gym/Health', icon: '💪', amount: 0 },
  { id: 'transportation', label: 'Transportation', icon: '🚌', amount: 0 },
  { id: 'cell_phone', label: 'Cell Phone', icon: '📱', amount: 0 },
  { id: 'cable', label: 'Cable/Internet', icon: '📺', amount: 0 },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', amount: 0 },
  { id: 'other', label: 'Other', icon: '📦', amount: 0 },
];

export const FinancialGoalCalculator = () => {
  const [targetIncome, setTargetIncome] = useState('');
  const [avgSale, setAvgSale] = useState('1000');
  const [closingRate, setClosingRate] = useState('20');
  const [expenses, setExpenses] = useState(EXPENSE_CATEGORIES);
  const [calculatedMetrics, setCalculatedMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const updateExpenseAmount = (id, amount) => {
    setExpenses(prev => prev.map(exp =>
      exp.id === id ? { ...exp, amount: parseFloat(amount) || 0 } : exp
    ));
  };

  const calculateMetrics = () => {
    const target = parseFloat(targetIncome);
    if (!target || target <= 0) {
      return;
    }

    const avg = parseFloat(avgSale) || 1000;
    const closing = parseFloat(closingRate) || 20;
    const gap = Math.max(0, target - totalExpenses);

    let salesNeeded = 0;
    let toursNeeded = 0;

    if (gap > 0) {
      salesNeeded = Math.max(1, Math.ceil(gap / avg));
      toursNeeded = Math.max(1, Math.ceil(salesNeeded / (closing / 100)));
    }

    setCalculatedMetrics({
      totalExpenses,
      incomeGap: gap,
      salesNeeded,
      toursNeeded,
      targetIncome: target
    });
  };

  const saveFinancialGoal = async () => {
    if (!targetIncome || parseFloat(targetIncome) <= 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/financial/goals/setup`,
        {
          target_income: parseFloat(targetIncome),
          expenses: expenses.filter(exp => exp.amount > 0).map(exp => ({
            category: exp.id,
            amount: exp.amount
          })),
          avg_sale: parseFloat(avgSale),
          closing_rate: parseFloat(closingRate)
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Show success
        console.log('Financial goal saved:', response.data);
      }
    } catch (error) {
      console.error('Error saving financial goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Income Section */}
      <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#D4AF37] font-['Playfair_Display'] flex items-center gap-2">
            <Target className="w-6 h-6" />
            SET YOUR INCOME GOAL
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            "I NEED TO MAKE $______ THIS MONTH"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-[#F8FAFC] mb-2">Monthly Target Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] text-lg font-bold">$</span>
                <Input
                  type="number"
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(e.target.value)}
                  placeholder="15000"
                  className="bg-black/50 border-2 border-[#D4AF37]/50 focus:border-[#D4AF37] text-white text-lg font-['JetBrains_Mono'] pl-8"
                />
              </div>
            </div>
            <Button
              onClick={calculateMetrics}
              className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                Monthly Expenses
              </CardTitle>
              <CardDescription className="text-[#94A3B8]">
                Track ALL your expenses - include savings
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#94A3B8]">Total Expenses</p>
              <p className="text-2xl font-bold text-[#EF4444] font-['JetBrains_Mono']">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm hover:border-white/20 transition-all"
              >
                <span className="text-2xl">{expense.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">{expense.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#94A3B8] text-sm">$</span>
                  <Input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => updateExpenseAmount(expense.id, e.target.value)}
                    placeholder="0"
                    className="w-28 bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white text-sm font-['JetBrains_Mono']"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculated Results */}
      {calculatedMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Gap Analysis */}
          <Card className={`bg-gradient-to-br ${
            calculatedMetrics.incomeGap > 0
              ? 'from-[#EF4444]/10 to-transparent border-[#EF4444]/30'
              : 'from-[#10B981]/10 to-transparent border-[#10B981]/30'
          } border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">Income Gap Analysis</h3>
                  <p className="text-sm text-[#94A3B8]">
                    {calculatedMetrics.incomeGap > 0
                      ? `You need $${calculatedMetrics.incomeGap.toLocaleString()} more to reach your goal`
                      : '🎉 Your expenses are covered! Time to save more!'
                    }
                  </p>
                </div>
                <Badge className={`text-lg font-bold font-['JetBrains_Mono'] ${
                  calculatedMetrics.incomeGap > 0 ? 'bg-[#EF4444] text-white' : 'bg-[#10B981] text-white'
                } px-4 py-2`}>
                  ${calculatedMetrics.incomeGap.toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sales Targets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#94A3B8]">Sales Needed</p>
                    <p className="text-3xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
                      {calculatedMetrics.salesNeeded}
                    </p>
                  </div>
                </div>
                <Progress
                  value={calculatedMetrics.salesNeeded > 0 ? 10 : 0}
                  className="h-2 bg-white/10"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚌</span>
                  </div>
                  <div>
                    <p className="text-sm text-[#94A3B8]">Tours Needed</p>
                    <p className="text-3xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                      {calculatedMetrics.toursNeeded}
                    </p>
                  </div>
                </div>
                <Progress
                  value={calculatedMetrics.toursNeeded > 0 ? 10 : 0}
                  className="h-2 bg-white/10"
                />
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
              <Label className="text-sm text-[#94A3B8] mb-2">Avg Sale ($)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[#94A3B8]">$</span>
                <Input
                  type="number"
                  value={avgSale}
                  onChange={(e) => setAvgSale(e.target.value)}
                  className="bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
              <Label className="text-sm text-[#94A3B8] mb-2">Closing Rate (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={closingRate}
                  onChange={(e) => setClosingRate(e.target.value)}
                  max={100}
                  className="bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                />
                <span className="text-[#94A3B8]">%</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={saveFinancialGoal}
            disabled={loading || !targetIncome}
            className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            {loading ? 'Saving...' : 'Save Financial Goal (+25 pts)'}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
