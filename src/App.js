import './App.css';
import React, { useState } from 'react';
import { Info } from './components/Info';
import { Faces } from './components/Faces'; 
import { Gallery } from './components/Gallery'; 



function App() {
  const [imageCount, setImageCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div>
      <Info
        imageCount={imageCount}
        guestCount={guestCount}
        setImageCount={setImageCount}
        setUploadedImages={setUploadedImages} 
        fetchImages={() => {
          // Trigger the gallery sync from here
          document.querySelector('gallery').fetchImages();
        }}
      />
      <Faces setGuestCount={setGuestCount}/>
      <Gallery 
        uploadedImages={uploadedImages}  // Pass uploadedImages to Gallery
        setImageCount={setImageCount} 
      />
      </div>
  );
}

export default App;
