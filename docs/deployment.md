# Deployment Guide

This guide explains how to deploy Landscape Show in different environments.

## Deployment Options

### Option 1: Local Development (Recommended for Testing)

**Requirements:**
- Python 3.10+
- Node.js 18+
- npm

**Steps:**

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app/main.py
   # Backend runs on http://localhost:8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

### Option 2: Docker (Recommended for Production)

**Requirements:**
- Docker
- Docker Compose

**Steps:**

1. **Build and run with Docker Compose**
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 3: Production Build

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend**
```bash
cd frontend
npm install
npm run build
# Serve the dist/ folder with nginx or similar
```

## Configuration

### Backend Configuration

Edit `backend/app/config.py` or use environment variables:

- `DATA_DIR`: Directory for YAML files (default: `data`)
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `8000`)
- `CORS_ORIGINS`: Allowed CORS origins

Example `.env` file:
```env
DATA_DIR=/path/to/data
HOST=0.0.0.0
PORT=8000
```

### Frontend Configuration

Edit `frontend/vite.config.ts` for:
- API proxy settings
- Build output directory
- Development server port

## Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name landscape.yourcompany.com;

    # Frontend
    location / {
        root /var/www/landscape-show/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Considerations

1. **File Access**: Ensure the data directory has appropriate permissions
2. **CORS**: Configure CORS origins for your domain
3. **HTTPS**: Use HTTPS in production (Let's Encrypt recommended)
4. **Authentication**: Add authentication if deploying to public network (future feature)

## Data Backup

Your landscape data is stored in YAML files in the `backend/data/` directory.

**Backup command:**
```bash
tar -czf landscape-backup-$(date +%Y%m%d).tar.gz backend/data/
```

**Restore command:**
```bash
tar -xzf landscape-backup-YYYYMMDD.tar.gz
```

## Monitoring

### Health Check

The backend provides a health check endpoint:
```bash
curl http://localhost:8000/health
```

### Logs

**Backend logs:**
```bash
# Development
python app/main.py  # stdout

# Production (systemd)
journalctl -u landscape-backend -f
```

**Frontend logs:**
Check your web server logs (nginx, apache, etc.)

## Troubleshooting

### Backend Issues

**Problem: Module not found**
```bash
cd backend
pip install -r requirements.txt
```

**Problem: Port already in use**
```bash
# Change port in config.py or use environment variable
export PORT=8001
python app/main.py
```

### Frontend Issues

**Problem: API connection failed**
- Check that backend is running
- Verify proxy settings in `vite.config.ts`
- Check CORS configuration

**Problem: Build fails**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance Tuning

### Backend

- Use multiple Uvicorn workers for production:
  ```bash
  uvicorn app.main:app --workers 4
  ```

- Enable gzip compression in nginx
- Use caching headers for static assets

### Frontend

- Build for production: `npm run build`
- Enable nginx gzip compression
- Configure CDN for static assets (optional)

## Scaling

For larger deployments:

1. **Multiple backend instances** behind a load balancer
2. **Shared data directory** using NFS or similar
3. **Database backend** instead of file system (future feature)
4. **Redis** for caching (future feature)
