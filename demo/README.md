# VCSA - Demo Interactivo

Demo interactivo de la plataforma Vacation Club Sales Academy con datos de ejemplo (mockup).

## 📋 Contenido

Este demo muestra el recorrido completo de las funcionalidades principales de VCSA:

- **Login**: Página de autenticación (demo credentials pre-cargadas)
- **Dashboard**: Vista principal con Readiness Score y progreso
- **Top Producer Path**: Las 4 etapas de desarrollo
- **Tracks**: 6 tracks de capacitación con módulos
- **Pre-Tour Mode**: Tácticas rápidas antes de presentaciones
- **Perfil**: Badges, logros y estadísticas

## 🚀 Cómo Usar

### Opción 1: Abrir directamente

Simplemente abre el archivo `index.html` en tu navegador:

```bash
# Linux/Mac
open demo/index.html

# Windows
start demo/index.html
```

### Opción 2: Servidor local (recomendado)

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve

# Luego abre http://localhost:8000 en tu navegador
```

### Opción 3: Publicar online

**Netlify (Gratis):**
1. Ve a https://netlify.com
2. Arrastra la carpeta `demo/` al dashboard
3. Listo: tendrás una URL como `https://vcsa-demo.netlify.app`

**Vercel (Gratis):**
1. Ve a https://vercel.com
2. Importa o arrastra la carpeta `demo/`
3. Listo: tendrás una URL como `https://vcsa-demo.vercel.app`

## 👤 Credenciales Demo

El demo viene con credenciales pre-cargadas:

- **Email**: demo@vcsa.com
- **Password**: demo123

Solo haz click en "Iniciar Sesión" para entrar.

## 🎯 Recorrido Sugerido

1. **Login** (1 min)
   - Observa la página de autenticación
   - Haz click en "Iniciar Sesión"

2. **Dashboard** (3 min)
   - Revisa el Readiness Score (68%)
   - Observa tu etapa actual: "Developing Rep"
   - Explora el plan del día sugerido por el Agente IA
   - Revisa las estadísticas

3. **Top Producer Path** (2 min)
   - Ve las 4 etapas de desarrollo
   - Observa cuál está completada (Stage 1)
   - Ve en qué etapa estás (Stage 2)
   - Identifica las etapas bloqueadas

4. **Tracks** (3 min)
   - Explora los 6 tracks disponibles
   - Haz click en "Discovery & Control" (Track 2)
   - Observa los módulos completados y en progreso
   - Revisa los "Key Moves" de cada módulo

5. **Pre-Tour Mode** (3 min)
   - Selecciona un tipo de tour (Cold, Warm, Con Objeciones, Cierre)
   - Explora las tácticas rápidas
   - Haz click en alguna para ver el script sugerido

6. **Perfil** (2 min)
   - Revisa tus badges obtenidos
   - Observa los badges bloqueados
   - Explora tu historial de actividad

## 🎨 Características del Demo

### Datos Mockup Incluidos

- **Usuario**: María García (Developing Rep)
- **Progreso**: 245 puntos, 7 días de racha
- **Readiness Score**: 68%
- **Módulos completados**: 12/36
- **Badges**: 5/11 obtenidos
- **Stage actual**: Stage 2 (Developing Rep)

### Funcionalidades Interactivas

✅ Navegación completa entre páginas
✅ Modales con detalles de tracks
✅ Selección de contexto en Pre-Tour Mode
✅ Transiciones suaves entre páginas
✅ Diseño responsive (móvil y desktop)
✅ Animaciones y micro-interacciones

### Características Visuales

- Tema oscuro premium (dark luxury)
- Colores dorados para acciones principales
- Glass morphism en cards
- Animaciones fluidas
- Iconos Font Awesome
- Fuentes Google Fonts (Playfair Display + DM Sans)

## 📱 Compatibilidad

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Navegadores móviles (iOS Safari, Chrome Android)

## 🔧 Personalización

Para personalizar el demo con tus propios datos:

1. **Colores**: Busca las variables CSS en `:root`:
   ```css
   --gold: #D4AF37;
   --navy: #1E3A8A;
   --bg-dark: #020204;
   ```

2. **Textos**: Busca y reemplaza los textos que quieras modificar

3. **Imágenes**: El demo usa iconos de Font Awesome. Para agregar imágenes:
   ```html
   <img src="path/to/image.jpg" alt="Description">
   ```

## 📊 Métricas del Demo

El demo muestra:

- **Readiness Score Algorithm**: (Videos × 40%) + (Tracks × 30%) + (Quick Wins × 10%) + (Breakdowns × 10%) + (Streak × 10%)
- **Puntos System**: 10 pts por módulo, 5 pts por breakdown, 3 pts por quick win
- **Stage Progression**: 150 → 300 → 500 → 750 puntos

## 🎓 Para Presentaciones

Si vas a presentar este demo:

1. **Antes**: Abre el archivo en el navegador y navega todas las páginas para cachear
2. **Durante**: Usa el recorrido sugerido arriba
3. **Destaca**:
   - Readiness Score como diferenciador
   - Agente IA para planificación diaria
   - Pre-Tour Mode como herramienta de uso diario
   - Gamificación para engagement

## 🔗 Recursos Adicionales

- **Propuesta Comercial**: `../propuesta_vcsa_riviera_maya/`
- **Documentación**: `../wiki/`
- **PRD**: `../memory/PRD.md`
- **Design Guidelines**: `../design_guidelines.json`

## 💬 Feedback

¿Qué te gustaría ver en el demo? ¿Algún flujo que falte?

Contacto: rgarcia@softvibes.com.mx

---

**© 2026 Vacation Club Sales Academy**
**Demo Interactive v1.0**
