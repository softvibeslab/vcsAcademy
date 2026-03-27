# Variables de Configuración de Branding

## 🎨 Colores Principales
- **Primary Color**: Color principal de la marca (botones, enlaces destacados)
- **Secondary Color**: Color secundario ( fondos, elementos de soporte)
- **Accent Color**: Color de acento (notificaciones, highlights)
- **Background**: Color de fondo principal
- **Card Background**: Color de fondo de tarjetas
- **Text Main**: Color de texto principal
- **Text Muted**: Color de texto secundario

## 🖼️ Imágenes y Logos
- **Logo URL**: URL del logo principal
- **Logo Dark URL**: URL del logo para modo oscuro
- **Favicon URL**: URL del favicon
- **Hero Background**: URL de imagen de fondo del hero
- **Login Background**: URL de imagen de fondo de login

## ✏️ Tipografía
- **Font Heading**: Fuente para títulos (Playfair Display)
- **Font Body**: Fuente para cuerpo de texto (DM Sans)
- **Font Mono**: Fuente monoespaciada (JetBrains Mono)

## 📝 Textos de Marca
- **Site Name**: Nombre del sitio
- **Tagline**: Eslogan o descripción corta
- **Site Description**: Descripción del sitio (SEO)

## 🎯 Configuración UI
- **Border Radius**: Radio de bordes (0px, 4px, 8px)
- **Button Style**: Estilo de botones (sharp, rounded, pill)
- **Card Style**: Estilo de tarjetas (flat, elevated, glass)
- **Animation Level**: Nivel de animación (none, minimal, normal, high)

## 🌈 Gradientes
- **Primary Gradient**: Gradiente principal
- **Secondary Gradient**: Gradiente secundario
- **Overlay Gradient**: Gradiente de superposición

## 📱 Configuración Social
- **Facebook URL**
- **Twitter URL**
- **Instagram URL**
- **LinkedIn URL**
- **YouTube URL**

## 🔧 Configuración Avanzada
- **Custom CSS**: CSS personalizado adicional
- **Head Scripts**: Scripts para el head (analytics, etc.)
- **Body Scripts**: Scripts para el body

## Ejemplo de Configuración por Defecto:

```json
{
  "colors": {
    "primary": "#D4AF37",
    "secondary": "#1E3A8A",
    "accent": "#F59E0B",
    "background": "#020204",
    "card_background": "#0A0A0B",
    "text_main": "#F8FAFC",
    "text_muted": "#94A3B8"
  },
  "images": {
    "logo_url": "/logo.png",
    "logo_dark_url": "/logo-dark.png",
    "favicon_url": "/favicon.ico",
    "hero_background": "https://images.unsplash.com/...",
    "login_background": "https://images.unsplash.com/..."
  },
  "typography": {
    "font_heading": "Playfair Display",
    "font_body": "DM Sans",
    "font_mono": "JetBrains Mono"
  },
  "texts": {
    "site_name": "Vacation Club Sales Academy",
    "tagline": "The Performance Operating System for Vacation Club Sales Teams",
    "site_description": "Premium sales training platform for vacation club professionals"
  },
  "ui_config": {
    "border_radius": "0",
    "button_style": "sharp",
    "card_style": "glass",
    "animation_level": "normal"
  },
  "gradients": {
    "primary_gradient": "linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)",
    "secondary_gradient": "linear-gradient(180deg, #020204 0%, #0F172A 100%)"
  },
  "social": {
    "facebook_url": "",
    "twitter_url": "",
    "instagram_url": "",
    "linkedin_url": "",
    "youtube_url": ""
  },
  "advanced": {
    "custom_css": "",
    "head_scripts": "",
    "body_scripts": ""
  }
}
```
