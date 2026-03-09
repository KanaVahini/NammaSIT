import { useState } from "react";
import "./Interests.css";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    usn: "",
    email: "",
    section: "",
    idcard: null,
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  function handleChange(e) {
    if (e.target.name === "idCard") {
      setForm({ ...form, idCard: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("usn", form.usn);
    formData.append("email", form.email);
    formData.append("section", form.section);
    formData.append("idCard", form.idcard);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      if (data?.user?._id) {
        localStorage.setItem("sit4u_userId", data.user._id);
      }

      setLoading(false);
      setPopup(true);

      setTimeout(() => {
        setPopup(false);
        navigate("/interests");
      }, 3000); // popup on screen for 3 seconds
    } catch {
      setLoading(false);
      alert("Error storing data!");
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      
      {/* LEFT SIDE */}
      <div style={{ flex: 1, position: "relative" }}>
        <div className="grid-bg"></div>
        <div className="gradient-overlay"></div>
        <div className="scanlines"></div>
        <div className="shapes-container">
          <div className="shape shape-circle"></div>
          <div className="shape shape-triangle"></div>
          <div className="shape shape-square"></div>
        </div>

        <div className="floating-title">SIT PORTAL</div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          style={{ width: "75%", padding: "40px" }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "2rem"
            }}
          >
            Student Login
          </h2>

          <div className="form-group">
            <label>Name</label>
            <input name="name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>USN</label>
            <input name="usn" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Section</label>
            <input name="section" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Upload ID Card</label>
            <input name="idcard" type="file" required onChange={handleChange} />
          </div>

          <button className="submit-btn" type="submit">
            Continue
          </button>
        </form>
      </div>

      {/* FIXED — Loader Overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="text"><span>Loading</span></div>
            <div className="line"></div>
          </div>
        </div>
      )}

      {/* FIXED — Popup from Top */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "22px 38px",
            background:
              "linear-gradient(45deg, #FF5E00cc, #00B2FFcc)",
            borderRadius: "14px",
            color: "white",
            fontFamily: "Orbitron",
            fontSize: "1.3rem",
            letterSpacing: "1px",
            fontWeight: "700",
            boxShadow: "0 0 25px rgba(255,94,0,0.7)",
            animation: "slideDownFixed 0.7s ease",
            zIndex: 99999,
          }}
        >
          ✓ Student data saved successfully
        </div>
      )}
    </div>
  );
}
