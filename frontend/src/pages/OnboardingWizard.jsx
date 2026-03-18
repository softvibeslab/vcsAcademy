/**
 * Organization Onboarding Wizard
 *
 * A 6-step wizard that guides new organization administrators through:
 * Step 0: Welcome & Organization Type
 * Step 1: Branding (Logo, Colors, Fonts)
 * Step 2: Content Setup (Tracks, Modules, Industry Focus)
 * Step 3: Settings (Gamification, Community, Features)
 * Step 4: Team Invitations
 * Step 5: Completion & Launch
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/App';
import axios from 'axios';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

// Step components
import WelcomeStep from '../components/onboarding/WelcomeStep';
import BrandingStep from '../components/onboarding/BrandingStep';
import ContentStep from '../components/onboarding/ContentStep';
import SettingsStep from '../components/onboarding/SettingsStep';
import TeamStep from '../components/onboarding/TeamStep';
import CompleteStep from '../components/onboarding/CompleteStep';

const STEPS = [
  { id: 0, title: 'Welcome', icon: Circle, description: 'Get started' },
  { id: 1, title: 'Branding', icon: Circle, description: 'Customize your look' },
  { id: 2, title: 'Content', icon: Circle, description: 'Set up training' },
  { id: 3, title: 'Settings', icon: Circle, description: 'Configure features' },
  { id: 4, title: 'Team', icon: Circle, description: 'Invite members' },
  { id: 5, title: 'Launch', icon: CheckCircle2, description: 'Go live' },
];

export default function OnboardingWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orgId } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [createdOrgId, setCreatedOrgId] = useState(null); // Store created org ID for new users

  // Redirect to login if no user on protected routes
  useEffect(() => {
    if (orgId && !user) {
      // If accessing specific org (edit mode), require auth
      navigate('/login');
    }
  }, [orgId, user, navigate]);

  // Form data for each step
  const [formData, setFormData] = useState({
    // Step 0: Welcome
    organizationType: '',

    // Step 1: Branding
    name: '',  // Organization name
    slug: '',  // URL slug
    logoUrl: '',
    primaryColor: '#D4AF37',
    secondaryColor: '#1E3A8A',
    siteName: '',
    tagline: '',

    // Step 2: Content
    customTracksEnabled: false,
    industryFocus: '',

    // Step 3: Settings
    enableGamification: true,
    enableCommunity: true,
    enableEvents: true,
    enableBadges: true,
    enableStreaks: true,

    // Step 4: Team
    inviteEmails: [],

    // Step 5: Complete
    completed: false,
  });

  // Load organization data on mount
  useEffect(() => {
    if (orgId) {
      loadOrganization();
    } else if (user?.organization_id) {
      loadOrganization();
    }
  }, [orgId, user]);

  const loadOrganization = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const orgIdToLoad = orgId || user?.organization_id;

      const response = await axios.get(
        `${backendUrl}/api/organizations/${orgIdToLoad}`,
        { withCredentials: true }
      );

      setOrganization(response.data);

      // Set current step based on onboarding progress
      if (!response.data.onboarding_completed) {
        setCurrentStep(response.data.onboarding_step || 0);
      } else {
        // Onboarding already completed, redirect to dashboard
        navigate('/dashboard');
      }

      // Pre-fill form data with existing organization data
      if (response.data.branding) {
        setFormData(prev => ({
          ...prev,
          logoUrl: response.data.branding.logo_url || '',
          primaryColor: response.data.branding.primary_color || '#D4AF37',
          secondaryColor: response.data.branding.secondary_color || '#1E3A8A',
          siteName: response.data.branding.site_name || '',
          tagline: response.data.branding.tagline || '',
        }));
      }

      if (response.data.settings) {
        setFormData(prev => ({
          ...prev,
          enableGamification: response.data.settings.enable_gamification ?? true,
          enableCommunity: response.data.settings.enable_community ?? true,
          enableEvents: response.data.settings.enable_events ?? true,
          enableBadges: response.data.settings.enable_badges ?? true,
          enableStreaks: response.data.settings.enable_streaks ?? true,
          customTracksEnabled: response.data.settings.custom_tracks ?? false,
        }));
      }

      if (response.data.industry) {
        setFormData(prev => ({
          ...prev,
          organizationType: response.data.industry,
          industryFocus: response.data.target_audience || '',
        }));
      }
    } catch (err) {
      console.error('Error loading organization:', err);
      setError('Failed to load organization data');
    }
  };

  const saveStep = async (stepData) => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      console.log('Backend URL:', backendUrl);
      console.log('Current step:', currentStep);
      console.log('Step data:', stepData);

      let orgIdToUse = orgId || user?.organization_id || createdOrgId;

      // Step 1 (Branding): Create organization first if it doesn't exist
      if (currentStep === 1 && !orgIdToUse) {
        // Need organization name and slug from stepData
        if (!stepData.name || !stepData.slug) {
          setError('Organization name and slug are required');
          setLoading(false);
          return false;
        }

        console.log('Creating organization with name:', stepData.name, 'slug:', stepData.slug);

        // Create organization
        const orgPayload = {
          name: stepData.name,
          slug: stepData.slug,
          branding: {
            logo_url: stepData.logoUrl || '',
            primary_color: stepData.primaryColor || '#D4AF37',
            secondary_color: stepData.secondaryColor || '#1E3A8A',
            site_name: stepData.siteName || stepData.name,
            tagline: stepData.tagline || '',
            email_from_name: stepData.name,
            email_from_address: `admin@${stepData.slug}.com`
          },
          industry: stepData.organizationType || 'Sales Training',
          company_size: 'small'
        };

        console.log('Organization payload:', orgPayload);

        const orgResponse = await axios.post(
          `${backendUrl}/api/organizations`,
          orgPayload,
          { withCredentials: true }
        );

        console.log('Organization created:', orgResponse.data);
        orgIdToUse = orgResponse.data.organization_id;
        setCreatedOrgId(orgIdToUse);
        setOrganization(orgResponse.data);
      }

      // Save step progress (only if organization exists)
      if (orgIdToUse) {
        const payload = {
          step: currentStep,
          org_id: orgIdToUse, // Include org_id for unauthenticated users
          ...stepData,
        };

        console.log('Saving onboarding step with payload:', payload);

        await axios.post(
          `${backendUrl}/api/organizations/onboarding/step`,
          payload,
          { withCredentials: true }
        );
      }

      // Update local form data
      setFormData(prev => ({ ...prev, ...stepData }));

      return true;
    } catch (err) {
      console.error('Error saving step:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);

      // Extract error message safely
      let errorMsg = 'Failed to save progress';
      try {
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
          } else if (err.response.data.detail) {
            errorMsg = String(err.response.data.detail);
          } else if (err.response.data.message) {
            errorMsg = String(err.response.data.message);
          } else {
            errorMsg = JSON.stringify(err.response.data);
          }
        } else if (err.message) {
          errorMsg = String(err.message);
        } else if (typeof err === 'string') {
          errorMsg = err;
        } else {
          errorMsg = 'An unexpected error occurred';
        }
      } catch (e) {
        console.error('Error parsing error message:', e);
        errorMsg = 'Failed to save progress. Please try again.';
      }

      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Save current step data
    const saved = await saveStep(formData);

    if (!saved) {
      return; // Don't proceed if save failed
    }

    // Move to next step
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const orgIdToUse = orgId || user?.organization_id;

      // Mark onboarding as complete
      await axios.post(
        `${backendUrl}/api/organizations/onboarding/complete`,
        {},
        { withCredentials: true }
      );

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      organization,
      onNext: handleNext,
      onBack: handleBack,
      onComplete: handleComplete,
      loading,
      error,
    };

    switch (currentStep) {
      case 0:
        return <WelcomeStep {...stepProps} />;
      case 1:
        return <BrandingStep {...stepProps} />;
      case 2:
        return <ContentStep {...stepProps} />;
      case 3:
        return <SettingsStep {...stepProps} />;
      case 4:
        return <TeamStep {...stepProps} />;
      case 5:
        return <CompleteStep {...stepProps} />;
      default:
        return <WelcomeStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {organization?.branding?.logo_url && (
                <img
                  src={organization.branding.logo_url}
                  alt={organization.name}
                  className="h-8 w-auto"
                />
              )}
              <h1 className="text-xl font-heading font-semibold">
                {organization?.branding?.site_name || 'Setup Your Academy'}
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border/20 bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const StepIcon = isCompleted ? CheckCircle2 : step.icon;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Indicator */}
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : isCompleted
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background'
                      }`}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <StepIcon className="w-5 h-5" />
                    </motion.div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                      style={{ maxWidth: '60px' }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {currentStep < 5 && (
        <footer className="border-t border-border/20 bg-background/50 backdrop-blur-sm fixed bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === STEPS.length - 2 ? 'Complete' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
