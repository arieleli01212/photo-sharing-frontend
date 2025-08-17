// API Configuration - Used only by App.js to configure the entire application
const API_CONFIG = {
  // Base URL for the API
  BASE_URL: 'http://localhost:8000',
  
  // WebSocket URL
  WS_URL: 'localhost:8000',
  
  // Available endpoints (for documentation)
  ENDPOINTS: {
    GOOGLE_LOGIN: '/google-login',
    VERIFY_TOKEN: '/verify-token',
    UPLOAD: '/upload',
    GET_IMAGES: '/get-images',
    GUEST_COUNT: '/guest',
    WEBSOCKET: '/ws'
  }
};

// Helper function to get full API URL - used by App.js
export const getApiUrl = (endpoint = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get WebSocket URL - used by App.js
export const getWebSocketUrl = (endpoint = '') => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${API_CONFIG.WS_URL}${endpoint}`;
};

export default API_CONFIG;