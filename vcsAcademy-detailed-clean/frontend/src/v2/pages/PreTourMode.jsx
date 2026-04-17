/**
 * VCSA V2 - Pre-Tour Mode Page
 * Quick tactics and checklists before tours
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { AchievementChip, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const PreTourMode = () => {
  const [loading, setLoading] = useState(true);
  const [activeChecklist, setActiveChecklist] = useState(null);

  const [tactics] = useState([
    {
      id: 1,
      title: 'The 3-Question Discovery',
      category: 'Discovery',
      duration: '2 min',
      content: 'Ask: 1) What brought you here today? 2) What do you know about vacation ownership? 3) What would make this perfect for you?'
    },
    {
      id: 2,
      title: 'Urgency Builder',
      category: 'Closing',
      duration: '1 min',
      content: 'Highlight limited-time incentives and seasonal pricing advantages.'
    },
    {
      id: 3,
      title: 'Value Stack',
      category: 'Presentation',
      duration: '3 min',
      content: 'Stack benefits: ownership cost vs. vacation spending over 10 years.'
    },
    {
      id: 4,
      title: 'Objection Preview',
      category: 'Objections',
      duration: '2 min',
      content: 'Address "need to think about it" before it comes up: "I understand this is a big decision..."'
    }
  ]);

  const [checklists] = useState([
    {
      id: 1,
      title: 'Before Arrival',
      items: [
        { id: 1, text: 'Review guest profile and preferences', checked: false },
        { id: 2, text: 'Prepare personalized tour route', checked: false },
        { id: 3, text: 'Check current promotions', checked: false },
        { id: 4, text: 'Set up presentation materials', checked: false }
      ]
    },
    {
      id: 2,
      title: 'Tour Preparation',
      items: [
        { id: 1, text: 'Greet with warm welcome', checked: false },
        { id: 2, text: 'Build rapport first 2 minutes', checked: false },
        { id: 3, text: 'Confirm their vacation dreams', checked: false },
        { id: 4, text: 'Set expectations for tour', checked: false }
      ]
    },
    {
      id: 3,
      title: 'Presentation Ready',
      items: [
        { id: 1, text: 'Know your inventory availability', checked: false },
        { id: 2, text: 'Have financing options ready', checked: false },
        { id: 3, text: 'Prepare for common objections', checked: false },
        { id: 4, text: 'Set closing environment', checked: false }
      ]
    }
  ]);

  const [timer, setTimer] = useState({ minutes: 5, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            setIsRunning(false);
            return;
          }
          setTimer(prev => ({ ...prev, minutes: prev.minutes - 1, seconds: 59 }));
        } else {
          setTimer(prev => ({ ...prev, seconds: prev.seconds - 1 }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    fetchPreTourData();
  }, []);

  const fetchPreTourData = async () => {
    try {
      const response = await axios.get(`${API}/api/pre-tour/tactics`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Failed to fetch pre-tour data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (checklistId, itemId) => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return checklist;
    }));
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
      <TopAppBar title="Pre-Tour Mode" subtitle="Quick Tactics & Checklists" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#e5e1e8] font-headline leading-tight mb-4">
            Pre-Tour <span className="text-[#f2ca50]">Mode</span>
          </h1>
          <p className="text-[#d0c5af] text-lg max-w-2xl mx-auto">
            Quick tactics and checklists to maximize your tour success
          </p>
        </section>

        {/* Timer */}
        <GlassCard variant="default" padding="xl" className="mb-12 max-w-md mx-auto text-center">
          <h3 className="text-sm font-bold text-[#d0c5af] uppercase tracking-wider mb-4">
            Time Before Tour
          </h3>
          <div className="text-6xl font-bold text-[#f2ca50] font-headline mb-6">
            {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                isRunning
                  ? 'bg-[#ffb4ab] text-[#690005]'
                  : 'achievement-gradient text-[#3c2f00]'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => setTimer({ minutes: 5, seconds: 0 })}
              className="px-6 py-3 rounded-lg font-bold bg-[#1b1b20] text-[#e5e1e8] border border-[#4d4635]/10"
            >
              Reset
            </button>
          </div>
        </GlassCard>

        {/* Quick Tactics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
            Quick Tactics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tactics.map((tactic) => (
              <GlassCard
                key={tactic.id}
                variant="default"
                padding="lg"
                className="hover-lift cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <AchievementChip
                      label={tactic.category}
                      variant="secondary"
                      size="sm"
                      className="mb-2"
                    />
                    <h3 className="text-xl font-bold text-[#e5e1e8] font-headline mb-1">
                      {tactic.title}
                    </h3>
                    <p className="text-sm text-[#d0c5af]">{tactic.duration} to apply</p>
                  </div>
                </div>

                <p className="text-[#e5e1e8] text-sm leading-relaxed mb-4">
                  {tactic.content}
                </p>

                <button className="text-[#f2ca50] text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  View Full Script
                </button>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Checklists */}
        <section>
          <h2 className="text-2xl font-bold text-[#e5e1e8] font-headline mb-8">
            Pre-Tour Checklists
          </h2>

          <div className="space-y-6">
            {checklists.map((checklist) => (
              <GlassCard
                key={checklist.id}
                variant="default"
                padding="lg"
              >
                <button
                  onClick={() => setActiveChecklist(activeChecklist === checklist.id ? null : checklist.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
                      {activeChecklist === checklist.id ? 'expand_less' : 'expand_more'}
                    </span>
                    <h3 className="text-xl font-bold text-[#e5e1e8] font-headline">
                      {checklist.title}
                    </h3>
                  </div>
                  <AchievementChip
                    label={`${checklist.items.filter(i => i.checked).length}/${checklist.items.length}`}
                    variant="secondary"
                    size="sm"
                  />
                </button>

                {activeChecklist === checklist.id && (
                  <div className="mt-6 space-y-3">
                    {checklist.items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-[#131317] rounded-lg cursor-pointer hover:bg-[#1b1b20] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleChecklistItem(checklist.id, item.id)}
                          className="mt-1 w-5 h-5 rounded border-[#4d4635]/30 bg-[#1b1b20] text-[#f2ca50] focus:ring-[#f2ca50] focus:ring-offset-0"
                        />
                        <span className={`text-sm ${item.checked ? 'text-[#d0c5af] line-through' : 'text-[#e5e1e8]'}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PreTourMode;
