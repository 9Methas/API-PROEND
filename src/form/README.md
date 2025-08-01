# Health Records API (Protected)

This module provides health record management functionality with user authentication.

## Authentication Required

All endpoints require authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Create Health Record
- **POST** `/form`
- **Description**: Create a new health record for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "date": "2024-01-01",
    "weight": 70.5,
    "sleep_time": "22:00",
    "wake_time": "07:00",
    "sleep_quality": "good",
    "exercise_type": "running",
    "exercise_duration": 30,
    "water_intake": 2000,
    "meals_count": 3,
    "medications": "vitamin d",
    "symptoms": "none",
    "stress_level": "low",
    "mood": "happy",
    "energy_level": "high",
    "notes": "Feeling great today!"
  }
  ```
- **Response**:
  ```json
  {
    "record_id": "uuid",
    "user_id": "user-uuid",
    "date": "2024-01-01",
    "weight": 70.5,
    "sleep_time": "22:00",
    "wake_time": "07:00",
    "sleep_quality": "good",
    "exercise_type": "running",
    "exercise_duration": 30,
    "water_intake": 2000,
    "meals_count": 3,
    "medications": "vitamin d",
    "symptoms": "none",
    "stress_level": "low",
    "mood": "happy",
    "energy_level": "high",
    "notes": "Feeling great today!",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
  ```

### Get All Health Records
- **GET** `/form`
- **Description**: Get all health records for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Array of health records for the user

### Get Specific Health Record
- **GET** `/form/:recordId`
- **Description**: Get a specific health record for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Single health record

### Update Health Record
- **PUT** `/form/:recordId`
- **Description**: Update a health record for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: Same as create, but all fields are optional
- **Response**: Updated health record

### Partial Update Health Record
- **PATCH** `/form/:recordId`
- **Description**: Partially update a health record for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: Any fields to update (all optional)
- **Response**: Updated health record

### Delete Health Record
- **DELETE** `/form/:recordId`
- **Description**: Delete a health record for the authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Deleted health record

## Security Features

- ✅ **Authentication Required**: All endpoints require valid JWT token
- ✅ **User Isolation**: Users can only access their own records
- ✅ **Automatic User ID**: User ID is automatically set from authentication
- ✅ **Input Validation**: All inputs are validated using DTOs

## Error Responses

- `401 Unauthorized`: Invalid or missing token
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Record not found or doesn't belong to user
- `500 Internal Server Error`: Server error

## Example Usage

```bash
# First, get a token by logging in
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use the token to create a health record
curl -X POST http://localhost:3000/form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2024-01-01",
    "weight": 70.5,
    "sleep_quality": "good",
    "mood": "happy"
  }'

# Get all records for the user
curl -X GET http://localhost:3000/form \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

The API works with a `health_records` table:

```sql
CREATE TABLE health_records (
  record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  date DATE,
  weight NUMERIC,
  sleep_time TIME,
  wake_time TIME,
  sleep_quality TEXT,
  exercise_type TEXT,
  exercise_duration INTEGER,
  water_intake INTEGER,
  meals_count INTEGER,
  medications TEXT,
  symptoms TEXT,
  stress_level TEXT,
  mood TEXT,
  energy_level TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
``` 