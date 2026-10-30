# CareerConnect - Job Recruitment Portal

A modern, professional, and fully functional Job Recruitment Portal built with **React JS**, **Vite**, **React Router DOM**, **CSS3**, and **JSON Server**.

This project was built as a clean, human-written academic web development project adhering to strict frontend best practices, without authentication, complex dashboards, or AI bloat.

---

## 🚀 Key Features

### 1. Navigation Bar
* **CareerConnect** logo with clean briefcase branding badge.
* Direct navigation links: **Home**, **Find Jobs**, **Post a Job**, and **Applications**.
* Active route highlighting using React Router `NavLink`.
* Fully responsive hamburger menu for mobile screens.

### 2. Homepage (`/`)
* **Hero Section**: Prominent heading *"Find Your Dream Job Today"*, description, and an interactive search form with inputs for job title and location.
* **Quick Keywords**: Fast-filter pills for popular searches (*React*, *Node.js*, *Figma*, *Remote*).
* **Popular Job Categories**: Interactive cards (*Software Development*, *Product Design*, *Data & Analytics*, *Marketing*, *DevOps*, etc.) displaying open role counts.
* **Featured Job Listings**: Live featured job cards retrieved from JSON Server via Fetch API.
* **Why Choose CareerConnect**: Four platform benefit cards highlighting verified postings, direct applications, real-time tracking, and employer tools.
* **Employer Banner**: Call-to-action inviting hiring managers to list openings.
* **Footer**: Detailed project information, academic disclaimer, navigation links, and specifications.

### 3. Find Jobs Page (`/jobs`)
* **Real-time Filter & Search**:
  * Search by job title, company, or skills.
  * Filter by location.
  * Filter by experience level (*Entry Level*, *Mid Level*, *Senior*).
  * Filter by job type (*Full-Time*, *Part-Time*, *Contract*, *Remote*, *Internship*).
  * Filter by job category.
  * Sort options (*Newest First*, *Job Title A-Z*, *Company A-Z*).
* **Interactive Active Filter Chips**: Displays current filter criteria with one-click removal and a "Reset All Filters" option.
* **Job Cards Grid**: Cards featuring company, salary, location, experience badge, work type pill, description excerpt, skill chips, **View Details** button, and **Apply Now** button.

### 4. Job Details Page (`/jobs/:id`)
* **Comprehensive Job Specifications**:
  * Job title, company name, location, salary, experience, work type, and posted date.
  * Structured metrics strip (Salary, Experience, Work Mode, Location).
  * Full job description and core responsibilities breakdown.
  * Styled pill tags for required skills.
  * Company overview profile.
* **Interactive Actions**:
  * **Apply Now** button: Opens application form pre-filled with job information.
  * **Edit Job Details** modal: Updates posting through `PUT /jobs/:id` API.
  * **Delete Job** action: Removes posting through `DELETE /jobs/:id` API with confirmation.
  * **Back to Jobs** navigation.

### 5. Post a Job Page (`/post-job`)
* Controlled recruitment form with fields:
  * Job title, Company name, Location, Salary, Experience level, Job type, Category, Description, and Required skills (comma-separated).
* Basic form validation with inline error highlights.
* Submits through `POST /jobs` API.
* Clean success confirmation card with options to view the created job or browse listings.

### 6. Applications Page (`/applications`)
* Displays all applicant submissions retrieved via `GET /applications` API.
* **Status Filter Tabs**: *All*, *Pending*, *Shortlisted*, *Accepted*, and *Rejected* with dynamic count badges.
* **Search Field**: Instant filtering by candidate name, email, or job title.
* **Applicant Data Table**:
  * Candidate full name, email, and phone number.
  * Applied job title (linked to job details) and company.
  * Application date.
  * Educational qualification and experience summary.
  * Clickable resume link.
  * Color-coded status badge (*Pending*, *Shortlisted*, *Accepted*, *Rejected*).
  * **Status Changer Dropdown**: Allows changing status directly via `PUT /applications/:id` API.
  * **Delete Application**: Removes candidate application via `DELETE /applications/:id`.
* **Candidate Directory Tab**: Displays saved candidate profiles with option to delete via `DELETE /candidates/:id`.

### 7. Application Form Modal
* Opens when a user clicks **Apply Now** on any job card or details page.
* Pre-fills and displays the target job title and company.
* Controlled form fields:
  * Full Name
  * Email Address (with format validation)
  * Phone Number (with length validation)
  * Education Qualification
  * Experience Summary
  * Resume Link (URL format validation)
* Saves application via `POST /applications` and creates candidate profile via `POST /candidates`.
* Instant visual confirmation.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Functional UI components with hooks (`useState`, `useEffect`, `useMemo`) |
| **Vite** | Modern, lightning-fast frontend tooling and bundling |
| **React Router DOM 7** | Client-side declarative routing and navigation |
| **JSON Server** | Local RESTful API backend serving `db.json` |
| **Fetch API** | Modular HTTP requests centralized in `src/services/api.js` |
| **CSS3** | Separate, modular CSS files with custom properties (CSS variables) |

---

## 📁 Project Structure

