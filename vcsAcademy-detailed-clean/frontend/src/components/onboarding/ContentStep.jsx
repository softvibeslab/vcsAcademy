/**
 * Step 2: Content Setup
 *
 * Configure training content options:
 * - Enable/disable custom tracks
 * - Industry focus
 * - Content preferences
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, ToggleRight, ToggleLeft, Video, FileText } from 'lucide-react';

export default function ContentStep({ formData, updateFormData, onNext, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold">Set Up Your Content</h2>
        <p className="text-muted-foreground">
          Configure your training content and focus areas
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Custom Tracks Toggle */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Custom Training Tracks</h3>
                <p className="text-sm text-muted-foreground">
                  Enable custom tracks to create your own training modules tailored to your
                  industry
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                updateFormData({ customTracksEnabled: !formData.customTracksEnabled })
              }
              className="relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{
                backgroundColor: formData.customTracksEnabled ? '#D4AF37' : '#374151',
              }}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                  formData.customTracksEnabled ? 'translate-x-10' : 'translate-x-1'
                }`}
              />
              {formData.customTracksEnabled ? (
                <ToggleRight className="absolute right-2 w-5 h-5 text-white" />
              ) : (
                <ToggleLeft className="absolute left-2 w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {formData.customTracksEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-lg bg-accent/5 border border-border/50"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Enabled:</span> You'll be able
                to create custom training tracks after completing setup. This is perfect for
                industry-specific content.
              </p>
            </motion.div>
          )}
        </div>

        {/* Industry Focus */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-start space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Industry Focus</h3>
              <p className="text-sm text-muted-foreground">
                Who is your target audience? This helps us tailor content recommendations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              'Sales Representatives',
              'Sales Managers',
              'Customer Success Teams',
              'Account Executives',
              'Business Development',
              'Other',
            ].map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.industryFocus === option
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="industryFocus"
                  value={option}
                  checked={formData.industryFocus === option}
                  onChange={(e) => updateFormData({ industryFocus: e.target.value })}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.industryFocus === option
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}
                >
                  {formData.industryFocus === option && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Types Preview */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <h3 className="font-semibold mb-4">Available Content Types</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/5">
              <Video className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Training Videos</div>
                <div className="text-xs text-muted-foreground">36 included modules</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/5">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Deal Breakdowns</div>
                <div className="text-xs text-muted-foreground">15 real scenarios</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/5">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Quick Wins</div>
                <div className="text-xs text-muted-foreground">20 tactical tips</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/5">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Coaching Sessions</div>
                <div className="text-xs text-muted-foreground">Weekly group calls</div>
              </div>
            </div>
          </div>

          {!formData.customTracksEnabled && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Pro tip:</span> Enable custom tracks to add
                your own industry-specific training content.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            All content is fully customizable after setup. You can add, edit, or remove any
            training material.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
