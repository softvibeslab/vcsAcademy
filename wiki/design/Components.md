# UI Components

Complete reference for all UI components in VCSA, using shadcn/ui and custom components.

## 📚 Component Library

VCSA uses **shadcn/ui** as the base component library, styled with Tailwind CSS and the VCSA dark luxury design system.

---

## 🎨 shadcn/ui Components

All shadcn/ui components are located in `frontend/src/components/ui/`.

### Button

```jsx
import { Button } from "@/components/ui/button";

// Primary action (gold)
<Button className="bg-[#D4AF37] hover:bg-[#B8962E]">
  Get Started
</Button>

// Secondary action (navy)
<Button variant="secondary" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80">
  Learn More
</Button>

// Outline action
<Button variant="outline">
  Cancel
</Button>

// Ghost action (subtle)
<Button variant="ghost">
  Skip
</Button>
```

**Sizes**: `default`, `sm`, `lg`, `icon`

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

---

### Card

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card className="border-white/10 bg-[#020204]">
  <CardHeader>
    <CardTitle>Pro Mindset Track</CardTitle>
    <CardDescription>Master the psychology of sales success</CardDescription>
  </CardHeader>
  <CardContent>
    <p>6 modules • 2 hours 15 minutes</p>
  </CardContent>
  <CardFooter>
    <Button>Start Track</Button>
  </CardFooter>
</Card>
```

---

### Badge

```jsx
import { Badge } from "@/components/ui/badge";

// Stage badge
<Badge className="bg-[#10B981]">Stage 1: New Rep</Badge>

// VIP badge
<Badge variant="secondary" className="bg-[#D4AF37] text-black">
  VIP Member
</Badge>

// Status badge
<Badge variant="outline">In Progress</Badge>
```

---

### Progress

```jsx
import { Progress } from "@/components/ui/progress";

