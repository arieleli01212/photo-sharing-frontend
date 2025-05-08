import { useRef } from 'react';
import './Profile'

export function Profile({imageCount}) {

    const Title = <h1 className="profile-user-name">Ariel & Yaara <br /> Wedding</h1>
    const fileInputRef = useRef(null);  // Reference to the file input element

      // Function to handle image upload
      const handleImageUpload = async (event) => {
        const files = event.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }

        // Send the files to the backend
        const response = await fetch('http://172.20.10.6:5000/upload', {
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

    
    return(
        <header>

        <div class="container">
  
          <div class="profile">
  
            <div class="profile-image">
  
              <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt=""/>
  
            </div>
  
            <div class="profile-user-settings">
  
              {Title}
  
              <button class="btn profile-edit-btn" onClick={handleShareClick}>Edit Profile</button>
  
              <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>
  
            </div>
  
            <div class="profile-stats">
  
              <ul>
                <li><span class="profile-stat-count">{imageCount}</span><br/>posts</li>
                <li><span class="profile-stat-count">188</span><br/>guests</li>
              </ul>
  
            </div>
  
            <div class="profile-bio">
  
              <p><span class="profile-real-name">Jane Doe</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>
  
            </div>
  
          </div>
  
        </div>
  
        </header>  
    );
}