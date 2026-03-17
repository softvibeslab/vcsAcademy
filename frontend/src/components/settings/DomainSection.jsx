/**
 * Domain Settings Section
 *
 * Manage custom domains and subdomains
 */

import React, { useState } from 'react';
import { Globe, Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function DomainSection({ organization, onSave, saving }) {
  const [newDomain, setNewDomain] = useState('');
  const [verifying, setVerifying] = useState(false);

  const domains = organization.domains || [];
  const customDomain = organization.custom_domain;

  const verifyDomain = async () => {
    if (!newDomain.trim()) return;

    setVerifying(true);

    try {
      // Call verification API
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      await fetch(`${backendUrl}/api/organizations/${organization.organization_id}/domains/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ domain: newDomain }),
      });

      // Show DNS instructions
      alert('Domain verification initiated. Please add the DNS records as shown in the instructions.');
    } catch (error) {
      console.error('Error verifying domain:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Domain Settings</h2>
        <p className="text-muted-foreground">
          Configure custom domains for your academy
        </p>
      </div>

      {/* Current Subdomain */}
      <div className="p-6 rounded-xl border border-border/50 bg-background/50">
        <h3 className="font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-primary" />
          Current Subdomain
        </h3>

        <div className="flex items-center space-x-3 p-4 rounded-lg bg-accent/5">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <div>
            <div className="font-medium">{organization.slug}.vcsa.com</div>
            <div className="text-sm text-muted-foreground">
              Your academy is accessible at this subdomain
            </div>
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      {customDomain ? (
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <h3 className="font-semibold mb-4">Custom Domain</h3>

          <div className="flex items-center space-x-3 p-4 rounded-lg bg-accent/5">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div>
              <div className="font-medium">{customDomain}</div>
              <div className="text-sm text-muted-foreground">
                Custom domain is configured and active
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <h3 className="font-semibold mb-4">Add Custom Domain</h3>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Map your own domain (e.g., academy.yourcompany.com) to your training academy.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="academy.yourcompany.com"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
              />
              <button
                onClick={verifyDomain}
                disabled={verifying || !newDomain}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Domain</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
              <h4 className="font-medium text-sm mb-2">DNS Configuration Required</h4>
              <p className="text-xs text-muted-foreground">
                After adding your domain, you'll need to configure DNS records. We'll provide
                step-by-step instructions during the verification process.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DNS Instructions (would be shown after verification) */}
      <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm">
              <span className="font-medium">DNS Changes:</span> DNS changes may take up to
              48 hours to propagate. Make sure to configure your DNS records correctly to
              avoid service interruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
