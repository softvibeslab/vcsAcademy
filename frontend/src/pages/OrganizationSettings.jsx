/**
 * Organization Settings Page
 *
 * Comprehensive settings dashboard for organization administrators:
 * - Branding customization
 * - Feature toggles
 * - Limits and quotas
 * - Team management
 * - Domain settings
 * - AI assistant
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import { useOrganization } from '../contexts/OrganizationContext';
import axios from 'axios';
import {
  Settings,
  Palette,
  ToggleRight,
  Users,
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Settings sections
import BrandingSection from '../components/settings/BrandingSection';
import FeaturesSection from '../components/settings/FeaturesSection';
import TeamSection from '../components/settings/TeamSection';
import DomainSection from '../components/settings/DomainSection';
import AIAssistantSection from '../components/settings/AIAssistantSection';
import LimitsSection from '../components/settings/LimitsSection';

const TABS = [
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'features', label: 'Features', icon: ToggleRight },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'domains', label: 'Domains', icon: Globe },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'limits', label: 'Limits', icon: Settings },
];

export default function OrganizationSettings() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Organization data
  const [orgData, setOrgData] = useState(null);

  // Load organization data
  useEffect(() => {
    if (orgId || user?.organization_id) {
      loadOrganization();
    }
  }, [orgId, user]);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      // Use relative URLs in production, full URL in development
      const isProduction = process.env.NODE_ENV === 'production';
      const backendUrl = isProduction ? '' : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');
      const orgIdToLoad = orgId || user?.organization_id;

      const response = await axios.get(
        `${backendUrl}/api/organizations/${orgIdToLoad}`,
        { withCredentials: true }
      );

      setOrgData(response.data);
    } catch (err) {
      console.error('Error loading organization:', err);
      setError('Failed to load organization settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates) => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      // Use relative URLs in production, full URL in development
      const isProduction = process.env.NODE_ENV === 'production';
      const backendUrl = isProduction ? '' : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');
      const orgIdToUse = orgId || user?.organization_id;

      await axios.put(
        `${backendUrl}/api/organizations/${orgIdToUse}`,
        updates,
        { withCredentials: true }
      );

      // Update local state
      setOrgData((prev) => ({ ...prev, ...updates }));

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.detail || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">Failed to load organization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-heading font-semibold">Organization Settings</h1>
                <p className="text-sm text-muted-foreground">{orgData.name}</p>
              </div>
            </div>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Organization Info Card */}
            <div className="mt-8 p-4 rounded-xl border border-border/50 bg-background/50">
              <div className="text-sm text-muted-foreground">Organization</div>
              <div className="font-semibold mt-1">{orgData.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {orgData.slug}.vcsa.com
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{orgData.plan}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{orgData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'branding' && (
                <BrandingSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeTab === 'features' && (
                <FeaturesSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeTab === 'team' && (
                <TeamSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeTab === 'domains' && (
                <DomainSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeTab === 'ai' && (
                <AIAssistantSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeTab === 'limits' && (
                <LimitsSection
                  organization={orgData}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
