# 🏛️ Arhitectura Aplicației: Hát-Hét Dislexia (Evaluarea Națională)

Acest document descrie arhitectura sistemului, fluxul de date și responsabilitățile fiecărui membru din echipă.

---

## 1. Prezentare Generală & Principii de Bază
Aplicația este construită pentru a sprijini elevii cu **dislexie și dificultăți specifice de învățare** în pregătirea pentru **Evaluarea Națională (clasa a VIII-a)**, pornind cu materia de **Limba și Literatura Română**.

### Cele Două Moduri Fundamentale:
1. **Modul de Învățare**:
   - Conținut fragmentat în pași mici (*chunking*) pentru evitarea oboselii cognitive.
   - Suport audio integral (sinteză vocală TTS) și scheme mentale vizuale (*mindmaps*).
   - Asistent AI ghidat (*Socratic Tutor*) care explică noțiunile pas cu pas fără a da răspunsuri de-a gata.
   - Posibilitate de personalizare vizuală completă (culori pastel, fonturi cu greutate inferioară precum Lexend/OpenDyslexic, riglă de citire).

2. **Modul de Examen**:
   - Condiții simulate oficiale (baremele Ministerului Educației).
   - Forme de sprijin permise legal la examen (timp suplimentar +60 min, asistență audio la citirea cerințelor, riglă vizuală).
   - Fără indicii sau explicații ajutătoare pe durata examenului.
   - Diagnostic post-simulare cu identificarea exactă a lipsurilor și trimitere directă înapoi la lecțiile corespondente.

---

## 2. Ghid pe Roluri în Echipă

### 🛠️ Rolul 1: BACKEND DEV + DATABASE + DEVOPS (Rolul Principal)
- **Stack**: FastAPI (Python 3.12+), SQLAlchemy ORM, Pydantic v2, SQLite (local) / PostgreSQL (production), Docker, Docker-Compose, GitHub Actions CI.
- **Fișiere Cheie**:
  - `backend/app/main.py`: Punctul de intrare, middleware CORS, servire statică SPA.
  - `backend/app/api/`: Rutere REST (`/lessons`, `/exams`, `/preferences`, `/ai`).
  - `backend/app/models/entities.py`: Modelele SQLAlchemy pentru lecții, examene, rezultate și preferințe.
  - `backend/app/services/exam_service.py`: Logica de corectare conform baremului, acordarea celor 10 puncte din oficiu, diagnostic și recomandări.
  - `backend/app/seed_data.py`: Popularea inițială cu lecții reale de limba română (morfologie, fonetică, figuri de stil, compunere narativă).
  - `Dockerfile` & `docker-compose.yml`: Containerizare completă cu orchestrare multi-container.
  - `.github/workflows/ci.yml`: Pipeline automat de testare și construire.

---

### 💻 Rolul 2: FRONTEND DEV
- **Stack**: React 18, Vite, CSS personalizat cu variabile tematice.
- **Fișiere Cheie**:
  - `frontend/src/context/AccessibilityContext.jsx`: Starea globală de accesibilitate (font, mărime, contrast, viteză audio).
  - `frontend/src/components/AccessibilityBar.jsx`: Bara de ajustare rapidă a fontului și temei pastel.
  - `frontend/src/components/ReadingRuler.jsx`: Rigla de citire pe axa Y a cursorului pentru prevenirea saltului de rânduri.
  - `frontend/src/components/AudioPlayer.jsx`: Integrare Web Speech API (`ro-RO`).
  - `frontend/src/pages/LearningMode.jsx`: Navigare pe bucăți (*chunks*), carduri vizuale și mini-quiz.
  - `frontend/src/pages/ExamMode.jsx`: Cronometru adaptat (180 min), cerințe oficiale, contor de cuvinte pentru Subiectul II.
  - `frontend/src/pages/ResultsPage.jsx`: Afișare diagnostic, greșeli și butoane spre lecții.

---

