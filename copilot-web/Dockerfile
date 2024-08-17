# Step 1: Build the React app
FROM node:18 AS build
USER root
# Set the working directory
WORKDIR /app
COPY . .
# Copy package.json and package-lock.json
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
# Install dependencies
RUN npm install
RUN yarn install --frozen-lockfile
# Copy the rest of the application code


# Build the React app
RUN npm run build

# Step 2: Serve the React app
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80