```
project/
├── db.json                     # JSON Server database (jobs, candidates, applications)
├── package.json                # Project dependencies and run scripts
├── index.html                  # HTML entry point with Plus Jakarta Sans typography
├── vite.config.js              # Vite configuration
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Router configuration and layout setup
    ├── App.css                 # Base layout styling
    ├── index.css               # Global styles, variables, typography, and badges
    ├── services/
    │   └── api.js              # Centralized Fetch API CRUD operations
    ├── components/
    │   ├── Navbar.jsx          # Navigation bar with responsive menu
    │   ├── Navbar.css
    │   ├── Footer.jsx          # Academic portal footer
    │   ├── Footer.css
    │   ├── JobCard.jsx         # Reusable job card
    │   ├── JobCard.css
    │   ├── ApplicationModal.jsx# Apply Now modal form
    │   ├── ApplicationModal.css
    │   ├── LoadingSpinner.jsx  # Accessible loading indicator
    │   ├── LoadingSpinner.css
    │   ├── AlertMessage.jsx    # Notification message banner
    │   ├── AlertMessage.css
    │   └── ScrollToTop.jsx     # Scrolls window to top on route change
    └── pages/
        ├── Home.jsx            # Homepage (Hero, Categories, Featured, Values)
        ├── Home.css
        ├── FindJobs.jsx        # Job catalog with search and filters
        ├── FindJobs.css
        ├── JobDetails.jsx      # Single job view with Edit/Delete CRUD
        ├── JobDetails.css
        ├── PostJob.jsx         # Job submission form
        ├── PostJob.css
        ├── Applications.jsx    # Applications manager & candidate directory
        ├── Applications.css
        └── NotFound.jsx        # 404 Not Found page
```

---

## 🔌 API & CRUD Operations (`src/services/api.js`)

All API calls use the Fetch API and interact with the configured API URL:
- Local development: `http://localhost:3000` (or `VITE_API_URL` in `.env`)
- Production: Configured via `VITE_API_URL` environment variable

| Resource | Method | Function | Endpoint | Usage |
|---|---|---|---|---|
| **Jobs** | `GET` | `getJobs()` / `getAllJobs()` | `/jobs` | Fetch all jobs (Home, FindJobs) |
| **Jobs** | `GET` | `getJobById(id)` | `/jobs/:id` | Fetch single job details (JobDetails) |
| **Jobs** | `POST` | `createJob(data)` / `addJob(data)` | `/jobs` | Create a new job opening (PostJob) |
| **Jobs** | `PUT` | `updateJob(id, data)` | `/jobs/:id` | Update an existing job (JobDetails edit modal) |
| **Jobs** | `DELETE` | `deleteJob(id)` | `/jobs/:id` | Remove a job posting (JobDetails delete button) |
| **Applications** | `GET` | `getApplications()` | `/applications` | Fetch all candidate applications |
| **Applications** | `GET` | `getApplicationById(id)` | `/applications/:id` | Fetch specific application |
| **Applications** | `POST` | `createApplication(data)` / `addApplication(data)` | `/applications` | Submit application (ApplicationModal) |
| **Applications** | `PUT` | `updateApplication(id, data)` | `/applications/:id` | Update application details |
| **Applications** | `PATCH` | `updateApplicationStatus(id, status)` | `/applications/:id` | Update application status |
| **Applications** | `DELETE` | `deleteApplication(id)` | `/applications/:id` | Delete application record |
| **Candidates** | `GET` | `getCandidates()` | `/candidates` | Fetch candidate directory |
| **Candidates** | `POST` | `createCandidate(data)` / `addCandidate(data)` | `/candidates` | Store candidate details upon application |
| **Candidates** | `PUT` | `updateCandidate(id, data)` | `/candidates/:id` | Update candidate details |
| **Candidates** | `DELETE` | `deleteCandidate(id)` | `/candidates/:id` | Remove candidate profile |

---

## ⚡ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default content:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Both Backend and Frontend Concurrently
```bash
npm run dev
```
* **Frontend**: `http://localhost:5173`
* **Backend JSON Server**: `http://localhost:3000`

### 4. Or Run Separately
* **Terminal 1 (Backend JSON Server)**:
  ```bash
  npm start
  ```
* **Terminal 2 (Frontend Vite Client)**:
  ```bash
  npm run client
  ```

---

## 🌐 Deployment Guide (Render)

### Step 1: Deploy Backend (JSON Server) on Render
1. Go to [render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   * **Name**: `careerconnect-api` (or your choice)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Render automatically supplies the `PORT` environment variable and `server.js` listens on `0.0.0.0:${PORT}`.
5. Once deployed, copy your backend URL (e.g., `https://careerconnect-api.onrender.com`).

### Step 2: Deploy Frontend on Render (Static Site)
1. In Render, create a **New Static Site**.
2. Connect the same repository.
3. Configure:
   * **Name**: `careerconnect-portal`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
4. Add an **Environment Variable**:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://careerconnect-api.onrender.com` (your backend URL from Step 1, without trailing slash)
5. Deploy the Static Site. Your CareerConnect portal is live!

---

## 🎨 Design Philosophy
* **Palette**: Professional Navy Blue (`#0f2d4a`), Crisp White (`#ffffff`), and Slate/Light Grey backgrounds (`#f8fafc`).
* **Visual Hierarchy**: Clear typographic scale using *Plus Jakarta Sans*.
* **Restraint**: Subtle hover elevations, no distracting excessive animations, and clean card borders.
