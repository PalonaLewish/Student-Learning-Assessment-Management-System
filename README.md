# Student Learning & Assessment Management System

A full-stack web application built with Node.js, Express, MySQL, HTML, and CSS using MVC architecture.

## Project Structure

- `server.js` - entry point for the Express server
- `config/db.js` - MySQL connection pool configuration
- `models/` - database query wrappers for Users, Subjects, Topics, Questions, and Quiz data
- `controllers/` - route controllers for authentication, question management, and quiz flow
- `routes/` - Express routing modules for `/auth`, `/questions`, and `/quiz`
- `public/css/styles.css` - shared frontend styles
- `views/` - EJS templates for login, register, dashboard, quiz, results, and error pages
- `student_assessment.sql` - SQL schema, stored procedure, and trigger definitions

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create and configure the database:
   - Copy `.env.example` to `.env`
   - Update MySQL credentials and database name

3. Run the SQL script to create the schema, stored procedure, and trigger:

   - Open your MySQL client and run `student_assessment.sql`

4. Start the application:

   ```bash
   npm run start
   ```

5. Visit `http://localhost:3000` in your browser.

## Features

- User authentication with roles: `admin` and `student`
- Admin panel to add subjects, topics, and questions
- Student search and filter by subject, topic, and difficulty
- Quiz generation with random questions using a stored procedure
- Quiz submission with transaction-safe inserts and score persistence
- Result history view for students
- Clean HTML/CSS interface with EJS templates

## Notes

- Make sure MySQL is running locally before starting the app.
- Use the `student_assessment.sql` file to create the database and schema.
- For security in production, replace `SESSION_SECRET` and database credentials with strong values.
