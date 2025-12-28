<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Qc9CtGr1qWyHIfI5Bnq1u6JCpaP6baMI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   # Project Name
ডাক্তার আছে? – AI-Powered Healthcare for Rural Bangladesh
 # AI Web Search 
()

# Team Details
1.Raisa Juairia
North South University
Department of Electrical & Computer Engineering

2.Ayon Rahman
Ahsanullah University of Science & Technology
Department of Electrical & Electronics Engineering

3.Lubaba Ahmed
North South University
Department of Electrical & Computer Engineering


# Problem Statement
Healthcare in rural and hill-tract regions of Bangladesh is often inaccessible. Long travel distances is costly and time consuming. Remote locations, rough terrain, and limited medical facilities make timely treatment difficult.


#Solution Overview


# Features 


# Technologies Used
# UI
HillShield/
├── index.html          # Core Entry (React 19 + Import Maps)
├── src/
│   ├── components/     # UI Components (Map, Sidebar, Gauges)
│   ├── api/            # Gemini AI & IoT Data fetching
│   └── utils/          # Risk calculation math & Formatters
├── assets/             # Map tiles, Icons, and Brand Assets
└── README.md           # Documentation (You are here)

# Output Schema
# Project Structure
HillShield/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── data/               # Local GeoJSON or mock sensor data
│       └── zones.json
├── src/
│   ├── api/                # External service integrations
│   │   ├── gemini.js       # Google Generative AI configuration
│   │   └── weather.js      # Fetching rainfall data for landslide risk
│   ├── assets/             # Images and global styles
│   │   └── styles.css      # Custom Tailwind extensions
│   ├── components/         # Reusable UI elements
│   │   ├── layout/         # Structural components
│   │   │   ├── Header.jsx  # Navigation & Brand
│   │   │   ├── Sidebar.jsx # Alert feed & Statistics
│   │   │   └── Footer.jsx
│   │   ├── map/            # Leaflet-specific components
│   │   │   ├── MapView.jsx # Main Map container
│   │   │   ├── Markers.jsx # Custom logic for map pins
│   │   │   └── Legend.jsx  # Risk level color scale
│   │   └── ui/             # Atomic design elements (buttons, cards)
│   ├── hooks/              # Custom React logic
│   │   ├── useLocation.js  # Geolocation tracking
│   │   └── useSensor.js    # Fetching real-time ground stability data
│   ├── pages/              # Route-level components
│   │   ├── Dashboard.jsx   # Main monitoring view
│   │   ├── Analytics.jsx   # AI-generated risk reports
│   │   └── Settings.jsx    # User & Device config
│   ├── utils/              # Helper functions
│   │   ├── calculations.js # Slope & soil moisture math
│   │   └── formatters.js   # Date and coordinate formatting
│   ├── App.jsx             # Main Application Logic & Routing
│   └── main.jsx            # Entry point (React rendering)
├── .env                    # API Keys (Google AI, Mapbox tiles, etc.)
├── index.html              # Entry HTML (the code you provided)
├── package.json            # Project dependencies & scripts
└── README.md               # Project documentation



# AI Tools Disclosure 

| AI Tools | Website Links |
|------------|-------|
| Google AI Studio | (https://aistudio.google.com/) |
| Google Gemini Pro |(https://gemini.google.com/app)  |
| Chatgpt | (https://chatgpt.com/) |
| VS Code|(https://vscode.dev/)  |

 
# How The Solution handles limited internet Access
