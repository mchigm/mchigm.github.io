> Original filename: README.md

# Backend Directory

This directory contains the backend code for the MCHIGM platform.

## Technology Stack

- **PHP**: Main business logic and API endpoints
- **Python**: Data analysis and automation tasks

## Directory Structure

```
backend/
├── php/                    # PHP application
�?  ├── src/
�?  �?  ├── Controllers/    # API controllers
�?  �?  ├── Models/         # Data models
�?  �?  ├── Services/       # Business logic services
�?  �?  ├── Middleware/     # Request middleware
�?  �?  └── Utils/          # Helper functions
�?  ├── config/             # Configuration files
�?  ├── routes/             # API routes
�?  ├── public/             # Public entry point
�?  �?  └── index.php
�?  ├── composer.json       # PHP dependencies
�?  └── README.md
├── python/                 # Python services
�?  ├── src/
�?  �?  ├── analytics/      # Data analysis modules
�?  �?  ├── automation/     # Automation tasks
�?  �?  ├── ml/             # Machine learning models
�?  �?  └── utils/          # Utilities
�?  ├── requirements.txt    # Python dependencies
�?  ├── app.py              # Main application
�?  └── README.md
└── README.md               # This file
```

## PHP Setup

### Prerequisites

- PHP >= 7.4
- Composer
- MySQL or PostgreSQL

### Installation

```bash
cd backend/php
composer install
```

### Configuration

```bash
cp config/config.example.php config/config.php
# Edit config.php with your settings
```

### Running PHP Server

```bash
cd backend/php/public
php -S localhost:8000
```

API will be available at `http://localhost:8000`

## Python Setup

### Prerequisites

- Python >= 3.8
- pip

### Installation

```bash
cd backend/python
pip install -r requirements.txt
```

### Running Python Service

```bash
# For development (with debug mode)
export FLASK_DEBUG=true
python app.py

# For production (without debug mode)
python app.py
```

Service will be available at `http://localhost:8001`

## API Endpoints

See [API Documentation](../docs/api/README.md) for detailed API specifications.

### Main Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/demands` - List demands
- `POST /api/demands` - Create demand
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `GET /api/progress/:id` - Get progress logs
- `POST /api/progress` - Create progress log

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Demands Table
```sql
CREATE TABLE demands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

More tables to be defined...

## Testing

### PHP Tests
```bash
cd backend/php
./vendor/bin/phpunit
```

### Python Tests
```bash
cd backend/python
pytest
```

## Features to Implement

### PHP Features
- [ ] User authentication system
- [ ] RESTful API endpoints
- [ ] Database models and migrations
- [ ] Input validation and sanitization
- [ ] Error handling middleware
- [ ] Rate limiting
- [ ] Caching layer

### Python Features
- [ ] Data analytics service
- [ ] Recommendation algorithm
- [ ] Automated matching system
- [ ] Report generation
- [ ] Background task processing
- [ ] Machine learning models

---

To be developed...
