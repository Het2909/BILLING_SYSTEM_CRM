import React from 'react';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      {/* Left Side: Branding */}
      <div>
        <h1 style={styles.brandTitle}>
          Grocery <span style={styles.accentText}>POS</span> Dashboard
        </h1>
        <p style={styles.brandSubtitle}>
          Manage inventory and billing efficiently
        </p>
      </div>

      {/* Right Side: Profile/Actions */}
      <div style={styles.actionsArea}>
        <div style={styles.notificationDot}></div>
        <div style={styles.profileCircle}>
          A
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    // Glassmorphism effect
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e2e8f0",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    // marginLeft: "%",
    width: "100%",
  },
  brandTitle: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#1a202c",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  accentText: {
    color: "#3b82f6", // Modern blue accent
  },
  brandSubtitle: {
    fontSize: "0.85rem",
    color: "#718096",
    margin: 0,
    marginTop: "2px",
  },
  actionsArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  profileCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#1a202c",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "2px solid #fff",
  },
  notificationDot: {
    width: "10px",
    height: "10px",
    backgroundColor: "#f87171", // Soft red
    borderRadius: "50%",
    marginRight: "-5px",
  }
};

export default Navbar;