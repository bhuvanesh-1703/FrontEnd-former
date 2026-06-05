const API_URL = 
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5100"
    : "https://backend-farmer-ql6w.onrender.com";

export default API_URL;
