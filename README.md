# Academic Personal Homepage

A modern, responsive academic personal website template with clean design and JSON-powered dynamic content loading. This template is perfect for researchers, professors, and PhD students looking to showcase their academic achievements.


## Features

- 📱 Fully responsive design that works seamlessly on all devices
  - Optimized mobile navigation with smooth horizontal scrolling
  - Smart active link centering and visual scroll indicators
  - Adaptive layout for various screen sizes
- 🎨 Clean, modern UI with intuitive navigation
- 📊 JSON-powered content for easy updates (profile, publications, and news)
- 🔍 Publications section with filtering capability (All/Preprints/Accepted/First Author)
- 📰 News section with "View All" capability 
- 🌟 Interactive elements with smooth transitions
- 🔗 Social media and contact integration

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [JSON Data Structure](#json-data-structure)
4. [Customization Guide](#customization-guide)
   - [Basic Information](#basic-information)
   - [Profile Photo](#profile-photo)
   - [Social Media & Contact Links](#social-media--contact-links)
   - [Education](#education)
   - [Research Interests](#research-interests)
   - [Publications](#publications)
   - [News](#news)
   - [Honors & Awards](#honors--awards)
   - [Services](#services)
5. [Advanced Customization](#advanced-customization)
   - [Mobile Optimization](#mobile-optimization)
   - [Color Scheme](#color-scheme)
   - [Font Changes](#font-changes)
   - [Section Ordering](#section-ordering)
6. [Deployment](#deployment)
7. [License](#license)

## Getting Started

To use this template for your own academic website:

1. Clone this repository:
```bash
git clone https://github.com/yourusername/academic-homepage.git
```

2. Navigate to the project directory:
```bash
cd academic-homepage
```

3. Open the files in your preferred code editor and begin customizing according to the guide below.

4. Test your changes by opening `index.html` in a web browser.

## Project Structure

```
├── index.html              # Main homepage file
├── styles.css              # CSS styling
├── script.js               # JavaScript functionality
├── assets/                 # Images and other static assets
│   ├── profile.jpg         # Your profile photo
│   ├── cityu-logo.jpeg     # University logo examples
│   ├── bit-logo.png        # University logo examples
│   ├── dblp.svg            # DBLP icon
│   └── wechat.jpg          # WeChat QR code
├── data/                   # JSON data files
│   ├── news.json           # News items data
│   ├── publications.json   # Publications data
│   └── profile-info.json   # Basic profile information
└── pages/                  # Additional pages
    └── all-news.html       # Page displaying all news items
```

## JSON Data Structure

This template uses JSON files to store data, making it easier to update content without modifying HTML code. There are three main JSON files:

### 1. `data/profile-info.json`

Contains personal information, social media links, and profile image path:

```json
{
  "name": "YOUR NAME",
  "subtitle": "PhD@CS, YOUR UNIVERSITY",
  "socialLinks": [
    {
      "type": "email",
      "url": "mailto:your.email@example.com",
      "icon": "<i class=\"fas fa-envelope\"></i>"
    },
    {
      "type": "linkedin",
      "url": "https://www.linkedin.com/in/your-profile/",
      "icon": "<i class=\"fab fa-linkedin\"></i>",
      "target": "_blank"
    }
    // Add more social links as needed
  ],
  "profileImage": "assets/profile.jpg"
}
```

### 2. `data/publications.json`

Stores all publications with metadata for filtering:

```json
[
  {
    "number": 1,
    "title": "Your Publication Title",
    "authors": "<strong><u>Your Name</u></strong>, Co-author One, Co-author Two",
    "type": "preprint",  // or "accepted"
    "isFirstAuthor": true,  // or false
    "venue": "Conference or Journal Name",  // optional, for accepted papers
    "tags": [
      {
        "text": "Tag Label",
        "class": "tag-class",
        "link": "https://link-to-paper.com"  // optional
      }
    ]
  }
  // Add more publications here
]
```

### 3. `data/news.json`

Contains news and updates in chronological order:

```json
[
  {
    "date": "Month YYYY",
    "title": "News Title",
    "content": "News content description",
    "links": [
      {
        "text": "Link Text",
        "url": "https://link-url.com"
      }
    ]
  }
  // Add more news items here
]
```

## Customization Guide

### Basic Information

Edit the `data/profile-info.json` file to update your basic information:

1. **Name**: Replace the `name` value with your name
2. **Title/Affiliation**: Update the `subtitle` value with your position, university, and lab affiliations
3. **Profile Image**: Update the `profileImage` value with the path to your profile photo

### Profile Photo

1. Replace the `profile.jpg` in the `assets` folder with your own photo
2. Make sure your photo is properly cropped to a square or similar aspect ratio for best results
3. The recommended size is 500x500 pixels

### Social Media & Contact Links

Edit the `socialLinks` array in `data/profile-info.json`:

```json
"socialLinks": [
  {
    "type": "email",
    "url": "mailto:your.email@example.com",
    "icon": "<i class=\"fas fa-envelope\"></i>"
  },
  {
    "type": "github",
    "url": "https://github.com/yourusername",
    "icon": "<i class=\"fab fa-github\"></i>",
    "target": "_blank"
  }
]
```

For each link, specify:
- `type`: A unique identifier for the link type
- `url`: The URL to link to
- `icon`: HTML for the icon (using Font Awesome or custom SVG)
- `target`: Optional, set to "_blank" to open in a new tab

### Education

Update the education timeline in `index.html`:

1. For each educational experience, modify the following template:
```html
<div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <div class="edu-content-wrapper">
            <div class="edu-text">
                <h3>Degree @ University Name</h3>
                <p class="timeline-date">Start Date - End Date</p>
                <p>Major/Department</p>
                <p>Additional information</p>
            </div>
            <div class="school-logo">
                <img src="assets/university-logo.png" alt="University Name" class="edu-logo">
            </div>
        </div>
    </div>
</div>
```

2. Add your university logos to the `assets` folder and update the image paths

### Research Interests

Modify the research interests section in `index.html`:

1. Each research area follows this structure:
```html
<div class="research-area">
    <i class="fas fa-icon-name"></i> <!-- Choose an appropriate Font Awesome icon -->
    <h3>Research Area Title</h3>
    <ul class="research-list">
        <li><strong>Subfield:</strong> Description of your work in this subfield.</li>
        <!-- Add more subfields as needed -->
    </ul>
</div>
```

2. You can find suitable Font Awesome icons at [Font Awesome](https://fontawesome.com/icons)

### Publications

Edit the `data/publications.json` file to include your publications. Each publication should follow this structure:

```json
{
  "number": 1,
  "title": "Your Publication Title",
  "authors": "<strong><u>Your Name</u></strong>, Co-author One, Co-author Two",
  "type": "preprint",  // or "accepted"
  "isFirstAuthor": true,  // or false
  "venue": "Conference or Journal Name",  // optional, for accepted papers
  "tags": [
    {
      "text": "PDF",
      "class": "code-tag",
      "link": "https://link-to-paper.com"
    }
  ]
}
```

- Highlight your name using `<strong>` and `<u>` tags
- Set `isFirstAuthor` to true for papers where you are the first author or have equal contribution
- Use the following classes for tags:
  - `preprint-tag` for preprints
  - `venue-tag` for conference/journal names
  - `code-tag` for links to code, PDFs, etc.

### News

Edit the `data/news.json` file to include your news items:

```json
{
  "date": "Month YYYY",
  "title": "News Title",
  "content": "News content description",
  "links": [
    {
      "text": "Link Text",
      "url": "https://link-url.com"
    }
  ]
}
```

You can include HTML in the title and content fields if needed. The most recent news items will appear on the homepage, with all items available on the all-news page.

### Honors & Awards

Update the honors and awards section in `index.html`:

```html
<div class="honor-item">
    <div class="honor-year"><span class="year-highlight">YYYY</span></div>
    <div class="honor-content">
        <h3>Award Name</h3>
        <p>Awarding Organization</p>
        <p>Additional information about the award</p>
    </div>
</div>
```

### Services

Modify the services section in `index.html` to list your professional services:

```html
<div class="service-category">
    <h3>Category Title</h3>
    <ul class="service-list">
        <li>Service Item 1</li>
        <li>Service Item 2</li>
        <!-- Add more items as needed -->
    </ul>
</div>
```

## Advanced Customization

### Mobile Optimization

This template includes several mobile-specific optimizations:

1. **Horizontal Navigation Scroll**:
   - The navigation bar automatically adapts to mobile devices with a horizontal scrolling interface
   - Visual gradient indicators appear when there's more content to scroll to
   - Active navigation items are automatically centered for better visibility
   - Smooth scrolling with touch momentum for an app-like feel

2. **Responsive Timeline**:
   - Timeline markers are hidden on mobile for a cleaner interface
   - Educational information is reordered for better mobile presentation
   - School logos and educational information adapt to different screen sizes

3. **Adaptive Content Layout**:
   - Content cards in honors, news, and services sections stack vertically on mobile
   - Font sizes and spacing automatically adjust for readability on smaller screens
   - Interactive elements have appropriate touch targets for mobile usability

To customize mobile behavior further, edit the media queries in the `styles.css` file:

```css
@media (max-width: 768px) {
    /* Tablet and mobile styles */
}

@media (max-width: 576px) {
    /* Small mobile styles */
}
```

### Color Scheme

To change the color scheme, edit the CSS variables in the `styles.css` file:

```css
:root {
    --primary-color: #0066cc; /* Main accent color */
    --secondary-color: #f8f9fa; /* Background color for sections */
    --text-color: #333; /* Main text color */
    --light-text: #757575; /* Secondary text color */
    --border-color: #e0e0e0; /* Border color */
}
```

### Font Changes

To change fonts:

1. Update the Google Fonts link in the `<head>` section of your HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YourChosenFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

2. Update the font-family in the `styles.css` file:
```css
body {
    font-family: 'YourChosenFont', sans-serif;
}
```

### Section Ordering

To reorder sections:

1. Rearrange the `<section>` elements in the `index.html` file
2. Update the navigation links accordingly to maintain proper scrolling

## Deployment

To deploy your website:

1. **GitHub Pages**:
   - Push your repository to GitHub
   - Enable GitHub Pages in the repository settings
   - Your site will be available at `https://yourusername.github.io/repository-name`

2. **Netlify**:
   - Create an account on [Netlify](https://www.netlify.com/)
   - Drag and drop your project folder to deploy
   - Your site will be given a Netlify subdomain with option to use a custom domain

3. **University Web Space**:
   - Many universities provide web hosting for faculty and students
   - Contact your university's IT services for information on how to upload your files

## License

This project is available under the MIT License. You are free to use, modify, and distribute this template for both personal and commercial purposes.
