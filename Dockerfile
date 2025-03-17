# Use a lightweight Node.js base image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Set environment variables
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyc3Nwa213dHJydW9xZXF4amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTczNTEsImV4cCI6MjA1Mjg5MzM1MX0.Lp1H4KOBEzYF1yN3B9lOlsQcBgwFVdRc44vgJrZJe7g
ENV VITE_SUPABASE_URL=https://trsspkmwtrruoqeqxjcf.supabase.co
ENV NODE_ENV=production

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Create a smaller production image
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5173

# Copy package files for production dependencies only
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the server.js file and the built app from the build stage
COPY --from=build /app/server.js ./
COPY --from=build /app/dist ./dist

# Expose the port for the Express server
EXPOSE 5173

# Command to run the Express server
CMD ["node", "server.js"]