// Readiness score
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-[#94A3B8]">Readiness Score</span>
    <span className="text-[#F1F5F9]">65%</span>
  </div>
  <Progress value={65} className="h-2" />
</div>
```

---

### Tabs

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="modules" className="w-full">
  <TabsList className="bg-[#0A0A0F] border border-white/10">
    <TabsTrigger value="modules">Modules</TabsTrigger>
    <TabsTrigger value="breakdowns">Deal Breakdowns</TabsTrigger>
    <TabsTrigger value="quickwins">Quick Wins</TabsTrigger>
  </TabsList>

  <TabsContent value="modules">
    {/* Module content */}
  </TabsContent>

  <TabsContent value="breakdowns">
    {/* Breakdown content */}
  </TabsContent>

  <TabsContent value="quickwins">
    {/* Quick wins content */}
  </TabsContent>
</Tabs>
```

---

### Dialog

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="bg-[#020204] border-white/10">
    <DialogHeader>
      <DialogTitle>Complete Module</DialogTitle>
    </DialogHeader>
    <div className="py-4">
      <p>Are you sure you want to mark this module as complete?</p>
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button className="bg-[#D4AF37]">Complete</Button>
    </div>
  </DialogContent>
</Dialog>
```

---

### Dropdown Menu

```jsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-[#0A0A0F] border-white/10">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Form Components

```jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Text input
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="bg-[#0A0A0F] border-white/10"
  />
</div>

// Textarea
<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    placeholder="Type your message..."
    className="bg-[#0A0A0F] border-white/10"
  />
</div>

// Select
<Select>
  <SelectTrigger className="bg-[#0A0A0F] border-white/10">
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
  <SelectContent className="bg-[#0A0A0F] border-white/10">
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="member">Member</SelectItem>
  </SelectContent>
</Select>

// Checkbox
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

---

### Alert / Toast

```jsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from "@/components/ui/toast";

// Alert
<Alert className="bg-[#0A0A0F] border-white/10">
  <AlertDescription>
    You've unlocked a new badge!
  </AlertDescription>
</Alert>

// Toast
const { toast } = useToast();

toast({
  title: "Module completed!",
  description: "You earned 10 points",
  variant: "default",
});
```

---

### Skeleton Loading

```jsx
import { Skeleton } from "@/components/ui/skeleton";

// Loading card
<div className="space-y-3">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-12 w-[120px]" />
</div>
```

---

## 🎭 Custom Components

### DashboardLayout

Main layout wrapper for dashboard pages.

```jsx
import DashboardLayout from "@/components/layout/DashboardLayout";

function MyPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
}
```

**Props**:
- `children`: React children

**Features**:
- Navigation sidebar
- Header with user menu
- Responsive design
- Protected route wrapper

---

### StageBadge

Display user's current stage with icon and color.

```jsx
function StageBadge({ stage }) {
  const stages = {
    1: { name: "New Rep", icon: "🌱", color: "#10B981" },
    2: { name: "Developing Rep", icon: "📈", color: "#3B82F6" },
    3: { name: "Performing Rep", icon: "⚡", color: "#F59E0B" },
    4: { name: "Top Producer", icon: "👑", color: "#D4AF37" }
  };

  const { name, icon, color } = stages[stage];

  return (
    <Badge className="text-sm" style={{ backgroundColor: color }}>
      {icon} {name}
    </Badge>
  );
}
```

---

### ReadinessScore

Display readiness score with progress ring.

```jsx
function ReadinessScore({ score }) {
  return (
    <div className="relative w-32 h-32">
      <svg className="transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-[#0A0A0F]"
        />
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(score / 100) * 352} 352`}
          className="text-[#D4AF37]"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold">{score}%</span>
      </div>
    </div>
  );
}
```

---

### VideoPlayer

YouTube/Vimeo video embed with custom styling.

```jsx
function VideoPlayer({ videoUrl, title }) {
  const embedUrl = convertToEmbedUrl(videoUrl);

  return (
    <div className="aspect-video bg-[#0A0A0F] rounded-lg overflow-hidden border border-white/10">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function convertToEmbedUrl(url) {
  // Convert YouTube watch URL to embed URL
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Convert YouTube short URL to embed URL
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Convert Vimeo URL to embed URL
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1].split("?")[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}
```

---

### BookmarkButton

Toggle bookmark with tag selection.

```jsx
import { useState } from "state";
import { Bookmark } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

function BookmarkButton({ contentId, contentType, isBookmarked }) {
  const [tags, setTags] = useState([]);

  const handleBookmark = async () => {
    await fetch("/api/development/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        content_id: contentId,
        content_type: contentType,
        tags: tags
      })
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bookmark className={isBookmarked ? "fill-current" : ""} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#020204] border-white/10">
        <DialogHeader>
          <DialogTitle>Save for Later</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[#94A3B8]">Select tags to organize your bookmark:</p>

          <div className="space-y-2">
            {["before_tour", "closing_help", "objections", "value_build"].map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={tags.includes(tag)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTags([...tags, tag]);
                    } else {
                      setTags(tags.filter(t => t !== tag));
                    }
                  }}
                />
                <Label htmlFor={tag} className="capitalize">{tag.replace("_", " ")}</Label>
              </div>
            ))}
          </div>

          <Button onClick={handleBookmark} className="w-full bg-[#D4AF37]">
            Save Bookmark
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎨 Styling Guidelines

### Colors

```css
/* Backgrounds */
.bg-primary        { background-color: #020204; }
.bg-secondary      { background-color: #0A0A0F; }
.bg-accent         { background-color: #D4AF37; } /* Gold - use sparingly */
.bg-navy          { background-color: #1E3A8A; }

/* Text */
.text-primary      { color: #F1F5F9; }
.text-secondary    { color: #94A3B8; }
.text-accent       { color: #D4AF37; }

/* Borders */
.border-default    { border-color: rgba(255, 255, 255, 0.1); }
.border-light      { border-color: rgba(255, 255, 255, 0.05); }
```

### Typography

```jsx
{/* Headings - Playfair Display */}
<h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#F1F5F9]">
  Page Title
</h1>

<h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#F1F5F9]">
  Section Title
</h2>

{/* Body - DM Sans */}
<p className="font-['DM_Sans'] text-base text-[#94A3B8]">
  Body text goes here
</p>

{/* Data/Code - JetBrains Mono */}
<code className="font-['JetBrains_Mono'] text-sm">
  const data = "value";
</code>
```

### Spacing

```jsx
{/* Use generous spacing */}
<div className="space-y-8">  {/* Large vertical gaps */}
  {/* Content */}
</div>

<div className="space-y-4">  {/* Medium vertical gaps */}
  {/* Content */}
</div>

<div className="space-x-4">  {/* Horizontal gaps */}
  {/* Content */}
</div>
```

---

## 🧩 Component Patterns

### Card with Hover Effect

```jsx
<Card className="group border-white/10 bg-[#020204] transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-[#D4AF37]/10">
  <CardContent className="p-6">
    {/* Card content */}
  </CardContent>
</Card>
```

### Animated Progress Bar

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="h-full bg-[#D4AF37]"
/>
```

### Grid Layout

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Card items */}
</div>

{/* Bento-style asymmetric grid */}
<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
  <div className="md:col-span-2 lg:col-span-3">
    {/* Large item */}
  </div>
  <div className="md:col-span-2">
    {/* Medium item */}
  </div>
  <div className="col-span-1">
    {/* Small item */}
  </div>
</div>
```

---

## 📚 Related Documentation

- [Design System](DesignSystem.md)
- [Frontend Development](Frontend.md)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
