
# Use a lightweight Node.js base image
FROM node:18-alpine

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

# Install a lightweight HTTP server to serve the build
RUN npm install -g serve

# Expose the port for the HTTP server
EXPOSE 5173

# Command to serve the app
CMD ["serve", "-s", "dist", "-l", "5173"]