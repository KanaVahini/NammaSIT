import React from "react";
import "./navbar.css"; // make sure navbar.css is in public or src

export default function Navbar() {
  // navigateTo for HTML pages
  const navigateTo = (page) => {
    window.location.href = `${page}.html`;
  };

  return (
    <>
      {/* Background animations */}
      <div className="grid-bg"></div>
      <div className="gradient-overlay"></div>

      {/* Navbar */}
      <nav>
        <div className="nav-container">
          <div
            className="logo-text"
            onClick={() => (window.location.href = "/home.html")}
          >
            SIT4U
          </div>

          <ul className="nav-links">
            {/* Connect (HTML page) */}
            <li>
              <a href="connect.html" className="nav-btn">
                Connect
              </a>
            </li>

            {/* Classroom (React page) */}
            <li>
              <a href="/class-resources" className="nav-btn">
                Classroom
              </a>
            </li>

            {/* Notification (HTML page) */}
            <li style={{ position: "relative" }}>
              <a href="location.html" className="nav-btn">
                Notification
                <span className="notification-badge">3</span>
              </a>
            </li>

            {/* Dropdown menu */}
            <li className="dropdown">
              <a className="nav-btn">SIT4U ▼</a>

              <div className="dropdown-content">
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("clubs")}
                >
                  Clubs
                </button>
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("location")}
                >
                  Placement
                </button>
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("faculty")}
                >
                  Faculty
                </button>
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("connect")}
                >
                  SITUnknown
                </button>
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("health")}
                >
                  Health Center
                </button>
                <button
                  className="dropdown-btn"
                  onClick={() => navigateTo("sports")}
                >
                  Sports
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
