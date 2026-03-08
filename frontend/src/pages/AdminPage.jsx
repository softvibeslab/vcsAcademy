import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, Calendar, FileText, 
  Crown, Shield, Plus, Trash2, Edit, 
  TrendingUp, Eye
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnail: '', category: 'course', min_level: 1, vip_only: false });
  const [eventForm, setEventForm] = useState({ title: '', description: '', speaker: '', event_type: 'masterclass', start_time: '', vip_only: false });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', category: 'script', file_url: '', min_level: 1, vip_only: false });
  const [lessonForm, setLessonForm] = useState({ course_id: '', title: '', description: '', video_url: '', duration: 10, order: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { withCredentials: true }),
        axios.get(`${API}/admin/users`, { withCredentials: true }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Admin data error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/courses`, courseForm, { withCredentials: true });
      toast.success('Course created');
      setCourseForm({ title: '', description: '', thumbnail: '', category: 'course', min_level: 1, vip_only: false });
      fetchData();
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/lessons`, lessonForm, { withCredentials: true });
      toast.success('Lesson created');
      setLessonForm({ course_id: '', title: '', description: '', video_url: '', duration: 10, order: 1 });
    } catch (error) {
      toast.error('Failed to create lesson');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/events`, eventForm, { withCredentials: true });
      toast.success('Event created');
      setEventForm({ title: '', description: '', speaker: '', event_type: 'masterclass', start_time: '', vip_only: false });
      fetchData();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/resources`, resourceForm, { withCredentials: true });
      toast.success('Resource created');
      setResourceForm({ title: '', description: '', category: 'script', file_url: '', min_level: 1, vip_only: false });
      fetchData();
    } catch (error) {
      toast.error('Failed to create resource');
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/role`, { role }, { withCredentials: true });
      toast.success('Role updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleUpdateMembership = async (userId, membership) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/membership`, { membership }, { withCredentials: true });
      toast.success('Membership updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update membership');
    }
  };

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
      <div className="max-w-7xl mx-auto" data-testid="admin-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-[#94A3B8]">Manage content, users, and platform settings</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Total Users', value: stats?.stats?.total_users || 0, icon: Users },
            { label: 'VIP Members', value: stats?.stats?.vip_users || 0, icon: Crown },
            { label: 'Courses', value: stats?.stats?.total_courses || 0, icon: BookOpen },
            { label: 'Events', value: stats?.stats?.total_events || 0, icon: Calendar },
            { label: 'Posts', value: stats?.stats?.total_posts || 0, icon: TrendingUp },
            { label: 'Resources', value: stats?.stats?.total_resources || 0, icon: FileText },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 text-center">
              <stat.icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
              <p className="font-mono text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-[#94A3B8]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#0A0A0B] border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
              Content
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="glass p-6">
              <h3 className="font-serif text-lg font-semibold mb-4">Recent Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">User</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Level</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Membership</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recent_users?.slice(0, 5).map((u) => (
                      <tr key={u.user_id} className="border-b border-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.picture ? (
                              <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                                <span className="text-sm">{u.name?.charAt(0)}</span>
                              </div>
                            )}
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#94A3B8]">{u.email}</td>
                        <td className="py-3 px-4">{u.level}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "text-xs px-2 py-1",
                            u.membership === 'vip' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/10 text-[#94A3B8]'
                          )}>
                            {u.membership?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "text-xs px-2 py-1",
                            u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-[#94A3B8]'
                          )}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="glass p-6">
              <h3 className="font-serif text-lg font-semibold mb-4">All Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">User</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Level/Points</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Membership</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-sm text-[#94A3B8] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id} className="border-b border-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.picture ? (
                              <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                                <span className="text-sm">{u.name?.charAt(0)}</span>
                              </div>
                            )}
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#94A3B8] text-sm">{u.email}</td>
                        <td className="py-3 px-4 font-mono text-sm">L{u.level} / {u.points}pts</td>
                        <td className="py-3 px-4">
                          <Select
                            value={u.membership}
                            onValueChange={(value) => handleUpdateMembership(u.user_id, value)}
                          >
                            <SelectTrigger className="w-24 h-8 bg-transparent border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={u.role}
                            onValueChange={(value) => handleUpdateRole(u.user_id, value)}
                          >
                            <SelectTrigger className="w-24 h-8 bg-transparent border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create Course */}
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" /> Create Course
                </h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <Input
                    placeholder="Course Title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    placeholder="Thumbnail URL"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={courseForm.category}
                      onValueChange={(value) => setCourseForm({ ...courseForm, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="masterclass">Masterclass</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={courseForm.min_level.toString()}
                      onValueChange={(value) => setCourseForm({ ...courseForm, min_level: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Min Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((l) => (
                          <SelectItem key={l} value={l.toString()}>Level {l}+</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={courseForm.vip_only}
                      onChange={(e) => setCourseForm({ ...courseForm, vip_only: e.target.checked })}
                      className="rounded"
                    />
                    VIP Only
                  </label>
                  <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D]">
                    <Plus className="w-4 h-4 mr-2" /> Create Course
                  </Button>
                </form>
              </div>

              {/* Create Event */}
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" /> Create Event
                </h3>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <Input
                    placeholder="Event Title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    placeholder="Speaker Name"
                    value={eventForm.speaker}
                    onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    type="datetime-local"
                    value={eventForm.start_time}
                    onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Select
                    value={eventForm.event_type}
                    onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masterclass">Masterclass</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={eventForm.vip_only}
                      onChange={(e) => setEventForm({ ...eventForm, vip_only: e.target.checked })}
                      className="rounded"
                    />
                    VIP Only
                  </label>
                  <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D]">
                    <Plus className="w-4 h-4 mr-2" /> Create Event
                  </Button>
                </form>
              </div>

              {/* Create Resource */}
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" /> Create Resource
                </h3>
                <form onSubmit={handleCreateResource} className="space-y-4">
                  <Input
                    placeholder="Resource Title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    placeholder="File URL"
                    value={resourceForm.file_url}
                    onChange={(e) => setResourceForm({ ...resourceForm, file_url: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={resourceForm.category}
                      onValueChange={(value) => setResourceForm({ ...resourceForm, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="script">Script</SelectItem>
                        <SelectItem value="framework">Framework</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="prompt">AI Prompt</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={resourceForm.min_level.toString()}
                      onValueChange={(value) => setResourceForm({ ...resourceForm, min_level: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Min Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((l) => (
                          <SelectItem key={l} value={l.toString()}>Level {l}+</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={resourceForm.vip_only}
                      onChange={(e) => setResourceForm({ ...resourceForm, vip_only: e.target.checked })}
                      className="rounded"
                    />
                    VIP Only
                  </label>
                  <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D]">
                    <Plus className="w-4 h-4 mr-2" /> Create Resource
                  </Button>
                </form>
              </div>

              {/* Add Lesson */}
              <div className="glass p-6">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" /> Add Lesson to Course
                </h3>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <Input
                    placeholder="Course ID (e.g., course_abc123)"
                    value={lessonForm.course_id}
                    onChange={(e) => setLessonForm({ ...lessonForm, course_id: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    placeholder="Lesson Title"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Textarea
                    placeholder="Description"
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <Input
                    placeholder="Video URL (YouTube/Vimeo)"
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Duration (min)"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) })}
                      className="bg-white/5 border-white/10"
                      min={1}
                    />
                    <Input
                      type="number"
                      placeholder="Order"
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
                      className="bg-white/5 border-white/10"
                      min={1}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#B4942D]">
                    <Plus className="w-4 h-4 mr-2" /> Add Lesson
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
