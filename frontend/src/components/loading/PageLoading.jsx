/**
 * ═══════════════════════════════════════════════════════════════
 * Page Loading Component
 * ═══════════════════════════════════════════════════════════════
 *
 * Optimized page loading component with animations
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import '@/components/loading/PageLoading.css';

export const PageLoading = () => {
  return (
    <div className="page-loading-container">
      <motion.div
        className="page-loading-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Loader2 className="loading-icon" aria-hidden="true" />
        <p className="loading-text">Loading...</p>
      </motion.div>
    </div>
  );
};

export default PageLoading;
