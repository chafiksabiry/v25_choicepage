# Use a lightweight Node.js base image
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Set NODE_ENV for proper dependency resolution
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies
COPY package*.json ./
COPY server.js ./
RUN npm install express cors compression

# Copy built files and ensure proper permissions
COPY --from=build /app/dist ./dist
RUN chown -R node:node /app \
    && chmod -R 755 /app/dist

# Switch to non-root user
USER node

EXPOSE 5173

# Use our custom Express server
CMD ["node", "server.js"]
