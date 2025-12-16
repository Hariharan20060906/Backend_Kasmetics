# Kasmetics Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kasmetics
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Headers: `Authorization: Bearer <token>`

### Admin Routes

#### GET /api/admin/users
Headers: `Authorization: Bearer <admin_token>`

#### GET /api/admin/dashboard
Headers: `Authorization: Bearer <admin_token>`

#### PATCH /api/admin/users/:id/role
Headers: `Authorization: Bearer <admin_token>`
```json
{
  "role": "admin"
}
```

## Creating Admin User

After signup, manually update user role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@kasmetics.com" },
  { $set: { role: "admin" } }
)
```