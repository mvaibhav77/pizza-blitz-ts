# --- Stage 1: The Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy config files first (better caching)
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source and compile
COPY src ./src
RUN npm run build

# --- Stage 2: The Runner ---
FROM node:18-alpine

WORKDIR /app

# Install only production deps (keeps image small)
COPY package*.json ./
RUN npm install --production

# Copy the compiled JS from the Builder stage
COPY --from=builder /app/dist ./dist

# Start the worker
CMD ["node", "dist/worker.js"]