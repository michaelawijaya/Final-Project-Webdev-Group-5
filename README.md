# Lost & Found Website

## 1. Project Description
A full-stack web application that connects students who have lost their belongings with those who have found them.

## 2. Features
### 1. Public Report Listing & Details
- Display all Lost and Found reports publicly.
- Provide a dedicated detail page for each report.
### 2. Category Filtering
- Allow users to filter reports by clicking on available category tags.
### 3. Report Submission
- Provide a form for submitting Lost or Found reports, including an optional photo upload.
### 4. Contact Privacy
- Display only the contact method explicitly selected by the reporter for public visibility.

## 3. Technology Stack
| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript, React.js, Vite |
| Backend | JavaScript, Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Image Storage | Cloudinary |
| Version Control | GitHub |

## 4. Project Structure

```text
Final-Project-Webdev-Group-5/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── details-page/
│   │   │   ├── footer/
│   │   │   └── view-page/
│   │   ├── pages/
│   │   │   ├── details.jsx
│   │   │   ├── details.css
│   │   │   ├── home.jsx
│   │   │   ├── home.css
│   │   │   ├── manage_report.jsx
│   │   │   ├── manage_report.css
│   │   │   ├── report_submission.jsx
│   │   │   ├── report_submission.css
│   │   │   ├── views.jsx
│   │   │   └── views.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── server/
│   ├── uploads/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── mock-data/
├── package.json
├── .gitignore
└── README.md
```

## 5. Team Members
| Role | Name | Responsibilities |
|---|---|---|
| Backend Developer | Michael | Backend development, API, and database
| Frontend Developer 1 | Lindsay | Frontend development (Homepage, Report Submission, Contact Privacy)
| Frontend Developer 2 | Danish | Frontend development (Public Report Listing & Details, Category Filtering)

## 6. Setup Instructions

### Prerequisites
Make sure the following tools are installed:
- Git
- Node.js and npm
- pnpm

### Installation

1. Clone this repository.
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory.
   ```bash
   cd Final-Project-Webdev-Group-5
   ```

3. Install frontend dependencies.
   ```bash
   cd frontend
   pnpm install
   ```

4. Install backend dependencies.
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

1. Start the backend server from the `server` directory.
   ```bash
   npm run dev
   ```

2. Open a new terminal and start the frontend from the `frontend` directory.
   ```bash
   pnpm dev
   ```
