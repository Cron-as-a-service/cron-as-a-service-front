# Étape 1 : Construction de l'application
FROM node:18 AS build

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Servir l'application avec nginx
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]