import React, { useRef, useEffect } from "react";
import "./Profile.css";
import ColorThief from "color-thief-browser";

import ProfileImage from "../../assets/images/proposal-image.png";

export function Profile({
  imageCount,
  guestCount,
  setImageCount,
  fetchImages,
  API,        // ← straight from App
  uploadError,
  setUploadError,
  user,
  onLogout
}) {
  const fileInput = useRef(null);
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploadError(null); // Clear any previous errors

    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUploadError('Please log in to upload photos');
        return;
      }

      const fd = new FormData();
      [...files].forEach((f) => fd.append("images", f));

      const response = await fetch(`${API}/upload`, { 
        method: "POST", 
        body: fd,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(errorData.detail || `Upload failed: ${response.status}`);
      }

      /* optimistic local counter */
      setImageCount((n) => n + files.length);

      /* now ask App to refresh the official list */
      fetchImages();
      
      // Clear the file input
      e.target.value = '';
      
      // Reload the page after upload
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload photos. Please try again.');
    }
  };

  const imgRef = useRef(null);

  /** extract colours after the image has loaded */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const applyGradient = () => {
      const thief   = new ColorThief();
      // getPalette(img, #colours) returns an array of rgb triplets
      const [c1, c2] = thief.getPalette(img, 2);

      /* build CSS strings: 'rgb(123,45,6)' */
      const toRGB   = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
      const color1  = toRGB(c1);
      const color2  = toRGB(c2);

      /* put the gradient on <body> (or #root, etc.) */
      document.body.style.background =
        `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    /* if the image is cached it may already be complete */
    if (img.complete) applyGradient();
    else img.addEventListener("load", applyGradient);

    return () => img.removeEventListener("load", applyGradient);
  }, []);


  return (
    <header>
      <div className="container">
        <div className="profile">
          <div className="profile-image">
            <img
              ref={imgRef}
              alt="Wedding profile"
              src={ProfileImage}
            />
          </div>

          <div className="profile-user-settings">
            <div className="profile-header-top">
              <h1 className="profile-user-name">
                {user ? `@${user.username}` : 'arielandyaara'}
              </h1>
              {user && (
                <button className="profile-logout-btn" onClick={onLogout}>
                  Logout
                </button>
              )}
            </div>
            
            <div className="profile-actions">
              <button
                className="profile-follow-btn"
                onClick={() => fileInput.current.click()}
              >
                Share Photo
              </button>
              <button className="profile-message-btn">💌</button>
              <button className="profile-options-btn">⚙️</button>
            </div>

            {uploadError && (
              <div style={{
                color: '#ff3040',
                backgroundColor: '#ffe6e6',
                padding: '8px 12px',
                borderRadius: '4px',
                margin: '10px 0',
                fontSize: '14px',
                border: '1px solid #ffcccc'
              }}>
                {uploadError}
              </div>
            )}

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </div>

          <div className="profile-stats">
            <ul>
              <li>
                <span className="profile-stat-count">{imageCount}</span> posts
              </li>
              <li>
                <span className="profile-stat-count">{guestCount}</span> online
              </li>
              <li>
                <span className="profile-stat-count">∞</span> love
              </li>
            </ul>
          </div>

          <div className="profile-bio">
            <span className="profile-real-name">Ariel & Ya'ara Wedding</span>
            Share your favorite moments from our special day! 💕<br/>
            📸 Upload photos • 🎉 Celebrate with us
          </div>
        </div>

        <div className="profile-tabs">
          <div className="profile-tab active">
            <span>📷</span> ALL PHOTOS
          </div>
          <div className="profile-tab">
            <span>👥</span> GUEST PHOTOS
          </div>
        </div>
      </div>
    </header>
  );
}
