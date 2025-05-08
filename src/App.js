import './App.css';
import './components/Profile/Profile.css';
import './components/Gallery/Gallery.css';
import React from 'react';
import { Profile } from './components/Profile/Profile';
import { Gallery } from'./components/Gallery/Gallery';


function App() {
  const [imageCount, setImageCount] = useState(0);

  return (
    
    <div>
      <Profile 
        imageCount={imageCount}
      />
      <Gallery 
        setImageCount={setImageCount} 
      />
    </div>
  );
}

export default App;
