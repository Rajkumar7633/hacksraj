# Installation Guide

## System Requirements

- Docker: 20.10+
- Docker Compose: 2.0+
- 4GB RAM minimum (8GB recommended)
- 2 CPU cores minimum
- 20GB free disk space

## Step-by-Step Installation

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/ai-creative-studio.git
cd ai-creative-studio
\`\`\`

### 2. Environment Setup

\`\`\`bash
# Copy example env file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
\`\`\`

### 3. Configure API Keys

Get API keys from these providers:

**Image Generation:**
- DALL-E: https://platform.openai.com/api-keys
- Stable Diffusion: https://huggingface.co/settings/tokens
- Midjourney: https://www.midjourney.com/

**LLM:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Groq: https://console.groq.com/

### 4. Build and Start

\`\`\`bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps
\`\`\`

### 5. Initialize Database

\`\`\`bash
# Wait for DB to be healthy (2-3 minutes)
docker-compose logs db

# Once ready, the schema will auto-initialize
# Or manually run:
docker-compose exec db psql -U postgres -d ai_creative_studio \\
  -f /docker-entrypoint-initdb.d/schema.sql
\`\`\`

### 6. Create Admin User

\`\`\`bash
# Sign up via http://localhost:3000/signup
# Then set as admin in .env:
ADMIN_EMAILS=youremail@example.com

# Restart containers
docker-compose restart
\`\`\`

### 7. Verify Installation

\`\`\`bash
# Check all services running
curl http://localhost:5000/api/health

# Frontend should be accessible
open http://localhost:3000
\`\`\`

## Troubleshooting Installation

**Ports already in use**
\`\`\`bash
# Change ports in docker-compose.yml
# Or free up ports:
sudo lsof -i :3000
kill -9 <PID>
\`\`\`

**Database won't start**
\`\`\`bash
# Remove old volume and restart
docker-compose down -v
docker-compose up -d db
# Wait 30 seconds for init
\`\`\`

**Out of memory**
\`\`\`bash
# Increase Docker memory in Desktop settings
# Or increase swap:
docker-compose down
# Increase resources and restart
\`\`\`

**Frontend won't connect to backend**
\`\`\`bash
# Verify backend is running
docker-compose logs backend

# Check NEXT_PUBLIC_API_URL is correct
# Should be http://localhost:5000 for local
# Or your domain for production
\`\`\`

## Next Steps

1. Sign up at http://localhost:3000
2. Upload logo and product image
3. Select creative style
4. Generate and download creatives

See README.md for full documentation.
