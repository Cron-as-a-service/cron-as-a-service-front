# Étape 1 : Construction de l'application
FROM node:18 AS build

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . ./

# Construire l'application
RUN npm run build

# Vérifier le contenu du répertoire de build
RUN ls -la /app/build

# Étape 2 : Servir l'application avec nginx
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]