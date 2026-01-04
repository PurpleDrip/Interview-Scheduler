# Automated Interview Scheduler with AI Matching

A full-stack application that intelligently matches interviewer and candidate availability using AI to propose optimal interview slots.

## Features

✨ **AI-Powered Parsing**: Uses OpenAI GPT-4 to understand natural language availability  
📅 **Smart Matching**: Intelligent algorithm finds optimal time slots  
📧 **Email Notifications**: Professional emails with calendar invites  
🗓️ **Calendar Integration**: .ics files compatible with all major calendar apps  
⚡ **Modern Stack**: Next.js frontend + Express.js backend + MongoDB  

## Project Structure

```
interview-scheduler/
├── backend/           # Express.js API server
├── frontend/          # Next.js web application
├── postman/           # Postman collection for API testing
├── screenshots/       # Demo screenshots
└── README.md          # This file
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with backend URL
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Technologies

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- OpenAI API (GPT-4)
- SendGrid (Email)
- Express Validator

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- React Hook Form
- Custom CSS

## Key Features

### 1. Flexible Availability Input
- **Structured**: Use time pickers for precise scheduling
- **Free-text**: Write naturally like "I'm free Monday 2-4pm"
- **AI Parsing**: Automatically converts text to time slots

### 2. Intelligent Matching
The algorithm considers:
- Business hours (9 AM - 6 PM preferred)
- Weekdays over weekends
- Optimal meeting times (10 AM - 2 PM)
- Timezone compatibility
- Buffer time availability

### 3. Professional Communication
- Beautiful HTML email templates
- Calendar invites (.ics files)
- Automatic reminders
- Compatible with Google Calendar, Outlook, Apple Calendar

## API Endpoints

See [backend/README.md](backend/README.md) for complete API documentation.

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing

Import the Postman collection from `postman/Interview-Scheduler.postman_collection.json` to test all API endpoints.

## Screenshots

See the `screenshots/` directory for:
- Candidate availability form
- Interviewer availability form
- AI parsing demonstration
- Dashboard with proposed slots
- Email notifications
- Calendar invite examples

## Development

This project is structured for professional presentation:
- Clean, organized code
- Comprehensive error handling
- Input validation
- Detailed logging
- Production-ready architecture

## License

ISC

---

**Built with ❤️ for intelligent interview scheduling**
