import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, DollarSign, Calculator, Flame,
  Award, CheckCircle2, Zap, BarChart3
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { FinancialGoalCalculator } from '@/components/financial/FinancialGoalCalculator';

export default function FinancialPlanningPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calculator');
  const [financialSummary, setFinancialSummary] = useState(null);
  const [todayAttributes, setTodayAttributes] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Fetch financial summary
      const summaryResponse = await axios.get(`${API}/financial/goals/summary`, { withCredentials: true });
      setFinancialSummary(summaryResponse.data.data);

      // Fetch today's attributes
      const attributesResponse = await axios.get(`${API}/financial/attributes/today`, { withCredentials: true });
      setTodayAttributes(attributesResponse.data.data);
    } catch (error) {
      console.error('Financial data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8" data-testid="financial-planning-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter text-[#F8FAFC] font-['Playfair_Display']">
                Financial Planning
              </h1>
              <p className="text-lg text-[#94A3B8] mt-2">
                Set your income goals and track your path to success
              </p>
            </div>
            {todayAttributes && (
              <Badge className="bg-[#D4AF37] text-black font-bold px-4 py-2">
                <Flame className="w-4 h-4 mr-1" />
                {todayAttributes.achieved_count}/{todayAttributes.total_possible} Attributes
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        {financialSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
              <CardContent className="p-6">
                <p className="text-sm text-[#94A3B8] mb-1">Target Income</p>
                <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                  ${financialSummary.target_income?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#EF4444]/30 transition-all">
              <CardContent className="p-6">
                <p className="text-sm text-[#94A3B8] mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-[#EF4444] font-['JetBrains_Mono']">
                  ${financialSummary.total_expenses?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#10B981]/30 transition-all">
              <CardContent className="p-6">
                <p className="text-sm text-[#94A3B8] mb-1">Income Gap</p>
                <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
                  ${financialSummary.income_gap?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#8B5CF6]/30 transition-all">
              <CardContent className="p-6">
                <p className="text-sm text-[#94A3B8] mb-1">Days Remaining</p>
                <p className="text-2xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                  {financialSummary.days_remaining || 0}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="calculator" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Calculator className="w-4 h-4 mr-2" />
                Goal Calculator
              </TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Expense Tracker
              </TabsTrigger>
              <TabsTrigger value="attributes" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Award className="w-4 h-4 mr-2" />
                Personal Attributes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-6">
              <FinancialGoalCalculator />
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Expense Tracker</h3>
                    <p className="text-[#94A3B8]">Track your daily expenses here (Coming Soon)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="mt-6">
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Personal Attributes</h3>
                    <p className="text-[#94A3B8]">Track your daily mindset achievements (Coming Soon)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
