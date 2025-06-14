


/**
 * Request user's current geographic coordinates using the browser's geolocation API.
 * Returns a Promise that resolves to an object { lat, long } or null if denied/unavailable.
 */
export function getUserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          long: position.coords.longitude
        };
        resolve(coords);
      },
      (error) => {
        console.warn("Geolocation error or permission denied:", error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}