# Contributing Guide

Guide for contributing to VCSA development.

## 🤝 How to Contribute

### Reporting Bugs

Before reporting a bug:

1. Check that the bug hasn't been reported
2. Use issue templates
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, version)

### Feature Suggestions

1. Open an issue describing the feature
2. Explain the use case
3. Propose a solution if possible
4. Wait for feedback before implementing

---

## 🚀 Workflow

### 1. Fork and Clone

```bash
# Fork the repository
git clone https://github.com/your-username/vcsa.git
cd vcsa

# Add upstream
git remote add upstream https://github.com/original-repo/vcsa.git
```

### 2. Create Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Refactoring
- `docs/` - Documentation changes
- `test/` - Tests

### 3. Develop

```bash
# Make changes
git add .
git commit -m "feat: add user authentication"

# Frequent, small commits
# Clear commit messages (see section below)
```

### 4. Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test

# Linting
flake8 backend/
cd frontend && yarn lint
```

### 5. Push and Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Open PR on GitHub
# Use the PR template
```

---

## 📝 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi colons, etc (no logic change)
- `refactor`: Refactoring (not a feature or fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other tasks that don't modify src or test files

### Examples

```bash
# Feature
git commit -m "feat(auth): add Google OAuth login"

# Bug fix
git commit -m "fix(progress): resolve readiness score calculation error"

# Documentation
git commit -m "docs: update API documentation for bookmarks endpoint"

# Refactor
git commit -m "refactor(frontend): extract common button styles"

# Breaking change
git commit -m "feat: upgrade to React 19

BREAKING CHANGE: React 19 requires Node 18+"
```

---

## 🧋 Code Style

### Python (Backend)

**Use Black**:
```bash
black backend/
```

**Use Flake8**:
```bash
flake8 backend/
```

**Type Hints**:
```python
from typing import List, Optional

def get_users(
    limit: int = 10,
    active: bool = True
) -> List[User]:
    """Get users from database."""
    # ...
```

**Docstrings**:
```python
def create_user(user: UserCreate) -> User:
    """
    Create a new user in the database.

    Args:
        user: UserCreate model with user data

    Returns:
        User: Created user object

    Raises:
        HTTPException: If email already exists
    """
    # ...
```

### JavaScript/React (Frontend)

**Component Naming**:
```jsx
// ✅ GOOD - Named exports for components
export const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

// ✅ GOOD - Default exports for pages
export default function DashboardPage() {
  return <div>Dashboard</div>
}
```

**Hooks**:
```jsx
// ✅ GOOD - Named export
export const useAuth = () => {
  // ...
}
```

**Imports**:
```jsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { motion } from 'framer-motion'
import axios from 'axios'

// 3. Internal imports
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'
```

**Tailwind Classes**:
```jsx
// ✅ GOOD - Ordered classes
<div className="flex flex-col items-center justify-center p-8 bg-card hover:bg-card-hover transition-all">

// ❌ AVOID - Disordered classes
<div className="flex items-center justify-center flex-col p-8 bg-card hover:bg-card-hover">
```

---

## 🎨 UI Conventions

### Components

- **Use shadcn/ui** when possible
- **Named exports** for reusable components
- **Default exports** for pages

### Styles

- **Colors**: Use Tailwind variables, no hardcoded values
- **Spacing**: Use Tailwind scale (4, 8, 12, 16, etc.)
- **Borders**: Always `border-white/5` or `border-white/10`
- **Background**: Never pure white, use `#F8FAFC` or `#F1F5F9`
- **Gold**: Only for high value (Subscribe, Upgrade, Win)

### Animations

- **Micro-animations**: Every interaction needs feedback
- **Specific transitions**: Avoid `transition: all`
- **Framer Motion**: For complex animations

---

## 📋 Pull Request Checklist

Before opening a PR:

- [ ] Code formatted (Black, Prettier)
- [ ] Linting passes (Flake8, ESLint)
- [ ] Tests added/updated
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Commits follow conventional commits
- [ ] Branch updated with upstream/main
- [ ] PR has clear description
- [ ] PR references related issue

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] Feature (non-breaking change)
- [ ] Breaking change (fix/feature that would cause existing functionality to not work)
- [ ] Documentation update

## Related Issue
Fixes #123

## How to Test
Steps to test changes:
1. Go to...
2. Click on...
3. See...

## Screenshots (if applicable)
[Attach screenshots]

## Checklist
- [ ] My code follows style guidelines
- [ ] I have performed self-review of my code
- [ ] I have commented complex code
- [ ] I have updated documentation
- [ ] My changes don't generate new warnings
- [ ] I have added tests that test my changes
- [ ] New and existing tests pass
```

---

## 🔍 Code Review

### For Reviewers

1. **Constructive**: Constructive and respectful feedback
2. **Specific**: Point to exact line and suggest improvement
3. **Explanatory**: Explain why change is suggested
4. **Positive**: Recognize good work

### For Authors

1. **Open**: Receive feedback with openness
2. **Ask**: Ask for clarification if you don't understand
3. **Thank**: Thank reviewer for their time
4. **Iterate**: Make requested changes

---

## 🧪 Testing

### Backend Tests

```python
# tests/test_development.py

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_stages(client: AsyncClient):
    response = await client.get("/api/development/stages")
    assert response.status_code == 200
    assert len(response.json()) == 4

@pytest.mark.asyncio
async def test_complete_module(client: AsyncClient, test_user):
    response = await client.post("/api/development/modules/module_1_1/complete")
    assert response.status_code == 200
    assert response.json()["points_earned"] == 10
```

### Frontend Tests

```jsx
// tests/components/Button.test.jsx

import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

---

## 📚 Learning Resources

### Python/FastAPI
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

### React/JavaScript
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### MongoDB
- [MongoDB University](https://university.mongodb.com/)
- [Motor Documentation](https://motor.readthedocs.io/)

---

## 🙏 Thank You

Thank you for contributing to VCSA! Your help makes the platform better for everyone.

If you have questions, don't hesitate to open an issue or contact us.
