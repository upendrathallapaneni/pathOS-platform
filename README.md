# pathOS.

A sleek, high-fidelity curriculum-to-career mapping platform. **pathOS.** deconstructs traditional, rigid academic syllabi into dynamic, interactive, and modern industry pipelines. 

Students connect their profile nodes to access tailored role blueprints, track milestones from Level 1 to Level 4, and lock in focus tracks complete with technical "Final Boss Projects" matching real-world engineering standards.

---

## 🚀 Key Features

* **Dynamic Focus Personalization:** Once authenticated, the entire platform UI (Hero elements, headings, and overview matrices) dynamically morphs to display the logged-in student's engineering stream (CSE, ECE, EEE, MECH, or CIVIL).
* **Interactive Curriculum Timelines:** Dynamically displays Level-by-Level modules detailing the stacks, theory, and implementation skills required to transition from a beginner to job-ready.
* **Trophy & Final Boss Requirements:** Every career track ends with a "Final Boss Project" (e.g., *Autonomous Navigation Rover* or *Distributed Key-Value Store*) that must be built to prove competency.
* **Fluid Vector Cursor (GPU-Accelerated):** A custom, hardware-accelerated canvas emitter that maps fading particles in the opposite direction of cursor velocity.
* **Responsive Architecture:** Customized layout grids and media break rules built to guarantee an aligned terminal dashboard experience across extra-small mobile interfaces and large desktop monitors.
* **Branch Blueprints:** Multi-tab career maps detailing the starting salaries, software stacks, and roadmap steps for VLSI, Embedded, ML, Data pipelines, Civil, and Mechanical systems.

---

## 🛠️ Technology Stack

* **Front-End Architecture:** Pure HTML5, Vanilla CSS3 (Custom Glassmorphic Variables), and JavaScript (ES6+ Modules).
* **High-Frequency Rendering:** HTML5 Canvas API (Fluid Vector Cursor tracking).
* **Backend Interfaces:** Firebase Authentication & Database syncing scripts.

---

## 📁 Repository Structure

```yaml
├── index.html       # Landing Hub, scrambling preloader, and dynamic dashboard portal
├── login.html       # Secure user node authentication and profile builder
├── vibe.html        # Interactive community chat wall
├── app.js           # Personalization algorithms, cursor engine, and Firebase syncs
├── index.css        # Core global styles, neon themes, and mobile responsive layout grids
├── cse.html         # Computer Science roles (ML, Data, Cyber, Web Developer)
├── ece.html         # Electronics & Communication roles (VLSI, Embedded, SDR Receivers)
├── eee.html         # Electrical Engineering roles (Smart Grids, EV Powertrains, PLCs)
├── mech.html        # Mechanical Engineering roles (Kinematics, FEA simulation, battery BMS)
└── civil.html       # Civil Engineering roles (BIM Dynamo design, GIS Web Maps)
```

---

## 💻 Local Quickstart

To run **pathOS.** locally on your system:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/upendrathallapaneni/pathOS-platform.git
   ```

2. **Navigate to the directory:**
   ```bash
   cd pathOS-platform
   ```

3. **Start a local development server:**
   ```bash
   npx http-server . -p 8000
   ```

4. **Launch in your browser:**
   Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## ⚙️ How Personalization Works

`pathOS` reads the authenticated user's branch from storage. If a match is found:
1. It overrides the generic Hero landing section.
2. It replaces the general engineering cards grid with a detailed, interactive timeline listing specific career paths, steps, stacks, and boss project milestones.
3. Users can hit **"Explore Other Branches"** to temporarily expand the grid, then click **"Return to Track"** to re-orient their focus stream.