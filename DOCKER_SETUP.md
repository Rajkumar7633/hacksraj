# Docker Setup Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

1. **Clone and Setup**
\`\`\`bash
git clone <repo-url>
cd ai-creative-studio
cp .env.example .env
\`\`\`

2. **Configure Environment Variables**
Edit `.env` file with your API keys:
\`\`\`env
IMAGE_GEN_API_KEY=your_dall_e_key
LLM_API_KEY=your_openai_key
JWT_SECRET=generate_random_secret
\`\`\`

3. **Build and Run**
\`\`\`bash
docker-compose up --build
\`\`\`

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432
- Redis: localhost:6379

4. **Initialize Database**
\`\`\`bash
docker-compose exec db psql -U postgres -d ai_creative_studio -f /docker-entrypoint-initdb.d/schema.sql
\`\`\`

## Docker Commands

**Start services**
\`\`\`bash
docker-compose up
\`\`\`

**Stop services**
\`\`\`bash
docker-compose down
\`\`\`

**View logs**
\`\`\`bash
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

**Access database**
\`\`\`bash
docker-compose exec db psql -U postgres -d ai_creative_studio
\`\`\`

**Rebuild services**
\`\`\`bash
docker-compose up --build
\`\`\`

## Production Deployment

1. Update environment variables in `.env`
2. Change `JWT_SECRET` to secure random value
3. Update SSL certificates in `./ssl/`
4. Run: `docker-compose -f docker-compose.prod.yml up -d`

## Troubleshooting

- **Port already in use**: Change ports in docker-compose.yml
- **Database connection failed**: Ensure DB_PASSWORD is set correctly
- **API not responding**: Check backend logs: `docker-compose logs backend`
