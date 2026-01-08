# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
# Generate Prisma client from schema (required for @prisma/client)
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# --- Stage 2: Production Run ---
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies (no devDependencies like typescript/nest-cli)
COPY package*.json ./
RUN npm install --production
# Copy prisma client (generated in builder) so runtime does not need dev deps
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copy the built files from Stage 1
COPY --from=builder /app/dist ./dist

# Run the app
CMD ["node", "dist/src/main.js"]