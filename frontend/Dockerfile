# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para tests)
RUN npm ci

# Copiar el resto de archivos
COPY . .
# Asegurar que exista aunque no haya assets
RUN mkdir -p /app/assets

# Ejecutar tests (opcional en build)
RUN npm test

# Stage final para servir archivos estáticos
FROM nginx:alpine

# Copiar todos los archivos estáticos desde el stage de build
COPY --from=build /app/ /usr/share/nginx/html/

# Limpiar archivos no necesarios en producción
RUN cd /usr/share/nginx/html && \
    rm -rf node_modules package*.json __tests__ *.test.js coverage .git* README.md

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]