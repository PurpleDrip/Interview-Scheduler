# Interview Scheduler Frontend

Modern Next.js frontend for the Interview Scheduler application with AI-powered availability matching.

## Features

- **Beautiful UI**: Modern dark theme with glassmorphism and gradient effects
- **Dual Input Methods**: Structured time slots or natural language (AI-powered)
- **Form Validation**: React Hook Form with comprehensive validation
- **Responsive Design**: Works seamlessly on desktop and mobile
- **TypeScript**: Full type safety throughout the application
- **Professional Styling**: Custom CSS with smooth animations and transitions

## Tech Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- React Hook Form
- Custom CSS (no Tailwind bloat)
- Fetch API for backend communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/
│   ├── candidate/          # Candidate availability form
│   ├── interviewer/        # Interviewer availability form
│   ├── dashboard/          # Dashboard page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript definitions
└── public/                 # Static assets
```

## Pages

### Home (`/`)
Landing page with feature cards and navigation to candidate/interviewer forms.

### Candidate Form (`/candidate`)
Allows candidates to submit their availability using:
- **Structured Input**: Select specific date/time slots
- **Natural Language**: Write availability in plain English (e.g., "I'm free Monday 2-4pm")

### Interviewer Form (`/interviewer`)
Similar to candidate form but for interviewers to submit their available time slots.

### Dashboard (`/dashboard`)
View scheduled interviews and availability status.

## Styling

The application uses custom CSS with:
- CSS custom properties for theming
- Glassmorphism effects
- Gradient backgrounds and text
- Smooth animations and transitions
- Professional button and input styles
- Responsive design

## API Integration

The frontend communicates with the backend API using a typed API client (`lib/api.ts`):

- User management
- Availability submission
- Interview matching
- Interview confirmation

All API calls are typed and return consistent response structures.

## Development

### Adding New Pages

1. Create a new directory in `app/`
2. Add `page.tsx` file
3. Import necessary components and utilities
4. Use the API client for backend communication

### Styling

Global styles are in `app/globals.css`. Use the predefined CSS classes:
- `.btn`, `.btn-primary`, `.btn-secondary` for buttons
- `.card` for card containers
- `.input` for form inputs
- `.label` for form labels
- `.error` for error messages
- `.success` for success messages

## Build

To build for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## License

ISC
