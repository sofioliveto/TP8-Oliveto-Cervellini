# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de archivos
COPY . .
# Asegurar que exista aunque no haya assets
RUN mkdir -p /app/assets

# Stage final para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos estáticos desde el stage de build
COPY --from=build /app/*.html /usr/share/nginx/html/
COPY --from=build /app/*.css /usr/share/nginx/html/
COPY --from=build /app/*.js /usr/share/nginx/html/
# Copiar assets (la carpeta fue creada en el stage build)
COPY --from=build /app/assets/ /usr/share/nginx/html/assets/

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]