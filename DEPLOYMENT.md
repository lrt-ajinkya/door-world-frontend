# Door World Frontend Deployment Guide

## Overview

This React application is containerized using Docker and deployed to VPS at `46.62.155.60` using Caddy as a reverse proxy.

## Architecture

```
Internet → Caddy (HTTPS/SSL) → Docker Container (serve) → React App
```

## Prerequisites

- Docker and Docker Compose installed on VPS
- Caddy installed and configured on VPS
- SSH access to the VPS
- Node.js and Yarn for local development

## Configuration Files

- **Dockerfile**: Multi-stage build (Node.js build → Node.js serve)
- **docker-compose.yml**: Container orchestration
- **Caddyfile**: Reverse proxy and SSL configuration
- **deploy.sh**: Automated deployment script

## Environment Configuration

### Development

- API Host: `http://localhost:3420`
- Frontend Port: `3000` (via `yarn start`)

### Production

- API Host: `https://46.62.155.60`
- Frontend Port: `3000` (inside container and exposed)
- Served through Caddy reverse proxy

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

```bash
# Deploy to production
yarn deploy

# Deploy to staging
yarn deploy:staging

# Build and deploy
yarn bnd
```

### Method 2: Manual Docker Commands

```bash
# Build locally and test
yarn docker:build
yarn docker:run

# Deploy with Docker Compose
yarn docker:prod
```

### Method 3: Manual Steps

1. **Build locally:**

   ```bash
   yarn build
   ```

2. **Transfer files to VPS:**

   ```bash
   scp -r build/ root@46.62.155.60:/opt/doorworld-frontend/
   scp Dockerfile docker-compose.yml root@46.62.155.60:/opt/doorworld-frontend/
   ```

3. **SSH to VPS and deploy:**
   ```bash
   ssh root@46.62.155.60
   cd /opt/doorworld-frontend
   docker compose down
   docker compose up --build -d
   ```

## VPS Setup

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 2. Install Docker Compose

```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. Install Caddy

```bash
# Add Caddy repository
echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | tee /etc/apt/sources.list.d/caddy-fury.list
apt update
apt install caddy
```

### 4. Configure Caddy

Replace `your-frontend-domain.com` with your actual domain in the Caddyfile and copy it to `/etc/caddy/Caddyfile`:

```bash
cp Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
```

## Docker Network Setup

Ensure both frontend and backend containers can communicate:

```bash
# Create shared network (if not exists)
docker network create doorworld-network

# Update backend docker-compose.yml to use this network
# Update frontend docker-compose.yml to use this network
```

## Health Checks

- **Frontend Container**: `http://localhost:3000`
- **Through Caddy**: `https://your-domain.com`
- **Direct Container**: `docker exec doorworld-frontend wget --spider http://localhost:3000`

## Logs

### Container Logs

```bash
docker logs doorworld-frontend
docker compose logs -f
```

### Caddy Logs

```bash
tail -f /var/log/caddy/doorworld-frontend-access.log
journalctl -u caddy -f
```

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker ps -a

# Check logs
docker logs doorworld-frontend

# Rebuild without cache
docker compose build --no-cache
```

### SSL/Domain Issues

```bash
# Check Caddy configuration
caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy
systemctl reload caddy

# Check Caddy logs
journalctl -u caddy -f
```

### API Connection Issues

```bash
# Test API connectivity from container
docker exec doorworld-frontend curl -f https://46.62.155.60/health

# Check network connectivity
docker exec doorworld-frontend ping 46.62.155.60
```

### Performance Issues

```bash
# Monitor resource usage
docker stats doorworld-frontend

# Check container process
docker exec doorworld-frontend ps aux
```

## Security Considerations

1. **HTTPS Only**: All traffic should go through Caddy with SSL
2. **Security Headers**: Configured in Caddy
3. **Rate Limiting**: Implemented in Caddy
4. **CORS**: Properly configured for API communication
5. **CSP**: Content Security Policy allows necessary resources
6. **Non-root User**: Container runs as non-root user for security

## Backup and Rollback

### Create Backup

```bash
docker save doorworld-frontend:latest | gzip > frontend-backup.tar.gz
```

### Rollback

```bash
docker load < frontend-backup.tar.gz
docker compose down
docker compose up -d
```

## Monitoring

Set up monitoring for:

- Container health status
- Caddy access logs
- SSL certificate expiration
- Resource usage (CPU, Memory, Disk)
- API response times

## Updates

To update the application:

1. Update code locally
2. Run `yarn deploy` for automated deployment
3. Verify health checks pass
4. Monitor logs for issues

## Support

For issues:

1. Check container logs: `docker logs doorworld-frontend`
2. Check Caddy logs: `journalctl -u caddy -f`
3. Verify network connectivity between containers
4. Test API endpoints manually
