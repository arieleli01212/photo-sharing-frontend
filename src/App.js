import React, { useState, useCallback, useEffect } from "react";
// import { io } from "socket.io-client";
import { Profile } from "./components/Profile/Profile";
import { Gallery } from "./components/Gallery/Gallery";
import "./components/Profile/Profile.css";
import "./components/Gallery/Gallery.css";
import "./App.css";

export default function App() {
  const [imageCount, setImageCount]   = useState(0);
  const [guestCount, setGuestCount]   = useState(0);      // you’ll hook this up later
  const [images, setImages]           = useState([]);     // *** MUST be an array ***
  const [viewerOpen,  setViewerOpen]  = useState(false); // 🔸 lifted up
  const [lastViewedIndex, setLastIdx]   = useState(0);


  const API = `https://${window.location.host}/api`;

  /** one function in charge of talking to the server */
  const fetchImages = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/get-images`);
      const list = await res.json();                      // [ ".../uploads/abc.jpg", … ]
      console.log("list:", list);
      setImages(list);
      setImageCount(list.length);
    } catch (err) {
      console.error("fetchImages failed:", err);
      setImages([]);
      setImageCount(0);
    }
  }, []);

  /* grab the initial gallery once, when the app mounts */
  useEffect(() => { fetchImages(); }, [fetchImages]);
  

  useEffect(() => {
    // live guest counter
    const proto  = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws`);
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

  const closeViewer = (idx) => {
    setLastIdx(idx);
    setViewerOpen(false);
  };

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
