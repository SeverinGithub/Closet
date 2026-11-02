const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function getCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000 },
    );
  });
}

export async function fetchWeather() {
  const { lat, lon } = await getCoords();
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`,
  );
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  const d = await res.json();
  return {
    temp:      Math.round(d.main.temp),
    feels:     Math.round(d.main.feels_like),
    condition: d.weather[0].main,          // "Rain", "Clear", "Clouds" …
    desc:      d.weather[0].description,   // "light rain"
    city:      d.name,
    wind:      Math.round(d.wind.speed),   // m/s
  };
}
