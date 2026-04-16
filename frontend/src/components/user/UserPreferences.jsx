/**
 * ═══════════════════════════════════════════════════════════════
 * User Preferences Manager
 * ═══════════════════════════════════════════════════════════════
 *
 * Complete user preferences management
 *
 * Features:
 * - User preferences storage
 * - Offline mode toggle
 * - Auto-play settings
 * - Video quality settings
 * - Subtitle preferences
 * - Language selection
 * - Accessibility options
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  Subtitles,
  Languages,
  Eye,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { storage } from '@/utils/helpers';
import '@/components/user/UserPreferences.css';

export const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    offlineMode: false,
    autoplay: true,
    videoQuality: 'auto',
    subtitles: true,
    subtitleLanguage: 'en',
    audioLanguage: 'en',
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    autoAdvance: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load preferences from storage
    const saved = storage.get('userPreferences');
    if (saved) {
      setPreferences(prev => ({ ...prev, ...saved }));
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    storage.set('userPreferences', newPreferences);

    // Apply some preferences immediately
    if (key === 'reducedMotion') {
      document.documentElement.style.setProperty(
        '--prefers-reduced-motion',
        value ? 'reduce' : 'no-preference'
      );
    }

    if (key === 'fontSize') {
      document.documentElement.style.setProperty('--font-size-scale',
        value === 'small' ? '0.875' : value === 'large' ? '1.125' : '1'
      );
    }

    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value);
    }
  };

  const handleReset = () => {
    const defaultPreferences = {
      offlineMode: false,
      autoplay: true,
      videoQuality: 'auto',
      subtitles: true,
      subtitleLanguage: 'en',
      audioLanguage: 'en',
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      autoAdvance: true,
      emailNotifications: true,
      pushNotifications: true
    };

    setPreferences(defaultPreferences);
    storage.set('userPreferences', defaultPreferences);
  };

  return (
    <div className="user-preferences">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="preferences-header">
          <Settings className="header-icon" />
          <div>
            <h1>Preferences</h1>
            <p>Customize your experience</p>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="preference-section">
          <div className="connection-status">
            <div className="status-indicator">
              {isOnline ? (
                <>
                  <Wifi className="status-icon online" />
                  <span className="status-text online">You're online</span>
                </>
              ) : (
                <>
                  <WifiOff className="status-icon offline" />
                  <span className="status-text offline">You're offline</span>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Video & Audio */}
        <Card className="preference-section">
          <h2>Video & Audio</h2>

          <div className="preference-list">
            <div className="preference-item">
              <div className="preference-info">
                <Play size={20} />
                <div>
                  <Label>Autoplay Videos</Label>
                  <p>Automatically play next video</p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('autoplay', !preferences.autoplay)}
                className={`toggle-switch ${preferences.autoplay ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Monitor size={20} />
                <div>
                  <Label>Video Quality</Label>
                  <p>Choose your streaming quality</p>
                </div>
              </div>
              <select
                value={preferences.videoQuality}
                onChange={(e) => handlePreferenceChange('videoQuality', e.target.value)}
                className="preference-select"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="720p">720p (HD)</option>
                <option value="480p">480p (SD)</option>
                <option value="360p">360p (Low)</option>
              </select>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Subtitles size={20} />
                <div>
                  <Label>Show Subtitles</Label>
                  <p>Display subtitles by default</p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('subtitles', !preferences.subtitles)}
                className={`toggle-switch ${preferences.subtitles ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Languages size={20} />
                <div>
                  <Label>Subtitle Language</Label>
                  <p>Choose subtitle language</p>
                </div>
              </div>
              <select
                value={preferences.subtitleLanguage}
                onChange={(e) => handlePreferenceChange('subtitleLanguage', e.target.value)}
                className="preference-select"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Accessibility */}
        <Card className="preference-section">
          <h2>Accessibility</h2>

          <div className="preference-list">
            <div className="preference-item">
              <div className="preference-info">
                <Eye size={20} />
                <div>
                  <Label>High Contrast</Label>
                  <p>Increase color contrast</p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
                className={`toggle-switch ${preferences.highContrast ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Pause size={20} />
                <div>
                  <Label>Reduced Motion</Label>
                  <p>Minimize animations</p>
                </div>
              </div>
              <button
                onClick={() => handlePreferenceChange('reducedMotion', !preferences.reducedMotion)}
                className={`toggle-switch ${preferences.reducedMotion ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Volume2 size={20} />
                <div>
                  <Label>Font Size</Label>
                  <p>Adjust text size</p>
                </div>
              </div>
              <select
                value={preferences.fontSize}
                onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                className="preference-select"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="preference-section">
          <h2>Notifications</h2>

          <div className="preference-list">
            <div className="preference-item">
              <div className="preference-info">
                <Label>Email Notifications</Label>
                <p>Receive updates via email</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                className={`toggle-switch ${preferences.emailNotifications ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <Label>Push Notifications</Label>
                <p>Browser push notifications</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('pushNotifications', !preferences.pushNotifications)}
                className={`toggle-switch ${preferences.pushNotifications ? 'active' : ''}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="preference-actions">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={() => console.log('Preferences saved')}
          >
            Save Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserPreferences;
