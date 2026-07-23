# Build React app
FROM node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the React app
RUN yarn build

# Production stage - serve static files
FROM node:22-alpine

# Install serve package globally for serving static files
RUN npm install -g serve

# Create app directory
WORKDIR /app

# Copy built app from build stage
COPY --from=build /app/build ./build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R react:nodejs /app

# Switch to non-root user
USER react

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Expose port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]