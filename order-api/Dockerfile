# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Production Run ---
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies (no devDependencies like typescript/nest-cli)
COPY package*.json ./
RUN npm install --production

# Copy the built files from Stage 1
COPY --from=builder /app/dist ./dist

# Run the app
CMD ["node", "dist/main"]