import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Star, Eye, Clock, Filter, TrendingUp, Award,
  ChevronDown, User, Briefcase, Building, CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { cn } from '@/lib/utils';

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-400 bg-green-400/10' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400 bg-yellow-400/10' },
  advanced: { label: 'Advanced', color: 'text-red-400 bg-red-400/10' },
};

const topicTags = {
  objections: 'Objections',
  closing: 'Closing',
  discovery: 'Discovery',
  mindset: 'Mindset',
  presentation: 'Presentation',
  decision: 'Decision',
  'post-decision': 'Post-Decision',
  price: 'Price',
  value: 'Value',
};

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function MasterclassesPage() {
  const { user } = useAuth();
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterExpert, setFilterExpert] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique experts and topics from masterclasses
  const experts = [...new Set(masterclasses.map(m => m.expert?.name).filter(Boolean))];
  const topics = [...new Set(masterclasses.flatMap(m => m.tags || []))];

  useEffect(() => {
    const fetchMasterclasses = async () => {
      try {
        const params = new URLSearchParams();
        if (filterTopic !== 'all') params.append('topic', filterTopic);
        if (filterExpert !== 'all') params.append('expert', filterExpert);
        if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
        params.append('sort', sortBy);

        const response = await axios.get(`${API}/development/masterclasses?${params}`, {
          withCredentials: true
        });
        setMasterclasses(response.data);
      } catch (error) {
        console.error('Masterclasses error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterclasses();
  }, [filterTopic, filterExpert, filterDifficulty, sortBy]);

  const clearFilters = () => {
    setFilterTopic('all');
    setFilterExpert('all');
    setFilterDifficulty('all');
    setSortBy('newest');
  };

  const hasActiveFilters = filterTopic !== 'all' || filterExpert !== 'all' || filterDifficulty !== 'all';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto" data-testid="masterclasses-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Masterclasses</h1>
          <p className="text-[#94A3B8]">Learn from industry experts and top producers</p>
        </motion.div>

        {/* Featured Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-sm flex items-center justify-center">
                <Play className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{masterclasses.length}</p>
                <p className="text-sm text-[#94A3B8]">Expert Classes</p>
              </div>
            </div>
          </div>
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-sm flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{experts.length}</p>
                <p className="text-sm text-[#94A3B8]">Industry Experts</p>
              </div>
            </div>
          </div>
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-sm flex items-center justify-center">
                <Star className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {masterclasses.length > 0
                    ? (masterclasses.reduce((acc, m) => acc + (m.rating || 0), 0) / masterclasses.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-sm text-[#94A3B8]">Avg Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-sm text-[#94A3B8]">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#D4AF37] hover:underline ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden text-[#94A3B8]"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {/* Filter Controls */}
          <div className={cn(
            "space-y-4",
            !showFilters && "hidden lg:block"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Topic Filter */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Topic</label>
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topicTags[topic] || topic}</option>
                  ))}
                </select>
              </div>

              {/* Expert Filter */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Expert</label>
                <select
                  value={filterExpert}
                  onChange={(e) => setFilterExpert(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">All Experts</option>
                  {experts.map(expert => (
                    <option key={expert} value={expert}>{expert}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs text-[#94A3B8] mb-1 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : masterclasses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {masterclasses.map((masterclass, i) => {
              const difficulty = difficultyConfig[masterclass.difficulty] || difficultyConfig.beginner;

              return (
                <motion.div
                  key={masterclass.content_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass hover:border-[#D4AF37]/30 transition-all group"
                >
                  {/* Video Thumbnail / Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-[#1E3A8A] to-[#0A0A0B] relative overflow-hidden">
                    {masterclass.video_url && masterclass.video_url !== 'PLACEHOLDER' ? (
                      <img
                        src={masterclass.expert?.photo_url || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=225&fit=crop'}
                        alt={masterclass.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/20" />
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {masterclass.duration}m
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 text-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Difficulty & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("text-xs px-2 py-0.5", difficulty.color)}>
                        {difficulty.label}
                      </span>
                      {masterclass.rating && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="text-[#94A3B8]">{masterclass.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">
                      {masterclass.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2">
                      {masterclass.description}
                    </p>

                    {/* Expert Info */}
                    {masterclass.expert && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                        <div className="w-8 h-8 bg-white/10 rounded-full overflow-hidden">
                          {masterclass.expert.photo_url ? (
                            <img
                              src={masterclass.expert.photo_url}
                              alt={masterclass.expert.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              {masterclass.expert.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{masterclass.expert.name}</p>
                          <p className="text-xs text-[#94A3B8] truncate">
                            {masterclass.expert.title}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {masterclass.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-white/5 text-[#94A3B8] px-2 py-0.5">
                          {topicTags[tag] || tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {masterclass.view_count || 0} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {masterclass.track_name || 'General'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-12 text-center">
            <Play className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">No Masterclasses Found</h3>
            <p className="text-[#94A3B8] mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more content.'
                : 'Masterclasses will appear here once content is tagged appropriately.'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37]">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Expert Profiles Section */}
        {experts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" /> Featured Experts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experts.map((expertName, i) => {
                const expert = masterclasses.find(m => m.expert?.name === expertName)?.expert;
                const classCount = masterclasses.filter(m => m.expert?.name === expertName).length;

                return (
                  <div key={i} className="glass p-4 text-center hover:border-[#D4AF37]/30 transition-colors">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full overflow-hidden">
                      {expert?.photo_url ? (
                        <img
                          src={expert.photo_url}
                          alt={expert.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-[#94A3B8]" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium">{expert?.name || expertName}</h4>
                    <p className="text-xs text-[#94A3B8] mb-2">{expert?.title}</p>
                    {expert?.company && (
                      <p className="text-xs text-[#94A3B8] flex items-center justify-center gap-1 mb-2">
                        <Building className="w-3 h-3" />
                        {expert.company}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1 text-xs text-[#D4AF37]">
                      <Play className="w-3 h-3" />
                      {classCount} class{classCount !== 1 ? 'es' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
