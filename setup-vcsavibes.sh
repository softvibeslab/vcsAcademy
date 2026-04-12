#!/bin/bash

# VCSAVibes Submodule Setup Script
# This script helps set up VCSAVibes as a git submodule

set -e

echo "=========================================="
echo "  VCSAVibes Submodule Setup"
echo "=========================================="
echo ""

# Check if user has provided GitHub URL
if [ -z "$1" ]; then
    echo "Usage: ./setup-vcsavibes.sh <github-repo-url>"
    echo ""
    echo "Example: ./setup-vcsavibes.sh https://github.com/softvibeslab/vcsavibes.git"
    echo ""
    echo "IMPORTANT: Make sure you've created the EMPTY repository on GitHub first!"
    exit 1
fi

GITHUB_URL=$1

# Validate GitHub URL format
if [[ ! $GITHUB_URL =~ ^https://github\.com/.*\.git$ ]]; then
    echo "Error: Invalid GitHub URL format"
    echo "Expected: https://github.com/owner/repo.git"
    exit 1
fi

echo "Setting up VCSAVibes submodule..."
echo "Repository: $GITHUB_URL"
echo ""

# Create apps directory
echo "📁 Creating apps directory..."
mkdir -p apps

# Initialize the new repository
echo "🔧 Initializing VCSAVibes repository..."
cd apps
mkdir -p vcsavibes
cd vcsavibes

git init

# Set up initial structure
echo "📦 Creating project structure..."
mkdir -p src/{pages,components,contexts,lib,styles}
mkdir -p public
mkdir -p docs

# Create package.json
cat > package.json << 'EOF'
{
  "name": "vcsavibes",
  "version": "0.1.0",
  "private": true,
  "description": "VCSAVibes - Complementary platform to VCSA",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\""
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.1.0"
  }
}
EOF

# Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VCSAVibes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Create main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

# Create App.jsx
cat > src/App.jsx << 'EOF'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
EOF

# Create HomePage
cat > src/pages/HomePage.jsx << 'EOF'
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">VCSAVibes</h1>
        <p className="text-gray-400">Welcome to VCSAVibes</p>
      </div>
    </div>
  );
}
EOF

# Create basic styles
cat > src/styles/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
.vscode/
.idea/
EOF

# Create README
cat > README.md << 'EOF'
# VCSAVibes

VCSAVibes is a complementary platform to VCSA (Vacation Club Sales Academy).

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
vcsavibes/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utility functions
│   └── styles/         # CSS files
├── public/             # Static assets
└── docs/               # Documentation
\`\`\`

## Integration with VCSA

This project is a git submodule of the main VCSA project and shares:
- Authentication system
- API endpoints
- Design system components

## License

Copyright © 2025 SoftVibes Lab
EOF

# Create initial commit
echo "📝 Creating initial commit..."
git add .
git commit -m "Initial commit: VCSAVibes project setup

- Set up Vite + React project structure
- Configure development environment
- Add basic routing and styling
- Prepare for integration with VCSA"

# Add remote and push
echo "🚀 Adding remote and pushing to GitHub..."
git remote add origin "$GITHUB_URL"
git branch -M main
git push -u origin main

# Go back to project root
cd ../..

# Add as submodule
echo "📦 Adding VCSAVibes as git submodule..."
git submodule add "$GITHUB_URL" apps/vcsavibes

# Commit the submodule
echo "💾 Committing submodule to parent repository..."
git add .gitmodules apps/vcsavibes
git commit -m "feat: add VCSAVibes as git submodule

VCSAVibes is now a git submodule at apps/vcsavibes.
This allows independent versioning while keeping projects integrated.

To clone with submodules:
  git clone --recurse-submodules <repo-url>

To update submodule:
  git submodule update --remote apps/vcsavibes"

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "VCSAVibes has been:"
echo "  ✓ Created as an independent repository"
echo "  ✓ Pushed to GitHub: $GITHUB_URL"
echo "  ✓ Added as a git submodule to VCSA"
echo ""
echo "Next steps:"
echo "  1. cd apps/vcsavibes"
echo "  2. npm install"
echo "  3. npm run dev"
echo ""
echo "Useful commands:"
echo "  git submodule update --remote apps/vcsavibes  # Update to latest"
echo "  cd apps/vcsavibes                             # Work in submodule"
echo ""
