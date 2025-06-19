import React, { useState, useEffect } from "react";

/**
 * FaceBrowser – interactive client for the face‑clustering backend.
 *
 * UX requirements (from the user):
 *   1. Show *all* detected faces on initial load.
 *   2. When a face is chosen, swap the view to show *every* image that
 *      contains that person.
 *
 * REST contract (same as previous messages):
 *   ─ GET /people            → [[person_id, shot_count], …]
 *   ─ GET /people/{id}?limit → [{url, bbox}, …]
 *
 * Implementation notes
 * ====================
 * • We fetch the cluster list once, then lazily pull one image per person to
 *   use as a thumbnail.  Thumbnails are cached in `thumbs` so we don’t repeat
 *   network calls.
 * • When the user clicks a thumbnail we fetch (and cache) the *full* photo
 *   list for that person and render it in a responsive grid.
 * • The component is fully self‑contained: just add `<FaceBrowser />` to your
 *   React tree and ensure Tailwind (or similar) is loaded for the utility
 *   classes.
 *
 * Environment variable
 * --------------------
 *   REACT_APP_API – base URL for the backend (default http://localhost:5000)
 */


export default function FaceBrowser({API}) {
  /* ────────────────────────────────  state  ───────────────────────────── */
  const [people, setPeople]   = useState([]);   // [[id, shots], …]
  const [thumbs, setThumbs]   = useState({});   // id → thumbnail url
  const [photos, setPhotos]   = useState({});   // id → full photo[] list
  const [selected, setSelected] = useState(null);  // current person id or null
  const [loading, setLoading] = useState(false);

  /* ──────────────────── 1️⃣ load cluster list on mount ─────────────────── */
  useEffect(() => {
    fetch(`${API}/people`)
      .then((r) => r.json())
      .then((data) => {
        setPeople(data);
        // pre‑fetch a single thumbnail for each person so the UI feels snappy
        data.forEach(([id]) => fetchThumb(id));
      })
      .catch(console.error);
  }, []);

  /* --------------------------------------------------------------------- */
  /* Helper: fetch the *first* image for a given person so we have a small
   * thumbnail.  We pass ?limit=1 to avoid transferring the whole list.   */
  const fetchThumb = async (id) => {
    if (thumbs[id]) return;                       // already cached
    try {
      const res = await fetch(`${API}/people/${id}?limit=1`);
      const json = await res.json();
      if (json.length) {
        setThumbs((prev) => ({ ...prev, [id]: json[0].url }));
      }
    } catch (err) {
      console.error("thumb fetch", err);
    }
  };

  /* Helper: fetch the *complete* photo list for a person on demand. */
  const fetchPhotos = async (id) => {
    if (photos[id]) return;                       // already cached
    setLoading(true);
    try {
      const res = await fetch(`${API}/people/${id}`);
      const json = await res.json();
      setPhotos((prev) => ({ ...prev, [id]: json }));
    } catch (err) {
      console.error("photo fetch", err);
    } finally {
      setLoading(false);
    }
  };

  /* Event handler – triggered when the user clicks a face thumbnail. */
  const handleSelect = (id) => {
    setSelected(id);
    fetchPhotos(id);
  };

  /* ────────────────────  UI builders (JSX fragments)  ─────────────────── */

  // Grid of *all* faces (initial view)
  const renderAllFaces = () => (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {people.map(([id, shots]) => (
        <button
          key={id}
          onClick={() => handleSelect(id)}
          className="focus:outline-none"
        >
          <div className="relative">
            {/* Until the thumbnail arrives we show a gray placeholder  */}
            {thumbs[id] ? (
              <img
                src={thumbs[id]}
                alt={`Person ${id}`}
                className="w-full h-40 object-cover rounded shadow"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded animate-pulse" />
            )}
            {/* shot counter (bottom‑right overlay) */}
            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
              {shots}
            </span>
          </div>
          <p className="mt-1 text-sm text-center text-gray-700">Person {id}</p>
        </button>
      ))}
    </div>
  );

  // Grid of photos for the currently‑selected face
  const renderPersonPhotos = () => {
    const imgs = photos[selected] || [];
    if (loading && !imgs.length) return <p>Loading…</p>;
    if (!imgs.length) return <p>No photos for this person.</p>;

    return (
      <>
        {/* back‑link to the full face grid */}
        <button
          className="mb-4 text-blue-600 hover:underline"
          onClick={() => setSelected(null)}
        >
          ← back to all faces
        </button>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {imgs.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt=""
              className="w-full h-auto rounded shadow-sm object-cover"
            />
          ))}
        </div>
      </>
    );
  };

  /* ─────────────────────────────  render  ─────────────────────────────── */
  return (
    <div className="min-h-screen p-4 bg-gray-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Faces</h1>
      {selected === null ? renderAllFaces() : renderPersonPhotos()}
    </div>
  );
}
