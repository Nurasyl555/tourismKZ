# 🏔️ Tourism in Kazakhstan - Web Portal

A comprehensive web application for discovering attractions, planning tours, and booking travel experiences in Kazakhstan. Features multi-language support, AI-powered recommendations, and an intuitive admin dashboard.

**Available Languages:** 🇰🇿 Kazakh | 🇷🇺 Russian | 🇬🇧 English

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

---

## ✨ Features

### 👤 User Features
- **Attractions Discovery**: Browse and search attractions with filters by region and category
- **Detailed Pages**: View high-quality images, descriptions, ratings, and reviews
- **Interactive Maps**: Location visualization using Leaflet maps
- **Tour Routes**: Pre-planned multi-day tours with daily itineraries
- **Booking System**: Select dates, number of travelers, and complete payment
- **User Profile**: 
  - Edit personal information and profile avatar
  - View complete booking history
  - Save favorite attractions and routes
- **AI Travel Planner**: Intelligent chatbot providing personalized travel recommendations
- **PDF Itineraries**: Download tour schedules as PDF documents
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Review System**: Rate and review attractions

### 🛡️ Admin Features
- **Attractions Management**: 
  - Create, read, update, delete attractions
  - Upload and manage images
  - Set geolocation coordinates
  - Manage categories and regions
- **Routes Management**: 
  - Create multi-day tour routes
  - Add and arrange itinerary stops
  - Set duration labels and notes
- **Review Moderation**: Approve/reject user reviews
- **Dashboard Analytics**: View statistics and site metrics

### 🌐 Multi-language Support
- Kazakh (KZ) - Native support
- Russian (RU) - Native support
- English (EN) - Native support
- Seamless language switching without page reload

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library and component framework |
| **TypeScript** | Static type checking and improved DX |
| **Vite** | Modern build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | High-quality reusable components |
| **Leaflet & React-Leaflet** | Interactive map visualization |
| **Axios** | HTTP client for API requests |
| **react-i18next** | Multi-language translation management |
| **jsPDF & html2canvas** | PDF generation and export |
| **lucide-react** | Beautiful, consistent icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Django 4+** | Web framework and ORM |
| **Django REST Framework** | RESTful API development |
| **Simple JWT** | JSON Web Token authentication |
| **Pillow** | Image processing and optimization |
| **SQLite** | Development database (default) |
| **PostgreSQL** | Production database (optional) |
| **python-dotenv** | Environment variable management |
| **CORS Headers** | Cross-origin request handling |

---

## 📁 Project Structure

