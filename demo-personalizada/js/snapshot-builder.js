/**
 * Snapshot Builder
 *
 * Builds complete CRM snapshot JSON from onboarding data.
 * This snapshot can be used to:
 * - Initialize a new organization
 * - Backup configuration
 * - Share template with others
 * - Version control setups
 */

class SnapshotBuilder {
  constructor() {
    this.snapshotVersion = '1.0';
  }

  /**
   * Build complete snapshot from onboarding data
   */
  async buildSnapshot(onboardingData, moduleData) {
    const snapshot = {
      snapshot_version: this.snapshotVersion,
      generated_at: new Date().toISOString(),
      organization: this.buildOrganization(onboardingData),
      configuration: this.buildConfiguration(onboardingData),
      content: this.buildContent(onboardingData, moduleData),
      users: this.buildUsers(onboardingData),
      analytics: this.buildAnalytics(onboardingData),
      features: this.buildFeatures(onboardingData)
    };

    return snapshot;
  }

  /**
   * Build organization section
   */
  buildOrganization(onboardingData) {
    return {
      id: this.generateUUID(),
      name: onboardingData.siteName || 'My Sales Academy',
      slug: onboardingData.slug || 'my-sales-academy',
      tagline: onboardingData.tagline || 'Transform Your Team',
      type: onboardingData.organizationType || 'vacation_club',
      industry_focus: onboardingData.industryFocus || 'Sales Representatives',
      created_at: new Date().toISOString(),
      branding: {
        logo_url: onboardingData.logoUrl || '',
        primary_color: onboardingData.primaryColor || '#D4AF37',
        secondary_color: onboardingData.secondaryColor || '#1E3A8A',
        accent_color: onboardingData.accentColor || this.getAccentColor(onboardingData.organizationType),
        site_name: onboardingData.siteName || 'My Sales Academy'
      }
    };
  }

  /**
   * Build configuration section
   */
  buildConfiguration(onboardingData) {
    return {
      onboarding: {
        custom_tracks_enabled: onboardingData.customTracksEnabled || false,
        industry_focus: onboardingData.industryFocus || 'Sales Representatives',
        organization_type: onboardingData.organizationType || 'vacation_club'
      },
      gamification: {
        enabled: onboardingData.enableGamification !== false,
        points_system: onboardingData.enableGamification !== false,
        badges_enabled: onboardingData.enableBadges !== false,
        streaks_enabled: onboardingData.enableStreaks !== false,
        leaderboard_enabled: onboardingData.enableGamification !== false
      },
      community: {
        enabled: onboardingData.enableCommunity === true,
        feed_enabled: onboardingData.enableCommunity === true,
        comments_enabled: onboardingData.enableCommunity === true
      },
      events: {
        enabled: onboardingData.enableEvents === true,
        calendar_enabled: onboardingData.enableEvents === true,
        reminders_enabled: onboardingData.enableEvents === true
      },
      training: {
        auto_progress: true,
        video_completion_required: true,
        quiz_enabled: false,
        certificate_enabled: true
      }
    };
  }

  /**
   * Build content section
   */
  buildContent(onboardingData, moduleData) {
    return {
      tracks: moduleData.tracks || [],
      total_tracks: moduleData.tracks?.length || 0,
      total_modules: moduleData.totalModules || 0,
      contexts: moduleData.contexts || [],
      stages: moduleData.stages || [],
      badges: moduleData.badges || [],
      milestones: moduleData.milestones || [],
      quick_wins: this.generateQuickWins(onboardingData),
      deal_breakdowns: this.generateDealBreakdowns(onboardingData)
    };
  }

  /**
   * Build users section
   */
  buildUsers(onboardingData) {
    const demoUser = this.generateDemoUser(onboardingData);
    const invitedUsers = (onboardingData.inviteEmails || []).map(email => ({
      email: email,
      status: 'pending',
      role: 'member',
      invited_at: new Date().toISOString()
    }));

    return {
      demo_users: [demoUser],
      pending_invitations: invitedUsers,
      total_users: 1 + invitedUsers.length,
      roles: {
        admin: {
          permissions: ['all']
        },
        member: {
          permissions: ['view_content', 'complete_training', 'earn_badges']
        }
      }
    };
  }

