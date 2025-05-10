import "./Gallery.css";

export function Gallery({ images }) {
  if (!images.length) return <p className="loader"></p>;

  return (
    <main>
      <div className="container">
        <div className="gallery">
          {images.map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={src} alt={`img-${i}`} className="gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
