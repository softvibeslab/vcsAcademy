---
tags:
  - vcsa
  - obsidian
  - onboarding
---

# Obsidian Import Guide

## Opción recomendada

Abrir **todo el repo** como vault en Obsidian y usar `obsidian-super-wiki/` como capa de navegación principal.

Ventajas:

- puedes abrir estas notas y también el código/documentación original
- mantienes rutas relativas y contexto
- no pierdes el atlas documental

## Opción mínima

Si no quieres abrir todo el repo, puedes copiar solo esta carpeta:

- `obsidian-super-wiki/`

Funciona como mini-vault, pero perderás acceso directo al resto de archivos del proyecto.

## Orden sugerido de lectura

1. `00 - VCSA Super Wiki`
2. `01 - Executive Summary`
3. `02 - Repository Map`
4. `11 - Current State & Risks`
5. notas técnicas según necesidad

## Cómo usarlo en Obsidian

### Vista recomendada

- Panel izquierdo: file explorer
- Panel central: nota actual
- Panel derecho: backlinks / outgoing links

### Navegación recomendada

- Usa los `[[wikilinks]]` de esta carpeta como mapa principal
- Usa búsqueda global para encontrar una feature
- Cuando encuentres una doc histórica útil, enlázala desde una nota nueva propia

## Tags sugeridos

Esta wiki ya usa tags simples como:

- `vcsa`
- `backend`
- `frontend`
- `mobile`
- `deploy`
- `status`

Puedes extender con:

- `pending-cleanup`
- `canonical`
- `legacy`
- `decision-needed`

## Buenas prácticas para seguir expandiéndola

- Crear una nota por feature grande en vez de meter todo en una sola página
- Mantener una sección `Fuentes en código` en cada nota nueva
- Cuando una doc vieja siga siendo útil, enlazarla desde [[10 - Documentation Atlas]]
- Cuando el código cambie, actualizar primero esta wiki y luego los reportes sueltos si todavía importan

## Si quieres convertir esta wiki en la oficial del proyecto

Pasos recomendados:

1. mover docs críticas al árbol `obsidian-super-wiki/`
2. marcar docs históricas como `legacy`
3. definir una sola guía de deploy canónica
4. reemplazar la `README.md` raíz placeholder por un índice corto que apunte aquí

## Nota final

La mayor ganancia de Obsidian aquí no es “tener más notas”, sino reducir la fricción para responder:

- qué existe
- qué está vivo
- qué está legacy
- dónde tocar cada cosa

Ese es exactamente el problema que esta carpeta intenta resolver.
