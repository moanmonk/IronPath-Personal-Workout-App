"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "motion/react";
import {
  Calendar,
  TrendingUp,
  Check,
  RefreshCw,
  Pencil,
  ClipboardList,
  Trash2,
  Plus,
  ArrowLeft,
  X,
  Minus,
  Dumbbell,
  ChevronRight,
  Sparkles,
  Info,
  CalendarDays
} from "lucide-react";

// ─── CONSTANTS & DATABASES ──────────────────────────────────────────────────
const METHODS = [
  "Cable",
  "Straight Bar",
  "EZ Bar",
  "V Bar",
  "Rope",
  "Cuff/Ring",
  "Dumbbell",
  "Barbell",
  "Smith Machine",
  "Bodyweight",
  "Weighted",
  "Band",
  "Machine"
];

const PULLUP_METHODS = ["Bodyweight", "Weighted"];
const MUSCLE_GROUPS = [
  "Chest",
  "Shoulders",
  "Back",
  "Biceps",
  "Triceps",
  "Forearms",
  "Legs",
  "Glutes",
  "Calves",
  "Rear Delts",
  "Traps",
  "Core"
];

interface ExerciseDBItem {
  name: string;
  method: string;
  sets: number;
  reps: string;
  note: string;
}

const EXERCISE_DB: Record<string, ExerciseDBItem[]> = {
  "Chest": [
    { name: "Incline Dumbbell Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Set bench to 45°. Hold DBs at chest level, elbows at ~75° from torso. Press up and slightly in. Lower slowly over 3 seconds. Great for upper chest thickness." },
    { name: "Flat Dumbbell Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Lie flat, DBs at chest height with elbows just below shoulder level. Drive up and squeeze at top. Keep shoulder blades retracted. Don't let DBs crash together." },
    { name: "Cable Fly Low-to-High", method: "Cable", sets: 3, reps: "12–15", note: "Set cables at lowest position. Slight forward lean, arms wide. Bring hands up and together in a hugging arc. Squeeze hard at the top for 1 sec. Targets upper chest." },
    { name: "Cable Fly High-to-Low", method: "Cable", sets: 3, reps: "12–15", note: "Cables set high. Lean forward slightly. Bring arms down and together. Great for lower chest. Keep a slight bend in elbows throughout — never fully extend." },
    { name: "Pec Deck Fly", method: "Machine", sets: 3, reps: "12–15", note: "Adjust seat so handles are at chest height. Elbows slightly bent. Squeeze chest hard as you bring arms together. Pause 1 sec at peak. Don't let the weight stack touch between reps." },
    { name: "Smith Machine Incline Press", method: "Smith Machine", sets: 4, reps: "8–10", note: "Set bench at 30–45°. Grip slightly wider than shoulder width. Unrack and lower to upper chest. Press back up. Smith machine path keeps form strict — good for beginners." },
    { name: "Cable Chest Press", method: "Cable", sets: 3, reps: "10–12", note: "Cables at chest height, stand in split stance. Press forward and slightly together. Constant tension throughout the range. Great as a finisher after presses." },
  ],
  "Shoulders": [
    { name: "Dumbbell Shoulder Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Sit upright. Start with DBs at ear level, elbows at 90°. Press directly overhead without flaring elbows too wide. Lower under control. Brace your core — don't arch lower back." },
    { name: "Smith Machine Shoulder Press", method: "Smith Machine", sets: 4, reps: "8–10", note: "Sit under the bar. Press from just in front of your face upward. Keep core tight. Smith path makes it beginner-friendly for learning the pressing pattern." },
    { name: "Cable Lateral Raise", method: "Cable", sets: 4, reps: "12–15", note: "Set cable at lowest position, grab with opposite hand for cross-body tension. Raise arm out to side to shoulder height. Slow 3-sec lower. Cable keeps tension through entire range unlike DBs." },
    { name: "Dumbbell Lateral Raise", method: "Dumbbell", sets: 4, reps: "12–15", note: "Slight forward lean, raise arms out to sides. Lead with elbows not wrists. Pinky slightly higher than thumb at top. Lower slowly. Go lighter than you think — most people ego lift here." },
    { name: "Machine Lateral Raise", method: "Machine", sets: 3, reps: "12–15", note: "Adjust pad to elbow height. Press elbows (not wrists) into pads. Raise to shoulder level. Great beginner option as it locks the movement pattern." },
    { name: "Cable Shoulder Press", method: "Cable", sets: 4, reps: "10–12", note: "Set cables low on both sides. Press from ear level up overhead. Cables create a different resistance curve than DBs. Keep core braced throughout." },
  ],
  "Back": [
    { name: "Bodyweight Pull-Up", method: "Bodyweight", sets: 4, reps: "5–8", note: "Hang with arms fully extended. Grip 1.5x shoulder width. Drive elbows down and back as you pull chest toward bar. Squeeze lats at top. Lower fully. If you can't do 5, use an assisted machine or band." },
    { name: "Weighted Pull-Up", method: "Weighted", sets: 4, reps: "5–8", note: "Same as bodyweight pull-up but with a belt or DB between feet. Only add weight once you can comfortably do 3×10 bodyweight. Full ROM is more important than added weight." },
    { name: "Seated Cable Row (V Bar)", method: "V Bar", sets: 3, reps: "8–10", note: "Sit tall, slight lean forward at start. Pull V bar to lower chest/upper abs. Drive elbows back as far as possible. Squeeze shoulder blades together. Don't round your back on the stretch." },
    { name: "Seated Cable Row (Close Grip)", method: "Straight Bar", sets: 3, reps: "8–10", note: "Similar to V bar row but straight bar allows wrists to be neutral or pronated. Focus on driving elbows back and squeezing the mid-back hard at the end position." },
    { name: "Chest-Supported DB Row", method: "Dumbbell", sets: 4, reps: "8–10", note: "Set bench at 30–45°. Lie chest-down. Let DBs hang. Row both up, driving elbows back. Because you're supported there's zero chance of using momentum — pure back work." },
    { name: "Single Arm Cable Row", method: "Cable", sets: 3, reps: "10–12", note: "Stand side-on to cable. Slight torso rotation at start for full stretch. Row back while rotating torso. Allows greater range of motion than two-arm rows." },
    { name: "Wide Grip Lat Pulldown", method: "Straight Bar", sets: 3, reps: "10–12", note: "Grip bar 1.5–2x shoulder width. Slight lean back. Pull bar to upper chest. Drive elbows down toward your hips. Squeeze lats at bottom. Let bar rise fully for maximum stretch." },
    { name: "Close Grip Pulldown (V Bar)", method: "V Bar", sets: 3, reps: "10–12", note: "Narrower grip targets lower lats and adds thickness. Pull to chest, squeeze hard. Let lats fully stretch at top. Keep chest up throughout." },
    { name: "Straight Arm Pulldown", method: "Rope", sets: 3, reps: "12–15", note: "Stand, arms extended in front. Keep elbows soft. Push rope down toward thighs in an arc. Squeeze lats at bottom. No arm bending — this is pure lat isolation. Great finisher." },
    { name: "Smith Machine Row", method: "Smith Machine", sets: 4, reps: "8–10", note: "Bend at hips to ~45°. Grip bar, pull to lower chest. Drive elbows back. Smith path is fixed so focus entirely on feeling the lats contract." },
  ],
  "Biceps": [
    { name: "Barbell Curl", method: "Barbell", sets: 3, reps: "8–10", note: "Stand, underhand grip shoulder width. Curl bar up without swinging. Fully supinate (rotate wrists out) at top. Squeeze bicep hard. Lower in 3 seconds. Keep elbows pinned to sides." },
    { name: "EZ Bar Curl", method: "EZ Bar", sets: 3, reps: "8–10", note: "EZ bar reduces wrist strain vs straight bar. Same technique — slow eccentric, full supination at top. Good option if straight bar causes wrist discomfort." },
    { name: "Cable Curl (Straight Bar)", method: "Straight Bar", sets: 3, reps: "8–10", note: "Cable maintains tension at the top unlike free weights. Stand close to cable. Curl up, squeeze hard at top. Don't let elbows drift forward." },
    { name: "Incline DB Curl", method: "Dumbbell", sets: 4, reps: "10–12", note: "Set bench to 60–70°. Let arms hang behind you — this stretches the long head of the bicep. Curl without swinging the shoulder. Best exercise for long head peak." },
    { name: "Preacher Curl", method: "EZ Bar", sets: 3, reps: "10–12", note: "Arms braced on pad, no cheating possible. Lower slowly for full stretch. Don't fully lock out at bottom — keep tension. Great for beginners to feel the bicep work." },
    { name: "Hammer Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Neutral grip (thumbs up). Curl without rotating wrist. Targets brachialis (under the bicep) and brachioradialis. Adds arm thickness. Arc the DB slightly outward rather than straight up." },
    { name: "Cable Hammer Curl (Rope)", method: "Rope", sets: 3, reps: "10–12", note: "Attach rope to low cable. Hammer grip, curl up. Rope allows wrists to move naturally. Keep elbows pinned. Slow 3-sec lower." },
  ],
  "Triceps": [
    { name: "Cable Overhead Extension (Rope)", method: "Rope", sets: 4, reps: "12–15", note: "Set cable high, face away. Lean forward slightly. Elbows close to head. Extend arms forward/down. Stretches the long head (biggest portion of tricep). Slow eccentric for max growth." },
    { name: "Cable Overhead Extension (Straight Bar)", method: "Straight Bar", sets: 4, reps: "12–15", note: "Same as rope version but straight bar. Slightly more stable. Keep elbows narrow and pointed forward throughout. Don't let them flare out." },
    { name: "Rope Pushdown", method: "Rope", sets: 3, reps: "12–15", note: "Set cable high. Elbows pinned to sides. Push rope down and flare ends outward at bottom for full contraction. Squeeze hard. Slow return. Don't lean forward excessively." },
    { name: "V Bar Pushdown", method: "V Bar", sets: 3, reps: "12–15", note: "Same as rope pushdown but V bar gives a slightly different feel. Elbows stay stationary at sides. Full extension at bottom, controlled eccentric back up." },
    { name: "Straight Bar Pushdown", method: "Straight Bar", sets: 3, reps: "12–15", note: "Overhand grip on straight bar. Elbows locked at sides. Push straight down. Wrists stay neutral. Some people feel this more in the lateral/medial head vs rope which hits all heads." },
    { name: "Single Arm Cable Pushdown", method: "Cuff/Ring", sets: 3, reps: "12–15", note: "One arm at a time allows full focus and addresses imbalances. Keep elbow pinned. Extend fully, hold 1 sec. Use a single handle or cuff attachment." },
    { name: "Dumbbell Overhead Extension", method: "Dumbbell", sets: 3, reps: "12–15", note: "Hold one DB with both hands overhead. Lower behind head slowly, feeling the stretch. Press back up. Keep elbows narrow. Great long head stretch." },
  ],
  "Forearms": [
    { name: "Dumbbell Wrist Curl", method: "Dumbbell", sets: 3, reps: "15–20", note: "Sit, forearms resting on thighs, palms up. Let DB roll to fingertips, then curl wrist up fully. Slow and controlled. Targets forearm flexors. High reps work well here." },
    { name: "Barbell Wrist Curl", method: "Barbell", sets: 3, reps: "15–20", note: "Same as DB version but barbell. Rest forearms on bench or thighs. Full ROM — let bar drop low in hand then curl up. Both wrists work together." },
    { name: "Cable Wrist Curl", method: "Cable", sets: 3, reps: "15–20", note: "Kneel facing low cable. Forearms on thighs, palms up. Curl wrist against cable resistance. Cable maintains constant tension unlike free weights." },
    { name: "EZ Bar Reverse Curl", method: "EZ Bar", sets: 3, reps: "12–15", note: "Overhand grip on EZ bar. Curl bar up while keeping wrists neutral/straight. Targets brachioradialis and forearm extensors. These muscles are often underdeveloped. Keep elbows pinned." },
    { name: "Cable Reverse Curl (Straight Bar)", method: "Straight Bar", sets: 3, reps: "12–15", note: "Overhand grip on straight bar attached to low cable. Curl up, elbows stay pinned. Cable keeps tension at top unlike free weights which lose tension." },
    { name: "Farmer's Carry", method: "Dumbbell", sets: 3, reps: "30–40s", note: "Pick up heavy DBs. Walk in a straight line maintaining upright posture. Builds crushing grip strength and forearm endurance. Go as heavy as possible while maintaining control." },
    { name: "Dead Hang", method: "Bodyweight", sets: 3, reps: "20–30s", note: "Simply hang from a pull-up bar with full grip. Keep shoulders active (don't fully relax into joints). Builds grip, decompresses spine, and stretches lats. Great finisher." },
    { name: "Plate Pinch", method: "Dumbbell", sets: 3, reps: "20–30s", note: "Pinch two plates together with fingers (smooth sides out). Hold for time. Brutal for finger and thumb strength. Start with 2×10lb plates." },
  ],
  "Rear Delts": [
    { name: "Reverse Pec Deck", method: "Machine", sets: 4, reps: "12–15", note: "Face the pec deck facing inward. Set handles at shoulder height. Open arms out wide, squeezing rear delts at peak. Don't use momentum. Rear delts respond best to slow, squeeze-focused reps." },
    { name: "Cable Face Pull (Rope)", method: "Rope", sets: 3, reps: "15–20", note: "Set cable at upper-chest/face height. Pull rope toward face, hands splitting apart as they reach your head. Elbows flare out. Hits rear delts AND external rotators — crucial for shoulder health." },
    { name: "Dumbbell Rear Delt Fly", method: "Dumbbell", sets: 3, reps: "15–20", note: "Lean forward 45–90°. Let DBs hang. Raise arms out to sides with elbows slightly bent. Squeeze rear delts at top. Go light — these are small muscles. Control the eccentric." },
    { name: "Band Pull-Apart", method: "Band", sets: 3, reps: "20–25", note: "Hold band at shoulder height in front. Pull ends apart until arms are fully open. Squeeze rear delts. Easy to do anywhere, great as a warm-up or finisher." },
  ],
  "Traps": [
    { name: "Dumbbell Shrug", method: "Dumbbell", sets: 3, reps: "10–12", note: "Hold heavy DBs at sides. Shrug shoulders straight up toward ears. Hold 1–2 sec at top. Lower slowly. Don't roll shoulders — this adds no benefit and risks injury. Pure up and down." },
    { name: "Barbell Shrug", method: "Barbell", sets: 3, reps: "10–12", note: "Same as DB shrug but you can go heavier. Hold bar in front. Shrug straight up. Keep arms straight throughout. Go heavy with control." },
    { name: "Smith Machine Shrug", method: "Smith Machine", sets: 3, reps: "10–12", note: "Bar in front or behind. Straight up shrug, hold at top. Smith locks the path so you can focus purely on traps." },
    { name: "Cable Shrug", method: "Cable", sets: 3, reps: "12–15", note: "Cable maintains tension at the bottom of the movement unlike free weights. Good as a finisher after barbell shrugs." },
  ],
  "Legs": [
    { name: "Smith Machine Squat", method: "Smith Machine", sets: 4, reps: "6–8", note: "Place feet slightly in front of the bar. This allows more upright torso. Sit deep, knees tracking over toes. Brace core before every rep. Good beginner squat option." },
    { name: "Barbell RDL", method: "Barbell", sets: 4, reps: "8–10", note: "Hinge at hips, pushing them back. Bar slides down legs. Feel hamstring stretch at bottom. Drive hips forward to stand. Keep back flat throughout. Don't go lower than your flexibility allows." },
    { name: "Smith Machine RDL", method: "Smith Machine", sets: 4, reps: "8–10", note: "Same hip hinge pattern as barbell RDL but the fixed bar path makes it easier to learn. Focus on feeling the hamstring stretch. Slightly less hip freedom than free bar." },
    { name: "Leg Press", method: "Machine", sets: 3, reps: "10–15", note: "Medium foot placement. Lower until knees reach ~90°. Don't let knees cave inward. Press through full foot. Never fully lock knees at top. Higher feet = more glutes/hamstrings, lower feet = more quads." },
    { name: "Leg Extension Machine", method: "Machine", sets: 4, reps: "10–12", note: "Adjust pad to ankle. Extend legs fully and hold 1 sec at top — this is the peak contraction for quads. Lower slowly over 3 seconds. Pure quad isolation. Don't swing." },
    { name: "Lying Leg Curl", method: "Machine", sets: 4, reps: "10–12", note: "Lie face down, pad just above ankles. Curl heels toward glutes. Squeeze hard at top. Lower slowly — the eccentric stretch is where growth happens." },
    { name: "Hack Squat", method: "Machine", sets: 4, reps: "8–10", note: "Shoulders under pads, feet shoulder width on platform. Lower until thighs are parallel or below. Drive through heels. Great quad builder with lower back strain than barbell squat." },
    { name: "Dumbbell Goblet Squat", method: "Dumbbell", sets: 3, reps: "12–15", note: "Hold DB at chest. Feet shoulder width. Squat deep, elbows tracking inside knees at bottom. Great for beginners to learn squat mechanics with natural upright torso." },
  ],
  "Calves": [
    { name: "Smith Machine Calf Raise", method: "Smith Machine", sets: 4, reps: "10–12", note: "Toes on edge of plate or step for full ROM. Lower until you feel a deep stretch in the calf. Press all the way up onto tiptoes. Hold 1 sec at top. 2-sec pause at bottom stretch for max growth." },
    { name: "Standing DB Calf Raise", method: "Dumbbell", sets: 4, reps: "12–15", note: "Hold DBs at sides. Raise up onto tiptoes. Go through full range. Full stretch at bottom is key for calf development. Do single leg if you need more challenge." },
    { name: "Seated Calf Raise", method: "Machine", sets: 3, reps: "15–20", note: "Seated version targets the soleus (deeper calf muscle) more than standing raises. Higher reps work well. Full stretch at bottom every rep." },
    { name: "Leg Press Calf Raise", method: "Machine", sets: 3, reps: "15–20", note: "On leg press, place just toes on lower edge of platform. Press through toes for calf raises. Allows very heavy loading. Full stretch at bottom." },
  ],
  "Glutes": [
    { name: "Hip Thrust (Smith Machine)", method: "Smith Machine", sets: 4, reps: "10–12", note: "Upper back on bench, bar across hips (use pad). Drive hips up by squeezing glutes. Hold at top 1–2 sec. Lower controlled. This is the single best glute exercise. Don't hyperextend your lower back at top." },
    { name: "Cable Kickback", method: "Cable", sets: 3, reps: "15–20", note: "Attach cuff to ankle. Face cable, kick leg back and up. Squeeze glute at top. Keep torso stable. Slow, controlled. Isolation movement — go light and feel the muscle." },
    { name: "Bulgarian Split Squat", method: "Dumbbell", sets: 3, reps: "10–12", note: "Rear foot elevated on bench. Front foot forward. Lower down, keeping front shin relatively vertical. Brutal but extremely effective for glutes and quads. Expect soreness." },
    { name: "Sumo Squat", method: "Dumbbell", sets: 3, reps: "12–15", note: "Wide stance, toes pointing out. DB or kettlebell hanging between legs. Squat deep. Wide stance shifts emphasis from quads to inner thighs and glutes." },
  ],
  "Core": [
    { name: "Cable Crunch", method: "Rope", sets: 3, reps: "15–20", note: "Kneel facing cable with rope overhead. Pull rope down, crunching your abs — think elbows to knees. This is a resistance exercise for abs, not a stretch. Squeeze hard at bottom." },
    { name: "Hanging Leg Raise", method: "Bodyweight", sets: 3, reps: "10–15", note: "Hang from bar. Raise legs to 90° or higher. Control the lower — don't swing. Targets lower abs. If too hard, bend knees to make it easier." },
    { name: "Plank", method: "Bodyweight", sets: 3, reps: "30–60s", note: "Forearms and toes. Body in a straight line. Brace abs as if about to take a punch. Don't let hips sag or pike up. Breathe steadily throughout." },
    { name: "Ab Wheel Rollout", method: "Bodyweight", sets: 3, reps: "8–12", note: "Start on knees. Roll wheel forward, extending body. Stop before your lower back arches. Pull back using abs. One of the hardest and most effective core exercises." },
  ],
};

