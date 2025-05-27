# Use a lightweight Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

ENV VITE_API_URL=https://preprod-api-registration.harx.ai/api

# Install dependencies
RUN npm install

# Copy the source code and serve configuration
COPY . .

# Build the app
RUN npm run build

# Install a lightweight HTTP server to serve the build
RUN npm install -g serve

# Expose the port for the HTTP server
EXPOSE 5173

# Command to serve the app with the correct path and configuration
CMD ["serve", "-s", "dist", "-l", "5173"]