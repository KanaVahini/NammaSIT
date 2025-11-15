const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  usn: String,
  email: String,
  section: String,
  idCard: String, // file path / URL

  // NEW: profile fields for interests
  interests: {
    interests: { type: [String], default: [] }, // array of strings
    hobbies: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    stage: { type: String, default: "" }, // e.g., "beginner", "intermediate"
    goals: { type: [String], default: [] },
    goodAt: { type: [String], default: [] },
    badAt: { type: [String], default: [] },
    department: { type: String, default: "" },
    // add more keys freely later
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
