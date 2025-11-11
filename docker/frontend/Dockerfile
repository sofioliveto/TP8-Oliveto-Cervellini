# Imagen base de nginx
FROM nginx:alpine

# Crear directorio de trabajo
WORKDIR /usr/share/nginx/html

# Eliminar archivos por defecto de nginx
RUN rm -rf ./*

# Copiar archivos del frontend
COPY . .

# Crear configuración personalizada de nginx
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuración para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuración para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Exponer puerto 80
EXPOSE 80

# Script para configurar la URL de la API dinámicamente
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# Si existe API_URL como variable de entorno, crear archivo de configuración
if [ ! -z "$API_URL" ]; then
    echo "Configurando API_URL: $API_URL"
    cat > /usr/share/nginx/html/config.js << EOL
window.API_CONFIG = {
    API_URL: '$API_URL'
};
EOL
else
    echo "Usando configuración por defecto para localhost"
    cat > /usr/share/nginx/html/config.js << EOL
window.API_CONFIG = {
    API_URL: 'http://localhost:3000'
};
EOL
fi

echo "Configuración creada:"
cat /usr/share/nginx/html/config.js

# Ejecutar nginx
exec nginx -g "daemon off;"
EOF

RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]