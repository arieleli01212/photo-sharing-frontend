import React, { useRef } from 'react';
import './Info.css';

export function Info({ imageCount, guestCount, setImageCount, setUploadedImages, fetchImages }) {
  const fileInputRef = useRef(null);  // Reference to the file input element

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    // Send the files to the backend
    const response = await fetch('http://192.168.1.206:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setUploadedImages(result.filePaths);

    // Update the image count and uploaded images state
    setImageCount((prevCount) => prevCount + files.length);
    
    // Trigger a gallery sync by calling the fetchImages function
    fetchImages(); // Call this to update the gallery with new images
  };

  // Trigger file input click when Share Your Memories button is clicked
  const handleShareClick = () => {
    fileInputRef.current.click();  // This will automatically open the file input dialog
  };

  return (
    <div>
      <h2 className="head-title">Ariel & Yaara <br /> Wedding</h2>
      <div className="grid-container">
        <div className="profile-picture">Profile Picture</div>
        <div className="text-content">
          <div className="stats">
            <div className="posts">
              <h3>{imageCount}</h3>
              <p>posts</p>
            </div>
            <div className="guests">
              <h3>{guestCount}</h3>
              <p>guests</p>
            </div>
          </div>

          {/* Display Upload Button */}
          <button className="share-button" onClick={handleShareClick}>
            Share Your Memories!
          </button>

          {/* File input, hidden by default */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}  // Attach ref to the file input
            style={{ display: 'none' }}  // Hide the file input
          />
        </div>
      </div>
    </div>
  );
}
