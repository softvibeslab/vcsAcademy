/**
 * ═══════════════════════════════════════════════════════════════
 * App Loading Component
 * ═══════════════════════════════════════════════════════════════
 *
 * Initial app loading component with branding
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import '@/components/loading/AppLoading.css';

export const AppLoading = () => {
  return (
    <div className="app-loading-container">
      <motion.div
        className="app-loading-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="logo-text">VCSA</div>
        </motion.div>

        <motion.div
          className="loading-spinner-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Loader2 className="loading-spinner" aria-hidden="true" />
        </motion.div>

        <motion.p
          className="loading-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          Preparing your experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AppLoading;
