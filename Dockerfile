# Step 1: Build the client (React app)
FROM node:18 AS builder
WORKDIR /app

# Copy everything and install dependencies
COPY . .
RUN npm install
RUN npm install --prefix client
RUN npm run build

# Step 2: Production image
FROM node:18-slim
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

# Set environment
ENV NODE_ENV=production

# Install only production dependencies
RUN npm install --omit=dev

# Expose port for Cloud Run
EXPOSE 8080

# Start the server
CMD ["npm", "start"]