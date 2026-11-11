# 📖 Hat-Hét Dislexia — Evaluarea Națională

> **Aplicație adaptată pentru elevii cu dislexie dedicată pregătirii pentru Evaluarea Națională (clasa a VIII-a), pornind cu materia de Limba și Literatura Română.**

[![CI Pipeline](https://github.com/Myserytale/hat-het_dislexia/actions/workflows/ci.yml/badge.svg)](https://github.com/Myserytale/hat-het_dislexia/actions)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/DevOps-Docker%20Compose-2496ED.svg)](https://www.docker.com/)

---

## 🌟 Despre Proiect

Elevii cu dislexie se confruntă la Evaluarea Națională cu un efort cognitiv imens legat de descifrarea textelor lungi, aglomerația vizuală și gestionarea timpului. **Hát-Hét Dislexia** rezolvă aceste provocări prin două moduri complementare:

### 1. 📘 Modul de Învățare
- **Lecții pe bucăți mici (*Chunking*)**: Fiecare noțiune este împărțită în pași simpli (1-2 fraze esențiale).
- **Materiale Audio & Sinteză Vocală**: Elevul poate asculta textele și explicațiile prin Web Speech API (`ro-RO`).
- **Scheme Mentale Vizuale**: Hărți pastelate care evidențiază legăturile gramaticale.
- **Riglă de Citire Activă**: Ghid vizual pe axa cursorului pentru a nu sări rândurile.
- **Paletă Cromatică Pastelată**: Culori calde (Crem, Mentă, Piersică, Cer) care combat sindromul Meares-Irlen (stresul vizual).
- **Fonturi Specializate**: Lexend, Atkinson Hyperlegible și OpenDyslexic cu spațiere generoasă.
- **Asistent AI Ghidat („Lumi”)**: Asistent educațional socratic care ajută elevul să își organizeze ideile și explică noțiunile fără a oferi rezolvarea pe tavă.

### 2. 🎓 Modul de Examen
- **Simulare Oficială a Evaluării Naționale**: Structură conform modelului Ministerului Educației (Subiectul I A/B și Subiectul II).
- **Adaptări CES Aprobate Exclusiv**:
  - Timp suplimentar (+60 minute, total 180 minute cu cronometru adaptat).
  - Citire audio a cerințelor și a textului suport.
  - Fără indicii sau asistent AI pe durata examenului.
- **Diagnostic Post-Simulare**: 
  - Notare automată + acordarea celor 10 puncte din oficiu.
  - Identificarea exactă a fiecărei greșeli cu explicații calde și constructive.
  - **Recomandări Țintite**: Butoane cu trimitere directă înapoi la lecțiile din programa pe care elevul are nevoie să le repete!

---

## 🚀 Pornire Rapidă (Quick Start)

### Opțiunea A: Cu Docker Compose (Recomandat — O singură comandă)
```bash
docker compose up --build
```
- Aplicația web: `http://localhost:3000` (sau `http://localhost:80`)
- API Backend & Swagger Docs: `http://localhost:8000/docs`

---

### Opțiunea B: Rulare Locală (Pentru Dezvoltare)

#### 1. Backend (FastAPI + Python 3.12+)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Pe Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API-ul și documentația interactivă vor fi disponibile la `http://localhost:8000/docs`.

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Interfața se va deschide la `http://localhost:5173` (cu proxy automat către backend pe `/api`).

---

## 👥 Structura Echipei & Responsabilități

| Rol | Responsabilități Cheie | Fișiere Principale |
| :--- | :--- | :--- |
| **👑 Backend Dev + DB + DevOps** *(Lead)* | API REST FastAPI, Modele SQLAlchemy, Barem examen, Docker, CI/CD | `backend/app/`, `Dockerfile`, `docker-compose.yml`, `.github/` |
| **💻 Frontend Dev** | Arhitectură React, Rutare, Stare accesibilitate, Interfață adaptivă | `frontend/src/` |
| **🎨 UI/UX Designer** | Teme pastelate, Tipografie dislexie (Lexend), Riglă de citire | `frontend/src/styles/dyslexia.css` |
| **🤖 AI Dev** | Modelul Socratic Lumi, Prompt engineering, Guardrails anti-fraudă | `backend/app/services/ai_tutor.py` |
| **🧪 QA / Software Tester** | Suită teste automate Pytest, Verificare WCAG 2.1 AA/AAA | `backend/tests/` |
| **📋 Project Manager / BA** | Aliniere cu programa Evaluării Naționale și legislația CES | `docs/ARCHITECTURE.md` |
| **🔬 Educational Researcher** | Fundamente pedagogice: Teoria Dublului Codaj & Orton-Gillingham | `docs/ARCHITECTURE.md` |

Detalii complete pentru fiecare rol se găsesc în [`docs/ARCHITECTURE.md`](file:///home/lev/hat-het_dislexia/docs/ARCHITECTURE.md).

---

## 🧪 Testare Automată (QA)

Backend-ul include 7 teste unitare și de integrare ce validează toate fluxurile critice:
```bash
cd backend
pytest -v
```
Toate testele rulează automat la fiecare `push` prin GitHub Actions.

---

## 📜 Licență
Proiect realizat pentru sprijinirea accesului egal la educație al elevilor cu dificultăți de învățare.
