import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Play, Clock, Lock, Crown, Search, 
  Filter, ChevronRight, GraduationCap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { cn } from '@/lib/utils';

const categories = [
  { value: '', label: 'All Content' },
  { value: 'course', label: 'Courses' },
  { value: 'masterclass', label: 'Masterclasses' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'interview', label: 'Interviews' },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = category ? `?category=${category}` : '';
        const response = await axios.get(`${API}/courses${params}`, { withCredentials: true });
        setCourses(response.data);
      } catch (error) {
        console.error('Courses error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (cat) => {
    const colors = {
      course: 'text-blue-400 bg-blue-400/10',
      masterclass: 'text-purple-400 bg-purple-400/10',
      workshop: 'text-orange-400 bg-orange-400/10',
      interview: 'text-green-400 bg-green-400/10',
    };
    return colors[cat] || 'text-[#D4AF37] bg-[#D4AF37]/10';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto" data-testid="courses-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Training Library</h1>
          <p className="text-[#94A3B8]">Master the art of vacation club sales with our structured programs</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-[#0A0A0B] border-white/10 focus:border-[#D4AF37]/50"
              data-testid="courses-search"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? 'default' : 'outline'}
                className={cn(
                  "shrink-0",
                  category === cat.value 
                    ? "bg-[#D4AF37] text-black hover:bg-[#B4942D]" 
                    : "border-white/10 hover:border-[#D4AF37]/50"
                )}
                onClick={() => setCategory(cat.value)}
                data-testid={`filter-${cat.value || 'all'}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.course_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link 
                  to={`/courses/${course.course_id}`}
                  className="glass block group hover:border-[#D4AF37]/30 transition-all overflow-hidden"
                  data-testid={`course-card-${course.course_id}`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-black" fill="black" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={cn("text-xs uppercase tracking-wider px-2 py-1", getCategoryColor(course.category))}>
                        {course.category}
                      </span>
                      {course.vip_only && (
                        <span className="flex items-center gap-1 text-xs bg-[#D4AF37]/90 text-black px-2 py-1">
                          <Crown className="w-3 h-3" /> VIP
                        </span>
                      )}
                    </div>

                    {/* Level Badge */}
                    {course.min_level > 1 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs bg-black/60 backdrop-blur px-2 py-1">
                        <Lock className="w-3 h-3" /> Level {course.min_level}+
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-lg font-medium mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#94A3B8] flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {course.lessons?.length || 0} lessons
                      </span>
                      <span className="text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Start <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass p-12 text-center">
            <BookOpen className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-medium mb-2">No courses found</h3>
            <p className="text-[#94A3B8]">
              {search ? 'Try adjusting your search' : 'Check back soon for new content'}
            </p>
          </div>
        )}

        {/* Upsell for non-VIP */}
        {user?.membership !== 'vip' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 vip-glow" />
            <div className="relative flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Unlock Everything</p>
                <h3 className="font-serif text-2xl font-semibold mb-2">Get VIP Access</h3>
                <p className="text-[#94A3B8]">
                  Unlock all courses, masterclasses, workshops, and premium resources. 
                  Join the elite community of top producers.
                </p>
              </div>
              <Link to="/membership">
                <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider px-8 h-12 glow-gold">
                  <Crown className="w-4 h-4 mr-2" /> Become VIP
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
