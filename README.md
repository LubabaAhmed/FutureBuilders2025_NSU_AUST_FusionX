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
 # AI Web Search (https://ai.studio/apps/drive/1Qc9CtGr1qWyHIfI5Bnq1u6JCpaP6baMI?fullscreenApplet=true)


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
Healthcare in rural and hill-tract regions of Bangladesh is often inaccessible. Long travel distances are costly and time consuming. Remote locations, rough terrain, and limited medical facilities make timely treatment difficult.


#Solution Overview
- AI-guided medical consultation
- Emergency alerts and guidance
- Health records management
- Offline support for low-connectivity areas
- Location-based nearest hospital finder

#Goals:
Ensuring the healthcare of underserved people of rural and hill areas.The Healthcare will be trustworthy and not time consuming during long travel distance

# Features 
AI Doctor:* Chat with an AI assistant for medical guidance
- *Emergency Support:* Alerts and instructions for urgent care
- *Health Tracking:* Previous personal health records
- *Offline Mode:* Works even in areas with poor internet
- *Nearest Hospitals:* Find nearby medical facilities quickly
- *Symptoms Checker:* Hearing primary problems almost accurate disease detection 
- *Level Detector:* Detecting Symptoms levelized disease stage
- *Voice Over Service:* Hands free operation for low literacy people
- *Drug & Medicine Recognition:* Identification of dosages, usages and side effects
 -*Health Community:* Connect and communication with nearby local doctor or health volunteer 
-*Epidemic & Outbreak Alert:* Spread the message of updates and dos and don't 
-*Area and Environment Based Health Care:* Pre preparation and solution 


#Tech Stack


- Frontend:React Native (Mobile App)  
- Backend:Node.js / Firebase  
- Database:** Firestore / Cloud Storage  
- Deployment:** AI Studio  


#UI
The application features a "Mission Control" style dashboard:
Tactical Map: A central dark-mode map displaying sensor nodes and risk heatmaps.
Telemetry Sidebar: Real-time feeds of Soil Moisture (%), Seismic Vibration (Hz), and Incline (Degrees).
Command Bar: Quick access to system health, AI report generation, and alert history.
#Output Schema
HillShield uses a standardized JSON schema across all modules to ensure seamless communication between IoT hardware and the dashboard.
1. Sensor Telemetry Schema
This is the payload sent from the physical sensor nodes in the field to the HillShield backend.
**JSON Body:**
```json

{
  "node_id": "HS-SEC-07G",
  "timestamp": "2025-12-28T15:30:00Z",
  "coordinates": {
    "lat": 27.7172,
    "lng": 85.3240
  },
  "metrics": {
    "soil_moisture": 42.8,       // Percentage (%)
    "incline_x": 0.02,           // Degrees of shift
    "seismic_vibration": 1.2,    // Frequency (Hz)
    "pore_pressure": 104.2       // kPa
  },
  "battery": 88                  // Percentage
}

#Project Structure
HillShield/
├── .github/                # GitHub Actions for CI/CD and Issue Templates
├── assets/                 # Brand assets, screenshots, and diagrams
│   ├── branding/           # Logos and Favicons
│   └── docs/               # UI Screenshots for README
├── public/                 # Static files
│   └── data/               # GeoJSON files for map terrain boundaries
├── src/
│   ├── api/                # Service Layer
│   │   ├── aws-rekognition.js # AWS SDK integration for Vision
│   │   ├── gemini-ai.js    # Google Generative AI configurations
│   │   └── iot-stream.js   # WebSocket or MQTT sensor listeners
│   ├── components/         # Atomic UI Design
│   │   ├── dashboard/      # Main layout panels
│   │   ├── map/            # Leaflet logic, layers, and markers
│   │   └── ui/             # Reusable Lucide-icon buttons and cards
│   ├── hooks/              # Custom React logic
│   │   ├── useRiskCalc.js  # Implementation of the Risk Formula
│   │   └── useSensors.js   # State management for real-time telemetry
│   ├── utils/              # Pure helper functions
│   │   ├── constants.js    # Threshold values and API endpoints
│   │   └── formatters.js   # Lat/Lng and Timestamp formatting
│   ├── App.jsx             # Main Application Logic
│   └── main.jsx            # React 19 entry point
├── tests/                  # Unit tests for risk calculations
├── .env.example            # Template for API Keys (AWS/Google)
├── index.html              # Entry HTML with Import Maps
├── package.json            # Scripts and Dependencies
└── README.md               # Main Documentation






# AI Tools Disclosure 

| AI Tools | Website Links |
|------------|-------|
| Google AI Studio | (https://aistudio.google.com/) |
| Google Gemini Pro |(https://gemini.google.com/app)  |
| Chatgpt | (https://chatgpt.com/) |
| VS Code|(https://vscode.dev/)  |
| Google Gemini Pro |(https://gemini.google.com/app)  |
 
# How The Solution handles limited internet Access
