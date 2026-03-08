import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, FileText, Search, Lock, Crown,
  File, Sparkles, BookOpen, MessageSquare
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const categories = [
  { value: '', label: 'All Resources', icon: FileText },
  { value: 'script', label: 'Scripts', icon: MessageSquare },
  { value: 'framework', label: 'Frameworks', icon: BookOpen },
  { value: 'guide', label: 'Guides', icon: File },
  { value: 'prompt', label: 'AI Prompts', icon: Sparkles },
  { value: 'template', label: 'Templates', icon: FileText },
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = category ? `?category=${category}` : '';
        const response = await axios.get(`${API}/resources${params}`, { withCredentials: true });
        setResources(response.data);
      } catch (error) {
        console.error('Resources error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [category]);

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (resource) => {
    try {
      const response = await axios.post(
        `${API}/resources/${resource.resource_id}/download`,
        {},
        { withCredentials: true }
      );
      window.open(response.data.file_url, '_blank');
      toast.success('Download started');
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('VIP membership required');
      } else {
        toast.error('Download failed');
      }
    }
  };

  const getCategoryIcon = (cat) => {
    const found = categories.find(c => c.value === cat);
    return found?.icon || FileText;
  };

  const getCategoryColor = (cat) => {
    const colors = {
      script: 'text-blue-400 bg-blue-400/10',
      framework: 'text-purple-400 bg-purple-400/10',
      guide: 'text-green-400 bg-green-400/10',
      prompt: 'text-orange-400 bg-orange-400/10',
      template: 'text-pink-400 bg-pink-400/10',
    };
    return colors[cat] || 'text-[#D4AF37] bg-[#D4AF37]/10';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto" data-testid="resources-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Resource Library</h1>
          <p className="text-[#94A3B8]">Battle-tested scripts, frameworks, and tools used by top producers</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
              data-testid="resources-search"
            />
          </div>
        </motion.div>

        {/* Category Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "p-3 glass text-center transition-all",
                  category === cat.value 
                    ? "border-[#D4AF37] bg-[#D4AF37]/10" 
                    : "hover:border-[#D4AF37]/30"
                )}
                data-testid={`category-${cat.value || 'all'}`}
              >
                <Icon className={cn(
                  "w-5 h-5 mx-auto mb-1",
                  category === cat.value ? "text-[#D4AF37]" : "text-[#94A3B8]"
                )} />
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredResources.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredResources.map((resource, i) => {
              const Icon = getCategoryIcon(resource.category);
              const canDownload = !resource.vip_only || user?.membership === 'vip';
              const hasLevel = resource.min_level <= (user?.level || 1);
              
              return (
                <motion.div
                  key={resource.resource_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass p-5 hover:border-[#D4AF37]/30 transition-colors"
                  data-testid={`resource-${resource.resource_id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 flex items-center justify-center shrink-0", getCategoryColor(resource.category))}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs uppercase tracking-wider", getCategoryColor(resource.category))}>
                          {resource.category}
                        </span>
                        {resource.vip_only && (
                          <span className="flex items-center gap-1 text-xs text-[#D4AF37]">
                            <Crown className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium mb-1 line-clamp-1">{resource.title}</h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{resource.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8]">
                          {resource.downloads} downloads
                        </span>
                        
                        {canDownload && hasLevel ? (
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(resource)}
                            className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
                          >
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        ) : !hasLevel ? (
                          <Button size="sm" variant="outline" className="border-white/10 text-[#94A3B8]" disabled>
                            <Lock className="w-4 h-4 mr-1" /> Level {resource.min_level}
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#D4AF37]/50 text-[#D4AF37]"
                            onClick={() => window.location.href = '/membership'}
                          >
                            <Crown className="w-4 h-4 mr-1" /> VIP
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="glass p-12 text-center">
            <FileText className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-medium mb-2">No resources found</h3>
            <p className="text-[#94A3B8]">
              {search ? 'Try adjusting your search' : 'Check back soon for new resources'}
            </p>
          </div>
        )}

        {/* Upsell */}
        {user?.membership !== 'vip' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 vip-glow" />
            <div className="relative flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Unlock All Resources</p>
                <h3 className="font-serif text-2xl font-semibold mb-2">Get VIP Access</h3>
                <p className="text-[#94A3B8]">
                  Access our complete library of scripts, frameworks, and AI prompts 
                  used by the top producers in the industry.
                </p>
              </div>
              <Button 
                className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider px-8 h-12 glow-gold"
                onClick={() => window.location.href = '/membership'}
              >
                <Crown className="w-4 h-4 mr-2" /> Become VIP
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
