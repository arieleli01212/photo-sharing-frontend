import "./ViewerHeader.css";

export function ViewerHeader({ onBack, current }) {
    return (
      <header className="viewer-header">
        <button className="viewer-back" onClick={() => onBack(current)}>
          ← Back
        </button>
        <span className="viewer-title">Posts</span>
      </header>
    );
  }
