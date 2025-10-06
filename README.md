# ORBITUAL
#### NASA Space Apps Challenge 2025
Personalized Outdoor Risk Intelligence
 



## Overview
ORBITUAL provides personalized, activity-specific outdoor risk scores by combining NASA Earth observation data with local weather forecasts and simple user profiles. The app helps people plan safer outdoor activities (camping, hiking, fishing, etc.) by showing heat, wind, rain, and comfort likelihoods plus actionable recommendations.

## Features
- Personalized risk scores (heat, wind, rain, comfort) for selected activity and user profile.  
- Three-day forecast summary with visual meters and recommendations.  
- NASA POWER historical context (7-day averages) alongside OpenWeatherMap forecasts.  
- Clean web UI built with React for easy demonstration and submission.

## Tech Stack
- Frontend: React.js, lucide-react (icons)  
- HTTP client: axios  
- Data: OpenWeatherMap (forecast + geocoding), NASA POWER API (historical daily point)   
- Repo & hosting: GitHub

## Setup & Run Locally

1. Clone the repo:
git clone https://github.com/AVA-NTHIKA14/orbitual.git
cd orbitual

text

2. Install dependencies:
npm install

text

3. Add your OpenWeatherMap API key securely:
- Create a `.env.local` file in the project root (this file must NOT be committed).
- Add the following line (replace with your key):
  ```
  REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here
  ```
- Restart the dev server if it is running.

4. Ensure `.env` files are ignored (your `.gitignore` should contain):
.env
.env.local
.env.development
.env.production


5. Start the app:
npm start
Visit http://localhost:3000 to view ORBITUAL.

## Security Note
- Do not commit API keys. If a key was pushed to a public repo, regenerate the key in the OpenWeatherMap dashboard and remove it from the Git history if necessary. For full secrecy, proxy requests through a backend server that holds the key server-side.

## Project Context
This project was developed as a solution for the **NASA Space Apps Challenge 2025**, addressing the challenge of personalizing outdoor safety and environmental risk assessment using NASA satellite data combined with local weather forecasts.

## NASA & Other Data Sources
- NASA POWER API (daily point): https://power.larc.nasa.gov/  
- OpenWeatherMap APIs: https://openweathermap.org/api

## Use of AI
N/A — (or document any AI tools used; e.g., “Used ChatGPT to draft README and example code snippets.”)

## Credits & License
- Built for NASA Space Apps Challenge 2025.  
- Icons: lucide-react  
