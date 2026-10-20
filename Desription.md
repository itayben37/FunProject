# Project: Tactical C2 & Interception Management System

### Operational Background

A command and control (C2) operations center continuously receives real-time feeds from various radars and sensors detecting aerial and ground threats (coordinates, velocity vectors, target classifications). The system aggregates these inputs into a unified operational picture, calculates flight trajectories, assesses threat levels, and provides optimal interceptor-allocation recommendations based on time-to-impact, interception probability, and asset availability.

---

### 1. Core Competencies: OOP, Data Structures & Algorithms

* **Data Structures & Algorithms:**
* **Priority Queue / Min-Heap:** Prioritizes and tracks incoming threats based on urgency (Time to Impact / Threat Score), ensuring critical threats are evaluated first.
* **Graph Matching (Bipartite Matching / Hungarian Algorithm):** Solves the Weapon-Target Assignment (WTA) problem by finding the optimal mapping between $N$ active threats and $M$ interceptors/batteries under cost, range, and latency constraints.
* **Computational Geometry & Spatial Indexing (Quadtree / R-Tree):** Enables fast geospatial range and proximity queries across dynamic objects on the tactical grid.


* **Object-Oriented Programming (OOP):**
* **Class Hierarchies:** Clear domain abstractions such as `Target` (with sub-classes like `UAVTarget`, `BallisticTarget`), `Interceptor` (`DroneInterceptor`, `MissileBattery`), and dedicated vector-math/kinematics classes.
* **Design Patterns:**
* **Strategy Pattern:** Swappable allocation algorithms (e.g., minimal ammunition consumption vs. minimum response time).
* **Observer / Pub-Sub:** Dispatches target movement and telemetry updates across downstream system components.





---

### 2. Full-Stack Architecture & Technologies

#### Backend (Node.js/Express with TypeScript + ORM + PostgreSQL/PostGIS)

* **PostgreSQL + PostGIS:** Spatial database capabilities for geospatial distance calculations, polygon boundary evaluations (geofencing), and protected defense zones.
* **ORM (Prisma / TypeORM):** Domain entity modeling, migrations, and relational integrity for operators, defensive batteries, event logs, and operational audit trails.
* **WebSockets / Socket.io:** Real-time bi-directional streaming of telemetry and simulated target coordinates to connected clients.
* **Clean Code & Layered Architecture:**
* `Controllers`: Handle operational commands (authorize interception, update operational zones).
* `Services`: Manage business logic and orchestrate data flows to the core engine.
* `Engine / Core`: Self-contained, framework-agnostic mathematical and algorithmic modules isolated from web and database concerns.



#### Frontend (ReactJS + TypeScript)

* **Interactive Tactical Map:** MapLibre GL or Leaflet integration rendering tactical layers: protected zones, battery perimeters, velocity vectors, and standardized tactical map icons.
* **Real-Time Threat Dashboard:** Live threat table ordered by priority score, complete with contextual alerts and badges.
* **State Management:** Zustand or Redux Toolkit handling high-frequency telemetry updates efficiently without unnecessary re-renders.
* **Operator Action Interface:** Dedicated engagement modals requiring explicit user confirmation to execute algorithmic recommendations (e.g., "Authorize Launch").

---

### 3. Team Collaboration, Clean Code & DevOps

1. **Team Work Breakdown (3–4 Developers):**
* **Developer A (Backend & Core Architecture):** Server scaffolding, ORM integration with PostgreSQL, role-based access control (Operator / Duty Officer), and REST API design.
* **Developer B (Algorithms & Simulation):** Target trajectory simulation engine, threat scoring via Priority Queues, and the assignment matching engine.
* **Developer C (Frontend & Tactical Map):** React client architecture, tactical map layers, coordinate transforms, and dynamic moving-entity rendering.
* **Developer D (Real-Time Streams, UI & DevOps):** WebSocket bridge between server and UI, alert panels, state optimization, and CI/CD automation.


2. **Git Workflow & Standards:**
* Trunk-based or feature-branch workflow (`feature/map-layers`, `feature/interceptor-matching`).
* Mandatory peer Code Reviews and approvals prior to merging Pull Requests.
* Strict adherence to Conventional Commits (`feat:`, `fix:`, `refactor:`).


3. **Code Quality & Testing:**
* **Unit & Integration Testing (Jest):** High coverage on assignment algorithms and edge cases (e.g., collision courses, out-of-range interceptors, concurrent fire allocation).
* Automated static analysis via ESLint and Prettier, enforced using Git pre-commit hooks (Husky).


4. **Deployment & Infrastructure:**
* **Docker & Docker Compose:** Reproducible single-command local orchestration containing PostgreSQL (with PostGIS), the Backend server, and the Frontend development build.
* **GitHub Actions:** CI pipeline executing linting, type-checking, and test suites on every pull request.
* **Cloud Deployment:** Containerized backend deployment on platforms such as Render, Railway, or Fly.io, with static frontend assets served via Vercel or Netlify.