<div align="center">

# 🚀 Attendio
### *Smart Lecture Attendance Tracker & Safe-Skip Calculator*

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/built%20with-HTML5%20%7C%20CSS3%20%7C%20JS-orange" alt="Tech Stack">
</p>

<p align="center">
  <b>Never drop below your mandatory attendance threshold again.</b><br>
  Built for students, by a student.
</p>

</div>

---

## 📋 Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [The Mathematics Behind Attendio](#-the-mathematics-behind-attendio)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Project Roadmap](#-project-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

Juggling multiple subjects, labs, and lectures while trying to maintain a strict attendance requirement (like the common 75% rule) can be mentally exhausting. Manual calculations lead to mistakes, and realizing you're short on attendance right before finals is a nightmare.

**Attendio** solves this. It is a lightweight, clean, and blazing-fast web application designed to track class attendance in real-time, compute safety thresholds, and tell you precisely how many classes you can safely skip—or how many you need to rush to attend.

---

## ✨ Key Features

* **📊 Real-Time Percentage Tracking:** Instantly calculates your attendance standing per subject as soon as you log a session.
* **🛡️ Smart Safe-Skip Engine:** Automatically computes how many consecutive lectures you can miss without falling below the critical threshold.
* **⚡ Recovery Mode:** If you're already in the danger zone, it calculates the exact number of consecutive classes you must attend to recover your percentage.
* **💾 Local-First Persistence:** Utilizes browser `localStorage` so your data stays safe and private on your device without needing an external database.
* **🎨 Modern UI/UX:** Built with a clean, distraction-free aesthetic featuring color-coded status badges (Green for safe, Red for danger).

---

## math The Mathematics Behind Attendio

The app relies on robust threshold calculations based on your target percentage $T$ (default is $75$):

### 1. Current Percentage
$$\text{Percentage} = \left( \frac{\text{Attended ($A$)}}{\text{Total ($T\_{ot}$)}} \right) \times 100$$

### 2. Safe-Skip Limit (When above target)
If your current percentage exceeds the requirement, how many classes ($x$) can you miss in a row?
$$\frac{A}{T_{ot} + x} \ge \frac{T}{100} \implies x = \left\lfloor \frac{100A - T \cdot T_{ot}}{T} \right\rfloor$$

### 3. Recovery Requirement (When below target)
If you fall short, how many classes ($y$) must you attend consecutively to bounce back?
$$\frac{A + y}{T_{ot} + y} \ge \frac{T}{100} \implies y = \left\lceil \frac{T \cdot T_{ot} - 100A}{100 - T} \right\rceil$$

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 / Tailwind CSS
* **Scripting:** Vanilla JavaScript (ES6+)
* **Storage:** Web Storage API (`localStorage`)
* **Versioning:** Git & GitHub

---

## 🚀 Getting Started

To run a local copy of Attendio on your machine, follow these simple steps.

### Prerequisites
You only need a modern web browser (Chrome, Firefox, Edge, Safari) and a code editor like VS Code.

### Installation
1. **Clone the repository**
   ```bash
   git clone [https://github.com/singharunn/attendio.git](https://github.com/singharunn/attendio.git)
