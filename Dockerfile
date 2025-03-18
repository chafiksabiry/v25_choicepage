# Use a lightweight Node.js base image
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . . 
RUN npm run build  # This should compile `main.tsx` into `dist/`

# Production image
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY server.js ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist  

EXPOSE 5173

# Use the custom server.js instead of the generic serve command
CMD ["node", "server.js"]
