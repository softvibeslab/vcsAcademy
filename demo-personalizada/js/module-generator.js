/**
 * Module Generator
 *
 * Generates personalized training modules based on:
 * - Organization type (vacation_club, sales_training, customer_success)
 * - Industry focus (Sales Representatives, Sales Managers, etc.)
 * - Custom tracks preference
 */

class ModuleGenerator {
  constructor() {
    this.organizationTypes = null;
    this.badges = null;
    this.loaded = false;
  }

  /**
   * Load data files
   */
  async loadData() {
    if (this.loaded) return;

    try {
      const [orgTypes, badges] = await Promise.all([
        fetch('data/organization-types.json').then(r => r.json()),
        fetch('data/badge-definitions.json').then(r => r.json())
      ]);

      this.organizationTypes = orgTypes;
      this.badges = badges;
      this.loaded = true;
    } catch (error) {
      console.error('Error loading module data:', error);
      throw error;
    }
  }

  /**
   * Generate modules based on organization type and industry focus
   */
  generateModules(organizationType, industryFocus, options = {}) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call loadData() first.');
    }

    const orgData = this.organizationTypes[organizationType] || this.organizationTypes.vacation_club;
    const tracks = JSON.parse(JSON.stringify(orgData.tracks)); // Deep clone
    const contexts = JSON.parse(JSON.stringify(orgData.contexts));

    // Personalize based on industry focus
    const personalizedTracks = this.personalizeTracks(tracks, industryFocus, organizationType);

    // Add custom tracks if enabled
    if (options.customTracksEnabled) {
      personalizedTracks.push(this.generateCustomTrackTemplate(industryFocus));
    }

    return {
      tracks: personalizedTracks,
      contexts: contexts,
      totalModules: this.countModules(personalizedTracks),
      organizationType: organizationType
    };
  }

  /**
   * Personalize tracks based on industry focus
   */
  personalizeTracks(tracks, industryFocus, orgType) {
    const focusMap = {
      'Sales Representatives': { priority: 'execution', emphasis: 'practical' },
      'Sales Managers': { priority: 'leadership', emphasis: 'strategy' },
      'Customer Success Teams': { priority: 'retention', emphasis: 'relationships' },
      'Account Executives': { priority: 'closing', emphasis: 'advanced' },
      'Business Development': { priority: 'prospecting', emphasis: 'outbound' },
      'Other': { priority: 'general', emphasis: 'balanced' }
    };

    const config = focusMap[industryFocus] || focusMap['Other'];

    return tracks.map(track => {
      const personalized = { ...track };

      // Adjust module content based on emphasis
      personalized.modules = track.modules.map(module => {
        const adjusted = { ...module };

        if (config.emphasis === 'practical') {
          adjusted.description = `${adjusted.keyMove} - Practical application`;
        } else if (config.emphasis === 'strategy') {
          adjusted.description = `${adjusted.keyMove} - Strategic approach`;
        } else if (config.emphasis === 'relationships') {
          adjusted.description = `${adjusted.keyMove} - Relationship-focused`;
        }

        return adjusted;
      });

      // Add priority tag
      personalized.priority = this.calculateTrackPriority(track.id, config.priority);

      return personalized;
    });
  }

  /**
   * Calculate track priority based on focus
   */
  calculateTrackPriority(trackId, focusPriority) {
    const priorityMap = {
      'execution': {
        'pro-mindset': 'high',
        'discovery-control': 'high',
        'pipeline-management': 'high',
        'onboarding-mastery': 'high'
      },
      'leadership': {
        'value-architecture': 'high',
        'decision-management': 'high',
        'negotiation-tactics': 'high',
        'renewal-strategies': 'high'
      },
      'closing': {
        'decision-management': 'high',
        'closing-techniques': 'high',
        'objection-mastery': 'high',
        'upselling-cross-selling': 'high'
      },
      'prospecting': {
        'pipeline-management': 'high',
        'lead-qualification': 'high',
        'discovery-control': 'high'
      },
      'retention': {
        'customer-health': 'high',
        'churn-prevention': 'high',
        'post-decision-integrity': 'high',
        'advocacy-development': 'high'
      }
    };

    return priorityMap[focusPriority]?.[trackId] || 'medium';
  }

  /**
   * Generate custom track template
   */
  generateCustomTrackTemplate(industryFocus) {
    return {
      id: 'custom-track-1',
      title: `Custom Track: ${industryFocus}`,
      description: 'Your custom training content',
      icon: 'plus-circle',
      isCustom: true,
      modules: [
        {
          id: 'custom-m1',
          title: 'Custom Module 1',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        },
        {
          id: 'custom-m2',
          title: 'Custom Module 2',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        },
        {
          id: 'custom-m3',
          title: 'Custom Module 3',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        },
        {
          id: 'custom-m4',
          title: 'Custom Module 4',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        },
        {
          id: 'custom-m5',
          title: 'Custom Module 5',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        },
        {
          id: 'custom-m6',
          title: 'Custom Module 6',
          keyMove: 'Add your custom key move here',
          duration: '5 min',
          isPlaceholder: true
        }
      ]
    };
  }

  /**
   * Count total modules
   */
  countModules(tracks) {
    return tracks.reduce((total, track) => total + track.modules.length, 0);
  }

  /**
   * Generate badges based on organization
   */
  generateBadges(organizationType) {
    if (!this.loaded) {
      throw new Error('Data not loaded. Call loadData() first.');
    }

    return JSON.parse(JSON.stringify(this.badges.badges));
  }

  /**
   * Generate stages based on organization type
   */
  generateStages(organizationType) {
    const baseStages = {
      vacation_club: [
        {
          id: 1,
          name: 'New Rep',
          description: 'Build your foundation',
          pointsRequired: 150,
          estimatedWeeks: '1-2',
          color: '#94A3B8'
        },
        {
          id: 2,
          name: 'Developing Rep',
          description: 'Execute consistently',
          pointsRequired: 300,
          estimatedWeeks: '2-4',
          color: '#3B82F6'
        },
        {
          id: 3,
          name: 'Performing Rep',
          description: 'Close consistently',
          pointsRequired: 500,
          estimatedWeeks: '4-8',
          color: '#D4AF37'
        },
        {
          id: 4,
          name: 'Top Producer',
          description: 'Elite performer',
          pointsRequired: 750,
          estimatedWeeks: '8-12',
          color: '#EF4444'
        }
      ],
      sales_training: [
        {
          id: 1,
          name: 'Ramp Up',
          description: 'Learn the basics',
          pointsRequired: 150,
          estimatedWeeks: '1-2',
          color: '#94A3B8'
        },
        {
          id: 2,
          name: 'Contributing',
          description: 'Make first sales',
          pointsRequired: 300,
          estimatedWeeks: '2-4',
          color: '#3B82F6'
        },
        {
          id: 3,
          name: 'High Performer',
          description: 'Exceed quotas',
          pointsRequired: 500,
          estimatedWeeks: '4-8',
          color: '#10B981'
        },
        {
          id: 4,
          name: 'Sales Leader',
          description: 'Top achiever',
          pointsRequired: 750,
          estimatedWeeks: '8-12',
          color: '#8B5CF6'
        }
      ],
      customer_success: [
        {
          id: 1,
          name: 'CS Onboarding',
          description: 'Master CS fundamentals',
          pointsRequired: 150,
          estimatedWeeks: '1-2',
          color: '#94A3B8'
        },
        {
          id: 2,
          name: 'CS Professional',
          description: 'Manage customers independently',
          pointsRequired: 300,
          estimatedWeeks: '2-4',
          color: '#F59E0B'
        },
        {
          id: 3,
          name: 'CS Expert',
          description: 'Drive customer success',
          pointsRequired: 500,
          estimatedWeeks: '4-8',
          color: '#10B981'
        },
        {
          id: 4,
          name: 'CS Champion',
          description: 'Customer advocacy leader',
          pointsRequired: 750,
          estimatedWeeks: '8-12',
          color: '#EC4899'
        }
      ]
    };

    return baseStages[organizationType] || baseStages.vacation_club;
  }

  /**
   * Generate milestones based on stages and modules
   */
  generateMilestones(stages, totalModules) {
    const modulesPerStage = Math.ceil(totalModules / stages.length);

    return stages.map((stage, index) => {
      const startModule = index * modulesPerStage + 1;
      const endModule = Math.min((index + 1) * modulesPerStage, totalModules);

      return {
        id: `milestone-${stage.id}`,
        stageId: stage.id,
        name: stage.name,
        description: `Complete modules ${startModule}-${endModule}`,
        modulesRange: [startModule, endModule],
        pointsRequired: stage.pointsRequired
      };
    });
  }

  /**
   * Get organization theme
   */
  getOrganizationTheme(organizationType) {
    const orgData = this.organizationTypes[organizationType] || this.organizationTypes.vacation_club;
    return orgData.default_theme;
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleGenerator;
}
