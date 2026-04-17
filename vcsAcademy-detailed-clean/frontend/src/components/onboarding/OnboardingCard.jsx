/**
 * Reusable Onboarding Card Component
 *
 * A styled card component for onboarding flows with consistent branding
 * and animations across the platform.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function OnboardingCard({
  title,
  description,
  children,
  icon: Icon,
  iconColor = "from-purple-500 to-blue-500",
  className,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        className={cn(
          "border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden",
          className
        )}
        {...props}
      >
        {(title || Icon) && (
          <CardHeader className="space-y-4 pb-6">
            {Icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: delay + 0.2 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg"
                style={{
                  boxShadow: iconColor.includes('purple')
                    ? '0 10px 40px -10px rgba(139, 92, 246, 0.3)'
                    : '0 10px 40px -10px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
            )}

            {title && (
              <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">
                {title}
              </CardTitle>
            )}

            {description && (
              <CardDescription className="text-base text-slate-400 text-center">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Progress indicator for multi-step onboarding
 */
export function OnboardingProgress({ current, total, steps }) {
  const progress = ((current - 1) / (total - 1)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Paso {current} de {total}
        </span>
        <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
      </div>

      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        />
      </div>

      {steps && (
        <div className="flex justify-between gap-2">
          {steps.map((step, index) => {
            const isActive = index + 1 === current;
            const isCompleted = index + 1 < current;

            return (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive ? '#8B5CF6' : isCompleted ? '#10B981' : '#334155'
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <step.icon className="w-4 h-4 text-white" />
                </motion.div>
                <span className={cn(
                  "text-xs font-medium hidden md:block",
                  isActive ? "text-purple-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Navigation buttons for onboarding flow
 */
export function OnboardingNavigation({
  current,
  total,
  onBack,
  onNext,
  loading,
  backLabel = "Atrás",
  nextLabel = "Continuar",
  completeLabel = "Comenzar"
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-6 border border-slate-800/50 rounded-xl bg-slate-900/50 backdrop-blur-sm">
      <button
        onClick={onBack}
        disabled={current === 1 || loading}
        className={cn(
          "h-12 px-6 rounded-lg border transition-all duration-200 flex items-center gap-2",
          "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {backLabel}
      </button>

      <div className="text-sm text-slate-400">
        {current < total ? (
          <span>Paso {current} de {total}</span>
        ) : (
          <span className="text-emerald-400">¡Configuración completa!</span>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        className={cn(
          "h-12 px-6 rounded-lg bg-gradient-to-r font-semibold text-white shadow-lg transition-all duration-200 flex items-center gap-2",
          current < total
            ? "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-purple-500/25"
            : "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-emerald-500/25",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            {current < total ? nextLabel : completeLabel}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

/**
 * Goal selection card for onboarding
 */
export function GoalSelectionCard({
  goals,
  selectedGoals,
  onToggle,
  maxSelections = 3
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map((goal) => {
        const isSelected = selectedGoals.includes(goal.id);
        const isDisabled = selectedGoals.length >= maxSelections && !isSelected;

        return (
          <motion.button
            key={goal.id}
            onClick={() => !isDisabled && onToggle(goal.id)}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.02, y: -4 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-200 text-left",
              "bg-slate-800/30 backdrop-blur-sm",
              isSelected
                ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                : "border-slate-700/50 hover:border-slate-600",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-3xl">{goal.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
