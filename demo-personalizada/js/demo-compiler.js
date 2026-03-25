/**
 * Demo Compiler
 *
 * Compiles personalized HTML demo using template system.
 * Takes onboarding data and module data to generate a complete,
 * branded demo HTML file.
 */

class DemoCompiler {
  constructor() {
    this.template = null;
  }

  /**
   * Load base template
   */
  async loadTemplate() {
    if (this.template) return this.template;

    try {
      const response = await fetch('templates/base-template.html');
      this.template = await response.text();
      return this.template;
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  }

  /**
   * Compile complete demo HTML
   */
  async compileDemo(onboardingData, moduleData, snapshot) {
    const template = await this.loadTemplate();

    // Prepare all replacements
    const replacements = {
      // Site info
      'siteName': onboardingData.siteName || 'My Sales Academy',
      'tagline': onboardingData.tagline || 'Transform Your Team',
      'slug': onboardingData.slug || 'my-sales-academy',

      // Branding
      'primaryColor': onboardingData.primaryColor || '#D4AF37',
      'secondaryColor': onboardingData.secondaryColor || '#1E3A8A',
      'accentColor': onboardingData.accentColor || this.getAccentColor(onboardingData.organizationType),
      'logoUrl': onboardingData.logoUrl || '',

      // Content
      'organizationType': onboardingData.organizationType || 'vacation_club',
      'industryFocus': onboardingData.industryFocus || 'Sales Representatives',

      // Features
      'featuresJSON': JSON.stringify(this.buildFeaturesConfig(onboardingData)),
      'tracksJSON': JSON.stringify(moduleData.tracks),
      'contextsJSON': JSON.stringify(moduleData.contexts),
      'stagesJSON': JSON.stringify(moduleData.stages),
      'badgesJSON': JSON.stringify(moduleData.badges),

      // Demo user data
      'demoUserJSON': JSON.stringify(snapshot.users.demo_users[0]),

      // Meta
      'generatedAt': new Date().toISOString(),
      'snapshotVersion': snapshot.snapshot_version
    };

    // Apply all replacements
    let demoHTML = template;

    for (const [key, value] of Object.entries(replacements)) {
      const placeholder = `{{${key}}}`;
      demoHTML = demoHTML.split(placeholder).join(this.escapeHTML(value));
    }

    // Inject custom CSS
    demoHTML = this.injectCustomCSS(demoHTML, onboardingData);

    return demoHTML;
  }

  /**
   * Build features configuration
   */
  buildFeaturesConfig(onboardingData) {
    return {
      gamification: onboardingData.enableGamification !== false,
      badges: onboardingData.enableBadges !== false,
      streaks: onboardingData.enableStreaks !== false,
      community: onboardingData.enableCommunity === true,
      events: onboardingData.enableEvents === true,
      customTracks: onboardingData.customTracksEnabled === true
    };
  }

  /**
   * Inject custom CSS based on branding
   */
  injectCustomCSS(html, onboardingData) {
    const customCSS = `
    <style id="custom-branding">
      :root {
        --primary: ${onboardingData.primaryColor || '#D4AF37'};
        --secondary: ${onboardingData.secondaryColor || '#1E3A8A'};
        --accent: ${this.getAccentColor(onboardingData.organizationType)};
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary) 0%, ${this.adjustColor(onboardingData.primaryColor || '#D4AF37', -20)} 100%);
      }

      .gold-text {
        color: var(--primary);
      }

      .gold-gradient {
        background: linear-gradient(135deg, var(--primary) 0%, ${this.adjustColor(onboardingData.primaryColor || '#D4AF37', -20)} 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    </style>
    `;

    return html.replace('</head>', `${customCSS}</head>`);
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
   * Adjust color brightness
   */
  adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  }

  /**
   * Escape HTML to prevent injection
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return str;

    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generate demo filename
   */
  generateFilename(slug) {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${slug}-demo-${timestamp}.html`;
  }

  /**
   * Preview demo in new window
   */
  previewDemo(html) {
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  }

  /**
   * Download demo HTML
   */
  downloadDemo(html, filename) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate compiled demo
   */
  validateDemo(html) {
    const errors = [];

    if (!html.includes('{{siteName}}') && !html.includes('</html>')) {
      errors.push('Invalid HTML structure');
    }
    if (!html.includes('tracksJSON')) {
      errors.push('Missing tracks data');
    }
    if (!html.includes('demoUserJSON')) {
      errors.push('Missing demo user data');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get demo size
   */
  getDemoSize(html) {
    const bytes = new Blob([html]).size;
    const kb = (bytes / 1024).toFixed(2);
    const mb = (bytes / (1024 * 1024)).toFixed(2);

    return { bytes, kb, mb };
  }

  /**
   * Compile demo summary
   */
  compileSummary(html, onboardingData, moduleData) {
    const size = this.getDemoSize(html);
    const validation = this.validateDemo(html);

    return {
      filename: this.generateFilename(onboardingData.slug),
      size: size,
      validation: validation,
      content: {
        tracks: moduleData.tracks.length,
        totalModules: moduleData.totalModules,
        contexts: moduleData.contexts.length,
        badges: moduleData.badges.length,
        stages: moduleData.stages.length
      },
      organization: {
        name: onboardingData.siteName,
        type: onboardingData.organizationType,
        industry: onboardingData.industryFocus
      }
    };
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoCompiler;
}
