import React, { useState } from 'react';
import './Gallery.css';

export function Gallery({ setImageCount }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from the server
  const fetchImages = async () => {
    setLoading(true);
    try {
      console.log('Fetching images from server...');
      const response = await fetch('http://172.20.10.6:5000/get-images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const imageUrls = await response.json();
      console.log('Fetched image URLs:', imageUrls);
      
      setImages(imageUrls); // Store image URLs in state
      setImageCount(imageUrls.length); // Update image count
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false); // Stop loading in case of error
    }
  };

  // Fetch images on component mount
  React.useEffect(() => {
    fetchImages();
  }, []); // Fetch images once when the component mounts

  return (
    <div>
      <ul className="grid-container-images vertical-list">
        {loading ? (
          <li>Loading images...</li>
        ) : (
          images.map((image, index) => (
            <div className="image-card" key={index}>
              <img src={image} alt={`uploaded-${index}`} className="image" />
            </div>
          ))
        )}
      </ul>
    </div>
  );
}
