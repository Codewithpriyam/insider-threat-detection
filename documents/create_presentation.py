import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = pptx.Presentation()
    
    # Standard 16:9 widescreen dimensions (PowerPoint & Google Slides standard)
    SLIDE_WIDTH = Inches(13.333)
    SLIDE_HEIGHT = Inches(7.500)
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT
    
    # Layout constants
    MARGIN_LEFT = Inches(0.80)
    CONTENT_WIDTH = Inches(11.733)  # 13.333 - 1.60 = 11.733
    
    # Colors
    C_BG = RGBColor(250, 250, 250)        # #FAFAFA
    C_CARD = RGBColor(245, 245, 245)      # #F5F5F5
    C_CODE_BG = RGBColor(230, 230, 230)   # #E6E6E6
    C_PRIMARY = RGBColor(10, 10, 10)      # #0A0A0A
    C_RED = RGBColor(239, 68, 68)         # #EF4444 Tactical Red
    C_GREEN = RGBColor(22, 163, 74)       # #16A34A Success Green
    C_MUTED = RGBColor(82, 82, 82)        # #525252 Secondary Text
    C_WHITE = RGBColor(250, 250, 250)     # #FAFAFA Light Text
    
    FONT_DISPLAY = 'Arial Black'
    FONT_BODY = 'Arial'
    FONT_MONO = 'Consolas'
    
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text):
        # Category Tag
        tag_box = slide.shapes.add_textbox(MARGIN_LEFT, Inches(0.55), CONTENT_WIDTH, Inches(0.30))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text
        p_tag.font.name = FONT_BODY
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_RED
        
        # Title
        title_box = slide.shapes.add_textbox(MARGIN_LEFT, Inches(0.85), CONTENT_WIDTH, Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = FONT_DISPLAY
        p_title.font.size = Pt(26)
        p_title.font.color.rgb = C_PRIMARY
        
        # Divider Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(1.58), CONTENT_WIDTH, Inches(0.03))
        line.fill.solid()
        line.fill.fore_color.rgb = C_PRIMARY
        line.line.fill.background()

    # ==========================================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    
    # Top Accent Bar
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(0.65), CONTENT_WIDTH, Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_PRIMARY
    top_bar.line.fill.background()
    
    # Kicker
    kicker = s1.shapes.add_textbox(MARGIN_LEFT, Inches(1.10), CONTENT_WIDTH, Inches(0.35))
    tf_k = kicker.text_frame
    tf_k.word_wrap = True
    tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
    p = tf_k.paragraphs[0]
    p.text = "CYBERSECURITY MINI PROJECT // USER BEHAVIOR ANALYTICS"
    p.font.name = FONT_BODY
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_RED
    
    # Title
    t_box = s1.shapes.add_textbox(MARGIN_LEFT, Inches(1.55), CONTENT_WIDTH, Inches(1.40))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
    p = tf_t.paragraphs[0]
    p.text = "INSIDER THREAT DETECTION SYSTEM"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(40)
    p.font.color.rgb = C_PRIMARY
    
    # Subtitle
    sub_box = s1.shapes.add_textbox(MARGIN_LEFT, Inches(3.05), CONTENT_WIDTH, Inches(0.50))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
    p = tf_sub.paragraphs[0]
    p.text = "Real-Time User Activity Log Auditing & Heuristic Behavioral Analysis"
    p.font.name = FONT_BODY
    p.font.size = Pt(19)
    p.font.color.rgb = C_MUTED
    
    # Overview Card
    card1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(3.85), CONTENT_WIDTH, Inches(2.85))
    card1.fill.solid()
    card1.fill.fore_color.rgb = C_CARD
    card1.line.color.rgb = C_PRIMARY
    card1.line.width = Pt(2)
    
    # Red accent stripe on left of card
    stripe = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(3.85), Inches(0.12), Inches(2.85))
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = C_RED
    stripe.line.fill.background()
    
    # Card Content Text
    c1_txt = s1.shapes.add_textbox(MARGIN_LEFT + Inches(0.40), Inches(4.05), CONTENT_WIDTH - Inches(0.60), Inches(2.45))
    tf_c1 = c1_txt.text_frame
    tf_c1.word_wrap = True
    tf_c1.margin_left = tf_c1.margin_top = tf_c1.margin_right = tf_c1.margin_bottom = 0
    
    p = tf_c1.paragraphs[0]
    p.text = "PROJECT OVERVIEW & TECHNICAL ARCHITECTURE"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(12)
    p.font.color.rgb = C_PRIMARY
    p.space_after = Pt(12)
    
    bullets_s1 = [
        "▪ Architecture: React 19 (Frontend) + Java Spring Boot 3.3.4 (REST API) + MySQL / H2 Relational Storage",
        "▪ UI Design: VoiceBox High-Contrast Editorial System (0px border-radius, pure monochrome + red accent)",
        "▪ Heuristic Engine: Real-time sliding-window analytics detecting off-hours access, exfiltration spikes & privilege escalation",
        "▪ Methodology: Spec-Driven Development (SpecKit Standard) for high-reliability academic defense"
    ]
    for b in bullets_s1:
        p = tf_c1.add_paragraph()
        p.text = b
        p.font.name = FONT_MONO
        p.font.size = Pt(12.5)
        p.font.color.rgb = C_PRIMARY
        p.space_after = Pt(6)

    # ==========================================================
    # SLIDE 2: BACKGROUND & MOTIVATION
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "01 // BACKGROUND & MOTIVATION", "THE INSIDER THREAT CHALLENGE")
    
    col_gap = Inches(0.35)
    col_w = (CONTENT_WIDTH - col_gap) / 2
    top_c = Inches(1.80)
    card_h = Inches(5.00)
    
    # Left Card
    c_left = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, top_c, col_w, card_h)
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = C_CARD
    c_left.line.color.rgb = C_PRIMARY
    c_left.line.width = Pt(2)
    
    # Left Top Bar (Red Accent)
    bar_l = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, top_c, col_w, Inches(0.08))
    bar_l.fill.solid()
    bar_l.fill.fore_color.rgb = C_RED
    bar_l.line.fill.background()
    
    txt_l = s2.shapes.add_textbox(MARGIN_LEFT + Inches(0.35), top_c + Inches(0.35), col_w - Inches(0.70), card_h - Inches(0.60))
    tf_l = txt_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_top = tf_l.margin_right = tf_l.margin_bottom = 0
    p = tf_l.paragraphs[0]
    p.text = "WHY PERIMETER DEFENSES FAIL"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(16)
    p.font.color.rgb = C_RED
    p.space_after = Pt(16)
    
    b_left = [
        "▪ Traditional firewalls and IDS defend against external adversaries attacking from outside the corporate network.",
        "▪ Insider threats originate from authenticated employees, contractors, or compromised legitimate accounts.",
        "▪ Their actions look \"legitimate\" at the network layer because valid corporate user credentials and tokens are used.",
        "▪ Industry reports indicate average insider breach containment exceeds 85 days when relying solely on perimeter controls."
    ]
    for b in b_left:
        p = tf_l.add_paragraph()
        p.text = b
        p.font.name = FONT_BODY
        p.font.size = Pt(13.5)
        p.font.color.rgb = C_PRIMARY
        p.space_after = Pt(14)
        
    # Right Card
    c_right_x = MARGIN_LEFT + col_w + col_gap
    c_right = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_right_x, top_c, col_w, card_h)
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = C_CARD
    c_right.line.color.rgb = C_PRIMARY
    c_right.line.width = Pt(2)
    
    bar_r = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_right_x, top_c, col_w, Inches(0.08))
    bar_r.fill.solid()
    bar_r.fill.fore_color.rgb = C_PRIMARY
    bar_r.line.fill.background()
    
    txt_r = s2.shapes.add_textbox(c_right_x + Inches(0.35), top_c + Inches(0.35), col_w - Inches(0.70), card_h - Inches(0.60))
    tf_r = txt_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0
    p = tf_r.paragraphs[0]
    p.text = "THE PROPOSED SOLUTION: UBA"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(16)
    p.font.color.rgb = C_PRIMARY
    p.space_after = Pt(16)
    
    b_right = [
        "▪ User Behavior Analytics (UBA) continuously monitors internal audit logs rather than just firewall boundaries.",
        "▪ Evaluates contextual indicators: off-hours activity, excessive file transfer volumes, and privilege alteration attempts.",
        "▪ Utilizes deterministic sliding-window heuristics to calculate instant risk scoring and threat alerts.",
        "▪ Detects data exfiltration and credential misuse in real time before sensitive intellectual property leaves the network."
    ]
    for b in b_right:
        p = tf_r.add_paragraph()
        p.text = b
        p.font.name = FONT_BODY
        p.font.size = Pt(13.5)
        p.font.color.rgb = C_PRIMARY
        p.space_after = Pt(14)

    # ==========================================================
    # SLIDE 3: THREAT VECTOR SCOPE
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "02 // THREAT VECTOR SCOPE", "THREE CORE ATTACK VECTORS DETECTED")
    
    col3_gap = Inches(0.30)
    col3_w = (CONTENT_WIDTH - 2 * col3_gap) / 3
    
    vectors = [
        {
            "tag": "VECTOR 01",
            "title": "UNUSUAL ACCESS PATTERNS",
            "sub": "Brute Force & Off-Hours Logins",
            "bullets": [
                "▪ Off-Hours Access: User logins between 11:00 PM and 5:00 AM outside routine operating hours.",
                "▪ Brute-Force / Stuffing: >3 consecutive failed login attempts within a 10-minute sliding window.",
                "▪ Severity: HIGH / MEDIUM",
                "▪ Impact: Detects credential stuffing, compromised VPNs, and unauthorized midnight data browsing."
            ]
        },
        {
            "tag": "VECTOR 02",
            "title": "MASS DATA EXFILTRATION",
            "sub": "Spike Downloads & Large Transfers",
            "bullets": [
                "▪ Download Spikes: >10 file downloads within a 10-minute sliding window.",
                "▪ Volume Exfiltration: Total transferred bytes exceeding 150 MB within the rolling period.",
                "▪ Severity: HIGH",
                "▪ Impact: Prevents theft of source code, proprietary algorithms, databases, and customer PII."
            ]
        },
        {
            "tag": "VECTOR 03",
            "title": "PRIVILEGE ESCALATION",
            "sub": "Unauthorized Role Modification",
            "bullets": [
                "▪ Unauthorized Promotion: Standard user account self-assigning ROLE_ADMIN or IAM access rights.",
                "▪ Access Group Tampering: Modifying privileged roles without supervisor approval signatures.",
                "▪ Severity: CRITICAL",
                "▪ Impact: Blocks malicious administrative takeovers and prevents audit trail tampering."
            ]
        }
    ]
    
    for i, v in enumerate(vectors):
        x = MARGIN_LEFT + i * (col3_w + col3_gap)
        c = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col3_w, card_h)
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = C_PRIMARY
        c.line.width = Pt(2)
        
        # Red top accent
        b_acc = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col3_w, Inches(0.08))
        b_acc.fill.solid()
        b_acc.fill.fore_color.rgb = C_RED
        b_acc.line.fill.background()
        
        tx = s3.shapes.add_textbox(x + Inches(0.25), top_c + Inches(0.30), col3_w - Inches(0.50), card_h - Inches(0.50))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = v["tag"]
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_RED
        p.space_after = Pt(4)
        
        p = tf.add_paragraph()
        p.text = v["title"]
        p.font.name = FONT_DISPLAY
        p.font.size = Pt(14)
        p.font.color.rgb = C_PRIMARY
        
        p = tf.add_paragraph()
        p.text = v["sub"]
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(14)
        
        for b in v["bullets"]:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = FONT_BODY
            p.font.size = Pt(12)
            p.font.color.rgb = C_PRIMARY
            p.space_after = Pt(10)

    # ==========================================================
    # SLIDE 4: SYSTEM ARCHITECTURE
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "03 // SYSTEM ARCHITECTURE", "END-TO-END DATA PIPELINE")
    
    col4_gap = Inches(0.24)
    col4_w = (CONTENT_WIDTH - 3 * col4_gap) / 4
    
    tiers = [
        {
            "tag": "TIER 01",
            "title": "LOG SOURCES",
            "is_highlight": False,
            "bullets": [
                "▪ CSV Log Ingestion (bulk logs up to 200MB)",
                "▪ Synthetic Attack Simulator for evaluation",
                "▪ REST API Endpoint for live ingestion (/api/logs)",
                "▪ Normalized audit trail with timestamp, IP & user"
            ]
        },
        {
            "tag": "TIER 02",
            "title": "DETECTION ENGINE",
            "is_highlight": True,
            "bullets": [
                "▪ Spring Boot 3 Service Layer",
                "▪ Sliding-Window Query Heuristics (10-min rolling)",
                "▪ Real-Time Deterministic Severity Scoring",
                "▪ Immediate Trigger Dispatch to Threat Queue"
            ]
        },
        {
            "tag": "TIER 03",
            "title": "STORAGE TIER",
            "is_highlight": False,
            "bullets": [
                "▪ MySQL 8 / H2 Relational Persistence Engine",
                "▪ users (corporate directory profiles & roles)",
                "▪ activity_logs (audit stream history)",
                "▪ threat_alerts (detected security incidents)"
            ]
        },
        {
            "tag": "TIER 04",
            "title": "SOC DASHBOARD",
            "is_highlight": False,
            "bullets": [
                "▪ React 19 + Vite Single-Page Application",
                "▪ VoiceBox Editorial brutalist UI design",
                "▪ Interactive Threat Feed with 1-click resolution",
                "▪ Paginated forensic audit trail with search"
            ]
        }
    ]
    
    for i, t in enumerate(tiers):
        x = MARGIN_LEFT + i * (col4_w + col4_gap)
        c = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col4_w, card_h)
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = C_PRIMARY
        c.line.width = Pt(2)
        
        # Top accent bar
        b_acc = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col4_w, Inches(0.08))
        b_acc.fill.solid()
        b_acc.fill.fore_color.rgb = C_RED if t["is_highlight"] else C_PRIMARY
        b_acc.line.fill.background()
        
        tx = s4.shapes.add_textbox(x + Inches(0.20), top_c + Inches(0.30), col4_w - Inches(0.40), card_h - Inches(0.50))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = t["tag"]
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_RED if t["is_highlight"] else C_MUTED
        p.space_after = Pt(4)
        
        p = tf.add_paragraph()
        p.text = t["title"]
        p.font.name = FONT_DISPLAY
        p.font.size = Pt(13.5)
        p.font.color.rgb = C_RED if t["is_highlight"] else C_PRIMARY
        p.space_after = Pt(14)
        
        for b in t["bullets"]:
            p = tf.add_paragraph()
            p.text = b
            p.font.name = FONT_MONO
            p.font.size = Pt(11)
            p.font.color.rgb = C_PRIMARY
            p.space_after = Pt(10)

    # ==========================================================
    # SLIDE 5: DESIGN PHILOSOPHY
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "04 // FRONTEND DESIGN SPECIFICATION", "VOICEBOX EDITORIAL DESIGN SYSTEM")
    
    card5 = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, top_c, CONTENT_WIDTH, card_h)
    card5.fill.solid()
    card5.fill.fore_color.rgb = C_CARD
    card5.line.color.rgb = C_PRIMARY
    card5.line.width = Pt(2)
    
    # Left red stripe
    stripe5 = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, top_c, Inches(0.12), card_h)
    stripe5.fill.solid()
    stripe5.fill.fore_color.rgb = C_RED
    stripe5.line.fill.background()
    
    tx5 = s5.shapes.add_textbox(MARGIN_LEFT + Inches(0.50), top_c + Inches(0.40), CONTENT_WIDTH - Inches(0.80), card_h - Inches(0.70))
    tf5 = tx5.text_frame
    tf5.word_wrap = True
    tf5.margin_left = tf5.margin_top = tf5.margin_right = tf5.margin_bottom = 0
    
    principles = [
        ("1. Strict 0px Border-Radius: ", "Angular, geometric precision across every button, card, modal, and badge — zero rounded corners to establish an authoritative Security Operations Center aesthetic."),
        ("2. High-Contrast Monochrome: ", "Stark black (#0A0A0A) on pure white (#FAFAFA) creates an executive, magazine-like interface that prioritizes information density over decorative gradients."),
        ("3. Red as a Tactical Scalpel: ", "The vibrant #EF4444 accent is reserved exclusively for high-severity threats, active breach indicators, and emergency containment action states."),
        ("4. Three Specialized Font Roles: ", "Archivo Black for high-impact display headlines, Work Sans / Arial for clean UI controls, and Consolas / Space Mono for raw forensic log tables and timestamps."),
        ("5. Hero Jump Navigation: ", "Prominent top-level CTA jump buttons enable security operators to switch effortlessly between high-level KPI cards and granular audit logs.")
    ]
    
    p = tf5.paragraphs[0]
    p.text = "CORE TENETS OF THE SECURITY OPERATIONS CENTER INTERFACE:"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(13)
    p.font.color.rgb = C_PRIMARY
    p.space_after = Pt(16)
    
    for title, desc in principles:
        p = tf5.add_paragraph()
        run1 = p.add_run()
        run1.text = title
        run1.font.name = FONT_BODY
        run1.font.size = Pt(13.5)
        run1.font.bold = True
        run1.font.color.rgb = C_RED
        
        run2 = p.add_run()
        run2.text = desc
        run2.font.name = FONT_BODY
        run2.font.size = Pt(13.5)
        run2.font.color.rgb = C_PRIMARY
        p.space_after = Pt(14)

    # ==========================================================
    # SLIDE 6: STEP-BY-STEP RUN GUIDE
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "05 // STEP-BY-STEP RUN GUIDE", "HOW TO RUN & DEMO THE SYSTEM")
    
    steps = [
        {
            "tag": "STEP 01",
            "title": "RUN BACKEND",
            "code": "cd backend\nmvn spring-boot:run",
            "desc": "Starts the Spring Boot REST API on port 8080 and seeds the in-memory H2 baseline database."
        },
        {
            "tag": "STEP 02",
            "title": "RUN FRONTEND",
            "code": "cd frontend\nnpm run dev",
            "desc": "Launches the Vite React SOC dashboard at http://localhost:5173 with real-time metric polling."
        },
        {
            "tag": "STEP 03",
            "title": "ATTACK SIMULATOR",
            "code": "1-CLICK INJECTION\nOFF-HOURS / EXFIL",
            "desc": "Click \"Inject Mass Exfiltration\" or \"Privilege Escalation\" to observe instant live heuristic triage."
        },
        {
            "tag": "STEP 04",
            "title": "CSV INGESTION",
            "code": "UPLOAD CSV LOGS\nAUTO-INGEST BENCHMARK",
            "desc": "Upload sample_threat_logs.csv (140 logs) or click Auto-Ingest to evaluate enterprise audit streams."
        }
    ]
    
    for i, st in enumerate(steps):
        x = MARGIN_LEFT + i * (col4_w + col4_gap)
        c = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col4_w, card_h)
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = C_PRIMARY
        c.line.width = Pt(2)
        
        # Red top accent
        b_acc = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, top_c, col4_w, Inches(0.08))
        b_acc.fill.solid()
        b_acc.fill.fore_color.rgb = C_RED
        b_acc.line.fill.background()
        
        # Text
        tx = s6.shapes.add_textbox(x + Inches(0.20), top_c + Inches(0.30), col4_w - Inches(0.40), card_h - Inches(0.50))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = st["tag"]
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_RED
        p.space_after = Pt(4)
        
        p = tf.add_paragraph()
        p.text = st["title"]
        p.font.name = FONT_DISPLAY
        p.font.size = Pt(13.5)
        p.font.color.rgb = C_PRIMARY
        p.space_after = Pt(12)
        
        # Code Box shape
        code_box = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x + Inches(0.18), top_c + Inches(1.15), col4_w - Inches(0.36), Inches(0.85))
        code_box.fill.solid()
        code_box.fill.fore_color.rgb = C_CODE_BG
        code_box.line.color.rgb = C_PRIMARY
        code_box.line.width = Pt(1)
        tf_code = code_box.text_frame
        tf_code.word_wrap = True
        tf_code.margin_left = Inches(0.12)
        tf_code.margin_top = Inches(0.10)
        p_c = tf_code.paragraphs[0]
        p_c.text = st["code"]
        p_c.font.name = FONT_MONO
        p_c.font.size = Pt(11)
        p_c.font.color.rgb = C_PRIMARY
        
        # Description below code box
        tx_desc = s6.shapes.add_textbox(x + Inches(0.20), top_c + Inches(2.20), col4_w - Inches(0.40), Inches(2.30))
        tf_desc = tx_desc.text_frame
        tf_desc.word_wrap = True
        tf_desc.margin_left = tf_desc.margin_top = tf_desc.margin_right = tf_desc.margin_bottom = 0
        p_d = tf_desc.paragraphs[0]
        p_d.text = st["desc"]
        p_d.font.name = FONT_BODY
        p_d.font.size = Pt(12.5)
        p_d.font.color.rgb = C_PRIMARY

    # ==========================================================
    # SLIDE 7: EVALUATION & BENCHMARKS (Table)
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "06 // EVALUATION & BENCHMARKS", "TEST BENCHMARK RESULTS (140 LOG SAMPLES)")
    
    rows = 5
    cols = 4
    table_shape = s7.shapes.add_table(rows, cols, MARGIN_LEFT, Inches(1.85), CONTENT_WIDTH, Inches(4.70))
    table = table_shape.table
    
    table.columns[0].width = Inches(2.50)
    table.columns[1].width = Inches(3.80)
    table.columns[2].width = Inches(2.80)
    table.columns[3].width = Inches(2.633)
    
    headers_s7 = ["TEST SCENARIO", "INJECTED LOG PATTERN", "HEURISTIC TRIGGER", "DETECTION RESULT"]
    for c_idx, h_text in enumerate(headers_s7):
        cell = table.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_PRIMARY
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = FONT_DISPLAY
        p.font.size = Pt(11)
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.LEFT
    
    data_rows = [
        ("1. Brute Force Login", "5 failed logins + 1 success from anomalous IP (marcus.vance)", "> 3 failed logins in 10-min sliding window", "FLAGGED: HIGH SEVERITY", C_RED),
        ("2. Mass Exfiltration", "10 confidential file downloads totaling >300 MB (elena.rostova)", "> 10 files or > 150 MB transferred in 10 mins", "FLAGGED: HIGH SEVERITY", C_RED),
        ("3. Privilege Escalation", "Self-promotion from ROLE_USER to ROLE_ADMIN (david.kim)", "ROLE_CHANGE event without dual-authorization", "FLAGGED: CRITICAL SEVERITY", C_RED),
        ("4. Baseline Traffic", "120 routine daytime views, handbook lookups & git reviews", "Acceptable baseline operating thresholds", "PASSED: 0 FALSE POSITIVES", C_GREEN),
    ]
    
    for r_idx, row_data in enumerate(data_rows, start=1):
        bg_color = C_WHITE if r_idx % 2 == 1 else C_CARD
        for c_idx in range(4):
            cell = table.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_color
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            p.text = row_data[c_idx]
            p.font.name = FONT_BODY
            p.font.size = Pt(11.5)
            if c_idx == 0:
                p.font.bold = True
                p.font.color.rgb = C_PRIMARY
            elif c_idx == 3:
                p.font.bold = True
                p.font.color.rgb = row_data[4]
            else:
                p.font.color.rgb = C_PRIMARY

    # ==========================================================
    # SLIDE 8: CONCLUSION & FUTURE SCOPE
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    
    # Top Accent Bar
    top_bar8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(0.60), CONTENT_WIDTH, Inches(0.12))
    top_bar8.fill.solid()
    top_bar8.fill.fore_color.rgb = C_PRIMARY
    top_bar8.line.fill.background()
    
    # Kicker
    kicker8 = s8.shapes.add_textbox(MARGIN_LEFT, Inches(0.95), CONTENT_WIDTH, Inches(0.30))
    tf_k8 = kicker8.text_frame
    tf_k8.word_wrap = True
    tf_k8.margin_left = tf_k8.margin_top = tf_k8.margin_right = tf_k8.margin_bottom = 0
    p = tf_k8.paragraphs[0]
    p.text = "07 // CONCLUSION & SUMMARY"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_RED
    
    # Title
    t8_box = s8.shapes.add_textbox(MARGIN_LEFT, Inches(1.25), CONTENT_WIDTH, Inches(0.65))
    tf_t8 = t8_box.text_frame
    tf_t8.word_wrap = True
    tf_t8.margin_left = tf_t8.margin_top = tf_t8.margin_right = tf_t8.margin_bottom = 0
    p = tf_t8.paragraphs[0]
    p.text = "PROJECT ACHIEVEMENTS & FUTURE SCOPE"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(28)
    p.font.color.rgb = C_PRIMARY
    
    # Divider Line
    line8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(1.95), CONTENT_WIDTH, Inches(0.03))
    line8.fill.solid()
    line8.fill.fore_color.rgb = C_PRIMARY
    line8.line.fill.background()
    
    # Main Card
    card8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(2.15), CONTENT_WIDTH, Inches(3.90))
    card8.fill.solid()
    card8.fill.fore_color.rgb = C_CARD
    card8.line.color.rgb = C_PRIMARY
    card8.line.width = Pt(2)
    
    # Left red stripe
    stripe8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(2.15), Inches(0.12), Inches(3.90))
    stripe8.fill.solid()
    stripe8.fill.fore_color.rgb = C_RED
    stripe8.line.fill.background()
    
    tx8 = s8.shapes.add_textbox(MARGIN_LEFT + Inches(0.45), Inches(2.35), CONTENT_WIDTH - Inches(0.70), Inches(3.50))
    tf8 = tx8.text_frame
    tf8.word_wrap = True
    tf8.margin_left = tf8.margin_top = tf8.margin_right = tf8.margin_bottom = 0
    
    conclusions = [
        ("Production-Grade Architecture: ", "Engineered an end-to-end UBA platform combining Java Spring Boot 3, React 19, and relational audit storage under strict zero-trust principles."),
        ("Zero-Lag Behavioral Detection: ", "Sliding-window query heuristics evaluate authentication attempts, download volumes, and privilege states with sub-second processing latency."),
        ("VoiceBox Editorial User Experience: ", "High-contrast monochrome design provides authoritative clarity, instantaneous alert triage, and complete audit trail visibility for security operators."),
        ("Future Research Roadmap: ", "Plan to integrate unsupervised machine learning (Isolation Forests & Deep Autoencoders) for anomalous clustering and automated SIEM integration (Splunk, Elastic).")
    ]
    
    p = tf8.paragraphs[0]
    p.text = "SUMMARY OF PROJECT DELIVERABLES:"
    p.font.name = FONT_DISPLAY
    p.font.size = Pt(13)
    p.font.color.rgb = C_PRIMARY
    p.space_after = Pt(12)
    
    for title, desc in conclusions:
        p = tf8.add_paragraph()
        run1 = p.add_run()
        run1.text = "▪ " + title
        run1.font.name = FONT_BODY
        run1.font.size = Pt(13.5)
        run1.font.bold = True
        run1.font.color.rgb = C_PRIMARY
        
        run2 = p.add_run()
        run2.text = desc
        run2.font.name = FONT_BODY
        run2.font.size = Pt(13.5)
        run2.font.color.rgb = C_PRIMARY
        p.space_after = Pt(12)
        
    # Bottom Callout Banner
    bot_banner = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, MARGIN_LEFT, Inches(6.25), CONTENT_WIDTH, Inches(0.65))
    bot_banner.fill.solid()
    bot_banner.fill.fore_color.rgb = C_PRIMARY
    bot_banner.line.fill.background()
    
    tf_bb = bot_banner.text_frame
    tf_bb.word_wrap = True
    p_bb = tf_bb.paragraphs[0]
    p_bb.text = "THANK YOU — QUESTIONS & DEMO SESSION"
    p_bb.font.name = FONT_DISPLAY
    p_bb.font.size = Pt(16)
    p_bb.font.color.rgb = C_WHITE
    p_bb.alignment = PP_ALIGN.CENTER
    bot_banner.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

    # Save presentation
    output_path = 'documents/Insider_Threat_Detection_Presentation.pptx'
    prs.save(output_path)
    print(f"Successfully generated clean, aligned PPTX at: {output_path}")

if __name__ == '__main__':
    build_presentation()
