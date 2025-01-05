# Build stage
FROM --platform=linux/amd64 node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Production stage
FROM --platform=linux/amd64 node:20-slim

# Create app user with specific UID/GID
RUN groupmod -g 1000 node && \
    usermod -u 1000 -g 1000 node && \
    mkdir -p /app && \
    chown -R node:node /app

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder --chown=node:node /app ./

# Switch to non-root user
USER node

# Set environment
ENV NODE_ENV=production \
    PUID=1000 \
    PGID=1000

# Command to run
CMD ["node", "multibot.js"]
