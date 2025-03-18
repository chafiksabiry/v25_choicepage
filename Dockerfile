# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production && \
    npm install express cors compression

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY server.js .

# Set proper permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app/dist

# Switch to non-root user
USER node

# Expose port
EXPOSE 5173

# Start the server
CMD ["node", "server.js"]
