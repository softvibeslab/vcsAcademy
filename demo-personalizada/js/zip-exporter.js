/**
 * ZIP Exporter
 *
 * Packages demo HTML + snapshot JSON + README into downloadable ZIP.
 * Uses JSZip library for compression.
 */

class ZipExporter {
  constructor() {
    this.jszip = null;
  }

  /**
   * Load JSZip library
   */
  async loadJSZip() {
    if (this.jszip) return this.jszip;

    // Load from CDN
    return new Promise((resolve, reject) => {
      if (window.JSZip) {
        this.jszip = window.JSZip;
        resolve(this.jszip);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      script.onload = () => {
        this.jszip = window.JSZip;
        resolve(this.jszip);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Export complete package
   */
  async exportPackage(demoHTML, snapshot, filename) {
    await this.loadJSZip();

    const zip = new this.jszip();

    // Add demo HTML
    zip.file('demo.html', demoHTML);

    // Add snapshot JSON
    zip.file('snapshot.json', JSON.stringify(snapshot, null, 2));

    // Add README
    zip.file('README.md', this.generateREADME(snapshot));

    // Add assets folder (empty for now)
    zip.folder('assets');

    // Generate ZIP
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    return blob;
  }

  /**
   * Download ZIP file
   */
  async downloadZIP(demoHTML, snapshot, filename) {
    try {
      const blob = await this.exportPackage(demoHTML, snapshot, filename);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      return { success: true, size: blob.size };
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate README content
   */
  generateREADME(snapshot) {
    const org = snapshot.organization;
    const config = snapshot.configuration;

    return `# ${org.name} - Demo Package

Generated: ${new Date().toISOString()}
Organization Type: ${org.type}
Industry Focus: ${org.industry_focus}

---

## 📦 Package Contents

This ZIP file contains:

1. **demo.html** - Complete interactive demo of your ${org.name}
2. **snapshot.json** - Full configuration snapshot for CRM setup
3. **README.md** - This file

---

## 🚀 Quick Start

### Option 1: Open Demo Directly

Simply double-click \`demo.html\` to open in your browser.

### Option 2: Local Server

\`\`\`bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Then open http://localhost:8000/demo.html
\`\`\`

### Option 3: Publish Online

**Netlify (Free):**
1. Go to https://netlify.com
2. Drag & drop this entire folder
3. Get your URL instantly

**Vercel (Free):**
1. Go to https://vercel.com
2. Import this folder
3. Deploy in seconds

---

## 👤 Demo Credentials

- **Email:** ${snapshot.users.demo_users[0].email}
- **Password:** demo123
- **Role:** ${snapshot.users.demo_users[0].role}
- **Stage:** ${snapshot.users.demo_users[0].stage}

---

## 📊 Your Configuration

### Branding
- **Name:** ${org.branding.site_name}
- **Tagline:** ${org.tagline}
- **Colors:** ${org.branding.primary_color} (primary), ${org.branding.secondary_color} (secondary)

### Content
- **Tracks:** ${snapshot.content.total_tracks}
- **Modules:** ${snapshot.content.total_modules}
- **Contexts:** ${snapshot.content.contexts.length}
- **Badges:** ${snapshot.content.badges.length}

### Features
${config.gamification.enabled ? '✅' : '❌'} Gamification
${config.gamification.badges_enabled ? '✅' : '❌'} Badges
${config.gamification.streaks_enabled ? '✅' : '❌'} Streaks
${config.community.enabled ? '✅' : '❌'} Community
${config.events.enabled ? '✅' : '❌'} Events

---

## 🎯 Target Metrics

- **Onboarding Time:** ${snapshot.analytics.kpis.onboarding_time_target}
- **First Sale:** ${snapshot.analytics.kpis.first_sale_target}
- **Expected ROI:** ${snapshot.analytics.kpis.expected_roi}

---

## 📝 Next Steps

1. **Explore the Demo**
   - Login with demo credentials
   - Navigate through all pages
   - Test all features

2. **Share with Team**
   - Upload to Netlify/Vercel
   - Share URL with stakeholders
   - Gather feedback

3. **Implement CRM**
   - Use \`snapshot.json\` as configuration
   - Import into your CRM system
   - Customize content as needed

4. **Launch to Users**
   - Invite team members
   - Track progress
   - Celebrate achievements!

---

## 🔧 Customization

### Change Colors

Edit \`demo.html\` and search for:

\`\`\`css
:root {
  --primary: '${org.branding.primary_color}';
  --secondary: '${org.branding.secondary_color}';
}
\`\`\`

### Modify Content

The demo uses mockup data. To use real content:

1. Edit the JSON data in \`demo.html\`
2. Or import \`snapshot.json\` into your CRM
3. Update with your actual training content

---

## 📞 Support

For questions or support:

- **Email:** support@vcsa.com
- **Documentation:** https://docs.vcsa.com
- **Community:** https://community.vcsa.com

---

## 📄 License

© ${new Date().getFullYear()} ${org.name}. All rights reserved.

This demo is provided for evaluation purposes.

---

**Generated with VCSA Demo Generator v${snapshot.snapshot_version}**
**Snapshot ID:** ${snapshot.organization.id}
`;
  }

  /**
   * Generate package filename
   */
  generateFilename(slug) {
    const timestamp = new Date().toISOString().split('T')[0];
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${slug}-demo-${timestamp}-${randomStr}.zip`;
  }

  /**
   * Get package size info
   */
  async getPackageSize(demoHTML, snapshot) {
    const blob = await this.exportPackage(demoHTML, snapshot, 'temp.zip');
    const bytes = blob.size;
    const kb = (bytes / 1024).toFixed(2);
    const mb = (bytes / (1024 * 1024)).toFixed(2);

    return { bytes, kb, mb };
  }

  /**
   * Validate package before export
   */
  validatePackage(demoHTML, snapshot) {
    const errors = [];

    if (!demoHTML || demoHTML.length < 1000) {
      errors.push('Demo HTML is too small or empty');
    }
    if (!snapshot || !snapshot.organization) {
      errors.push('Snapshot is missing organization data');
    }
    if (!snapshot.organization?.name) {
      errors.push('Organization name is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Export snapshot only (without demo)
   */
  async exportSnapshotOnly(snapshot, filename) {
    await this.loadJSZip();

    const zip = new this.jszip();
    zip.file('snapshot.json', JSON.stringify(snapshot, null, 2));
    zip.file('README.md', this.generateSnapshotREADME(snapshot));

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

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
   * Generate snapshot-only README
   */
  generateSnapshotREADME(snapshot) {
    return `# ${snapshot.organization.name} - CRM Snapshot

Generated: ${new Date().toISOString()}
Snapshot Version: ${snapshot.snapshot_version}

---

## 📋 What is This?

This is a complete configuration snapshot for your ${snapshot.organization.name} CRM.

You can use this file to:
- Initialize a new organization
- Backup your configuration
- Share settings with others
- Version control your setup

---

## 🚀 How to Use

### Import to CRM

1. Access your CRM admin panel
2. Navigate to Settings > Import
3. Upload \`snapshot.json\`
4. Review and confirm import

### View Configuration

You can open \`snapshot.json\` in any text editor or JSON viewer to review all settings.

---

## 📊 Configuration Summary

- **Organization:** ${snapshot.organization.name}
- **Type:** ${snapshot.organization.type}
- **Industry:** ${snapshot.organization.industry_focus}
- **Tracks:** ${snapshot.content.total_tracks}
- **Modules:** ${snapshot.content.total_modules}
- **Features Enabled:** ${snapshot.features.enabled_features.length}

---

**Generated with VCSA Demo Generator v${snapshot.snapshot_version}**
`;
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZipExporter;
}
