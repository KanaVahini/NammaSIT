import { useState } from "react";
import "./RecommendationsModal.css";

export default function RecommendationsModal({ recommendations, onClose }) {
  const [activeTab, setActiveTab] = useState("clubs");

  const { clubs = [], similar_students = [], events = [] } = recommendations;

  return (
    <div className="rec-modal-overlay" onClick={onClose}>
      <div className="rec-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rec-header">
          <div className="rec-header-content">
            <h1>✨ Your Personalized Recommendations</h1>
            <p>Based on your interests and profile, here's what we found for you!</p>
          </div>
          <button className="rec-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="rec-tabs">
          <button
            className={`rec-tab ${activeTab === "clubs" ? "active" : ""}`}
            onClick={() => setActiveTab("clubs")}
          >
            🏛️ Clubs ({clubs.length})
          </button>
          <button
            className={`rec-tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            🎉 Events ({events.length})
          </button>
          <button
            className={`rec-tab ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            👥 Students ({similar_students.length})
          </button>
        </div>

        {/* Content */}
        <div className="rec-content">
          {activeTab === "clubs" && (
            <div className="rec-grid">
              {clubs.map((club, idx) => (
                <div key={idx} className="rec-card club-card">
                  <div className="rec-card-header">
                    <h3>{club.club_name}</h3>
                    <span className="rec-score">{(club.weighted_score * 100).toFixed(0)}% Match</span>
                  </div>
                  
                  <div className="rec-category">
                    <span className="category-badge">{club.category}</span>
                    {club.category_match && <span className="match-badge">✓ Perfect Fit</span>}
                  </div>

                  {club.matched_keywords.length > 0 && (
                    <div className="rec-matches">
                      <strong>📌 Keywords:</strong>
                      <div className="tag-list">
                        {club.matched_keywords.map((kw, i) => (
                          <span key={i} className="tag">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {club.matched_skills.length > 0 && (
                    <div className="rec-matches">
                      <strong>💪 Your Skills:</strong>
                      <div className="tag-list">
                        {club.matched_skills.map((skill, i) => (
                          <span key={i} className="tag skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "events" && (
            <div className="rec-grid">
              {events.map((event, idx) => (
                <div key={idx} className="rec-card event-card">
                  <div className="rec-card-header">
                    <h3>{event.event_name}</h3>
                    <span className="rec-score">{(event.similarity * 100).toFixed(0)}% Match</span>
                  </div>

                  {event.matched_tags.length > 0 && (
                    <div className="rec-matches">
                      <strong>🏷️ Tags:</strong>
                      <div className="tag-list">
                        {event.matched_tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.matched_skills.length > 0 && (
                    <div className="rec-matches">
                      <strong>💡 Skills:</strong>
                      <div className="tag-list">
                        {event.matched_skills.map((skill, i) => (
                          <span key={i} className="tag skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "students" && (
            <div className="rec-grid">
              {similar_students.map((student, idx) => (
                <div key={idx} className="rec-card student-card">
                  <div className="rec-card-header">
                    <h3>{student.name}</h3>
                    <span className="rec-score">{(student.similarity * 100).toFixed(0)}% Similar</span>
                  </div>

                  {student.shared_interests.length > 0 && (
                    <div className="rec-matches">
                      <strong>💡 Shared Interests:</strong>
                      <div className="tag-list">
                        {student.shared_interests.map((int, i) => (
                          <span key={i} className="tag">{int}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.shared_hobbies.length > 0 && (
                    <div className="rec-matches">
                      <strong>🎨 Shared Hobbies:</strong>
                      <div className="tag-list">
                        {student.shared_hobbies.map((hobby, i) => (
                          <span key={i} className="tag">{hobby}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.shared_goals.length > 0 && (
                    <div className="rec-matches">
                      <strong>🎯 Shared Goals:</strong>
                      <div className="tag-list">
                        {student.shared_goals.map((goal, i) => (
                          <span key={i} className="tag goal-tag">{goal}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rec-footer">
          <button className="rec-btn-primary" onClick={onClose}>
            🚀 Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}