const EX_GROUPS: Record<string, string[]> = {
  "Chest Press": ["Incline Dumbbell Press", "Flat Dumbbell Press", "Smith Machine Incline Press", "Cable Chest Press"],
  "Chest Fly": ["Cable Fly Low-to-High", "Cable Fly High-to-Low", "Pec Deck Fly"],
  "Shoulder Press": ["Dumbbell Shoulder Press", "Smith Machine Shoulder Press", "Cable Shoulder Press"],
  "Lateral Raise": ["Cable Lateral Raise", "Dumbbell Lateral Raise", "Machine Lateral Raise"],
  "Rear Delt": ["Reverse Pec Deck", "Cable Face Pull (Rope)", "Dumbbell Rear Delt Fly", "Band Pull-Apart"],
  "Face Pull": ["Cable Face Pull (Rope)"],
  "Pull-Up": ["Bodyweight Pull-Up", "Weighted Pull-Up", "Wide Grip Lat Pulldown", "Close Grip Pulldown (V Bar)"],
  "Row (Horizontal)": ["Seated Cable Row (V Bar)", "Seated Cable Row (Close Grip)", "Chest-Supported DB Row", "Single Arm Cable Row", "Smith Machine Row"],
  "Deadlift": ["Smith Machine RDL", "Barbell RDL"],
  "Pulldown": ["Wide Grip Lat Pulldown", "Close Grip Pulldown (V Bar)", "Straight Arm Pulldown"],
  "Shrug": ["Dumbbell Shrug", "Barbell Shrug", "Smith Machine Shrug", "Cable Shrug"],
  "Bicep Curl": ["Barbell Curl", "EZ Bar Curl", "Cable Curl (Straight Bar)", "Incline DB Curl", "Preacher Curl"],
  "Hammer Curl": ["Hammer Curl", "Cable Hammer Curl (Rope)"],
  "Tricep Pushdown": ["Rope Pushdown", "V Bar Pushdown", "Straight Bar Pushdown", "Single Arm Cable Pushdown"],
  "Overhead Tricep Extension": ["Cable Overhead Extension (Rope)", "Cable Overhead Extension (Straight Bar)", "Dumbbell Overhead Extension"],
  "Wrist Curl": ["Dumbbell Wrist Curl", "Barbell Wrist Curl", "Cable Wrist Curl"],
  "Reverse Curl": ["EZ Bar Reverse Curl", "Cable Reverse Curl (Straight Bar)"],
  "Grip/Carry": ["Farmer's Carry", "Plate Pinch", "Dead Hang"],
  "Squat": ["Smith Machine Squat", "Dumbbell Goblet Squat", "Leg Press", "Hack Squat"],
  "Leg Curl": ["Lying Leg Curl", "Smith Machine RDL", "Barbell RDL"],
  "Leg Extension": ["Leg Extension Machine", "Hack Squat"],
  "Calf Raise": ["Smith Machine Calf Raise", "Standing DB Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise"],
};

