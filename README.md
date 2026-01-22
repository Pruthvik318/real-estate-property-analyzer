# Real Estate Property Analyzer

---

## Project Overview

### Description
A web application that allows users to upload property photos and floor plans. The application uses AI to analyze images, extract property features (room count, condition, amenities), generate professional property descriptions, and provide property valuation estimates. Users can compare properties and manage their property listings in a dashboard.

### Target Users
- Real estate agents and brokers
- Property owners looking to list properties
- Real estate investors evaluating properties
- Property managers documenting properties

### Core Value Proposition
- Automated property analysis saves time and ensures consistency
- AI-generated descriptions help create professional listings quickly
- Property valuation estimates provide market insights
- Centralized property management dashboard

---

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Axios or Fetch (API calls)
- Firebase Authentication SDK

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- LangChain (LLM integration)
- Google Gemini LLM (Vision + Text)

### Database
- SQLite (for application data ONLY, NOT authentication)

### Authentication
- Firebase Authentication (email/password)

### AI/ML
- LangChain (basic chains)
- Google Gemini Vision LLM (for image analysis)
- Google Gemini Text LLM (for description generation and valuation)

---

## Architecture Overview

### System Architecture
```
Frontend (React) → Backend (FastAPI) → SQLite Database
                    ↓
              LangChain + Gemini LLM
                    ↓
              Vision LLM (Image Analysis)
              Text LLM (Description & Valuation)
```

### Data Flow
```
User Action → Frontend Component → API Call → Backend Endpoint → Vision LLM → Database → Response → UI Update
```

### Example Flow: Property Upload
```
Upload Property Images → ImageUploader → POST /api/properties → FastAPI → LangChain+Vision LLM → Analysis → SQLite → Property Created → Display in Dashboard
```

---

## Issue Flow

This project is broken down into 18 issues that progress from foundation to advanced features:

### Foundation Phase (Issues #01-08)
- **Issue #01**: Project Setup - README with project structure and setup instructions
- **Issue #02**: Landing Page UI - Static landing page with app information
- **Issue #03**: Signup Page UI - Static signup form
- **Issue #04**: Login Page UI - Static login form
- **Issue #05**: Firebase Auth Setup - Configure Firebase project and SDK
- **Issue #06**: Integrate Signup with Firebase - Connect signup form to Firebase
- **Issue #07**: Integrate Login with Firebase - Connect login form to Firebase
- **Issue #08**: Dashboard UI - Protected dashboard with property list structure

### Core Features Phase (Issues #09-14)
- **Issue #09**: Upload Property Feature - Combined frontend+backend for property creation with images
- **Issue #10**: Image Analysis with Vision LLM - Backend LLM integration for image analysis
- **Issue #11**: Display Properties - Backend API and frontend integration to show properties
- **Issue #12**: Property Detail View - Combined frontend+backend for detailed property view
- **Issue #13**: Property Description Generation - LangChain integration for description generation
- **Issue #14**: Delete Property Feature - Backend API and frontend integration for deletion

### Advanced Features Phase (Issues #15-17)
- **Issue #15**: Property Valuation - Combined frontend+backend for property value estimation
- **Issue #16**: Property Comparison - Combined frontend+backend for comparing exactly 2 properties
- **Issue #17**: Search and Filter - Combined frontend+backend for searching and filtering properties

### Final Phase (Issue #18)
- **Issue #18**: Final Testing - Complete application flow verification and documentation

---

## API Endpoints

### Property Management

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | /api/properties | Yes | Create new property with main image and optional floor plan | Yes (Vision LLM) |
| GET | /api/properties | Yes | Get all user properties | No |
| GET | /api/properties/:id | Yes | Get single property with all details | No |
| PATCH | /api/properties/:id | Yes | Update property metadata | No |
| DELETE | /api/properties/:id | Yes | Delete property | No |

### Property Analysis

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | /api/properties/:id/analyze | Yes | Re-analyze property images | Yes (Vision LLM + Text LLM) |
| POST | /api/properties/:id/valuation | Yes | Re-estimate property value | Yes (Text LLM) |

### Property Search & Comparison

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| GET | /api/properties/compare | Yes | Compare 2 properties | No |
| GET | /api/search | Yes | Search properties | No |

