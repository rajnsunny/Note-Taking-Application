# Note-Taking-Application

## Overview

This project is a secure and scalable RESTful API that allows users to manage notes, share them with other users, and search for notes based on keywords. The application implements user authentication, authorization, rate limiting, and text indexing for efficient search functionality.

## Technical Stack

- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Rate Limiting and Throttling:** Implemented for handling high traffic
- **Testing:** Unit tests, Integration tests using [Testing Framework]
- **Text Indexing:** Leveraging MongoDB text indexes for efficient keyword search

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rajnsunny/Note-Taking-Application.git
   cd your-repo
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the necessary environment variables:

   ```env
   PORT=5050
   MONGODB_URI=mongodb://localhost:27017/your-database
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```

   The API will be accessible at `http://localhost:5050`.

## Testing

1. **Run Unit Tests:**
   ```bash
   npm test
   ```

2. **Run Integration Tests:**
   ```bash
   npm run test:integration
   ```

## API Endpoints

### Authentication Endpoints

- **POST /api/auth/register:**
  Create a new user account.

- **POST /api/auth/login:**
  Log in to an existing user account and receive an access token.

- **POST /api/auth/refresh:**
  Refresh the access token (requires authentication).

### Note Endpoints

- **GET /api/notes:**
  Get a list of all notes for the authenticated user.

- **GET /api/notes/:noteId:**
  Get a note by ID for the authenticated user.

- **POST /api/notes:**
  Create a new note for the authenticated user.

- **PUT /api/notes/:noteId:**
  Update an existing note by ID for the authenticated user.

- **DELETE /api/notes/:noteId:**
  Delete a note by ID for the authenticated user.

- **POST /api/notes/:noteId/share:**
  Share a note with another user for the authenticated user.(can be set the recipient user so that only they can view that).

- **POST /api/notes/:shareId/share:**
    To get the shared notes for the targeted user. 

### Search Endpoint

- **GET /api/search?q=:query:**
  Search for notes based on keywords for the authenticated user.

## Evaluation Criteria

### 1. Correctness

The code meets the requirements and works as expected.

### 2. Performance

The code uses rate limiting and request throttling to handle high traffic.

### 3. Security

The code implements secure authentication and authorization mechanisms.

### 4. Quality

The code is well-organized, maintainable, and easy to understand.

### 5. Completeness

The code includes unit tests, integration tests, and end-to-end tests for all endpoints.

### 6. Search Functionality

The code implements text indexing and search functionality for efficient keyword search.

## Author

- [Sunny]
- [rajnsunny9@gmail.com]

Feel free to reach out if you have any questions or need further assistance!