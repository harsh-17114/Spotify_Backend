# Spotify Backend

A backend application for a music streaming platform built with **Node.js**, **Express.js**, and **MongoDB**. The application provides user authentication, artist-based music uploads, album management, and secure API access using JWT authentication.

## Features

* User registration and login
* Secure password hashing using bcrypt
* JWT-based authentication
* Role-based access for users and artists
* Cookie-based authentication
* Upload music files using Multer
* Store uploaded music using ImageKit
* Create and fetch music albums
* Fetch all available music
* Fetch all albums
* Fetch album details by ID
* MongoDB database integration using Mongoose
* RESTful API architecture
* Environment variable configuration using dotenv

## Tech Stack

* **Node.js** – JavaScript runtime
* **Express.js** – Backend framework
* **MongoDB** – Database
* **Mongoose** – MongoDB object modeling
* **JWT (jsonwebtoken)** – Authentication
* **bcryptjs** – Password hashing
* **Multer** – File upload handling
* **ImageKit** – Cloud file storage
* **Cookie-parser** – Cookie handling
* **dotenv** – Environment variable management

## Project Structure

```text
Spotify_Backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── music.controller.js
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── file.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── music.model.js
│   │   └── album.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── music.routes.js
│   │
│   ├── services/
│   │   └── storage.service.js
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/harsh-17114/Spotify_Backend.git
```

### 2. Navigate to the project directory

```bash
cd Spotify_Backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGE_KIT_KEY=your_imagekit_private_key
```

Replace the values with your actual MongoDB and ImageKit credentials.

### 5. Start the server

```bash
node server.js
```

The backend server will start on port `3000`.

```text
Server Started Successfully
```

## API Endpoints

### Authentication APIs

Base URL: `/api/auth`

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | `/register` | Register a new user |
| POST   | `/login`    | Login user          |
| POST   | `/logout`   | Logout user         |

### Music APIs

Base URL: `/api/music`

| Method | Endpoint           | Description                |
| ------ | ------------------ | ---------------------------|
| POST   | `/upload`          | Upload music (Artist only) |
| POST   | `/album`           | Create album (Artist only) |
| GET    | `/`                | Get all music              |
| GET    | `/albums`          | Get all albums             |
| GET    | `/albums/:albumId` | Get album by ID            |

## Authentication & Authorization

The application uses JWT tokens stored in cookies for authentication.

### User Roles

* **User** – Can access user-related functionality.
* **Artist** – Can upload music and create albums.

### Authentication Flow

1. User registers or logs in.
2. Server generates a JWT token containing the user's ID.
3. Token is stored in an HTTP-only cookie.
4. Authentication middleware verifies the JWT and fetches the user from MongoDB.
5. The user's role is checked before allowing artist-only operations.
6. Artists can access protected music upload and album creation routes.

## Error Handling

The application uses centralized error handling middleware to handle:

* Multer file upload errors
* Invalid music file type errors
* Unexpected application errors

Errors are logged on the server, and appropriate HTTP status codes are returned to the client.

## Database Models

### User Model

Stores user authentication and profile information.

* Username
* Email
* Password
* Role (`user` or `artist`)

### Music Model

Stores music information.

* Music URI
* Music title
* Artist reference

### Album Model

Stores album information.

* Album title
* Music references
* Artist reference

## How It Works

The application follows a structured backend architecture.

* **Routes** handle incoming API requests.
* **Controllers** contain the application logic.
* **Models** define MongoDB schemas.
* **Middlewares** handle authentication, authorization, file uploads, and application errors.
* **Services** manage external operations such as file uploads and file deletion.
* **Database** connects the application to MongoDB.

### Music Upload Flow

1. Artist sends a music file through the upload API.
2. Multer validates the file type and size and temporarily stores it in memory.
3. The file is uploaded to ImageKit.
4. The music URL and title are saved in MongoDB.
5. If database creation fails after the ImageKit upload, the uploaded file is deleted.
6. The server returns the created music details.

## Main Files

### server.js

Starts the Express server and connects to MongoDB.

### app.js

Configures Express middleware, registers API routes, and handles application errors.

### auth.controller.js

Handles user registration, login, and logout.

### music.controller.js

Handles music uploads, album creation, and fetching music and albums.

### auth.middleware.js

Verifies JWT tokens and checks user roles.

### file.middleware.js

Handles music file uploads using Multer, including file type and 20 MB size validation.

### error.middleware.js

Handles Multer file upload errors and other application errors.

### storage.service.js

Handles music file uploads and deletion through ImageKit cloud storage.

## Conclusion

Spotify Backend is a practical Node.js backend project designed to demonstrate the fundamentals of REST API development, authentication, database integration, file uploads, and role-based authorization. The project provides a foundation for building a complete music streaming platform with features such as user management, artist uploads, album creation, and cloud-based music storage.