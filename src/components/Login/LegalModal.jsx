import React, { useEffect, useRef } from "react";

/**
 * Simple glass modal. `kind` is "terms" or "privacy".
 * This version restructures the legal content into readable HTML
 * with headings, paragraphs, and lists for better spacing.
 */
export default function LegalModal({ kind, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legalTitle"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-header">
          <h2 id="legalTitle">{kind === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
          <button className="legal-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="legal-body">
          {kind === "terms" ? (
            <section>
              <p><strong>Effective:</strong> [18/8/2025]</p>

              <h3>Terms of Service</h3>
              <p>
                App: Wedding APP ("we", "us", "our"). Contact: 
                <a href="mailto:arieleli01212@email.com"> arieleli01212@email.com</a>.
              </p>

              <ol>
                <li>
                  <h4>1) Your relationship with us</h4>
                  <p>
                    By creating an account, logging in as a guest, uploading, viewing, or sharing photos on
                    Wedding APP (the "Service"), you agree to these Terms. If you don’t agree, don’t use the Service.
                  </p>
                </li>

                <li>
                  <h4>2) Who can use the Service</h4>
                  <ul>
                    <li>You must be 13+ (or 16+ in the EEA/UK).</li>
                    <li>If you’re under 18, you confirm you have a parent/guardian’s permission.</li>
                    <li>You may use Guest access if enabled by the event host.</li>
                  </ul>
                </li>

                <li>
                  <h4>3) Your content & ownership</h4>
                  <p>You own your photos and captions.</p>
                  <p>
                    By uploading, you grant us a worldwide, non-exclusive, royalty-free license to host, store, display,
                    transmit, resize/encode (e.g., thumbnails), and otherwise process your content only to operate,
                    improve, and promote the Service. This license ends when you delete the content or your account,
                    except for reasonable backup copies and content others already downloaded/shared.
                  </p>
                </li>

                <li>
                  <h4>4) Consent & rights in photos</h4>
                  <ul>
                    <li>You’re responsible for the photos you upload and have the rights to them.</li>
                    <li>You have permission/consent of people shown, especially minors.</li>
                    <li>Your uploads don’t violate privacy, publicity, or IP rights.</li>
                  </ul>
                </li>

                <li>
                  <h4>5) Event hosts</h4>
                  <p>
                    Hosts can invite guests, configure visibility, and may download or share uploaded content with
                    attendees. Hosts are responsible for communicating any photo policies to guests and honoring
                    legitimate takedown requests.
                  </p>
                </li>

                <li>
                  <h4>6) Prohibited uses (examples)</h4>
                  <ul>
                    <li>Illegal content/activities; harassment or hate; nudity/sexual content involving minors.</li>
                    <li>Doxxing; malware/spam; scraping; reverse engineering.</li>
                    <li>Automated bulk downloads; infringing content; anything that harms the Service or others.</li>
                  </ul>
                </li>

                <li>
                  <h4>7) Reporting and takedowns</h4>
                  <p>
                    See our Copyright Policy and Community Guidelines. We may remove content or suspend accounts to
                    protect users or comply with law.
                  </p>
                </li>

                <li>
                  <h4>8) Service changes</h4>
                  <p>
                    We may change, suspend, or discontinue features. We try to avoid breaking changes, but we’re not
                    liable for data loss—keep your own backups.
                  </p>
                </li>

                <li>
                  <h4>9) Fees</h4>
                  <p>
                    [If applicable: pricing, renewals, refunds, cancellation window, trial terms. Otherwise: “The Service
                    is currently free.”]
                  </p>
                </li>

                <li>
                  <h4>10) Disclaimer & limitation of liability</h4>
                  <p>
                    The Service is provided “as is.” To the fullest extent permitted by law, we disclaim warranties of
                    merchantability, fitness, and non-infringement. Our total liability for any claim is limited to the
                    greater of USD $100 or amounts you paid to us in the 12 months before the claim. Some jurisdictions
                    don’t allow these limits—yours may apply.
                  </p>
                </li>

                <li>
                  <h4>11) Indemnity</h4>
                  <p>You agree to defend and indemnify us from third-party claims arising from your content or misuse of the Service.</p>
                </li>

                <li>
                  <h4>12) Governing law & disputes</h4>
                  <p>
                    These Terms are governed by the laws of [State/Country], excluding conflict rules. Courts in [City,
                    State/Country] have exclusive jurisdiction. [Optional: add arbitration/waiver language if you use it.]
                  </p>
                </li>

                <li>
                  <h4>13) Changes to Terms</h4>
                  <p>
                    We’ll post updates here and change the “Effective date.” Material changes will be reasonably notified.
                  </p>
                </li>
              </ol>
            </section>
          ) : (
            <section>
              <p><strong>Effective:</strong> [Month DD, YYYY]</p>

              <h3>Privacy Policy</h3>
              <p>
                Effective date: [18/8/2025]. Controller: Wedding APP — [Ariel Elishayev],
                <a href="mailto:arieleli01212@email.com"> arieleli01212@email.com</a>.
              </p>

              <ol>
                <li>
                  <h4>1) What we collect</h4>
                  <ul>
                    <li>Account & profile: username, email (if provided).</li>
                    <li>Content: photos, captions, comments; technical metadata (e.g., EXIF if present — can be stripped when displayed).</li>
                    <li>Usage & device: IP address, browser/device type, language, crash logs, and basic analytics.</li>
                    <li>Cookies/local storage: for login, preferences, and performance.</li>
                  </ul>
                </li>

                <li>
                  <h4>2) Why we collect it (purposes)</h4>
                  <ul>
                    <li>Provide and secure the Service; render galleries; enable sharing/download (including client-side ZIP creation); prevent abuse; debug and improve.</li>
                    <li>Communicate service messages (e.g., feature changes, security).</li>
                    <li>With consent: optional analytics/marketing.</li>
                  </ul>
                </li>

                <li>
                  <h4>3) Legal bases (EEA/UK)</h4>
                  <ul>
                    <li>Contract: operate your account and the Service.</li>
                    <li>Legitimate interests: security, anti-abuse, product improvement (balanced with your rights).</li>
                    <li>Consent: non-essential cookies/analytics; marketing.</li>
                    <li>Legal obligation: respond to lawful requests.</li>
                  </ul>
                </li>

                <li>
                  <h4>4) Sharing of information</h4>
                  <ul>
                    <li>Processors that help us run the Service (hosting/CDN, analytics, error logging, email) acting on our instructions only.</li>
                    <li>Event hosts & attendees: content uploaded to an event can be downloaded/shared by the host or by users with access, as part of the Service.</li>
                    <li>Legal & safety: to comply with law or protect people’s safety/rights.</li>
                  </ul>
                  <p>We do not sell personal data.</p>
                </li>

                <li>
                  <h4>5) International transfers</h4>
                  <p>If data is processed outside your country, we use appropriate safeguards (e.g., SCCs for EEA/UK).</p>
                </li>

                <li>
                  <h4>6) Retention</h4>
                  <ul>
                    <li>Account data: for your account lifetime.</li>
                    <li>Photos: until the uploader/host deletes them or after [X months] of inactivity.</li>
                    <li>Logs & backups: [e.g., 30–180 days] then deleted or anonymized.</li>
                  </ul>
                </li>

                <li>
                  <h4>7) Your rights</h4>
                  <p>
                    Depending on where you live, you may have rights to access, correct, delete, restrict, port, or object
                    to processing, and to withdraw consent.
                  </p>
                  <ul>
                    <li>EEA/UK: you can complain to your local supervisory authority.</li>
                    <li>US-CA (CCPA/CPRA): you can request disclosure/deletion and opt out of certain “sharing” for cross-context advertising (we don’t do this).</li>
                  </ul>
                  <p>Request rights: email <a href="mailto:privacy@email.com">privacy@email.com</a>.</p>
                </li>

                <li>
                  <h4>8) Children</h4>
                  <p>
                    The Service isn’t for children under 13 (or 16 in the EEA/UK). If we learn we collected data from a
                    child, we’ll delete it.
                  </p>
                </li>

                <li>
                  <h4>9) Security</h4>
                  <p>
                    We use reasonable technical and organizational measures (TLS in transit, access controls,
                    least-privilege for processors). No system is 100% secure.
                  </p>
                </li>

                <li>
                  <h4>10) Changes</h4>
                  <p>
                    We’ll update this Policy and change the “Effective date.” We’ll notify you of material changes.
                  </p>
                </li>
              </ol>

              <h3>Community & Content Guidelines</h3>
              <ul>
                <li>Respectful and legal. No harassment, hate speech, threats, or illegal activity.</li>
                <li>Safe for families. No sexual content involving minors; no explicit nudity.</li>
                <li>Privacy-aware. Avoid sensitive personal data (IDs, medical forms, addresses).</li>
                <li>Yours to share. Only upload content you have rights to share; get consent from people in the photo.</li>
                <li>No spam or malware. No scraping, bulk automation, or harmful code.</li>
              </ul>
              <p>
                Enforcement: We may remove content or restrict accounts to protect the community or comply with law.
                Use the Report feature or email <a href="mailto:abuse@email.com">abuse@email.com</a>.
              </p>

              <h3>Copyright / DMCA Policy</h3>
              <p>If you believe content infringes your rights, send a notice containing:</p>
              <ul>
                <li>Your contact info.</li>
                <li>Identification of the copyrighted work.</li>
                <li>URL(s) or description of the infringing material.</li>
                <li>A statement of good-faith belief the use is not authorized.</li>
                <li>A statement under penalty of perjury that the info is accurate and you’re the owner or authorized to act.</li>
                <li>A physical/electronic signature.</li>
              </ul>
              <p>
                Send to our DMCA Agent: Name: [Ariel] — Email: 
                <a href="mailto:arieleli01212@email.com">arieleli01212@email.com</a>
              </p>
              <p>
                We may remove or disable the content and notify the uploader. If you believe we made a mistake, you can
                submit a counter-notice with: your contact info, identification of the removed material and where it
                appeared, a statement under penalty of perjury that the removal was in error, consent to jurisdiction of
                the courts at your location (or our location if outside the US), and your signature. We may restore
                content if we receive a valid counter-notice and no legal action is filed within 10–14 business days.
                We may terminate repeat infringers.
              </p>

              <h3>Cookie Notice</h3>
              <ul>
                <li>Essential cookies (authentication, security, preferences).</li>
                <li>Optional analytics (with your consent where required).</li>
                <li>LocalStorage/IndexedDB for performance.</li>
              </ul>
              <p>
                You can manage cookies in your browser. In regions that require consent, we’ll display a consent banner
                and honor your choices. See the Privacy Policy for details.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
