# Step 1: Use Node.js as the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Define environment variables from .env file
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyc3Nwa213dHJydW9xZXF4amNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTczNTEsImV4cCI6MjA1Mjg5MzM1MX0.Lp1H4KOBEzYF1yN3B9lOlsQcBgwFVdRc44vgJrZJe7g
ENV VITE_SUPABASE_URL=https://trsspkmwtrruoqeqxjcf.supabase.co


# Step 5: Install dependencies
RUN npm install

# Step 6: Copy all project files into the container
COPY . .

# Step 7: Expose the port used by Vite
EXPOSE 5173

# Step 8: Define the default command to run the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
