import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Trophy, Clock, Target,
  ChevronRight, BarChart3, UserPlus, Settings,
  Crown, Briefcase, Star, Play
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Role hierarchy for UI display
const ROLE_LABELS = {
  rep: 'Sales Rep',
  manager: 'Team Manager',
  director: 'Director',
  org_admin: 'Organization Admin',
  admin: 'System Admin',
};

const ROLE_COLORS = {
  rep: 'text-[#94A3B8]',
  manager: 'text-blue-400',
  director: 'text-purple-400',
  org_admin: 'text-amber-400',
  admin: 'text-[#D4AF37]',
};

export default function ManagerDashboardPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamProgress, setTeamProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API}/teams`, { withCredentials: true });
      setTeams(response.data);
      if (response.data.length > 0) {
        setSelectedTeam(response.data[0]);
      }
    } catch (error) {
      console.error('Teams error:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamProgress = async (teamId) => {
    try {
      const response = await axios.get(`${API}/teams/${teamId}/progress`, { withCredentials: true });
      setTeamProgress(response.data);
    } catch (error) {
      console.error('Team progress error:', error);
      toast.error('Failed to load team progress');
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamProgress(selectedTeam.team_id);
    }
  }, [selectedTeam]);

  const isManager = user?.role === 'manager';
  const isDirector = user?.role === 'director' || user?.role === 'admin';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold">
              <span className={ROLE_COLORS[user?.role] || 'text-white'}>
                {ROLE_LABELS[user?.role] || 'Manager'}
              </span>
              {' '}Dashboard
            </h1>
            <p className="text-[#94A3B8] mt-1">
              {isManager ? 'Manage your team and track progress' : 'Oversee all teams and performance'}
            </p>
          </div>
          
          {isDirector && (
            <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          )}
        </motion.div>

        {/* Team Selector */}
        {teams.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Select
              value={selectedTeam?.team_id}
              onValueChange={(value) => {
                const team = teams.find(t => t.team_id === value);
                setSelectedTeam(team);
              }}
            >
              <SelectTrigger className="w-full max-w-md bg-[#0A0A0C] border-white/10">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.team_id} value={team.team_id}>
                    {team.name} ({team.members?.length || 0} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Stats Overview */}
        {teamProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="bg-[#0A0A0C] border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">Team Members</p>
                    <p className="text-2xl font-bold mt-1">{teamProgress.members?.length || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0C] border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">Avg. Progress</p>
                    <p className="text-2xl font-bold mt-1">
                      {teamProgress.members?.length > 0 
                        ? Math.round(teamProgress.members.reduce((acc, m) => acc + (m.progress?.completion_percentage || 0), 0) / teamProgress.members.length)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0C] border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">Active Streaks</p>
                    <p className="text-2xl font-bold mt-1">
                      {teamProgress.members?.filter(m => (m.progress?.current_streak || 0) > 0).length || 0}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0C] border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94A3B8] text-sm">Ready for Floor</p>
                    <p className="text-2xl font-bold mt-1">
                      {teamProgress.members?.filter(m => (m.progress?.readiness_score || 0) >= 70).length || 0}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#0A0A0C] border border-white/10">
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="progress">Individual Progress</TabsTrigger>
            {isDirector && <TabsTrigger value="settings">Team Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Team Members Grid */}
            {teamProgress?.members?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamProgress.members.map((member, index) => (
                  <motion.div
                    key={member.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[#0A0A0C] border-white/10 hover:border-[#D4AF37]/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
                              <span className="text-black font-bold text-sm">
                                {member.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-[#94A3B8]">{member.email}</p>
                            </div>
                          </div>
                          <div className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            (member.progress?.readiness_score || 0) >= 70 
                              ? "bg-green-500/20 text-green-400" 
                              : (member.progress?.readiness_score || 0) >= 40
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                          )}>
                            {member.progress?.readiness_score?.toFixed(0) || 0}% Ready
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#94A3B8]">Overall Progress</span>
                              <span>{member.progress?.completion_percentage?.toFixed(0) || 0}%</span>
                            </div>
                            <Progress 
                              value={member.progress?.completion_percentage || 0} 
                              className="h-2 bg-white/5"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-[#94A3B8]">
                              <Trophy className="w-4 h-4" />
                              <span>Level {member.level || 1}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#94A3B8]">
                              <Star className="w-4 h-4" />
                              <span>{member.points || 0} pts</span>
                            </div>
                            {(member.progress?.current_streak || 0) > 0 && (
                              <div className="flex items-center gap-1 text-amber-400">
                                <Clock className="w-4 h-4" />
                                <span>{member.progress.current_streak} day streak</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-[#0A0A0C] border-white/10">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-[#94A3B8] mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
                  <p className="text-[#94A3B8] mb-4">
                    {isDirector 
                      ? 'Create a team and add members to get started'
                      : 'Your team hasn\'t been set up yet. Contact your director.'
                    }
                  </p>
                  {isDirector && (
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Team Members
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {/* Detailed Progress Table */}
            {teamProgress?.members?.length > 0 ? (
              <Card className="bg-[#0A0A0C] border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                    Individual Progress Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-[#94A3B8] font-medium">Name</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Videos</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Tracks</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Quick Wins</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Breakdowns</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Streak</th>
                          <th className="text-center py-3 px-4 text-[#94A3B8] font-medium">Readiness</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamProgress.members.map((member) => (
                          <tr key={member.user_id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
                                  <span className="text-black font-bold text-xs">
                                    {member.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span>{member.name}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">
                              {member.progress?.videos_completed || 0}
                            </td>
                            <td className="text-center py-3 px-4">
                              {member.progress?.tracks_completed || 0}/6
                            </td>
                            <td className="text-center py-3 px-4">
                              {member.progress?.quick_wins_applied || 0}
                            </td>
                            <td className="text-center py-3 px-4">
                              {member.progress?.breakdowns_reviewed || 0}
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={cn(
                                (member.progress?.current_streak || 0) > 0 ? "text-amber-400" : "text-[#94A3B8]"
                              )}>
                                {member.progress?.current_streak || 0} days
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                (member.progress?.readiness_score || 0) >= 70 
                                  ? "bg-green-500/20 text-green-400" 
                                  : (member.progress?.readiness_score || 0) >= 40
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-red-500/20 text-red-400"
                              )}>
                                {member.progress?.readiness_score?.toFixed(0) || 0}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-[#0A0A0C] border-white/10">
                <CardContent className="py-12 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-[#94A3B8] mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Progress Data</h3>
                  <p className="text-[#94A3B8]">
                    Add team members to start tracking their progress
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isDirector && (
            <TabsContent value="settings" className="space-y-4">
              {/* Team Settings */}
              {selectedTeam && (
                <Card className="bg-[#0A0A0C] border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#D4AF37]" />
                      Team Settings: {selectedTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-[#94A3B8] mb-2 block">Team Name</label>
                        <input
                          type="text"
                          defaultValue={selectedTeam.name}
                          className="w-full bg-[#020204] border border-white/10 rounded-lg px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#94A3B8] mb-2 block">Team Manager</label>
                        <Select defaultValue={selectedTeam.manager_id}>
                          <SelectTrigger className="bg-[#0A0A0C] border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedTeam.manager_id}>
                              {teamProgress?.members?.find(m => m.user_id === selectedTeam.manager_id)?.name || 'Current Manager'}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-[#94A3B8] mb-2 block">Description</label>
                      <textarea
                        defaultValue={selectedTeam.description || ''}
                        placeholder="Team description..."
                        className="w-full bg-[#020204] border border-white/10 rounded-lg px-4 py-2 min-h-[100px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
                        Save Changes
                      </Button>
                      <Button variant="outline" className="border-white/10">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* No Teams State */}
        {teams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-[#0A0A0C] border-white/10">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 mx-auto text-[#94A3B8] mb-4" />
                <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                <p className="text-[#94A3B8] mb-4">
                  {isDirector 
                    ? 'Create your first team to start managing sales reps'
                    : 'You haven\'t been assigned to a team yet. Contact your director.'
                  }
                </p>
                {isDirector && (
                  <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
