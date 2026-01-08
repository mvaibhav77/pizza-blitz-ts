# --- Stage 1: The Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy config files first (better caching)
COPY kitchen-worker/package*.json kitchen-worker/tsconfig.json ./
RUN npm install

# Copy Prisma schema from the monorepo so we can generate a client
COPY order-api/prisma ./prisma

# Generate Prisma client for the worker (uses copied schema)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source and compile
COPY kitchen-worker/src ./src
RUN npm run build

# --- Stage 2: The Runner ---
FROM node:18-alpine

WORKDIR /app

# Install only production deps (keeps image small)
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copy generated Prisma client from builder so production image doesn't need dev deps
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma



# Copy the compiled JS from the Builder stage
COPY --from=builder /app/dist ./dist

# Start the worker
CMD ["node", "dist/worker.js"]