### 🎨 Rolul 3: UI/UX DESIGNER
- **Paletă Cromatică Pastelată**:
  - *Pastel Crem*: `#FAF6EE` (Fundal) / `#2C3539` (Text) — elimină strălucirea albă dură (*visual glare*).
  - *Pastel Mentă*: `#F0FDF4` (Claritate calmă).
  - *Pastel Piersică*: `#FFF7ED` (Căldură cromatică).
  - *Pastel Cer*: `#F0F7FF` (Liniște cognitivă).
- **Tipografie Adaptată**:
  - *Lexend* și *Atkinson Hyperlegible*: Litere cu proporții optimizate pentru a reduce confuzia între litere similare (`b/d`, `p/q`, `m/n`).
  - Spațiere mărită: `letter-spacing: 0.08em; word-spacing: 0.16em; line-height: 1.85`.
- **Minimalism & Focus**: Fără bannere stridente, butoane tactile mari, un singur concept principal pe ecran.

---

### 🤖 Rolul 4: AI DEV
- **Obiectiv**: Asistentul pedagogic **Lumi** (model Socratic).
- **Fișiere Cheie**: `backend/app/services/ai_tutor.py`.
- **Reguli de Prompting**:
  - **Fără rezolvări directe**: Dacă elevul întreabă „dă-mi răspunsul”, asistentul redirecționează cu întrebări ajutătoare.
  - **Răspunsuri scurte & aerisite**: Liste cu buline, maximum 3 fraze consecutive.
  - **Organizarea ideilor**: Schemă în 3 pași pentru compunerea de la Subiectul II (Introducere -> Cuprins -> Încheiere).
  - **Suport multi-furnizor**: Funcționează imediat offline prin motorul euristic intern, având suport nativ pentru OpenAI / Gemini prin variabile de mediu (`OPENAI_API_KEY`, `GEMINI_API_KEY`).

---

### 🧪 Rolul 5: QA / SOFTWARE TESTER
- **Suite de Teste**:
  - Rulare teste backend: `cd backend && pytest -v` (toate cele 7 teste unitare trec).
  - Cazuri testate:
    1. `test_health_check`: Disponibilitate serviciu.
    2. `test_get_lessons`: Preluare listă lecții și filtrare.
    3. `test_get_lesson_detail`: Integritate bucăți (*chunks*) și schemă.
    4. `test_get_exam`: Securitate (răspunsurile corecte sunt ascunse în modul de examen).
    5. `test_submit_exam`: Barem de notare, puncte oficiu, generare erori și mapare la recomandări.
    6. `test_ai_tutor_socratic`: Blocare rezolvări directe & ghidaj gramatical.
    7. `test_preferences`: Persistență setări accesibilitate.
- **Checklist Accesibilitate (WCAG 2.1 AA/AAA)**:
  - Contrast text/fundal peste 4.5:1.
  - Navigabilitate prin tastatură (`Tab`, `Enter`).
  - Cititoare de ecran și Web Speech API funcționale.

---

### 📋 Rolul 6: PROJECT MANAGER + BUSINESS ANALYST
- **Aliniere cu Procedurile Ministerului Educației**:
  - Respectarea metodologiei privind asigurarea condițiilor de egalizare a șanselor pentru elevii cu CES (Timp suplimentar cu până la 60 minute, folosirea cititorilor audio, mărirea caracterelor).
- **Indicatori Cheie de Performanță (KPI)**:
  - Rata de finalizare a simulărilor.
  - Creșterea punctajului la a doua simulare după parcurgerea lecțiilor recomandate.
  - Nivelul de satisfacție al elevului (reducerea anxietății la citire).

---

### 🔬 Rolul 7: EDUCATIONAL RESEARCHER
- **Fundamente Pedagogice**:
  - **Teoria Încărcării Cognitive (Sweller)**: Reducerea încărcării exterioare prin eliminarea elementelor decorative inutile.
  - **Teoria Dublului Codaj (Paivio)**: Asocierea textului cu reprezentări audio și scheme mentale vizuale colorate.
  - **Abordarea Multisenzorială Orton-Gillingham**: Elevul vede cuvântul, îl aude rostit, îl desparte în silabe și îl asociază cu o culoare gramaticală (ex: Substantiv = Galben, Genitiv = Roșu-cărămiziu).
