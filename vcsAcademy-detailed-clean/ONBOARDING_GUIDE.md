# Guía de Onboarding - VCSA Platform

Esta guía describe los dos flujos de onboarding implementados en la plataforma VCSA.

## 🎯 Tipos de Onboarding

### 1. Onboarding para Creadores (Create School Flow)

Flujo completo para crear una nueva academia/escuela con IA.

**Rutas:**
- `/onboarding/create-school` - Página inicial de creación
- `/onboarding/interview` - Entrevista con IA para personalizar
- `/onboarding/generate` - Generación de estructura con estrategias
- `/onboarding/review` - Revisión y edición de la estructura
- `/dashboard/:schoolId` - Dashboard de la escuela creada

**Características:**
- ✅ Creación rápida de academia en 7 minutos
- ✅ IA personalizada que entrevista al creador
- ✅ Generación automática de contenido y estructura
- ✅ 3 estrategias de precios y estructura
- ✅ Árbol editable para revisión final
- ✅ Integración completa con el dashboard

### 2. Onboarding para Estudiantes (Student Onboarding)

Flujo de bienvenida para nuevos estudiantes que se registran en una academia.

**Rutas:**
- `/register` → `/onboarding/student` - Redirección automática después del registro
- `/onboarding/student` - Flujo de 4 pasos para estudiantes

**Características:**
- ✅ Bienvenida personalizada con branding de la academia
- ✅ Configuración de perfil (nombre, rol, experiencia)
- ✅ Selección de metas de aprendizaje (máximo 3)
- ✅ Progreso visual con animaciones
- ✅ Integración con el sistema de usuarios

## 🔄 Flujo del Estudiante

### Paso 1: Registro
```
/registro → POST /api/auth/register → Guardar userData en sessionStorage
```

### Paso 2: Onboarding (4 pasos)
1. **Bienvenida** - Presentación de la academia y características
2. **Perfil** - Configuración de información personal
3. **Metas** - Selección de objetivos de aprendizaje
4. **Confirmación** - Resumen y navegación al dashboard

### Paso 3: Dashboard
```
/onboarding/student → /dashboard
```

## 📦 Componentes Reutilizables

### OnboardingCard
Componente base para tarjetas de onboarding con animaciones consistentes.

```jsx
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';

<OnboardingCard
  title="Título"
  description="Descripción"
  icon={IconComponent}
  iconColor="from-purple-500 to-blue-500"
>
  {/* Contenido */}
</OnboardingCard>
```

### OnboardingProgress
Indicador de progreso para flujos de múltiples pasos.

```jsx
import { OnboardingProgress } from '@/components/onboarding/OnboardingCard';

<OnboardingProgress
  current={2}
  total={4}
  steps={STEPS}
/>
```

### OnboardingNavigation
Botones de navegación estándar para el flujo.

```jsx
import { OnboardingNavigation } from '@/components/onboarding/OnboardingCard';

<OnboardingNavigation
  current={2}
  total={4}
  onBack={handleBack}
  onNext={handleNext}
  loading={false}
/>
```

### GoalSelectionCard
Tarjetas seleccionables para metas de aprendizaje.

```jsx
import { GoalSelectionCard } from '@/components/onboarding/OnboardingCard';

<GoalSelectionCard
  goals={LEARNING_GOALS}
  selectedGoals={selectedGoals}
  onToggle={toggleGoal}
  maxSelections={3}
/>
```

## 🎨 Diseño y Animaciones

### Colores
- **Background**: `from-slate-950 via-purple-950/20 to-blue-950/30`
- **Primary**: `from-purple-500 to-blue-500`
- **Success**: `from-emerald-500 to-green-500`
- **Text**: `text-white` (primary), `text-slate-400` (secondary)

### Animaciones (Framer Motion)
- **Fade In**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- **Scale**: `initial={{ scale: 0 }} animate={{ scale: 1 }}`
- **Hover**: `whileHover={{ scale: 1.02, y: -4 }}`

## 💾 Almacenamiento de Datos

### sessionStorage
```javascript
// Datos del usuario (después del registro)
sessionStorage.setItem('userData', JSON.stringify(userData));

// Datos de onboarding del estudiante
sessionStorage.setItem('studentOnboarding', JSON.stringify(completeData));

// Blueprint de la escuela (creadores)
sessionStorage.setItem('schoolBlueprint', JSON.stringify(blueprint));
```

## 🚀 Integración con Backend

### API Endpoints (Ejemplo)
```javascript
// Registro de usuario
POST /api/auth/register
{
  name: string,
  email: string,
  password: string
}

// Crear escuela
POST /api/schools/create
{
  name: string,
  learning_outcome?: string,
  primary_color: string,
  secondary_color: string,
  industry: string
}

// Guardar progreso de onboarding
POST /api/organizations/onboarding/step
{
  step: number,
  org_id: string,
  // ... otros datos del paso
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Stack vertical, tarjetas completas
- **Tablet**: `768px - 1024px` - 2 columnas para goals
- **Desktop**: `> 1024px` - 3 columnas, layout óptimo

## 🔧 Personalización

### Cambiar colores de branding
```jsx
// En StudentOnboardingPage.jsx
const academyData = {
  name: 'Tu Academia',
  primaryColor: '#D4AF37', // Color personalizado
  logo: 'TA'
};
```

### Modificar metas de aprendizaje
```jsx
// En StudentOnboardingPage.jsx
const LEARNING_GOALS = [
  {
    id: 'custom-goal',
    icon: '🎯',
    title: 'Mi Meta Personalizada',
    description: 'Descripción de la meta',
    color: 'from-purple-500 to-pink-500'
  },
  // ... más metas
];
```

## 🐛 Troubleshooting

### Problema: El onboarding no se muestra después del registro
**Solución**: Verifica que la redirección en `RegisterPage.jsx` apunte a `/onboarding/student`

### Problema: Los datos del usuario no se guardan
**Solución**: Revisa que `sessionStorage.setItem('userData', ...)` se llame antes de navegar

### Problema: El progreso no se visualiza correctamente
**Solución**: Verifica que los steps tengan IDs únicos y que `currentStep` esté sincronizado

## 📊 Métricas de Éxito

### Onboarding de Creadores
- Tiempo promedio de creación: 7 minutos
- Tasa de finalización: Target 85%+
- Escuelas creadas por día: Mínimo 5

### Onboarding de Estudiantes
- Tiempo promedio de configuración: 2 minutos
- Tasa de finalización: Target 95%+
- Perfiles completados: Target 90%+

## 🔄 Próximas Mejoras

- [ ] Integrar con API real para guardar datos
- [ ] Agregar validación de email en tiempo real
- [ ] Implementar guardado automático del progreso
- [ ] Agregar skip option para usuarios experientes
- [ ] Personalizar basado en la industria específica
- [ ] Agregar tutorial interactivo del dashboard