  /**
   * Build analytics section
   */
  buildAnalytics(onboardingData) {
    const targetMetrics = this.getTargetMetrics(onboardingData.organizationType);

    return {
      kpis: {
        onboarding_time_target: targetMetrics.onboarding_time,
        first_sale_target: targetMetrics.first_sale,
        expected_roi: targetMetrics.roi,
        readiness_score_target: 75
      },
      tracking: {
        readiness_score_enabled: true,
        completion_rate_enabled: true,
        streak_tracking_enabled: onboardingData.enableStreaks !== false,
        time_to_value_enabled: true
      },
      reports: {
        weekly_progress: true,
        monthly_summary: true,
        badge_achievements: true,
        team_leaderboard: onboardingData.enableGamification !== false
      }
    };
  }

  /**
   * Build features section
   */
  buildFeatures(onboardingData) {
    return {
      enabled_features: this.getEnabledFeatures(onboardingData),
      disabled_features: this.getDisabledFeatures(onboardingData),
      beta_features: [],
      coming_soon: ['ai_sales_coach', 'mobile_app_v2', 'advanced_analytics']
    };
  }

  /**
   * Generate demo user
   */
  generateDemoUser(onboardingData) {
    const stages = {
      vacation_club: ['Stage 1: New Rep', 'Stage 2: Developing Rep', 'Stage 3: Performing Rep', 'Stage 4: Top Producer'],
      sales_training: ['Stage 1: Ramp Up', 'Stage 2: Contributing', 'Stage 3: High Performer', 'Stage 4: Sales Leader'],
      customer_success: ['Stage 1: CS Onboarding', 'Stage 2: CS Professional', 'Stage 3: CS Expert', 'Stage 4: CS Champion']
    };

    const currentStage = stages[onboardingData.organizationType]?.[1] || stages.vacation_club[1];

    return {
      id: this.generateUUID(),
      email: `demo@${onboardingData.slug || 'my-academy'}.com`,
      name: 'Demo User',
      role: 'admin',
      status: 'active',
      stage: currentStage,
      readiness_score: 68,
      points: 245,
      streak_days: 7,
      completed_modules: 12,
      total_modules: 36,
      badges: [
        { id: 'first_win', earned_at: this.subtractDays(6) },
        { id: 'quick_learner', earned_at: this.subtractDays(5) },
        { id: 'week_streak', earned_at: this.subtractDays(2) }
      ],
      progress: {
        stage_1: true,
        stage_2: true,
        stage_3: false,
        stage_4: false
      },
      joined_at: this.subtractDays(14),
      last_active: new Date().toISOString()
    };
  }

  /**
   * Generate quick wins
   */
  generateQuickWins(onboardingData) {
    const quickWinsByType = {
      vacation_club: [
        { id: 'qw-1', title: 'The 3-Minute Tour Prep', category: 'before_tour', content: 'Review guest profile before tour' },
        { id: 'qw-2', title: 'Objection Response Flash', category: 'objections', content: 'Price? Break down to daily cost' },
        { id: 'qw-3', title: 'Urgency Builder', category: 'closing', content: 'Use limited-time incentives' }
      ],
      sales_training: [
        { id: 'qw-1', title: 'Email Subject Line Formula', category: 'prospecting', content: 'Use [Benefit] for [Role]' },
        { id: 'qw-2', title: 'Gatekeeper Script', category: 'discovery', content: 'Be direct and confident' },
        { id: 'qw-3', title: 'Trial Close Questions', category: 'closing', content: '"Does this solve your X?"' }
      ],
      customer_success: [
        { id: 'qw-1', title: 'First 48-Hour Checklist', category: 'onboarding', content: 'Personal welcome call' },
        { id: 'qw-2', title: 'Health Score Red Flags', category: 'monitoring', content: 'Login drop >50%' },
        { id: 'qw-3', title: 'Renewal Opener', category: 'renewal', content: '"What achieved your goals?"' }
      ]
    };

    return quickWinsByType[onboardingData.organizationType] || quickWinsByType.vacation_club;
  }

