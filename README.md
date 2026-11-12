# X-ARISE: Continuous Cyber Risk Quantification & Investment Optimization Platform (SIH26105)

![X-ARISE Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80)

**X-ARISE** is an enterprise-grade cyber risk quantification, continuous attack validation, and security investment optimization platform built according to the **Factor Analysis of Information Risk (FAIR)** framework and **NIST CSF 2.0**.

---

## 🌟 Core Architecture & Capabilities

1. **🧬 Engine 1: Cyber DNA Matching (Similarity-Based ML)**
   - Extracts 5-dimensional feature vectors (*Sector, Tech Stack, Data Sensitivity, Enterprise Scale, Geographic Perimeter*).
   - Evaluates K-Nearest Neighbors (KNN) cosine similarity against 2010–2026 historical breaches to project breach probability and twin-incident root causes.

2. **🌐 Engine 2: Vendor Supply Chain Risk (Graph-Based Risk Analysis)**
   - Interactive directed dependency network modeling Tier 1, 2, and 3 enterprise suppliers.
   - Real-time simulation of lateral breach propagation with cascading blast radius and financial impact ($ USD).

3. **⚔️ Engine 3: Multi-Vector Continuous Attack Validation Sandbox**
   - 14 real-world attack vectors (*LockBit 3.0 Ransomware, MOVEit Zero-Day, SolarWinds CI/CD Poisoning, AI Voice Deepfakes, Snowflake Cloud IAM, DDoS HTTP/2 Rapid Reset, OT SCADA Sabotage, Volt Typhoon Living-off-the-Land*).
   - **Enterprise Cyber Storm Simulation**: Stress-tests all 14 vectors simultaneously to generate an Enterprise Survival Score.
   - Granular FAIR Model post-simulation financial loss breakdown across 8 cost factors (*Downtime, Extortion, DFIR, Fines, Notification, Litigation, Churn, Restoration*).
   - 1-click mitigation gap fixer & exportable CISO Post-Mortem Incident Audit report.

4. **🎯 Engine 4: Control Effectiveness Scorer (5-Factor MCDA)**
   - Multi-Criteria Decision Analysis evaluating controls across *Configuration Integrity, Incident History, Team Maturity, Maintenance Cadence,* and *Telemetry Integration*.
   - Dynamic Risk Multipliers (1.0x to 2.4x) feeding directly into the enterprise annualized loss model.

5. **💳 Engine 5: Temporal Security Debt Calculator (Time-Based Risk Modeling)**
   - Treats unpatched vulnerabilities as financial debt with daily compounding interest, risk acceleration curves, and drop-dead exploit dates.

6. **💥 Engine 6: Financial Loss Quantification & Capital Allocation Optimizer**
   - Quantifies Total Expected Loss (ALE), Value-at-Risk (VaR 95%), and optimizes security budget allocation to maximize ROI and net savings.

7. **📚 Global Cyber Attacks Intelligence Database (2010–2026)**
   - Authentic case studies spanning *Change Healthcare, CrowdStrike Outage, Snowflake, MGM Resorts, MOVEit, SolarWinds, NotPetya, CDK Global, and Synnovis NHS*.
   - Sector benchmarks (MTTI/MTTC, double extortion rates) and MITRE ATT&CK taxonomy for all 17 cyber attack classifications.

8. **⚡ Real-Time Incursion Injector & Gemini 3.7 Flash AI CISO Advisor**
   - Active zero-day scenario triggers with automated SOAR 1-click containment.
   - AI Board Advisor generating executive memorandums and quantitative risk analysis.

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion, Canvas-Confetti, Recharts
- **Backend / Dev Server**: Node.js (v18+ recommended), Express, Vite, TSX, esbuild
- **Containerization**: Docker & Docker Compose (Multi-stage Node.js 20 Alpine)
- **Zero External API Keys**: 100% standalone, offline-capable FAIR quantitative algorithms & CISO intelligence core

---

## 🐳 Docker Setup & Run Guide (Recommended)

Run X-ARISE inside an isolated, production-optimized container with zero external dependencies.

### Option A: Using Docker Run
```bash
# 1. Build the production Docker image
docker build -t x-arise-ciso .

# 2. Run the container on port 3000
docker run -d -p 3000:3000 --name x-arise-app x-arise-ciso

# 3. View live logs (optional)
docker logs -f x-arise-app
```
Access the application at **http://localhost:3000**.

To stop and remove the container:
```bash
docker stop x-arise-app && docker rm x-arise-app
```

---

### Option B: Using Docker Compose
```bash
# Start the container in detached mode
docker compose up -d --build

# Check container health & status
docker compose ps

# View real-time application logs
docker compose logs -f

# Stop the services
docker compose down
```

---

## 💻 Local Machine Setup Guide

### 1. Clone or Download Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on **http://localhost:3000**.

---

## 📦 Production Build & Deployment

### Build the Application
```bash
npm run build
```
This builds the client application with Vite into `dist/` and bundles `server.ts` into a CommonJS production file `dist/server.cjs`.

### Start Production Server
```bash
npm start
```

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the full-stack app with `tsx server.ts` in dev mode on port 3000 |
| `npm run build` | Compiles Vite frontend & bundles server with esbuild into `dist/` |
| `npm start` | Launches the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript static type checking (`tsc --noEmit`) |
| `docker compose up -d` | Launches production container stack on port 3000 |

---

## 🔒 Security & Offline Resilience

- **Zero-Key Local Engine**: The platform operates with 100% self-contained logic without requiring OpenAI, Gemini, or third-party API keys.
- **Data Privacy**: All quantitative risk models, KNN similarity distances, graph calculations, and executive board memos execute purely in-memory with zero cloud telemetry egress.
