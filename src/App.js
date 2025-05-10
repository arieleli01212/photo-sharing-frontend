import React, { useState, useCallback, useEffect } from "react";
import { io } from "socket.io-client";
import { Profile } from "./components/Profile/Profile";
import { Gallery } from "./components/Gallery/Gallery";
import "./components/Profile/Profile.css";
import "./components/Gallery/Gallery.css";
import "./App.css";

export default function App() {
  const [imageCount, setImageCount]   = useState(0);
  const [guestCount, setGuestCount]   = useState(0);      // you’ll hook this up later
  const [images, setImages]           = useState([]);     // *** MUST be an array ***

  const API = "http://172.20.10.6:5000";

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
    /* 1️⃣  initial value so there’s no flash of 0 */
    fetch(`${API}/guest`)
      .then((r) => r.json())
      .then((d) => setGuestCount(d.count));

    /* 2️⃣  live updates */
    const socket = io(API);
    socket.on("guestCount", setGuestCount);

    return () => socket.close();             // tidy up on unmount
  }, []);


  
  return (
    <>
      <Profile
        imageCount={imageCount}
        guestCount={guestCount}
        setImageCount={setImageCount}
        fetchImages={fetchImages}  
        API={API}      // ◀—— call me after upload
      />

      <Gallery images={images} />        {/* purely presentational */}
    </>
  );
}
