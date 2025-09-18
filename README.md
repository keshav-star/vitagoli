# Quiz Application

A Next.js application featuring a 5-question quiz with MongoDB storage and email notifications.

## Features

- Multi-step quiz with 5 questions
- Email-based user identification
- MongoDB storage for quiz results
- Automated email notifications via ZeptoMail
- Score calculation and personalized recommendations
- Mobile-responsive UI using Tailwind CSS

## Prerequisites

- Node.js 18 or later
- MongoDB instance (local or hosted)
- ZeptoMail account for email notifications

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quiz-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configurations:
   - `MONGODB_URI`: Your MongoDB connection string
   - `ZEPTO_API_KEY`: Your ZeptoMail API key
   - `ZEPTO_FROM_EMAIL`: Sender email address for notifications
   - `NEXT_PUBLIC_BASE_URL`: Your application's base URL

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── quiz/         # Quiz-related endpoints
│   └── quiz/             # Quiz frontend pages
├── components/            # Reusable UI components
├── context/              # React Context providers
├── lib/                  # Utility functions
│   ├── email.js         # Email service integration
│   ├── mongo.js         # MongoDB connection
│   ├── quiz-data.js     # Quiz questions data
│   └── recommendation.js # Score calculation & recommendations
├── models/               # MongoDB models
└── __tests__/           # Test files
```

## API Endpoints

### POST /api/quiz/submit
Submit quiz answers and get results.

Request body:
```json
{
  "email": "user@example.com",
  "answers": [
    {
      "questionId": 1,
      "answer": "Selected answer",
      "isCorrect": true
    }
    // ... more answers
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "quiz-result-id",
    "score": 5,
    "recommendation": "Personalized recommendation"
  }
}
```

### GET /api/quiz/result
Get quiz results by ID.

Query parameters:
- `id`: Quiz result ID

Response:
```json
{
  "success": true,
  "data": {
    "score": 5,
    "recommendation": "Personalized recommendation",
    "createdAt": "2025-09-17T12:00:00.000Z"
  }
}
```

## Testing

Run the test suite:

```bash
npm test
```

The test suite includes:
- API endpoint validation
- Quiz submission flow
- Database operations (mocked)
- Email notifications (mocked)

## Development

1. Make code changes
2. Run tests: `npm test`
3. Start development server: `npm run dev`

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `ZEPTO_API_KEY`: ZeptoMail API key
- `ZEPTO_FROM_EMAIL`: Sender email for notifications
- `NEXT_PUBLIC_BASE_URL`: Application base URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
