# Testing Guide

## Postman Collection

Import the Postman collection from `postman/Interview-Scheduler.postman_collection.json`

### Environment Variables

The collection uses the following variables:
- `base_url`: Backend API URL (default: http://localhost:5000)
- `candidate_id`: ID of created candidate (auto-populated)
- `interviewer_id`: ID of created interviewer (auto-populated)
- `availability_id`: ID of availability record
- `interview_id`: ID of interview record

### Testing Workflow

#### 1. Start the Backend

```bash
cd backend
npm run dev
```

Backend should be running on http://localhost:5000

#### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend should be running on http://localhost:3000

#### 3. Test with Postman

**Step 1: Create Users**
1. Run "Create Candidate" request
2. Copy the `_id` from response and set as `candidate_id` variable
3. Run "Create Interviewer" request
4. Copy the `_id` from response and set as `interviewer_id` variable

**Step 2: Submit Availability**
1. Run "Submit Availability (Structured)" for candidate
   - Uses specific date/time slots
2. Run "Submit Availability (AI Free-text)" for interviewer
   - Tests AI parsing with natural language

**Step 3: Match Interview Slots**
1. Run "Match Interview Slots" request
2. Copy the `_id` from response and set as `interview_id` variable
3. Check the `proposedSlots` array for matched time slots

**Step 4: Confirm Interview**
1. Run "Confirm Interview" request
2. Check email (if SendGrid is configured)
3. Verify calendar invite attachment

#### 4. Test with Frontend

**Candidate Flow:**
1. Navigate to http://localhost:3000
2. Click "I'm a Candidate"
3. Fill in personal information
4. Choose input method:
   - **Structured**: Add time slots manually
   - **Natural Language**: Write "I'm available Monday 2-4pm and Wednesday morning"
5. Submit and verify success message

**Interviewer Flow:**
1. Navigate to http://localhost:3000
2. Click "I'm an Interviewer"
3. Fill in personal information
4. Submit availability
5. Check dashboard

## API Endpoints Reference

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/role/:role` - Get users by role

### Availability
- `POST /api/availability` - Submit availability
- `GET /api/availability/user/:userId` - Get user's availability
- `GET /api/availability/:id` - Get availability by ID
- `PUT /api/availability/:id` - Update availability
- `DELETE /api/availability/:id` - Delete availability

### Interviews
- `POST /api/interview/match` - Find matching slots
- `POST /api/interview/confirm` - Confirm interview
- `GET /api/interview/:id` - Get interview by ID
- `GET /api/interview/user/:userId` - Get user's interviews
- `PUT /api/interview/:id/cancel` - Cancel interview

## Testing AI Parsing

Test the AI parsing with various natural language inputs:

**Examples:**
- "I'm free Monday through Friday from 2pm to 5pm"
- "Available next week Tuesday and Thursday afternoons"
- "I can do interviews on Jan 15-20, mornings only"
- "Free this Wednesday 10am-12pm and Friday 2pm-4pm"

The AI will parse these and convert to structured time slots.

## Email Testing

To test email functionality:

1. Get a free SendGrid API key from https://sendgrid.com
2. Add to backend `.env`:
   ```
   SENDGRID_API_KEY=your_key_here
   SENDGRID_FROM_EMAIL=noreply@yourcompany.com
   ```
3. Restart backend
4. Confirm an interview
5. Check email inbox for:
   - Professional HTML email
   - Calendar invite (.ics) attachment
   - All interview details

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify MongoDB URI in `.env`
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

**OpenAI API Error:**
- Verify API key in `.env`
- Check API key has sufficient credits
- Test with structured input first

**SendGrid Error:**
- Verify API key is correct
- Check sender email is verified in SendGrid
- System will work without SendGrid (emails just won't send)

### Frontend Issues

**API Connection Error:**
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Form Submission Error:**
- Check browser console for validation errors
- Verify all required fields are filled
- Check network tab for API response

## Success Criteria

✅ Backend starts without errors  
✅ Frontend starts without errors  
✅ Can create users via Postman  
✅ Can submit structured availability  
✅ Can submit free-text availability (AI parses correctly)  
✅ Matching algorithm finds overlapping slots  
✅ Can confirm interview  
✅ Emails sent (if SendGrid configured)  
✅ Calendar invites attached to emails  
✅ Frontend forms work correctly  
✅ Dashboard displays data  

## Performance Notes

- AI parsing typically takes 2-5 seconds
- Matching algorithm is near-instant
- Email sending takes 1-2 seconds
- All operations should complete within 10 seconds
