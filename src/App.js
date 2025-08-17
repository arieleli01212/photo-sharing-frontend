import React, { useState, useCallback, useEffect } from "react";
// import { io } from "socket.io-client";
import { Profile } from "./components/Profile/Profile";
import GalleryContainer from "./components/Gallery/GalleryContainer";
import { Login } from "./components/Login/Login";
import { getApiUrl, getWebSocketUrl } from "./config/api";
import "./components/Profile/Profile.css";
import "./components/Gallery/gallery.css";
import "./components/Login/Login.css";
import "./App.css";

export default function App() {
  const [imageCount, setImageCount]   = useState(0);
  const [guestCount, setGuestCount]   = useState(0);
  const [images, setImages]           = useState([]);
  const [viewerOpen,  setViewerOpen]  = useState(false);
  const [lastViewedIndex, setLastIdx] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const API = getApiUrl();

  // Authentication functions
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsGuest(false);
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setIsAuthenticated(false);
    setUser({ username: 'Guest', isGuest: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUser(null);
    setIsGuest(false);
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsAuthenticated(true);
      setUser({ username, access_token: token });
    }
  }, []);

  /** one function in charge of talking to the server */
  const fetchImages = useCallback(async (signal) => {
    try {
      console.log("API:", API);
      const res  = await fetch(`${API}/get-images`, { signal });
      const list = await res.json();                      // [ ".../uploads/abc.jpg", … ]
      console.log("list:", list);
      setImages(list);
      setImageCount(list.length);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("fetchImages failed:", err);
        setImages([]);
        setImageCount(0);
      }
    }
  }, [API]);

  /* grab the initial gallery once, when the app mounts */
  useEffect(() => {
    const controller = new AbortController();
    fetchImages(controller.signal);
    return () => controller.abort();
  }, [fetchImages]);

  useEffect(() => {
    // live guest counter
    const ws = new WebSocket(getWebSocketUrl('/ws'));
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);     
        setGuestCount(data.guestCount);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };
  
    ws.onopen    = () => console.log("WS connected");
    ws.onclose   = () => console.log("WS closed");
    ws.onerror   = (e) => console.error("WS error", e);
  
    return () => ws.close();                   
  }, []);

  const closeViewer = useCallback((idx) => {
    setLastIdx(idx);
    setViewerOpen(false);
  }, []);

  // Show authentication forms if not authenticated and not guest
  if (!isAuthenticated && !isGuest) {
    return (
      <Login
        onLogin={handleLogin}
        onGuestLogin={handleGuestLogin}
        API={API}
      />
    );
  }

  return (
    <>
      {/* 1️⃣ conditional header */}
      {viewerOpen ? null : (
        <Profile
          imageCount={imageCount}
          guestCount={guestCount}
          setImageCount={setImageCount}
          fetchImages={fetchImages}  
          API={API}      // ◀—— call me after upload
          uploadError={uploadError}
          setUploadError={setUploadError}
          user={user}
          onLogout={handleLogout}
          isGuest={isGuest}
        />
      )}

      {/* 2️⃣ gallery gets control to open / close viewer */}
      <GalleryContainer
        images={images}
        viewerOpen={viewerOpen}
        setViewerOpen={setViewerOpen}
        lastViewedIndex={lastViewedIndex}
        onClose={closeViewer}
      />
    </>
  );
}