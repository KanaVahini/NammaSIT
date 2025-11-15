#!/usr/bin/env python3
"""
CampusConnect Recommendation System (FINAL VERSION)

Features:
---------
✓ TF-IDF Embeddings for Students, Clubs, Events
✓ Smart Interest → Category Mapping (AI ~ ML ~ DS ~ TECH)
✓ Strong Category Weighting for Clubs (Option A)
✓ Fuzzy Matching for Interests <-> Category Synonyms
✓ Full Explainability: Why each Student/Club/Event is recommended
✓ Clean, Structured Output
"""

import json
import os
import random
import sys
from typing import List, Dict, Any

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ===========================================================
# SMART CATEGORY SYNONYM MAPPING (AI ~ ML ~ TECH etc.)
# ===========================================================

SMART_CATEGORY_MAP = {
    "technical": [
        "ai", "ml", "machine learning", "data science", "ds", "analytics",
        "coding", "programming", "developer", "web development",
        "cybersecurity", "cloud", "iot"
    ],
    "ai": ["ai", "ml", "machine learning", "data science", "neural networks", "deep learning"],
    "coding": ["coding", "programming", "dsa", "cp", "development"],
    "robotics": ["robotics", "hardware", "electronics", "microcontroller", "arduino",
                 "drones", "aeronautics", "embedded"],
    "media": ["photography", "videography", "film", "filmmaking", "editing"],
    "cultural": ["dance", "music", "singing", "drama", "theatre", "acting",
                 "mime", "street play"],
    "literary": ["writing", "creative thinking", "storytelling", "poetry"],
    "management": ["event management", "leadership", "marketing", "communication"],
    "sports": ["sports", "running", "fitness", "marathon"]
}


# ===========================================================
# Helper loading utilities
# ===========================================================

def load_json(path: str):
    if not os.path.exists(path):
        print(f"Error: file not found -> {path}")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_list(x):
    if x is None:
        return []
    if isinstance(x, list):
        return x
    if isinstance(x, str):
        return [x]
    return list(x)


def normalize(t: str) -> str:
    return str(t).strip().lower()


def normalize_list(lst):
    return [normalize(x) for x in ensure_list(lst) if x is not None and str(x).strip() != ""]


# ===========================================================
# SMART CATEGORY ↔ INTEREST MATCHING
# ===========================================================

def smart_category_match(student_interests: List[str], club_category: str) -> bool:
    """
    Checks if student interests align with the club category using:
    - Direct word match
    - Fuzzy match through SMART_CATEGORY_MAP
    """
    interests = set(normalize_list(student_interests))
    category = normalize(club_category)

    # If exact category exists in mapping
    if category in SMART_CATEGORY_MAP:
        synonyms = set(normalize_list(SMART_CATEGORY_MAP[category]))
        if len(interests.intersection(synonyms)) > 0:
            return True

    # Otherwise check reverse mapping
    for cat, syn_list in SMART_CATEGORY_MAP.items():
        if category in syn_list:  # if category is inside synonyms
            if len(interests.intersection(set(syn_list))) > 0:
                return True

    # Final: try raw equality match
    return category in interests


# ===========================================================
# Convert entities into TF-IDF readable text format
# ===========================================================

def student_to_text(s: Dict[str, Any]) -> str:
    interests = ensure_list(s.get("interests") or s.get("interinterests"))
    hobbies = ensure_list(s.get("hobbies"))
    good_at = ensure_list(s.get("good_at"))
    bad_at = ensure_list(s.get("bad_at"))
    goals = ensure_list(s.get("goals"))
    pref = ensure_list(s.get("preferred_activities"))
    stage = s.get("learning_stage", "")
    dept = s.get("department", "")

    skill_dict = s.get("skills") or {}
    skills = [f"{k}-{v}" for k, v in skill_dict.items()]

    tokens = interests + hobbies + good_at + bad_at + goals + pref + skills + [stage, dept]
    tokens = [str(t) for t in tokens if t]
    return " ".join(tokens)


