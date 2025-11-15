import React, { useState } from "react";
import "./ClassResources.css";
import Navbar from "../components/Navbar";

export default function ClassResources() {
  const [pdfView, setPdfView] = useState(null);

  // NOTES DATA
  const notes = [
    { name: "Programming in C - Unit 1", file: "/pdfs/c_unit1.pdf" },
    { name: "Physics Module 2", file: "/pdfs/physics_mod2.pdf" },
    { name: "Mathematics - Differentiation", file: "/pdfs/maths_diff.pdf" },
  ];

  // PYQs
  const pyqs = [
    { name: "CSE Sem 1 PYQ - 2023", file: "/pdfs/pyq_2023.pdf" },
    { name: "CSE Sem 1 PYQ - 2022", file: "/pdfs/pyq_2022.pdf" },
  ];

  // RECOMMENDATIONS FOR YOU
  const recos = [
    { icon: "⭐", text: "Important units to focus on this week" },
    { icon: "📘", text: "Most downloaded notes by your class" },
    { icon: "🎯", text: "High-weightage exam topics" },
    { icon: "⚡", text: "Common mistakes to avoid this semester" },
    { icon: "🚀", text: "Study plan for your next assessment" },
  ];

  // CLASS INFO
  const classInfo = [
    { icon: "🏫", label: "Department", value: "CSE" },
    { icon: "🧑‍🤝‍🧑", label: "Section", value: "B" },
    { icon: "📅", label: "Batch", value: "2024 – 2028" },
    { icon: "📚", label: "Semester", value: "1" },
  ];

  return (
    <>
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="electric-resources">

        <div className="resources-content">
          {/* TITLE */}
          <h1 className="glitch-title" data-text="CLASS RESOURCES HUB">
            CLASS RESOURCES HUB
          </h1>

          {/* CLASS INFO CARDS */}
          <div className="info-grid">
            {classInfo.map((info, idx) => (
              <div
                key={info.label}
                className="info-card-electric"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="info-icon">{info.icon}</div>
                <div className="info-text">
                  <div className="info-label">{info.label}</div>
                  <div className="info-value">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* PRIORITY RECOMMENDATIONS */}
          <div className="section-container">
            <h2 className="section-title">
              <span className="title-icon">✨</span>
              PRIORITY RECOMMENDATIONS
            </h2>

            <div className="reco-grid">
              {recos.map((reco, idx) => (
                <div
                  key={idx}
                  className="reco-card-electric"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="reco-icon">{reco.icon}</span>
                  <p className="reco-text">{reco.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NOTES SECTION */}
          <div className="section-container">
            <h2 className="category-title">
              <span className="category-icon">📘</span> NOTES
            </h2>

            <div className="pdf-list">
              {notes.map((note, idx) => (
                <div
                  key={note.name}
                  className="pdf-card-electric"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="pdf-name">{note.name}</div>
                  <div className="pdf-actions-electric">
                    <button
                      className="action-btn action-open"
                      onClick={() => setPdfView(note.file)}
                    >
                      OPEN
                    </button>
                    <a
                      href={note.file}
                      download
                      className="action-btn action-download"
                    >
                      DOWNLOAD
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PYQs SECTION */}
          <div className="section-container">
            <h2 className="category-title">
              <span className="category-icon">📕</span> PREVIOUS YEAR QUESTIONS
            </h2>

            <div className="pdf-list">
              {pyqs.map((pyq, idx) => (
                <div
                  key={pyq.name}
                  className="pdf-card-electric"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="pdf-name">{pyq.name}</div>
                  <div className="pdf-actions-electric">
                    <button
                      className="action-btn action-open"
                      onClick={() => setPdfView(pyq.file)}
                    >
                      OPEN
                    </button>
                    <a
                      href={pyq.file}
                      download
                      className="action-btn action-download"
                    >
                      DOWNLOAD
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF MODAL */}
          {pdfView && (
            <div
              className="pdf-modal-electric"
              onClick={() => setPdfView(null)}
            >
              <div
                className="pdf-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3 className="modal-title">PDF VIEWER</h3>
                  <button
                    className="close-btn-electric"
                    onClick={() => setPdfView(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <iframe
                    title="PDF Viewer"
                    src={pdfView}
                    className="pdf-iframe"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
