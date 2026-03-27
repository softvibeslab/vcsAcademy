/**
 * Limits Settings Section
 *
 * View and manage organization limits and quotas
 */

import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';

export default function LimitsSection({ organization }) {
  const limits = organization.limits || {};

  const limitItems = [
    {
      key: 'max_users',
      label: 'Maximum Users',
      value: limits.max_users,
      icon: 'users',
      description: 'Total number of users allowed',
    },
    {
      key: 'max_admins',
      label: 'Maximum Admins',
      value: limits.max_admins,
      icon: 'shield',
      description: 'Organization administrators',
    },
    {
      key: 'max_managers',
      label: 'Maximum Managers',
      value: limits.max_managers,
      icon: 'badge',
      description: 'Team managers',
    },
    {
      key: 'max_custom_tracks',
      label: 'Custom Tracks',
      value: limits.max_custom_tracks,
      icon: 'layers',
      description: 'Maximum custom training tracks',
    },
    {
      key: 'max_custom_modules_per_track',
      label: 'Modules per Track',
      value: limits.max_custom_modules_per_track,
      icon: 'book',
      description: 'Modules per custom track',
    },
    {
      key: 'max_storage_mb',
      label: 'Storage',
      value: limits.max_storage_mb,
      icon: 'hard-drive',
      format: (v) => `${v} MB`,
      description: 'Total storage space',
    },
    {
      key: 'ai_assistant_calls_per_month',
      label: 'AI Calls / Month',
      value: limits.ai_assistant_calls_per_month,
      icon: 'sparkles',
      description: 'AI assistant monthly quota',
    },
    {
      key: 'max_custom_domains',
      label: 'Custom Domains',
      value: limits.max_custom_domains,
      icon: 'globe',
      description: 'Custom domain mappings',
    },
  ];

  const getIcon = (iconName) => {
    // Simple icon mapping - in production, use proper icon components
    return '📊';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Usage Limits</h2>
        <p className="text-muted-foreground">
          View your organization's resource limits and quotas
        </p>
      </div>

      {/* Current Plan */}
      <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="text-2xl font-bold capitalize">{organization.plan}</div>
          </div>
          <TrendingUp className="w-12 h-12 text-primary opacity-50" />
        </div>
      </div>

      {/* Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limitItems.map((item) => {
          const value = item.value;
          const isUnlimited = value === -1;

          return (
            <div
              key={item.key}
              className="p-4 rounded-lg border border-border/50 bg-background/50"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{getIcon(item.icon)}</span>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-lg font-semibold">
                    {isUnlimited ? (
                      <span className="text-success">Unlimited</span>
                    ) : item.format ? (
                      item.format(value)
                    ) : (
                      value.toLocaleString()
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Notice */}
      <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Need More Resources?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact us to upgrade your plan or discuss custom enterprise options with
              increased limits and dedicated support.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Stats (placeholder - would be populated from actual usage data) */}
      <div className="p-6 rounded-xl border border-border/50 bg-background/50">
        <h3 className="font-semibold mb-4">Current Usage</h3>

        <div className="space-y-4">
          <UsageBar
            label="Users"
            current={12}
            max={limits.max_users}
            unlimited={limits.max_users === -1}
          />
          <UsageBar
            label="Storage"
            current={1024}
            max={limits.max_storage_mb}
            format={(v) => `${v} MB`}
            unlimited={limits.max_storage_mb === -1}
          />
          <UsageBar
            label="AI Calls (This Month)"
            current={45}
            max={limits.ai_assistant_calls_per_month}
            unlimited={limits.ai_assistant_calls_per_month === -1}
          />
        </div>
      </div>
    </div>
  );
}

function UsageBar({ label, current, max, format, unlimited }) {
  if (unlimited) {
    return (
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">
            {current} {format ? format(current) : ''} / Unlimited
          </span>
        </div>
        <div className="h-2 rounded-full bg-accent/10 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: '5%' }}
          />
        </div>
      </div>
    );
  }

  const percentage = Math.min((current / max) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={`font-medium ${isNearLimit ? 'text-warning' : ''}`}
        >
          {current} {format ? format(current) : ''} / {max} {format ? format(max) : ''} (
          {Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-accent/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
