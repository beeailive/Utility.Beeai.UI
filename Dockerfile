# Stage 1: Build Angular app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copy the rest of the app and build
COPY . .
RUN ng build --configuration production

# Stage 2: Serve app with NGINX
FROM nginx:alpine

# Copy Angular build output to NGINX html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
