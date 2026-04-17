import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, DollarSign, Target, BookOpen, TrendingUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const QuickActionsFAB = ({ onAddSale, onSetGoal, onStartTraining, onViewProgress, onOpenAI }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: DollarSign,
      label: 'Add Sale',
      color: 'from-green-500 to-green-600',
      onClick: onAddSale
    },
    {
      icon: Target,
      label: 'Set Goal',
      color: 'from-blue-500 to-blue-600',
      onClick: onSetGoal
    },
    {
      icon: BookOpen,
      label: 'Training',
      color: 'from-purple-500 to-purple-600',
      onClick: onStartTraining
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      color: 'from-orange-500 to-orange-600',
      onClick: onViewProgress
    },
    {
      icon: MessageCircle,
      label: 'AI Coach',
      color: 'from-[#D4AF37] to-[#B4942D]',
      onClick: onOpenAI
    }
  ];

  const handleActionClick = (action) => {
    setIsOpen(false);
    action.onClick();
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <button
                    onClick={() => handleActionClick(action)}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {action.label}
                    </span>

                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center ${
            isOpen
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-br from-[#D4AF37] to-[#B4942D] hover:from-[#C9A432] hover:to-[#A38428]'
          }`}
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Ripple Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-[#D4AF37]/30 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActionsFAB;
