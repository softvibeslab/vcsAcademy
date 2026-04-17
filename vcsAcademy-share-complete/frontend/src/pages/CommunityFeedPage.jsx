/**
 * Community Feed Page - Skool-style Community
 *
 * Feature 8: Social community feed with posts, reactions, and online members
 * - New post input with rich options
 * - 5 mock posts (win, question, announcement)
 * - Reactions (likes, comments)
 * - Tags/categories
 * - Sidebar with online members
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, MoreVertical,
  TrendingUp, HelpCircle, Trophy, Flame, Users, Crown, Star,
  ThumbsUp, PartyPopper, Lightbulb, Target, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// MOCK DATA
// ============================================
const currentUser = {
  id: 'current-user',
  name: 'Tu Nombre',
  avatar: 'TN',
  role: 'admin'
};

const onlineMembers = [
  { id: 1, name: 'María González', avatar: 'MG', role: 'member', online: true },
  { id: 2, name: 'Carlos Ruiz', avatar: 'CR', role: 'vip', online: true },
  { id: 3, name: 'Ana Martínez', avatar: 'AM', role: 'member', online: true },
  { id: 4, name: 'Pedro Sánchez', avatar: 'PS', role: 'moderator', online: true },
  { id: 5, name: 'Laura Díaz', avatar: 'LD', role: 'vip', online: true },
  { id: 6, name: 'Roberto López', avatar: 'RL', role: 'member', online: true },
  { id: 7, name: 'Carmen Vega', avatar: 'CV', role: 'member', online: true },
  { id: 8, name: 'Miguel Ángel', avatar: 'MA', role: 'vip', online: true }
];

const mockPosts = [
  {
    id: 1,
    author: { id: 2, name: 'Carlos Ruiz', avatar: 'CR', role: 'vip' },
    type: 'win',
    content: `¡Celebro mi primera venta de $5,000! 🎉

Después de 3 meses aplicando el framework del módulo de negociación, cerré mi primer cliente de alto ticket.

Lo que funcionó:
- Enfoque total en el resultado, no en el producto
- Seguimiento persistente sin ser invasivo
- Demostración de ROI específico ($50k en ahorros anuales)

Gracias a esta comunidad por el apoyo!`,
    likes: 47,
    comments: 12,
    likedByMe: false,
    timestamp: 'Hace 2 horas',
    tags: ['ventas', 'celebración'],
    featured: true
  },
  {
    id: 2,
    author: { id: 3, name: 'Ana Martínez', avatar: 'AM', role: 'member' },
    type: 'question',
    content: `¿Cómo manejan objeciones de precio en servicios B2B?

Tengo un prospecto interesado pero dice que mi precio de $3,000 es "muy alto" comparado con competitors que cobran $500.

El servicio es consultoría de optimización de procesos. He demostrado ROI pero siguen resistiéndose.

¿Alguna técnica específica que funcione?`,
    likes: 23,
    comments: 34,
    likedByMe: false,
    timestamp: 'Hace 4 horas',
    tags: ['objeciones', 'precio', 'b2b'],
    featured: false
  },
  {
    id: 3,
    author: { id: 'admin', name: 'Academia VCSA', avatar: 'VA', role: 'admin' },
    type: 'announcement',
    content: `🚀 NUEVO MÓDULO: "Storytelling para Ventas"

Hola comunidad,

Estamos emocionados de anunciar el lanzamiento de nuestro nuevo módulo exclusivo VIP.

**Lo que aprenderás:**
- Estructuras narrativas que venden
- El "Hero's Journey" aplicado a sales
- Casos de estudio de $100k+

**Disponible para:** Miembros VIP
**Fecha:** Lunes 20 de marzo
**Duración:** 6 lecciones + 3 workshops en vivo

¿Preguntas? Déjalas aquí! 👇`,
    likes: 89,
    comments: 28,
    likedByMe: true,
    timestamp: 'Hace 1 día',
    tags: ['anuncio', 'vip'],
    featured: true,
    pinned: true
  },
  {
    id: 4,
    author: { id: 4, name: 'Pedro Sánchez', avatar: 'PS', role: 'moderator' },
    type: 'tip',
    content: `💡 Tip del día: La regla del "3 sí"

En tu próxima llamada, busca que el cliente diga "sí" 3 veces antes de presentar tu propuesta:

1. "¿Te gustaría mejorar [X resultado]?" → Sí
2. "¿Si pudieras reducir [Y problema], valdría la pena?" → Sí
3. "¿Estás abierto a explorar soluciones?" → Sí

Cuando llegues al precio, ya están mentalmente comprometidos.

Funciona el 80% de las veces. Pruébalo!`,
    likes: 156,
    comments: 41,
    likedByMe: true,
    timestamp: 'Hace 2 días',
    tags: ['tips', 'técnica'],
    featured: false
  },
  {
    id: 5,
    author: { id: 5, name: 'Laura Díaz', avatar: 'LD', role: 'vip' },
    type: 'win',
    content: `De $2,000 a $12,000 por cliente

Mi mayor breakthrough del año: Deje de vender "horas" y empecé a vender "resultados".

Antes: "Te ayudo 10 horas con tu estrategia"
Ahora: "Implemento un sistema que te genera $50k extra en 90 días"

Mismo trabajo, precio 6x mayor. La diferencia es el packaging del mensaje.`,
    likes: 203,
    comments: 56,
    likedByMe: false,
    timestamp: 'Hace 3 días',
    tags: ['breakthrough', 'pricing'],
    featured: true
  }
];

// ============================================
// POST TYPE CONFIG
// ============================================
const postTypeConfig = {
  win: {
    icon: Trophy,
    label: 'Celebración',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  question: {
    icon: HelpCircle,
    label: 'Pregunta',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  },
  announcement: {
    icon: AnnouncementIcon,
    label: 'Anuncio',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }
};

// ============================================
// NEW POST INPUT
// ============================================
function NewPostInput() {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('post');
  const [isFocused, setIsFocused] = useState(false);

  const postTypes = [
    { id: 'post', icon: MessageCircle, label: 'Post' },
    { id: 'win', icon: Trophy, label: 'Celebración' },
    { id: 'question', icon: HelpCircle, label: 'Pregunta' },
    { id: 'tip', icon: Lightbulb, label: 'Tip' }
  ];

  const handlePost = () => {
    if (!content.trim()) {
      toast.error('Escribe algo para publicar');
      return;
    }

    toast.success('Post publicado', {
      description: 'Tu contenido ahora es visible en la comunidad',
      duration: 2000
    });

    setContent('');
    setSelectedType('post');
    setIsFocused(false);
  };

  return (
    <Card className={cn(
      "border-slate-800/50 bg-slate-900/50 transition-all duration-200",
      isFocused && "border-purple-500/50 ring-2 ring-purple-500/20"
    )}>
      <CardContent className="p-4">
        <div className="flex gap-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Comparte algo con la comunidad..."
              rows={3}
              className="bg-slate-800/50 border-slate-700 resize-none text-sm"
            />

            {/* Post Type Selector */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-1">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        selectedType === type.id
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              <div className="flex-1" />

              <Button
                onClick={handlePost}
                disabled={!content.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4 mr-1" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// POST CARD
// ============================================
function PostCard({ post, onLike, onComment, onShare }) {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: { name: 'María G.', avatar: 'MG' }, content: '¡Increíble! 🎉', likes: 5 },
    { id: 2, author: { name: 'Juan P.', avatar: 'JP' }, content: 'Bien hecho, sigue así!', likes: 3 }
  ]);

  const TypeIcon = postTypeConfig[post.type]?.icon || MessageCircle;
  const typeConfig = postTypeConfig[post.type];

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    setComments(prev => [...prev, {
      id: Date.now(),
      author: { name: currentUser.name, avatar: currentUser.avatar },
      content: commentInput,
      likes: 0
    }]);

    setCommentInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className={cn(
        "border-slate-800/50 bg-slate-900/50 transition-all duration-200",
        post.featured && "border-purple-500/30 shadow-lg shadow-purple-500/10"
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={cn(
                "text-white text-sm font-medium",
                post.author.role === 'vip' && "bg-gradient-to-br from-amber-500 to-orange-600",
                post.author.role === 'admin' && "bg-gradient-to-br from-purple-500 to-blue-600",
                post.author.role === 'moderator' && "bg-gradient-to-br from-emerald-500 to-teal-600",
                post.author.role === 'member' && "bg-slate-700"
              )}>
                {post.author.avatar}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white text-sm">{post.author.name}</span>

                {post.author.role === 'vip' && (
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                )}
                {post.author.role === 'admin' && (
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs px-1.5 py-0">Admin</Badge>
                )}
                {post.author.role === 'moderator' && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 text-xs px-1.5 py-0">Mod</Badge>
                )}

                <span className="text-xs text-slate-500">• {post.timestamp}</span>

                {post.pinned && (
                  <Badge className="bg-blue-500/20 text-blue-300 text-xs">Fijado</Badge>
                )}
              </div>

              {/* Post Type Badge */}
              {typeConfig && (
                <Badge variant="outline" className={cn("text-xs mt-1", typeConfig.color)}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {typeConfig.label}
                </Badge>
              )}
            </div>

            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-200 whitespace-pre-line mb-3">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag} className="bg-slate-800/50 text-slate-400 text-xs hover:bg-slate-800 cursor-pointer">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-3 border-t border-slate-800/50">
            <button
              onClick={() => onLike(post.id)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                post.likedByMe ? "text-red-400" : "text-slate-400 hover:text-red-400"
              )}
            >
              <Heart className={cn("w-4 h-4", post.likedByMe && "fill-current")} />
              {post.likes}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                showComments ? "text-blue-400" : "text-slate-400 hover:text-blue-400"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </button>

            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-slate-800/30 bg-slate-900/30 ml-12">
              <CardContent className="p-4 space-y-3">
                {/* Existing Comments */}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-slate-700">
                        {comment.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{comment.author.name}</span>
                      </div>
                      <p className="text-xs text-slate-300">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-blue-600">
                      {currentUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Escribe un comentario..."
                    className="h-8 bg-slate-800/50 border-slate-700 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// ONLINE MEMBERS SIDEBAR
// ============================================
function OnlineMembersSidebar() {
  return (
    <Card className="border-slate-800/50 bg-slate-900/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Miembros online
          </h3>
          <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
            {onlineMembers.length}
          </Badge>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2 pr-4">
            {onlineMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={cn(
                      "text-xs text-white",
                      member.role === 'vip' && "bg-gradient-to-br from-amber-500 to-orange-600",
                      member.role === 'moderator' && "bg-gradient-to-br from-emerald-500 to-teal-600",
                      member.role === 'member' && "bg-slate-700"
                    )}>
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                    {member.name}
                  </p>
                  {member.role === 'vip' && (
                    <p className="text-xs text-amber-400">VIP</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button
          variant="outline"
          className="w-full mt-4 border-slate-700 bg-slate-800/50 text-white text-xs"
        >
          Ver todos los miembros
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function CommunityFeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [filter, setFilter] = useState('all');

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByMe;
        return {
          ...post,
          likedByMe: liked,
          likes: post.likes + (liked ? 1 : -1)
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    // Scroll to comments
    toast.info('Comentarios', {
      description: 'Sección de comentarios',
      duration: 1500
    });
  };

  const handleShare = (postId) => {
    toast.success('Enlace copiado', {
      description: 'El enlace de este post está en tu portapapeles',
      duration: 2000
    });
  };

  const filteredPosts = filter === 'all'
    ? posts
    : filter === 'featured'
    ? posts.filter(p => p.featured)
    : posts.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30"
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Comunidad
              </h1>
              <p className="text-sm text-slate-400">
                Conecta con otros profesionales de ventas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
              {onlineMembers.length} online
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="p-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feed - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Post Input */}
            <NewPostInput />

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                onClick={() => setFilter('all')}
                size="sm"
                variant={filter === 'all' ? 'default' : 'ghost'}
                className={cn(
                  filter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                Todos
              </Button>
              <Button
                onClick={() => setFilter('featured')}
                size="sm"
                variant={filter === 'featured' ? 'default' : 'ghost'}
                className={cn(
                  filter === 'featured' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <Star className="w-4 h-4 mr-1" />
                Destacados
              </Button>
              <Button
                onClick={() => setFilter('win')}
                size="sm"
                variant={filter === 'win' ? 'default' : 'ghost'}
                className={cn(
                  filter === 'win' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Celebraciones
              </Button>
              <Button
                onClick={() => setFilter('question')}
                size="sm"
                variant={filter === 'question' ? 'default' : 'ghost'}
                className={cn(
                  filter === 'question' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Preguntas
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <PostCard
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Online Members */}
            <OnlineMembersSidebar />

            {/* Trending Tags */}
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardContent className="p-4">
                <h3 className="font-medium text-white text-sm mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Temas populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['#ventas', '#objeciones', '#tips', '#celebración', '#pricing'].map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-slate-800/50 text-slate-300 text-sm cursor-pointer hover:bg-slate-800"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-800/50 bg-slate-900/50">
              <CardContent className="p-4">
                <h3 className="font-medium text-white text-sm mb-4">Acciones rápidas</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 bg-slate-800/50 text-white text-sm h-9"
                  >
                    <Target className="w-4 h-4 mr-2 text-emerald-400" />
                    Compartir meta
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 bg-slate-800/50 text-white text-sm h-9"
                  >
                    <PartyPopper className="w-4 h-4 mr-2 text-amber-400" />
                    Celebrar victoria
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-700 bg-slate-800/50 text-white text-sm h-9"
                  >
                    <Award className="w-4 h-4 mr-2 text-purple-400" />
                    Nombrar a alguien
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for announcement icon
function AnnouncementIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ArrowLeft import (if not already)
function ArrowLeft({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
