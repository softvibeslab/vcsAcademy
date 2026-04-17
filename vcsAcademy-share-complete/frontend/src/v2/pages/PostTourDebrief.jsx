/**
 * VCSA V2 - Post-Tour Debrief Page
 * Reflection forms and performance analytics
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const PostTourDebrief = () => {
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [debrief, setDebrief] = useState({
    tourId: '',
    date: new Date().toISOString().split('T')[0],
    outcome: '',
    duration: '',
    prospects: {
      names: '',
      count: 1,
      source: '',
      budget: '',
      timeline: ''
    },
    performance: {
      rapport: 3,
      discovery: 3,
      presentation: 3,
      closing: 3
    },
    objections: [],
    strengths: '',
    improvements: '',
    nextSteps: '',
    likelihood: 3,
    notes: ''
  });

  const [recentTours] = useState([
    { id: 1, date: 'Today', outcome: 'Closed', prospects: 'John & Mary Smith', amount: 12000 },
    { id: 2, date: 'Yesterday', outcome: 'Follow-up', prospects: 'Robert Johnson', amount: null },
    { id: 3, date: '2 days ago', outcome: 'No Sale', prospects: 'Susan Williams', amount: null }
  ]);

  useEffect(() => {
    fetchDebriefData();
  }, []);

  const fetchDebriefData = async () => {
    try {
      const response = await axios.get(`${API}/api/debrief/recent`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Failed to fetch debrief data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/debrief/submit`, debrief, {
        withCredentials: true
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit debrief:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setDebrief(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setDebrief(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131317] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32 flex items-center justify-center">
        <GlassCard variant="default" padding="xl" className="max-w-md text-center">
          <span className="material-symbols-outlined text-[#f2ca50] text-6xl mb-4 filled">
            check_circle
          </span>
          <h2 className="text-3xl font-bold text-[#e5e1e8] font-headline mb-4">
            Debrief Submitted!
          </h2>
          <p className="text-[#d0c5af] mb-8">
            Your tour debrief has been recorded. Keep up the great work!
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setDebrief({
                ...debrief,
                tourId: '',
                date: new Date().toISOString().split('T')[0],
                outcome: '',
                notes: ''
              });
            }}
            className="achievement-gradient text-[#3c2f00] font-bold py-4 px-10 rounded-lg"
          >
            Submit Another
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32">
      <TopAppBar title="Post-Tour Debrief" subtitle="Reflect & Improve" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Recent Tours */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-6">
            Recent Tours
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTours.map((tour) => (
              <GlassCard
                key={tour.id}
                variant="default"
                padding="lg"
                className="hover-lift cursor-pointer"
                onClick={() => setDebrief(prev => ({
                  ...prev,
                  tourId: tour.id.toString(),
                  prospects: { ...prev.prospects, names: tour.prospects, count: 1 }
                }))}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#d0c5af]">{tour.date}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    tour.outcome === 'Closed' ? 'bg-[#f2ca50]/20 text-[#f2ca50]' :
                    tour.outcome === 'Follow-up' ? 'bg-[#9db2ff]/20 text-[#9db2ff]' :
                    'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {tour.outcome}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#e5e1e8] mb-1">{tour.prospects}</h3>
                {tour.amount && (
                  <p className="text-sm text-[#f2ca50] font-bold">${tour.amount.toLocaleString()}</p>
                )}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Debrief Form */}
        <section>
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
            Tour Debrief
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Tour Details */}
                <GlassCard variant="default" padding="lg">
                  <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6">
                    Tour Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={debrief.date}
                        onChange={(e) => handleInputChange(null, 'date', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Outcome
                      </label>
                      <select
                        value={debrief.outcome}
                        onChange={(e) => handleInputChange(null, 'outcome', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                        required
                      >
                        <option value="">Select outcome</option>
                        <option value="closed">Closed</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="no-sale">No Sale</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="90 minutes"
                        value={debrief.duration}
                        onChange={(e) => handleInputChange(null, 'duration', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Performance Ratings */}
                <GlassCard variant="default" padding="lg">
                  <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6">
                    Performance Ratings
                  </h3>

                  <div className="space-y-6">
                    {[
                      { key: 'rapport', label: 'Rapport Building' },
                      { key: 'discovery', label: 'Discovery' },
                      { key: 'presentation', label: 'Presentation' },
                      { key: 'closing', label: 'Closing Attempt' }
                    ].map((item) => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-[#d0c5af] mb-2">
                          {item.label}
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleInputChange('performance', item.key, value)}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                debrief.performance[item.key] >= value
                                  ? 'bg-[#f2ca50] text-[#3c2f00]'
                                  : 'bg-[#1b1b20] text-[#d0c5af]'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Prospect Info */}
                <GlassCard variant="default" padding="lg">
                  <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6">
                    Prospect Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Names
                      </label>
                      <input
                        type="text"
                        value={debrief.prospects.names}
                        onChange={(e) => handleInputChange('prospects', 'names', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                          Budget Range
                        </label>
                        <input
                          type="text"
                          placeholder="$10K-$25K"
                          value={debrief.prospects.budget}
                          onChange={(e) => handleInputChange('prospects', 'budget', e.target.value)}
                          className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                          Timeline
                        </label>
                        <input
                          type="text"
                          placeholder="3-6 months"
                          value={debrief.prospects.timeline}
                          onChange={(e) => handleInputChange('prospects', 'timeline', e.target.value)}
                          className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Likelihood to Close
                      </label>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((value, index) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleInputChange('prospects', 'likelihood', index + 1)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                              debrief.prospects.likelihood === index + 1
                                ? 'bg-[#9db2ff] text-[#05297a]'
                                : 'bg-[#1b1b20] text-[#d0c5af]'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Reflection */}
                <GlassCard variant="default" padding="lg">
                  <h3 className="text-lg font-bold text-[#e5e1e8] font-headline mb-6">
                    Reflection
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        What went well?
                      </label>
                      <textarea
                        rows={3}
                        value={debrief.strengths}
                        onChange={(e) => handleInputChange(null, 'strengths', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50 resize-none"
                        placeholder="Key strengths and wins..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        What could be improved?
                      </label>
                      <textarea
                        rows={3}
                        value={debrief.improvements}
                        onChange={(e) => handleInputChange(null, 'improvements', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50 resize-none"
                        placeholder="Areas for growth..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d0c5af] uppercase tracking-wider mb-2">
                        Next Steps
                      </label>
                      <textarea
                        rows={2}
                        value={debrief.nextSteps}
                        onChange={(e) => handleInputChange(null, 'nextSteps', e.target.value)}
                        className="w-full bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] focus:outline-none focus:border-[#f2ca50]/50 resize-none"
                        placeholder="Follow-up actions..."
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="achievement-gradient text-[#3c2f00] font-bold py-4 px-12 rounded-lg shadow-[0_10px_20px_-5px_rgba(242,202,80,0.3)] hover:scale-[1.02] transition-transform"
              >
                Submit Debrief
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default PostTourDebrief;
