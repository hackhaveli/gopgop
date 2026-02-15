# GopGop API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "creator" // or "brand" or "admin"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "creator"
    },
    "session": { ... }
  }
}
```

---

### 2. Login
**POST** `/auth/login`

Authenticate with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "creator",
      "email_verified": false
    },
    "session": { ... }
  }
}
```

---

### 3. Logout
**POST** `/auth/logout`

Sign out the current user.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### 4. Get Session
**GET** `/auth/session`

Get current user session and profile.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "creator",
      "email_verified": false,
      "created_at": "2024-01-27T..."
    },
    "profile": { ... }, // creator_profiles or brand_profiles data
    "session": { ... }
  }
}
```

---

## Creator Endpoints

### 5. Create Creator Profile
**POST** `/creators`

**Authentication Required:** Creator role

**Request Body:**
```json
{
  "display_name": "John Doe",
  "username": "johndoe",
  "bio": "Food blogger from Mumbai",
  "niche": "Food",
  "city": "Mumbai",
  "instagram_handle": "@johndoe",
  "instagram_followers": 45000,
  "instagram_engagement_rate": 4.2
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    "username": "johndoe",
    "verification_status": "pending",
    "plan_type": "free",
    ...
  }
}
```

---

### 6. List Creators
**GET** `/creators?niche=Food&city=Mumbai&page=1&limit=20`

Get list of verified creators with optional filters.

**Query Parameters:**
- `niche` (optional): Filter by niche
- `city` (optional): Filter by city
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "creators": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

---

### 7. Get Creator Profile
**GET** `/creators/:id`

Get a specific creator's profile and reels.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "display_name": "John Doe",
    "username": "johndoe",
    "bio": "...",
    "reels": [...]
  }
}
```

---

### 8. Update Creator Profile
**PUT** `/creators/:id`

**Authentication Required:** Profile owner or admin

**Request Body:**
```json
{
  "display_name": "John Doe Updated",
  "bio": "Updated bio"
}
```

---

### 9. Delete Creator Profile
**DELETE** `/creators/:id`

**Authentication Required:** Profile owner or admin

---

### 10. Get Creator Reels
**GET** `/creators/:id/reels`

Get all reels for a creator.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "creator_id": "uuid",
      "platform": "Instagram",
      "reel_url": "https://...",
      "views": 50000,
      "likes": 2500,
      "comments": 150
    }
  ]
}
```

---

### 11. Add Reel
**POST** `/creators/:id/reels`

**Authentication Required:** Profile owner

**Request Body:**
```json
{
  "platform": "Instagram",
  "reel_url": "https://instagram.com/reel/...",
  "thumbnail_url": "https://...",
  "views": 50000,
  "likes": 2500,
  "comments": 150
}
```

---

### 12. Update Reel
**PUT** `/creators/:id/reels/:reelId`

**Authentication Required:** Profile owner

---

### 13. Delete Reel
**DELETE** `/creators/:id/reels/:reelId`

**Authentication Required:** Profile owner

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [...] // optional validation errors
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input data (400)
- `UNAUTHORIZED` - No valid session (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `DUPLICATE_RECORD` - Unique constraint violation (409)
- `INTERNAL_ERROR` - Server error (500)

---

## Testing the API

### Using cURL

**Sign up:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "role": "creator"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Using Postman

1. Import the endpoints into Postman
2. Set base URL: `http://localhost:3000/api`
3. For authenticated requests, include session cookies

---

## Next Steps

Phase 3 (Brand Features) will add:
- Brand profile management
- Creator search/discovery
- Inquiry system
- Shortlist management
