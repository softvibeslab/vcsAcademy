/**
 * Team Settings Section
 *
 * Manage organization members, admins, and invitations
 */

import React, { useState } from 'react';
import { Users, Mail, Crown, Shield, UserPlus, Loader2, Save } from 'lucide-react';

export default function TeamSection({ organization, onSave, saving }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invites, setInvites] = useState([]);

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setInvites([...invites, inviteEmail]);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Team Management</h2>
        <p className="text-muted-foreground">
          Manage organization members and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-bold">{organization.admin_users?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-bold">{organization.limits?.max_managers || 10}</div>
              <div className="text-sm text-muted-foreground">Max Managers</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border/50 bg-background/50">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-bold capitalize">{organization.plan}</div>
              <div className="text-sm text-muted-foreground">Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Users */}
      <div className="p-6 rounded-xl border border-border/50 bg-background/50">
        <h3 className="font-semibold mb-4 flex items-center">
          <Crown className="w-5 h-5 mr-2 text-primary" />
          Organization Admins
        </h3>

        {organization.admin_users?.length > 0 ? (
          <div className="space-y-2">
            {organization.admin_users.map((adminId) => (
              <div
                key={adminId}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/5"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{adminId}</div>
                    <div className="text-xs text-muted-foreground">Administrator</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  Admin
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No admins assigned yet
          </div>
        )}
      </div>

      {/* Invite Members */}
      <div className="p-6 rounded-xl border border-border/50 bg-background/50">
        <h3 className="font-semibold mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-primary" />
          Invite Team Members
        </h3>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendInvite()}
            placeholder="colleague@company.com"
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background"
          />
          <button
            onClick={sendInvite}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Send Invite
          </button>
        </div>

        {invites.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Pending Invitations ({invites.length})
            </div>
            {invites.map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/5"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{email}</span>
                </div>
                <button
                  onClick={() => setInvites(invites.filter((_, i) => i !== index))}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Note:</span> Full team management features will
          be available in the next update. Currently, you can manage admins and send
          invitations through this interface.
        </p>
      </div>
    </div>
  );
}
