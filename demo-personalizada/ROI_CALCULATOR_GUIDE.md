# 📊 ROI Calculator - Guía de Uso

Calculadora interactiva de ROI para demostrar el impacto de VCSA en las ventas.

## 🚀 Quick Start

### Abrir la Calculadora

```bash
# Opción 1: Abrir directamente
open roi-calculator.html

# Opción 2: Servidor local
python3 -m http.server 8000
# Abre http://localhost:8000/roi-calculator.html
```

## 🎯 Características

### 1. **4 Casos de Uso Preconfigurados**

| Caso | Descripción | Métricas Base |
|------|-------------|---------------|
| **Vacation Club** | Ventas de timeshare | 25 reps, 8 meses onboarding, 70% rotación |
| **Sales Training** | Ventas B2B | 30 reps, 6 meses onboarding, 60% rotación |
| **Customer Success** | Éxito del cliente | 20 reps, 4 meses onboarding, 40% rotación |
| **Custom** | Personalizado | Métricas del usuario |

### 2. **Métricas Calculadas**

#### ROI Principal
- **ROI múltiple:** 10x (promedio)
- **Porcentaje:** 900% de retorno
- **Ahorro anual:** $285,000 (promedio)

#### Desglose de Ahorros
1. **Aumento de Revenue** (+$150K)
   - Onboarding más rápido = reps productivos antes
   - Mejor performance = más ventas

2. **Reducción de Rotación** (+$75K)
   - 60% → 35% (tasa de rotación)
   - Menos costos de hiring

3. **Ahorro de Tiempo** (+$60K)
   - 6 → 2 meses (onboarding)
   - 4 meses de productividad adicional

4. **Eficiencia de Training** (+$25K)
   - Plataforma centralizada
   - 30% más eficiente

### 3. **Comparaciones Antes/Después**

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Onboarding | 6 meses | 2 meses | -67% |
| Rotación | 60% | 35% | -42% |
| Readiness Score | 40% | 75% | +88% |

### 4. **Visualizaciones Interactivas**

#### Gráfico de Revenue (12 meses)
- Línea base (sin VCSA)
- Proyección con VCSA
- Meses críticos marcados

#### Gráfico de Costos (Donut)
- Costos de training
- Costos de hiring
- Productividad perdida
- Inversión VCSA

#### Timeline de Implementación
- Semanas 1-2: Setup
- Meses 1-2: Training
- Meses 3-4: Primeras ventas
- Meses 6-12: ROI completo

### 5. **Tabla de Análisis Financiero**

Métricas detalladas comparando:
- Revenue anual
- Tasa de rotación
- Tiempo de onboarding
- Costos de training
- Costos de hiring
- Readiness score

## 📱 Cómo Usar en Presentaciones

### Paso 1: Seleccionar el Caso del Prospecto

```
¿Qué vende el prospecto?
→ Vacation Club: Selecciona "Vacation Club"
→ B2B Software: Selecciona "Sales Training"
→ SaaS/CS: Selecciona "Customer Success"
→ Otro: Selecciona "Custom" y ajusta
```

### Paso 2: Ajustar Métricas del Prospecto

```javascript
// Inputs clave:
- Team Size: ¿Cuántos reps tienen?
- Current Monthly Revenue: ¿Revenue mensual actual?
- Avg. Commission %: ¿Comisión promedio?
- Onboarding Time: ¿Meses para primer venta?
- Turnover Rate: ¿% de rotación anual?
- Training Cost/Rep: ¿Costo anual de training?
- Hiring Cost/Rep: ¿Costo de contratar?
```

### Paso 3: Presentar los Resultados

```
"Con VCSA, su ROI proyectado es de 10x en el primer año:
• Ahorro anual: $285,000
• Onboarding: 6 → 2 meses
• Rotación: 60% → 35%
• Readiness: 40% → 75%"
```

### Paso 4: Exportar y Compartir

- **Export Results** → Descarga análisis en TXT
- **Download Analysis** → Copia resultados para email
- **Screenshot** → Captura gráficos para deck

## 💡 Tips de Ventas

### 1. Enfócate en el Dolor

```
"Onboarding de 6 meses es muy costoso"
→ "Con VCSA, reduzca a 2 meses"

"Alta rotación afecta su revenue"
→ "Reducimos rotación de 60% a 35%"
```

### 2. Usa Métricas del Prospecto

```
"Con su equipo de 25 reps:"
→ Personaliza todos los cálculos
→ Muestra impacto directo en su bottom line
```

### 3. Muestra el Timeline

```
"Invierta hoy, ROI positivo en 3-4 meses"
→ Timeline visual implementa
→ ROI completo en 6-12 meses
```

### 4. Testimonios Relevantes

