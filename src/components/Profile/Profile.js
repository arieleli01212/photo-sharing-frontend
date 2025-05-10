import React, { useRef } from "react";
import "./Profile.css";
import ProfileImage from "../../assets/images/proposal-image.png";

export function Profile({
  imageCount,
  guestCount,
  setImageCount,
  fetchImages,
  IP        // ← straight from App
}) {
  const fileInput = useRef(null);
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const fd = new FormData();
    [...files].forEach((f) => fd.append("images", f));

    await fetch(`http://${IP}:5000/upload`, { method: "POST", body: fd });

    /* optimistic local counter */
    setImageCount((n) => n + files.length);

    /* now ask App to refresh the official list */
    fetchImages();
  };

  return (
    <header>
      <div className="container">
        <div className="profile">
          <div className="profile-image">
            <img
              alt=""
              src={ProfileImage}
            />
          </div>

          <div className="profile-user-settings">
            <h1 className="profile-user-name">
              Ariel &amp; Yaara <br /> Wedding
            </h1>

            <button
              className="btn profile-edit-btn"
              onClick={() => fileInput.current.click()}
            >
              Share your memories
            </button>

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
                <span className="profile-stat-count">{imageCount}</span> <br />
                posts
              </li>
              <li>
                <span className="profile-stat-count">{guestCount}</span> <br />
                guests
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