  /**
   * Generate deal breakdowns
   */
  generateDealBreakdowns(onboardingData) {
    const breakdownsByType = {
      vacation_club: [
        { id: 'db-1', title: 'Cold to Warm in 15 Minutes', scenario: 'First-time tour guest' },
        { id: 'db-2', title: 'Price Objection Turnaround', scenario: '"Too expensive" response' },
        { id: 'db-3', title: 'Spouse Alignment Close', scenario: 'Partners disagreeing' }
      ],
      sales_training: [
        { id: 'db-1', title: 'Gatekeeper to Decision Maker', scenario: 'Cold call breakthrough' },
        { id: 'db-2', title: 'Competitor Displacement', scenario: 'Incumbent vendor situation' },
        { id: 'db-3', title: 'Procurement Negotiation', scenario: 'Price pressure tactics' }
      ],
      customer_success: [
        { id: 'db-1', title: 'At-Risk Customer Recovery', scenario: 'Health score dropped' },
        { id: 'db-2', title: 'Expansion Opportunity', scenario: 'User adoption milestone' },
        { id: 'db-3', title: 'Renewal Pushback', scenario: 'Budget cut threat' }
      ]
    };

    return breakdownsByType[onboardingData.organizationType] || breakdownsByType.vacation_club;
  }

  /**
   * Get enabled features
   */
  getEnabledFeatures(onboardingData) {
    const features = ['readiness_score', 'training_tracks', 'video_modules'];

    if (onboardingData.enableGamification !== false) {
      features.push('points', 'badges', 'leaderboard');
    }
    if (onboardingData.enableStreaks !== false) {
      features.push('streaks');
    }
    if (onboardingData.enableCommunity === true) {
      features.push('community_feed', 'comments');
    }
    if (onboardingData.enableEvents === true) {
      features.push('events_calendar');
    }
    if (onboardingData.customTracksEnabled === true) {
      features.push('custom_tracks');
    }

    return features;
  }

  /**
   * Get disabled features
   */
  getDisabledFeatures(onboardingData) {
    const features = [];

    if (onboardingData.enableGamification === false) {
      features.push('points', 'badges', 'leaderboard');
    }
    if (onboardingData.enableStreaks === false) {
      features.push('streaks');
    }
    if (onboardingData.enableCommunity !== true) {
      features.push('community_feed', 'comments');
    }
    if (onboardingData.enableEvents !== true) {
      features.push('events_calendar');
    }
    if (onboardingData.customTracksEnabled !== true) {
      features.push('custom_tracks');
    }

    return features;
  }

  /**
   * Get target metrics by organization type
   */
  getTargetMetrics(orgType) {
    const metrics = {
      vacation_club: {
        onboarding_time: '4 weeks',
        first_sale: '4 weeks',
        roi: '10x'
      },
      sales_training: {
        onboarding_time: '6 weeks',
        first_sale: '8 weeks',
        roi: '8x'
      },
      customer_success: {
        onboarding_time: '3 weeks',
        first_sale: 'N/A',
        roi: '12x'
      }
    };

    return metrics[orgType] || metrics.vacation_club;
  }

  /**
   * Get accent color by organization type
   */
  getAccentColor(orgType) {
    const colors = {
      vacation_club: '#F59E0B',
      sales_training: '#60A5FA',
      customer_success: '#34D399'
    };

    return colors[orgType] || colors.vacation_club;
  }

  /**
   * Generate UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Subtract days from current date
   */
  subtractDays(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  /**
   * Validate snapshot
   */
  validateSnapshot(snapshot) {
    const errors = [];

    if (!snapshot.organization?.name) {
      errors.push('Organization name is required');
    }
    if (!snapshot.organization?.slug) {
      errors.push('Organization slug is required');
    }
    if (!snapshot.content?.tracks?.length) {
      errors.push('At least one track is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Export snapshot as JSON string
   */
  exportSnapshot(snapshot) {
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Import snapshot from JSON string
   */
  importSnapshot(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Invalid snapshot JSON');
    }
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SnapshotBuilder;
}
