import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Search, Check, Zap, Clock,
  Bookmark, Filter
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const tagColors = {
  objection: 'bg-orange-500/20 text-orange-400',
  control: 'bg-blue-500/20 text-blue-400',
  close: 'bg-green-500/20 text-green-400',
  recovery: 'bg-purple-500/20 text-purple-400',
  price: 'bg-red-500/20 text-red-400',
  spouse: 'bg-pink-500/20 text-pink-400',
  urgency: 'bg-yellow-500/20 text-yellow-400',
  opening: 'bg-cyan-500/20 text-cyan-400',
  engagement: 'bg-indigo-500/20 text-indigo-400',
  value: 'bg-emerald-500/20 text-emerald-400',
  negotiation: 'bg-amber-500/20 text-amber-400',
};

const allTags = ['objection', 'control', 'close', 'recovery', 'price', 'spouse', 'urgency', 'opening', 'engagement', 'value'];

export default function QuickWinsPage() {
  const { user } = useAuth();
  const [quickwins, setQuickwins] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedWin, setSelectedWin] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [winsRes, progressRes] = await Promise.all([
        axios.get(`${API}/development/quickwins`, { withCredentials: true }),
        axios.get(`${API}/development/progress`, { withCredentials: true })
      ]);
      setQuickwins(winsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (winId) => {
    setApplying(true);
    try {
      await axios.post(`${API}/development/quickwins/${winId}/apply`, {}, { withCredentials: true });
      toast.success('Quick Win applied! +3 points');
      await fetchData();
    } catch (error) {
      toast.error('Failed to mark as applied');
    } finally {
      setApplying(false);
    }
  };

  const appliedWins = progress?.progress?.content_completed?.filter(id => id.startsWith('qw_')) || [];
  
  const filteredWins = quickwins.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.situation.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || w.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get unique tags from data
  const availableTags = [...new Set(quickwins.flatMap(w => w.tags))];

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
      <div className="max-w-6xl mx-auto" data-testid="quick-wins-page">
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
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Tactical Knowledge</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Quick Wins Library</h1>
          <p className="text-[#94A3B8]">
            Short, actionable tactics you can use on the sales floor immediately
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-[#94A3B8]">
              {appliedWins.length} / {quickwins.length} applied
            </span>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[#D4AF37]">+3 points per application</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search quick wins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
              data-testid="quickwins-search"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={!selectedTag ? 'default' : 'outline'}
              className={cn(
                !selectedTag 
                  ? "bg-[#D4AF37] text-black hover:bg-[#B4942D]" 
                  : "border-white/10"
              )}
              onClick={() => setSelectedTag('')}
            >
              All
            </Button>
            {availableTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant={selectedTag === tag ? 'default' : 'outline'}
                className={cn(
                  selectedTag === tag 
                    ? "bg-[#D4AF37] text-black hover:bg-[#B4942D]" 
                    : "border-white/10"
                )}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Wins List */}
          <div className="space-y-3">
            {filteredWins.map((win, i) => {
              const isApplied = appliedWins.includes(win.content_id);
              const isSelected = selectedWin?.content_id === win.content_id;
              
              return (
                <motion.div
                  key={win.content_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className={cn(
                    "glass p-4 cursor-pointer transition-all",
                    isSelected ? "border-[#D4AF37]" : "hover:border-[#D4AF37]/30",
                    isApplied && "border-green-500/30"
                  )}
                  onClick={() => setSelectedWin(win)}
                  data-testid={`quickwin-${win.content_id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center shrink-0 rounded-full",
                      isApplied ? "bg-green-500/20" : "bg-[#D4AF37]/20"
                    )}>
                      {isApplied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Zap className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium text-sm",
                        isApplied && "text-green-400"
                      )}>
                        {win.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {win.duration} min
                        </span>
                        {win.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={cn("text-xs px-1.5 py-0.5", tagColors[tag] || "bg-white/10 text-[#94A3B8]")}
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

          {/* Quick Win Detail */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedWin ? (
              <motion.div
                key={selectedWin.content_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-6 space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="font-serif text-lg font-semibold">{selectedWin.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedWin.duration} min
                    </span>
                    {selectedWin.tags.map((tag) => (
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
                  <h4 className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">The Situation</h4>
                  <p className="text-[#F1F5F9] leading-relaxed">{selectedWin.situation}</p>
                </div>

                <div className="bg-[#D4AF37]/10 p-4 border-l-2 border-[#D4AF37]">
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">The Move</h4>
                  <p className="text-[#F1F5F9] leading-relaxed">{selectedWin.the_move}</p>
                </div>

                <div className="bg-white/5 p-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Example</h4>
                  <p className="text-[#F1F5F9] leading-relaxed italic">"{selectedWin.example}"</p>
                </div>

                {!appliedWins.includes(selectedWin.content_id) ? (
                  <Button
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold"
                    onClick={() => handleApply(selectedWin.content_id)}
                    disabled={applying}
                  >
                    {applying ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" /> I Used This (+3 pts)
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center py-3 bg-green-500/10 text-green-400 text-sm">
                    <Check className="w-4 h-4 inline mr-2" /> Applied on the floor
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass p-12 text-center">
                <Zap className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="font-serif text-lg font-medium mb-2">Select a Quick Win</h3>
                <p className="text-[#94A3B8]">Click on a tactic to see details and examples</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