def club_to_text(c):
    keywords = ensure_list(c.get("keywords"))
    skills = ensure_list(c.get("skills_required"))
    acts = ensure_list(c.get("activities_type"))
    category = c.get("category", "")
    diff = c.get("difficulty", "")

    tokens = keywords + skills + acts + [category, diff]
    tokens = [str(t) for t in tokens if t]
    return " ".join(tokens)


def event_to_text(e):
    tags = ensure_list(e.get("tags"))
    skills = ensure_list(e.get("skills_required"))
    category = e.get("category", "")
    evtype = e.get("event_type", "")
    diff = e.get("difficulty_level", "")

    tokens = tags + skills + [category, evtype, diff]
    tokens = [str(t) for t in tokens if t]
    return " ".join(tokens)


# ===========================================================
# Feature matching utilities
# ===========================================================

def match_lists(list1, list2):
    s1 = set(normalize_list(list1))
    s2 = set(normalize_list(list2))
    return sorted(list(s1.intersection(s2)))


def match_skills(skill_dict, skill_list):
    if not isinstance(skill_dict, dict):
        return []
    owned = set(normalize_list(list(skill_dict.keys())))
    required = set(normalize_list(skill_list))
    return sorted(list(owned.intersection(required)))


# ===========================================================
# Build ML Embeddings
# ===========================================================

def build_embeddings(students, clubs, events):
    docs_students = [student_to_text(s) for s in students]
    docs_clubs = [club_to_text(c) for c in clubs]
    docs_events = [event_to_text(e) for e in events]

    combined = docs_students + docs_clubs + docs_events

    tfidf = TfidfVectorizer()
    mat = tfidf.fit_transform(combined).toarray()

    n_s, n_c = len(students), len(clubs)
    student_emb = mat[:n_s]
    club_emb = mat[n_s: n_s + n_c]
    event_emb = mat[n_s + n_c:]

    return tfidf, student_emb, club_emb, event_emb


# ===========================================================
# Recommendation Engine (MAIN LOGIC)
# ===========================================================

def recommend(student_id, students, clubs, events, student_emb, club_emb, event_emb):
    # find target index
    idx = next(i for i, s in enumerate(students) if s["student_id"] == student_id)
    s0 = students[idx]
    vec = student_emb[idx].reshape(1, -1)

    # ---------------- Students ----------------
    sims = cosine_similarity(vec, student_emb)[0]
    order = np.argsort(sims)[::-1]

    order = [i for i in order if i != idx][:5]  # remove self

    student_results = []
    for i in order:
        s = students[i]
        student_results.append({
            "student_id": s["student_id"],
            "name": s["name"],
            "similarity": round(float(sims[i]), 4),
            "shared_interests": match_lists(s0["interests"], s["interests"]),
            "shared_hobbies": match_lists(s0["hobbies"], s["hobbies"]),
            "shared_goals": match_lists(s0["goals"], s["goals"]),
            "shared_skills": match_skills(s0["skills"], list(s["skills"].keys()))
        })

    # ---------------- Clubs (Weighted) ----------------
    club_base = cosine_similarity(vec, club_emb)[0]
    club_results = []

    for i, c in enumerate(clubs):
        base = float(club_base[i])

        smart_match = smart_category_match(s0["interests"], c["category"])
        cat_weight = 1 if smart_match else 0

        keyword_match = match_lists(s0["interests"], c["keywords"])
        skill_match = match_skills(s0["skills"], c["skills_required"])

        kw, sk = len(keyword_match), len(skill_match)

        final_score = (base * 0.5) + (cat_weight * 0.4) + (kw * 0.05) + (sk * 0.05)

        club_results.append({
            "club_id": c["club_id"],
            "club_name": c["club_name"],
            "category": c["category"],
            "weighted_score": round(final_score, 4),
            "category_match": bool(cat_weight),
            "matched_keywords": keyword_match,
            "matched_skills": skill_match
        })

    club_results = sorted(club_results, key=lambda x: x["weighted_score"], reverse=True)[:5]

    # ---------------- Events ----------------
    event_base = cosine_similarity(vec, event_emb)[0]
    event_order = np.argsort(event_base)[::-1][:5]

    event_results = []
    for i in event_order:
        e = events[i]
        event_results.append({
            "event_id": e["event_id"],
            "event_name": e["event_name"],
            "similarity": round(float(event_base[i]), 4),
            "matched_tags": match_lists(s0["interests"], e["tags"]),
            "matched_skills": match_skills(s0["skills"], e["skills_required"])
        })

    return s0, student_results, club_results, event_results


