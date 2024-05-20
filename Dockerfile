# build environment
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Copy the entrypoint script
# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
# Ensure the entrypoint script has execute permissions
RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]