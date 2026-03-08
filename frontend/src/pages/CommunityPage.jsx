import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Heart, MessageCircle, Pin, MoreHorizontal,
  User, Image as ImageIcon
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts`, { withCredentials: true });
      setPosts(response.data);
    } catch (error) {
      console.error('Posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setPosting(true);
    try {
      const response = await axios.post(
        `${API}/posts`,
        { content: newPost },
        { withCredentials: true }
      );
      setPosts([response.data, ...posts]);
      setNewPost('');
      toast.success('Posted! +5 points');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${API}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts(posts.map(p => 
        p.post_id === postId 
          ? { ...p, likes: response.data.liked 
              ? [...p.likes, user.user_id] 
              : p.likes.filter(id => id !== user.user_id) 
            }
          : p
      ));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const toggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments({ ...expandedComments, [postId]: false });
      return;
    }

    try {
      const response = await axios.get(
        `${API}/posts/${postId}/comments`,
        { withCredentials: true }
      );
      setComments({ ...comments, [postId]: response.data });
      setExpandedComments({ ...expandedComments, [postId]: true });
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  const handleComment = async (postId) => {
    const content = newComments[postId];
    if (!content?.trim()) return;

    try {
      const response = await axios.post(
        `${API}/comments`,
        { post_id: postId, content },
        { withCredentials: true }
      );
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), response.data]
      });
      setPosts(posts.map(p => 
        p.post_id === postId 
          ? { ...p, comments_count: (p.comments_count || 0) + 1 }
          : p
      ));
      setNewComments({ ...newComments, [postId]: '' });
      toast.success('Comment added! +3 points');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto" data-testid="community-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Community</h1>
          <p className="text-[#94A3B8]">Connect, share wins, and learn from fellow top producers</p>
        </motion.div>

        {/* Create Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 mb-8"
        >
          <form onSubmit={handleCreatePost}>
            <div className="flex gap-4">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
                  <span className="font-medium">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share a win, ask a question, or start a discussion..."
                  className="bg-transparent border-white/10 focus:border-[#D4AF37]/50 min-h-[100px] resize-none"
                  data-testid="new-post-input"
                />
                <div className="flex justify-end mt-3">
                  <Button 
                    type="submit"
                    disabled={posting || !newPost.trim()}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold"
                    data-testid="create-post-btn"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div
                key={post.post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass p-6"
                data-testid={`post-${post.post_id}`}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {post.user_picture ? (
                      <img src={post.user_picture} alt={post.user_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                        <span className="font-medium">{post.user_name?.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{post.user_name}</p>
                      <p className="text-xs text-[#94A3B8]">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  {post.pinned && (
                    <span className="flex items-center gap-1 text-xs text-[#D4AF37]">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-[#F1F5F9] leading-relaxed whitespace-pre-wrap mb-4">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLike(post.post_id)}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors",
                      post.likes?.includes(user?.user_id)
                        ? "text-red-500"
                        : "text-[#94A3B8] hover:text-red-500"
                    )}
                    data-testid={`like-btn-${post.post_id}`}
                  >
                    <Heart className={cn("w-4 h-4", post.likes?.includes(user?.user_id) && "fill-current")} />
                    {post.likes?.length || 0}
                  </button>
                  <button
                    onClick={() => toggleComments(post.post_id)}
                    className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
                    data-testid={`comments-toggle-${post.post_id}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments_count || 0} comments
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[post.post_id] && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                    {/* Existing Comments */}
                    {comments[post.post_id]?.map((comment) => (
                      <div key={comment.comment_id} className="flex gap-3">
                        {comment.user_picture ? (
                          <img src={comment.user_picture} alt={comment.user_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-sm">{comment.user_name?.charAt(0)}</span>
                          </div>
                        )}
                        <div className="flex-1 bg-white/5 p-3 rounded-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.user_name}</span>
                            <span className="text-xs text-[#94A3B8]">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-sm text-[#F1F5F9]">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      {user?.picture ? (
                        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
                          <span className="text-sm">{user?.name?.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComments[post.post_id] || ''}
                          onChange={(e) => setNewComments({ ...newComments, [post.post_id]: e.target.value })}
                          placeholder="Write a comment..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]/50"
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.post_id)}
                          data-testid={`comment-input-${post.post_id}`}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComment(post.post_id)}
                          disabled={!newComments[post.post_id]?.trim()}
                          className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center">
            <MessageCircle className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-[#94A3B8]">Be the first to share with the community!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
