# =====================================================================
#  Dockerfile — Frontend MlMobile (React Native / Expo)
# ---------------------------------------------------------------------
#  Una app React Native se compila a móvil (APK/IPA) y normalmente no
#  "vive" dentro de Kubernetes. Para cumplir el requisito de contenerizar
#  y desplegar un frontend, generamos la versión WEB de Expo
#  (React Native Web) y la servimos como sitio estático con nginx.
#
#  Requiere que el proyecto tenga soporte web:
#     npx expo install react-dom react-native-web @expo/metro-runtime
#
#  Este archivo va en la RAÍZ del repo MlMobile (junto a package.json).
# =====================================================================

# ---------- Etapa 1: build del bundle web ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias con caché de capa
COPY package*.json ./
RUN npm ci

# Copia el resto del código de la app
COPY . .

# Exporta el sitio estático a /app/dist
#   Expo SDK 50+ genera la carpeta "dist" con index.html + assets.
RUN npx expo export --platform web --output-dir dist

# ---------- Etapa 2: servidor estático ----------
FROM nginx:1.27-alpine

# Config de nginx pensada para una SPA (rutas del cliente -> index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el build web generado en la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