function getExInfo(name: string): ExerciseDBItem | null {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/rope|smithmachine|smith|dumbbell|barbell|machine|cable|straightbar|vbar/g, "");

  const cleanName = clean(name || "");

  // First try exact match
  for (const group of Object.values(EXERCISE_DB)) {
    const found = group.find((e) => e.name.toLowerCase() === (name || "").toLowerCase());
    if (found) return found;
  }

  // Then try normalized match where one contains another or clean version matches
  let bestMatch: ExerciseDBItem | null = null;
  for (const group of Object.values(EXERCISE_DB)) {
    for (const e of group) {
      const dbClean = clean(e.name);
      if (dbClean && cleanName && (dbClean === cleanName || cleanName.includes(dbClean) || dbClean.includes(cleanName))) {
        bestMatch = e;
      }
    }
  }
  return bestMatch;
}

function findGroupForExercise(name: string): string {
  for (const [group, names] of Object.entries(EX_GROUPS)) {
    if (names.includes(name)) {
      return group;
    }
  }
  return "Custom";
}

const ALL_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_TYPES = [
  "Push",
  "Pull",
  "Legs",
  "Shoulders & Arms",
  "Back & Rear Delts",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Arms",
  "Custom"
];

const MUSCLE_LIST = [
  "Chest",
  "Lats",
  "Upper Back",
  "Front Delts",
  "Side Delts",
  "Rear Delts",
  "Biceps",
  "Brachialis",
  "Triceps",
  "Forearms",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs"
];

const EXERCISE_MUSCLE_MAPPING: Record<string, string[]> = {
  // Chest
  "Incline Dumbbell Press": ["Chest", "Front Delts"],
  "Flat Dumbbell Press": ["Chest"],
  "Incline Chest Press": ["Chest"],
  "Incline Dumbbell/Smith Press": ["Chest", "Front Delts"],
  "Smith Machine Incline Press": ["Chest", "Front Delts"],
  "Cable Fly Low-to-High": ["Chest"],
  "Cable Fly High-to-Low": ["Chest"],
  "Low-to-High Cable Fly": ["Chest"],
  "Pec Deck Fly": ["Chest"],
  "Cable Chest Press": ["Chest"],
  // Shoulders
  "Dumbbell Shoulder Press": ["Front Delts"],
  "Overhead Dumbbell Press": ["Front Delts"],
  "Smith Machine Shoulder Press": ["Front Delts"],
  "Cable Shoulder Press": ["Front Delts"],
  "Cable Lateral Raise": ["Side Delts"],
  "Dumbbell Lateral Raise": ["Side Delts"],
  "Machine Lateral Raise": ["Side Delts"],
  // Back
  "Bodyweight Pull-Up": ["Lats", "Upper Back"],
  "Weighted Pull-Up": ["Lats", "Upper Back"],
  "Wide-Grip Lat Pulldown": ["Lats"],
  "Wide Grip Lat Pulldown": ["Lats"],
  "Close Grip Pulldown (V Bar)": ["Lats"],
  "Straight-Arm Pulldown": ["Lats"],
  "Straight Arm Pulldown": ["Lats"],
  "Seated Cable Row (V Bar)": ["Upper Back"],
  "Seated Cable Row (Close Grip)": ["Upper Back"],
  "Close-Grip Cable Row": ["Upper Back"],
  "Wide-Grip Cable Row": ["Upper Back"],
  "Chest-Supported DB Row": ["Upper Back"],
  "Single Arm Cable Row": ["Upper Back"],
  "Smith Machine Row": ["Upper Back"],
  // Rear Delts / Traps
  "Reverse Pec Deck": ["Rear Delts"],
  "Reverse Pec Deck Fly": ["Rear Delts"],
  "Cable Face Pull (Rope)": ["Rear Delts"],
  "Face Pull": ["Rear Delts"],
  "Dumbbell Rear Delt Fly": ["Rear Delts"],
  "Band Pull-Apart": ["Rear Delts"],
  "Dumbbell Shrug": ["Upper Back"],
  "Barbell Shrug": ["Upper Back"],
  "Smith Machine Shrug": ["Upper Back"],
  "Cable Shrug": ["Upper Back"],
  // Biceps / Brachialis
  "Barbell Curl": ["Biceps"],
  "EZ Bar Curl": ["Biceps"],
  "Cable Curl (Straight Bar)": ["Biceps"],
  "Cable Curl": ["Biceps"],
  "Incline DB Curl": ["Biceps"],
  "Incline Dumbbell Curl": ["Biceps"],
  "Preacher Curl": ["Biceps"],
  "Hammer Curl": ["Brachialis"],
  "Cable Hammer Curl (Rope)": ["Brachialis"],
  "EZ Bar Reverse Curl": ["Brachialis"],
  "Cable Reverse Curl (Straight Bar)": ["Brachialis"],
  "Cable Reverse Curl": ["Brachialis"],
  // Triceps
  "Cable Overhead Extension (Rope)": ["Triceps"],
  "Cable Overhead Extension (Straight Bar)": ["Triceps"],
  "Rope Overhead Triceps Extension": ["Triceps"],
  "Dumbbell Overhead Extension": ["Triceps"],
  "Rope Pushdown": ["Triceps"],
  "V Bar Pushdown": ["Triceps"],
  "Straight Bar Pushdown": ["Triceps"],
  "Straight Bar Triceps Pushdown": ["Triceps"],
  "Single Arm Cable Pushdown": ["Triceps"],
  // Forearms
  "Dumbbell Wrist Curl": ["Forearms"],
  "Barbell Wrist Curl": ["Forearms"],
  "Cable Wrist Curl": ["Forearms"],
  "Reverse Wrist Curl": ["Forearms"],
  "Wrist Curl": ["Forearms"],
  "Farmer's Carry": ["Forearms"],
  "Dead Hang": ["Forearms"],
  "Plate Pinch": ["Forearms"],
  // Legs
  "Smith Machine Squat": ["Quads", "Glutes"],
  "Squat (Barbell/Smith)": ["Quads", "Hamstrings", "Glutes"],
  "Barbell RDL": ["Hamstrings", "Glutes"],
  "Smith Machine RDL": ["Hamstrings", "Glutes"],
  "Leg Press": ["Quads", "Glutes"],
  "Hack Squat": ["Quads", "Glutes"],
  "Leg Extension Machine": ["Quads"],
  "Leg Extension": ["Quads"],
  "Dumbbell Goblet Squat": ["Quads", "Glutes"],
  "Lying Leg Curl": ["Hamstrings"],
  "Leg Curl": ["Hamstrings"],
  "Sumo Squat": ["Glutes"],
  "Bulgarian Split Squat": ["Quads", "Glutes"],
  "Hip Thrust (Smith Machine)": ["Glutes"],
  "Cable Kickback": ["Glutes"],
  "Calf Raise": ["Calves"],
  "Smith Machine Calf Raise": ["Calves"],
  "Standing DB Calf Raise": ["Calves"],
  "Seated Calf Raise": ["Calves"],
  "Leg Press Calf Raise": ["Calves"],
  // Abs
  "Cable Crunch": ["Abs"],
  "Hanging Leg Raise": ["Abs"],
  "Plank": ["Abs"],
  "Ab Wheel Rollout": ["Abs"]
};

