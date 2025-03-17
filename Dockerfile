# Build stage
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyc3Nwa213dHJydW9xZXF4amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTczNTEsImV4cCI6MjA1Mjg5MzM1MX0.Lp1H4KOBEzYF1yN3B9lOlsQcBgwFVdRc44vgJrZJe7g
ENV VITE_SUPABASE_URL=https://trsspkmwtrruoqeqxjcf.supabase.co

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# Create a custom nginx.conf for the container
RUN echo 'server { \
    listen 5173; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    include /etc/nginx/mime.types; \
    types { \
        application/javascript js; \
        application/javascript mjs; \
        text/css css; \
    } \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.js$ { \
        add_header Content-Type application/javascript; \
    } \
    location ~* \.css$ { \
        add_header Content-Type text/css; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose the port for the HTTP server
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]