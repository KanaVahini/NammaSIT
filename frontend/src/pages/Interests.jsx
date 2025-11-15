import { useState } from "react";
import "./Interests.css";
import RecommendationsModal from "../components/RecommendationsModal";
// If keeping modal in pages folder, use: import RecommendationsModal from "./RecommendationsModal";

export default function Interests() {
  const [selected, setSelected] = useState({
    interests: [],
    hobbies: [],
    skills: [],
    stage: "",
    goals: [],
    goodAt: [],
    badAt: [],
  });

  const [celebrate, setCelebrate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const sections = [
    {
      title: "🧠 1️⃣ Interests (Primary Domains)",
      sub: "Choose up to 5",
      key: "interests",
      limit: 5,
      items: [
        "Tech & Innovation", "Artificial Intelligence", "Machine Learning", "Data Science",
        "Web Development", "App Development", "Cybersecurity", "Cloud Computing",
        "Internet of Things (IoT)", "Blockchain / Web3", "Robotics", "Game Development",
        "AR/VR", "UI/UX Design", "Photography", "Videography", "Graphic Design",
        "Music", "Dance", "Writing & Blogging", "Art & Craft", "Fashion Design",
        "Volunteering / Social Service", "Debating / Public Speaking", "Event Management",
        "Entrepreneurship", "Marketing", "Psychology & Behaviour", "Sports & Fitness"
      ]
    },
    {
      title: "🎨 2️⃣ Hobbies (Lifestyle)",
      sub: "Select any number",
      key: "hobbies",
      items: [
        "Reading books","Playing instruments","Sports / Gym","Watching movies / series",
        "Travelling","Cooking / Baking","Photography / Videography","Gaming",
        "Sketching / Painting","Writing journals / poems","Singing","Gardening",
        "Coding for fun","DIY Projects","Hosting events","Podcasting / Vlogging"
      ]
    },
    {
      title: "💪 3️⃣ Skills (Technical + Soft)",
      sub: "Tap to select (any number)",
      key: "skills",
      items: [
        "Python","Java","C/C++","HTML/CSS/JS","React","Flutter / Kotlin","SQL / Databases",
        "Machine Learning","Data Visualization","UI/UX Design (Figma)","Cloud / AWS / Azure",
        "Git / Version Control","Communication","Teamwork","Problem-Solving","Time Management",
        "Leadership","Public Speaking","Creativity","Critical Thinking"
      ]
    },
    {
      title: "🚀 4️⃣ Learning Stage",
      sub: "Select one",
      key: "stage",
      single: true,
      items: [
        "🟢 Beginner — just starting to explore",
        "🟡 Intermediate — done basics, some projects",
        "🔵 Advanced — confident, can mentor",
        "🟣 Expert — deep knowledge, research/startup"
      ]
    },
    {
      title: "🎯 5️⃣ Goals",
      sub: "Choose 2–3",
      key: "goals",
      limit: 3,
      items: [
        "Get an internship","Build portfolio / resume","Win hackathons",
        "Learn new technologies","Publish research","Start a startup",
        "Improve communication","Get placed in top company","Network",
        "Mentor juniors","Explore creative arts","Organize events"
      ]
    },
    {
      title: "⚖ 6️⃣ Good At (Strengths)",
      sub: "Choose up to 3",
      key: "goodAt",
      limit: 3,
      items: [
        "Problem Solving","Designing","Development","Speaking / Presenting",
        "Leading Teams","Organizing Events","Writing","Analyzing Data","Creative Thinking",
        "Teaching / Mentoring","Marketing","Time Management"
      ]
    },
    {
      title: "⚠ 7️⃣ Want to Improve",
      sub: "Pick 2–3",
      key: "badAt",
      limit: 3,
      items: [
        "Public Speaking","Time Management","Staying Consistent","Technical Coding",
        "Communication","Leadership","Handling Stress","Networking","Documentation",
        "Creativity","Planning / Organization"
      ]
    }
  ];

  function toggle(section, item, limit, single) {
    setSelected((prev) => {
      let arr = prev[section] || [];

      if (single) return { ...prev, [section]: item };

      if (arr.includes(item))
        return { ...prev, [section]: arr.filter((i) => i !== item) };

      if (limit && arr.length >= limit) return prev;

      return { ...prev, [section]: [...arr, item] };
    });
  }

  async function finish() {

  if (selected.interests.length === 0) {
    alert("Please select at least one interest!");
    return;
  }

  try {
    setSaving(true);

    const payload = {
      ...selected,
      skills: Object.fromEntries(selected.skills.map(s => [s, 3]))
    };

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("ML request failed");

    const data = await res.json();

    setCelebrate(true);

    if (data.recommendations) {
      setTimeout(() => {
        setCelebrate(false);
        setRecommendations(data.recommendations);
        localStorage.setItem("sit4u_recommendations", JSON.stringify(data.recommendations));

        setShowRecommendations(true);
      }, 2000);
    }

  } catch (err) {
    console.error(err);
    alert("Could not fetch recommendations. Please try again.");
  } finally {
    setSaving(false);
  }
}



  return (
    <div className="interests-wrapper">
      <h1 className="interests-title" data-text="Build Your Student Profile">
        Build Your Student Profile
      </h1>

      {sections.map((sec) => (
        <div key={sec.key} className="interest-card">
          <h2>{sec.title}</h2>
          <p className="interest-subtitle">{sec.sub}</p>

          <div className="interest-options">
            {sec.items.map((item) => (
              <button
                key={item}
                className={`option-btn ${
                  selected[sec.key] === item ||
                  selected[sec.key]?.includes?.(item)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggle(sec.key, item, sec.limit, sec.single)
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className="finish-btn" onClick={finish} disabled={saving}>
        {saving ? "✨ Analyzing Your Profile..." : "🚀 Finish & Get Recommendations"}
      </button>

      {celebrate && (
        <div className="celebration-overlay">
          🎉 Profile Created Successfully! 🚀
        </div>
      )}

      {showRecommendations && recommendations && (
        <RecommendationsModal
  recommendations={recommendations}
  onClose={() => {
    window.location.href = "/home.html";
  }}
/>

      )}
    </div>
  );
}
