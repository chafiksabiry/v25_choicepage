# Build stage
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist/choicepage /usr/share/nginx/html/choicepage

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]