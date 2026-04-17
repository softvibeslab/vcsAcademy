/**
 * Step 4: Team Invitations
 *
 * Invite team members to join the organization:
 * - Add email addresses
 * - Send invitations
 * - Skip for now
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Plus, X, Send, Users } from 'lucide-react';

export default function TeamStep({ formData, updateFormData, onNext, onBack }) {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState(formData.inviteEmails || []);

  const addEmail = () => {
    const email = emailInput.trim();

    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (emails.includes(email)) {
      alert('This email has already been added');
      return;
    }

    const updatedEmails = [...emails, email];
    setEmails(updatedEmails);
    updateFormData({ inviteEmails: updatedEmails });
    setEmailInput('');
  };

  const removeEmail = (emailToRemove) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(updatedEmails);
    updateFormData({ inviteEmails: updatedEmails });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-bold">Invite Your Team</h2>
        <p className="text-muted-foreground">
          Add team members who should join your academy
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Email Input */}
        <div className="p-6 rounded-xl border border-border/50 bg-background/50">
          <div className="flex items-start space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Team Member Emails</h3>
              <p className="text-sm text-muted-foreground">
                Enter email addresses to send invitations. You can also skip this step and
                invite members later.
              </p>
            </div>
          </div>

          {/* Add Email Form */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="colleague@company.com"
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addEmail}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Email List */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {emails.length} {emails.length === 1 ? 'email' : 'emails'} added
              </div>

              <div className="space-y-2">
                {emails.map((email) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm">{email}</span>
                    </div>

                    <button
                      onClick={() => removeEmail(email)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {emails.length === 0 && (
            <div className="p-8 rounded-lg border-2 border-dashed border-border text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                No emails added yet. Add team member emails above.
              </p>
            </div>
          )}
        </div>

        {/* Invitation Info */}
        <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
          <div className="flex items-start space-x-3">
            <Send className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="font-medium">What happens next:</span> Invitations will be
                sent when you complete setup. Team members will receive an email with a
                link to join your academy.
              </p>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can always invite more team members later from the settings page.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
