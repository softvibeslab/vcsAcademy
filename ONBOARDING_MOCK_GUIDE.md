# 🎯 Guía de Onboarding - Modo Demo (Sin Backend)

## ✅ Configuración Completa

El onboarding ahora funciona **completamente sin backend** usando datos simulados (mock).

## 🚀 Cómo Probar

### 1. Asegúrate de tener el frontend corriendo
```bash
cd frontend
npm start
```

### 2. Accede al onboarding de crear escuela
Abre tu navegador en: `http://localhost:3000/onboarding/create-school`

### 3. Completa el formulario
- **Nombre de la escuela**: Ej: "Mi Academia de Ventas"
- **Resultado esperado** (opcional): Ej: "Convertir alumnos en expertos de ventas"

### 4. Click en "Lanzar mi Asistente IA"
- ✅ Verás un toast de éxito
- ✅ Serás redirigido automáticamente a la entrevista

## 🎬 Flujo Completo del Onboarding

### Paso 1: Crear Escuela (`/onboarding/create-school`)
- **Estado**: ✅ **FUNCIONA sin backend**
- **Características**:
  - Formulario con validación
  - Avatar generado automáticamente
  - Mock de creación de escuela (1.5s delay)
  - Redirección automática

### Paso 2: Entrevista IA (`/onboarding/interview`)
- **Estado**: ✅ **FUNCIONA completamente**
- **Características**:
  - Chat interactivo con IA
  - 4 preguntas con opciones
  - Progreso visual
  - Respuestas guardadas en sessionStorage

### Paso 3: Generar Estructura (`/onboarding/generate`)
- **Estado**: ✅ **FUNCIONA completamente**
- **Características**:
  - Animación de carga (3 etapas)
  - 3 estrategias disponibles
  - Confetti al seleccionar
  - Redirección automática

### Paso 4: Revisar Estructura (`/onboarding/review`)
- **Estado**: ✅ **FUNCIONA completamente**
- **Características**:
  - Árbol editable completo
  - Agregar/eliminar elementos
  - Auto-save simulado
  - Publicación y redirección

### Paso 5: Dashboard (`/dashboard/:schoolId`)
- **Estado**: ✅ **FUNCIONA con datos mock**
- **Características**:
  - KPIs simulados
  - Cursos de ejemplo
  - Checklist interactivo
  - Navegación completa

## 🎨 Características del Modo Mock

### OrganizationContext
```javascript
// En lugar de llamar al backend:
const response = await axios.get(`${backendUrl}/api/organizations/by-slug/${slug}`);

// Usa datos mock:
const mockOrgData = {
  organization_id: 'mock-org-123',
  name: 'VCSA Academy Demo',
  branding: { /* ... */ },
  settings: { /* ... */ }
};
```

### CreateSchoolPage
```javascript
// En lugar de llamar al backend:
const response = await axios.post(`${backendUrl}/api/schools/create`, { /* ... */ });

// Usa mock con delay:
await new Promise(resolve => setTimeout(resolve, 1500));
const mockResponse = {
  success: true,
  school_id: 'mock-school-' + Date.now(),
  school: { /* ... */ }
};
```

## 📦 Datos Almacenados (sessionStorage)

### schoolData
```javascript
{
  schoolName: "Mi Academia",
  learningOutcome: "Resultado esperado",
  schoolId: "mock-school-1234567890",
  slug: "mi-academia"
}
```

### schoolBlueprint
```javascript
{
  schoolName: "Mi Academia",
  ticketType: "high-ticket",
  format: "hybrid",
  modulesCount: 8,
  communityEnabled: true,
  communityType: "private",
  selectedStrategy: "balanced",
  generatedStructure: { /* ... */ }
}
```

## 🎯 Rutas del Onboarding

| Ruta | Componente | Estado |
|------|------------|--------|
| `/onboarding/create-school` | CreateSchoolPage | ✅ Mock |
| `/onboarding/interview` | InterviewPage | ✅ Frontend |
| `/onboarding/generate` | GeneratePage | ✅ Frontend |
| `/onboarding/review` | ReviewPage | ✅ Frontend |
| `/dashboard/:schoolId` | SchoolDashboardPage | ✅ Mock |

## 🔍 Debugging

### Ver consola del navegador
Deberías ver estos logs:
```
[OrganizationContext] MOCK MODE - Using simulated organization data
[CreateSchoolPage] MOCK MODE - Creating school without backend
```

### Ver sessionStorage
```javascript
// En la consola del navegador:
console.log(JSON.parse(sessionStorage.getItem('schoolData')));
console.log(JSON.parse(sessionStorage.getItem('schoolBlueprint')));
```

## 🚀 Próximos Pasos

### Para habilitar el backend real:
1. **Inicia el backend**:
   ```bash
   cd backend
   uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Revierte los cambios mock** en:
   - `OrganizationContext.js`
   - `CreateSchoolPage.jsx`

3. **Restaura las llamadas API originales**

### Mantener modo mock:
- ✅ Perfecto para demos y pruebas visuales
- ✅ No requiere configuración de backend
- ✅ Funciona completamente en el navegador
- ⚠️ Los datos no persisten al recargar

## 📝 Notas

- **Modo actual**: MOCK (sin backend)
- **Velocidad**: Más rápido que con backend real
- **Persistencia**: Solo durante la sesión del navegador
- **Ideal para**: Presentaciones, pruebas de UX, desarrollo frontend

---

**¡Disfruta probando el onboarding sin preocuparte por el backend!** 🎉
