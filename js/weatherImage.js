// Refer "WMO Weather interpretation codes (WW)" in
// https://open-meteo.com/en/docs

const ICON_WEATHER_CODE_MAP = {
  0: "clear", // Clear sky
  1: "clear", // Mainly clear
  2: "partly-cloudy", // Partly cloudy
  3: "cloudy", // Overcast
  45: "fog", // Fog
  48: "fog", // Depositing rime fog
  51: "drizzle-foggy", // Drizzle light
  53: "drizzle-foggy", // Drizzle moderate
  55: "drizzle-heavy", // Drizzle dense
  56: "drizzle-light", // Freezing drizzle light
  57: "drizzle-heavy", // Freezing drizzle dense
  61: "rain-light", // Rain slight
  63: "rain-light", // Rain moderate
  65: "rain-heavy", // Rain heavy
  66: "rain-light", // Freezing rain light
  67: "rain-heavy", // Freezing rain heavy
  71: "snow-light", // Snow fall slight
  73: "snow", // Snow fall moderate
  75: "snow", // Snow fall heavy
  77: "snow", // Snow grains
  80: "rain-shower-light", // Rain showers slight
  81: "rain-light", // Rain showers moderate
  82: "rain-heavy", // Rain showers violent
  85: "snow-light", // Snow showers slight
  86: "snow-heavy", // Snow showers heavy
  95: "thunder-light", // Thunderstorm slight
  96: "thunder-heavy", // Thunderstorm with slight hail
  99: "thunder-heavy", // Thunderstorm with heavy hail
};

export const getWeatherImage = (weatherCode) => {
  return `../images/weatherIcon/${ICON_WEATHER_CODE_MAP[weatherCode]}.svg`;
};
