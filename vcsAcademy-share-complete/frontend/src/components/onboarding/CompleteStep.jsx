/**
 * Step 5: Completion & Launch
 *
 * Final step showing summary and completion options
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, Confetti, ArrowRight } from 'lucide-react';

export default function CompleteStep({ formData, organization, onComplete, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
        >
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="text-4xl font-heading font-bold">
          You're All Set!
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your academy is configured and ready to launch
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branding Summary */}
          <div className="p-5 rounded-xl border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2" />
              Branding
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.siteName || 'VCSA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tagline:</span>
                <span className="font-medium">{formData.tagline || 'Default'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Colors:</span>
                <div className="flex space-x-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Summary */}
          <div className="p-5 rounded-xl border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2" />
              Content
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus:</span>
                <span className="font-medium">{formData.industryFocus || 'Sales'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custom Tracks:</span>
                <span className="font-medium">
                  {formData.customTracksEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules:</span>
                <span className="font-medium">36 included</span>
              </div>
            </div>
          </div>

          {/* Features Summary */}
          <div className="p-5 rounded-xl border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2" />
              Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.enableGamification && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Gamification
                </span>
              )}
              {formData.enableBadges && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Badges
                </span>
              )}
              {formData.enableStreaks && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Streaks
                </span>
              )}
              {formData.enableCommunity && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Community
                </span>
              )}
              {formData.enableEvents && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Events
                </span>
              )}
            </div>
          </div>

          {/* Team Summary */}
          <div className="p-5 rounded-xl border border-border/50 bg-background/50">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2" />
              Team
            </h3>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invitations:</span>
                <span className="font-medium">
                  {formData.inviteEmails?.length || 0} pending
                </span>
              </div>
              {formData.inviteEmails?.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Invitations will be sent after launch
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                1
              </div>
              <div>
                <div className="font-medium text-sm">Explore Your Dashboard</div>
                <div className="text-xs text-muted-foreground">
                  Get familiar with the admin interface and available features
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                2
              </div>
              <div>
                <div className="font-medium text-sm">Customize Content</div>
                <div className="text-xs text-muted-foreground">
                  Add custom tracks or modify existing training modules
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                3
              </div>
              <div>
                <div className="font-medium text-sm">Invite Your Team</div>
                <div className="text-xs text-muted-foreground">
                  Send invitations and start training your sales team
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                4
              </div>
              <div>
                <div className="font-medium text-sm">Track Progress</div>
                <div className="text-xs text-muted-foreground">
                  Monitor your team's progress and celebrate achievements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="text-center pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            disabled={loading}
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Launching...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>Launch Your Academy</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <p className="mt-4 text-sm text-muted-foreground">
            You can always change these settings later
          </p>
        </div>
      </div>

      {/* Confetti Effect (CSS) */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>
    </motion.div>
  );
}
