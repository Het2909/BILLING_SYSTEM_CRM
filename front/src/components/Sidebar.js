import {
  LayoutDashboard,
  ReceiptText,
  Package,
  PackagePlus,
  ShoppingCart,
  Users,
  Truck,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight the current page

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
    { name: "Purchases", path: "/purchases", icon: <PackagePlus size={20} /> },
    { name: "Billing", path: "/billing", icon: <ShoppingCart size={20} /> },
    { name: "Bills", path: "/bills", icon: <ReceiptText size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
  ];

  return (
    <div style={styles.sidebar}>
      <h1 style={styles.logo}>
        Grocery <span style={{ color: "#3b82f6" }}>POS</span>
      </h1>

      <div style={styles.navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{
              ...styles.navLink,
              ...(location.pathname === item.path ? styles.activeLink : {}),
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      <button onClick={logout} style={styles.logoutButton}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    left: 0,
    // top: 0,
    width: "260px",
    height: "100vh",
    backgroundColor: "#111827", // Deep charcoal/black
    color: "white",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 10px rgba(0,0,0,0.3)",
    zIndex: 1100,
    // marginBottom: "12%",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "800",
    marginBottom: "50px",
    letterSpacing: "1px",
    textAlign: "center",
  },
  navContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    borderRadius: "12px",
    color: "#9ca3af", // Muted gray text
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  activeLink: {
    backgroundColor: "#1f2937",
    color: "white",
    borderLeft: "4px solid #3b82f6",
  },
  logoutButton: {
    marginTop: "auto", // Pushes button to the bottom
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.3s",
  },
};

export default Sidebar;
