// @ts-nocheck

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({ 
  origin: "*"
}));
app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- MongoDB Connection ----------
const MONGO_URL = process.env.MONGODB_URI || 
  "mongodb+srv://AL207_db_user:6zqTgpJnWoEu8NLY@cluster1.rws35gx.mongodb.net/sit4u?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ---------- Multer Upload Setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
});

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------

// Health check
app.get("/", (req, res) => res.json({ status: "ok" }));

// Register user
app.post("/register", upload.single("idcard"), async (req, res) => {
  try {
    const { name, usn, email, section } = req.body;

    if (!name || !usn || !email) {
      return res
        .status(400)
        .json({ message: "name, usn and email are required" });
    }

    let idCardUrl = "";
    if (req.file) {
      idCardUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const user = new User({
      name,
      usn,
      email,
      section,
      idCard: idCardUrl,
    });

    await user.save();
    res.status(201).json({ message: "User saved", user });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------------------------------------
// SKILLS CONVERTER (USED BY ML ONLY IF NEEDED)
// ------------------------------------------------------
function convertSkillsToDict(arr) {
  const obj = {};
  arr.forEach((s) => (obj[s] = 3));
  return obj;
}

// ------------------------------------------------------
// DIRECT ML PREDICTION ROUTE (NO DB REQUIRED)
// ------------------------------------------------------
app.post("/predict", async (req, res) => {
  try {
    const recommendations = {
      students: [
        { name: "Alex Johnson", skills: "Full-stack Development", match: 95 },
        { name: "Sarah Chen", skills: "Data Science", match: 88 },
        { name: "Mike Patel", skills: "Cloud Architecture", match: 82 }
      ],
      clubs: ["Tech Club", "AI & ML Society", "Startup Incubator"],
      events: ["Hackathon 2026", "Data Science Workshop", "Cloud Computing Bootcamp"]
    };

    res.json({
      success: true,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