# ===========================================================
# Pretty Printing
# ===========================================================

def print_output(s0, s_list, c_list, e_list):
    print("\n=====================================================")
    print(f"📌 Recommendations for {s0['name']} (ID: {s0['student_id']})")
    print("=====================================================\n")

    print("👥 Similar Students:")
    for s in s_list:
        print(f" - {s['name']}  | score={s['similarity']}")
        if s["shared_interests"]: print("    interests:", s["shared_interests"])
        if s["shared_hobbies"]: print("    hobbies:", s["shared_hobbies"])
        if s["shared_goals"]: print("    goals:", s["shared_goals"])
        print()

    print("\n🏛 Best Clubs (SMART Interest–Category Matching):")
    for c in c_list:
        print(f" - {c['club_name']} | score={c['weighted_score']}")
        print(f"    category: {c['category']}  | match: {c['category_match']}")
        if c["matched_keywords"]: print("    keywords:", c["matched_keywords"])
        if c["matched_skills"]: print("    skills:", c["matched_skills"])
        print()

    print("\n🎉 Best Events:")
    for e in e_list:
        print(f" - {e['event_name']} | score={e['similarity']}")
        if e["matched_tags"]: print("    tags:", e["matched_tags"])
        if e["matched_skills"]: print("    skills:", e["matched_skills"])
        print()

    print("=====================================================\n")


# ===========================================================
# MAIN
# ===========================================================

def run_for_single_student(student_profile):
    students = load_json("students.json")
    clubs = load_json("clubs.json")
    events = load_json("events.json")

    student_profile = dict(student_profile)
    student_profile["student_id"] = 1
    students = [student_profile] + students

    _, s_emb, c_emb, e_emb = build_embeddings(students, clubs, events)
    s0, sim_students, sim_clubs, sim_events = recommend(
        1, students, clubs, events, s_emb, c_emb, e_emb
    )
    return {
        "student": s0,
        "similar_students": sim_students,
        "clubs": sim_clubs,
        "events": sim_events,
    }


def main():
    if not sys.stdin.isatty():
        raw = sys.stdin.read().strip()
        if raw:
            payload = json.loads(raw)

            student_profile = {
                "name": payload.get("name", "Current User"),
                "interests": payload.get("interests", []),
                "hobbies": payload.get("hobbies", []),
                "good_at": payload.get("goodAt", []),
                "bad_at": payload.get("badAt", []),
                "goals": payload.get("goals", []),
                "preferred_activities": [],
                "learning_stage": payload.get("stage", ""),
                "department": payload.get("department", ""),
                "skills": payload.get("skills", {}),
            }
            result = run_for_single_student(student_profile)
            print(json.dumps(result, ensure_ascii=False))
            return

    students = load_json("students.json")
    clubs = load_json("clubs.json")
    events = load_json("events.json")

    for i, s in enumerate(students):
        if "student_id" not in s:
            s["student_id"] = i + 1

    _, s_emb, c_emb, e_emb = build_embeddings(students, clubs, events)

    sid = input("Enter student_id (blank=random): ").strip()
    if sid == "":
        sid = random.choice(students)["student_id"]
        print("Using random student ID:", sid)
    else:
        sid = int(sid)

    s0, sim_students, sim_clubs, sim_events = recommend(
        sid, students, clubs, events, s_emb, c_emb, e_emb
    )

    print_output(s0, sim_students, sim_clubs, sim_events)


if __name__ == "__main__":
    main()


