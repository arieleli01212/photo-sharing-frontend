import React, { useRef, useEffect, useState } from "react";
import "./Profile.css";
import ColorThief from "color-thief-browser";

import ProfileImage from "../../assets/images/proposal-image.png";

/**
 * A warm, accessible profile header that nudges users to share,
 * with friendly, dismissible toasts and a readable, expandable BIO.
 */
export function Profile({
  imageCount,
  guestCount,
  setImageCount,
  fetchImages,
  API,
  uploadError,
  setUploadError,
  user,
  onLogout,
  isGuest
}) {
  const fileInput = useRef(null);
  const imgRef = useRef(null);

  const [showFullBio, setShowFullBio] = useState(false);
  const [localToast, setLocalToast] = useState("");

  const handleUploadClick = () => {
    if (isGuest) {
      setLocalToast("Please sign in to share photos. Guests can browse and enjoy 🌟");
      return;
    }
    fileInput.current?.click();
  };

  const handleKeyTrigger = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUploadClick();
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    // Clear previous messages
    setUploadError(null);
    setLocalToast("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLocalToast("Please sign in to upload photos.");
        return;
      }

      const fd = new FormData();
      [...files].forEach((f) => fd.append("images", f));

      const response = await fetch(`${API}/upload`, {
        method: "POST",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(errorData.detail || `Upload failed: ${response.status}`);
      }

      // Optimistic increment then refresh
      setImageCount((n) => n + files.length);
      fetchImages();

      // Reset input (keep the user in context)
      e.target.value = "";

      // Offer a friendly toast
      setLocalToast(`Thanks for sharing 💖 Added ${files.length} photo${files.length > 1 ? "s" : ""}.`);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "We couldn’t upload right now. Please try again in a moment.");
    }
  };

  /** Extract colours after the image has loaded and set the page gradient */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const applyGradient = () => {
      try {
        const thief = new ColorThief();
        const [c1, c2] = thief.getPalette(img, 2);
        const toRGB = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
        document.body.style.background = `linear-gradient(135deg, ${toRGB(c1)}, ${toRGB(c2)})`;
      } catch {
        /* if color extraction fails, keep existing background */
      }
    };

    if (img.complete) applyGradient();
    else img.addEventListener("load", applyGradient);
    return () => img.removeEventListener("load", applyGradient);
  }, []);

  return (
    <header>
      <div className="container">
        <div className="profile" role="region" aria-label="Profile">
          {/* Avatar */}
          <div className="profile-image">
            <img
              ref={imgRef}
              alt="Our wedding profile"
              src={ProfileImage}
              width={92}
              height={92}
            />
          </div>

          {/* User & actions */}
          <div className="profile-user-settings">
            <div className="profile-header-top">
              <h1 className="profile-user-name">
                {user ? `@${user.username}` : "arielandyaara"}
              </h1>

              {user && (
                <button
                  className="profile-logout-btn"
                  onClick={onLogout}
                  aria-label={isGuest ? "Login" : "Logout"}
                  title={isGuest ? "Login" : "Logout"}
                >
                  {isGuest ? "Login" : "Logout"}
                </button>
              )}
            </div>

            <div className="profile-actions">
              <button
                className="profile-follow-btn"
                onClick={handleUploadClick}
                onKeyDown={handleKeyTrigger}
                aria-label={isGuest ? "Login to share photos" : "Share a photo"}
                title={isGuest ? "Login to share photos" : "Share Photo"}
              >
                <span aria-hidden>✨</span>
                {isGuest ? "Login to Share" : "Share Photo"}
              </button>

              <button
                className="profile-message-btn"
                aria-label="Send us a message"
                title="Send us a message"
              >
                💌
              </button>

              <button
                className="profile-options-btn"
                aria-label="Profile options"
                title="Profile options"
              >
                ⚙️
              </button>
            </div>

            {/* Friendly toast / errors (ARIA live region) */}
            <div aria-live="polite">
              {localToast && (
                <div className="toast" role="status">
                  <div className="toast__icon" aria-hidden>🌟</div>
                  <div className="toast__body">{localToast}</div>
                  <button
                    className="toast__close"
                    onClick={() => setLocalToast("")}
                    aria-label="Dismiss message"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="toast" role="alert">
                  <div className="toast__icon" aria-hidden>⚠️</div>
                  <div className="toast__body">
                    {uploadError}
                    <div style={{ fontSize: 12, opacity: .85, marginTop: 4 }}>
                      Tip: Try a smaller image or check your connection.
                    </div>
                  </div>
                  <button
                    className="toast__close"
                    onClick={() => setUploadError(null)}
                    aria-label="Dismiss error"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Hidden input, programmatically triggered */}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <ul>
              <li aria-label={`${imageCount} posts`}>
                <span aria-hidden>📷</span>
                <span className="profile-stat-count">{imageCount}</span> posts
              </li>
              <li aria-label={`${guestCount} online`}>
                <span aria-hidden>👥</span>
                <span className="profile-stat-count">{guestCount}</span> online
              </li>
              <li aria-label="infinite love">
                <span aria-hidden>💛</span>
                <span className="profile-stat-count">∞</span> love
              </li>
            </ul>
          </div>

          {/* Bio */}
          <div className="profile-bio">
            <div className={`bio-text ${showFullBio ? "expanded" : ""}`}>
              <strong className="profile-real-name">Ariel &amp; Ya&apos;ara Wedding</strong>
              {" — Share your favorite moments from our special day! "}
              <span aria-hidden>💕</span>
              <br />
              • 📸 Upload memories &nbsp;• 🎉 Celebrate with us &nbsp;• 🥂 Tag your friends
            </div>
            <button
              className="bio-toggle"
              onClick={() => setShowFullBio((v) => !v)}
              aria-expanded={showFullBio}
            >
              {showFullBio ? "Show less" : "Read more"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="profile-tabs" aria-label="Gallery tabs">
          <button className="profile-tab active" aria-current="page">
            <span aria-hidden>📷</span> ALL PHOTOS
          </button>
          <button className="profile-tab">
            <span aria-hidden>👥</span> GUEST PHOTOS
          </button>
        </nav>
      </div>
    </header>
  );
}
