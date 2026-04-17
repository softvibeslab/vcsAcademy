/**
 * VCSA V2 - Training Library Page
 * Following design from docs/design/training_library/code.html
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { AchievementChip, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const TrainingLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    pathCompletion: 64,
    modulesCompleted: 12,
    totalTrainingTime: '48.5h',
    activeSession: {
      id: 1,
      title: 'Session 1: Mindset Mastery',
      description: 'Cognitive reframing techniques for high-stakes negotiation and rejection resilience.',
      progress: 82,
      duration: '12m remaining',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      track: 'Pro Mindset'
    },
    tracks: [
      {
        id: 'pro-mindset',
        title: 'Pro Mindset',
        modules: 6,
        completed: 4,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
        category: 'Mindset'
      },
      {
        id: 'discovery',
        title: 'Discovery & Control',
        modules: 6,
        completed: 3,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
        category: 'Sales Process'
      },
      {
        id: 'value',
        title: 'Value Architecture',
        modules: 6,
        completed: 2,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        category: 'Presentation'
      },
      {
        id: 'decision',
        title: 'Decision Management',
        modules: 6,
        completed: 1,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
        category: 'Closing'
      },
      {
        id: 'objections',
        title: 'Objection Mastery',
        modules: 6,
        completed: 1,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
        category: 'Objections'
      },
      {
        id: 'post-sale',
        title: 'Post-Sale Integrity',
        modules: 6,
        completed: 1,
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
        category: 'Follow-up'
      }
    ],
    advancedClosing: [
      {
        id: 1,
        title: 'The Perfect Pitch',
        duration: '45:00',
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
      },
      {
        id: 2,
        title: 'Value-Based Negotiation',
        duration: '38:00',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400'
      },
      {
        id: 3,
        title: 'Closing Psychology',
        duration: '52:00',
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
      }
    ]
  });

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const response = await axios.get(`${API}/api/development/tracks`, {
        withCredentials: true
      });

      const progressResponse = await axios.get(`${API}/api/development/progress`, {
        withCredentials: true
      });

      setData(prevData => ({
        ...prevData,
        pathCompletion: progressResponse.data.readinessScore || prevData.pathCompletion,
        modulesCompleted: progressResponse.data.completedModules || prevData.modulesCompleted
      }));
    } catch (error) {
      console.error('Failed to fetch training data:', error);
    } finally {
      setLoading(false);
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
      <TopAppBar title="The Vault" subtitle="Training Library" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[#f2ca50] font-medium tracking-[0.2em] text-xs uppercase mb-4 block">
                Academy Performance
              </span>
              <h2 className="text-[#e5e1e8] text-5xl md:text-7xl font-bold font-headline leading-tight mb-4">
                Top Producer <span className="text-[#f2ca50]">Path</span>
              </h2>
              <p className="text-[#d0c5af] text-lg max-w-xl font-light">
                Your journey to the 1% begins here. Master the elite psychological frameworks and tactical execution used by the industry's highest earners.
              </p>
            </div>

            <GlassCard variant="default" padding="lg" className="min-w-[280px]">
              <div className="text-[#f2ca50] text-5xl font-bold font-headline mb-2">
                {data.pathCompletion}%
              </div>
              <div className="text-[#d0c5af] text-sm uppercase tracking-widest font-medium mb-4">
                Path Completion
              </div>
              <div className="w-full bg-[#353439] h-1 rounded-full overflow-hidden">
                <div
                  className="achievement-gradient h-full transition-all duration-1000"
                  style={{ width: `${data.pathCompletion}%` }}
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Bento Grid: Active Session + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Active Session Card */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-[#1b1b20] border border-[#4d4635]/10 p-8 flex flex-col justify-between min-h-[400px]">
            <div className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110">
              <img
                src={data.activeSession.image}
                alt={data.activeSession.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b20] via-[#1b1b20]/80 to-transparent" />
            </div>

            <div className="relative z-10">
              <AchievementChip
                label="In Progress"
                icon="play_circle"
                variant="secondary"
                className="mb-6"
              />
              <h3 className="text-3xl font-bold text-[#e5e1e8] font-headline mb-2">
                {data.activeSession.title}
              </h3>
              <p className="text-[#d0c5af] max-w-md">
                {data.activeSession.description}
              </p>
            </div>

            <div className="relative z-10 pt-12">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#d0c5af] font-medium">Progress: {data.activeSession.progress}%</span>
                <span className="text-[#f2ca50] font-bold">{data.activeSession.duration}</span>
              </div>
              <div className="w-full bg-[#353439]/50 h-2 rounded-full overflow-hidden mb-8">
                <div
                  className="achievement-gradient h-full"
                  style={{ width: `${data.activeSession.progress}%` }}
                />
              </div>
              <Link
                to={`/v2/training/session/${data.activeSession.id}`}
                className="inline-block achievement-gradient text-[#3c2f00] font-bold py-4 px-10 rounded-lg shadow-[0_10px_20px_-5px_rgba(242,202,80,0.3)] hover:scale-[1.02] transition-transform duration-300"
              >
                Resume Session
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <GlassCard variant="default" padding="lg" className="flex-1">
              <span className="material-symbols-outlined text-[#f2ca50] text-4xl mb-4 filled">
                workspace_premium
              </span>
              <div className="text-4xl font-bold font-headline text-[#e5e1e8] mb-1">
                {data.modulesCompleted}
              </div>
              <div className="text-[#d0c5af] text-xs uppercase tracking-widest">
                Modules Completed
              </div>
            </GlassCard>

            <GlassCard variant="default" padding="lg" className="flex-1">
              <span className="material-symbols-outlined text-[#f2ca50] text-4xl mb-4">
                timer
              </span>
              <div className="text-4xl font-bold font-headline text-[#e5e1e8] mb-1">
                {data.totalTrainingTime}
              </div>
              <div className="text-[#d0c5af] text-xs uppercase tracking-widest">
                Total Training Time
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Advanced Closing Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 achievement-gradient rounded-full"></div>
              <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">
                Advanced Closing
              </h2>
            </div>
            <button className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors text-sm font-medium flex items-center gap-2">
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.advancedClosing.map((session) => (
              <div
                key={session.id}
                className="group bg-[#1b1b20] rounded-xl border border-[#4d4635]/5 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover-lift"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 right-4 bg-[#131317]/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-[#e5e1e8]">
                    {session.duration}
                  </div>
                </div>

                <div className="p-6">
                  <AchievementChip
                    label={session.level}
                    variant="secondary"
                    size="sm"
                    className="mb-3"
                  />
                  <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-2">
                    {session.title}
                  </h3>
                  <Link
                    to={`/v2/training/session/${session.id}`}
                    className="inline-flex items-center gap-2 text-[#f2ca50] text-sm font-medium mt-4 hover:gap-3 transition-all"
                  >
                    Start Session
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Tracks Grid */}
        <section>
          <h2 className="text-2xl font-bold font-headline tracking-tight uppercase mb-10">
            All Training Tracks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.tracks.map((track) => (
              <Link
                key={track.id}
                to={`/v2/training/track/${track.id}`}
                className="group"
              >
                <GlassCard
                  variant="default"
                  padding="none"
                  className="overflow-hidden hover-lift h-full"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b20] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <AchievementChip
                        label={track.category}
                        variant="secondary"
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-2">
                      {track.title}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-[#d0c5af]">
                        <span className="font-semibold text-[#e5e1e8]">{track.completed}</span>
                        / {track.modules} modules
                      </div>

                      <div className="w-24 bg-[#353439] h-1 rounded-full overflow-hidden">
                        <div
                          className="achievement-gradient h-full"
                          style={{ width: `${(track.completed / track.modules) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrainingLibrary;
