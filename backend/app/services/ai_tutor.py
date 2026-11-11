import re
from typing import List, Dict, Any
from app.schemas.schemas import AIAssistantRequest, AIAssistantResponse
from app.core.config import settings

class AITutorService:
    @staticmethod
    def answer_query(request: AIAssistantRequest) -> AIAssistantResponse:
        message = request.message.lower().strip()
        context_type = request.context_type
        
        # 1. Check if user is asking for direct answer to exam or homework
        if any(w in message for w in ["dă-mi răspunsul", "care e rezolvarea", "spune-mi direct", "fă-mi tema", "rezolvă exercițiul"]):
            return AIAssistantResponse(
                reply="Sunt aici să te ajut să înțelegi tu singur pas cu pas, nu să îți dau răspunsul direct! 😊\n\nHai să începem simplu: ce crezi că îți cere exercițiul?",
                guiding_questions=[
                    "Care este primul indiciu din text?",
                    "Ce parte de vorbire sau regulă crezi că se aplică aici?"
                ],
                encouragement="Ai toată capacitatea să rezolvi asta! Facem un pas mic împreună."
            )

        # 2. Substantiv / Cazuri queries
        if any(w in message for w in ["substantiv", "caz", "genitiv", "acuzativ", "nominativ", "dativ"]):
            return AIAssistantResponse(
                reply="Pentru substantive, cel mai mare ajutor este întrebarea magică! ✨\n\n• Cine face acțiunea? ➡️ Cazul Nominativ (Subiect)\n• Pe cine? sau Ce? ➡️ Cazul Acuzativ\n• Al cui? sau A cui? ➡️ Cazul Genitiv\n• Cui dai ceva? ➡️ Cazul Dativ",
                guiding_questions=[
                    "Ce întrebare poți pune pentru cuvântul tău?",
                    "Poți număra cuvântul cu «un» sau «o»?"
                ],
                encouragement="Gândește-te la întrebare ca la o cheiță care descuie cazul potrivit!"
            )

        # 3. Fonetică: Diftong / Hiat
        if any(w in message for w in ["diftong", "hiat", "triftong", "silabă", "silabe", "sunete"]):
            return AIAssistantResponse(
                reply="Regula de aur a silabei: o silabă are O SINGURĂ VOCALĂ plină! 🟡\n\n• Desparte cuvântul bătând din palme: soa-re.\n• Dacă două sunete vocale rămân în aceeași silabă ➡️ DIFTONG (soa-).\n• Dacă două vocale se despart în silabe diferite ➡️ HIAT (po-e-zi-e).",
                guiding_questions=[
                    "Cum se desparte cuvântul tău în silabe?",
                    "Unde pică sunetele vocale: în aceeași silabă sau în silabe vecine?"
                ],
                encouragement="Bate din palme la fiecare silabă! Ritmul te va ajuta să auzi despărțirea."
            )

        # 4. Figuri de stil: Epitet, Metaforă, Personificare
        if any(w in message for w in ["epitet", "metafor", "personificare", "figură de stil", "figuri"]):
            return AIAssistantResponse(
                reply="Figurile de stil sunt culorile textului literar! 🎨\n\n• EPITET: Un adjectiv neobișnuit (ex: «soare blând» - soarele are suflet bun).\n• PERSONIFICARE: Când un lucru face ce face un om (ex: «vântul plânge»).\n• METAFORĂ: O comparație fără cuvântul «ca» (ex: luna este «regina nopții»).",
                guiding_questions=[
                    "Cuvântul descrie o însușire (epitet) sau o acțiune omenească (personificare)?",
                    "Apare cuvântul «ca» sau comparația este ascunsă?"
                ],
                encouragement="Închide ochii o secundă și imaginează-ți tabloul. Ce simți când citești expresia?"
            )

        # 5. Compunere / Redactare narativă (Subiectul II)
        if any(w in message for w in ["compunere", "redactare", "subiectul 2", "subiectul ii", "narațiune", "150 de cuvinte", "eseu"]):
            return AIAssistantResponse(
                reply="Să organizăm compunerea fără stres, în 3 căsuțe mentale: 📦\n\n1. INTRODUCERE (Cine? Unde? Când?)\n«Într-o zi însorită, eram cu cățelul meu în parc...»\n\n2. CUPRINS (Ce s-a întâmplat? Ce problemă a apărut?)\nPovestește aventura pe scurt și adaugă 2 detalii despre cum arăta locul.\n\n3. ÎNCHEIERE (Cum s-a terminat? Ce ai simțit?)\n«Am învățat că prietenia este cea mai valoroasă...»",
                guiding_questions=[
                    "Care este personajul tău principal și unde are loc întâmplarea?",
                    "Ce mic obstacol sau surpriză apare în mijlocul acțiunii?"
                ],
                encouragement="Scrie mai întâi ideile pe scurt, ca pe o listă de cumpărături. Apoi le unim în propoziții!"
            )

        # 6. Default encouraging Socratic response
        return AIAssistantResponse(
            reply=f"Te ascult cu drag! Ai întrebat despre: «{request.message}».\n\nHai să desfacem această problemă în bucăți mai mici, ca pe un puzzle: ce parte ți se pare cea mai neclară?",
            guiding_questions=[
                "Este o întrebare despre textul literar sau despre gramatică?",
                "Ai încercat să asculți textul cu butonul audio înainte de a răspunde?"
            ],
            encouragement="Suntem o echipă! Împreună o să stăpânești materia pentru Evaluarea Națională."
        )