```
project_2/
├── backend/                          # Django REST Backend
│   ├── tourism_backend/
│   │   ├── api/                     # Main API app
│   │   │   ├── models.py            # Data models (Attraction, Route, Booking, etc.)
│   │   │   ├── serializers.py       # DRF serializers for API responses
│   │   │   ├── views.py             # ViewSets and API endpoints
│   │   │   ├── urls.py              # API route configuration
│   │   │   ├── admin.py             # Django admin configuration
│   │   │   ├── tests.py             # Unit tests
│   │   │   ├── management/
│   │   │   │   └── commands/        # Custom management commands
│   │   │   │       ├── populate_db.py
│   │   │   │       └── __pycache__/
│   │   │   └── migrations/          # Database schema migrations
│   │   ├── tourism_backend/         # Project configuration
│   │   │   ├── settings.py          # Django settings
│   │   │   ├── urls.py              # Main URL router
│   │   │   ├── wsgi.py              # WSGI configuration
│   │   │   ├── asgi.py              # ASGI configuration
│   │   │   └── __pycache__/
│   │   ├── manage.py                # Django management CLI
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── populate_db.py           # Database seeding script
│   │   ├── populate_routes.py       # Route seeding script
│   │   ├── .env                     # Environment variables
│   │   └── package.json             # Node.js config (for frontend scripts)
│   └── media/                        # User-uploaded files
│       └── attractions/             # Attraction images
│
├── front/                            # React TypeScript Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── pages/               # Page-level components
│   │   │   │   ├── HomePageGuest.tsx
│   │   │   │   ├── HomePageUser.tsx
│   │   │   │   ├── AttractionDetails.tsx
│   │   │   │   ├── RouteDetails.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminManageAttractions.tsx
│   │   │   │   ├── AdminManageRoutes.tsx
│   │   │   │   ├── AiPlanner.tsx
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   └── ...
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ... (shadcn/ui components)
│   │   │   ├── figma/               # Figma design components
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   ├── Map.tsx              # Interactive map component
│   │   │   ├── AttractionCard.tsx   # Attraction display card
│   │   │   └── LanguageSwitcher.tsx # Language toggle
│   │   ├── styles/                  # Global styles
│   │   │   └── globals.css
│   │   ├── guidelines/              # UI/UX documentation
│   │   │   └── Guidelines.md
│   │   ├── App.tsx                  # Main app component and routing
│   │   ├── main.tsx                 # React entry point
│   │   ├── i18n.ts                  # i18next configuration
│   │   └── images.d.ts              # TypeScript image imports
│   ├── index.html                   # HTML template
│   ├── vite.config.ts               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json                 # Node.js dependencies
│   └── README.md                    # Frontend documentation
│
└── README.md                         # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** (v7+)
- **Python** (v3.8+)
- **pip** (Python package manager)
- **Git** (for version control)

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

#### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Create Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-change-this-in-production
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Step 5: Run Database Migrations
```bash
python manage.py migrate
```

#### Step 6: Create Superuser Account (Admin)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

#### Step 7: (Optional) Load Sample Data
```bash
python manage.py populate_db
python manage.py populate_routes
```

#### Step 8: Start Backend Server
```bash
python manage.py runserver
```

Backend will be available at: **http://localhost:8000**

Admin panel: **http://localhost:8000/admin**

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd front
```

#### Step 2: Install Node Dependencies
```bash
npm install
# or
yarn install
```

#### Step 3: Configure API Endpoint (if needed)
Update the API base URL in your component files to match your backend URL. By default, it uses `http://localhost:8000`.

#### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

Frontend will be available at: **http://localhost:5173**

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/tourism_backend/settings.py`:

```python
# Allow frontend domain
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'yourdomain.com']

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com",
]

# Database configuration (change for production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tourism_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Frontend Configuration

Update API endpoints in your component files or create a config file:

```typescript
// Example: src/config.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## 📖 Usage

### Running Both Services

**Terminal 1 - Start Backend:**
```bash
cd backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Start Frontend:**
```bash
cd front
npm run dev
```

Then open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend Admin**: http://localhost:8000/admin

### Creating Admin Account

```bash
python manage.py createsuperuser
```

### Loading Sample Data

```bash
python manage.py populate_db      # Load attractions
python manage.py populate_routes   # Load tour routes
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <access_token>
```

### Obtain Token
```http
POST /token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Attractions Endpoints

```http
GET /attractions/
GET /attractions/?category=nature&region=Almaty
GET /attractions/{id}/
POST /attractions/          # Admin only
PUT /attractions/{id}/      # Admin only
DELETE /attractions/{id}/   # Admin only

Response:
{
  "id": 1,
  "name": "Big Almaty Lake",
  "description": "...",
  "category": "nature",
  "rating": 4.8,
  "latitude": 43.1234,
  "longitude": 77.5678,
  "image": "url",
  "reviews": []
}
```

### Routes Endpoints

```http
GET /routes/
GET /routes/{id}/
POST /routes/               # Admin only
PUT /routes/{id}/           # Admin only
DELETE /routes/{id}/        # Admin only

Response:
{
  "id": 1,
  "title": "Almaty City Tour",
  "description": "...",
  "distance_km": 45,
  "duration_days": 3,
  "included_stops": [
    {
      "day": 1,
      "attraction": {...},
      "duration_label": "2 hours"
    }
  ]
}
```

### Bookings Endpoints

```http
POST /bookings/
GET /bookings/
GET /bookings/{id}/

Request:
{
  "route": 1,
  "travel_date": "2024-06-15",
  "number_of_travelers": 2,
  "total_price": 250.00
}
```

### User Profile Endpoints

```http
GET /users/me/
PUT /users/me/
GET /users/{id}/

