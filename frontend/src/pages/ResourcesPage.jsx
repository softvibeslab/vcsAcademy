import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Search, Filter, FileText, MessageSquare, BookOpen,
  File, Sparkles, Briefcase, TrendingUp, ExternalLink, Eye,
  ChevronDown, Hash, X, CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const resourceTypes = [
  { value: '', label: 'All Types', icon: FileText },
  { value: 'framework', label: 'Frameworks', icon: BookOpen },
  { value: 'script', label: 'Scripts', icon: MessageSquare },
  { value: 'case_study', label: 'Case Studies', icon: TrendingUp },
  { value: 'tool', label: 'Tools', icon: Briefcase },
  { value: 'template', label: 'Templates', icon: File },
];

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'closing', label: 'Closing' },
  { value: 'objections', label: 'Objections' },
  { value: 'mindset', label: 'Mindset' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'performance', label: 'Performance' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'a_z', label: 'A-Z' },
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or detail
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterType) params.append('type', filterType);
        if (filterCategory) params.append('category', filterCategory);
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort', sortBy);

        const response = await axios.get(`${API}/resources?${params}`, {
          withCredentials: true
        });
        setResources(response.data);
      } catch (error) {
        console.error('Resources error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [filterType, filterCategory, sortBy]);

  // Search on enter/debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        const params = new URLSearchParams();
        if (filterType) params.append('type', filterType);
        if (filterCategory) params.append('category', filterCategory);
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort', sortBy);

        axios.get(`${API}/resources?${params}`, { withCredentials: true })
          .then(response => setResources(response.data))
          .catch(error => console.error('Search error:', error));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterType, filterCategory, sortBy]);

  const handleViewResource = async (resource) => {
    setSelectedResource(resource);

    // Fetch related resources
    try {
      const response = await axios.get(`${API}/resources/${resource.resource_id}/related`, {
        withCredentials: true
      });
      setRelatedResources(response.data);
    } catch (error) {
      console.error('Related resources error:', error);
    }

    setViewMode('detail');
  };

  const handleDownload = async (resource) => {
    try {
      const response = await axios.post(
        `${API}/resources/${resource.resource_id}/download`,
        {},
        { withCredentials: true }
      );

      if (response.data.type === 'file' && response.data.file_url) {
        window.open(response.data.file_url, '_blank');
        toast.success('Download started');
      } else if (response.data.type === 'content' && response.data.content) {
        // Display content in a modal or new tab
        const blob = new Blob([response.data.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
        toast.success('Content opened');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('VIP membership required');
      } else {
        toast.error('Download failed');
      }
    }
  };

  const clearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setSearchQuery('');
    setSortBy('newest');
  };

  const hasActiveFilters = filterType || filterCategory || searchQuery;

  const getResourceTypeIcon = (type) => {
    const found = resourceTypes.find(t => t.value === type);
    return found?.icon || FileText;
  };

  const getResourceTypeColor = (type) => {
    const colors = {
      framework: 'text-purple-400 bg-purple-400/10',
      script: 'text-blue-400 bg-blue-400/10',
      case_study: 'text-green-400 bg-green-400/10',
      tool: 'text-orange-400 bg-orange-400/10',
      template: 'text-pink-400 bg-pink-400/10',
    };
    return colors[type] || 'text-[#D4AF37] bg-[#D4AF37]/10';
  };

  // Stats calculations
  const typeStats = resources.reduce((acc, r) => {
    acc[r.resource_type] = (acc[r.resource_type] || 0) + 1;
    return acc;
  }, {});

  if (viewMode === 'detail' && selectedResource) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto" data-testid="resources-detail">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => { setViewMode('grid'); setSelectedResource(null); setRelatedResources([]); }}
            className="mb-6 text-[#94A3B8] hover:text-white"
          >
            ← Back to Resources
          </Button>

          {/* Resource Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass p-8 mb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("text-xs px-2 py-1", getResourceTypeColor(selectedResource.resource_type))}>
                      {selectedResource.resource_type?.replace('_', ' ') || 'Resource'}
                    </span>
                    {selectedResource.category && (
                      <span className="text-xs bg-white/5 text-[#94A3B8] px-2 py-1">
                        {selectedResource.category}
                      </span>
                    )}
                    {selectedResource.difficulty && (
                      <span className="text-xs bg-white/5 text-[#94A3B8] px-2 py-1">
                        {selectedResource.difficulty}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-3xl font-bold mb-2">{selectedResource.title}</h1>
                  <p className="text-[#94A3B8]">{selectedResource.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-[#94A3B8] mb-2">
                    <Eye className="w-4 h-4" />
                    {selectedResource.usage_count || 0} views
                  </div>
                  <Button
                    onClick={() => handleDownload(selectedResource)}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {selectedResource.file_url ? 'Download' : 'View Content'}
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedResource.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/5 text-[#94A3B8] px-2 py-1 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content Preview */}
              {selectedResource.content && (
                <div className="border-t border-white/5 pt-6">
                  <h3 className="font-semibold mb-4">Content Preview</h3>
                  <div className="bg-white/5 rounded-sm p-6 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-[#94A3B8] whitespace-pre-wrap font-sans">
                      {selectedResource.content}
                    </pre>
                  </div>
                </div>
              )}

              {/* File URL */}
              {selectedResource.file_url && (
                <div className="border-t border-white/5 pt-6">
                  <h3 className="font-semibold mb-4">External Resource</h3>
                  <a
                    href={selectedResource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#D4AF37] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open external resource
                  </a>
                </div>
              )}
            </div>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold mb-4">You might also like</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedResources.map((resource, i) => {
                    const TypeIcon = getResourceTypeIcon(resource.resource_type);
                    return (
                      <motion.div
                        key={resource.resource_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="glass p-4 hover:border-[#D4AF37]/30 transition-colors cursor-pointer"
                        onClick={() => handleViewResource(resource)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center shrink-0">
                            <TypeIcon className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={cn("text-xs uppercase tracking-wider", getResourceTypeColor(resource.resource_type))}>
                              {resource.resource_type?.replace('_', ' ')}
                            </span>
                            <h4 className="font-medium truncate">{resource.title}</h4>
                            <p className="text-sm text-[#94A3B8] line-clamp-2">{resource.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto" data-testid="resources-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Knowledge Hub</h1>
          <p className="text-[#94A3B8]">Battle-tested scripts, frameworks, and tools used by top producers</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {resourceTypes.slice(1).map((type, i) => {
            const Icon = type.icon;
            const count = typeStats[type.value] || 0;
            return (
              <div key={type.value} className="glass p-4 text-center">
                <Icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-[#94A3B8]">{type.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
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

          {/* Filters */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4",
            !showFilters && "hidden lg:block"
          )}>
            {/* Type Filter */}
            <div>
              <label className="text-xs text-[#94A3B8] mb-1 block">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {resourceTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs text-[#94A3B8] mb-1 block">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
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
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => {
              const TypeIcon = getResourceTypeIcon(resource.resource_type);

              return (
                <motion.div
                  key={resource.resource_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="glass hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
                  onClick={() => handleViewResource(resource)}
                >
                  <div className="p-6">
                    {/* Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn("text-xs px-2 py-1", getResourceTypeColor(resource.resource_type))}>
                        {resource.resource_type?.replace('_', ' ') || 'Resource'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Eye className="w-3 h-3" />
                        {resource.usage_count || 0}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/10 transition-colors">
                      <TypeIcon className="w-6 h-6 text-[#D4AF37]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#94A3B8] mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-white/5 text-[#94A3B8] px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="text-xs text-[#94A3B8]">+{resource.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-3 border-t border-white/5">
                      <span>{resource.category || 'General'}</span>
                      <span className="flex items-center gap-1 group-hover:text-[#D4AF37]">
                        View <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-12 text-center">
            <FileText className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">No Resources Found</h3>
            <p className="text-[#94A3B8] mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more content.'
                : 'Resources will appear here once content is added.'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37]">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
