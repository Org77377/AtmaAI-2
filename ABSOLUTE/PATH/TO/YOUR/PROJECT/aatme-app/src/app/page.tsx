
"use client";

// Removed all other imports for this minimal test

export default function HomePage() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Aatme - Minimal Test Page</h1>
      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        If you can see this text, the basic layout and routing are working.
      </p>
      <p style={{ marginTop: "20px", color: "gray" }}>
        Please check your browser's developer console for errors if this is the only thing you see
        or if you expected your full application.
      </p>
    </div>
  );
}
