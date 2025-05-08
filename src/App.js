import React, { useState, useCallback, useEffect } from "react";
import { Profile } from "./components/Profile/Profile";
import { Gallery } from "./components/Gallery/Gallery";
import "./components/Profile/Profile.css";
import "./components/Gallery/Gallery.css";
import "./App.css";

export default function App() {
  const [imageCount, setImageCount]   = useState(0);
  const [guestCount, setGuestCount]   = useState(0);      // you’ll hook this up later
  const [images, setImages]           = useState([]);     // *** MUST be an array ***

  /** one function in charge of talking to the server */
  const fetchImages = useCallback(async () => {
    try {
      const res  = await fetch("http://172.20.10.6:5000/get-images");
      const list = await res.json();                      // [ ".../uploads/abc.jpg", … ]
      setImages(list);
      setImageCount(list.length);
    } catch (err) {
      console.error("fetchImages failed:", err);
    }
  }, []);

  /* grab the initial gallery once, when the app mounts */
  useEffect(() => { fetchImages(); }, [fetchImages]);

  return (
    <>
      <Profile
        imageCount={imageCount}
        guestCount={guestCount}
        setImageCount={setImageCount}
        fetchImages={fetchImages}        // ◀—— call me after upload
      />

      <Gallery images={images} />        {/* purely presentational */}
    </>
  );
}
