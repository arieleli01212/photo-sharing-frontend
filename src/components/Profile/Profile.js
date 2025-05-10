import React, { useRef, useEffect } from "react";
import "./Profile.css";
import ColorThief from "color-thief-browser";

import ProfileImage from "../../assets/images/proposal-image.png";

export function Profile({
  imageCount,
  guestCount,
  setImageCount,
  fetchImages,
  API        // ← straight from App
}) {
  const fileInput = useRef(null);
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const fd = new FormData();
    [...files].forEach((f) => fd.append("images", f));

    await fetch(`${API}/upload`, { method: "POST", body: fd });

    /* optimistic local counter */
    setImageCount((n) => n + files.length);

    /* now ask App to refresh the official list */
    fetchImages();
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
              alt=""
              src={ProfileImage}
            />
          </div>

          <div className="profile-user-settings">
            <h1 className="profile-user-name">
              Ariel &amp; Ya'ara <br /> Wedding
            </h1>

            <button
              className="btn profile-share-btn"
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
