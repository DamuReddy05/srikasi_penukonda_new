# Temple Management System

A full-stack web application for managing temple operations, pujas, darshan bookings, and expenses.

## Tech Stack

- **Backend**: Django REST Framework (DRF) with PostgreSQL
- **Frontend**: Angular (latest version) with Angular Material
- **Authentication**: Google OAuth + JWT
- **Payments**: Razorpay/Stripe integration

## Features

### Backend (Django REST Framework)
- User Management with Google OAuth
- Temple Calendar & Puja Management
- Darshan Booking System
- Temple Expense Management
- Payment Integration

### Frontend (Angular)
- Google Authentication
- Calendar View with Puja Management
- Darshan Booking Interface
- Admin Dashboard
- Devotee Profile Management

## Project Structure

```
temple-management-system/
├── backend/                 # Django REST Framework backend
│   ├── temple_management/   # Main Django project
│   ├── users/              # User management app
│   ├── pujas/              # Puja and calendar management
│   ├── bookings/           # Darshan booking system
│   ├── expenses/           # Temple expense management
│   ├── payments/           # Payment integration
│   └── requirements.txt    # Python dependencies
├── frontend/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── guards/
│   │   └── assets/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Redis (for Celery background tasks)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Run the automated setup script:
   ```bash
   python setup.py
   ```
   
   Or manually:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Copy environment file
   cp env.example .env
   
   # Update .env with your configuration
   # (Database, Google OAuth, Payment gateway keys)
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   ```

3. Start the development server:
   ```bash
   python manage.py runserver
   ```

4. Access the admin panel at: http://localhost:8000/admin
5. Access the API documentation at: http://localhost:8000/api/docs/

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Run the automated setup script:
   ```bash
   ./setup.sh
   ```
   
   Or manually:
   ```bash
   # Install dependencies
   npm install
   
   # Update environment configuration
   # Edit src/environments/environment.ts
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application at: http://localhost:4200

### Database Setup
1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE temple_db;
   CREATE USER temple_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE temple_db TO temple_user;
   ```
3. Update the database configuration in `backend/.env`

### Payment Gateway Setup
1. **Razorpay**: Sign up at https://razorpay.com and get your API keys
2. **Stripe**: Sign up at https://stripe.com and get your API keys
3. Update the payment gateway configuration in `backend/.env`

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Update the Google OAuth configuration in `backend/.env` and `frontend/src/environments/environment.ts`

## API Documentation

The API documentation is available at `/api/docs/` when the backend server is running.

### Key API Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile

#### Pujas & Events
- `GET /api/pujas/` - List all pujas
- `POST /api/pujas/` - Create new puja (admin only)
- `GET /api/pujas/{id}/` - Get puja details
- `PUT /api/pujas/{id}/` - Update puja (admin only)
- `DELETE /api/pujas/{id}/` - Delete puja (admin only)
- `GET /api/calendar/events/` - Get calendar events
- `GET /api/events/today/` - Get today's events

#### Puja Bookings
- `GET /api/puja-bookings/` - List puja bookings
- `POST /api/puja-bookings/` - Create puja booking
- `GET /api/puja-bookings/{id}/` - Get booking details
- `PUT /api/puja-bookings/{id}/` - Update booking
- `DELETE /api/puja-bookings/{id}/` - Cancel booking

#### Darshan Bookings
- `GET /api/darshan-slots/` - List darshan slots
- `POST /api/darshan-slots/` - Create darshan slot (admin only)
- `GET /api/available-slots/` - Get available slots
- `GET /api/darshan-bookings/` - List darshan bookings
- `POST /api/darshan-bookings/` - Create darshan booking

#### Expenses (Admin Only)
- `GET /api/expenses/` - List expenses
- `POST /api/expenses/` - Create expense
- `GET /api/expenses/statistics/` - Get expense statistics
- `GET /api/expenses/monthly-report/` - Get monthly report

#### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create payment
- `POST /api/razorpay/create-order/` - Create Razorpay order
- `POST /api/razorpay/verify-payment/` - Verify Razorpay payment
- `POST /api/stripe/create-payment-intent/` - Create Stripe payment intent

#### User Management (Admin Only)
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Response Format
All API responses follow a consistent format:
```json
{
  "data": {...},
  "message": "Success message",
  "status": "success"
}
```

### Error Handling
Errors are returned with appropriate HTTP status codes and error messages:
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/temple_db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  googleClientId: 'your-google-client-id'
};
```

## Deployment

### Backend Deployment (Django)
1. Set up a production server (Ubuntu/CentOS)
2. Install Python, PostgreSQL, Redis, and Nginx
3. Configure environment variables for production
4. Set up SSL certificates
5. Configure Nginx as reverse proxy
6. Use Gunicorn as WSGI server
7. Set up Celery for background tasks

### Frontend Deployment (Angular)
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to a web server
3. Configure Nginx to serve the Angular app
4. Set up SSL certificates
5. Configure environment variables for production

### Docker Deployment
Docker configurations are available for easy deployment:
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Development

### Code Style
- Backend: Follow PEP 8 for Python code
- Frontend: Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for critical functionality

### Testing
```bash
# Backend tests
python manage.py test

# Frontend tests
npm test
```

### Database Migrations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support and questions, please create an issue in the repository.
```