**Note:** Authentication is handled entirely on the frontend via Firebase SDK. No backend auth endpoints are needed.

---

## Frontend Structure

### Pages

| Page Name | Route | Protected | Purpose | Main Components |
|-----------|-------|-----------|---------|----------------|
| Landing | / | No | Welcome page with app info | Navbar, Hero, Features, Footer |
| Signup | /signup | No | User registration | SignupForm |
| Login | /login | No | User authentication | LoginForm |
| Dashboard | /dashboard | Yes | Main user interface with property list | Navbar, PropertyList, UploadButton, SearchBar |
| Property Detail | /properties/:id | Yes | View single property with all details | PropertyDetail, ImageGallery, AnalysisView, ValuationCard |
| Property Comparison | /compare | Yes | Compare 2 properties side-by-side | ComparisonView, PropertyCard |
| Add Property | /properties/new | Yes | Upload new property with images | PropertyForm, ImageUploader |

### Key Components

- **Navbar**: Navigation header with user info and logout
- **PropertyList**: Grid/list display of properties
- **PropertyCard**: Individual property card component
- **PropertyForm**: Form for property creation
- **ImageUploader**: Component for uploading main property image and optional floor plan
- **PropertyDetail**: Full property view container
- **ImageGallery**: Display main image and floor plan (if provided)
- **AnalysisView**: Display AI analysis results
- **ValuationCard**: Display property valuation estimate
- **ComparisonView**: Side-by-side property comparison
- **SearchBar**: Search interface for properties
- **FilterPanel**: Filter options for properties

---

## Database Schema

### Tables

**properties**
- Stores property metadata (name, address, description, valuation)
- Stores image paths: mainImage (required), floorPlan (optional)
- Links to user via user reference
- Contains timestamps

**Note:** Images can be stored directly in properties table (simpler) or in separate property_images table

**property_analysis**
- Stores AI analysis results
- Links to property via property reference
- Contains room_count, features (JSON/text), condition, analysis_date

**Note:** Specific fields and relationships are designed by students. This is conceptual guidance only.

---

## LLM Integration

### Vision LLM (Gemini Vision)
- **Used in**: POST /api/properties, POST /api/properties/:id/analyze
- **Purpose**: Analyze property images to extract features
- **Extracts**: Room count, property features, condition assessment, property style/type

### Text LLM (Gemini)
- **Used in**: POST /api/properties/:id/analyze, POST /api/properties/:id/valuation
- **Purpose**: Generate property descriptions and estimate valuations
- **Generates**: Professional property descriptions, property value estimates with reasoning

### Important Notes
- NO OCR libraries (PyTesseract, Tesseract)
- NO object detection libraries (YOLOv8, etc.)
- Use Vision LLM for ALL image understanding
- Use LangChain for LLM integration
- Property valuation is educational, not professional appraisal

---

## Getting Started

### Prerequisites
- Python 3.12+
- UV Package Manager
- Node.js 18+
- npm or yarn
- Google API Key (for Gemini LLM)
- Firebase project (for authentication)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-property-analyzer
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv add -r requirements.txt
   ```
   Create `.env` file with:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
   Run backend:
   ```bash
   uvicorn main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```
   Configure Firebase in `src/firebase.js`
   Run frontend:
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

---

## Development Workflow

1. Start with Issue #01 (Project Setup)
2. Complete foundation issues (#02-08) in order
3. Work through core features (#09-14)
4. Implement advanced features (#15-17)
5. Complete final testing (#18)

Each issue is designed to be completed in 60-120 minutes and builds upon previous issues.

---

## Important Reminders

- **NO OCR libraries** - Use Vision LLM instead
- **NO object detection libraries** - Use Vision LLM for all image understanding
- **NO PostgreSQL** - Use SQLite only
- **NO JWT/OAuth** - Use Firebase Auth only
- Property valuation is **educational**, not professional
- Focus on LLM-based analysis, not traditional computer vision
- Main image (required) and floor plan (optional) are uploaded together during property creation

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/)
- [Google Gemini API](https://ai.google.dev/docs)

---

## License

This is a template project for educational purposes.
