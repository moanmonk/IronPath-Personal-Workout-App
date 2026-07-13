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
  CalendarDays,
  Copy,
  FileText,
  ChevronUp,
  ChevronDown,
  Zap,
  Flame,
  Palette
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
    { name: "Machine Chest Press", method: "Machine", sets: 4, reps: "8–10", note: "Sit upright, adjust handles to mid-chest. Press forward with control. Locks the movement pattern for high intensity safety." },
    { name: "Incline Machine Chest Press", method: "Machine", sets: 4, reps: "8–10", note: "Adjust seat so handles align with upper chest. Press up and forward. Focuses upper chest with minimal shoulder strain." },
    { name: "Single-Arm Cable Chest Press", method: "Cable", sets: 3, reps: "10–12", note: "Set cable at chest height. Stand in a staggered stance and press unilaterally. Emphasizes stability and core anti-rotation." },
  ],
  "Shoulders": [
    { name: "Dumbbell Shoulder Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Sit upright. Start with DBs at ear level, elbows at 90°. Press directly overhead without flaring elbows too wide. Lower under control. Brace your core — don't arch lower back." },
    { name: "Smith Machine Shoulder Press", method: "Smith Machine", sets: 4, reps: "8–10", note: "Sit under the bar. Press from just in front of your face upward. Keep core tight. Smith path makes it beginner-friendly for learning the pressing pattern." },
    { name: "Cable Lateral Raise", method: "Cable", sets: 4, reps: "12–15", note: "Set cable at lowest position, grab with opposite hand for cross-body tension. Raise arm out to side to shoulder height. Slow 3-sec lower. Cable keeps tension through entire range unlike DBs." },
    { name: "Dumbbell Lateral Raise", method: "Dumbbell", sets: 4, reps: "12–15", note: "Slight forward lean, raise arms out to sides. Lead with elbows not wrists. Pinky slightly higher than thumb at top. Lower slowly. Go lighter than you think — most people ego lift here." },
    { name: "Machine Lateral Raise", method: "Machine", sets: 3, reps: "12–15", note: "Adjust pad to elbow height. Press elbows (not wrists) into pads. Raise to shoulder level. Great beginner option as it locks the movement pattern." },
    { name: "Cable Shoulder Press", method: "Cable", sets: 4, reps: "10–12", note: "Set cables low on both sides. Press from ear level up overhead. Cables create a different resistance curve than DBs. Keep core braced throughout." },
    { name: "Machine Shoulder Press", method: "Machine", sets: 4, reps: "8–10", note: "Adjust seat so handles are at shoulder level. Press overhead. Excellent for lifting heavy without needing to stabilize." },
    { name: "Single-Arm Dumbbell Shoulder Press", method: "Dumbbell", sets: 3, reps: "10–12", note: "Perform shoulder press unilaterally while standing or sitting. Engages your obliques and core for lateral stability." },
    { name: "Single-Arm Cable Lateral Raise", method: "Cable", sets: 4, reps: "12–15", note: "Set cable low. Perform unilaterally. Allows you to focus on the lateral delt squeeze and stretch on each side." },
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
    { name: "T-Bar Row", method: "Barbell", sets: 4, reps: "8–10", note: "Straddle the bar, hinge forward. Pull barbell collar up to chest. Squeezes the mid-back and traps perfectly." },
    { name: "Chest-Supported T-Bar Row", method: "Machine", sets: 4, reps: "8–10", note: "Lie chest-down on T-bar pad. Pull handles back, squeezing shoulder blades together. Eliminates lower-back cheating." },
    { name: "Single-Arm Dumbbell Row", method: "Dumbbell", sets: 3, reps: "8–10", note: "One knee on bench or standard split-stance. Row dumbbell to hip, driving elbow back. Excellent unilateral lat activator." },
    { name: "Single-Arm Lat Pulldown", method: "Cable", sets: 3, reps: "10–12", note: "Unilateral pulldown using a D-handle. Allows a deeper pull into the lower lat pocket and correction of muscle imbalances." },
    { name: "Machine Row", method: "Machine", sets: 4, reps: "8–12", note: "Sit upright, pull handles back. Keeps the back movement rigid and isolated without momentum." },
  ],
  "Biceps": [
    { name: "Barbell Curl", method: "Barbell", sets: 3, reps: "8–10", note: "Stand, underhand grip shoulder width. Curl bar up without swinging. Fully supinate (rotate wrists out) at top. Squeeze bicep hard. Lower in 3 seconds. Keep elbows pinned to sides." },
    { name: "EZ Bar Curl", method: "EZ Bar", sets: 3, reps: "8–10", note: "EZ bar reduces wrist strain vs straight bar. Same technique — slow eccentric, full supination at top. Good option if straight bar causes wrist discomfort." },
    { name: "Cable Curl (Straight Bar)", method: "Straight Bar", sets: 3, reps: "8–10", note: "Cable maintains tension at the top unlike free weights. Stand close to cable. Curl up, squeeze hard at top. Don't let elbows drift forward." },
    { name: "Incline DB Curl", method: "Dumbbell", sets: 4, reps: "10–12", note: "Set bench to 60–70°. Let arms hang behind you — this stretches the long head of the bicep. Curl without swinging the shoulder. Best exercise for long head peak." },
    { name: "Preacher Curl", method: "EZ Bar", sets: 3, reps: "10–12", note: "Arms braced on pad, no cheating possible. Lower slowly for full stretch. Don't fully lock out at bottom — keep tension. Great for beginners to feel the bicep work." },
    { name: "Hammer Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Neutral grip (thumbs up). Curl without rotating wrist. Targets brachialis (under the bicep) and brachioradialis. Adds arm thickness. Arc the DB slightly outward rather than straight up." },
    { name: "Cable Hammer Curl (Rope)", method: "Rope", sets: 3, reps: "10–12", note: "Attach rope to low cable. Hammer grip, curl up. Rope allows wrists to move naturally. Keep elbows pinned. Slow 3-sec lower." },
    { name: "Machine Bicep Curl", method: "Machine", sets: 3, reps: "10–12", note: "Sit in bicep machine, rest elbows on pad. Curl handles upward. Keeps bicep under continuous target tension." },
    { name: "Single-Arm Dumbbell Preacher Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Rest one arm on the preacher bench. Curl DB up. Isolates the bicep short head unilaterally for balanced peaks." },
    { name: "Incline Hammer Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Sit on incline bench, neutral grip. Curl DBs up. Great compound forearm/brachialis long head stretch." },
  ],
  "Triceps": [
    { name: "Cable Overhead Extension (Rope)", method: "Rope", sets: 4, reps: "12–15", note: "Set cable high, face away. Lean forward slightly. Elbows close to head. Extend arms forward/down. Stretches the long head (biggest portion of tricep). Slow eccentric for max growth." },
    { name: "Cable Overhead Extension (Straight Bar)", method: "Straight Bar", sets: 4, reps: "12–15", note: "Same as rope version but straight bar. Slightly more stable. Keep elbows narrow and pointed forward throughout. Don't let them flare out." },
    { name: "Rope Pushdown", method: "Rope", sets: 3, reps: "12–15", note: "Set cable high. Elbows pinned to sides. Push rope down and flare ends outward at bottom for full contraction. Squeeze hard. Slow return. Don't lean forward excessively." },
    { name: "V Bar Pushdown", method: "V Bar", sets: 3, reps: "12–15", note: "Same as rope pushdown but V bar gives a slightly different feel. Elbows stay stationary at sides. Full extension at bottom, controlled eccentric back up." },
    { name: "Straight Bar Pushdown", method: "Straight Bar", sets: 3, reps: "12–15", note: "Overhand grip on straight bar. Elbows locked at sides. Push straight down. Wrists stay neutral. Some people feel this more in the lateral/medial head vs rope which hits all heads." },
    { name: "Single Arm Cable Pushdown", method: "Cuff/Ring", sets: 3, reps: "12–15", note: "One arm at a time allows full focus and addresses imbalances. Keep elbow pinned. Extend fully, hold 1 sec. Use a single handle or cuff attachment." },
    { name: "Dumbbell Overhead Extension", method: "Dumbbell", sets: 3, reps: "12–15", note: "Hold one DB with both hands overhead. Lower behind head slowly, feeling the stretch. Press back up. Keep elbows narrow. Great long head stretch." },
    { name: "Machine Tricep Extension", method: "Machine", sets: 3, reps: "12–15", note: "Adjust seat. Place elbows on pad, press handles down. Perfect isolation for the lateral head of the tricep." },
    { name: "Single-Arm Tricep Pushdown", method: "Cable", sets: 3, reps: "12–15", note: "Use a single cable line (no attachment or handle). Push down unilaterally, extending out to the side for the lateral head." },
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
    { name: "Single-Leg Press", method: "Machine", sets: 3, reps: "10–12", note: "Position one foot on the platform. Press unilaterally. Balances out quad, hamstring, and glute discrepancies." },
    { name: "Single-Leg Extension", method: "Machine", sets: 3, reps: "10–12", note: "Extend one leg at a time on the machine. Excellent for balancing the quadriceps tear-drop." },
    { name: "Single-Leg Curl", method: "Machine", sets: 3, reps: "10–12", note: "Perform leg curl unilaterally. Essential for curing left/right hamstring imbalances." },
    { name: "Single-Leg RDL", method: "Dumbbell", sets: 3, reps: "8–10", note: "Hold one DB, hinge at hips while lifting opposite leg backward. Demands high balance, glute, and hamstring stability." },
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
  "Chest Press": ["Incline Dumbbell Press", "Flat Dumbbell Press", "Smith Machine Incline Press", "Cable Chest Press", "Machine Chest Press", "Incline Machine Chest Press", "Single-Arm Cable Chest Press"],
  "Chest Fly": ["Cable Fly Low-to-High", "Cable Fly High-to-Low", "Pec Deck Fly"],
  "Shoulder Press": ["Dumbbell Shoulder Press", "Smith Machine Shoulder Press", "Cable Shoulder Press", "Machine Shoulder Press", "Single-Arm Dumbbell Shoulder Press"],
  "Lateral Raise": ["Cable Lateral Raise", "Dumbbell Lateral Raise", "Machine Lateral Raise", "Single-Arm Cable Lateral Raise"],
  "Rear Delt": ["Reverse Pec Deck", "Cable Face Pull (Rope)", "Dumbbell Rear Delt Fly", "Band Pull-Apart"],
  "Face Pull": ["Cable Face Pull (Rope)"],
  "Pull-Up": ["Bodyweight Pull-Up", "Weighted Pull-Up", "Wide Grip Lat Pulldown", "Close Grip Pulldown (V Bar)", "Single-Arm Lat Pulldown"],
  "Row (Horizontal)": ["Seated Cable Row (V Bar)", "Seated Cable Row (Close Grip)", "Chest-Supported DB Row", "Single Arm Cable Row", "Smith Machine Row", "T-Bar Row", "Chest-Supported T-Bar Row", "Single-Arm Dumbbell Row", "Machine Row"],
  "Deadlift": ["Smith Machine RDL", "Barbell RDL", "Single-Leg RDL"],
  "Pulldown": ["Wide Grip Lat Pulldown", "Close Grip Pulldown (V Bar)", "Straight Arm Pulldown", "Single-Arm Lat Pulldown"],
  "Shrug": ["Dumbbell Shrug", "Barbell Shrug", "Smith Machine Shrug", "Cable Shrug"],
  "Bicep Curl": ["Barbell Curl", "EZ Bar Curl", "Cable Curl (Straight Bar)", "Incline DB Curl", "Preacher Curl", "Machine Bicep Curl", "Single-Arm Dumbbell Preacher Curl"],
  "Hammer Curl": ["Hammer Curl", "Cable Hammer Curl (Rope)", "Incline Hammer Curl"],
  "Tricep Pushdown": ["Rope Pushdown", "V Bar Pushdown", "Straight Bar Pushdown", "Single Arm Cable Pushdown", "Single-Arm Tricep Pushdown"],
  "Overhead Tricep Extension": ["Cable Overhead Extension (Rope)", "Cable Overhead Extension (Straight Bar)", "Dumbbell Overhead Extension", "Machine Tricep Extension"],
  "Wrist Curl": ["Dumbbell Wrist Curl", "Barbell Wrist Curl", "Cable Wrist Curl"],
  "Reverse Curl": ["EZ Bar Reverse Curl", "Cable Reverse Curl (Straight Bar)"],
  "Grip/Carry": ["Farmer's Carry", "Plate Pinch", "Dead Hang"],
  "Squat": ["Smith Machine Squat", "Dumbbell Goblet Squat", "Leg Press", "Hack Squat", "Single-Leg Press"],
  "Leg Curl": ["Lying Leg Curl", "Smith Machine RDL", "Barbell RDL", "Single-Leg Curl"],
  "Leg Extension": ["Leg Extension Machine", "Hack Squat", "Single-Leg Extension"],
  "Calf Raise": ["Smith Machine Calf Raise", "Standing DB Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise"]
};

