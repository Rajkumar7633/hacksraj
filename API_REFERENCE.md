# API Reference

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### POST /auth/signup
Create new user account

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
\`\`\`

### POST /auth/login
Login existing user

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
\`\`\`

### GET /auth/profile
Get authenticated user profile

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "subscription_plan": "free",
  "credits_remaining": 100,
  "created_at": "2025-12-03T10:00:00Z"
}
\`\`\`

## Generation Endpoints

### POST /generate
Generate creative variations

**Headers:**
\`\`\`
Authorization: Bearer <token>
Content-Type: multipart/form-data
\`\`\`

**Body:**
\`\`\`
logo: <image-file (PNG, JPEG, WebP)>
product: <image-file (PNG, JPEG, WebP)>
style: minimal|bold|playful|professional|modern
quantity: 5-25 (number)
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "projectId": "project_1734860400000",
  "creatives": [
    {
      "id": "creative_1",
      "variation": 1,
      "imageUrl": "https://example.com/image1.png",
      "caption": "Discover innovation. Elevate your brand.",
      "prompt": "Creative variation...",
      "style": "modern",
      "timestamp": "2025-12-03T10:05:00Z"
    }
  ],
  "totalGenerated": 10,
  "creditsUsed": 10,
  "generatedAt": "2025-12-03T10:05:00Z"
}
\`\`\`

**Error (402 - Insufficient Credits):**
\`\`\`json
{
  "error": "Insufficient credits",
  "creditsNeeded": 10,
  "creditsRemaining": 5
}
\`\`\`

### GET /download/:projectId
Download project as ZIP

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`
Content-Type: application/zip
Content-Disposition: attachment; filename="creatives_project_1734860400000.zip"
\`\`\`

The ZIP contains:
- All generated creative images
- metadata.json with project info
- captions.json with AI-generated captions

## Project Endpoints

### GET /projects
Get user's projects

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "projects": [
    {
      "id": "project_1734860400000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Project - Modern",
      "style": "modern",
      "status": "completed",
      "total_creatives": 10,
      "created_at": "2025-12-03T10:00:00Z",
      "updated_at": "2025-12-03T10:05:00Z"
    }
  ]
}
\`\`\`

### GET /projects/:projectId
Get specific project details

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "project": {
    "id": "project_1734860400000",
    "name": "Project - Modern",
    "style": "modern",
    "total_creatives": 10,
    "status": "completed",
    "creatives": [...]
  }
}
\`\`\`

### DELETE /projects/:projectId
Delete project

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Project deleted"
}
\`\`\`

## Admin Endpoints

### GET /admin/stats
Get system statistics (Admin only)

**Headers:**
\`\`\`
Authorization: Bearer <admin-token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "totalUsers": 150,
  "totalProjects": 450,
  "totalCreatives": 4500,
  "apiCallsToday": 1200,
  "avgResponseTime": 250,
  "queueLength": 3,
  "activeConnections": 12,
  "cacheHitRate": 87
}
\`\`\`

### GET /admin/users
Get all users (Admin only)

**Response (200):**
\`\`\`json
{
  "users": [
    {
      "id": "user_1",
      "email": "user@example.com",
      "subscription_plan": "free",
      "credits_remaining": 85,
      "created_at": "2025-12-01T00:00:00Z",
      "totalProjects": 3
    }
  ]
}
\`\`\`

### POST /admin/users/:userId/credits
Add credits to user (Admin only)

**Request:**
\`\`\`json
{
  "amount": 50
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Added 50 credits to user"
}
\`\`\`

### GET /admin/logs
Get API usage logs (Admin only)

**Response (200):**
\`\`\`json
{
  "logs": [
    {
      "id": "log_1",
      "userId": "user_1",
      "action": "generate_creatives",
      "creditsUsed": 10,
      "createdAt": "2025-12-03T10:05:00Z",
      "status": "success"
    }
  ]
}
\`\`\`

## Error Responses

All error responses follow this format:

\`\`\`json
{
  "error": "Error message here",
  "timestamp": "2025-12-03T10:00:00Z"
}
\`\`\`

### Status Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 402: Payment Required (Insufficient Credits)
- 403: Forbidden (Admin only)
- 404: Not Found
- 429: Too Many Requests (Rate Limited)
- 500: Server Error

## Rate Limits

- API: 10 requests/second per IP
- Web: 30 requests/second per IP
- Burst allowance: +50%

Rate limit headers in response:
\`\`\`
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1734860460
\`\`\`
\`\`\`