Response:
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar": "url",
  "bio": "Travel enthusiast",
  "bookings": []
}
```

---

## 🗄️ Database Schema

### Core Models

**Attraction**
- `id`: Primary key
- `name`: Attraction name
- `description`: Long description
- `category`: Nature, History, Culture, etc.
- `region`: Geographic region
- `latitude`, `longitude`: Coordinates
- `image`: Image file
- `rating`: Average rating (0-5)
- `review_count`: Total reviews
- `created_at`, `updated_at`: Timestamps

**Route**
- `id`: Primary key
- `title`: Route name
- `description`: Route details
- `distance_km`: Total distance
- `duration_days`: Number of days
- `image`: Route cover image
- `price`: Tour price
- `created_at`, `updated_at`: Timestamps

**RouteStop**
- `id`: Primary key
- `route`: FK to Route
- `attraction`: FK to Attraction
- `day`: Day number
- `order`: Order in day
- `duration_label`: "2 hours", etc.
- `notes`: Additional notes

**Booking**
- `id`: Primary key
- `user`: FK to User
- `route`: FK to Route
- `travel_date`: Selected travel date
- `number_of_travelers`: Count
- `total_price`: Total cost
- `status`: pending, confirmed, cancelled
- `created_at`: Booking date

**Review**
- `id`: Primary key
- `user`: FK to User
- `attraction`: FK to Attraction
- `rating`: 1-5 stars
- `text`: Review content
- `is_approved`: Moderation flag
- `created_at`: Review date

**User** (Custom)
- `id`: Primary key
- `email`: Unique email
- `password`: Hashed password
- `first_name`, `last_name`: Names
- `avatar`: Profile image
- `bio`: Bio text
- `is_staff`: Admin flag
- `is_active`: Active flag
- `created_at`: Join date

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test api
```

### Run Specific Test
```bash
python manage.py test api.tests.TestAttractionAPI
```

### Run with Coverage
```bash
coverage run --source='.' manage.py test api
coverage report
```

---

## 📦 Building for Production

### Backend Production Build

1. **Update settings.py**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com']
   SECRET_KEY = 'your-production-secret-key'
   ```

2. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Use production server** (Gunicorn)
   ```bash
   pip install gunicorn
   gunicorn tourism_backend.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Production Build

1. **Build optimized bundle**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy `dist/` folder** to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages
   - Traditional web hosting

---

## 🚢 Deployment Options

### Backend Deployment

- **Heroku**: Push Django app directly
- **AWS EC2**: Deploy with Gunicorn + Nginx
- **DigitalOcean**: App Platform or Droplets
- **Railway**: Simple git-based deployment
- **PythonAnywhere**: Managed Python hosting

### Frontend Deployment

- **Vercel**: Optimized for Next.js/React
- **Netlify**: Git-based continuous deployment
- **GitHub Pages**: Free static hosting
- **AWS Amplify**: AWS-integrated deployment
- **Cloudflare Pages**: Edge-based hosting

---

## 🐛 Troubleshooting

### Backend Issues

**Migration errors:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Database locked:**
```bash
rm db.sqlite3
python manage.py migrate
```

**Port already in use:**
```bash
python manage.py runserver 8001
```

### Frontend Issues

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Vite port in use:**
```bash
npm run dev -- --port 5174
```

**API connection issues:**
Verify backend is running and check CORS settings.

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Submit** a Pull Request

### Code Style
- Backend: Follow PEP 8
- Frontend: Use Prettier and ESLint configurations

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Contact

For questions, issues, or suggestions:
- Open an [Issue](../../issues)
- Contact the development team
- Check [Guidelines](front/src/guidelines/Guidelines.md) for design standards

---

## 🎉 Acknowledgments

- **React Community** for amazing tools
- **Django Team** for the powerful framework
- **shadcn/ui** for beautiful components
- **Leaflet** for mapping capabilities
- **Tailwind CSS** for utility-first styling

---

**Project Status**: Active Development  
**Last Updated**: January 2026  
**Version**: 1.0.0