interface TemplateDay {
  day: string;
  label: string;
  focus: string;
  badge?: string;
  color: string;
  accent: string;
  exercises: {
    id: number;
    name: string;
    method: string;
    sets: number;
    reps: string;
    note: string;
  }[];
}

const EXPLORE_TEMPLATES: Record<string, { name: string; description: string; goal: string; repRangeTips: string; warmupTips: string; plan: TemplateDay[] }> = {
  "toji_vtaper": {
    name: "Toji's Heavenly Restriction (Full 4-Day V-Taper & Core)",
    description: "Inspired by JJK's ultimate physical beast, Toji Fushiguro. Built to forge a massive, thick back, wide lateral delts, a solid chest plate, and shredded abs. No sorcery, just raw physical dominance.",
    goal: "Elite V-Taper Aesthetic & Midsection Shred",
    repRangeTips: "Focus on 8-12 hyper-controlled reps. Use a 3-second negative (eccentric) to maximize mechanical tension and stretch under load.",
    warmupTips: "10 shoulder dislocations, scapular shrugs, dead hangs (60s), and light rotators cuff cable work.",
    plan: [
      {
        day: "Mon",
        label: "Heavenly Back",
        focus: "Lats & Upper Back Width",
        badge: "Toji Shield 🛡️",
        color: "#9B3FE8",
        accent: "#b55fff",
        exercises: [
          { id: 201, name: "Weighted Pull-Up", method: "Weighted", sets: 4, reps: "6–8", note: "Keep chest high, drive elbows down into sides. Core squeezed." },
          { id: 202, name: "Wide Grip Lat Pulldown", method: "Straight Bar", sets: 3, reps: "10–12", note: "Slow release. Focus on stretching the outer lats fully." },
          { id: 203, name: "Chest-Supported T-Bar Row", method: "Machine", sets: 4, reps: "8–10", note: "Neutral grip. Squeeze upper back and mid-traps at peak." },
          { id: 204, name: "Straight Arm Pulldown", method: "Rope", sets: 3, reps: "12–15", note: "Isolate lats. Push down and back, squeezing the armpits." }
        ]
      },
      {
        day: "Tue",
        label: "Steel Chest & Shoulders",
        focus: "Upper Chest & Side Delts",
        badge: "Sorcerer Armor 🧱",
        color: "#3F7DE8",
        accent: "#5490ff",
        exercises: [
          { id: 205, name: "Incline Dumbbell Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Set bench to 30–45°. Stretch deep, press with control." },
          { id: 206, name: "Flat Dumbbell Press", method: "Dumbbell", sets: 3, reps: "10–12", note: "Keep shoulder blades pinned to the bench." },
          { id: 207, name: "Cable Lateral Raise", method: "Cable", sets: 4, reps: "12–15", note: "Perform behind back for maximum lateral head fiber tension." },
          { id: 208, name: "Dumbbell Lateral Raise", method: "Dumbbell", sets: 3, reps: "15–20", note: "Slight forward lean, raise up and out in scapular plane." }
        ]
      },
      {
        day: "Thu",
        label: "Cursed Arms & Forearms",
        focus: "Biceps, Triceps & Grip",
        badge: "Fushiguro Grip 🗡️",
        color: "#E8533F",
        accent: "#ff6b54",
        exercises: [
          { id: 209, name: "EZ Bar Curl", method: "EZ Bar", sets: 4, reps: "10–12", note: "Strict curls, no swinging. Focus on bicep thickness." },
          { id: 210, name: "Cable Overhead Extension (Rope)", method: "Rope", sets: 4, reps: "12–15", note: "Deep triceps stretch behind head, lock out at top." },
          { id: 211, name: "Hammer Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Builds brachialis and heavy forearms." },
          { id: 212, name: "Rope Pushdown", method: "Rope", sets: 3, reps: "12–15", note: "Spread rope apart at bottom of repetition." }
        ]
      },
      {
        day: "Fri",
        label: "Sorcerer Killer Legs & Core",
        focus: "Unilateral Legs, Calves & Abs",
        badge: "Physical Gift 🌪️",
        color: "#2EAD6B",
        accent: "#3dc97d",
        exercises: [
          { id: 213, name: "Hack Squat", method: "Machine", sets: 4, reps: "10–12", note: "Go below parallel. Powerful drive up." },
          { id: 214, name: "Bulgarian Split Squat", method: "Dumbbell", sets: 3, reps: "10–12", note: "Brutal glute and quad loading. Maintain torso lean." },
          { id: 215, name: "Hanging Leg Raise", method: "Bodyweight", sets: 4, reps: "12–15", note: "Strict raises, crunch pelvis up to build iron abs." },
          { id: 216, name: "Cable Crunch", method: "Rope", sets: 3, reps: "15–20", note: "Weighted abdominal contraction." }
        ]
      }
    ]
  },
  "goku_god_tier": {
    name: "Goku's Hyperbolic 5-Day Split (God-Like Hypertrophy)",
    description: "A comprehensive 5-day high-intensity routine inspired by Son Goku's training under 100g gravity. Designed for complete muscle group coverage with optimal volume, targeting chest, back, shoulders, arms, and legs on dedicated days.",
    goal: "Maximum Muscle Hypertrophy & Power",
    repRangeTips: "Mix heavy compound lifts (6-8 reps) with high-density isolation lifts (12-15 reps) to target both mechanical and metabolic growth.",
    warmupTips: "5 mins skipping, high-knees, light rotator cuff work, and progressive warm-up sets.",
    plan: [
      {
        day: "Mon",
        label: "Goku Chest",
        focus: "Heavy Press & Chest Flys",
        badge: "Ultra Chest 💥",
        color: "#E8533F",
        accent: "#ff6b54",
        exercises: [
          { id: 101, name: "Smith Machine Incline Press", method: "Smith Machine", sets: 4, reps: "6–8", note: "Go heavy, squeeze upper chest at the peak." },
          { id: 102, name: "Flat Dumbbell Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Keep feet planted. Arch back slightly, shoulder blades pinned." },
          { id: 103, name: "Cable Fly High-to-Low", method: "Cable", sets: 3, reps: "12–15", note: "Lean forward slightly. Squeeze lower chest chest plates." }
        ]
      },
      {
        day: "Tue",
        label: "Divine Back",
        focus: "Thick Rows & Lat Pulldowns",
        badge: "Kami Width 🌌",
        color: "#3F7DE8",
        accent: "#5490ff",
        exercises: [
          { id: 104, name: "Bodyweight Pull-Up", method: "Bodyweight", sets: 4, reps: "8–12", note: "Full hang to full chin-over-bar pulls." },
          { id: 105, name: "Seated Cable Row (V Bar)", method: "V Bar", sets: 3, reps: "8–10", note: "Squeeze back muscles hard, don't rock torso." },
          { id: 106, name: "Wide Grip Lat Pulldown", method: "Straight Bar", sets: 3, reps: "10–12", note: "Bring bar to upper collarbone with controlled eccentric." }
        ]
      },
      {
        day: "Wed",
        label: "Cosmic Shoulders",
        focus: "Overhead Press & Lateral Raises",
        badge: "Broad Delts 🪐",
        color: "#E8A63F",
        accent: "#f5b94e",
        exercises: [
          { id: 107, name: "Dumbbell Shoulder Press", method: "Dumbbell", sets: 4, reps: "8–10", note: "Sit tall. Keep core braced. Press straight up." },
          { id: 108, name: "Cable Lateral Raise", method: "Cable", sets: 4, reps: "12–15", note: "Keep shoulder blades stable, raise arm in scapular plane." },
          { id: 109, name: "Reverse Pec Deck", method: "Machine", sets: 3, reps: "15–20", note: "Isolate posterior deltoids. High-rep squeeze." }
        ]
      },
      {
        day: "Fri",
        label: "Limitless Arms",
        focus: "Bicep & Tricep Super-Sets",
        badge: "Kaioken Pump 💪",
        color: "#9B3FE8",
        accent: "#b55fff",
        exercises: [
          { id: 110, name: "EZ Bar Curl", method: "EZ Bar", sets: 4, reps: "10–12", note: "Control down-phase over 3 seconds." },
          { id: 111, name: "V Bar Pushdown", method: "V Bar", sets: 4, reps: "10–12", note: "Tuck elbows. Press straight down, locking triceps." },
          { id: 112, name: "Incline DB Curl", method: "Dumbbell", sets: 3, reps: "10–12", note: "Slight incline bench. Massive biceps stretch." },
          { id: 113, name: "Cable Overhead Extension (Rope)", method: "Rope", sets: 3, reps: "12–15", note: "Press forward and extend fully." }
        ]
      },
      {
        day: "Sat",
        label: "Saiyan Lower",
        focus: "Heavy Squats, Hamstrings & Calves",
        badge: "Gravitational Power 🧱",
        color: "#2EAD6B",
        accent: "#3dc97d",
        exercises: [
          { id: 114, name: "Smith Machine Squat", method: "Smith Machine", sets: 4, reps: "8–10", note: "Keep deep upright stance, load quadriceps." },
          { id: 115, name: "Lying Leg Curl", method: "Machine", sets: 4, reps: "10–12", note: "Contract calves/hamstrings. Keep hips pinned." },
          { id: 116, name: "Standing DB Calf Raise", method: "Dumbbell", sets: 4, reps: "15–20", note: "Hold peak raise for 1 sec. Pause at stretch." }
        ]
      }
    ]
  },
  "baki_beast": {
    name: "Baki's Hanma Blood (Full 4-Day Athletic Split)",
    description: "Designed for functional hypertrophy, endurance, and conditioning. Perfect for maintaining low body-fat percentages while packing on dense, vascular, high-performance muscle fiber.",
    goal: "Vascular Definition & Athletic Conditioning",
    repRangeTips: "Maintain high intensity with shorter rest times (45–60s) and reps in the 12–15 range.",
    warmupTips: "5 mins skipping, full-body arm swings, knee raises, and dynamic bodyweight push-ups.",
    plan: [
      {
        day: "Mon",
        label: "Hanma Upper Power",
        focus: "Chest, Upper Back & Row Compound Power",
        badge: "Hanma Power 👹",
        color: "#E83F7D",
        accent: "#ff5490",
        exercises: [
          { id: 301, name: "Flat Dumbbell Press", method: "Dumbbell", sets: 4, reps: "10–12", note: "Explosive concentric press, slow eccentric." },
          { id: 302, name: "Single-Arm Dumbbell Row", method: "Dumbbell", sets: 4, reps: "8–10", note: "Heavy rows. Maintain static core." },
          { id: 303, name: "Incline Machine Chest Press", method: "Machine", sets: 3, reps: "10–12", note: "Keep steady pressure. Go close to failure." }
        ]
      },
      {
        day: "Tue",
        label: "Demon Back",
        focus: "Lat Width, Traps & Rear Delts",
        badge: "Ogre Back 🧬",
        color: "#3F7DE8",
        accent: "#5490ff",
        exercises: [
          { id: 304, name: "Bodyweight Pull-Up", method: "Bodyweight", sets: 4, reps: "Max reps", note: "Pull until chest hits the bar on every repetition." },
          { id: 305, name: "Barbell Shrug", method: "Barbell", sets: 3, reps: "10–12", note: "Heavy, squeeze traps at the absolute peak." },
          { id: 306, name: "Cable Face Pull (Rope)", method: "Rope", sets: 4, reps: "15–20", note: "Pull to nose, flare elbows wide to build rear delts." }
        ]
      },
      {
        day: "Thu",
        label: "Ogre Legs",
        focus: "Leg Press, Hamstrings & Calf Loading",
        badge: "Speed & Strength 🌪️",
        color: "#2EAD6B",
        accent: "#3dc97d",
        exercises: [
          { id: 307, name: "Leg Press", method: "Machine", sets: 4, reps: "12–15", note: "Go deep, explode out of the hole." },
          { id: 308, name: "Barbell RDL", method: "Barbell", sets: 4, reps: "10–12", note: "Keep flat back. Stretch hamstrings fully." },
          { id: 309, name: "Leg Press Calf Raise", method: "Machine", sets: 4, reps: "15–20", note: "Constant tension. High volume burn." }
        ]
      },
      {
        day: "Fri",
        label: "Endurance & Core",
        focus: "Full Body Circuits, Core & Grip Carry",
        badge: "Iron Will 🧱",
        color: "#3FE8C8",
        accent: "#4ffff0",
        exercises: [
          { id: 310, name: "Farmer's Carry", method: "Dumbbell", sets: 3, reps: "45s carry", note: "Walk with heavy DBs. Keep traps tight and posture straight." },
          { id: 311, name: "Hanging Leg Raise", method: "Bodyweight", sets: 4, reps: "12–15", note: "Keep body still, lift legs strictly." },
          { id: 312, name: "Plank", method: "Bodyweight", sets: 3, reps: "60s hold", note: "Maximum core tension. Glutes squeezed." }
        ]
      }
    ]
  },
  "one_punch_man": {
    name: "One Punch Man (Arm & Upper Heroic Focus)",
    description: "The ultimate upper body and arms developer, designed to build hero-level punching power, broad front/side delts, and massive bicep/tricep volume.",
    goal: "Big Arms & Upper Body Power (2-Day Express)",
    repRangeTips: "Focus on 10-15 reps with explosive concentric motion and 3-second negatives for optimal muscle tension.",
    warmupTips: "5 mins arm circles, dynamic shoulder dislocates with a band, and 2 light warm-up sets of cable pushdowns.",
    plan: [
      {
        day: "Mon",
        label: "Push Force",
        focus: "Chest, Front/Side Delts, Triceps",
        badge: "Hero Power ⭐",
        color: "#E8533F",
        accent: "#ff6b54",
        exercises: [
          { id: 101, name: "Incline Dumbbell Press", method: "Dumbbell", sets: 4, reps: "10-12", note: "Focus on the deep stretch at the bottom and squeezing upper chest." },
          { id: 102, name: "Machine Chest Press", method: "Machine", sets: 3, reps: "10-12", note: "Strict form, lock your shoulder blades back." },
          { id: 103, name: "Dumbbell Shoulder Press", method: "Dumbbell", sets: 3, reps: "10-12", note: "Keep elbows tucked to ~75 degrees. Don't flare." },
          { id: 104, name: "Single-Arm Cable Lateral Raise", method: "Cable", sets: 4, reps: "12-15", note: "Keep constant cable tension on each side." },
          { id: 105, name: "Machine Tricep Extension", method: "Machine", sets: 4, reps: "12-15", note: "Full lockout at the bottom to target the lateral tricep head." }
        ]
      },
      {
        day: "Wed",
        label: "Pull Strike",
        focus: "Back, Rear Delts, Biceps, Forearms",
        badge: "Limitless ⚡",
        color: "#3F7DE8",
        accent: "#5490ff",
        exercises: [
          { id: 107, name: "Weighted Pull-Up", method: "Weighted", sets: 4, reps: "6-8", note: "Or bodyweight to failure. Pull chest all the way to the bar." },
          { id: 108, name: "Seated Cable Row (V Bar)", method: "V Bar", sets: 3, reps: "8-10", note: "Heavy, dense mid-back thickness." },
          { id: 109, name: "Single-Arm Lat Pulldown", method: "Cable", sets: 3, reps: "10-12", note: "Pull unilaterally down into your back pocket." },
          { id: 110, name: "Reverse Pec Deck", method: "Machine", sets: 4, reps: "12-15", note: "Isolate rear deltoids. Avoid rocking." },
          { id: 111, name: "Single-Arm Dumbbell Preacher Curl", method: "Dumbbell", sets: 4, reps: "10-12", note: "Unilateral focus for massive bicep peaks." }
        ]
      }
    ]
  },
  "titan_strength": {
    name: "Titan's Might (Heavy Compound Power)",
    description: "Built for pure powerlifters and strength enthusiasts. Focuses on heavy multi-joint compounds to recruit maximum motor units and construct a wall of steel.",
    goal: "Absolute Raw Strength Building (3-Day Split)",
    repRangeTips: "Low rep, high load: 5-8 reps. Explode on the upward movement, rest 2-3 minutes between working sets.",
    warmupTips: "Full body foam rolling, hip open mobility, light squat progression, and shoulder rotational warm-ups.",
    plan: [
      {
        day: "Mon",
        label: "Power Press",
        focus: "Heavy Chest, Shoulders, Triceps",
        badge: "Titan Power 🏋️",
        color: "#E8A63F",
        accent: "#f5b94e",
        exercises: [
          { id: 301, name: "Smith Machine Incline Press", method: "Smith Machine", sets: 4, reps: "5-6", note: "Power from the chest. Go heavy with perfect safety." },
          { id: 302, name: "Flat Dumbbell Press", method: "Dumbbell", sets: 4, reps: "6-8", note: "Heavy, press with power from your feet." },
          { id: 303, name: "Smith Machine Shoulder Press", method: "Smith Machine", sets: 3, reps: "6-8", note: "Overhead press strength focus." },
          { id: 304, name: "V Bar Pushdown", method: "V Bar", sets: 4, reps: "8-10", note: "Build maximum lock-out power." }
        ]
      },
      {
        day: "Wed",
        label: "Titan Pull",
        focus: "Heavy Back & Bicep Pulls",
        badge: "Heavy Row 🧱",
        color: "#9B3FE8",
        accent: "#b55fff",
        exercises: [
          { id: 320, name: "Bodyweight Pull-Up", method: "Bodyweight", sets: 4, reps: "8–10", note: "Clean, weighted if possible. Pull back down." },
          { id: 321, name: "Seated Cable Row (Close Grip)", method: "Straight Bar", sets: 4, reps: "6–8", note: "Pull with maximum force under tight posture control." },
          { id: 322, name: "EZ Bar Curl", method: "EZ Bar", sets: 4, reps: "8–10", note: "Build core biceps power. Heavy squeeze." }
        ]
      },
      {
        day: "Fri",
        label: "Titan Lower",
        focus: "Heavy Quads, Hamstrings, Glutes, Core",
        badge: "Unstoppable 🧱",
        color: "#3FE8C8",
        accent: "#4ffff0",
        exercises: [
          { id: 305, name: "Leg Press", method: "Machine", sets: 4, reps: "6-8", note: "Heavy load, do not let knees cave." },
          { id: 306, name: "Barbell RDL", method: "Barbell", sets: 4, reps: "6-8", note: "Hinge deep, power through glutes/hamstrings." },
          { id: 307, name: "Leg Extension Machine", method: "Machine", sets: 3, reps: "10-12", note: "Quad isolation finish." },
          { id: 308, name: "Ab Wheel Rollout", method: "Bodyweight", sets: 3, reps: "8-12", note: "Brace core like a stone wall." }
        ]
      }
    ]
  }
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
  "Machine Chest Press": ["Chest"],
  "Incline Machine Chest Press": ["Chest"],
  "Single-Arm Cable Chest Press": ["Chest"],
  // Shoulders
  "Dumbbell Shoulder Press": ["Front Delts"],
  "Overhead Dumbbell Press": ["Front Delts"],
  "Smith Machine Shoulder Press": ["Front Delts"],
  "Cable Shoulder Press": ["Front Delts"],
  "Machine Shoulder Press": ["Front Delts"],
  "Single-Arm Dumbbell Shoulder Press": ["Front Delts"],
  "Cable Lateral Raise": ["Side Delts"],
  "Dumbbell Lateral Raise": ["Side Delts"],
  "Machine Lateral Raise": ["Side Delts"],
  "Single-Arm Cable Lateral Raise": ["Side Delts"],
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
  "T-Bar Row": ["Upper Back", "Lats"],
  "Chest-Supported T-Bar Row": ["Upper Back"],
  "Single-Arm Dumbbell Row": ["Lats", "Upper Back"],
  "Single-Arm Lat Pulldown": ["Lats"],
  "Machine Row": ["Upper Back", "Lats"],
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
  "Machine Bicep Curl": ["Biceps"],
  "Single-Arm Dumbbell Preacher Curl": ["Biceps"],
  "Hammer Curl": ["Brachialis"],
  "Cable Hammer Curl (Rope)": ["Brachialis"],
  "Incline Hammer Curl": ["Brachialis"],
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
  "Machine Tricep Extension": ["Triceps"],
  "Single-Arm Tricep Pushdown": ["Triceps"],
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
  "Single-Leg Press": ["Quads", "Glutes"],
  "Single-Leg Extension": ["Quads"],
  "Single-Leg Curl": ["Hamstrings"],
  "Single-Leg RDL": ["Hamstrings", "Glutes"],
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

function getMuscleBadgeStyles(muscle: string) {
  const m = muscle.toLowerCase();
  if (m.includes("chest")) {
    return "bg-rose-500/10 text-rose-400 border-rose-500/15";
  }
  if (m.includes("back") || m.includes("lat") || m.includes("row")) {
    return "bg-sky-500/10 text-sky-400 border-sky-500/15";
  }
  if (m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("leg") || m.includes("calve") || m.includes("calf")) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/15";
  }
  if (m.includes("shoulder") || m.includes("delt")) {
    return "bg-purple-500/10 text-purple-400 border-purple-500/15";
  }
  if (m.includes("bicep") || m.includes("tricep") || m.includes("arm") || m.includes("forearm") || m.includes("brachial")) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
  }
  if (m.includes("abs") || m.includes("core")) {
    return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/15";
  }
  return "bg-cyan-500/10 text-cyan-400 border-cyan-500/15";
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
  delEx,
  moveExUp,
  moveExDown,
  themeStyles
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
  moveExUp?: (di: number, ei: number) => void;
  moveExDown?: (di: number, ei: number) => void;
  themeStyles: any;
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
        {/* Reordering Controls (Drag + Clickable Up/Down for Zero Lag) */}
        <div className="flex flex-col items-center gap-1 shrink-0 select-none mt-0.5">
          <button
            onClick={() => moveExUp && moveExUp(activeDay, i)}
            disabled={i === 0}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer transition"
            title="Move Up (Lag-free)"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              dragControls.start(e);
            }}
            className="p-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0 select-none touch-none"
            title="Drag to reorder"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </div>

          <button
            onClick={() => moveExDown && moveExDown(activeDay, i)}
            disabled={i === (cur?.exercises?.length || 0) - 1}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer transition"
            title="Move Down (Lag-free)"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
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
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide ${getMuscleBadgeStyles(m)}`}
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

function resolveDayAbbreviation(dayStr: string): string | null {
  const normalized = dayStr.trim().toLowerCase();
  if (normalized.startsWith("sat")) return "Sat";
  if (normalized.startsWith("sun")) return "Sun";
  if (normalized.startsWith("mon")) return "Mon";
  if (normalized.startsWith("tue")) return "Tue";
  if (normalized.startsWith("wed")) return "Wed";
  if (normalized.startsWith("thu")) return "Thu";
  if (normalized.startsWith("fri")) return "Fri";
  return null;
}

function serializePlanToText(plan: any[]): string {
  return plan.map((d) => {
    let dayText = `=== Day: ${d.day} | Label: ${d.label} ===\n`;
    if (d.focus) {
      dayText += `Focus: ${d.focus}\n`;
    }
    const exercisesText = (d.exercises || []).map((ex: any) => {
      let line = `- ${ex.name} (${ex.sets} sets x ${ex.reps} reps)`;
      const meta: string[] = [];
      if (ex.method) meta.push(`Method: ${ex.method}`);
      if (ex.group) meta.push(`Group: ${ex.group}`);
      if (meta.length > 0) {
        line += ` [${meta.join(" | ")}]`;
      }
      if (ex.note) {
        line += `\n  Note: ${ex.note}`;
      }
      return line;
    }).join("\n");
    return dayText + (exercisesText ? exercisesText + "\n" : "") + "\n";
  }).join("\n").trim();
}

function parseTextToPlan(text: string): any[] {
  const lines = text.split("\n");
  const parsedPlan: any[] = [];
  let currentDay: any = null;
  let currentExercise: any = null;
  let exerciseIdCounter = 1;

  for (let idx = 0; idx < lines.length; idx++) {
    let line = lines[idx].trim();
    if (!line) continue;

    // Check if it's a day header: starts with "===" or contains "Day:"
    if (line.includes("===") || line.toLowerCase().startsWith("day:") || line.toLowerCase().includes("| label:")) {
      // Parse day code (e.g. Sat, Sun, Mon, etc.)
      const dayMatch = line.match(/Day:\s*([A-Za-z]{3,10})/i);
      const labelMatch = line.match(/Label:\s*([^=|]*)/i);
      
      if (dayMatch) {
        // If there was a previous exercise and day, push the exercise
        if (currentExercise && currentDay) {
          currentDay.exercises.push(currentExercise);
          currentExercise = null;
        }

        const rawDay = dayMatch[1];
        const dayCode = resolveDayAbbreviation(rawDay);
        if (!dayCode) {
          throw new Error(`Line ${idx + 1}: Invalid day "${rawDay}". Day must be Sat, Sun, Mon, Tue, Wed, Thu, or Fri.`);
        }

        // Check if day is already defined to avoid duplicates
        if (parsedPlan.some((d) => d.day === dayCode)) {
          throw new Error(`Line ${idx + 1}: Duplicate day "${dayCode}". Each training day should only appear once.`);
        }
        
        const colors = ["#E8533F", "#3F7DE8", "#2EAD6B", "#9B3FE8", "#E8A63F", "#E83F7D", "#3FE8C8"];
        const accents = ["#ff6b54", "#5490ff", "#3dc97d", "#b55fff", "#f5b94e", "#ff5490", "#4ffff0"];
        const ci = parsedPlan.length % colors.length;

        currentDay = {
          day: dayCode,
          label: labelMatch ? labelMatch[1].trim() : "Workout",
          focus: "",
          color: colors[ci],
          accent: accents[ci],
          exercises: []
        };
        parsedPlan.push(currentDay);
        continue;
      }
    }

    if (!currentDay) {
      // Skip lines before any Day is defined
      continue;
    }

    // Check if it's Focus:
    if (line.toLowerCase().startsWith("focus:")) {
      currentDay.focus = line.substring(6).trim();
      continue;
    }

    // Check if it's Note: / Tip: / Note / Tip
    if (line.toLowerCase().startsWith("note:") || line.toLowerCase().startsWith("tip:")) {
      const noteContent = line.replace(/^(note|tip):\s*/i, "").trim();
      if (currentExercise) {
        currentExercise.note = noteContent;
      } else if (currentDay.exercises.length > 0) {
        currentDay.exercises[currentDay.exercises.length - 1].note = noteContent;
      }
      continue;
    }

    // Otherwise, check if it starts with an exercise marker like `-` or a number `1.`
    if (line.startsWith("-") || line.match(/^\d+[\.\)]/)) {
      if (currentExercise && currentDay) {
        currentDay.exercises.push(currentExercise);
        currentExercise = null;
      }

      // Clean the line marker
      const cleanLine = line.replace(/^-\s*/, "").replace(/^\d+[\.\)]\s*/, "").trim();

      // Extract Name, sets/reps, and metadata
      let name = cleanLine;
      let sets = 3;
      let reps = "10–12";
      let method = "Dumbbell";
      let group = "General";

      // Match (sets x reps) or (X sets, Y reps) or (X sets) or similar
      const parenMatch = cleanLine.match(/\(([^)]+)\)/);
      if (parenMatch) {
        const parenContent = parenMatch[1];
        // Remove the parenthesis part from the name
        name = name.replace(parenMatch[0], "").trim();

        if (parenContent.toLowerCase().includes("x")) {
          const parts = parenContent.split(/x/i);
          const setsNum = parseInt(parts[0].replace(/sets?/i, "").trim(), 10);
          if (!isNaN(setsNum)) sets = setsNum;
          reps = parts[1].replace(/reps?/i, "").trim();
        } else {
          // Fallback parsing
          const setsMatch = parenContent.match(/(\d+)\s*sets?/i);
          if (setsMatch) {
            sets = parseInt(setsMatch[1], 10);
          }
          const repsMatch = parenContent.match(/(\d+(?:\s*[-–]\s*\d+|\+?))\s*(?:reps?)?/i);
          if (repsMatch) {
            reps = repsMatch[1].trim();
          }
        }
      }

      // Match metadata [Method: X | Group: Y]
      const bracketMatch = name.match(/\[([^\]]+)\]/);
      if (bracketMatch) {
        const bracketContent = bracketMatch[1];
        name = name.replace(bracketMatch[0], "").trim();

        const methodMatch = bracketContent.match(/Method:\s*([^|\]]+)/i);
        if (methodMatch) {
          method = methodMatch[1].trim();
        }

        const groupMatch = bracketContent.match(/Group:\s*([^|\]]+)/i);
        if (groupMatch) {
          group = groupMatch[1].trim();
        }
      }

      // Final clean name
      name = name.trim();

      currentExercise = {
        id: exerciseIdCounter++,
        name,
        group: group || findGroupForExercise(name),
        method,
        sets,
        reps,
        note: ""
      };
    } else {
      // If a line is not a day, not a focus, not an explicit note, and not an explicit exercise bullet,
      // it could be a continuing note/tip for the current exercise, or we can treat it as an exercise name if currentExercise is empty!
      if (currentExercise) {
        currentExercise.note = (currentExercise.note ? currentExercise.note + "\n" : "") + line;
      } else if (currentDay) {
        // Let's treat it as an exercise name
        currentExercise = {
          id: exerciseIdCounter++,
          name: line,
          group: findGroupForExercise(line),
          method: "Dumbbell",
          sets: 3,
          reps: "10–12",
          note: ""
        };
      }
    }
  }

  // Push the final exercise
  if (currentExercise && currentDay) {
    currentDay.exercises.push(currentExercise);
  }

  return parsedPlan;
}

export default function WorkoutPlanner() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState<"routine" | "volume" | "explore" | "logs" | "copypaste" | "split" | "theme">("routine");
  const [toast, setToast] = useState("");
  const [activeTheme, setActiveTheme] = useState<"purple" | "red" | "orange" | "yellow" | "zinc" | "emerald" | "cyan" | "pink" | "amber">("purple");

  const [showTextEditor, setShowTextEditor] = useState(false);
  const [rawText, setRawText] = useState("");
  const [parseError, setParseError] = useState("");
  const [copied, setCopied] = useState(false);

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
    const savedTheme = localStorage.getItem("wp-theme");

    if (savedTheme) {
      setActiveTheme(savedTheme as any);
    } else {
      setActiveTheme("purple");
    }

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

  // Sync copy/paste rawText whenever copy/paste tab is opened
  useEffect(() => {
    if (activeTab === "copypaste" && plan && plan.length > 0) {
      setRawText(serializePlanToText(plan));
      setParseError("");
      setCopied(false);
    }
  }, [activeTab, plan]);

  // Register Service Worker for offline support
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[Service Worker] Registered successfully with scope:", reg.scope);
          })
          .catch((err) => {
            console.error("[Service Worker] Registration failed:", err);
          });
      });
    }
  }, []);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const handleThemeChange = (t: "purple" | "red" | "orange" | "yellow" | "zinc" | "emerald" | "cyan" | "pink" | "amber") => {
    setActiveTheme(t);
    localStorage.setItem("wp-theme", t);
    showToast(`Theme updated to ${t.toUpperCase()} ✓`);
  };

  // Theme Configuration
  const getThemeConfig = () => {
    const configs = {
      purple: {
        text: "text-violet-400",
        textHover: "hover:text-violet-300",
        bg: "bg-violet-600",
        bgHover: "hover:bg-violet-500",
        border: "border-violet-500",
        borderFocus: "focus:border-violet-500",
        borderFocusRing: "focus:ring-violet-500/30",
        bgLight: "bg-violet-600/15",
        bgLightHover: "hover:bg-violet-600/20",
        borderLight: "border-violet-500/10",
        borderLight15: "border-violet-500/15",
        shadow: "shadow-violet-950/40",
        shadowGlow: "shadow-violet-500/10",
        hex: "#b55fff",
        hexMuted: "#a78bfa",
        engine: "HEAVENLY RESTRICTION ENGINE",
        badge: "DEMON BACK ✓",
        gradient: "from-violet-500 via-fuchsia-500 to-indigo-500",
        badgeColor: "text-violet-400 border-violet-500/20 bg-violet-500/10",
        engineColor: "text-violet-500"
      },
      red: {
        text: "text-red-400",
        textHover: "hover:text-red-300",
        bg: "bg-red-600",
        bgHover: "hover:bg-red-500",
        border: "border-red-500",
        borderFocus: "focus:border-red-500",
        borderFocusRing: "focus:ring-red-500/30",
        bgLight: "bg-red-600/15",
        bgLightHover: "hover:bg-red-600/20",
        borderLight: "border-red-500/10",
        borderLight15: "border-red-500/15",
        shadow: "shadow-red-950/40",
        shadowGlow: "shadow-red-500/10",
        hex: "#ff5454",
        hexMuted: "#f87171",
        engine: "KAIOKEN ENGINE",
        badge: "LIMITLESS POWER ✓",
        gradient: "from-red-500 via-orange-500 to-yellow-500",
        badgeColor: "text-red-400 border-red-500/20 bg-red-500/10",
        engineColor: "text-red-500"
      },
      orange: {
        text: "text-orange-400",
        textHover: "hover:text-orange-300",
        bg: "bg-orange-600",
        bgHover: "hover:bg-orange-500",
        border: "border-orange-500",
        borderFocus: "focus:border-orange-500",
        borderFocusRing: "focus:ring-orange-500/30",
        bgLight: "bg-orange-600/15",
        bgLightHover: "hover:bg-orange-600/20",
        borderLight: "border-orange-500/10",
        borderLight15: "border-orange-500/15",
        shadow: "shadow-orange-950/40",
        shadowGlow: "shadow-orange-500/10",
        hex: "#ff8454",
        hexMuted: "#fb923c",
        engine: "SAIYAN GOD ENGINE",
        badge: "GOD-TIER ULTRA ✓",
        gradient: "from-orange-500 via-red-500 to-yellow-500",
        badgeColor: "text-orange-400 border-orange-500/20 bg-orange-500/10",
        engineColor: "text-orange-500"
      },
      yellow: {
        text: "text-yellow-400",
        textHover: "hover:text-yellow-300",
        bg: "bg-yellow-500",
        bgHover: "hover:bg-yellow-400",
        border: "border-yellow-500",
        borderFocus: "focus:border-yellow-500",
        borderFocusRing: "focus:ring-yellow-500/30",
        bgLight: "bg-yellow-500/15",
        bgLightHover: "hover:bg-yellow-500/20",
        borderLight: "border-yellow-500/10",
        borderLight15: "border-yellow-500/15",
        shadow: "shadow-yellow-950/40",
        shadowGlow: "shadow-yellow-500/10",
        hex: "#facc15",
        hexMuted: "#fef08a",
        engine: "LIMITER BREAKER ENGINE",
        badge: "ONE PUNCH WORKOUT ✓",
        gradient: "from-yellow-400 via-orange-500 to-red-500",
        badgeColor: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
        engineColor: "text-yellow-500"
      },
      zinc: {
        text: "text-zinc-400",
        textHover: "hover:text-zinc-300",
        bg: "bg-zinc-600",
        bgHover: "hover:bg-zinc-500",
        border: "border-zinc-500",
        borderFocus: "focus:border-zinc-500",
        borderFocusRing: "focus:ring-zinc-500/30",
        bgLight: "bg-zinc-600/15",
        bgLightHover: "hover:bg-zinc-600/20",
        borderLight: "border-zinc-500/10",
        borderLight15: "border-zinc-500/15",
        shadow: "shadow-zinc-950/40",
        shadowGlow: "shadow-zinc-500/10",
        hex: "#a1a1aa",
        hexMuted: "#cbd5e1",
        engine: "CUSTOM HYBRID ENGINE",
        badge: "ELITE STRENGTH ✓",
        gradient: "from-zinc-400 via-zinc-200 to-zinc-500",
        badgeColor: "text-zinc-400 border-zinc-800 bg-zinc-900/50",
        engineColor: "text-zinc-400"
      },
      emerald: {
        text: "text-emerald-400",
        textHover: "hover:text-emerald-300",
        bg: "bg-emerald-600",
        bgHover: "hover:bg-emerald-500",
        border: "border-emerald-500",
        borderFocus: "focus:border-emerald-500",
        borderFocusRing: "focus:ring-emerald-500/30",
        bgLight: "bg-emerald-600/15",
        bgLightHover: "hover:bg-emerald-600/20",
        borderLight: "border-emerald-500/10",
        borderLight15: "border-emerald-500/15",
        shadow: "shadow-emerald-950/40",
        shadowGlow: "shadow-emerald-500/10",
        hex: "#10b981",
        hexMuted: "#34d399",
        engine: "BEAST MODE ENGINE",
        badge: "FULL COWL OVERDRIVE ✓",
        gradient: "from-emerald-500 via-teal-500 to-green-500",
        badgeColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
        engineColor: "text-emerald-500"
      },
      cyan: {
        text: "text-cyan-400",
        textHover: "hover:text-cyan-300",
        bg: "bg-cyan-600",
        bgHover: "hover:bg-cyan-500",
        border: "border-cyan-500",
        borderFocus: "focus:border-cyan-500",
        borderFocusRing: "focus:ring-cyan-500/30",
        bgLight: "bg-cyan-600/15",
        bgLightHover: "hover:bg-cyan-600/20",
        borderLight: "border-cyan-500/10",
        borderLight15: "border-cyan-500/15",
        shadow: "shadow-cyan-950/40",
        shadowGlow: "shadow-cyan-500/10",
        hex: "#06b6d4",
        hexMuted: "#22d3ee",
        engine: "SUPER SAIYAN BLUE ENGINE",
        badge: "ULTRA INSTINCT ✓",
        gradient: "from-cyan-500 via-blue-500 to-indigo-500",
        badgeColor: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
        engineColor: "text-cyan-500"
      },
      pink: {
        text: "text-pink-400",
        textHover: "hover:text-pink-300",
        bg: "bg-pink-600",
        bgHover: "hover:bg-pink-500",
        border: "border-pink-500",
        borderFocus: "focus:border-pink-500",
        borderFocusRing: "focus:ring-pink-500/30",
        bgLight: "bg-pink-600/15",
        bgLightHover: "hover:bg-pink-600/20",
        borderLight: "border-pink-500/10",
        borderLight15: "border-pink-500/15",
        shadow: "shadow-pink-950/40",
        shadowGlow: "shadow-pink-500/10",
        hex: "#ec4899",
        hexMuted: "#f472b6",
        engine: "DEMON BACK ENGINE",
        badge: "PINK ROSE OVERLOAD ✓",
        gradient: "from-pink-500 via-rose-500 to-purple-500",
        badgeColor: "text-pink-400 border-pink-500/20 bg-pink-500/10",
        engineColor: "text-pink-500"
      },
      amber: {
        text: "text-amber-400",
        textHover: "hover:text-amber-300",
        bg: "bg-amber-600",
        bgHover: "hover:bg-amber-500",
        border: "border-amber-500",
        borderFocus: "focus:border-amber-500",
        borderFocusRing: "focus:ring-amber-500/30",
        bgLight: "bg-amber-600/15",
        bgLightHover: "hover:bg-amber-600/20",
        borderLight: "border-amber-500/10",
        borderLight15: "border-amber-500/15",
        shadow: "shadow-amber-950/40",
        shadowGlow: "shadow-amber-500/10",
        hex: "#f59e0b",
        hexMuted: "#fbbf24",
        engine: "GOLDEN FRIEZA ENGINE",
        badge: "SUPER SAIYAN GOLD ✓",
        gradient: "from-amber-500 via-yellow-500 to-orange-500",
        badgeColor: "text-amber-400 border-amber-500/20 bg-amber-500/10",
        engineColor: "text-amber-500"
      }
    };
    return configs[activeTheme] || configs.purple;
  };

  const themeStyles = getThemeConfig();

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

  const moveExUp = (di: number, ei: number) => {
    if (ei === 0) return;
    const updated = plan.map((d, i) => {
      if (i !== di) return d;
      const arr = [...d.exercises];
      const temp = arr[ei];
      arr[ei] = arr[ei - 1];
      arr[ei - 1] = temp;
      return { ...d, exercises: arr };
    });
    updatePlan(updated);
  };

  const moveExDown = (di: number, ei: number) => {
    const updated = plan.map((d, i) => {
      if (i !== di) return d;
      if (ei >= d.exercises.length - 1) return d;
      const arr = [...d.exercises];
      const temp = arr[ei];
      arr[ei] = arr[ei + 1];
      arr[ei + 1] = temp;
      return { ...d, exercises: arr };
    });
    updatePlan(updated);
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

  const renameDayLabel = (di: number, newDayLabel: string) => {
    const updated = plan.map((d, i) => (i !== di ? d : { ...d, label: newDayLabel }));
    updatePlan(updated);
    showToast(`Renamed workout to "${newDayLabel}" ✓`);
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
        <div className={`w-12 h-12 border-4 ${themeStyles.borderLight15} border-t-current ${themeStyles.text} rounded-full animate-spin`} />
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

  // Determine active anime template branding dynamically
  const activeTemplateKey = Object.entries(EXPLORE_TEMPLATES).find(([_, item]) => {
    return plan.length === item.plan.length && plan.every((day, idx) => day.label === item.plan[idx]?.label);
  })?.[0];

  const brandTheme = {
    engine: themeStyles.engine,
    title: "IRONPATH",
    gradient: themeStyles.gradient,
    badge: themeStyles.badge,
    badgeColor: themeStyles.badgeColor,
    engineColor: themeStyles.engineColor
  };

  return (
    <div className="min-h-screen bg-[#09090c] text-[#e0e0e0] font-sans pb-32">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 ${themeStyles.text} px-5 py-3 rounded-xl text-xs font-semibold z-[9999] shadow-2xl flex items-center gap-2 whitespace-nowrap`}
          >
            <Sparkles className={`w-4 h-4 ${themeStyles.text} animate-pulse`} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className={`text-[9px] sm:text-[10px] tracking-[0.2em] font-extrabold ${brandTheme.engineColor} uppercase mb-1 flex items-center gap-1.5 truncate`}>
              <Flame className={`w-3.5 h-3.5 ${brandTheme.engineColor} animate-pulse fill-current/10 shrink-0`} />
              <span className="truncate">{brandTheme.engine}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white flex items-center gap-2 flex-wrap">
              <span className={`bg-gradient-to-r ${brandTheme.gradient} bg-clip-text text-transparent uppercase font-black tracking-tight shrink-0`}>
                {brandTheme.title}
              </span>
              <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest border px-2 py-0.5 rounded-full uppercase shrink-0 ${brandTheme.badgeColor}`}>
                {brandTheme.badge}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <span className="text-[9px] font-black tracking-widest uppercase bg-zinc-900 border border-zinc-800/80 px-2.5 py-1.5 rounded-lg text-zinc-400">
              {activeTab === "routine" && "Routine"}
              {activeTab === "volume" && "Volume"}
              {activeTab === "explore" && "Plans"}
              {activeTab === "logs" && "Logs"}
              {activeTab === "copypaste" && "Sync"}
              {activeTab === "split" && "Split"}
              {activeTab === "theme" && "Theme"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        {/* 1. ROUTINE TAB */}
        {activeTab === "routine" && (
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
                        moveExUp={moveExUp}
                        moveExDown={moveExDown}
                        themeStyles={themeStyles}
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
          </div>
        )}

        {/* 2. WEEKLY VOLUME TAB */}
        {activeTab === "volume" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 shadow-xl text-center space-y-2">
              <TrendingUp className={`w-10 h-10 ${themeStyles.text} mx-auto`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Weekly Muscle Volume</h2>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Target weekly sets per muscle group based on your active routine. Optimal hypertrophic volume is 10–20 sets per muscle per week.
              </p>
            </div>

            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

        {/* 3. GOAL-BASED SUGGESTIONS TAB */}
        {activeTab === "explore" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 text-center shadow-xl space-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial pointer-events-none" style={{ background: `radial-gradient(circle at center, ${themeStyles.hex}08, transparent 70%)` }} />
              <Sparkles className={`w-10 h-10 ${themeStyles.text} mx-auto animate-pulse`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Goal-Based Suggestions</h2>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Need a new direction? Choose from one of our curated high-intensity training schedules. Load templates directly into your active routine.
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(EXPLORE_TEMPLATES).map(([key, item]) => {
                const colorsMap: Record<string, { text: string; border: string; bg: string; accent: string }> = {
                  one_punch_man: { text: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5", accent: "#ff6b54" },
                  toji_vtaper: { text: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", accent: "#b55fff" },
                  goku_god_tier: { text: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/5", accent: "#ff8454" },
                  titan_strength: { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", accent: "#f5b94e" },
                  baki_beast: { text: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-500/5", accent: "#ff5490" }
                };
                const colors = colorsMap[key] || { text: "text-violet-400", border: "border-zinc-800", bg: "bg-zinc-900/5", accent: "#a78bfa" };

                const planColor = item.plan[0]?.color || "#a78bfa";
                const planAccent = item.plan[0]?.accent || "#c084fc";
                const isCurrentPlanActive = plan.length === item.plan.length && plan.every((day, idx) => day.label === item.plan[idx]?.label);

                return (
                  <div 
                    key={key} 
                    className="bg-[#121217] border rounded-2xl p-5 shadow-lg space-y-4 hover:border-zinc-700 transition-all duration-300"
                    style={{ borderColor: isCurrentPlanActive ? `${planColor}60` : "rgb(24, 24, 27)" }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${colors.border} ${colors.text} ${colors.bg}`}>
                          {item.goal}
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white mt-1.5 leading-snug">{item.name}</h3>
                      </div>
                      <Dumbbell className={`w-5 h-5 shrink-0 ${colors.text}`} />
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/60 text-xs">
                      <div>
                        <div className="font-extrabold text-zinc-400 uppercase tracking-wider text-[9px] mb-1">🎯 Rep Range Tips</div>
                        <p className="text-zinc-300 leading-normal">{item.repRangeTips}</p>
                      </div>
                      <div>
                        <div className="font-extrabold text-zinc-400 uppercase tracking-wider text-[9px] mb-1">🔥 Warm-up Tips</div>
                        <p className="text-zinc-300 leading-normal">{item.warmupTips}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-zinc-900/80 pt-3">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Routine Schedule Overview</div>
                      <div className="space-y-2.5">
                        {item.plan.map((day, idx) => (
                          <div key={idx} className="flex flex-col gap-1 bg-zinc-950/20 border border-zinc-900/40 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: day.color }}>
                                  {day.day}
                                </span>
                                <span className="font-bold text-zinc-200 text-xs">{day.label}</span>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-medium">{day.focus}</span>
                            </div>
                            <div className="text-xs text-zinc-400 font-medium pl-10">
                              {day.exercises.slice(0, 3).map((e) => e.name).join(", ")}
                              {day.exercises.length > 3 && ` + ${day.exercises.length - 3} more`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isCurrentPlanActive ? (
                      <button
                        disabled
                        style={{
                          borderColor: `${planColor}30`,
                          color: planAccent,
                          backgroundColor: `${planColor}15`
                        }}
                        className="w-full py-3.5 px-4 font-extrabold text-xs rounded-xl border flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Check className="w-4 h-4 shrink-0" style={{ color: planAccent }} />
                        <span className="text-center leading-normal uppercase tracking-wider">
                          Active Routine ✓
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          updatePlan(item.plan);
                          setActiveDay(0);
                          setActiveTab("routine");
                          showToast(`Successfully loaded ${item.name}!`);
                        }}
                        style={{ backgroundColor: planColor }}
                        className="w-full py-3.5 px-4 text-zinc-950 font-black text-xs rounded-xl transition hover:opacity-95 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                      >
                        <Sparkles className="w-4 h-4 shrink-0 text-zinc-950" />
                        <span className="text-center leading-normal whitespace-normal break-words max-w-[calc(100%-24px)] uppercase tracking-wider">
                          Activate {item.name.split(" (")[0]}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. PERFORMANCE LOGS TAB */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 text-center shadow-xl space-y-2">
              <TrendingUp className={`w-10 h-10 ${themeStyles.text} mx-auto`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Performance Dashboard</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Review your session logs, custom notes, and weight progressions across configured routines.
              </p>
            </div>

            {Object.keys(progress).length === 0 ? (
              <div className="text-center py-16 text-zinc-600 bg-[#121217] border border-zinc-900 rounded-2xl">
                <ClipboardList className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-zinc-400 mb-1">No progression logged yet</h3>
                <p className="text-xs text-zinc-500">Tap "Log Set" on any exercise to store your performance.</p>
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
                            <span className={`text-[10px] ${themeStyles.text} ${themeStyles.bgLight} px-2.5 py-1 rounded-md border ${themeStyles.borderLight} font-bold uppercase`}>
                              {sessions.length} entry
                            </span>
                          </div>

                          {/* Session details */}
                          <div className="divide-y divide-zinc-900/60 max-h-80 overflow-y-auto">
                            {[...sessions].reverse().map((session: any, si: number) => (
                              <div key={si} className="p-4 bg-zinc-950/10">
                                <div className="flex justify-between items-center mb-2">
                                  <span className={`text-[11px] font-bold ${themeStyles.text} ${themeStyles.bgLight} border ${themeStyles.borderLight} px-2 py-0.5 rounded`}>
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
                                        <span className={`ml-auto text-[10px] ${themeStyles.text} ${themeStyles.bgLight} border ${themeStyles.borderLight} px-2 py-0.5 rounded font-extrabold uppercase`}>
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

        {/* 5. COPY & PASTE ROUTINE TAB */}
        {activeTab === "copypaste" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 shadow-xl text-center space-y-2">
              <FileText className={`w-10 h-10 ${themeStyles.text} mx-auto`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Fast Copy/Paste Editor</h2>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                Easily backup, transfer, or mass-update your entire training plan. Modify the text block below, then tap Save to update.
              </p>
            </div>

            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rawText);
                    setCopied(true);
                    showToast("Copied routine to clipboard!");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Copy className={`w-4 h-4 ${themeStyles.text}`} />
                  <span>{copied ? "Copied ✓" : "Copy to Clipboard"}</span>
                </button>

                <button
                  onClick={() => {
                    try {
                      if (!rawText.trim()) {
                        setParseError("Text area is empty. Please enter your routine.");
                        return;
                      }
                      const parsed = parseTextToPlan(rawText);
                      if (parsed.length === 0) {
                        setParseError("Could not find any training days in the text structure. Please follow the day header format.");
                        return;
                      }
                      updatePlan(parsed);
                      setParseError("");
                      setActiveDay(0);
                      setActiveTab("routine");
                      showToast("Routine parsed & applied successfully!");
                    } catch (e: any) {
                      setParseError(e.message || "Failed to parse text. Please double check structure.");
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl ${themeStyles.bg} ${themeStyles.bgHover} text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md ${themeStyles.shadow}`}
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Routine</span>
                </button>
              </div>

              {parseError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium leading-relaxed">
                  ⚠️ {parseError}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">Raw Text Block</div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className={`w-full h-80 bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:outline-none ${themeStyles.borderFocus} resize-y leading-relaxed`}
                  placeholder="Paste your training plan text here..."
                />
              </div>

              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60 text-xs space-y-2 leading-relaxed">
                <div className="font-extrabold text-zinc-400 uppercase tracking-widest text-[9px]">Text Format Guidelines</div>
                <p className="text-zinc-500">
                  You can define custom split days and training blocks using standard day headers:
                </p>
                <code className="block p-3 bg-zinc-950 rounded-lg border border-zinc-900 text-zinc-400 text-[10px] leading-relaxed whitespace-pre-wrap">
                  === Day: Mon | Label: Push ==={"\n"}
                  Focus: Chest, Shoulders & Triceps{"\n"}
                  - Incline Dumbbell Press (4 sets x 10-12 reps) [Method: Dumbbell | Group: Chest Press]{"\n"}
                  Note: Slow eccentrics and deep stretch.
                </code>
              </div>
            </div>
          </div>
        )}

        {/* 6. SPLIT DAY MANAGER TAB */}
        {activeTab === "split" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 text-center shadow-xl space-y-2">
              <CalendarDays className={`w-10 h-10 ${themeStyles.text} mx-auto`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Split Day Manager</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Rearrange training days, rename target muscle focuses, delete inactive splits, or create new workout days.
              </p>
            </div>

            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-2">Active Training Days</div>
              
              <div className="space-y-2.5">
                {plan.map((d, idx) => (
                  <div key={idx} className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-xs uppercase">{d.day}</span>
                          <span className="text-[10px] text-zinc-400 font-semibold">{d.label}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">{d.focus || "No muscle focus specified"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          const newDay = prompt(`Change Weekday Code (currently ${d.day}):\nUse Mon, Tue, Wed, Thu, Fri, Sat, or Sun.`, d.day);
                          if (newDay && resolveDayAbbreviation(newDay) !== null) {
                            moveDay(idx, resolveDayAbbreviation(newDay)!);
                          } else if (newDay) {
                            alert("Invalid weekday abbreviation. Please enter Mon, Tue, Wed, Thu, Fri, Sat, or Sun.");
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                        title="Change Weekday (e.g. Mon, Tue)"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          const newLabel = prompt(`Rename Workout Name (currently "${d.label}"):\ne.g. Push, Pull, Legs, Upper, Chest Day...`, d.label);
                          if (newLabel !== null && newLabel.trim() !== "") {
                            renameDayLabel(idx, newLabel.trim());
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                        title="Rename Workout Name"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          const newFocus = prompt(`Update Muscle Focus / Notes (currently "${d.focus || "none"}"):\ne.g. Chest, Shoulders & Triceps`, d.focus);
                          if (newFocus !== null) {
                            const updated = plan.map((pDay, pIdx) => pIdx !== idx ? pDay : { ...pDay, focus: newFocus.trim() });
                            updatePlan(updated);
                            showToast("Updated muscle focus ✓");
                          }
                        }}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                        title="Edit Target Focus / Notes"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (plan.length <= 1) {
                            alert("You must have at least one training day in your split.");
                            return;
                          }
                          if (confirm(`Are you sure you want to delete ${d.day} — ${d.label} and all of its ${d.exercises?.length || 0} exercises?`)) {
                            removeDay(idx);
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer"
                        title="Delete Day"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-900/80 pt-4 space-y-3.5">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Quick Add New Split Day</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      const dayName = prompt("Enter day code (e.g. Mon, Tue, Wed...):", "Mon");
                      if (dayName && resolveDayAbbreviation(dayName) !== null) {
                        addDay(resolveDayAbbreviation(dayName)!, "Push");
                      } else if (dayName) {
                        alert("Invalid day name. Use Mon, Tue, Wed, Thu, Fri, Sat, or Sun.");
                      }
                    }}
                    className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 font-bold text-xs text-center text-zinc-200 transition cursor-pointer"
                  >
                    + Add Push Day
                  </button>
                  <button
                    onClick={() => {
                      const dayName = prompt("Enter day code (e.g. Mon, Tue, Wed...):", "Wed");
                      if (dayName && resolveDayAbbreviation(dayName) !== null) {
                        addDay(resolveDayAbbreviation(dayName)!, "Pull");
                      } else if (dayName) {
                        alert("Invalid day name. Use Mon, Tue, Wed, Thu, Fri, Sat, or Sun.");
                      }
                    }}
                    className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 font-bold text-xs text-center text-zinc-200 transition cursor-pointer"
                  >
                    + Add Pull Day
                  </button>
                  <button
                    onClick={() => {
                      const dayName = prompt("Enter day code (e.g. Mon, Tue, Wed...):", "Fri");
                      if (dayName && resolveDayAbbreviation(dayName) !== null) {
                        addDay(resolveDayAbbreviation(dayName)!, "Legs");
                      } else if (dayName) {
                        alert("Invalid day name. Use Mon, Tue, Wed, Thu, Fri, Sat, or Sun.");
                      }
                    }}
                    className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 font-bold text-xs text-center text-zinc-200 transition cursor-pointer"
                  >
                    + Add Legs Day
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. THEME CUSTOMIZATION TAB */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            <div className="bg-[#121217] border border-zinc-900 rounded-2xl p-6 text-center shadow-xl space-y-2">
              <Sparkles className={`w-10 h-10 ${themeStyles.text} mx-auto animate-pulse`} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">Aesthetic Customizer</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Select your power engine. Every engine completely alters the visual highlights, borders, energy glow, and dashboard graphics of your workout planner.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
              {Object.entries({
                purple: { name: "Purple Toji", desc: "Heavy physical prowess inspired by Heavenly Restriction.", badge: "DEMON BACK ✓", class: "bg-violet-600" },
                red: { name: "Red Kaioken", desc: "A fiery red theme designed for multiplying speed, focus, and training output.", badge: "LIMITLESS POWER ✓", class: "bg-red-600" },
                orange: { name: "Orange Goku", desc: "A bright godly orange aesthetic designed for transcending physical thresholds.", badge: "GOD-TIER ULTRA ✓", class: "bg-orange-600" },
                yellow: { name: "Yellow Saitama", desc: "A powerful yellow theme designed for breaking limits and explosive force.", badge: "ONE PUNCH WORKOUT ✓", class: "bg-yellow-500" },
                emerald: { name: "Emerald Beast", desc: "A high-intensity green theme optimized for raw speed and beast mode adaptation.", badge: "FULL COWL OVERDRIVE ✓", class: "bg-emerald-600" },
                cyan: { name: "Cyan UI", desc: "An ice-blue theme focusing on effortless muscle coordination and cosmic flows.", badge: "ULTRA INSTINCT ✓", class: "bg-cyan-600" },
                pink: { name: "Pink Rose", desc: "A stylish fuchsia/pink theme celebrating high-fashion power and aesthetic cuts.", badge: "PINK ROSE OVERLOAD ✓", class: "bg-pink-600" },
                amber: { name: "Golden Frieza", desc: "A brilliant golden theme highlighting absolute confidence and premium heavy lifts.", badge: "SUPER SAIYAN GOLD ✓", class: "bg-amber-600" },
                zinc: { name: "Classic Zinc", desc: "A pure technical slate hybrid design focused purely on raw biomechanical data.", badge: "ELITE STRENGTH ✓", class: "bg-zinc-600" },
              }).map(([key, t]) => {
                const isSelected = activeTheme === key;
                const cardTheme = key === "purple" ? { text: "text-violet-400", bgLight: "bg-violet-600/10", border: "border-violet-500/20" }
                  : key === "red" ? { text: "text-red-400", bgLight: "bg-red-600/10", border: "border-red-500/20" }
                  : key === "orange" ? { text: "text-orange-400", bgLight: "bg-orange-600/10", border: "border-orange-500/20" }
                  : key === "yellow" ? { text: "text-yellow-400", bgLight: "bg-yellow-500/10", border: "border-yellow-500/20" }
                  : key === "emerald" ? { text: "text-emerald-400", bgLight: "bg-emerald-600/10", border: "border-emerald-500/20" }
                  : key === "cyan" ? { text: "text-cyan-400", bgLight: "bg-cyan-600/10", border: "border-cyan-500/20" }
                  : key === "pink" ? { text: "text-pink-400", bgLight: "bg-pink-600/10", border: "border-pink-500/20" }
                  : key === "amber" ? { text: "text-amber-400", bgLight: "bg-amber-600/10", border: "border-amber-500/20" }
                  : { text: "text-zinc-400", bgLight: "bg-zinc-600/10", border: "border-zinc-850" };

                const borderSelected = key === "purple" ? "border-violet-500 ring-1 ring-violet-500/20 shadow-violet-500/5"
                  : key === "red" ? "border-red-500 ring-1 ring-red-500/20 shadow-red-500/5"
                  : key === "orange" ? "border-orange-500 ring-1 ring-orange-500/20 shadow-orange-500/5"
                  : key === "yellow" ? "border-yellow-500 ring-1 ring-yellow-500/20 shadow-yellow-500/5"
                  : key === "emerald" ? "border-emerald-500 ring-1 ring-emerald-500/20 shadow-emerald-500/5"
                  : key === "cyan" ? "border-cyan-500 ring-1 ring-cyan-500/20 shadow-cyan-500/5"
                  : key === "pink" ? "border-pink-500 ring-1 ring-pink-500/20 shadow-pink-500/5"
                  : key === "amber" ? "border-amber-500 ring-1 ring-amber-500/20 shadow-amber-500/5"
                  : "border-zinc-500 ring-1 ring-zinc-500/20 shadow-zinc-500/5";

                return (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key as any)}
                    className={`text-left p-5 rounded-2xl border transition relative flex flex-col justify-between h-42 cursor-pointer ${
                      isSelected
                        ? `bg-zinc-900 border-2 ${borderSelected} shadow-[0_4px_25px_rgba(0,0,0,0.4)]`
                        : "bg-zinc-950 hover:bg-zinc-900/60 border-zinc-900/80 hover:border-zinc-800"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${t.class} border border-white/20`} />
                        <span className="text-sm font-black text-white">{t.name}</span>
                        {isSelected && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-white/10 ${cardTheme.text}`}>
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-[11px] leading-relaxed pr-6">{t.desc}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-[8px] tracking-wider uppercase font-bold px-2 py-0.5 rounded border ${cardTheme.bgLight} ${cardTheme.text} ${cardTheme.border}`}>
                        {t.badge}
                      </span>
                      {isSelected && <Check className={`w-4 h-4 ${cardTheme.text}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Dock Navigation (Highly detailed, touch friendly, premium layout) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0c0c11]/95 backdrop-blur-md border-t border-zinc-900/90 z-[90] px-2 py-3 shadow-[0_-10px_35px_rgba(0,0,0,0.9)]">
        <div className="max-w-md mx-auto flex items-center justify-around select-none">
          <button
            onClick={() => setActiveTab("routine")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "routine" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Routine</span>
          </button>

          <button
            onClick={() => setActiveTab("volume")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "volume" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Volume</span>
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "explore" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Plans</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "logs" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Logs</span>
          </button>

          <button
            onClick={() => setActiveTab("copypaste")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "copypaste" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Paste</span>
          </button>

          <button
            onClick={() => setActiveTab("split")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "split" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Split</span>
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`flex flex-col items-center gap-1 cursor-pointer transition py-1 px-2 rounded-lg ${
              activeTab === "theme" ? `${themeStyles.text} font-extrabold scale-110` : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Palette className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">Theme</span>
          </button>
        </div>
      </div>

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
                                ? `${themeStyles.bgLight} ${themeStyles.border} ${themeStyles.text}`
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
                                ? `${themeStyles.bgLight} ${themeStyles.border} ${themeStyles.text}`
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
                              ? `${themeStyles.bgLight} ${themeStyles.border} ${themeStyles.text}`
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
                      className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none ${themeStyles.borderFocus}`}
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
                        className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none ${themeStyles.borderFocus}`}
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
                              ? `${themeStyles.bgLight} ${themeStyles.border} ${themeStyles.text}`
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
                                ? `${themeStyles.bgLight} ${themeStyles.border} ${themeStyles.text}`
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
                      className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none ${themeStyles.borderFocus} cursor-pointer`}
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
                      className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none ${themeStyles.borderFocus} h-28 placeholder-zinc-600`}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEditEx(null);
                      showToast("Saved ✓");
                    }}
                    className={`w-full ${themeStyles.bg} ${themeStyles.bgHover} text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg mt-2 cursor-pointer`}
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
                            className={`w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none ${themeStyles.borderFocus} text-center`}
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
                            className={`w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none ${themeStyles.borderFocus} text-center`}
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
                            className={`w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2 text-xs font-bold text-white focus:outline-none ${themeStyles.borderFocus} text-center cursor-pointer`}
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
                        className={`w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold ${themeStyles.text} transition`}
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
                              className={`w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs focus:outline-none ${themeStyles.borderFocus}`}
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
                                className={`w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs focus:outline-none ${themeStyles.borderFocus}`}
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
                            className={`w-full py-2.5 rounded-xl ${themeStyles.bg} ${themeStyles.bgHover} disabled:opacity-40 disabled:hover:${themeStyles.bg} text-white font-bold text-xs shadow-lg transition`}
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
                            <h4 className={`text-xs md:text-sm font-bold text-white leading-tight transition group-hover:${themeStyles.text}`}>
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

        {/* COPY / PASTE MODAL */}
        <AnimatePresence>
          {showTextEditor && (
            <div
              onClick={(e) => e.target === e.currentTarget && setShowTextEditor(false)}
              className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col space-y-5"
              >
                <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className={`w-5 h-5 ${themeStyles.text}`} />
                  <h3 className="text-base font-bold text-white">Copy & Paste Routine</h3>
                </div>
                <button
                  onClick={() => setShowTextEditor(false)}
                  className="p-1 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Copy your entire workout routine as text to back it up or share it. 
                You can also edit the text below or paste a new routine to update the app instantly!
              </p>

              <div className="flex justify-between items-center bg-zinc-900/40 border border-zinc-900 px-4 py-2.5 rounded-xl">
                <span className="text-[10px] tracking-wider uppercase font-bold text-zinc-500">
                  Routine Text Format
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(rawText);
                    setCopied(true);
                    showToast("Routine copied to clipboard ✓");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${themeStyles.bgLight} ${themeStyles.bgLightHover} ${themeStyles.text} ${themeStyles.textHover} transition text-[11px] font-bold cursor-pointer border ${themeStyles.borderLight15}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>
              </div>

              {parseError && (
                <div className="bg-red-500/5 border border-red-500/15 text-red-400 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 leading-relaxed">
                  <span className="font-extrabold select-none mt-0.5">⚠️</span>
                  <div>
                    <span className="font-bold">Parsing Error:</span> {parseError}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 flex-1 flex flex-col">
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setParseError("");
                  }}
                  placeholder="Paste a valid routine or start writing here..."
                  className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none ${themeStyles.borderFocus} font-mono h-[320px] resize-none focus:ring-1 ${themeStyles.borderFocusRing}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowTextEditor(false)}
                  className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-bold text-xs transition border border-zinc-800/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    try {
                      const newPlan = parseTextToPlan(rawText);
                      if (newPlan.length === 0) {
                        setParseError("Could not find any workout days in the text. Make sure you have at least one day formatted like: === Day: Sat | Label: Pull ===");
                        return;
                      }
                      updatePlan(newPlan);
                      setActiveDay(0);
                      setShowTextEditor(false);
                      showToast("Workout routine updated successfully ✓");
                    } catch (err: any) {
                      setParseError(err?.message || "An unexpected error occurred while parsing the text.");
                    }
                  }}
                  className={`py-3 px-4 rounded-xl ${themeStyles.bg} ${themeStyles.bgHover} text-white font-bold text-xs transition shadow-lg ${themeStyles.shadowGlow} cursor-pointer`}
                >
                  Save & Apply Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
