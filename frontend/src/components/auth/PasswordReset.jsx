/**
 * ═══════════════════════════════════════════════════════════════
 * Password Reset Component
 * ═══════════════════════════════════════════════════════════════
 *
 * Complete password reset system
 *
 * Features:
 * - Forgot password flow
 * - Reset password with token
 * - Password strength validation
 * - Email verification
 * - Security best practices
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiOptimization';
import { toast } from 'sonner';
import { validateEmail, calculatePasswordStrength } from '@/utils/validation';
import '@/components/auth/PasswordReset.css';

export const PasswordReset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request, 2: Reset, 3: Success
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateRequestForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors = {};

    if (!token) {
      newErrors.token = 'Reset token is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else {
      const strength = calculatePasswordStrength(newPassword);
      if (strength.score < 3) {
        newErrors.newPassword = 'Password is too weak';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!validateRequestForm()) return;

    setLoading(true);
    try {
      await apiClient.post('/api/auth/password-reset/request', { email });
      setStep(2);
      toast.success('Reset code sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code');
      console.error('Password reset request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateResetForm()) return;

    setLoading(true);
    try {
      await apiClient.post('/api/auth/password-reset/confirm', {
        email,
        token,
        new_password: newPassword
      });
      setStep(3);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, strength: 'weak' };
    return calculatePasswordStrength(password);
  };

  const renderRequestStep = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="reset-step"
    >
      <div className="step-header">
        <Mail className="step-icon" />
        <h2>Forgot Password?</h2>
        <p>Enter your email address and we'll send you a reset code</p>
      </div>

      <form onSubmit={handleRequestReset} className="reset-form">
        <div className="form-field">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Sending...' : 'Send Reset Code'}
        </Button>
      </form>

      <button
        onClick={() => navigate('/login')}
        className="back-button"
      >
        <ArrowLeft size={16} />
        Back to Login
      </button>
    </motion.div>
  );

  const renderResetStep = () => {
    const strength = getPasswordStrength(newPassword);
    const strengthColors = {
      weak: '#ef4444',
      fair: '#f59e0b',
      good: '#84cc16',
      strong: '#22c55e'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="reset-step"
      >
        <div className="step-header">
          <Lock className="step-icon" />
          <h2>Reset Password</h2>
          <p>Enter the reset code and your new password</p>
        </div>

        <form onSubmit={handleResetPassword} className="reset-form">
          <div className="form-field">
            <Label htmlFor="token">Reset Code</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className={errors.token ? 'error' : ''}
            />
            {errors.token && <span className="error-message">{errors.token}</span>}
          </div>

          <div className="form-field">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="password-input-wrapper">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={errors.newPassword ? 'error' : ''}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength.score / 5) * 100}%`,
                      backgroundColor: strengthColors[strength.strength]
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: strengthColors[strength.strength] }}>
                  Password strength: {strength.strength}
                </span>
              </div>
            )}

            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>

          <div className="form-field">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="password-input-wrapper">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="form-actions">
          <button
            onClick={() => setStep(1)}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Change Email
          </button>
        </div>
      </motion.div>
    );
  };

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="reset-step success-step"
    >
      <div className="success-icon-wrapper">
        <Check className="success-icon" />
      </div>
      <h2>Password Reset Successful!</h2>
      <p>Your password has been reset. You can now login with your new password.</p>

      <Button
        onClick={() => navigate('/login')}
        className="submit-button"
      >
        Go to Login
      </Button>
    </motion.div>
  );

  return (
    <div className="password-reset-container">
      <div className="reset-card">
        <AnimatePresence mode="wait">
          {step === 1 && renderRequestStep()}
          {step === 2 && renderResetStep()}
          {step === 3 && renderSuccessStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PasswordReset;