function getMusclesForExercise(ex: any): string[] {
  if (ex.muscles && ex.muscles.length > 0) {
    return ex.muscles;
  }
  const mapping = EXERCISE_MUSCLE_MAPPING[ex.name];
  if (mapping && mapping.length > 0) {
    return mapping;
  }
  if (ex.group) {
    const grp = ex.group.toLowerCase();
    const name = ex.name.toLowerCase();
    if (grp.includes("chest") || grp.includes("press") && (grp.includes("chest") || name.includes("chest"))) return ["Chest"];
    if (grp.includes("pulldown") || grp.includes("pull-up") || grp.includes("lat")) return ["Lats"];
    if (grp.includes("row")) return ["Upper Back"];
    if (grp.includes("lateral") || grp.includes("lateral raise")) return ["Side Delts"];
    if (grp.includes("shoulder press")) return ["Front Delts"];
    if (grp.includes("rear") || grp.includes("face pull")) return ["Rear Delts"];
    if (grp.includes("bicep") || grp.includes("curl")) {
      if (name.includes("hammer") || name.includes("reverse")) return ["Brachialis"];
      return ["Biceps"];
    }
    if (grp.includes("tricep") || grp.includes("extension") || grp.includes("pushdown")) return ["Triceps"];
    if (grp.includes("wrist") || grp.includes("forearm")) return ["Forearms"];
    if (grp.includes("squat") || grp.includes("extension")) return ["Quads"];
    if (grp.includes("curl") && grp.includes("leg")) return ["Hamstrings"];
    if (grp.includes("deadlift") || grp.includes("rdl")) return ["Hamstrings", "Glutes"];
    if (grp.includes("calf")) return ["Calves"];
    if (grp.includes("abs") || grp.includes("crunch") || grp.includes("core")) return ["Abs"];
  }
  return [];
}

function getVolumeStatus(sets: number) {
  if (sets === 0) {
    return {
      label: "None",
      colorClass: "bg-zinc-850 text-zinc-500",
      textClass: "text-zinc-600",
      borderClass: "border-zinc-900/40",
      barColor: "bg-zinc-800/40"
    };
  }
  if (sets >= 1 && sets <= 5) {
    return {
      label: "Maintenance",
      colorClass: "bg-sky-500/10 text-sky-400",
      textClass: "text-sky-400",
      borderClass: "border-sky-500/20",
      barColor: "bg-sky-500"
    };
  }
  if (sets >= 6 && sets <= 9) {
    return {
      label: "Moderate",
      colorClass: "bg-amber-500/10 text-amber-400",
      textClass: "text-amber-400",
      borderClass: "border-amber-500/20",
      barColor: "bg-amber-500"
    };
  }
  if (sets >= 10 && sets <= 20) {
    return {
      label: "Optimal",
      colorClass: "bg-emerald-500/10 text-emerald-400",
      textClass: "text-emerald-400",
      borderClass: "border-emerald-500/20",
      barColor: "bg-emerald-500"
    };
  }
  return {
    label: "Very High",
    colorClass: "bg-rose-500/10 text-rose-400",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/20",
    barColor: "bg-rose-500"
  };
}

const defaultPlan = [
  {
    day: "Sat",
    label: "Pull",
    focus: "Back · Biceps · Forearms",
    color: "#3F7DE8",
    accent: "#5490ff",
    exercises: [
      { id: 1, name: "Close-Grip Cable Row", group: "Row (Horizontal)", method: "Cable", sets: 4, reps: "10–12", note: "Keep torso upright, pull handle to lower sternum, drive elbows back and squeeze shoulder blades." },
      { id: 2, name: "Wide-Grip Lat Pulldown", group: "Pulldown", method: "Straight Bar", sets: 4, reps: "6–10", note: "Pull bar down to upper chest, drive elbows down, do not swing torso. Squeeze lats at bottom." },
      { id: 3, name: "Straight-Arm Pulldown", group: "Pulldown", method: "Rope", sets: 4, reps: "10–15", note: "Keep arms straight with a soft bend in elbows, pull with lats down to hips. Stretch lats at the top." },
      { id: 4, name: "Face Pull", group: "Face Pull", method: "Rope", sets: 3, reps: "10–15", note: "Pull rope to forehead/ears, flaring elbows out and squeezing rear delts and upper traps." },
      { id: 5, name: "Cable Curl", group: "Bicep Curl", method: "Cable", sets: 3, reps: "10–12", note: "Keep elbows pinned to sides, squeeze biceps fully at the top contraction. Control the lower." },
      { id: 6, name: "Hammer Curl", group: "Hammer Curl", method: "Dumbbell", sets: 4, reps: "10–12", note: "Neutral grip (thumbs up), targets brachialis & brachioradialis for overall arm thickness." },
      { id: 7, name: "Cable Wrist Curl", group: "Wrist Curl", method: "Cable", sets: 3, reps: "15–20", note: "Support forearms on thighs, let weight roll down fingers, then curl wrist up against resistance." }
    ]
  },
  {
    day: "Sun",
    label: "Push",
    focus: "Chest · Shoulders · Triceps",
    color: "#E8533F",
    accent: "#ff6b54",
    exercises: [
      { id: 8, name: "Overhead Dumbbell Press", group: "Shoulder Press", method: "Dumbbell", sets: 3, reps: "6–10", note: "Press vertically overhead, brace core, control the descent down to ear-level. Don't arch lower back." },
      { id: 9, name: "Incline Chest Press", group: "Chest Press", method: "Dumbbell", sets: 4, reps: "6–10", note: "30-45 degree incline. Drive dumbbells up and slightly inward over upper chest. Squeeze chest." },
      { id: 10, name: "Cable Lateral Raise", group: "Lateral Raise", method: "Cable", sets: 4, reps: "15–20", note: "Raise hand out to side, slightly in front of body line, lead with elbow to isolate side delts." },
      { id: 11, name: "Low-to-High Cable Fly", group: "Chest Fly", method: "Cable", sets: 4, reps: "10–15", note: "Set cables low, press up and inward in a hugging motion to activate upper chest fibers." },
      { id: 12, name: "Rope Overhead Triceps Extension", group: "Overhead Tricep Extension", method: "Rope", sets: 3, reps: "10–15", note: "Keep elbows pointing forward, extend arms overhead fully, focus on long head deep stretch." },
      { id: 13, name: "Straight Bar Triceps Pushdown", group: "Tricep Pushdown", method: "Straight Bar", sets: 3, reps: "10–15", note: "Press bar down to hips, lock elbows out, do not lean excessively. Keep elbows pinned." }
    ]
  },
  {
    day: "Tue",
    label: "Shoulders + Arms",
    focus: "Shoulders · Arms",
    color: "#9B3FE8",
    accent: "#b55fff",
    exercises: [
      { id: 14, name: "Dumbbell Lateral Raise", group: "Lateral Raise", method: "Dumbbell", sets: 3, reps: "10–15", note: "Slight forward lean, raise dumbbells out to sides to shoulder level. Lead with elbows." },
      { id: 15, name: "Cable Lateral Raise", group: "Lateral Raise", method: "Cable", sets: 4, reps: "10–15", note: "Raise hand out to side, slightly in front of body line, lead with elbow to isolate side delts." },
      { id: 16, name: "Cable Curl", group: "Bicep Curl", method: "Cable", sets: 3, reps: "10–12", note: "Keep elbows pinned to sides, squeeze biceps fully at the top contraction. Control the lower." },
      { id: 17, name: "Incline Dumbbell Curl", group: "Bicep Curl", method: "Dumbbell", sets: 3, reps: "8–12", note: "Incline bench at 45-60 degrees. Keep elbows back to isolate the bicep long head stretch." },
      { id: 18, name: "Cable Reverse Curl", group: "Reverse Curl", method: "Cable", sets: 3, reps: "10–12", note: "Overhand grip, targets brachioradialis and forearm extensors. Control the descent." },
      { id: 19, name: "Rope Overhead Triceps Extension", group: "Overhead Tricep Extension", method: "Rope", sets: 3, reps: "10–15", note: "Keep elbows pointing forward, extend arms overhead fully, focus on long head deep stretch." },
      { id: 20, name: "Straight Bar Triceps Pushdown", group: "Tricep Pushdown", method: "Straight Bar", sets: 3, reps: "10–15", note: "Press bar down to hips, lock elbows out, do not lean excessively. Keep elbows pinned." },
      { id: 21, name: "Cable Wrist Curl", group: "Wrist Curl", method: "Cable", sets: 3, reps: "15–20", note: "Support forearms on thighs, let weight roll down fingers, then curl wrist up against resistance." }
    ]
  },
  {
    day: "Thu",
    label: "Chest + Back",
    focus: "Chest · Back",
    color: "#E8A63F",
    accent: "#f5b94e",
    exercises: [
      { id: 22, name: "Incline Dumbbell/Smith Press", group: "Chest Press", method: "Dumbbell", sets: 4, reps: "6–8", note: "Set bench to 30-45 degrees, lower slowly to upper chest, press up in a controlled arc." },
      { id: 23, name: "Pec Deck Fly", group: "Chest Fly", method: "Machine", sets: 3, reps: "10–15", note: "Keep slight bend in elbows, squeeze inner chest fully at the middle contraction. Don't let stack rest." },
      { id: 24, name: "Wide-Grip Lat Pulldown", group: "Pulldown", method: "Straight Bar", sets: 3, reps: "6–10", note: "Pull bar down to upper chest, drive elbows down, do not swing torso. Squeeze lats at bottom." },
      { id: 25, name: "Wide-Grip Cable Row", group: "Row (Horizontal)", method: "Cable", sets: 4, reps: "10–12", note: "Pull wide bar to upper abdomen, flare elbows slightly to target upper back and rear delts." },
      { id: 26, name: "Straight-Arm Pulldown", group: "Pulldown", method: "Rope", sets: 4, reps: "10–15", note: "Keep arms straight with a soft bend in elbows, pull with lats down to hips. Stretch lats at the top." },
      { id: 27, name: "Low-to-High Cable Fly", group: "Chest Fly", method: "Cable", sets: 4, reps: "10–15", note: "Set cables low, press up and inward in a hugging motion to activate upper chest fibers." }
    ]
  },
  {
    day: "Fri",
    label: "Shoulders + Legs + Abs + Forearms",
    focus: "Shoulders · Legs · Abs · Forearms",
    color: "#2EAD6B",
    accent: "#3dc97d",
    exercises: [
      { id: 28, name: "Dumbbell Lateral Raise", group: "Lateral Raise", method: "Dumbbell", sets: 3, reps: "10–15", note: "Slight forward lean, raise dumbbells out to sides to shoulder level. Lead with elbows." },
      { id: 29, name: "Cable Lateral Raise", group: "Lateral Raise", method: "Cable", sets: 4, reps: "10–15", note: "Raise hand out to side, slightly in front of body line, lead with elbow to isolate side delts." },
      { id: 30, name: "Reverse Pec Deck Fly", group: "Rear Delt", method: "Machine", sets: 4, reps: "10–15", note: "Pull arms back horizontally, squeeze rear delts, avoid shrugging traps to isolate rear shoulders." },
      { id: 31, name: "Leg Extension", group: "Leg Extension", method: "Machine", sets: 3, reps: "10–15", note: "Adjust pad to ankles, point toes straight, pause for 1-sec at full knee lockout for max quad contraction." },
      { id: 32, name: "Leg Curl", group: "Leg Curl", method: "Machine", sets: 3, reps: "10–12", note: "Keep hips pressed flat against pad, curl heels to glutes, feel the stretch during the slow negative." },
      { id: 33, name: "Squat (Barbell/Smith)", group: "Squat", method: "Barbell", sets: 3, reps: "8–10", note: "Push hips back, descend until thighs are parallel or lower, keep chest up and drive through heels." },
      { id: 34, name: "Calf Raise", group: "Calf Raise", method: "Machine", sets: 4, reps: "10–15", note: "Full stretch at bottom for 2 seconds, drive up on balls of feet, hold peak squeeze for 1 second." },
      { id: 35, name: "Cable Crunch", group: "Core", method: "Rope", sets: 3, reps: "10–15", note: "Kneeling facing cable, crunch down using abs to bring elbows to thighs. Squeeze core at bottom." },
      { id: 36, name: "Reverse Wrist Curl", group: "Wrist Curl", method: "Cable", sets: 3, reps: "15–20", note: "Curl knuckles upward to target wrist extensors, support forearms on bench/thighs." },
      { id: 37, name: "Wrist Curl", group: "Wrist Curl", method: "Barbell", sets: 3, reps: "15–20", note: "Curl palms upward to target wrist flexors, let bar/DB roll down to fingers for full stretch." }
    ]
  }
];

