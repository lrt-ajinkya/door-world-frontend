#!/bin/bash

# Door World Frontend Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on any error

# Configuration
SERVER_IP="46.62.155.60"
SERVER_USER="root"
PROJECT_NAME="doorworld-frontend"
REMOTE_PATH="/opt/doorworld-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
ENVIRONMENT=${1:-production}
log_info "Deploying to $ENVIRONMENT environment"

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    log_error "Invalid environment. Use 'production' or 'staging'"
    exit 1
fi

# Build locally first to catch any build errors
log_info "Building React app locally..."
yarn build

if [[ $? -ne 0 ]]; then
    log_error "Local build failed. Aborting deployment."
    exit 1
fi

log_info "Local build successful"

# Create deployment package
log_info "Creating deployment package..."
tar -czf deploy.tar.gz \
    Dockerfile \
    docker-compose.yml \
    package.json \
    yarn.lock \
    src/ \
    public/ \
    .dockerignore

# Transfer files to server
log_info "Transferring files to server..."
scp deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Execute deployment on server
log_info "Executing deployment on server..."
ssh $SERVER_USER@$SERVER_IP << EOF
    set -e
    
    # Create project directory
    mkdir -p $REMOTE_PATH
    cd $REMOTE_PATH
    
    # Extract files
    tar -xzf /tmp/deploy.tar.gz
    rm /tmp/deploy.tar.gz
    
    # Stop existing container if running
    if docker ps -a --format 'table {{.Names}}' | grep -q $PROJECT_NAME; then
        echo "Stopping existing container..."
        docker compose down
    fi
    
    # Build and start new container
    echo "Building and starting new container..."
    docker compose build --no-cache
    docker compose up -d
    
    # Wait for health check
    echo "Waiting for container to be healthy..."
    for i in {1..30}; do
        if docker exec $PROJECT_NAME wget --no-verbose --tries=1 --spider http://localhost:3000 > /dev/null 2>&1; then
            echo "Container is healthy!"
            break
        fi
        if [ \$i -eq 30 ]; then
            echo "Container health check failed"
            exit 1
        fi
        sleep 2
    done
    
    # Clean up old images
    docker image prune -f
    
    echo "Deployment completed successfully!"
EOF

# Clean up local files
rm deploy.tar.gz

if [[ $? -eq 0 ]]; then
    log_info "Deployment completed successfully!"
    log_info "Frontend should be available at http://$SERVER_IP:3000"
    log_info "Health check: http://$SERVER_IP:3000"
else
    log_error "Deployment failed!"
    exit 1
fi