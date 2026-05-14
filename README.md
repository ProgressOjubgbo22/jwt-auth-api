A backend authentication system built with Express.js, MongoDB, JWT, and bcrypt. It supports user registration, login, protected routes, profile management, and admin-only operations.

Features
User registration and login
Password hashing with bcrypt
JWT authentication
Protected routes
Role-based access control (user/admin)
Profile update and deletion
Admin user management

Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JSON Web Token (JWT)
bcrypt

API Routes

Auth Routes
POST /users/register → Register user
POST /users/login → Login user
POST /users/logout → Logout user
POST /users/refresh-token → Get new token

GET /users/profile → Get user profile
PUT /users/profile → Update profile
DELETE /users/profile → Delete account
POST /users/change-password → Change password

Admin Routes (Admin only)
GET /users/users → Get all users
DELETE /users/users/:id → Delete any user
PUT /users/users/:id/role → Update user role
