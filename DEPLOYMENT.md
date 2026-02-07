# 🚀 Deployment Guide

## Employee Management API - Production Deployment

This guide covers deploying the Employee Management API to production environments.

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong random string (32+ characters)
- [ ] Use secure database credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your frontend domain
- [ ] Set up rate limiting
- [ ] Review and restrict database permissions
- [ ] Enable Redis password authentication
- [ ] Set `NODE_ENV=production`

### Infrastructure
- [ ] MySQL database provisioned
- [ ] Redis instance available
- [ ] SMTP server configured (or email service)
- [ ] Domain name configured
- [ ] SSL certificate obtained

### Configuration
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Backup strategy defined
- [ ] Monitoring tools set up
- [ ] Logging configured

---

## 🌐 Deployment Options

### Option 1: Traditional VPS (Ubuntu/Debian)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Install Redis
sudo apt install redis-server
sudo systemctl enable redis-server
```

#### 2. Application Setup
```bash
# Clone repository
git clone <your-repo-url>
cd employee-management-api

# Install dependencies
pnpm install

# Create production env
cp .env.example .env
nano .env  # Edit with production values

# Build application
pnpm build
```

#### 3. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE employee_management;
CREATE USER 'empapp'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON employee_management.* TO 'empapp'@'localhost';
FLUSH PRIVILEGES;
exit;
```

#### 4. Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name employee-api

# Setup startup script
pm2 startup
pm2 save

# View logs
pm2 logs employee-api

# Monitor
pm2 monit
```

#### 5. Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Configure
sudo nano /etc/nginx/sites-available/employee-api
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/employee-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=1d
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 3. Deploy with Docker
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

---

### Option 3: Cloud Platforms

#### AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init -p node.js-20 employee-api
```

3. Create environment:
```bash
eb create production-env
```

4. Configure RDS and ElastiCache:
- Add RDS MySQL instance
- Add ElastiCache Redis
- Update environment variables

5. Deploy:
```bash
eb deploy
```

#### Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create employee-management-api

# Add addons
heroku addons:create jawsdb:kitefin  # MySQL
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku master

# Open
heroku open
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Node.js environment
3. Add MySQL database
4. Add Redis database
5. Set environment variables
6. Deploy

#### Railway

1. Connect GitHub repository
2. Add MySQL plugin
3. Add Redis plugin
4. Configure environment variables
5. Deploy automatically on push

---

## ⚙️ Production Environment Variables

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=your-db-user
DB_PASSWORD=strong-password-here
DB_NAME=employee_management

# JWT
JWT_SECRET=very-long-random-secure-string-here-at-least-32-characters
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password-if-needed

# Email (Production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Application Logging

Add winston logger:
```bash
pnpm add winston winston-daily-rotate-file
```

### Health Check Endpoint

Create `src/health/health.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## 🔐 Security Best Practices

### 1. Rate Limiting
```bash
pnpm add @nestjs/throttler
```

In `app.module.ts`:
```typescript
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
}),
```

### 2. Helmet (Security Headers)
```bash
pnpm add helmet
```

In `main.ts`:
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 3. CORS Configuration
In `main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

---

## 🗄️ Database Management

### Migrations (Production)

Change TypeORM config to use migrations:
```typescript
// database.module.ts
synchronize: false, // NEVER true in production
migrations: ['dist/migrations/*.js'],
migrationsRun: true,
```

Create migration:
```bash
pnpm typeorm migration:create src/migrations/InitialSchema
```

Run migrations:
```bash
pnpm typeorm migration:run
```

### Backup Strategy

MySQL backup script:
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup_$TIMESTAMP.sql
# Upload to S3 or backup storage
```

Automated with cron:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## 📈 Performance Optimization

### 1. Enable Compression
```bash
pnpm add compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Database Indexes
```typescript
@Index(['email'])
@Index(['employeeIdentifier'])
@Entity()
export class Employee { ... }
```

### 3. Redis Caching
Implement caching for frequently accessed data:
```typescript
@Injectable()
export class EmployeesService {
  @Cacheable({ ttl: 300 })
  async findAll() { ... }
}
```

---

## 🧪 Pre-Production Testing

```bash
# Set production env
export NODE_ENV=production

# Build
pnpm build

# Test build
node dist/main.js

# Load testing (install k6)
k6 run load-test.js

# Security scan
npm audit
```

---

## 📱 Monitoring Tools

### Recommended Services
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, Rollbar
- **APM**: New Relic, DataDog
- **Logs**: Loggly, Papertrail
- **Analytics**: Google Analytics

### Setup Sentry
```bash
pnpm add @sentry/node
```

In `main.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Continuous Deployment)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/employee-api
            git pull
            pnpm install
            pnpm build
            pm2 restart employee-api
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Database Connection Failed**
- Check credentials in .env
- Verify database is running
- Check firewall rules

**Redis Connection Error**
- Verify Redis is running
- Check Redis host/port
- Test: `redis-cli ping`

**Memory Issues**
- Increase Node.js memory: `node --max-old-space-size=4096`
- Monitor with PM2: `pm2 monit`

**High CPU Usage**
- Check for infinite loops
- Review database queries
- Enable caching

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible
- [ ] Database connection working
- [ ] Redis connection working
- [ ] Authentication working
- [ ] All endpoints responding
- [ ] Email notifications working
- [ ] PDF reports generating
- [ ] Excel reports generating
- [ ] Swagger documentation accessible
- [ ] HTTPS enabled
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Error tracking enabled
- [ ] Load testing passed

---

## 📚 Additional Resources

- [NestJS Production Documentation](https://docs.nestjs.com/techniques/performance)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**Deployment Status**: Ready for production deployment ✅
