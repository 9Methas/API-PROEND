# Authentication API

This module provides authentication functionality using Supabase as the backend with a custom users table.

## Endpoints

### Register
- **POST** `/auth/register`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe" // optional
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```

### Login
- **POST** `/auth/login`
- **Description**: Login with email and password
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Same as register response

### Logout
- **POST** `/auth/logout`
- **Description**: Logout the current user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Refresh Token
- **POST** `/auth/refresh`
- **Description**: Refresh access token using refresh token
- **Body**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**: Same as register response

### Get Profile
- **GET** `/auth/profile`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**:
  ```json
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "height": 175.5,
    "profileImageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

### Update Profile
- **PUT** `/auth/profile`
- **Description**: Update current user profile
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "height": 175.5,
    "profileImageUrl": "https://example.com/image.jpg"
  }
  ```
- **Response**: Same as get profile response

## Environment Variables

Make sure to set these environment variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

The API works with your existing `users` table structure:

```sql
CREATE TABLE public.users (
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  username text NULL,
  email text NULL,
  password_hash text NULL,
  first_name text NULL,
  last_name text NULL,
  date_of_birth date NULL,
  gender text NULL,
  height numeric NULL,
  profile_image_url text NULL,
  created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
```

## Row Level Security (RLS)

Enable RLS on your users table:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Error Handling

The API returns appropriate HTTP status codes:

- `201` - Created (register)
- `200` - OK (login, logout, refresh, profile, update profile)
- `400` - Bad Request (validation errors, registration errors)
- `401` - Unauthorized (invalid credentials, invalid token)
- `500` - Internal Server Error

## Notes

- The API creates users in both Supabase Auth and your custom `users` table
- User ID from Supabase Auth is used as `user_id` in your users table
- If user creation in the users table fails, the auth user is automatically cleaned up
- The `password_hash` field in your table is not used as Supabase handles password hashing
- Username defaults to the email prefix if not provided during registration 