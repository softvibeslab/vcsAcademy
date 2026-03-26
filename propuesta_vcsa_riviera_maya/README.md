# VCSA - Propuesta Comercial DFY | Riviera Maya

Propuesta comercial lista para publicar en hosting estático.

## 📁 Contenido

- `index.html` - Propuesta comercial completa (HTML5 + CSS + JS inline)
- `.htaccess` - Configuración de Apache (opcional)
- `robots.txt` - Configuración de crawlers (opcional)

## 🚀 Cómo Publicar

### Opción 1: Hosting Estático (Recomendado)

**Netlify** (Gratis):
1. Ve a https://netlify.com
2. Arrastra la carpeta `propuesta_vcsa_riviera_maya` al dashboard
3. Listo: tendrás una URL como `https://tu-propuesta.netlify.app`

**Vercel** (Gratis):
1. Ve a https://vercel.com
2. Importa el proyecto desde GitHub o arrastra la carpeta
3. Listo: tendrás una URL como `https://tu-propuesta.vercel.app`

**GitHub Pages** (Gratis):
1. Crea un repo en GitHub
2. Sube el contenido de esta carpeta
3. Ve a Settings > Pages
4. Selecciona la branch main
5. Listo: `https://tu-usuario.github.io/repo-name`

### Opción 2: Hosting Tradicional con cPanel

1. Abre el administrador de archivos de cPanel
2. Ve a `public_html` o la carpeta del dominio
3. Sube todos los archivos
4. Accede desde `https://tu-dominio.com`

### Opción 3: Hosting Tradicional con FTP

1. Conéctate con FileZilla o similar a tu hosting
2. Sube todos los archivos a la carpeta `public_html`
3. Accede desde `https://tu-dominio.com`

## 🔧 Personalización

### Cambiar Logo o Imágenes

El HTML usa CDN externos para fuentes e iconos. Si quieres agregar imágenes propias:

1. Crea una carpeta `assets/images/`
2. Agrega tus imágenes
3. En el HTML, cambia las rutas:
   ```html
   <img src="assets/images/tu-logo.png" alt="Logo">
   ```

### Cambiar Colores

Busca y reemplaza en el HTML:
- `#D4AF37` → Color dorado principal
- `#020204` → Color de fondo oscuro
- `#1E3A8A` → Color navy/azul

### Cambiar Precios

Busca las secciones de pricing y modifica los valores.

## 📊 Analíticas (Opcional)

Para agregar seguimiento, agrega antes de cerrar `</head>`:

**Google Analytics 4:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Meta Pixel:**
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXXXXXXX');
  fbq('track', 'PageView');
</script>
```

## 🔒 Dominio Personalizado

Para usar tu propio dominio (ej: `propuesta.miempresa.com`):

### En Netlify/Vercel:
1. Ve a Domain Settings
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### En hosting tradicional:
1. Ve al administrador de DNS de tu dominio
2. Agrega un registro A:
   - Tipo: A
   - Nombre: propuesta (o @ para el dominio principal)
   - Valor: IP de tu hosting
   - TTL: 3600

## 📧 Configurar Email

Los enlaces de contacto actuales son:
- `mailto:demo@vcsa.com`
- `mailto:enterprise@vcsa.com`

Cámbialos por tus emails reales:
```html
<a href="mailto:tu-email@empresa.com?subject=Demo%20VCSA">
```

## 📱 QR Code (Opcional)

Para crear un QR que apunte a tu propuesta:
1. Publica la propuesta
2. Ve a https://www.qrcode-generator.com/
3. Ingresa la URL completa
4. Descarga el QR y úsalo en materiales impresos

## 🎨 Preview Local

Para ver la propuesta antes de publicar:

```bash
# Si tienes Python instalado
python -m http.server 8000

# Luego abre http://localhost:8000 en tu navegador
```

O simplemente abre el archivo `index.html` directamente en tu navegador.

## 📞 Soporte

Si necesitas ayuda o personalizaciones adicionales:
- Email: enterprise@vcsa.com
- Tel: +52 (998) 123-4567

---

**© 2026 Vacation Club Sales Academy**
