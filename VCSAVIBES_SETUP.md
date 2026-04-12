# Setup Instructions for VCSAVibes Submodule

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `vcsavibes` under `softvibeslab` organization
3. **IMPORTANT**: Do NOT initialize with README (we'll add our own)
4. Make it **Private** or **Public** based on your preference
5. Click "Create repository"

## Step 2: Run the Setup Script

Once you've created the empty repository, run this command to initialize VCSAVibes:

```bash
# The script will prompt you for the GitHub repository URL
./setup-vcsavibes.sh
```

Or manually:

```bash
# Create the apps directory
mkdir -p apps

# Initialize the new VCSAVibes repository
cd apps
git init vcsavibes
cd vcsavibes

# Add the remote (replace with your actual repo URL)
git remote add origin https://github.com/softvibeslab/vcsavibes.git

# Create initial structure
mkdir -p src/{pages,components,contexts}
mkdir -p public
mkdir -p docs

# Create initial files
echo "# VCSAVibes" > README.md
echo "node_modules/
dist/
.env.local
.DS_Store" > .gitignore

# Initial commit
git add .
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main

# Go back to project root and add as submodule
cd ../..

# Add VCSAVibes as a git submodule
git submodule add https://github.com/softvibeslab/vcsavibes.git apps/vcsavibes

# Commit the submodule
git add .gitmodules apps/vcsavibes
git commit -m "feat: add VCSAVibes as git submodule"
```

## What is VCSAVibes?

VCSAVibes is a complementary project to VCSA (Vacation Club Sales Academy) that will focus on:

- [ ] Define project scope and features
- [ ] Set up project architecture
- [ ] Configure shared components with VCSA
- [ ] Set up separate deployment pipeline

## Submodule Usage

### Clone the project with submodules:
```bash
git clone --recurse-submodules https://github.com/softvibeslab/vcsAcademy.git
```

### Update submodule to latest:
```bash
git submodule update --remote apps/vcsavibes
```

### Working inside the submodule:
```bash
cd apps/vcsavibes
# Make your changes
git add .
git commit -m "Your changes"
git push
```

## Next Steps

After setup, we'll define:
1. Project structure and tech stack
2. Feature set for VCSAVibes
3. Integration points with main VCSA project
4. Deployment strategy
