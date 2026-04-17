/**
 * VCSA V2 - Resources Library Page
 * PDFs, templates, checklists for download
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { AchievementChip, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const ResourcesLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Objection Handling Playbook 2024',
      type: 'pdf',
      category: 'Scripts',
      size: '4.2 MB',
      pages: 45,
      downloads: 1234,
      description: 'Comprehensive guide to handling every objection with confidence.',
      thumbnail: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=400'
    },
    {
      id: 2,
      title: 'Tour Presentation Template',
      type: 'template',
      category: 'Presentations',
      size: '2.8 MB',
      downloads: 892,
      description: 'Professional presentation template for property tours.',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    },
    {
      id: 3,
      title: 'Daily Prospecting Checklist',
      type: 'checklist',
      category: 'Productivity',
      size: '156 KB',
      downloads: 2341,
      description: 'Daily checklist to maximize your prospecting efficiency.',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
    },
    {
      id: 4,
      title: 'Closing Techniques E-book',
      type: 'ebook',
      category: 'Sales Training',
      size: '8.5 MB',
      pages: 120,
      downloads: 3421,
      description: 'Advanced closing techniques from top performers.',
      thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
    },
    {
      id: 5,
      title: 'Follow-Up Email Sequences',
      type: 'template',
      category: 'Communication',
      size: '1.2 MB',
      downloads: 1567,
      description: 'Proven email sequences for effective follow-ups.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
    },
    {
      id: 6,
      title: 'Goal Setting Worksheet',
      type: 'worksheet',
      category: 'Planning',
      size: '890 KB',
      downloads: 2876,
      description: 'Structured worksheet for setting and tracking your goals.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
    },
    {
      id: 7,
      title: 'Value Proposition Builder',
      type: 'tool',
      category: 'Strategy',
      size: '450 KB',
      downloads: 1123,
      description: 'Interactive tool to craft compelling value propositions.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    },
    {
      id: 8,
      title: 'Time Management for Sales Pros',
      type: 'pdf',
      category: 'Productivity',
      size: '3.1 MB',
      pages: 38,
      downloads: 1987,
      description: 'Master your time and maximize productivity.',
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'
    }
  ]);

  const [stats] = useState({
    totalResources: 8,
    totalDownloads: 15441,
    categories: 6
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API}/api/resources`, {
        withCredentials: true
      });

      if (response.data) {
        setResources(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (resourceId) => {
    console.log('Downloading resource:', resourceId);
    // Implement download logic
  };

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === 'all' || resource.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['all', ...new Set(resources.map(r => r.category))];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return 'picture_as_pdf';
      case 'template': return 'description';
      case 'checklist': return 'checklist';
      case 'ebook': return 'menu_book';
      case 'worksheet': return 'edit_note';
      case 'tool': return 'build';
      default: return 'insert_drive_file';
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case 'pdf': return 'secondary';
      case 'template': return 'success';
      case 'checklist': return 'warning';
      case 'ebook': return 'default';
      default: return 'secondary';
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
      <TopAppBar title="The Vault" subtitle="Resources Library" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#e5e1e8] font-headline leading-tight mb-4">
            Resource <span className="text-[#f2ca50]">Library</span>
          </h1>
          <p className="text-[#d0c5af] text-lg max-w-2xl">
            Download templates, playbooks, and tools to accelerate your sales performance.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#f2ca50] text-3xl mb-3">folder_open</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.totalResources}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Resources</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#9db2ff] text-3xl mb-3">download</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.totalDownloads.toLocaleString()}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Total Downloads</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#c3cee6] text-3xl mb-3">category</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.categories}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Categories</div>
          </GlassCard>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-[#d0c5af]">
            search
          </span>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b20] border border-[#4d4635]/10 rounded-xl py-4 pl-12 pr-4 text-[#e5e1e8] placeholder-[#d0c5af] focus:outline-none focus:border-[#f2ca50]/50 focus:ring-2 focus:ring-[#f2ca50]/20 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all ${
                filter === category
                  ? 'achievement-gradient text-[#3c2f00]'
                  : 'bg-[#1b1b20] text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <GlassCard
              key={resource.id}
              variant="default"
              padding="none"
              className="overflow-hidden hover-lift group"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b20] via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <AchievementChip
                    label={resource.type}
                    variant={getTypeVariant(resource.type)}
                    size="sm"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#f2ca50] text-lg">
                    {getTypeIcon(resource.type)}
                  </span>
                  <span className="text-xs text-[#d0c5af] uppercase tracking-wider">
                    {resource.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-2">
                  {resource.title}
                </h3>

                <p className="text-sm text-[#d0c5af] mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-xs text-[#d0c5af] mb-4">
                  <span>{resource.size}</span>
                  {resource.pages && <span>{resource.pages} pages</span>}
                  <span>{resource.downloads.toLocaleString()} downloads</span>
                </div>

                <button
                  onClick={() => handleDownload(resource.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#f2ca50] text-[#3c2f00] font-bold py-3 px-4 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ResourcesLibrary;