function ReorderableExerciseItem({
  ex,
  i,
  activeDay,
  checked,
  cur,
  last,
  exInfo,
  updateChecked,
  setSwapEx,
  setEditEx,
  handleOpenLog,
  delEx
}: {
  ex: any;
  i: number;
  activeDay: number;
  checked: Record<string, boolean>;
  cur: any;
  last: any;
  exInfo: any;
  updateChecked: any;
  setSwapEx: any;
  setEditEx: any;
  handleOpenLog: any;
  delEx: any;
}) {
  const dragControls = useDragControls();
  const ck = `${activeDay}-${i}`;
  const done = checked[ck];

  return (
    <Reorder.Item
      value={ex}
      dragListener={false}
      dragControls={dragControls}
      className={`transition-all duration-200 select-none ${
        done ? "bg-zinc-950/30" : "hover:bg-zinc-900/20"
      }`}
    >
      <div className="p-5 flex gap-4 items-start">
        {/* Drag handle (≡) icon so it's obvious */}
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          className="p-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0 select-none mt-1"
          title="Drag to reorder"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </div>

        {/* Custom Animated Checkbox */}
        <button
          onClick={() => updateChecked({ ...checked, [ck]: !checked[ck] })}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all duration-150 cursor-pointer ${
            done
              ? "border-transparent text-white"
              : "border-zinc-800 hover:border-zinc-700"
          }`}
          style={{ backgroundColor: done ? cur.color : "transparent" }}
        >
          {done && <Check className="w-3.5 h-3.5 font-black" />}
        </button>

        {/* Exercise Meta */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-start gap-3">
            <h3
              className={`text-sm md:text-base font-bold tracking-tight leading-snug truncate ${
                done ? "text-zinc-600 line-through" : "text-zinc-100"
              }`}
            >
              {ex.name}
            </h3>
            <span
              className={`text-sm font-black flex-shrink-0 ${
                done ? "text-zinc-600" : ""
              }`}
              style={{ color: done ? undefined : cur.accent }}
            >
              {ex.sets}×{ex.reps}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center pt-0.5">
            <span
              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${cur.color}15`,
                color: cur.accent
              }}
            >
              {ex.method}
            </span>

            {last && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-md border border-emerald-500/10">
                Last: {last.weight ? `${last.weight}kg · ` : ""}{last.sets}×{last.reps}
              </span>
            )}

            {/* Target Muscles Badge */}
            {getMusclesForExercise(ex).map((m) => (
              <span
                key={m}
                className="text-[9px] font-semibold bg-violet-500/5 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/10 uppercase"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Micro actions toolbar */}
      <div className="flex gap-1.5 pb-4 px-5 pl-14 flex-wrap">
        <button
          onClick={() => setSwapEx({ di: activeDay, ei: i })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/40 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Swap</span>
        </button>
        <button
          onClick={() => setEditEx({ di: activeDay, ei: i })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/40 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => handleOpenLog(activeDay, i)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/40 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Log Set</span>
        </button>
        <button
          onClick={() => delEx(activeDay, i)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-[11px] font-bold text-red-400 hover:text-red-300 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function WorkoutPlanner() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeDay, setActiveDay] = useState(0);
  const [screen, setScreen] = useState<"workout" | "progress">("workout");
  const [toast, setToast] = useState("");

  // Modals
  const [swapEx, setSwapEx] = useState<{ di: number; ei: number } | null>(null);
  const [editEx, setEditEx] = useState<{ di: number; ei: number } | null>(null);
  const [logEx, setLogEx] = useState<{ di: number; ei: number } | null>(null);
  const [addExModal, setAddExModal] = useState<{ di: number; step: "muscle" | "exercise"; muscle: string | null } | null>(null);
  const [dayModal, setDayModal] = useState(false);

  // Custom Exercise creation inside ChoiceModal
  const [showCustomCreate, setShowCustomCreate] = useState(false);
  const [customExName, setCustomExName] = useState("");
  const [customExMethod, setCustomExMethod] = useState("Dumbbell");
  const [customExSets, setCustomExSets] = useState(3);
  const [customExReps, setCustomExReps] = useState("10–12");
  const [customExNote, setCustomExNote] = useState("");

  // Logging values
  interface LogInSet {
    setNum: number;
    weight: string;
    reps: string;
    rpe: string;
    logged: boolean;
  }
  const [logIn, setLogIn] = useState<{ sets: LogInSet[] }>({ sets: [] });

  const getWeeklyVolume = () => {
    const volume: Record<string, number> = {};
    for (const m of MUSCLE_LIST) {
      volume[m] = 0;
    }
    for (const d of plan) {
      if (d.exercises) {
        for (const ex of d.exercises) {
          const sets = parseInt(ex.sets) || 0;
          const muscles = getMusclesForExercise(ex);
          for (const m of muscles) {
            if (volume[m] !== undefined) {
              volume[m] += sets;
            }
          }
        }
      }
    }
    return volume;
  };

  const sortPlanByDays = (p: any[]) => {
    return [...p].sort((a, b) => ALL_DAYS.indexOf(a.day) - ALL_DAYS.indexOf(b.day));
  };

  // Load from browser localStorage safely
  useEffect(() => {
    const savedPlan = localStorage.getItem("wp-plan");
    const savedProgress = localStorage.getItem("wp-progress");
    const savedChecked = localStorage.getItem("wp-checked");
    const savedLastDate = localStorage.getItem("wp-last-checked-date");

    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const initialPlan = savedPlan ? JSON.parse(savedPlan) : defaultPlan;
    const sortedPlan = sortPlanByDays(initialPlan);

    setPlan(sortedPlan);
    setProgress(savedProgress ? JSON.parse(savedProgress) : {});

    if (savedLastDate && savedLastDate !== todayStr) {
      // It's a new day! Clear the checked status
      setChecked({});
      localStorage.setItem("wp-checked", JSON.stringify({}));
      localStorage.setItem("wp-last-checked-date", todayStr);
    } else {
      setChecked(savedChecked ? JSON.parse(savedChecked) : {});
      localStorage.setItem("wp-last-checked-date", todayStr);
    }
    setMounted(true);
  }, []);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const updatePlan = (newPlan: any[]) => {
    const sorted = sortPlanByDays(newPlan);
    setPlan(sorted);
    localStorage.setItem("wp-plan", JSON.stringify(sorted));
  };

  const updateChecked = (newChecked: Record<string, boolean>) => {
    setChecked(newChecked);
    localStorage.setItem("wp-checked", JSON.stringify(newChecked));
    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    localStorage.setItem("wp-last-checked-date", todayStr);
  };

  const updateProgress = (newProgress: Record<string, any>) => {
    setProgress(newProgress);
    localStorage.setItem("wp-progress", JSON.stringify(newProgress));
  };

  const updEx = (di: number, ei: number, fields: any) => {
    const updated = plan.map((d, i) => {
      if (i !== di) return d;
      return {
        ...d,
        exercises: d.exercises.map((e: any, j: number) => (j !== ei ? e : { ...e, ...fields }))
      };
    });
    updatePlan(updated);
  };

  const delEx = (di: number, ei: number) => {
    const updated = plan.map((d, i) => {
      if (i !== di) return d;
      return {
        ...d,
        exercises: d.exercises.filter((_: any, j: number) => j !== ei)
      };
    });
    updatePlan(updated);
    showToast("Removed exercise");
  };

  const addExToDay = (di: number, exObj: any) => {
    const groupName = findGroupForExercise(exObj.name);
    const newE = {
      id: Date.now(),
      name: exObj.name,
      group: groupName,
      method: exObj.method || "Cable",
      sets: exObj.sets || 3,
      reps: exObj.reps || "10–12",
      note: exObj.note || ""
    };

    const updated = plan.map((d, i) => {
      if (i !== di) return d;
      return {
        ...d,
        exercises: [...d.exercises, newE]
      };
    });
    updatePlan(updated);
    setAddExModal(null);
    showToast("Added exercise ✓");
  };

  const handleOpenLog = (di: number, ei: number) => {
    const ex = plan[di].exercises[ei];
    const key = `${di}-${ex.id}`;
    const sessions = progress[key] || [];
    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const todaySession = sessions.find((s: any) => s.date === todayStr);

    // Initialize all slots of size ex.sets
    const initialSets = Array.from({ length: ex.sets }).map((_, si) => {
      const existingSet = todaySession?.sets?.find((s: any) => s.setNum === si + 1);
      if (existingSet) {
        return {
          setNum: si + 1,
          weight: existingSet.weight || "",
          reps: existingSet.reps || "",
          rpe: existingSet.rpe || "",
          logged: true
        };
      } else {
        return {
          setNum: si + 1,
          weight: "",
          reps: "",
          rpe: "",
          logged: false
        };
      }
    });

    setLogIn({ sets: initialSets });
    setLogEx({ di, ei });
  };

  const handleLogSet = (si: number) => {
    if (!logEx) return;
    const { di, ei } = logEx;
    const ex = plan[di].exercises[ei];
    const key = `${di}-${ex.id}`;
    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const currentSets = [...logIn.sets];
    const currentSet = currentSets[si];

    // Mark as logged in state
    currentSets[si] = { ...currentSet, logged: true };
    setLogIn({ sets: currentSets });

    const setEntry = {
      setNum: si + 1,
      weight: currentSet.weight || "",
      reps: currentSet.reps || ex.reps,
      rpe: currentSet.rpe || "",
      date: todayStr,
      exName: ex.name,
      dayLabel: plan[di].label
    };

    const sessions = [...(progress[key] || [])];
    const existingSessionIdx = sessions.findIndex((s: any) => s.date === todayStr);

    if (existingSessionIdx >= 0) {
      const existingSets = [...(sessions[existingSessionIdx].sets || [])];
      const existingSetIdx = existingSets.findIndex((s: any) => s.setNum === si + 1);

      if (existingSetIdx >= 0) {
        existingSets[existingSetIdx] = setEntry;
      } else {
        existingSets.push(setEntry);
      }
      existingSets.sort((a, b) => a.setNum - b.setNum);

      sessions[existingSessionIdx] = {
        ...sessions[existingSessionIdx],
        sets: existingSets
      };
    } else {
      sessions.push({
        type: "session",
        date: todayStr,
        exName: ex.name,
        dayLabel: plan[di].label,
        sets: [setEntry]
      });
    }

    const newProgress = {
      ...progress,
      [key]: sessions
    };
    updateProgress(newProgress);
    showToast(`Set ${si + 1} logged successfully ✓`);
  };

  const handleSwap = (di: number, ei: number, targetName: string) => {
    const exInfo = getExInfo(targetName);
    const groupName = findGroupForExercise(targetName);
    if (exInfo) {
      updEx(di, ei, {
        name: exInfo.name,
        group: groupName,
        method: exInfo.method,
        sets: exInfo.sets,
        reps: exInfo.reps,
        note: exInfo.note
      });
    } else {
      updEx(di, ei, { name: targetName, group: groupName });
    }
    setSwapEx(null);
    showToast("Exercise swapped ✓");
  };

  const lastLog = (di: number, ei: number) => {
    const ex = plan?.[di]?.exercises[ei];
    if (!ex) return null;
    const sessions = progress[`${di}-${ex.id}`];
    if (!sessions || sessions.length === 0) return null;

    const last = sessions[sessions.length - 1];
    if (!last || !last.sets || last.sets.length === 0) return null;

    const best = last.sets.reduce(
      (a: any, b: any) => (parseFloat(b.weight || 0) >= parseFloat(a.weight || 0) ? b : a),
      last.sets[0]
    );

    return {
      date: last.date,
      weight: best.weight,
      sets: last.sets.length,
      reps: best.reps
    };
  };

  const addDay = (dayLabel: string, dayType: string) => {
    const colors = ["#E8533F", "#3F7DE8", "#2EAD6B", "#9B3FE8", "#E8A63F", "#E83F7D", "#3FE8C8"];
    const accents = ["#ff6b54", "#5490ff", "#3dc97d", "#b55fff", "#f5b94e", "#ff5490", "#4ffff0"];
    const ci = (plan?.length || 0) % colors.length;

    const activeDayCode = plan[activeDay]?.day;
    const updated = [
      ...plan,
      {
        day: dayLabel,
        label: dayType,
        focus: "",
        color: colors[ci],
        accent: accents[ci],
        exercises: []
      }
    ];
    const sorted = sortPlanByDays(updated);
    updatePlan(sorted);

    // Find where the active day went
    const newActiveIdx = sorted.findIndex((d) => d.day === activeDayCode);
    if (newActiveIdx !== -1) {
      setActiveDay(newActiveIdx);
    } else {
      const addedIdx = sorted.findIndex((d) => d.day === dayLabel);
      if (addedIdx !== -1) setActiveDay(addedIdx);
    }
    showToast(`${dayLabel} — ${dayType} added`);
  };

  const removeDay = (di: number) => {
    const updated = plan.filter((_, i) => i !== di);
    updatePlan(updated);
    setActiveDay(0);
    showToast("Day removed");
  };

  const moveDay = (di: number, newDayLabel: string) => {
    const activeDayCode = plan[activeDay]?.day;
    const updated = plan.map((d, i) => (i !== di ? d : { ...d, day: newDayLabel }));
    const sorted = sortPlanByDays(updated);
    updatePlan(sorted);

    // Find where the active day went
    const newActiveIdx = sorted.findIndex((d) => d.day === activeDayCode) !== -1 
      ? sorted.findIndex((d) => d.day === activeDayCode)
      : sorted.findIndex((d) => d.day === newDayLabel);
    if (newActiveIdx !== -1) {
      setActiveDay(newActiveIdx);
    }
    showToast(`Moved to ${newDayLabel} ✓`);
  };

  const handleCreateCustomExercise = () => {
    if (!customExName.trim() || !addExModal) return;
    const newEx = {
      name: customExName,
      method: customExMethod,
      sets: customExSets,
      reps: customExReps,
      note: customExNote
    };
    addExToDay(addExModal.di, newEx);
    // Reset Form
    setCustomExName("");
    setCustomExNote("");
    setShowCustomCreate(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#09090c] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <div className="text-zinc-500 text-sm font-medium">Initializing workout plan...</div>
      </div>
    );
  }

  const cur = plan?.[activeDay] || plan?.[0];
  if (!cur) return null;

  const doneN = cur.exercises ? cur.exercises.filter((_: any, i: number) => checked[`${activeDay}-${i}`]).length : 0;
  const progressPercent = cur.exercises && cur.exercises.length > 0 ? (doneN / cur.exercises.length) * 100 : 0;

  const addModal = addExModal;
  const muscleExercises = addModal?.muscle ? EXERCISE_DB[addModal.muscle] || [] : [];

  return (
    <div className="min-h-screen bg-[#09090c] text-[#e0e0e0] font-sans pb-32">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-violet-400 px-5 py-3 rounded-xl text-xs font-semibold z-[9999] shadow-2xl flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
              <span>STRENGTH & HYPERTROPHY APP</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>IronPath</span>
              <span className="text-[10px] bg-violet-500/10 text-violet-400 font-bold px-2 py-0.5 rounded-full border border-violet-500/20">v1.2</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDayModal(true)}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-all border border-zinc-800/60 shadow-lg"
              title="Manage Days"
            >
              <CalendarDays className="w-5 h-5" />
            </button>
            <button
              onClick={() => setScreen((s) => (s === "workout" ? "progress" : "workout"))}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg border ${
                screen === "progress"
                  ? "bg-violet-600 hover:bg-violet-500 text-white border-violet-500"
                  : "bg-zinc-900 hover:bg-zinc-800/80 text-zinc-300 hover:text-white border-zinc-800/60"
              }`}
            >
              {screen === "progress" ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Workout</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Logs & Progress</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        {/* PROGRESS SCREEN */}
        {screen === "progress" && (
          <div className="space-y-6">
            <div className="bg-zinc-950/50 border border-zinc-900/80 rounded-2xl p-6 text-center shadow-xl">
              <TrendingUp className="w-10 h-10 text-violet-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white mb-1">Performance Dashboard</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Review your session logs, custom notes, and weight progressions across configured routines.
              </p>
            </div>

            {Object.keys(progress).length === 0 ? (
              <div className="text-center py-16 text-zinc-600 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
                <ClipboardList className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-zinc-400 mb-1">No progression logged</h3>
                <p className="text-xs text-zinc-500">Tap "Log" on any exercise to store your performance.</p>
              </div>
            ) : (
              plan.map((d, di) => {
                const dayLogs = d.exercises
                  .map((ex: any) => {
                    const key = `${di}-${ex.id}`;
                    const sessions = progress[key] || [];
                    return sessions.length > 0 ? { ex, key, sessions } : null;
                  })
                  .filter(Boolean);

                if (dayLogs.length === 0) return null;

                return (
                  <div key={di} className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                        {d.day} — {d.label}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {dayLogs.map(({ ex, key, sessions }: any) => (
                        <div
                          key={key}
                          className="bg-[#121217] border border-zinc-900/80 rounded-2xl overflow-hidden shadow-md"
                        >
                          {/* Exercise Header */}
                          <div className="px-5 py-4 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-bold text-white leading-tight">{ex.name}</h4>
                              <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                                {ex.method} · {ex.sets} sets planned
                              </p>
                            </div>
                            <span className="text-[10px] text-violet-400 bg-violet-500/5 px-2.5 py-1 rounded-md border border-violet-500/10 font-bold uppercase">
                              {sessions.length} entry
                            </span>
                          </div>

                          {/* Session details */}
                          <div className="divide-y divide-zinc-900/60 max-h-80 overflow-y-auto">
                            {[...sessions].reverse().map((session: any, si: number) => (
                              <div key={si} className="p-4 bg-zinc-950/10">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[11px] font-bold text-violet-400 bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 rounded">
                                    {session.date}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">
                                    {(session.sets || []).length} sets logged
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {(session.sets || []).map((s: any, j: number) => (
                                    <div
                                      key={j}
                                      className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-zinc-950/50 border border-zinc-900/40 text-xs"
                                    >
                                      <span className="text-[10px] text-zinc-500 font-semibold w-12">
                                        Set {s.setNum}
                                      </span>
                                      <span className="font-bold text-zinc-200">
                                        {s.weight ? `${s.weight} kg` : "Bodyweight"}
                                      </span>
                                      <span className="text-zinc-400">×</span>
                                      <span className="font-semibold text-zinc-300">
                                        {s.reps} reps
                                      </span>
                                      {s.rpe && (
                                        <span className="ml-auto text-[10px] text-violet-400 bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 rounded font-extrabold uppercase">
                                          {s.rpe.includes("RIR") || s.rpe.toLowerCase() === "failure" ? s.rpe : `RPE ${s.rpe}`}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* WORKOUT SCREEN */}
        {screen === "workout" && (
          <div className="space-y-5">
            {/* Quick Horizontal Day Selectors */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {plan.map((d, i) => {
                const isActive = activeDay === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`flex-1 min-w-[76px] py-3 px-2 rounded-xl transition-all border text-center ${
                      isActive
                        ? "text-white shadow-xl scale-[1.02]"
                        : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
                    }`}
                    style={{
                      backgroundColor: isActive ? d.color : undefined,
                      borderColor: isActive ? d.color : undefined
                    }}
                  >
                    <div
                      className={`text-[9px] font-bold tracking-wider uppercase mb-1 ${
                        isActive ? "text-white/70" : "text-zinc-500"
                      }`}
                    >
                      {d.day}
                    </div>
                    <div className="text-xs font-bold truncate leading-none">{d.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Current day focus details card */}
            <div
              className="rounded-2xl border transition-all duration-300 p-5 shadow-xl flex justify-between items-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${cur.color}15, ${cur.color}05)`,
                borderColor: `${cur.color}25`
              }}
            >
              <div className="space-y-1.5 flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-wider font-extrabold uppercase" style={{ color: cur.accent }}>
                    {cur.day} — {cur.label}
                  </span>
                  {cur.badge && (
                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                      {cur.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">{cur.focus || "Custom Targeted Routine"}</h2>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full rounded-full transition-all duration-300"
                    style={{ backgroundColor: cur.color }}
                  />
                </div>
              </div>

              <div className="text-right border-l border-zinc-800/60 pl-6 flex-shrink-0">
                <div className="text-2xl font-black tracking-tight" style={{ color: cur.accent }}>
                  {doneN}/{cur.exercises?.length || 0}
                </div>
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">done</div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl divide-y divide-zinc-900">
              {(!cur.exercises || cur.exercises.length === 0) && (
                <div className="p-12 text-center text-zinc-500 space-y-2">
                  <Dumbbell className="w-8 h-8 mx-auto text-zinc-600 animate-pulse" />
                  <p className="text-sm font-semibold text-zinc-400">Workout empty</p>
                  <p className="text-xs text-zinc-500">Add an exercise below to build your schedule.</p>
                </div>
              )}

              {cur.exercises && (
                <Reorder.Group
                  axis="y"
                  values={cur.exercises}
                  onReorder={(newExs) => {
                    const updated = plan.map((d, i) => {
                      if (i !== activeDay) return d;
                      return { ...d, exercises: newExs };
                    });
                    updatePlan(updated);
                  }}
                  className="divide-y divide-zinc-900/60"
                >
                  {cur.exercises.map((ex: any, i: number) => {
                    const last = lastLog(activeDay, i);
                    const exInfo = getExInfo(ex.name);
                    return (
                      <ReorderableExerciseItem
                        key={ex.id || i}
                        ex={ex}
                        i={i}
                        activeDay={activeDay}
                        checked={checked}
                        cur={cur}
                        last={last}
                        exInfo={exInfo}
                        updateChecked={updateChecked}
                        setSwapEx={setSwapEx}
                        setEditEx={setEditEx}
                        handleOpenLog={handleOpenLog}
                        delEx={delEx}
                      />
                    );
                  })}
                </Reorder.Group>
              )}
            </div>

            {/* Add Exercise Trigger Button */}
            <button
              onClick={() => setAddExModal({ di: activeDay, step: "muscle", muscle: null })}
              className="w-full flex items-center justify-center gap-2 py-4 border border-dashed rounded-2xl font-bold text-sm transition-all duration-150 cursor-pointer"
              style={{
                borderColor: `${cur.color}40`,
                color: cur.accent,
                backgroundColor: `${cur.color}05`
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Exercise</span>
            </button>

            {/* Weekly Muscle Volume Tracker Section */}
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Weekly Muscle Volume</h3>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Sets / Week</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                {MUSCLE_LIST.map((muscle) => {
                  const volume = getWeeklyVolume();
                  const totalSets = volume[muscle] || 0;
                  const status = getVolumeStatus(totalSets);
                  const percent = Math.min(100, (totalSets / 20) * 100);

                  return (
                    <div key={muscle} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-200">{muscle}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-zinc-300">{totalSets} sets</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${status.colorClass} ${status.borderClass}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${status.barColor}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#09090cdd] backdrop-blur-md border-t border-zinc-900/60 py-4 px-6 text-center z-30">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>PROGRESS MATTERS</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>
      </footer>

      {/* ────────────────── MODALS ────────────────── */}

      {/* SWAP MODAL */}
      <AnimatePresence>
        {swapEx && (() => {
          const { di, ei } = swapEx;
          const ex = plan[di].exercises[ei];
          const isPU = ex.group === "Pull-Up" || ex.name.includes("Pull-Up");
          const alts = EX_GROUPS[ex.group] || [];

          return (
            <div
              onClick={(e) => e.target === e.currentTarget && setSwapEx(null)}
              className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Swap "{ex.name}"</h3>
                  <button onClick={() => setSwapEx(null)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {alts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Alternatives ({ex.group})</div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {alts.map((name) => (
                          <button
                            key={name}
                            onClick={() => handleSwap(di, ei, name)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition flex justify-between items-center ${
                              name === ex.name
                                ? "bg-violet-600/15 border-violet-500 text-violet-400"
                                : "bg-zinc-900/60 border-zinc-900 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-800"
                            }`}
                          >
                            <span>{name}</span>
                            {name === ex.name && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isPU && (
                    <div className="space-y-2">
                      <div className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Pull-Up Loading</div>
                      <div className="grid grid-cols-2 gap-2">
                        {PULLUP_METHODS.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              updEx(di, ei, {
                                method: m,
                                name: m === "Weighted" ? "Weighted Pull-Up" : "Bodyweight Pull-Up"
                              });
                              showToast(`Set loading to ${m}`);
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition ${
                              ex.method === m
                                ? "bg-violet-600/15 border-violet-500 text-violet-400"
                                : "bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Custom Method/Attachment</div>
                    <div className="flex flex-wrap gap-1.5">
                      {METHODS.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            updEx(di, ei, { method: m });
                            showToast(`Method updated: ${m}`);
                          }}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                            ex.method === m
                              ? "bg-violet-600/15 border-violet-500 text-violet-400"
                              : "bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editEx && (() => {
          const { di, ei } = editEx;
          const ex = plan[di].exercises[ei];
          const exInfo = getExInfo(ex.name);

          const handleSetsChange = (val: number) => updEx(di, ei, { sets: val });
          const handleRepsChange = (val: string) => updEx(di, ei, { reps: val });

          const repPresets = [
            "5", "6", "8", "10", "12", "15", "20",
            "5–8", "6–8", "8–10", "10–12", "12–15", "15–20",
            "20–30s", "30–40s", "30s", "45s", "60s"
          ];

          return (
            <div
              onClick={(e) => e.target === e.currentTarget && setEditEx(null)}
              className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Edit Exercise</h3>
                  <button onClick={() => setEditEx(null)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Exercise Name</label>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => updEx(di, ei, { name: e.target.value })}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sets Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Sets</label>
                      <div className="flex items-center bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleSetsChange(Math.max(1, ex.sets - 1))}
                          className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-bold text-sm text-white">{ex.sets}</span>
                        <button
                          onClick={() => handleSetsChange(Math.min(10, ex.sets + 1))}
                          className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Reps Preset Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Reps Preset</label>
                      <select
                        value={ex.reps}
                        onChange={(e) => handleRepsChange(e.target.value)}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
                      >
                        {repPresets.map((r) => (
                          <option key={r} value={r} className="bg-zinc-950">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Method</label>
                    <div className="flex flex-wrap gap-1.5">
                      {METHODS.map((m) => (
                        <button
                          key={m}
                          onClick={() => updEx(di, ei, { method: m })}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                            ex.method === m
                              ? "bg-violet-600/15 border-violet-500 text-violet-400"
                              : "bg-zinc-900/60 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Target Muscle Groups</label>
                    <div className="grid grid-cols-3 gap-1.5 p-3 bg-zinc-950 rounded-xl border border-zinc-900 max-h-36 overflow-y-auto">
                      {MUSCLE_LIST.map((m) => {
                        const currentMuscles = ex.muscles || getMusclesForExercise(ex);
                        const isSelected = currentMuscles.includes(m);
                        return (
                          <button
                            key={m}
                            onClick={() => {
                              const nextMuscles = isSelected
                                ? currentMuscles.filter((x: string) => x !== m)
                                : [...currentMuscles, m];
                              updEx(di, ei, { muscles: nextMuscles });
                            }}
                            className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                              isSelected
                                ? "bg-violet-600/15 border-violet-500 text-violet-400"
                                : "bg-zinc-900/40 border-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            <span>{m}</span>
                            {isSelected && <Check className="w-2.5 h-2.5 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Move Exercise to Day</label>
                    <select
                      value={di}
                      onChange={(e) => {
                        const targetDi = parseInt(e.target.value);
                        if (targetDi === di) return;

                        const currentDay = plan[di];
                        const targetDay = plan[targetDi];
                        const movingEx = currentDay.exercises[ei];

                        // Remove from current day
                        const nextCurrentDayExs = currentDay.exercises.filter((_, idx) => idx !== ei);

                        // Append to target day
                        const nextTargetDayExs = [...(targetDay.exercises || []), { ...movingEx, id: Date.now() + targetDi }];

                        // Map plan
                        const nextPlan = plan.map((d, idx) => {
                          if (idx === di) return { ...d, exercises: nextCurrentDayExs };
                          if (idx === targetDi) return { ...d, exercises: nextTargetDayExs };
                          return d;
                        });

                        updatePlan(nextPlan);
                        setActiveDay(targetDi);
                        setEditEx(null);
                        showToast(`Moved "${movingEx.name}" to ${targetDay.day} ✓`);
                      }}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {plan.map((d, idx) => (
                        <option key={idx} value={idx} className="bg-zinc-950">
                          {d.day} ({d.label})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Exercise Note / Tip</label>
                    <textarea
                      value={ex.note !== undefined ? ex.note : (exInfo?.note || "")}
                      onChange={(e) => updEx(di, ei, { note: e.target.value })}
                      placeholder="Add instructions, execution tip, or custom setup here..."
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 h-28 placeholder-zinc-600"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditEx(null);
                      showToast("Saved ✓");
                    }}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg mt-2 cursor-pointer"
                  >
                    Close & Apply
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* LOG MODAL */}
      <AnimatePresence>
        {logEx && (() => {
          const { di, ei } = logEx;
          const ex = plan[di].exercises[ei];
          const ac = plan[di].color;
          const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          });
          const key = `${di}-${ex.id}`;
          const allSessions = progress[key] || [];
          const todaySets = logIn.sets || [];

          return (
            <div
              onClick={(e) => e.target === e.currentTarget && setLogEx(null)}
              className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Log performance</h3>
                    <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-500 mt-1">
                      {ex.name} — {today}
                    </p>
                  </div>
                  <button onClick={() => setLogEx(null)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {todaySets.map((s, si) => (
                    <div
                      key={si}
                      className={`p-4 rounded-xl border transition ${
                        s.logged
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-zinc-900/40 border-zinc-900"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold" style={{ color: s.logged ? "#10b981" : ac }}>
                          Set {si + 1} of {ex.sets}
                        </span>
                        {s.logged && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Logged
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Weight (kg)</label>
                          <input
                            type="number"
                            placeholder="kg"
                            value={s.weight}
                            onChange={(e) => {
                              const ns = [...todaySets];
                              ns[si] = { ...ns[si], weight: e.target.value };
                              setLogIn({ sets: ns });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-violet-500 text-center"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Reps done</label>
                          <input
                            type="text"
                            placeholder={ex.reps}
                            value={s.reps}
                            onChange={(e) => {
                              const ns = [...todaySets];
                              ns[si] = { ...ns[si], reps: e.target.value };
                              setLogIn({ sets: ns });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-violet-500 text-center"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Effort (RIR)</label>
                          <select
                            value={s.rpe}
                            onChange={(e) => {
                              const ns = [...todaySets];
                              ns[si] = { ...ns[si], rpe: e.target.value };
                              setLogIn({ sets: ns });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-violet-500 text-center cursor-pointer"
                          >
                            <option value="">None</option>
                            <option value="0 RIR">0 RIR</option>
                            <option value="1 RIR">1 RIR</option>
                            <option value="2 RIR">2 RIR</option>
                            <option value="Failure">Failure</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLogSet(si)}
                        className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition border ${
                          s.logged
                            ? "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/10"
                            : "bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-900"
                        }`}
                      >
                        {s.logged ? "Save/Update Set" : "Log Set"}
                      </button>
                    </div>
                  ))}

                  {/* Previous logs of this exact day/exercise */}
                  {allSessions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">Recent Progression</label>
                      <div className="space-y-2">
                        {[...allSessions]
                          .reverse()
                          .slice(0, 2)
                          .map((session: any, idx: number) => (
                            <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2 text-xs">
                              <div className="flex justify-between text-zinc-500">
                                <span className="font-semibold">{session.date}</span>
                                <span className="text-[10px]">{(session.sets || []).length} sets</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {(session.sets || []).map((s: any, j: number) => (
                                  <div key={j} className="text-zinc-400 flex justify-between px-2 py-1 rounded bg-zinc-900/30">
                                    <span>Set {s.setNum}:</span>
                                    <span className="font-bold text-zinc-300">
                                      {s.weight ? `${s.weight}kg` : "BW"} × {s.reps}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ADD EXERCISE STEPPED MODAL */}
      <AnimatePresence>
        {addExModal && (() => {
          const { di, step, muscle } = addExModal;
          const ac = plan[di].color;

          return (
            <div
              onClick={(e) => e.target === e.currentTarget && setAddExModal(null)}
              className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4"
              >
                {step === "muscle" && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-white">Select Target Area</h3>
                      <button onClick={() => setAddExModal(null)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {MUSCLE_GROUPS.map((mg) => (
                        <button
                          key={mg}
                          onClick={() => setAddExModal({ di, step: "exercise", muscle: mg })}
                          className="p-3 bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 text-center hover:bg-zinc-900 transition"
                        >
                          {mg}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                      <button
                        onClick={() => setShowCustomCreate(!showCustomCreate)}
                        className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-violet-400 transition"
                      >
                        {showCustomCreate ? "Hide Custom Builder" : "+ Build Completely Custom Exercise"}
                      </button>

                      {showCustomCreate && (
                        <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-3.5 mt-1">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Exercise Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Reverse Grip Lat Pulldown"
                              value={customExName}
                              onChange={(e) => setCustomExName(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Default Sets</label>
                              <div className="flex items-center bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => setCustomExSets(Math.max(1, customExSets - 1))}
                                  className="p-2 hover:bg-zinc-900 text-zinc-400"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="flex-1 text-center font-bold text-xs">{customExSets}</span>
                                <button
                                  onClick={() => setCustomExSets(Math.min(10, customExSets + 1))}
                                  className="p-2 hover:bg-zinc-900 text-zinc-400"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Reps Target</label>
                              <input
                                type="text"
                                placeholder="8-10, 12, etc."
                                value={customExReps}
                                onChange={(e) => setCustomExReps(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Method</label>
                            <select
                              value={customExMethod}
                              onChange={(e) => setCustomExMethod(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                            >
                              {METHODS.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Coach's Note</label>
                            <textarea
                              placeholder="Key focus points or cues"
                              rows={2}
                              value={customExNote}
                              onChange={(e) => setCustomExNote(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none"
                            />
                          </div>
                          <button
                            onClick={handleCreateCustomExercise}
                            disabled={!customExName.trim()}
                            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white font-bold text-xs shadow-lg transition"
                          >
                            Add Custom Exercise ✓
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step === "exercise" && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAddExModal({ di, step: "muscle", muscle: null })}
                          className="p-1 rounded bg-zinc-900 hover:text-white"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h3 className="text-base font-bold text-white">{muscle} Library</h3>
                      </div>
                      <button onClick={() => setAddExModal(null)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
                      {muscleExercises.map((ex, idx) => (
                        <div
                          key={idx}
                          onClick={() => addExToDay(di, ex)}
                          className="bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-4 cursor-pointer transition flex justify-between items-start gap-4 shadow-sm group"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="text-xs md:text-sm font-bold text-white leading-tight group-hover:text-violet-400 transition">
                              {ex.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${ac}15`,
                                  color: ac
                                }}
                              >
                                {ex.method}
                              </span>
                            </div>
                            <p className="text-zinc-500 text-[11px] leading-relaxed pt-1 pr-2">{ex.note}</p>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-1">
                            <span className="text-xs font-black text-zinc-400 group-hover:text-white">
                              {ex.sets}×{ex.reps}
                            </span>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MANAGE DAYS MODAL */}
      <AnimatePresence>
        {dayModal && (
          <div
            onClick={(e) => e.target === e.currentTarget && setDayModal(false)}
            className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Manage Routine Schedule</h3>
                <button onClick={() => setDayModal(false)} className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {plan.map((d, i) => {
                  const takenDays = plan.map((p) => p.day);
                  const availableDays = ALL_DAYS.filter((day) => day !== d.day && !takenDays.includes(day));

                  return (
                    <div key={i} className="p-4 bg-[#121217] border border-zinc-900 rounded-2xl space-y-4 shadow-sm">
                      {/* Top info and removal */}
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-sm font-extrabold text-white">
                            {d.day} — {d.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeDay(i)}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/15 border border-red-500/10 text-[11px] font-bold text-red-400 rounded-lg transition"
                        >
                          Delete Day
                        </button>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Day Label</label>
                          <input
                            type="text"
                            placeholder="e.g. Push, Legs"
                            value={d.label}
                            onChange={(e) => {
                              const updated = plan.map((x, xi) => (xi !== i ? x : { ...x, label: e.target.value }));
                              updatePlan(updated);
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Focus description</label>
                          <input
                            type="text"
                            placeholder="e.g. Chest & Shoulders"
                            value={d.focus}
                            onChange={(e) => {
                              const updated = plan.map((x, xi) => (xi !== i ? x : { ...x, focus: e.target.value }));
                              updatePlan(updated);
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-2">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Badge (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Priority ⭐"
                            value={d.badge || ""}
                            onChange={(e) => {
                              const updated = plan.map((x, xi) => (xi !== i ? x : { ...x, badge: e.target.value }));
                              updatePlan(updated);
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Day color selector */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Theme Accent</label>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            ["#E8533F", "#ff6b54"],
                            ["#3F7DE8", "#5490ff"],
                            ["#2EAD6B", "#3dc97d"],
                            ["#9B3FE8", "#b55fff"],
                            ["#E8A63F", "#f5b94e"],
                            ["#E83F7D", "#ff5490"],
                            ["#3FE8C8", "#4ffff0"],
                            ["#E8D43F", "#ffe44f"],
                            ["#888888", "#aaaaaa"]
                          ].map(([c, a]) => (
                            <button
                              key={c}
                              onClick={() => {
                                const updated = plan.map((x, xi) => (xi !== i ? x : { ...x, color: c, accent: a }));
                                updatePlan(updated);
                              }}
                              className="w-6 h-6 rounded-full border-2 transition-transform duration-150 relative"
                              style={{
                                backgroundColor: c,
                                borderColor: d.color === c ? "#ffffff" : "transparent"
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Reschedule day */}
                      {availableDays.length > 0 && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 font-bold">Reschedule to</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {availableDays.map((day) => (
                              <button
                                key={day}
                                onClick={() => moveDay(i, day)}
                                className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white rounded-lg transition"
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add new workout day */}
                <div className="pt-4 border-t border-zinc-900 space-y-3">
                  <div className="text-[10px] tracking-wider uppercase font-extrabold text-zinc-500">Schedule New Training Day</div>
                  {ALL_DAYS.filter((d) => !plan.find((p) => p.day === d)).length === 0 ? (
                    <div className="text-zinc-600 text-xs py-2 text-center">Every weekday is currently scheduled.</div>
                  ) : (
                    <div className="space-y-3 divide-y divide-zinc-900">
                      {ALL_DAYS.filter((d) => !plan.find((p) => p.day === d)).map((d) => (
                        <div key={d} className="pt-3 first:pt-0">
                          <div className="text-xs font-black text-white mb-2">{d}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {DAY_TYPES.map((type) => (
                              <button
                                key={type}
                                onClick={() => {
                                  addDay(d, type);
                                  setDayModal(false);
                                }}
                                className="px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white rounded-lg transition"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