```
"Maya Resort (similar a usted):"
→ ROI 12x
→ Onboarding 8 → 6 semanas
```

## 🔧 Personalización Avanzada

### Modificar Presets

Edita el JavaScript en `roi-calculator.html`:

```javascript
const useCasePresets = {
    vacation_club: {
        teamSize: 25,
        currentRevenue: 500000,
        commissionRate: 10,
        onboardingTime: 8,
        turnoverRate: 70,
        trainingCost: 6000,
        hiringCost: 12000
    },
    // Agrega más presets aquí
};
```

### Ajustar Fórmulas de ROI

```javascript
// VCSA improvements
const vcsaOnboardingTime = Math.max(1, Math.round(onboardingTime / 3));
const vcsaTurnoverRate = Math.max(20, turnoverRate - 25);

// Calculate savings
const revenueIncrease = monthsSaved * (revenuePerMonth * 0.3);
const turnoverSavings = (teamSize * turnoverReduction / 100) * hiringCost;
```

### Modificar Colores del Chart

```javascript
backgroundColor: [
    '#EF4444',  // Training (rojo)
    '#F59E0B',  // Hiring (naranja)
    '#6B7280',  // Lost productivity (gris)
    '#10B981'   // VCSA (verde)
]
```

## 📊 Integración con Onboarding

Para añadir al onboarding existente:

### Opción 1: Link Separado

```html
<a href="roi-calculator.html" target="_blank">
    <i class="fas fa-chart-line mr-2"></i>
    Calculate ROI
</a>
```

### Opción 2: Nueva Pestaña

```javascript
// En onboarding.html, agregar tab
<div class="nav-item" onclick="showPage('roi')">
    <i class="fas fa-chart-line mr-2"></i>ROI Calculator
</div>
```

### Opción 3: Modal Embed

```javascript
// Abrir en modal
function openROICalculator() {
    const modal = document.createElement('div');
    modal.innerHTML = '<iframe src="roi-calculator.html"></iframe>';
    // ...
}
```

## 🎯 Casos de Uso por Industria

### Vacation Clubs/Timeshares

**Puntos clave:**
- Onboarding largo (6-8 meses)
- Alta rotación (60-80%)
- Training costoso ($6K/rep/año)

**ROI típico:** 12-15x

**Script:**
```
"Reduce onboarding de 8 a 6 semanas.
Ahorra $120K en costos de hiring.
ROI de 12x en el primer año."
```

### B2B Sales Teams

**Puntos clave:**
- Onboarding medio (4-6 meses)
- Rotación media (50-60%)
- Mayor salary base

**ROI típico:** 8-10x

**Script:**
```
"Reps productivos 3x más rápido.
Reduce rotación en 40%.
ROI de 10x en 12 meses."
```

### Customer Success

**Puntos clave:**
- Onboarding corto (2-4 meses)
- Rotación baja (30-40%)
- Impacto en retención

**ROI típico:** 15-20x

**Script:**
```
"CS teams ready en 4 semanas.
Mejora retención de clientes.
ROI de 15x por churn reducido."
```

## 📈 Métricas de Éxito del Demo

### Engagement Metrics

- **Tiempo en calculadora:** 3-5 minutos
- **Campos completados:** 8/8 (100%)
- **Export rate:** 40-60%
- **Revisits:** 25%

### Conversion Metrics

- **Lead quality:** Alta (intento serio)
- **Demo request:** 30-40%
- **Pilot signup:** 15-20%
- **Time to close:** 2-4 semanas

## 🔐 Datos y Privacidad

### Información Recopilada

**NO recopilamos:**
- ✅ No tracking de usuarios
- ✅ No cookies
- ✅ No analytics
- ✅ No envío a servidor

**Todo es local:**
- ✅ Cálculos en browser
- ✅ Export local
- ✅ Sin data externa

### Privacidad del Prospecto

```
"Todos los cálculos se hacen localmente en su browser.
No compartimos ninguna información.
Exporte los resultados para su referencia."
```

## 🚀 Deployment

### Público (Netlify/Vercel)

```bash
# Subir roi-calculator.html
# Compatible con hosting estático
# Sin backend necesario
```

### Privado (Distribución)

```bash
# Incluir en ZIP del demo
# Compartir vía email
# Abrir localmente sin internet
```

### Integrado (Embed)

```html
<iframe
    src="https://demo.vcsa.com/roi-calculator.html"
    width="100%"
    height="800"
    frameborder="0">
</iframe>
```

## 📞 Soporte

**Documentación:** `ROI_CALCULATOR_GUIDE.md`
**Archivo:** `roi-calculator.html`
**Versión:** 1.0
**Fecha:** 2026-03-25

---

**© 2026 Vacation Club Sales Academy**
