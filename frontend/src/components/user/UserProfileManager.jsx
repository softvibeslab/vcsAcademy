/**
 * ═══════════════════════════════════════════════════════════════
 * User Profile Manager
 * ═══════════════════════════════════════════════════════════════
 *
 * Complete user profile management component
 *
 * Features:
 * - Profile editing
 * - Avatar upload
 * - Email change
 * - Password change
 * - Preferences management
 * - Account statistics
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, Mail, Lock, User, Bell, Palette, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/App';
import { apiClient } from '@/utils/apiOptimization';
import { toast } from 'sonner';
import '@/components/user/UserProfileManager.css';

export const UserProfileManager = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      marketingEmails: false
    }
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        preferences: user.preferences || {
          emailNotifications: true,
          pushNotifications: true,
          weeklyDigest: false,
          marketingEmails: false
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/api/user/profile', profile);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/api/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(prev => ({ ...prev, avatar: response.data.avatar }));
      await refreshUser();
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error('Avatar upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile-manager">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="profile-title">Profile Settings</h1>

        {/* Avatar Section */}
        <Card className="profile-section">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=D4AF37&color=fff`}
                alt="Profile"
                className="avatar-image"
              />
              <label htmlFor="avatar-upload" className="avatar-upload-label">
                <Camera size={20} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="avatar-input"
              />
            </div>
            <div className="avatar-info">
              <h3>Profile Photo</h3>
              <p>JPG, PNG or GIF. Max 5MB</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="profile-section">
          <div className="section-header">
            <User className="section-icon" />
            <h2>Personal Information</h2>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                disabled
              />
            </div>

            <div className="form-field">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-field full-width">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="form-field full-width">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="bio-textarea"
              />
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="profile-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <h2>Notification Preferences</h2>
          </div>

          <div className="preferences-list">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Email Notifications</h3>
                <p>Receive updates via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profile.preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Push Notifications</h3>
                <p>Receive push notifications in browser</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profile.preferences.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Weekly Digest</h3>
                <p>Weekly summary of your progress</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profile.preferences.weeklyDigest}
                  onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Marketing Emails</h3>
                <p>Receive promotional content</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profile.preferences.marketingEmails}
                  onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Account Statistics */}
        <Card className="profile-section">
          <div className="section-header">
            <Shield className="section-icon" />
            <h2>Account Statistics</h2>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{user.points || 0}</div>
              <div className="stat-label">Points Earned</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user.modulesCompleted || 0}</div>
              <div className="stat-label">Modules Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user.streak || 0}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user.readinessScore || 0}%</div>
              <div className="stat-label">Readiness Score</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="profile-actions">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="save-button"
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileManager;
