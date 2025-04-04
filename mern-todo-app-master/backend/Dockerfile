# Use Node.js official image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Copy environment file (make sure .env exists in this folder)
COPY .env .env

# Expose backend port
EXPOSE 8001

# Start the backend server
CMD ["npm", "start"]
