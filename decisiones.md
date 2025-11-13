# TP8 – Contenedores en la Nube
## Decisiones Arquitectónicas y Técnicas  

Este documento resume las decisiones arquitectónicas, tecnológicas e implementaciones realizadas para el TP de Contenedores en la Nube

---

# 1. Stack Tecnológico Elegido

- **Container Registry:** GitHub Container Registry (GHCR – `ghcr.io`)
- **Hosting QA:** Render.com (free tier)
- **Hosting PROD:** Render.com (free tier, con una configuración distinta)
- **CI/CD:** GitHub Actions
- **Base de datos:** SQLite (embebida, incluida dentro del backend)

**Motivo del stack:**  
Elegimos un stack gratuito, integrado con GitHub y simple de configurar, cumpliendo con todos los requisitos del TP.

---

# 2. Proceso Cronológico de Construcción del TP

A continuación se presenta el orden cronológico de las tareas del TP, siguiendo el flujo real implementado

---

## 2.1. Creación de Dockerfiles – Pasos

Se crearon los Dockerfiles para backend y frontend.

### Imágenes generadas:

- `tp8-backend-qa`
- `tp8-backend-prod`
- `tp8-frontend-qa`
- `tp8-frontend-prod`

Los Dockerfiles permiten contenerizar ambos servicios y diferenciarlos entre QA y PROD desde el build.

**Motivo:**  
Separar versiones QA y PROD evita confusiones, ayuda a pruebas controladas y permite desplegar cada entorno de manera independiente.

---

## 2.2. Configuración del GitHub Container Registry (GHCR)

Una vez creadas las imágenes, configuramos GHCR para publicarlas desde GitHub Actions.

El pipeline realiza:

1. Log in en GHCR.  
2. Build de imágenes QA y PROD para backend y frontend.  
3. Push a GHCR con los nombres indicados.

**Motivo de elegir GHCR:**  
- Integración nativa con GitHub.  
- Publicación automática usando `GITHUB_TOKEN`.  
- No requiere gestionar credenciales externas.

---

## 2.3. Creación del Pipeline CI/CD – GitHub Actions

En el directorio `.github/workflows/` se configuró un workflow genérico que:

1. Construye backend y frontend.  
2. Genera imágenes Docker QA y PROD.  
3. Publica todas las imágenes a GHCR.  
4. Despliega o deja preparado el despliegue hacia QA/PROD.

**Motivo:** Automatizar todo el ciclo de build → empaquetado → publicación.

---

## 2.4. Deploy del ambiente QA en Render

Con las imágenes QA publicadas (`tp8-backend-qa` y `tp8-frontend-qa`), se configuró el ambiente QA en Render:

- Servicio creado desde imagen Docker.  
- Variables de entorno específicas para QA.  
- Plan free tier.  

**Motivo para usar Render QA:**  
Gratis, simple y permite testear el comportamiento del contenedor en la nube.

---

## 2.5. Deploy del ambiente PROD en Render

Se configuró un segundo servicio en Render, esta vez usando las imágenes productivas:

- `tp8-backend-prod`  
- `tp8-frontend-prod`

Diferencias principales respecto a QA:

- Variables de entorno con `NODE_ENV=production`.  
- Configuración distinta dentro del free tier.  
- No se usa la misma imagen de QA para mantener segregación real.

**Motivo:**  
Render facilita mantener QA y PROD como dos servicios independientes, cumpliendo con la consigna del TP.

---

## 2.6. Versionado de imágenes

Todas las imágenes se generan con nombres separados entre QA y PROD:

- `tp8-backend-qa`  
- `tp8-frontend-qa`  
- `tp8-backend-prod`  
- `tp8-frontend-prod`

**Motivo:**  
Evita depender de `latest` y asegura que cada entorno use su propia versión.

---

## 2.7. Quality Gates y aprobaciones manuales

A nivel pipeline, se contempla:

- Validación del build.  
- Validación de la creación de imágenes.  
- QA como primer paso de despliegue.  
- Aprobación manual previa a PROD.  

---

# 3. Justificación Final de las Decisiones

### 3.1. Por qué Docker  
Permite empaquetar y ejecutar la aplicación sin dependencias externas.

### 3.2. Por qué GHCR  
Integración directa con GitHub y publicación automática de imágenes sin credenciales adicionales.

### 3.3. Por qué Render para QA y PROD  
- Simplicidad  
- Plan gratuito  
- Deploy directo desde imágenes Docker

### 3.4. Por qué GitHub Actions  
Automatización completa dentro del mismo repositorio.

### 3.5. Por qué imágenes separadas para QA y PROD  
Control total sobre qué versión se prueba y cuál va a producción.

---

# 4. Reflexión y Aprendizajes

- Aprendimos a contenerizar backend y frontend.  
- Publicamos imágenes reales en GHCR.  
- Armamos un pipeline CI/CD con GitHub Actions.  
- Desplegamos QA y PROD en Render.  
- Entendimos cómo separar ambientes de forma profesional.  

