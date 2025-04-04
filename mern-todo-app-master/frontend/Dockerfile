# Use Node.js official image as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the build folder
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
