import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Search, Check, Target, AlertTriangle,
  Lightbulb, ArrowRight, Filter
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const tagColors = {
  price: 'bg-red-500/20 text-red-400',
  control: 'bg-blue-500/20 text-blue-400',
  close: 'bg-green-500/20 text-green-400',
  objection: 'bg-orange-500/20 text-orange-400',
  recovery: 'bg-purple-500/20 text-purple-400',
  spouse: 'bg-pink-500/20 text-pink-400',
  qualification: 'bg-yellow-500/20 text-yellow-400',
  negotiation: 'bg-cyan-500/20 text-cyan-400',
  engagement: 'bg-indigo-500/20 text-indigo-400',
};

export default function DealBreakdownsPage() {
  const { user } = useAuth();
  const [breakdowns, setBreakdowns] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [breakdownsRes, progressRes] = await Promise.all([
        axios.get(`${API}/development/breakdowns`, { withCredentials: true }),
        axios.get(`${API}/development/progress`, { withCredentials: true })
      ]);
      setBreakdowns(breakdownsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (breakdownId) => {
    setMarking(true);
    try {
      await axios.post(`${API}/development/breakdowns/${breakdownId}/review`, {}, { withCredentials: true });
      toast.success('Breakdown reviewed! +5 points');
      await fetchData();
    } catch (error) {
      toast.error('Failed to mark as reviewed');
    } finally {
      setMarking(false);
    }
  };

  const reviewedBreakdowns = progress?.progress?.breakdowns_reviewed || [];
  
  const filteredBreakdowns = breakdowns.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.scenario.toLowerCase().includes(search.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

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
      <div className="max-w-6xl mx-auto" data-testid="deal-breakdowns-page">
        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link to="/path" className="text-[#94A3B8] hover:text-white flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Top Producer Path
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Learn From Real Scenarios</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Real Deal Breakdowns</h1>
          <p className="text-[#94A3B8]">
            Analyze real sales scenarios to understand where control is gained or lost
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-[#94A3B8]">
              {reviewedBreakdowns.length} / {breakdowns.length} reviewed
            </span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[#D4AF37]">+5 points per review</span>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search breakdowns by title, scenario, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
              data-testid="breakdowns-search"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Breakdown List */}
          <div className="space-y-4">
            {filteredBreakdowns.map((breakdown, i) => {
              const isReviewed = reviewedBreakdowns.includes(breakdown.breakdown_id);
              const isSelected = selectedBreakdown?.breakdown_id === breakdown.breakdown_id;
              
              return (
                <motion.div
                  key={breakdown.breakdown_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "glass p-5 cursor-pointer transition-all",
                    isSelected ? "border-[#D4AF37]" : "hover:border-[#D4AF37]/30",
                    isReviewed && "border-green-500/30"
                  )}
                  onClick={() => setSelectedBreakdown(breakdown)}
                  data-testid={`breakdown-${breakdown.breakdown_id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center shrink-0",
                      isReviewed ? "bg-green-500/20" : "bg-white/5"
                    )}>
                      {isReviewed ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <span className="font-mono text-sm text-[#94A3B8]">{breakdown.order}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium mb-1",
                        isReviewed && "text-green-400"
                      )}>
                        {breakdown.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-2 mb-2">
                        {breakdown.scenario}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={cn("text-xs px-2 py-0.5", tagColors[tag] || "bg-white/10 text-[#94A3B8]")}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Breakdown Detail */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedBreakdown ? (
              <motion.div
                key={selectedBreakdown.breakdown_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-6 space-y-6"
              >
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">{selectedBreakdown.title}</h2>
                  <div className="flex flex-wrap gap-1">
                    {selectedBreakdown.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={cn("text-xs px-2 py-0.5", tagColors[tag] || "bg-white/10 text-[#94A3B8]")}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Scenario</h4>
                  <p className="text-[#F1F5F9] leading-relaxed">{selectedBreakdown.scenario}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> What Happened
                  </h4>
                  <p className="text-[#94A3B8] leading-relaxed">{selectedBreakdown.what_happened}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Control Analysis
                  </h4>
                  <p className="text-[#94A3B8] leading-relaxed">{selectedBreakdown.control_analysis}</p>
                </div>

                <div className="bg-green-500/10 p-4 border-l-2 border-green-500">
                  <h4 className="text-xs uppercase tracking-widest text-green-400 mb-2">The Better Move</h4>
                  <p className="text-[#F1F5F9] leading-relaxed italic">"{selectedBreakdown.better_move}"</p>
                </div>

                <div className="bg-[#D4AF37]/10 p-4 border-l-2 border-[#D4AF37]">
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Key Takeaway
                  </h4>
                  <p className="text-[#F1F5F9] leading-relaxed">{selectedBreakdown.key_takeaway}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Practice Prompt</h4>
                  <p className="text-[#94A3B8] italic">{selectedBreakdown.practice_prompt}</p>
                </div>

                {!reviewedBreakdowns.includes(selectedBreakdown.breakdown_id) ? (
                  <Button
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold"
                    onClick={() => handleReview(selectedBreakdown.breakdown_id)}
                    disabled={marking}
                  >
                    {marking ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" /> Mark as Reviewed (+5 pts)
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center py-3 bg-green-500/10 text-green-400 text-sm">
                    <Check className="w-4 h-4 inline mr-2" /> Reviewed
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass p-12 text-center">
                <Search className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="font-serif text-lg font-medium mb-2">Select a Breakdown</h3>
                <p className="text-[#94A3B8]">Click on a scenario to see the full analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
