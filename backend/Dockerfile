# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para tests)
RUN npm ci

# Copiar el resto de archivos
COPY . .

# Stage final para producción
FROM node:18-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos de aplicación desde el stage de build
COPY --from=build /app/*.js ./
COPY --from=build /app/*.db ./

# Cambiar ownership al usuario backend del grupo nodejs
RUN chown -R backend:nodejs /app
USER backend

# Exponer puerto 3000 (ajusta según tu aplicación)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando por defecto
CMD ["npm", "start"]