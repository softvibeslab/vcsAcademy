/**
 * Features Settings Section
 *
 * Enable/disable platform features
 */

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function FeaturesSection({ organization, onSave, saving }) {
  const [settings, setSettings] = useState(organization.settings || {});
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ settings });
    setHasChanges(false);
  };

  const featureGroups = [
    {
      title: 'Engagement',
      features: [
        { key: 'enable_gamification', label: 'Points System', description: 'Award points for completing training' },
        { key: 'enable_badges', label: 'Achievement Badges', description: 'Unlock badges as users progress' },
        { key: 'enable_streaks', label: 'Training Streaks', description: 'Track consecutive days of activity' },
        { key: 'enable_leaderboard', label: 'Leaderboard', description: 'Compare progress with peers' },
      ],
    },
    {
      title: 'Content',
      features: [
        { key: 'enable_deal_breakdowns', label: 'Deal Breakdowns', description: 'Real scenario analysis' },
        { key: 'enable_quick_wins', label: 'Quick Wins Library', description: 'Tactical tips library' },
        { key: 'custom_tracks', label: 'Custom Tracks', description: 'Create your own training tracks' },
        { key: 'custom_modules', label: 'Custom Modules', description: 'Add custom training modules' },
      ],
    },
    {
      title: 'Community',
      features: [
        { key: 'enable_community', label: 'Community Feed', description: 'Posts, comments, and discussions' },
        { key: 'enable_events', label: 'Events Calendar', description: 'Schedule training sessions' },
        { key: 'moderate_posts', label: 'Post Moderation', description: 'Require approval for posts' },
      ],
    },
    {
      title: 'Integrations',
      features: [
        { key: 'enable_ai_assistant', label: 'AI Assistant', description: 'AI-powered customization helper' },
        { key: 'stripe_enabled', label: 'Stripe Payments', description: 'Accept payments for subscriptions' },
        { key: 'google_oauth_enabled', label: 'Google OAuth', description: 'Allow Google sign-in' },
      ],
    },
    {
      title: 'Notifications',
      features: [
        { key: 'email_notifications_enabled', label: 'Email Notifications', description: 'Send email notifications' },
        { key: 'push_notifications_enabled', label: 'Push Notifications', description: 'Send push notifications' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Features</h2>
          <p className="text-muted-foreground">
            Enable or disable platform features
          </p>
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {featureGroups.map((group) => (
          <div key={group.title} className="p-6 rounded-xl border border-border/50 bg-background/50">
            <h3 className="font-semibold text-lg mb-4">{group.title}</h3>

            <div className="space-y-3">
              {group.features.map((feature) => {
                const isEnabled = settings[feature.key];

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
                      onClick={() => handleChange(feature.key, !isEnabled)}
                      className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none ${
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
        ))}
      </div>
    </div>
  );
}
