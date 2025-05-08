import './App.css';
import './components/Profile/Profile.css';
import './components/Gallery/Gallery.css';
import React from 'react';
import { Profile } from './components/Profile/Profile';
import { Gallery } from'./components/Gallery/Gallery';


function App() {

  return (
    
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}

export default App;
