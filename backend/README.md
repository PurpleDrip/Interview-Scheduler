# Interview Scheduler Backend

Backend API for the Automated Interview Scheduler with AI-powered availability matching.

## Features

- **User Management**: Create and manage candidates and interviewers
- **Availability Submission**: Support for both structured time slots and free-text input
- **AI Parsing**: Uses OpenAI GPT-4 to parse natural language availability
- **Smart Matching**: Intelligent algorithm to find optimal interview time slots
- **Email Notifications**: Professional emails with calendar invites (.ics files)
- **Calendar Integration**: RFC 5545 compliant calendar invites for all major calendar apps

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenAI API (GPT-4)
- **Email**: SendGrid
- **Validation**: Express Validator
- **Date Handling**: date-fns

## Setup

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- SendGrid API key (optional, for email functionality)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
SENDGRID_FROM_NAME=Interview Scheduler
FRONTEND_URL=http://localhost:3000
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Users

- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/role/:role` - Get all users by role (candidate/interviewer)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Availability

- `POST /api/availability` - Submit availability (structured or free-text)
- `GET /api/availability/user/:userId` - Get availability by user
- `GET /api/availability/:id` - Get availability by ID
- `PUT /api/availability/:id` - Update availability
- `DELETE /api/availability/:id` - Delete availability

### Interviews

- `POST /api/interview/match` - Find matching time slots
- `POST /api/interview/confirm` - Confirm interview and send calendar invites
- `GET /api/interview/:id` - Get interview by ID
- `GET /api/interview/user/:userId` - Get all interviews for a user
- `PUT /api/interview/:id/cancel` - Cancel interview

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database, OpenAI, SendGrid configuration
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (AI, matching, email, calendar)
│   ├── routes/          # API routes
│   ├── middleware/      # Error handling, validation
│   ├── utils/           # Helper functions
│   └── server.js        # Express app entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## AI Availability Parsing

The system can parse natural language availability using OpenAI. Examples:

- "I'm free Monday 2-4pm and Wednesday morning"
- "Available next week Tuesday and Thursday afternoons"
- "Free from Jan 15-20, 9am to 5pm"

The AI will convert these to structured time slots with confidence scoring.

## Matching Algorithm

The matching algorithm scores time slots based on:
- Business hours preference (9 AM - 5 PM)
- Weekday preference
- Optimal meeting times (10 AM - 2 PM)
- Proximity to current date
- Available buffer time

Returns up to 3 optimal slots ranked by score.

## Email & Calendar

Emails are sent via SendGrid with:
- Professional HTML templates
- Attached .ics calendar files
- Support for Google Calendar, Outlook, Apple Calendar
- Automatic reminders (15 min and 5 min before)

## Error Handling

All errors are handled consistently with:
- Appropriate HTTP status codes
- Structured error responses
- Detailed logging
- Validation error details

## Development

The codebase follows these principles:
- ES6+ modern JavaScript
- Async/await for asynchronous operations
- Comprehensive error handling
- Input validation on all endpoints
- Detailed logging
- Clean separation of concerns

## License

ISC
