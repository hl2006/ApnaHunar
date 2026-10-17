# Apna Hunar 🎓💼

A **fully responsive, premium, frontend-only web application** built with pure HTML5, CSS3 (Vanilla), and ES6+ JavaScript. It functions entirely without a server or backend by using browser `LocalStorage` for database queries, authentication guards, and file storage.

---

## 🚀 Features

1.  **Landing Page (`index.html`)**: Beautiful hero block, scroll counter statistics, features cards, faq accordions, interactive contact feedback toasts, and a theme switcher.
2.  **Authentication (`login.html` & `register.html`)**: Interactive validation checklists, remember-me options, show/hide password buttons, registration database hooks.
3.  **Dashboard Hub (`dashboard.html`)**: Core widget counters, profile completion radial SVG meters, timeline status meters, recent activities list, and dashboard routes guards.
4.  **Student Profile (`profile.html`)**: Edit bio, contact info, upload profile avatars, and dynamically update navigation panels.
5.  **Skills Logs (`skills.html`)**: Complete CRUD operations, category tabs filters, and live search options.
6.  **Certificate Hub (`certificates.html`)**: Upload certificates (PNG, JPG, PDF, Max 1.5MB), read as base64, view in modal lightboxes, and trigger browser file downloads.
7.  **Internship Tracker (`internship.html`)**: Monitor timelines, calculate percent durations, log role details, and view linear milestones checkmarks.
8.  **Analytics (`analytics.html`)**: Doughnut charts for skill categories distribution, Bar charts for skill proficiencies, and Line graphs for updates logged over time. Powered by Chart.js.
9.  **Preferences (`settings.html`)**: Invert app themes (Light/Dark), shortcuts to profile edits, logout sessions, and database purge options.

---

## 🛠️ Folder Structure

```text
StudentSkillTracker/
├── index.html              # Landing Page
├── login.html              # Login form authentication
├── register.html           # Student registration page
├── dashboard.html          # Dashboard metrics
├── profile.html            # Profile edit controls
├── skills.html             # Skill CRUD interface
├── certificates.html       # Base64 certificates hub
├── internship.html         # Internships milestone tracker
├── analytics.html          # Chart.js reports
├── settings.html           # Settings & Purge tools
├── assets/
│   ├── css/
│   │   ├── style.css       # Core variables & landing layout
│   │   ├── responsive.css  # Mobile/Tablet overrides
│   │   └── dashboard.css   # Main grids and sidebars layout
│   └── js/
│       ├── app.js          # Core app behaviors & route guards
│       ├── storage.js      # LocalStorage DB layer
│       ├── validation.js   # Client validations
│       └── chart.js        # Chart.js configs
└── README.md               # Documentation
```

---

## 🎨 Theme & Glassmorphism Design

*   **Variables**: Built on CSS custom variables (`:root` & `body.dark-theme`) for smooth, real-time dark/light theme switching.
*   **Aesthetics**: Utilizes `backdrop-filter: blur(16px)` and Harmonious Blue & Purple gradients (`#3b82f6` to `#8b5cf6`) to achieve a modern premium Glassmorphic feel.
*   **Typography**: Styled globally using Google Fonts' **Poppins** typeface.
*   **Icons**: Integrated with Font Awesome 6.4 CSS library.

---

## 💾 LocalStorage Schema

We keep all files and lists grouped under an array database key `sst_users`. The active session email is held under `sst_current_user_email`.

```json
{
  "sst_users": [
    {
      "fullName": "Student Name",
      "email": "student@college.edu",
      "mobile": "1234567890",
      "college": "Example Engineering College",
      "branch": "Computer Science & Engineering",
      "semester": "6th Semester",
      "password": "plain_password",
      "aboutMe": "Bio details...",
      "avatar": "data:image/svg+xml;base64,...",
      "skills": [
        { "id": "sk_1", "name": "JavaScript", "category": "Programming", "level": "Advanced" }
      ],
      "certificates": [
        { "id": "cert_1", "title": "Web Dev", "org": "Udemy", "date": "2026-05-12", "fileName": "cert.png", "fileType": "image/png", "fileData": "data:image/png;base64,..." }
      ],
      "internships": [
        { "id": "intern_1", "company": "Google", "role": "SWE Intern", "startDate": "2026-06-01", "endDate": "2026-08-31", "status": "In Progress" }
      ],
      "activities": [
        { "id": "act_1", "text": "Created account", "timestamp": "2026-07-19T14:30:00Z" }
      ],
      "settings": {
        "theme": "light"
      }
    }
  ],
  "sst_current_user_email": "student@college.edu"
}
```

---

## 🏃‍♂️ How to Run

1.  Clone this repository or open the project folder in your browser.
2.  Simply double-click `index.html` to launch.
3.  No Node.js, server installations, databases, or local host settings are required!

---

## ⚠️ Notes & Limits

*   **Size Constraint**: Browser `LocalStorage` limit is roughly **5MB**.
*   **File uploads limit**: Certificate uploads (Images or PDFs) are constrained to **1.5MB** maximum per file, and profile pictures are constrained to **400KB** maximum. Clear warning notifications slide in if a selected file is too large.
*   **Data Erasure Warning**: Clearing your browser cache or site data will erase all profiles, certs, and skill trackers stored locally.
