# Guía de Contribución

Guía para contribuir al desarrollo de VCSA.

## 🤝 Cómo Contribuir

### Reporting Bugs

Antes de reportar un bug:

1. Verifica que el bug no haya sido reportado
2. Usa los templates de issues
3. Incluye:
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Environment (OS, browser, version)

### Sugerencias de Features

1. Abre un issue describiendo la feature
2. Explica el caso de uso
3. Propón una solución si es posible
4. Espera feedback antes de implementar

---

## 🚀 Flujo de Trabajo

### 1. Fork y Clone

```bash
# Fork el repositorio
git clone https://github.com/your-username/vcsa.git
cd vcsa

# Agregar upstream
git remote add upstream https://github.com/original-repo/vcsa.git
```

### 2. Crear Branch

```bash
# Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crear feature branch
git checkout -b feature/your-feature-name
# o
git checkout -b fix/your-bug-fix
```

### Naming de Branches

- `feature/` - Nuevas features
- `fix/` - Bug fixes
- `refactor/` - Refactorización
- `docs/` - Cambios en documentación
- `test/` - Tests

### 3. Desarrollar

```bash
# Hacer cambios
git add .
git commit -m "feat: add user authentication"

# Commits frecuentes, pequeños
# Mensajes de commit claros (ver sección abajo)
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

### 5. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/your-feature-name

# Abrir PR en GitHub
# Usa el template de PR
```

---

## 📝 Mensajes de Commit

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[ámbito opcional]: <descripción>

[opcional body]

[opcional footer(s)]
```

### Tipos

- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formateo, missing semi colons, etc (no afecta lógica)
- `refactor`: Refactorización (no es feature ni fix)
- `perf`: Mejoras de performance
- `test`: Agregar o actualizar tests
- `build`: Cambios en build system o dependencies
- `ci`: Cambios en CI configuration
- `chore`: Otras tareas que no modifican src o test files

### Ejemplos

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

## 🧋 Código Style

### Python (Backend)

**Usar Black**:
```bash
black backend/
```

**Usar Flake8**:
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
// ✅ CORRECTO - Named exports para componentes
export const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

// ✅ CORRECTO - Default exports para páginas
export default function DashboardPage() {
  return <div>Dashboard</div>
}
```

**Hooks**:
```jsx
// ✅ CORRECTO - Named export
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
// ✅ CORRECTO - Clases ordenadas
<div className="flex flex-col items-center justify-center p-8 bg-card hover:bg-card-hover transition-all">

// ❌ EVITAR - Clases desordenadas
<div className="flex items-center justify-center flex-col p-8 bg-card hover:bg-card-hover">
```

---

## 🎨 Convenciones de UI

### Componentes

- **Usar shadcn/ui** cuando sea posible
- **Named exports** para componentes reutilizables
- **Default exports** para páginas

### Estilos

- **Colors**: Usar variables de Tailwind, no hardcoded values
- **Spacing**: Usar escala de Tailwind (4, 8, 12, 16, etc.)
- **Borders**: Siempre `border-white/5` o `border-white/10`
- **Background**: Nunca blanco puro, usar `#F8FAFC` o `#F1F5F9`
- **Gold**: Solo para alto valor (Subscribe, Upgrade, Win)

### Animaciones

- **Micro-animaciones**: Cada interacción necesita feedback
- **Transiciones específicas**: Evitar `transition: all`
- **Framer Motion**: Para animaciones complejas

---

## 📋 Pull Request Checklist

Antes de abrir un PR:

- [ ] Código formateado (Black, Prettier)
- [ ] Linting pasa (Flake8, ESLint)
- [ ] Tests agregados/actualizados
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Commits siguen conventional commits
- [ ] Branch actualizado con upstream/main
- [ ] PR tiene descripción clara
- [ ] PR referencia issue relacionado

### PR Template

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix (non-breaking change)
- [ ] Feature (non-breaking change)
- [ ] Breaking change (fix/feature that would cause existing functionality to not work)
- [ ] Documentation update

## Issue Relacionado
Fixes #123

## Cómo Testear
Pasos para testear los cambios:
1. Go to...
2. Click on...
3. See...

## Screenshots (si aplica)
[Adjuntar screenshots]

## Checklist
- [ ] Mi código sigue los style guidelines
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings nuevos
- [ ] He agregado tests que prueban mis cambios
- [ ] Los tests nuevos y existentes pasan
```

---

## 🔍 Code Review

### Para Reviewers

1. **Constructivo**: Feedback constructivo y respetuoso
2. **Específico**: Señalar línea exacta y sugerir mejora
3. **Explicativo**: Explicar por qué se sugiere el cambio
4. **Positivo**: Reconocer buen trabajo

### Para Authors

1. **Abierto**: Recibir feedback con apertura
2. **Preguntar**: Pedir clarificación si no entiendes
3. **Agradecer**: Agradecer el tiempo del reviewer
4. **Iterar**: Hacer cambios solicitados

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

## 📚 Recursos de Aprendizaje

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

## 🙏 Gracias

¡Gracias por contribuir a VCSA! Tu ayuda hace que la plataforma sea mejor para todos.

Si tienes preguntas, no dudes en abrir un issue o contactarnos.
