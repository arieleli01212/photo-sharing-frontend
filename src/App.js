import React, { useState, useCallback, useEffect } from "react";
// import { io } from "socket.io-client";
import { Profile } from "./components/Profile/Profile";
import { Gallery } from "./components/Gallery/Gallery";
import "./components/Profile/Profile.css";
import "./components/Gallery/Gallery.css";
import "./App.css";

export default function App() {
  const [imageCount, setImageCount]   = useState(0);
  const [guestCount, setGuestCount]   = useState(0);
  const [images, setImages]           = useState([]);
  const [viewerOpen,  setViewerOpen]  = useState(false);
  const [lastViewedIndex, setLastIdx] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  //const API = `https://${window.location.host}/api`;
  const API = `http://127.0.0.1:8000`;

  /** one function in charge of talking to the server */
  const fetchImages = useCallback(async (signal) => {
    try {
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
    const proto  = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://127.0.0.1:8000/ws`);
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
        />
      )}

      {/* 2️⃣ gallery gets control to open / close viewer */}
      <Gallery
        images={images}
        viewerOpen={viewerOpen}
        setViewerOpen={setViewerOpen}
        lastViewedIndex={lastViewedIndex}
        onClose={closeViewer}
      />
    </>
  );
}