import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, PlayCircle, CheckCircle2, TrendingUp, Target,
  Award, Clock, ArrowRight, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API } from '@/App';
import axios from 'axios';

const TRAINING_CATEGORIES = {
  closing: { label: 'Closing', icon: '💰', color: '#10B981' },
  prospecting: { label: 'Prospecting', icon: '📞', color: '#3B82F6' },
  value_architecture: { label: 'Value Architecture', icon: '🎯', color: '#8B5CF6' },
  objection_handling: { label: 'Objection Handling', icon: '🛡️', color: '#F59E0B' },
  mindset: { label: 'Mindset', icon: '💪', color: '#EC4899' }
};

const SKILL_LEVELS = {
  beginner: { label: 'Beginner', color: '#EF4444', minProgress: 0 },
  intermediate: { label: 'Intermediate', color: '#F59E0B', minProgress: 25 },
  advanced: { label: 'Advanced', color: '#3B82F6', minProgress: 50 },
  expert: { label: 'Expert', color: '#10B981', minProgress: 75 }
};

export const TrainingIntegration = ({ onTrainingUpdate }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      // Fetch user's progress and get personalized recommendations
      const [progressResponse, tracksResponse] = await Promise.all([
        axios.get(`${API}/development/progress`, { withCredentials: true }),
        axios.get(`${API}/development/tracks`, { withCredentials: true })
      ]);

      if (progressResponse.data.success && tracksResponse.data.success) {
        const progress = progressResponse.data.data;
        const tracks = tracksResponse.data.data;

        // Generate recommendations based on user's progress
        const recs = generateRecommendations(progress, tracks);
        setRecommendations(recs);

        // Separate modules by completion status
        const inProgressModules = [];
        const completedModules = [];

        tracks.forEach(track => {
          track.modules.forEach(module => {
            const moduleProgress = progress.module_progress?.[module.content_id] || 0;
            const moduleData = {
              ...module,
              track_id: track.track_id,
              track_name: track.name,
              category: track.category,
              progress: moduleProgress,
              completed: moduleProgress >= 100
            };

            if (moduleProgress >= 100) {
              completedModules.push(moduleData);
            } else if (moduleProgress > 0) {
              inProgressModules.push(moduleData);
            }
          });
        });

        setInProgress(inProgressModules);
        setCompleted(completedModules);
      }
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (progress, tracks) => {
    const recommendations = [];

    // Get readiness score components
    const { video_completion, track_progress, quick_wins_applied, breakdowns_reviewed } = progress;

    // Recommend training based on weak areas
    if (video_completion < 50) {
      const module = findModuleByCategory(tracks, 'mindset');
      if (module) recommendations.push({
        ...module,
        reason: 'Low video completion - build foundation',
        priority: 'high',
        type: 'foundation'
      });
    }

    if (track_progress < 30) {
      const module = findModuleByCategory(tracks, 'prospecting');
      if (module) recommendations.push({
        ...module,
        reason: 'Increase track progress - start with prospecting',
        priority: 'high',
        type: 'momentum'
      });
    }

    if (breakdowns_reviewed < 5) {
      const module = findModuleByCategory(tracks, 'objection_handling');
      if (module) recommendations.push({
        ...module,
        reason: 'Review deal breakdowns to learn from real scenarios',
        priority: 'medium',
        type: 'application'
      });
    }

    // Always recommend next module in user's stage
    const nextModule = findNextModule(tracks, progress);
    if (nextModule) {
      recommendations.push({
        ...nextModule,
        reason: 'Continue your journey - next module in your path',
        priority: 'high',
        type: 'progression'
      });
    }

    return recommendations.slice(0, 5);
  };

  const findModuleByCategory = (tracks, category) => {
    for (const track of tracks) {
      if (track.category === category) {
        return track.modules.find(m => !m.completed) || track.modules[0];
      }
    }
    return null;
  };

  const findNextModule = (tracks, progress) => {
    // Find first incomplete module across all tracks
    for (const track of tracks) {
      const incompleteModule = track.modules.find(m => {
        const moduleProgress = progress.module_progress?.[m.content_id] || 0;
        return moduleProgress < 100;
      });
      if (incompleteModule) {
        return {
          ...incompleteModule,
          track_name: track.name,
          category: track.category
        };
      }
    }
    return null;
  };

  const getSkillLevel = (progress) => {
    for (const [level, data] of Object.entries(SKILL_LEVELS)) {
      if (progress >= data.minProgress) {
        return { level, ...data };
      }
    }
    return SKILL_LEVELS.beginner;
  };

  const filterModules = (modules) => {
    return modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            Training Integration
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Personalized training recommendations based on your performance
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">In Progress</p>
                <p className="text-2xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
                  {inProgress.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Completed</p>
                <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
                  {completed.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Recommended</p>
                <p className="text-2xl font-bold text-[#F59E0B] font-['JetBrains_Mono']">
                  {recommendations.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Skill Level</p>
                <p className="text-lg font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                  {inProgress.length > 0 ? getSkillLevel(inProgress[0].progress).label : 'Beginner'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="recommended" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Target className="w-4 h-4 mr-2" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <PlayCircle className="w-4 h-4 mr-2" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Recommended Tab */}
        <TabsContent value="recommended" className="mt-6">
          {recommendations.length === 0 ? (
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">All Caught Up!</h3>
                <p className="text-[#94A3B8]">You're making great progress. Keep it up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((module, index) => {
                const category = TRAINING_CATEGORIES[module.category];
                const priorityColors = {
                  high: '#EF4444',
                  medium: '#F59E0B',
                  low: '#10B981'
                };

                return (
                  <motion.div
                    key={module.content_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <PlayCircle className="w-8 h-8 text-[#D4AF37]" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`bg-[${category?.color}] text-white text-xs`}>
                                      {category?.label}
                                    </Badge>
                                    <Badge className="bg-[#D4AF37] text-black text-xs">
                                      Recommended
                                    </Badge>
                                  </div>
                                  <h4 className="text-lg font-bold text-[#F8FAFC] mb-1">
                                    {module.title}
                                  </h4>
                                  <p className="text-sm text-[#94A3B8] mb-3">
                                    {module.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Badge className={`bg-[${priorityColors[module.priority]}] text-white`}>
                                      {module.priority} priority
                                    </Badge>
                                    <span className="text-[#94A3B8]">
                                      {module.reason}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => window.location.href = `/path/track/${module.track_id}`}
                            className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
                          >
                            Start Module
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="in_progress" className="mt-6">
          {inProgress.length === 0 ? (
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-12 text-center">
                <PlayCircle className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Modules In Progress</h3>
                <p className="text-[#94A3B8]">Start a recommended module to track your progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterModules(inProgress).map((module) => {
                const category = TRAINING_CATEGORIES[module.category];
                const skillLevel = getSkillLevel(module.progress);

                return (
                  <Card key={module.content_id} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-[${category?.color}]/20`}>
                            <span className="text-2xl">{category?.icon}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#F8FAFC]">{module.title}</h4>
                            <p className="text-sm text-[#94A3B8]">{module.track_name}</p>
                          </div>
                        </div>
                        <Badge className={`bg-[${skillLevel.color}] text-white`}>
                          {skillLevel.label}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-[#94A3B8]">Progress</p>
                          <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                            {module.progress.toFixed(0)}%
                          </p>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-white/10" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration || '10 min'}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => window.location.href = `/path/track/${module.track_id}`}
                          className="bg-[#D4AF37] text-black font-bold hover:bg-[#B4942D]"
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <Card className="bg-white/5 border border-white/10">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Completed Modules Yet</h3>
                <p className="text-[#94A3B8]">Complete your first module to see it here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completed.map((module) => {
                const category = TRAINING_CATEGORIES[module.category];

                return (
                  <Card key={module.content_id} className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#10B981]">{module.title}</h4>
                            <p className="text-sm text-[#94A3B8]">{module.track_name}</p>
                          </div>
                        </div>
                        <Badge className="bg-[#10B981] text-white">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
