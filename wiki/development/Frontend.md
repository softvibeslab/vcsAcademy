# Frontend Development

Complete frontend development guide for VCSA.

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Component Development](#component-development)
- [State Management](#state-management)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Building for Production](#building-for-production)

---

## 🎯 Overview

VCSA frontend is a React 19 application with:

- **Modern UI**: shadcn/ui components + Tailwind CSS
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router v6
- **State**: React Context API
- **Type Safety**: JavaScript (with optional TypeScript)

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 19.x |
| React Router | Routing | 6.x |
| Tailwind CSS | Styling | 3.x |
| Framer Motion | Animations | 11.x |
| shadcn/ui | Component Library | Latest |
| Axios | HTTP Client | 1.x |
| Vite | Build Tool | 5.x |

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   │   └── DashboardLayout.jsx
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   └── ...
│   │   └── onboarding/       # Onboarding components
│   ├── contexts/             # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/                # Custom hooks
│   │   └── use-toast.js
│   ├── lib/                  # Utilities
│   │   └── utils.js
│   ├── pages/                # Page components
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── TopProducerPath.jsx
│   │   └── ...
│   ├── services/             # API services
│   ├── themes/               # Theme configuration
│   ├── App.js                # Main app
│   ├── App.css               # Global styles
│   └── index.js              # Entry point
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind config
├── vite.config.js            # Vite config
└── jsconfig.json             # JS config
```

---

## 🚀 Development Setup

### Installation

```bash
cd frontend

# Install dependencies
yarn install
# or
npm install

# Copy environment file
cp .env.example .env

# Configure .env
# REACT_APP_BACKEND_URL=http://localhost:8000
```

### Running Development Server

```bash
# Start dev server
yarn start
# or
npm start

# App will be available at http://localhost:3000
```

### Building for Production

```bash
# Create production build
yarn build
# or
npm run build

# Preview production build
yarn preview
# or
npm run preview
```

---

## 🧩 Component Development

### Component Rules

1. **Named exports for components**:
   ```jsx
   // ✅ Good
   export const Button = ({ children }) => {
     return <button>{children}</button>;
   };

   // ❌ Bad
   const Button = ({ children }) => {
     return <button>{children}</button>;
   };
   export default Button;
   ```

2. **Default exports for pages**:
   ```jsx
   // ✅ Good
   export default function DashboardPage() {
     return <div>Dashboard</div>;
   }

   // ❌ Bad
   export const DashboardPage = () => {
     return <div>Dashboard</div>;
   };
   ```

### Creating a New Component

```jsx
// src/components/MyComponent.jsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);

  return (
    <Card className="border-white/10 bg-[#020204]">
      <CardContent className="p-6">
        <h2 className="text-2xl font-['Playfair_Display'] text-[#F1F5F9]">
          {title}
        </h2>
        <p className="text-[#94A3B8]">Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-[#D4AF37] text-black px-4 py-2 rounded"
        >
          Increment
        </button>
      </CardContent>
    </Card>
  );
};
```

### Using Components

```jsx
// src/pages/MyPage.jsx
import { MyComponent } from '@/components/MyComponent';

export default function MyPage() {
  return (
    <div>
      <MyComponent title="Hello World" />
    </div>
  );
}
```

---

## 🔄 State Management

### Context API

VCSA uses React Context for global state:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Using Context in Components

```jsx
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#020204',
        secondary: '#0A0A0F',
        gold: '#D4AF37',
        navy: '#1E3A8A',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
```

### Custom Styling Patterns

```jsx
// Card with hover effect
<Card className="group border-white/10 bg-[#020204] transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-[#D4AF37]/10">
  {/* Content */}
</Card>

// Gradient text
<h1 className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] bg-clip-text text-transparent">
  Premium Title
</h1>

// Glass effect
<div className="bg-[#020204]/80 backdrop-blur-sm border border-white/10">
  {/* Content */}
</div>
```

---

## 🌐 API Integration

### API Service Layer

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const api = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      return response.json();
    },

    register: async (email, password, name) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name })
      });
      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      return response.json();
    },

    me: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      return response.json();
    }
  },

  // Development endpoints
  development: {
    getStages: async () => {
      const response = await fetch(`${API_BASE_URL}/api/development/stages`, {
        credentials: 'include'
      });
      return response.json();
    },

    getTracks: async () => {
      const response = await fetch(`${API_BASE_URL}/api/development/tracks`, {
        credentials: 'include'
      });
      return response.json();
    },

    getProgress: async () => {
      const response = await fetch(`${API_BASE_URL}/api/development/progress`, {
        credentials: 'include'
      });
      return response.json();
    },

    completeModule: async (moduleId) => {
      const response = await fetch(`${API_BASE_URL}/api/development/modules/${moduleId}/complete`, {
        method: 'POST',
        credentials: 'include'
      });
      return response.json();
    }
  }
};
```

### Using API in Components

```jsx
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const data = await api.development.getTracks();
      setTracks(data);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {tracks.map(track => (
        <div key={track.id}>{track.title}</div>
      ))}
    </div>
  );
}
```

---

## 🎭 Animations

### Framer Motion

```jsx
import { motion } from 'framer-motion';

export default function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="border-white/10 bg-[#020204] p-6"
    >
      <h2>Animated Content</h2>
    </motion.div>
  );
}
```

### Staggered Animations

```jsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function List({ items }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.div key={item.id} variants={item}>
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 🧪 Testing

### Component Tests

```jsx
// src/__tests__/components/MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  test('renders title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('increments count on button click', () => {
    render(<MyComponent title="Test" />);
    const button = screen.getByRole('button');
    button.click();
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Watch mode
yarn test

# CI mode
yarn test:ci

# With coverage
yarn test:ci -- --coverage
```

---

## 📦 Building for Production

### Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion']
        }
      }
    }
  }
});
```

### Build Process

```bash
# Create production build
yarn build

# Output will be in /build directory
# Contains: index.html, assets/, static/
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Module not found

**Solution**: Check import path alias in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue**: Tailwind classes not working

**Solution**: Ensure `tailwind.config.js` content paths are correct:
```javascript
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
```

**Issue**: API calls failing

**Solution**: Check `REACT_APP_BACKEND_URL` in `.env` and ensure backend is running.

---

## 📚 Related Documentation

- [Components Guide](../design/Components.md)
- [Style Guidelines](../design/StyleGuidelines.md)
- [Testing Guide](Testing.md)
- [API Documentation](../api/Development.md)
