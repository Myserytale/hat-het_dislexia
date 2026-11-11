from app.models.entities import LessonModel, ExamModel, UserPreferenceModel
from app.core.database import SessionLocal, Base, engine

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(LessonModel).first():
        db.close()
        return

    # Seed User Preferences default
    default_prefs = UserPreferenceModel(
        id="default",
        font_family="OpenDyslexic",
        font_size=19,
        letter_spacing=0.08,
        line_height=1.85,
        color_theme="pastel-cream",
        reading_ruler_enabled=True,
        tts_speed=0.9,
        syllable_highlight=False,
        extra_time_minutes=60
    )
    db.add(default_prefs)

    # 1. Lesson: Substantivul
    lesson_substantiv = LessonModel(
        id="substantivul-si-cazurile",
        title="Substantivul: Gen, Număr și Cazuri",
        category="Morfologie",
        difficulty="Esențial EN",
        order=1,
        summary="Învață să recunoști substantivul și cazurile lui folosind întrebări simple și trucuri de memorie vizuale.",
        audio_summary="Substantivul este partea de vorbire care denumește ființe, lucruri, fenomene sau stări. Pentru a-l recunoaște ușor, folosește metoda numărării: un băiat, doi băieți.",
        tags=["substantiv", "morfologie", "cazuri", "genitiv", "acuzativ", "subiectul-I-B"],
        chunks=[
            {
                "chunk_index": 1,
                "title": "1. Ce este substantivul?",
                "content": "Substantivul denumește tot ce ne înconjoară:\n• Ființe: copil, pisică, pasăre\n• Lucruri: carte, bancă, stilou\n• Fenomene ale naturii: ploaie, zăpadă, vânt\n• Idei sau stări: prietenie, bucurie, curaj.\n\nTruc de recunoaștere: Numără cuvântul!\nDacă poți spune «un... / doi...» sau «o... / două...», este un substantiv!",
                "audio_text": "Substantivul denumește ființe, lucruri sau stări. Trucul de aur: numără cuvântul! Dacă poți spune un câine, doi câini, este sigur un substantiv.",
                "highlight_keywords": ["ființe", "lucruri", "stări", "numără cuvântul"],
                "visual_clue": "🐶 📘 🌧️ ✨",
                "quick_quiz": {
                    "question": "Care dintre următoarele cuvinte este un substantiv?",
                    "options": ["Alergați", "Căldură", "Frumos", "Ieri"],
                    "correct_index": 1,
                    "hint": "Gândește-te: pe care îl poți număra sau reprezintă o senzație/stare?",
                    "explanation": "«Căldură» este un substantiv (o căldură). «Alergați» este verb, «frumos» este adjectiv, iar «ieri» este adverb."
                }
            },
            {
                "chunk_index": 2,
                "title": "2. Genul și Numărul",
                "content": "În limba română avem trei genuri. Folosește regula degetelor:\n\n1. Masculin (Albastru 🔵): un băiat — doi băieți\n2. Feminin (Roz 🌸): o fată — două fete\n3. Neutru (Verde 🟢): un dulap — două dulapuri (se numără ca un masculin la singular și ca un feminin la plural!).",
                "audio_text": "Avem trei genuri. Masculin: un băiat, doi băieți. Feminin: o fată, două fete. Neutru: un dulap, două dulapuri.",
                "highlight_keywords": ["Masculin", "Feminin", "Neutru", "Singular", "Plural"],
                "visual_clue": "🔵 Masculin | 🌸 Feminin | 🟢 Neutru",
                "quick_quiz": {
                    "question": "Ce gen are substantivul «creion»?",
                    "options": ["Masculin", "Feminin", "Neutru"],
                    "correct_index": 2,
                    "hint": "Numără: un creion, două...",
                    "explanation": "Spunem «un creion / două creioane». Este genul neutru!"
                }
            },
            {
                "chunk_index": 3,
                "title": "3. Cazurile pe scurt (Ghidul Întrebărilor)",
                "content": "La Evaluarea Națională, întrebarea te salvează:\n\n• Nominativ (N): Cine? Ce face acțiunea? (Ex: «Elevul citește» -> Elevul = N, Subiect)\n• Acuzativ (Ac): Pe cine? Ce? Cu cine? Despre ce? (Ex: «Văd o pasăre», «Merg cu trenul»)\n• Genitiv (G): Al cui? A cui? Ai cui? Ale cui? (Ex: «Cartea băiatului»)\n• Dativ (D): Cui? Dăruiesc cuiva. (Ex: «I-am spus Mariei»)\n• Vocativ (V): Chemare sau strigare! Fără funcție sintactică. (Ex: «Copile, vino!»)",
                "audio_text": "Întrebările cazurilor sunt cheia ta. Nominativ: cine? Acuzativ: pe cine, ce? Genitiv: al cui? Dativ: cui? Iar Vocativ este o strigare: vino aici, prietene!",
                "highlight_keywords": ["Nominativ", "Acuzativ", "Genitiv", "Dativ", "Vocativ"],
                "visual_clue": "❓ Cine? -> N | 🎯 Pe cine? -> Ac | 🏷️ Al cui? -> G | 🎁 Cui? -> D",
                "quick_quiz": {
                    "question": "În propoziția «I-am oferit bunicii o floare», în ce caz se află «bunicii»?",
                    "options": ["Genitiv (al cui?)", "Dativ (cui?)", "Acuzativ (pe cine?)"],
                    "correct_index": 1,
                    "hint": "Pune întrebarea: «Cui i-am oferit floarea?»",
                    "explanation": "Răspunde la întrebarea «Cui?», deci substantivul «bunicii» este în cazul Dativ."
                }
            }
        ],
        visual_scheme={
            "title": "Harta Substantivului",
            "nodes": [
                {"id": "n1", "label": "SUBSTANTIV", "color": "#FDE68A", "description": "Denumește ființe, lucruri, stări"},
                {"id": "n2", "label": "Gen", "color": "#BAE6FD", "description": "Masculin, Feminin, Neutru"},
                {"id": "n3", "label": "Cazuri", "color": "#BBF7D0", "description": "N, Ac, G, D, V"},
                {"id": "n4", "label": "Număr", "color": "#FED7AA", "description": "Singular / Plural"}
            ],
            "edges": [
                {"from_node": "n1", "to_node": "n2", "relation": "are"},
                {"from_node": "n1", "to_node": "n3", "relation": "se declină în"},
                {"from_node": "n1", "to_node": "n4", "relation": "se numără la"}
            ]
        }
    )

    # 2. Lesson: Fonetica
    lesson_fonetica = LessonModel(
        id="fonetica-diftong-triftong-hiat",
        title="Fonetica: Diftong, Triftong și Hiat",
        category="Fonetică",
        difficulty="Esențial EN",
        order=2,
        summary="Diferențiază ușor diftongul de hiat. Regula de aur: într-o silabă există o singură vocală plină!",
        audio_summary="În fonetică, regula de aur este simplă: o silabă are doar o singură vocală. Dacă două sunete vocale sunt în aceeași silabă, avem diftong. Dacă se despart în silabe diferite, avem hiat.",
        tags=["fonetică", "diftong", "hiat", "triftong", "despărțire în silabe"],
        chunks=[
            {
                "chunk_index": 1,
                "title": "1. Regula de Aur a Silabei",
                "content": "Secretul foneticii:\nÎntr-o silabă din limba română există O SINGURĂ VOCALĂ propriu-zisă!\nRestul sunetelor din silabă care seamănă cu vocalele sunt numite «semivocale» (sunete mai scurte și mai slabe).\n\nVocale posibile: A, E, I, O, U, Ă, Î.\n«A», «Ă» și «Î» sunt ÎNTOTDEAUNA vocale (nu pot fi niciodată semivocale!).",
                "audio_text": "Secretul foneticii: într-o silabă există o singură vocală. Vocalele a, ă și î sunt întotdeauna vocale pline.",
                "highlight_keywords": ["o singură vocală", "semivocale", "silabă"],
                "visual_clue": "🟡 O silabă = O singură vocală plină!",
                "quick_quiz": {
                    "question": "Care dintre aceste litere este ÎNTOTDEAUNA vocală?",
                    "options": ["I", "E", "A", "O"],
                    "correct_index": 2,
                    "hint": "Litera A este mereu puternică și nu devine niciodată semivocală.",
                    "explanation": "Sunetul «A» este întotdeauna vocală de sine stătătoare în limba română."
                }
            },
            {
                "chunk_index": 2,
                "title": "2. Diftongul și Triftongul (Împreună)",
                "content": "• DIFTONG = o vocală + o semivocală în ACEEAȘI silabă.\nExemple:\n- soa-re («oa» este diftong)\n- pui («ui» este diftong)\n- cîi-ne («âi» este diftong)\n\n• TRIFTONG = o vocală + două semivocale în ACEEAȘI silabă.\nExemple:\n- le-oai-că («oai» este triftong)\n- ari-pioa-ră («ioa» este triftong)",
                "audio_text": "Diftongul înseamnă o vocală și o semivocală rostite în aceeași silabă, ca în soare sau pui. Triftongul are trei sunete în aceeași silabă, ca în leoarcă.",
                "highlight_keywords": ["diftong", "aceeași silabă", "triftong"],
                "visual_clue": "🤝 Diftong = 2 sunete prietene în aceeași silabă",
                "quick_quiz": {
                    "question": "În cuvântul «iar-bă», ce grup de sunete avem în prima silabă?",
                    "options": ["Hiat", "Diftong", "Triftong"],
                    "correct_index": 1,
                    "hint": "Desparte în silabe: iar-bă. Grupul «ia» este în aceeași silabă.",
                    "explanation": "În silaba «iar», «ia» este diftong (semivocala «i» + vocala «a»)."
                }
            },
            {
                "chunk_index": 3,
                "title": "3. Hiatul (Despărțirea)",
                "content": "• HIAT = două vocale alăturate care se pronunță în SILABE DIFERITE!\nEle nu se înțeleg, așa că se despart.\n\nExemple clare:\n• po-e-zi-e (o / e formează hiat; i / e formează alt hiat)\n• au-ră (a / u formează hiat: a-u-ră)\n• fi-in-ță (i / i formează hiat)",
                "audio_text": "Hiatul apare când două vocale vecine se despart în două silabe diferite. Cum este în cuvântul po-e-zi-e.",
                "highlight_keywords": ["hiat", "silabe diferite", "despărțire"],
                "visual_clue": "⚡ Hiat = Două vocale vecine separate de granița silabei: V | V",
                "quick_quiz": {
                    "question": "Ce fenomen fonetic apare în cuvântul «i-de-e» între ultimele două litere?",
                    "options": ["Diftong", "Hiat", "Triftong"],
                    "correct_index": 1,
                    "hint": "Desparte cuvântul: i-de-e. Vocalele «e» și «e» sunt în silabe separate.",
                    "explanation": "Deoarece cele două vocale «e» se află în silabe diferite (de-e), ele se află în hiat."
                }
            }
        ],
        visual_scheme={
            "title": "Ghid Fonetic Vizual",
            "nodes": [
                {"id": "f1", "label": "Grupuri de sunete", "color": "#FDE68A"},
                {"id": "f2", "label": "DIFTONG (Aceeași silabă)", "color": "#BAE6FD", "description": "Vocală + Semivocală (ex: soa-re)"},
                {"id": "f3", "label": "HIAT (Silabe diferite)", "color": "#FECDD3", "description": "Vocală / Vocală (ex: a-ur)"},
                {"id": "f4", "label": "TRIFTONG (Aceeași silabă)", "color": "#BBF7D0", "description": "3 sunete (ex: le-oai-că)"}
            ],
            "edges": [
                {"from_node": "f1", "to_node": "f2", "relation": "unit"},
                {"from_node": "f1", "to_node": "f3", "relation": "separat"},
                {"from_node": "f1", "to_node": "f4", "relation": "triplu"}
            ]
        }
    )

    # 3. Lesson: Figuri de Stil
    lesson_figuri = LessonModel(
        id="figuri-de-stil-metafora",
        title="Figuri de Stil: Epitet, Metaforă și Personificare",
        category="Literatură",
        difficulty="Esențial EN",
        order=3,
        summary="Descoperă figurile de stil cele mai frecvente la Evaluarea Națională și cum să le explici în 2 fraze clare.",
        audio_summary="Figurile de stil fac textul literar expresiv și plin de emoție. Epitetul este un adjectiv neobișnuit, personificarea dă viață lucrurilor, iar metafora este o comparație secretă fără cuvântul ca.",
        tags=["figuri de stil", "epitet", "metaforă", "personificare", "literatură", "subiectul-I-A"],
        chunks=[
            {
                "chunk_index": 1,
                "title": "1. Epitetul (Adjectivul magic)",
                "content": "Epitetul este cuvântul (adesea adjectiv) care dă o însușire deosebită, poetică unui lucru sau unei ființe.\n\nNu orice adjectiv este epitet!\n• «masă de lemn» = adjectiv obișnuit (NU e epitet)\n• «lumină argintie» = epitet cromatic (exprimă magie)\n• «vânt turbat» = epitet dinamic (exprimă forța naturii)\n\nLa examen, scrie formula: «Epitetul [nume] evidențiază atmosfera și sporește expresivitatea textului.»",
                "audio_text": "Epitetul adaugă o însușire poetică. Lumină argintie sau vânt turbat sunt epitete, pentru că trezesc o imagine în minte.",
                "highlight_keywords": ["epitet", "însușire deosebită", "expresivitate"],
                "visual_clue": "🎨 Epitet = Adjectivul care colorează imaginea",
                "quick_quiz": {
                    "question": "Care dintre următoarele expresii conține un epitet?",
                    "options": ["Caiet de matematică", "Soare blând", "Ușă închisă", "Două mere"],
                    "correct_index": 1,
                    "hint": "Caută adjectivul care exprimă o emoție poetică, nu o simplă descriere fizică.",
                    "explanation": "«Soare blând» este un epitet, deoarece soarele primește o însușire sufletească."
                }
            },
            {
                "chunk_index": 2,
                "title": "2. Personificarea (Lucrurile prind viață)",
                "content": "Personificarea este figura de stil prin care obiectele, natura sau animalele primesc trăsături și acțiuni specifice oamenilor.\n\nExemple tipice de examen:\n• «Copacii șușoteau în taină» (copacii nu vorbesc în realitate)\n• «Vântul gemea la geam»\n• «Noaptea își așterne mantia»\n\nÎntreabă-te mereu: Poate face un om această acțiune? Dacă da, iar subiectul este un obiect/animal, e personificare!",
                "audio_text": "Personificarea dă viață obiectelor. Când spui că vântul plânge sau copacii șușotesc, folosești o personificare.",
                "highlight_keywords": ["personificare", "acțiuni umane", "obiecte prind viață"],
                "visual_clue": "🌳🗣️ Copacul care vorbește = Personificare",
                "quick_quiz": {
                    "question": "În versul «Izvorul cântă printre pietre», ce figură de stil este prezentă?",
                    "options": ["Comparație", "Personificare", "Hiperbolă"],
                    "correct_index": 1,
                    "hint": "Izvorul face o acțiune pe care o fac de obicei oamenii: a cânta.",
                    "explanation": "Izvorul primește însușirea omenească de a cânta, așadar este o personificare."
                }
            },
            {
                "chunk_index": 3,
                "title": "3. Metafora (Comparația ascunsă)",
                "content": "Metafora este numită «regina figurilor de stil».\nEa este o comparație prescurtată, din care lipsește cuvântul de legătură «ca» sau «precum».\n\nCompară:\n• «Luna este ca o regină a nopții» -> COMPARAȚIE (are cuvântul «ca»)\n• «Regina nopții veghează cerul» -> METAFORĂ (luna a devenit direct «regina nopții»!)\n\nAlte exemple:\n• «stelele sunt ochii cerului»\n• «focul iubirii»",
                "audio_text": "Metafora este o comparație ascunsă. Dacă ștergi cuvântul «ca» dintr-o comparație, obții o metaforă: luna devine regina nopții.",
                "highlight_keywords": ["metaforă", "comparație ascunsă", "fără cuvântul ca"],
                "visual_clue": "👑 Luna -> Regina nopții (fără «ca») = Metaforă",
                "quick_quiz": {
                    "question": "De ce expresia «ochi de tăciune» este o metaforă?",
                    "options": [
                        "Pentru că folosește cuvântul «ca»",
                        "Pentru că transferă direct negrul tăciunilor asupra ochilor, fără termen de comparație",
                        "Pentru că e o simplă numărătoare"
                    ],
                    "correct_index": 1,
                    "hint": "Nu există termenul «ca», ci o identificare poetică directă.",
                    "explanation": "Este o metaforă deoarece compară culoarea ochilor cu tăciunele în mod direct, fără cuvântul «ca»."
                }
            }
        ],
        visual_scheme={
            "title": "Figuri de Stil Cheie",
            "nodes": [
                {"id": "fg1", "label": "Figuri de Stil", "color": "#FDE68A"},
                {"id": "fg2", "label": "EPITET", "color": "#BBF7D0", "description": "Adjectiv neobișnuit (ex: noapte adâncă)"},
                {"id": "fg3", "label": "PERSONIFICARE", "color": "#BAE6FD", "description": "Comportament uman la obiecte (vântul plânge)"},
                {"id": "fg4", "label": "METAFORĂ", "color": "#FBCFE8", "description": "Comparație fără «ca» (perlele dinților)"}
            ],
            "edges": [
                {"from_node": "fg1", "to_node": "fg2", "relation": "descrie"},
                {"from_node": "fg1", "to_node": "fg3", "relation": "însuflețește"},
                {"from_node": "fg1", "to_node": "fg4", "relation": "transformă"}
            ]
        }
    )

    # 4. Lesson: Textul Narativ & Compunerea
    lesson_redactare = LessonModel(
        id="textul-narativ-compunere",
        title="Compunerea Narativă (Subiectul II): Structură și Trucuri",
        category="Redactare",
        difficulty="Examen EN",
        order=4,
        summary="Ghidul salvator pentru compunerea de 150 de cuvinte. Învață schema în 3 părți fără să te blochezi la foaia albă.",
        audio_summary="La Subiectul al doilea ai de scris o narațiune de minim 150 de cuvinte. Respectă cele trei părți: introducerea în care prezinți locul și timpul, cuprinsul cu întâmplarea și încheierea cu morala.",
        tags=["compunere", "subiectul-II", "narațiune", "redactare", "personaje"],
        chunks=[
            {
                "chunk_index": 1,
                "title": "1. Cele 3 Părți Obligatorii",
                "content": "Orice text narativ trebuie organizat cu alineate vizibile:\n\n1. Introducere (1-2 fraze):\n• Cine? Unde? Când?\n(Ex: «Într-o dimineață răcoroasă de toamnă, eu și prietenul meu Radu ne plimbam prin pădurea de la marginea satului...»)\n\n2. Cuprins (partea cea mai lungă):\n• Ce s-a întâmplat? Ce problemă a apărut? Cum s-a rezolvat?\n• Include cel puțin o scurtă descriere (un peisaj sau un personaj).\n\n3. Încheiere (1-2 fraze):\n• Cum s-a sfârșit aventura? Ce ai simțit sau ce ai învățat?",
                "audio_text": "Compunerea are trei părți cu alineate clare. Introducerea răspunde la cine, unde și când. Cuprinsul povestește întâmplarea, iar încheierea arată ce ai simțit.",
                "highlight_keywords": ["Introducere", "Cuprins", "Încheiere", "Alineat"],
                "visual_clue": "📐 Schema: Început (Unde? Când?) ➡️ Mijloc (Aventura) ➡️ Sfârșit (Emoție)",
                "quick_quiz": {
                    "question": "Ce elemente este recomandat să precizezi chiar din Introducere?",
                    "options": [
                        "Doar concluzia morală a textului",
                        "Indicii de spațiu (unde), de timp (când) și personajele",
                        "O listă de figuri de stil"
                    ],
                    "correct_index": 1,
                    "hint": "Cititorul trebuie să știe unde și când se petrece acțiunea.",
                    "explanation": "Introducerea fixează reperele spațio-temporale (locul, timpul) și personajele principale."
                }
            },
            {
                "chunk_index": 2,
                "title": "2. Cerințe de Punctaj la Examen",
                "content": "Nu pierde puncte din neatenție! Verifică această listă:\n\n✓ Numărul de cuvinte: minimum 150 de cuvinte (dacă scrii sub 150, pierzi punctele de redactare!).\n✓ Coerența: folosește cuvinte de legătură («la început», «deodată», «în cele din urmă»).\n✓ Corectitudinea scrierii: atenție la cratime («s-au» / «sau», «într-o»).\n✓ Păstrează aceeași persoană a narațiunii (ori persoana I «am mers», ori persoana a III-a «a mers»). Nu le amesteca!",
                "audio_text": "Nu uita regula numărului de cuvinte: scrie cel puțin 150 de cuvinte. Păstrează aceeași persoană pe tot parcursul compunerii.",
                "highlight_keywords": ["150 de cuvinte", "cuvinte de legătură", "persoana I sau a III-a"],
                "visual_clue": "📝 Barem: 150 cuvinte + Alineate + Fir logic",
                "quick_quiz": {
                    "question": "Ce se întâmplă dacă redactarea are doar 110 cuvinte la examen?",
                    "options": [
                        "Primești punctaj maxim dacă este frumoasă",
                        "Nu primești punctele alocate părții de redactare din cauza nerespectării limitei de cuvinte",
                        "Se adaugă 10 puncte bonus"
                    ],
                    "correct_index": 1,
                    "hint": "Baremul oficial impune o limită strictă de minim 150 de cuvinte.",
                    "explanation": "Conform baremului Evaluării Naționale, nerespectarea limitei minime de 150 de cuvinte atrage pierderea punctajului de redactare."
                }
            }
        ],
        visual_scheme={
            "title": "Piramida Narațiunii",
            "nodes": [
                {"id": "p1", "label": "INTRODUCERE", "color": "#BAE6FD", "description": "Timp + Spațiu + Personaje"},
                {"id": "p2", "label": "CUPRINS", "color": "#FDE68A", "description": "Cauză ➡️ Acțiune ➡️ Punct culminant"},
                {"id": "p3", "label": "ÎNCHEIERE", "color": "#BBF7D0", "description": "Deznodământ + Trăire personală"}
            ],
            "edges": [
                {"from_node": "p1", "to_node": "p2", "relation": "declanșează"},
                {"from_node": "p2", "to_node": "p3", "relation": "conduce la"}
            ]
        }
    )

    db.add(lesson_substantiv)
    db.add(lesson_fonetica)
    db.add(lesson_figuri)
    db.add(lesson_redactare)

    # 5. Exam: Simulare Model Evaluarea Națională 2025 (Limba Română)
    exam_sim = ExamModel(
        id="simulare-en-romana-model-1",
        title="Simulare Evaluarea Națională: Limba și Literatura Română (Model Adaptat)",
        year=2025,
        description="Simulare completă structurată după modelul oficial al Ministerului Educației, cu adaptări speciale pentru elevii cu dislexie (timp suplimentar +60 min, suport audio pentru cerințe, spațiere optimizată).",
        standard_duration_minutes=120,
        accommodated_duration_minutes=180,
        reading_text={
            "title": "Textul 1 (Fragment literar adaptat)",
            "author": "Mihail Sadoveanu",
            "source": "„Dumbrava minunată”",
            "paragraphs": [
                "Lizuca porni agale pe cărăruia ce ducea spre marginea pădurii. În urma ei, cățelușul Patrocle pășea mândru, cu urechile ciulite la fiecare foșnet mărunt din iarbă.",
                "Pădurea o întâmpină cu o adiere răcoroasă și cu miros de mușchi jilav. Soarele blând strecura raze aurii printre frunzele arămii ale stejarilor bătrâni.",
                "— Patrocle, șopti fetița oprindu-se lângă un trunchi de fag, crezi că dumbrava aceasta ascunde zâne?",
                "Cățelul dădu din coadă și scoase un lătrat scurt, ca și cum ar fi aprobat bucuros spusele prietenei sale. Lumina serii începea să îmbrace crengile într-o mantie tainică de umbre."
            ],
            "audio_text": "Lizuca porni agale pe cărăruia ce ducea spre marginea pădurii. În urma ei, cățelușul Patrocle pășea mândru, cu urechile ciulite la fiecare foșnet mărunt din iarbă. Pădurea o întâmpină cu o adiere răcoroasă și cu miros de mușchi jilav. Soarele blând strecura raze aurii printre frunzele arămii ale stejarilor bătrâni. Lizuca îl întrebă pe Patrocle dacă dumbrava ascunde zâne, iar cățelul lătră bucuros."
        },
        questions=[
            # Subiectul I - A: Înțelegerea textului (30p)
            {
                "id": "q1",
                "section": "Subiectul I - A",
                "order": 1,
                "points": 6.0,
                "prompt": "1. Cine o însoțește pe Lizuca în drumul ei spre pădure?",
                "type": "multiple_choice",
                "options": [
                    "A. Bunica ei",
                    "B. Cățelușul Patrocle",
                    "C. Un băiat din sat",
                    "D. Mama vitregă"
                ],
                "correct_answer": "B. Cățelușul Patrocle",
                "rubric_explanation": "Textul precizează explicit: «În urma ei, cățelușul Patrocle pășea mândru».",
                "related_lesson_id": "textul-narativ-compunere",
                "topic": "Înțelegerea textului literar",
                "audio_prompt": "Exercițiul 1. Cine o însoțește pe Lizuca în drumul ei spre pădure? Ascultă opțiunile: A: Bunica ei; B: Cățelușul Patrocle; C: Un băiat din sat; D: Mama vitregă."
            },
            {
                "id": "q2",
                "section": "Subiectul I - A",
                "order": 2,
                "points": 6.0,
                "prompt": "2. În ce moment al zilei se petrece acțiunea din fragment?",
                "type": "multiple_choice",
                "options": [
                    "A. În miezul nopții",
                    "B. Spre seară (apusul soarelui)",
                    "C. În toiul amiezii",
                    "D. În zori de zi"
                ],
                "correct_answer": "B. Spre seară (apusul soarelui)",
                "rubric_explanation": "Indiciul din ultimul alineat este: «Lumina serii începea să îmbrace crengile».",
                "related_lesson_id": "textul-narativ-compunere",
                "topic": "Indici spațio-temporali",
                "audio_prompt": "Exercițiul 2. În ce moment al zilei se petrece acțiunea din fragment? Alege varianta corectă."
            },
            {
                "id": "q3",
                "section": "Subiectul I - A",
                "order": 3,
                "points": 6.0,
                "prompt": "3. Identifică figura de stil din structura «soarele blând»:",
                "type": "multiple_choice",
                "options": [
                    "A. Comparație",
                    "B. Epitet",
                    "C. Hiat",
                    "D. Repetiție"
                ],
                "correct_answer": "B. Epitet",
                "rubric_explanation": "«Blând» atribuie soarelui o însușire sufletească deosebită, constituind un epitet.",
                "related_lesson_id": "figuri-de-stil-metafora",
                "topic": "Figuri de stil - Epitetul",
                "audio_prompt": "Exercițiul 3. Identifică figura de stil din structura «soarele blând»."
            },

            # Subiectul I - B: Elemente de limbă (30p)
            {
                "id": "q4",
                "section": "Subiectul I - B",
                "order": 4,
                "points": 6.0,
                "prompt": "4. În cuvântul «soarele» (despărțit soa-re-le), grupul de sunete «oa» este:",
                "type": "multiple_choice",
                "options": [
                    "A. Diftong",
                    "B. Hiat",
                    "C. Triftong",
                    "D. Doar o consoană"
                ],
                "correct_answer": "A. Diftong",
                "rubric_explanation": "În silaba «soa», semivocala «o» și vocala «a» se pronunță împreună, formând un diftong.",
                "related_lesson_id": "fonetica-diftong-triftong-hiat",
                "topic": "Fonetica - Diftongul",
                "audio_prompt": "Exercițiul 4. În cuvântul soarele, grupul oa este diftong, hiat sau triftong?"
            },
            {
                "id": "q5",
                "section": "Subiectul I - B",
                "order": 5,
                "points": 6.0,
                "prompt": "5. În propoziția «Patrocle pășea mândru», cuvântul «Patrocle» este un substantiv în cazul:",
                "type": "multiple_choice",
                "options": [
                    "A. Acuzativ (pe cine?)",
                    "B. Genitiv (al cui?)",
                    "C. Nominativ (cine pășea?)",
                    "D. Dativ (cui?)"
                ],
                "correct_answer": "C. Nominativ (cine pășea?)",
                "rubric_explanation": "Răspunde la întrebarea «Cine pășea?», îndeplinind funcția de subiect în cazul Nominativ.",
                "related_lesson_id": "substantivul-si-cazurile",
                "topic": "Substantivul - Cazul Nominativ",
                "audio_prompt": "Exercițiul 5. În propoziția Patrocle pășea mândru, în ce caz este substantivul Patrocle?"
            },
            {
                "id": "q6",
                "section": "Subiectul I - B",
                "order": 6,
                "points": 6.0,
                "prompt": "6. Alege seria în care ambele cuvinte conțin un hiat:",
                "type": "multiple_choice",
                "options": [
                    "A. soare, noapte",
                    "B. poezie, aur",
                    "C. pui, câine",
                    "D. leoaică, aripioară"
                ],
                "correct_answer": "B. poezie, aur",
                "rubric_explanation": "po-e-zi-e (o-e și i-e) și a-ur (a-u) au vocale alăturate despărțite în silabe diferite (hiat).",
                "related_lesson_id": "fonetica-diftong-triftong-hiat",
                "topic": "Fonetica - Hiatul",
                "audio_prompt": "Exercițiul 6. Alege seria în care ambele cuvinte conțin un hiat."
            },
            {
                "id": "q7",
                "section": "Subiectul I - B",
                "order": 7,
                "points": 6.0,
                "prompt": "7. Ce gen are substantivul «foșnet» (un foșnet / două foșnete)?",
                "type": "multiple_choice",
                "options": [
                    "A. Masculin",
                    "B. Feminin",
                    "C. Neutru"
                ],
                "correct_answer": "C. Neutru",
                "rubric_explanation": "Se numără: «un foșnet / două foșnete». Este genul neutru.",
                "related_lesson_id": "substantivul-si-cazurile",
                "topic": "Substantivul - Genul",
                "audio_prompt": "Exercițiul 7. Ce gen are substantivul foșnet?"
            },

            # Subiectul II: Redactare / Planificare compunere (20p)
            {
                "id": "q8",
                "section": "Subiectul II",
                "order": 8,
                "points": 20.0,
                "prompt": "8. Scrie un text narativ de minimum 150 de cuvinte în care să prezinți o întâmplare petrecută într-o pădure sau parc alături de un animal de companie. (Planul recomandat: 1. Introducere cu locul și timpul; 2. Cuprins cu aventura; 3. Încheiere cu sentimentele trăite).",
                "type": "essay",
                "options": None,
                "correct_answer": "Text coerent de minimum 150 de cuvinte respectând: introducere (spațiu, timp), cuprins (fir narativ, descriere), încheiere (emoție), ortografie corectă.",
                "rubric_explanation": "Punctajul se acordă pentru: conținut (12p) + redactare și ortografie (8p).",
                "related_lesson_id": "textul-narativ-compunere",
                "topic": "Redactare compunere narativă",
                "audio_prompt": "Subiectul II. Scrie o compunere narativă de cel puțin 150 de cuvinte despre o întâmplare alături de un animal de companie."
            }
        ]
    )

    db.add(exam_sim)
    db.commit()
    db.close()
    print("Database seeded successfully with dyslexia-tailored content!")

if __name__ == "__main__":
    seed_database()
