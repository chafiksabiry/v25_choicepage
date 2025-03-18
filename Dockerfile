# Use a lightweight Node.js base image
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 
RUN npm run build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY server.js ./
RUN npm install express cors

COPY --from=build /app/dist ./dist

EXPOSE 5173

# Use our custom Express server
CMD ["node", "server.js"]
