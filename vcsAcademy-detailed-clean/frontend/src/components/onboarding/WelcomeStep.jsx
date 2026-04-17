/**
 * Step 0: Welcome & Organization Type
 *
 * Collects basic information about the organization type
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Briefcase, Building, Users, Zap } from 'lucide-react';

const ORGANIZATION_TYPES = [
  {
    id: 'sales_training',
    title: 'Sales Training',
    description: 'Corporate sales team training',
    icon: Briefcase,
    color: '#3B82F6',
  },
  {
    id: 'vacation_club',
    title: 'Vacation Club',
    description: 'Timeshare & vacation club sales',
    icon: Building,
    color: '#D4AF37',
  },
  {
    id: 'customer_success',
    title: 'Customer Success',
    description: 'Customer onboarding & success',
    icon: Users,
    color: '#10B981',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Custom training academy',
    icon: Zap,
    color: '#8B5CF6',
  },
];

export default function WelcomeStep({ formData, updateFormData, onNext }) {
  const [selectedType, setSelectedType] = React.useState(formData.organizationType);

  const handleSelect = (typeId) => {
    setSelectedType(typeId);
    updateFormData({ organizationType: typeId });
  };

  const handleNext = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
        >
          <GraduationCap className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-heading font-bold">
          Welcome to Your Academy Setup
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Let's personalize your training academy. First, tell us about your organization type.
        </p>
      </div>

      {/* Organization Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {ORGANIZATION_TYPES.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(type.id)}
              className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-accent/5'
              }`}
              style={isSelected ? { borderColor: type.color } : {}}
            >
              <div className="flex items-start space-x-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: type.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleNext}
          disabled={!selectedType}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          Continue to Branding →
        </button>
      </div>

      {/* Info Box */}
      <div className="max-w-2xl mx-auto">
        <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium">Pro tip:</span> You can always change these settings
            later from your organization settings page.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
