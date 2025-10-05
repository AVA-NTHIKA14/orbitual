

import React, { useState } from 'react';
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, Calendar, MapPin, Search, Satellite } from 'lucide-react';
import { getWeatherLikelihoodData } from './weatherService';

const ORBITUAL = () => {
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('camping');
  const [userProfile, setUserProfile] = useState('general');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activityProfiles = {
    camping: { label: 'Camping', icon: '⛺', tempThreshold: 32, windThreshold: 25, color: '#10B981' },
    hiking: { label: 'Hiking', icon: '🥾', tempThreshold: 30, windThreshold: 30, color: '#F59E0B' },
    fishing: { label: 'Fishing', icon: '🎣', tempThreshold: 28, windThreshold: 20, color: '#3B82F6' },
    lake: { label: 'Lake Activities', icon: '🚣', tempThreshold: 35, windThreshold: 15, color: '#06B6D4' },
    vacation: { label: 'Vacation Planning', icon: '✈️', tempThreshold: 33, windThreshold: 20, color: '#8B5CF6' }
  };

  const userProfiles = {
    general: { label: 'General Adult', sensitivity: 1.0, icon: '👤' },
    elderly: { label: 'Elderly/Senior', sensitivity: 1.3, icon: '👴' },
    children: { label: 'With Children', sensitivity: 1.2, icon: '👶' },
    athlete: { label: 'Athletic/High Activity', sensitivity: 0.8, icon: '🏃' }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherLikelihoodData(location || 'San Francisco');
      setWeatherData(data);
    } catch (err) {
      setError('Unable to fetch weather data. Please check the location and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateLikelihood = (metric, value, threshold) => {
    const profile = userProfiles[userProfile];
    const adjustedThreshold = threshold / profile.sensitivity;

    let likelihood = 0;

    if (metric === 'heat') {
      likelihood = Math.min(100, Math.max(0, ((value - adjustedThreshold) / adjustedThreshold) * 100 + 50));
    } else if (metric === 'wind') {
      likelihood = Math.min(100, Math.max(0, (value / adjustedThreshold) * 100));
    } else if (metric === 'rain') {
      likelihood = Math.min(100, value * 3);
    } else if (metric === 'humidity') {
      likelihood = Math.min(100, Math.max(0, ((value - 60) / 40) * 100));
    }

    return Math.round(likelihood);
  };

  const getRiskLevel = (likelihood) => {
    if (likelihood >= 70) return { level: 'HIGH', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
    if (likelihood >= 40) return { level: 'MEDIUM', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    return { level: 'LOW', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
    },
    header: {
      background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 50%, #4f46e5 100%)',
      color: 'white',
      padding: '40px 24px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: 0.9,
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
    },
    searchCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      marginBottom: '40px',
    },
    inputGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '16px',
      fontSize: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s',
    },
    select: {
      width: '100%',
      padding: '16px',
      fontSize: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      outline: 'none',
      cursor: 'pointer',
      background: 'white',
    },
    button: {
      width: '100%',
      padding: '20px',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: 'white',
      background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    riskMeter: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center',
      transition: 'all 0.3s',
    },
    riskGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    locationHeader: {
      background: activityProfiles[activity].color,
      borderRadius: '20px',
      padding: '32px',
      color: 'white',
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    recommendationCard: {
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      borderLeft: '4px solid #3b82f6',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '40px',
    },
    forecastCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      marginBottom: '40px',
    },
    forecastGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
    },
    nasaCard: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
      borderRadius: '20px',
      padding: '32px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    nasaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    nasaDataBox: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  };

  const RiskMeter = ({ label, likelihood, icon: Icon }) => {
    const risk = getRiskLevel(likelihood);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (likelihood / 100) * circumference;

    return (
      <div style={styles.riskMeter}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <Icon size={24} color={risk.color} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>{label}</h3>
        </div>

        <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 20px' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <rcle cx="70" cy="70" r="45" fill="none" stroke="#e5e7eb" strokeWidthth="10" />
            ircle
              cx="70"
              cy="70"
              r="45"
              fill="none"
              stroke={risk.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'all 1s ease-out' }}}}
            />
          </svg>
          <div style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '700', color: risk.color }}>{likelihood}</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>%</span>
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '700',
            background: risk.color,
            color: 'white',
          }}
        >
          {risk.level} RISK
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <AlertTriangle size={64} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontWeight: '700', fontSize: '1.25rem' }}>{error}</p>
        </div>
      );
    }

    if (!weatherData) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '80px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRadius: '20px',
            border: '2px dashed #93c5fd',
          }}
        >
          <Cloud size={64} color="#60a5fa" style={{ margin: '0 auto 24px' }} />
          <p style={{ color: '#1f2937', fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>Ready to Plan Your Adventure?</p>
          <p style={{ color: '#6b7280' }}>Enter a location above and let NASA data guide your decisions</p>
        </div>
      );
    }

    const activityConfig = activityProfiles[activity];
    const heatLikelihood = calculateLikelihood('heat', weatherData.current.temp, activityConfig.tempThreshold);
    const windLikelihood = calculateLikelihood('wind', weatherData.current.windSpeed, activityConfig.windThreshold);
    const rainLikelihood = calculateLikelihood('rain', weatherData.current.precipitation, 20);
    const humidityLikelihood = calculateLikelihood('humidity', weatherData.current.humidity, 60);
    const overallComfort = Math.round((heatLikelihood + windLikelihood + rainLikelihood + humidityLikelihood) / 4);

    return (
      <div>
        <div style={styles.locationHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <MapPin size={32} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{weatherData.location}</h2>
          </div>
          <div style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            <span>
              {activityProfiles[activity].icon} {activityProfiles[activity].label}
            </span>
            <span style={{ margin: '0 12px' }}>|</span>
            <span>
              {userProfiles[userProfile].icon} {userProfiles[userProfile].label}
            </span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.95rem' }}>
            <span>🌡️ {weatherData.current.temp}°C</span>
            <span>💨 {weatherData.current.windSpeed} km/h</span>
            <span>💧 {weatherData.current.humidity}% humidity</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>Adverse Weather Likelihood</h3>
        <div style={styles.riskGrid}>
          <RiskMeter label="Very Hot" likelihood={heatLikelihood} icon={Thermometer} />
          <RiskMeter label="Very Windy" likelihood={windLikelihood} icon={Wind} />
          <RiskMeter label="Very Wet" likelihood={rainLikelihood} icon={Droplets} />
          <RiskMeter label="Uncomfortable" likelihood={overallComfort} icon={AlertTriangle} />
        </div>

        <div style={styles.recommendationCard}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '20px' }}>Smart Recommendations</h3>
          {heatLikelihood > 60 && (
            <p style={{ color: '#1f2937', marginBottom: '12px', lineHeight: '1.6' }}>
              • <strong>High Heat Alert:</strong> Consider early morning or shaded areas. Stay hydrated.
            </p>
          )}
          {rainLikelihood > 40 && (
            <p style={{ color: '#1f2937', marginBottom: '12px', lineHeight: '1.6' }}>
              • <strong>Rain Probability:</strong> Pack waterproof gear. Check Day 3 for better conditions.
            </p>
          )}
          {overallComfort < 40 && (
            <p style={{ color: '#1f2937', lineHeight: '1.6' }}>
              • <strong>Optimal Conditions:</strong> Great weather for your {activityProfiles[activity].label.toLowerCase()}!
            </p>
          )}
        </div>

        <div style={styles.forecastCard}>
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Calendar size={28} />
            3-Day Forecast
          </h3>
          <div style={styles.forecastGrid}>
            {weatherData.forecast.map((day, idx) => {
              const dayHeat = calculateLikelihood('heat', day.temp, activityConfig.tempThreshold);
              const dayRain = calculateLikelihood('rain', day.rain, 20);
              const dayWind = calculateLikelihood('wind', day.wind, activityConfig.windThreshold);

              return (
                <div key={idx} style={{ border: '2px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>{day.day}</h4>
                  <p style={{ color: '#6b7280', marginBottom: '16px', textTransform: 'capitalize' }}>{day.condition}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Very Hot:</span>
                    <span style={{ fontWeight: '700', color: getRiskLevel(dayHeat).color }}>{dayHeat}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Very Wet:</span>
                    <span style={{ fontWeight: '700', color: getRiskLevel(dayRain).color }}>{dayRain}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Very Windy:</span>
                    <span style={{ fontWeight: '700', color: getRiskLevel(dayWind).color }}>{dayWind}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.nasaCard}>
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Satellite size={32} />
            NASA Earth Observation Data
          </h3>
          <div style={styles.nasaGrid}>
            <div style={styles.nasaDataBox}>
              <p style={{ color: '#93c5fd', fontSize: '0.875rem', marginBottom: '8px' }}>Surface Temperature</p>
              <p style={{ fontSize: '2rem', fontWeight: '700' }}>{weatherData.nasaData.modisTemp.toFixed(1)}°C</p>
            </div>
            <div style={styles.nasaDataBox}>
              <p style={{ color: '#c4b5fd', fontSize: '0.875rem', marginBottom: '8px' }}>Heat Stress</p>
              <p style={{ fontSize: '2rem', fontWeight: '700' }}>{weatherData.nasaData.ecostressHeat}</p>
            </div>
            <div style={styles.nasaDataBox}>
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', marginBottom: '8px' }}>Historical Context</p>
              <p style={{ fontSize: '0.95rem', marginTop: '8px' }}>{weatherData.nasaData.historicalContext}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <Satellite size={48} />
            ORBITUAL
          </h1>
          <p style={styles.subtitle}>NASA-Powered Outdoor Risk Intelligence</p>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.searchCard}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={28} />
            Plan Your Adventure
          </h2>

          <div style={styles.inputGroup}>
            <div>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, Tokyo, Paris"
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && fetchWeatherData()}
              />
            </div>

            <div>
              <label style={styles.label}>Activity Type</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)} style={styles.select}>
                {Object.entries(activityProfiles).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.icon} {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>User Profile</label>
              <select value={userProfile} onChange={(e) => setUserProfile(e.target.value)} style={styles.select}>
                {Object.entries(userProfiles).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.icon} {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fetchWeatherData}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                ></div>
                Analyzing NASA Data...
              </>
            ) : (
              <>
                <Satellite size={24} />
                Get Adverse Weather Likelihood
              </>
            )}
          </button>
        </div>

        <Dashboard />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ORBITUAL;
