# Use a lightweight Node.js base image
FROM node:20-alpine

# Install curl and http-server
RUN apk add --no-cache curl \
    && npm install -g http-server

# Set the working directory
WORKDIR /app

# Set environment variables (be careful with secrets in public repos)
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

# Expose the port for the HTTP server
EXPOSE 5173


# Install serve
RUN npm install -g serve

# Use serve to serve the build with CORS enabled
CMD serve -s dist -l 5173 --cors 
