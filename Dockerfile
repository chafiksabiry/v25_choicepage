# Use a lightweight Node.js base image
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 
RUN npm run build  # This should compile `main.tsx` into `dist/`

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install serve globally
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

# Serve the static files from dist directory
CMD ["serve", "-s", "dist", "-l", "5173"]
