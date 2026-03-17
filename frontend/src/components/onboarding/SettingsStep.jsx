/**
 * Step 3: Settings Configuration
 *
 * Configure platform features:
 * - Gamification options
 * - Community features
 * - Events
 * - Badges & streaks
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Award, Flame, Sparkles } from 'lucide-react';

const FEATURE_GROUPS = [
  {
    id: 'gamification',
    title: 'Gamification',
    description: 'Engage your team with points, badges, and rewards',
    icon: Trophy,
    features: [
      { key: 'enableGamification', label: 'Points System', description: 'Award points for completing training' },
      { key: 'enableBadges', label: 'Achievement Badges', description: 'Unlock badges as users progress' },
      { key: 'enableStreaks', label: 'Training Streaks', description: 'Track consecutive days of activity' },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Connect your team through collaboration',
    icon: Users,
    features: [
      { key: 'enableCommunity', label: 'Community Feed', description: 'Posts, comments, and discussions' },
      { key: 'enableEvents', label: 'Events Calendar', description: 'Schedule training sessions and events' },
    ],
  },
];

export default function SettingsStep({ formData, updateFormData, onNext, onBack }) {
  const toggleFeature = (featureKey) => {
    updateFormData({ [featureKey]: !formData[featureKey] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold">Configure Your Features</h2>
        <p className="text-muted-foreground">
          Choose which features to enable for your academy
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {FEATURE_GROUPS.map((group) => {
          const GroupIcon = group.icon;

          return (
            <div
              key={group.id}
              className="p-6 rounded-xl border border-border/50 bg-background/50"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <GroupIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{group.title}</h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {group.features.map((feature) => {
                  const isEnabled = formData[feature.key];

                  return (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{feature.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {feature.description}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFeature(feature.key)}
                        className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isEnabled ? 'bg-primary' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                            isEnabled ? 'translate-x-12' : 'translate-x-1'
                          }`}
                        />
                        <span
                          className={`absolute text-xs font-medium ${
                            isEnabled ? 'right-2 text-white' : 'left-2 text-gray-400'
                          }`}
                        >
                          {isEnabled ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Feature Highlights */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">What's Included</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureHighlight
              icon={<Award className="w-5 h-5" />}
              title="4-Stage Progression"
              description="New Rep → Top Producer path"
              enabled={formData.enableGamification}
            />

            <FeatureHighlight
              icon={<Flame className="w-5 h-5" />}
              title="Daily Streaks"
              description="Motivate consistent training"
              enabled={formData.enableStreaks}
            />

            <FeatureHighlight
              icon={<Users className="w-5 h-5" />}
              title="Team Leaderboard"
              description="Compare progress with peers"
              enabled={formData.enableGamification}
            />

            <FeatureHighlight
              icon={<Calendar className="w-5 h-5" />}
              title="Live Events"
              description="Group coaching sessions"
              enabled={formData.enableEvents}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-primary">Recommendation:</span> All features are
            enabled by default for maximum engagement. You can disable individual features
            anytime in settings.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureHighlight({ icon, title, description, enabled }) {
  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg transition-opacity ${
        enabled ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div className={`p-2 rounded-lg ${enabled ? 'bg-primary/10' : 'bg-gray-700/30'}`}>
        <div className={enabled ? 'text-primary' : 'text-gray-500'}>{icon}</div>
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
