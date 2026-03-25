# 🎯 Demo Personalizada VCSA - Instrucciones Rápidas

## 📦 Contenido del ZIP

El archivo `demo-personalizada-complete.zip` (40.47 KB) incluye:

```
demo-personalizada/
├── onboarding.html           # Abre este archivo para comenzar
├── README.md                 # Documentación completa
├── API_SNAPSHOT.md           # API del snapshot JSON
├── PLAN_IMPLEMENTACION.md    # Guía técnica
├── js/                       # Lógica del generador
├── data/                     # Datos de organización y badges
└── templates/                # Template base HTML
```

## 🚀 Cómo Usar (3 Pasos)

### Paso 1: Descomprimir

```bash
# Linux/Mac
unzip demo-personalizada-complete.zip
cd demo-personalizada

# Windows (click derecho)
# "Extraer todo" → Abrir carpeta
```

### Paso 2: Abrir el Generador

```bash
# Opción A: Doble click en onboarding.html

# Opción B: Servidor local (recomendado)
python3 -m http.server 8000
# Luego abre: http://localhost:8000/onboarding.html
```

### Paso 3: Completar el Onboarding (5 pasos)

1. **Tipo de Organización**
   - Selecciona: Vacation Club, Sales Training, o Customer Success

2. **Branding**
   - Nombre: "Acme Sales Academy"
   - Slug: "acme-academy"
   - Colores primario y secundario

3. **Contenido**
   - Industry focus (opcional)
   - Custom tracks (opcional)

4. **Features**
   - Toggle: Gamificación, Badges, Streaks, Community, Events

5. **Review & Generate**
   - Preview Demo (abre en nueva pestaña)
   - Export Snapshot (descarga JSON)
   - Download ZIP (paquete completo)

## 📊 Qué Generas

### 1. Demo HTML Personalizada
- **Nombre:** `{slug}-demo-{fecha}.html`
- **Tamaño:** ~80-120 KB
- **Contenido:**
  - Dashboard con readiness score
  - 6 tracks de entrenamiento
  - 36 módulos personalizados
  - 4 contextos pre-tour
  - 11 badges
  - 4 stages de progreso

### 2. Snapshot JSON del CRM
- **Nombre:** `{slug}-snapshot-{fecha}.json`
- **Tamaño:** ~15-25 KB
- **Contenido:**
  - Configuración completa de organización
  - Branding (logo, colores)
  - Features habilitadas/deshabilitadas
  - Contenido (tracks, módulos, badges)
  - Usuarios demo
  - KPIs y métricas

### 3. ZIP Package Completo
- **Nombre:** `{slug}-demo-{fecha}-{random}.zip`
- **Tamaño:** ~50-100 KB
- **Contenido:**
  - `demo.html` - Demo interactiva
  - `snapshot.json` - Configuración CRM
  - `README.md` - Instrucciones

## 🎨 Personalización

### Por Tipo de Organización

**Vacation Club** (Default)
- 36 módulos de ventas de timeshare
- Contextos: Cold Tour, Warm Tour, Objections, Closing
- Colores: Oro (#D4AF37) + Navy (#1E3A8A)

**Sales Training**
- 36 módulos de ventas B2B
- Contextos: Cold Call, Discovery, Demo, Negotiation
- Colores: Azul (#3B82F6) + Gray (#6B7280)

**Customer Success**
- 36 módulos de éxito del cliente
- Contextos: Check-in, QBR, Risk, Renewal
- Colores: Verde (#10B981) + Teal (#0D9488)

### Por Industry Focus

- **Sales Representatives** → Enfoque en ejecución práctica
- **Sales Managers** → Enfoque en liderazgo y estrategia
- **Customer Success Teams** → Enfoque en relaciones
- **Account Executives** → Enfoque en cierre avanzado
- **Business Development** → Enfoque en prospecting

## 📈 Casos de Uso

### 1. Demo para Prospectos
```
Onboarding → Configurar branding del prospecto
          → Generar demo personalizada
          → Compartir link o ZIP
```

### 2. Onboarding de Clientes
```
Capturar respuestas durante signup
                ↓
Generar snapshot JSON
                ↓
Importar al CRM
                ↓
Configuración automática
```

### 3. Template para Equipo
```
Crear configuración base
        ↓
Exportar snapshot
        ↓
Compartir con equipo de ventas
        ↓
Reutilizar en múltiples demos
```

## 🔧 Troubleshooting

### El preview no abre
- **Solución:** Verifica que hayas completado todos los 5 pasos
- **Solución:** Revisa la consola del navegador (F12)
- **Solución:** Usa un servidor local en lugar de abrir directamente

### El ZIP no se descarga
- **Solución:** Verifica que JSZip se cargue (requiere internet)
- **Solución:** Intenta en otro navegador (Chrome/Edge recomendado)
- **Solución:** Deshabilita ad-blocker temporalmente

### Los colores no se aplican
- **Solución:** Verifica formato hexadecimal (#RRGGBB)
- **Solución:** Limpia cache del navegador (Ctrl+Shift+R)
- **Solución:** Regenera la demo

## 📞 Soporte

- **Documentación:** `demo-personalizada/README.md`
- **API:** `demo-personalizada/API_SNAPSHOT.md`
- **Guía Técnica:** `demo-personalizada/PLAN_IMPLEMENTACION.md`
- **Plan Original:** `demo/PLAN_DEMO_PERSONALIZADA.md`

## ✅ Checklist Antes de Compartir

- [ ] Completar todos los pasos del onboarding
- [ ] Verificar que el branding sea correcto (logo, colores)
- [ ] Probar el preview de la demo
- [ ] Descargar y verificar el ZIP
- [ ] Abrir demo.html desde el ZIP (test final)
- [ ] Compartir link o archivo con prospecto

## 🎯 Pro Tips

1. **Usa slug cortos y memorables** (ej: "acme" no "acme-sales-academy-2026")
2. **Colores de alto contraste** (evita colores similares)
3. **Tagline claro y específico** (ej: "Transform Your Sales Team")
4. **Preview antes de descargar** (ahorra tiempo si hay errores)
5. **Guarda el snapshot JSON** (útil para replicar configuración)

---

**Tiempo estimado de uso:**
- Onboarding completo: 3-5 minutos
- Generación preview: <5 segundos
- Descarga ZIP: <10 segundos

**Versión:** 1.0.0
**Fecha:** 2026-03-25
**Generado con:** VCSA Demo Generator
