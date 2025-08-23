import React from "react";

/**
 * Checkbox gate: all login options disabled until checked.
 * Also provides Terms & Privacy quick links (open a modal via callbacks).
 */
export default function ConsentGate({ checked, onChange, onOpenTerms, onOpenPrivacy }) {
  return (
    <div className="consent">
      <label className="check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>I agree to the</span>
        <button type="button" className="link" onClick={onOpenTerms}>Terms</button>
        <span>&</span>
        <button type="button" className="link" onClick={onOpenPrivacy}>Privacy Policy</button>
      </label>
      {!checked && (
        <div className="consent-hint">Please accept to continue.</div>
      )}
    </div>
  );
}
