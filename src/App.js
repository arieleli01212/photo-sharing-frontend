import './App.css';
import './components/Profile/Profile.css';
import './components/Gallery/Gallery.css';
import React ,{ useState } from 'react';
import { Profile } from './components/Profile/Profile';
import { Gallery } from'./components/Gallery/Gallery';


function App() {
  const [imageCount, setImageCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(0);


  return (
    <div>
      <Profile 
        imageCount={imageCount}
        guestCount={guestCount}
        setImageCount={setImageCount}
        setUploadedImages={setUploadedImages} 
        fetchImages={() => {
          // Trigger the gallery sync from here
          document.querySelector('gallery').fetchImages();
        }}
      />
      <Gallery 
        uploadedImages={uploadedImages}  // Pass uploadedImages to Gallery
        setImageCount={setImageCount} 
      />
    </div>
  );
}

export default App;
