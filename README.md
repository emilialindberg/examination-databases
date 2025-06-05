## Movie Review API

## Description
This is a RESTful API for a movie review platform. The backend is built with Node.js, Express, and MongoDB (using mongoose).
Users can register, log in with JWT tokens, and leave reviews on movies. Only logged-in users can create, update, or delete their own reviews.

## Features
User registration
Login with JWT-based authentication
CRUD operations for movies
CRUD operations for reviews (only accessible for logged-in users)
Secure authentication with roles
Relations between movies and reviews using "populate"
Technologies
Node.js (version XX)
Express.js
MongoDB (local or cloud, e.g., MongoDB Atlas)
JWT for authentication
dotenv for managing environment variables
Requirements
Node.js (version XX or later)
MongoDB (locally installed or cloud-based)
Postman (for testing APIs)

## Installation
1. Clone the repository
bash
git clone <your_repo_url>

2. cd examination-individuell

3. Install dependencies
bash
npm install

5. Configure environment variables
Create a .env file in the root of the project based on .env.example
bash
cp .env.example .env
Fill in your values (secret key, database URL)

7. Start the database
Make sure MongoDB is running locally (mongod)
Or connect to your cloud MongoDB Atlas instance, update the URL in .env

9. Start the server
bash
npm start
