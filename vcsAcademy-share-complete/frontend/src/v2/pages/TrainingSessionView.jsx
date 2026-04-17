/**
 * VCSA V2 - Training Session View Page
 * Video player with resources and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { AchievementChip, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const TrainingSessionView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [session, setSession] = useState({
    id: 1,
    title: 'Session 1: Mindset Mastery',
    track: 'Pro Mindset',
    trackId: 'pro-mindset',
    description: 'Cognitive reframing techniques for high-stakes negotiation and rejection resilience. Learn how elite performers think differently and apply those mental models to your sales process.',
    duration: '45:00',
    currentProgress: 82,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructor: {
      name: 'Tony Martinez',
      title: 'VP of Sales, Elite Resorts',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    keyTakeaway: 'Reframe rejection as redirection - every "no" moves you closer to your ideal client.',
    resources: [
      {
        id: 1,
        title: 'Mindset Workbook PDF',
        type: 'pdf',
        size: '2.4 MB',
        pages: 12
      },
      {
        id: 2,
        title: 'Daily Affirmations Audio',
        type: 'audio',
        size: '8.1 MB',
        duration: '5:30'
      },
      {
        id: 3,
        title: 'Reframing Worksheet',
        type: 'template',
        size: '156 KB'
      }
    ],
    relatedSessions: [
      { id: 2, title: 'Session 2: Emotional Intelligence', trackId: 'pro-mindset' },
      { id: 3, title: 'Session 3: Resilience Building', trackId: 'pro-mindset' }
    ]
  });

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await axios.get(`${API}/api/dashboard/training/session/${sessionId}`, {
        withCredentials: true
      });

      if (response.data) {
        setSession(prevData => ({
          ...prevData,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch session data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.post(`${API}/api/dashboard/training/session/${sessionId}/complete`, {}, {
        withCredentials: true
      });
      setCompleted(true);
    } catch (error) {
      console.error('Failed to mark session as complete:', error);
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
      <TopAppBar title="Training Session" subtitle={session.track} />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#d0c5af] mb-8">
          <Link to="/v2/training" className="hover:text-[#f2ca50] transition-colors">
            Training Library
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to={`/v2/training/track/${session.trackId}`} className="hover:text-[#f2ca50] transition-colors">
            {session.track}
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#e5e1e8]">{session.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="aspect-video bg-[#1b1b20] rounded-xl overflow-hidden border border-[#4d4635]/10 shadow-[0_20px_40px_-15px_rgba(242,202,80,0.06)]">
              <iframe
                className="w-full h-full"
                src={session.videoUrl}
                title={session.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Session Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#e5e1e8] font-headline mb-4">
                {session.title}
              </h1>

              <p className="text-[#d0c5af] text-lg leading-relaxed mb-6">
                {session.description}
              </p>

              {/* Key Takeaway */}
              <GlassCard variant="default" padding="lg" className="bg-[#f2ca50]/5 border-[#f2ca50]/20">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#f2ca50] text-3xl filled">
                    lightbulb
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#f2ca50] uppercase tracking-wider mb-2">
                      Key Takeaway
                    </h3>
                    <p className="text-[#e5e1e8] text-base">
                      {session.keyTakeaway}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Instructor */}
              <div className="flex items-center gap-4 mt-8 p-6 bg-[#1b1b20] rounded-xl border border-[#4d4635]/10">
                <img
                  src={session.instructor.image}
                  alt={session.instructor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#f2ca50]"
                />
                <div>
                  <h4 className="text-lg font-bold text-[#e5e1e8] font-headline">
                    {session.instructor.name}
                  </h4>
                  <p className="text-sm text-[#d0c5af]">{session.instructor.title}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {!completed ? (
                  <button
                    onClick={handleComplete}
                    className="achievement-gradient text-[#3c2f00] font-bold py-4 px-10 rounded-lg shadow-[0_10px_20px_-5px_rgba(242,202,80,0.3)] hover:scale-[1.02] transition-transform duration-300"
                  >
                    Mark as Complete
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                    <span className="material-symbols-outlined filled">check_circle</span>
                    Completed!
                  </div>
                )}

                <Link
                  to={`/v2/training/track/${session.trackId}`}
                  className="inline-flex items-center gap-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors font-medium py-4 px-6"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Track
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Progress Card */}
            <GlassCard variant="default" padding="lg">
              <h3 className="text-sm font-bold text-[#d0c5af] uppercase tracking-wider mb-4">
                Your Progress
              </h3>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#f2ca50] font-headline mb-2">
                  {session.currentProgress}%
                </div>
                <p className="text-sm text-[#d0c5af]">Complete</p>
              </div>

              <div className="w-full bg-[#353439] h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="achievement-gradient h-full transition-all duration-1000"
                  style={{ width: `${session.currentProgress}%` }}
                />
              </div>

              <div className="text-center text-sm text-[#d0c5af]">
                Duration: {session.duration}
              </div>
            </GlassCard>

            {/* Resources */}
            <GlassCard variant="default" padding="lg">
              <h3 className="text-sm font-bold text-[#d0c5af] uppercase tracking-wider mb-4">
                Session Resources
              </h3>

              <div className="space-y-3">
                {session.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href="#"
                    className="flex items-start gap-3 p-3 bg-[#131317] rounded-lg border border-[#4d4635]/10 hover:border-[#f2ca50]/30 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[#f2ca50] text-xl">
                      {resource.type === 'pdf' ? 'picture_as_pdf' :
                       resource.type === 'audio' ? 'audio_file' : 'description'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-[#d0c5af] mt-1">
                        {resource.size}
                        {resource.pages && ` • ${resource.pages} pages`}
                        {resource.duration && ` • ${resource.duration}`}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#d0c5af] group-hover:text-[#f2ca50] transition-colors">
                      download
                    </span>
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Related Sessions */}
            <GlassCard variant="default" padding="lg">
              <h3 className="text-sm font-bold text-[#d0c5af] uppercase tracking-wider mb-4">
                Up Next
              </h3>

              <div className="space-y-3">
                {session.relatedSessions.map((related) => (
                  <Link
                    key={related.id}
                    to={`/v2/training/session/${related.id}`}
                    className="block p-3 bg-[#131317] rounded-lg border border-[#4d4635]/10 hover:border-[#f2ca50]/30 transition-colors group"
                  >
                    <h4 className="text-sm font-semibold text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors mb-1">
                      {related.title}
                    </h4>
                    <p className="text-xs text-[#d0c5af]">Continue your journey</p>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingSessionView;
