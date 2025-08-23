import React, { useState } from "react";
import LoginProviders from "./LoginProviders";
import LegalModal from "./LegalModal";
import "./Login.css";

/**
 * Props:
 * - onLogin(userData)
 * - onGuestLogin()
 * - API
 */
export default function LoginContainer({ onLogin, onGuestLogin, API }) {
  const [legalOpen, setLegalOpen] = useState(null); // 'terms' | 'privacy' | null
  const [error, setError] = useState("");

  // Google GIS credential -> POST backend -> store -> proceed
  const handleGoogleToken = async (credential) => {
    setError("");
    try {
      const res = await fetch(`${API}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.detail || "Google login failed. Please try again.");
        return;
      }

      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("username", data.username);
      onLogin?.(data);
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    }
  };

  const handleGuest = () => {
    onGuestLogin?.();
  };

  return (
    <main className="login-wrap">
      <div className="login-card" role="dialog" aria-labelledby="loginTitle">
        <div className="login-brand">
          <div className="brand-chip" aria-hidden>💍</div>
          <h1 id="loginTitle" className="login-title">Welcome to Wedding APP</h1>
          <p className="login-sub">Share moments. Keep memories.</p>
        </div>

        {/* Inline legal microcopy with modal links */}
        <p className="legal-inline">
          By continuing you agree to our{" "}
          <button className="link" onClick={() => setLegalOpen("terms")}>Terms</button>{" "}
          and{" "}
          <button className="link" onClick={() => setLegalOpen("privacy")}>Privacy Policy</button>.
        </p>

        <LoginProviders
          onGoogleToken={handleGoogleToken}
          onGuest={handleGuest}
        />

        {error && <div className="login-error" role="alert">{error}</div>}
      </div>

      {/* Legal modal */}
      {legalOpen && (
        <LegalModal kind={legalOpen} onClose={() => setLegalOpen(null)} />
      )}
    </main>
  );
}
