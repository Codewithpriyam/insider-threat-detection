import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, 
    Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

font_dir = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri", os.path.join(font_dir, "calibri.ttf")))
pdfmetrics.registerFont(TTFont("Calibri-Bold", os.path.join(font_dir, "calibrib.ttf")))
pdfmetrics.registerFont(TTFont("Arial", os.path.join(font_dir, "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", os.path.join(font_dir, "arialbd.ttf")))

F_TITLE = "Calibri"
F_TITLE_BOLD = "Calibri-Bold"
F_BODY = "Arial"
F_BODY_BOLD = "Arial-Bold"
F_CODE = "Arial"

PAGE_WIDTH, PAGE_HEIGHT = letter  # 612 x 792 pt

C_NAVY = colors.HexColor("#17365d")      # Title color (Calibri 26pt bold)
C_BLUE = colors.HexColor("#365f91")      # Section header color (Calibri 14pt bold)
C_DIVIDER = colors.HexColor("#4f81bd")   # Divider rule color
C_TEXT = colors.HexColor("#000000")      # Black text

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations()
            super().showPage()
        super().save()

    def draw_page_decorations(self):
        self.saveState()
        # Outer rectangular border: x=24, y=24, w=564, h=744 (all pages)
        self.setStrokeColor(colors.black)
        self.setLineWidth(0.72)
        self.rect(24, 24, 564, 744, stroke=1, fill=0)
        self.restoreState()

def build_pdf():
    output_pdf = "documents/Insider_Threat_Detection_Report.pdf"
    
    # Left and right margins: 90 pt (x=90 to x=522 -> content width 432 pt)
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=letter,
        leftMargin=90,
        rightMargin=90,
        topMargin=46,
        bottomMargin=46
    )

    s_inst = ParagraphStyle("InstHeader", fontName=F_TITLE, fontSize=18, leading=22, textColor=C_TEXT)
    s_title = ParagraphStyle("DocTitle", fontName=F_TITLE, fontSize=26, leading=31.5, textColor=C_NAVY)
    s_sub = ParagraphStyle("SubHeader", fontName=F_BODY, fontSize=10, leading=14, alignment=TA_CENTER, textColor=C_TEXT)
    s_meta = ParagraphStyle("MetaText", fontName=F_BODY, fontSize=10, leading=16, textColor=C_TEXT)
    
    # Section Heading: Calibri-Bold, 14pt, leading 16pt, spaceBefore 7pt, spaceAfter 2pt
    s_h1 = ParagraphStyle(
        "Heading1",
        fontName=F_TITLE_BOLD,
        fontSize=14,
        leading=16,
        textColor=C_BLUE,
        spaceBefore=7,
        spaceAfter=2,
        keepWithNext=True
    )
    # Body text: Arial, 10pt, leading 11.6pt
    s_body = ParagraphStyle(
        "Body",
        fontName=F_BODY,
        fontSize=10,
        leading=11.6,
        textColor=C_TEXT,
        alignment=TA_LEFT,
        spaceAfter=2
    )
    s_bullet = ParagraphStyle(
        "Bullet",
        fontName=F_BODY,
        fontSize=10,
        leading=11.6,
        textColor=C_TEXT,
        leftIndent=12,
        firstLineIndent=-12,
        spaceAfter=1.5
    )
    s_code = ParagraphStyle(
        "CodeText",
        fontName=F_CODE,
        fontSize=10,
        leading=12.2,
        textColor=C_TEXT,
        spaceAfter=0.5
    )
    s_ref = ParagraphStyle(
        "Reference",
        fontName=F_BODY,
        fontSize=10,
        leading=13.5,
        textColor=C_TEXT,
        spaceAfter=2
    )

    story = []

    # ==========================================================
    # PAGE 1: TITLE & COVER PAGE
    # ==========================================================
    logo_path = "documents/extracted_assets/p1_img1_25.png"
    logo_img = RLImage(logo_path, width=60, height=60) if os.path.exists(logo_path) else ""

    # Header with logo on the far left (x=35) and text on single line
    header_table = Table(
        [[logo_img, Paragraph("B. P Poddar Institute of Management &amp; Technology", s_inst)]],
        colWidths=[65, 420]
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (0,0), -50),   # shift logo left to align at x ≈ 40
        ('LEFTPADDING', (1,0), (1,0), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 52))

    story.append(Paragraph("INSIDER THREAT DETECTION<br/>SIMULATOR", s_title))
    story.append(Spacer(1, 14))

    divider_table = Table([[""]], colWidths=[434], rowHeights=[1.5])
    divider_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_DIVIDER),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(divider_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("Mini Project Report", s_sub))
    story.append(Spacer(1, 16))

    story.append(Paragraph("Department:  <u>IT - B</u>", s_meta))
    story.append(Paragraph("Year: <u>4<sup>th</sup></u>", s_meta))
    story.append(Paragraph("Semister: <u>7<sup>th</sup></u>", s_meta))
    story.append(Paragraph("Session: <u>2026-27</u>", s_meta))
    story.append(Paragraph("Submission date: <u>02/11/2026</u>", s_meta))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Submitted by:", s_meta))
    story.append(Spacer(1, 16))

    # Requested student names and roll numbers:
    # Pallavi Kumari (11500223107)
    # Priyam Kumar (11500223108)
    # Rocky Sarkar (11500223109)
    # Sabir Alam (11500223110)
    team_data = [
        ["Name", "Rol No."],
        ["Pallavi Kumari", "11500223107"],
        ["Priyam Kumar", "11500223108"],
        ["Rocky Sarkar", "11500223109"],
        ["Sabir Alam", "11500223110"]
    ]
    team_table = Table(team_data, colWidths=[222, 222], rowHeights=[25, 25, 25, 25, 25])
    team_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), F_BODY),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('TEXTCOLOR', (0,0), (-1,-1), C_TEXT),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 38),
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('INNERGRID', (0,0), (-1,-1), 0.72, colors.black),
    ]))
    # Slightly center the table to match original margins
    team_table_wrapper = Table([[team_table]], colWidths=[434])
    team_table_wrapper.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('LEFTPADDING', (0,0), (-1,-1), -5),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(team_table_wrapper)
    story.append(PageBreak())

    # ==========================================================
    # PAGE 2: SECTIONS 1 TO 6 (Part 1)
    # ==========================================================
    story.append(Paragraph("Abstract", s_h1))
    story.append(Paragraph(
        "Insider threats present one of the most severe challenges in contemporary cybersecurity, "
        "as malicious or negligent actors operate with legitimate credentials and internal permissions, "
        "effectively bypassing conventional perimeter defenses. This mini project presents a real-time, "
        "rule-based User Behavior Analytics (UBA) detection system that demonstrates how suspicious insider "
        "activity can be detected through behavioral indicators. The application uses synthetic event records "
        "and normalized activity logs rather than destructive access. A Java Spring Boot backend analyzes "
        "event patterns and calculates a risk score, while an interactive web frontend displays the score, "
        "risk level, reasons, metric cards and event log.",
        s_body
    ))

    story.append(Paragraph("1. Introduction", s_h1))
    story.append(Paragraph(
        "Traditional detection based only on known malware signatures or external perimeter firewalls may not "
        "identify every new, internal or modified threat. Behavior-based detection instead looks for unusual actions, "
        "such as rapid off-hours access, repeated failed authentication, sudden privilege self-promotions, and "
        "unusually high-volume confidential downloads. This project demonstrates the basic concept using controlled "
        "sample data and synthetic scenarios.",
        s_body
    ))

    story.append(Paragraph("2. Problem Statement", s_h1))
    story.append(Paragraph(
        "The aim is to build a small educational application that can distinguish ordinary user activity from "
        "suspicious insider-threat-like patterns and explain why a scenario was flagged. The simulator must "
        "remain safe, provide clear explainability, and process high-volume events with sub-second response latency.",
        s_body
    ))

    story.append(Paragraph("3. Objectives", s_h1))
    story.append(Paragraph("• Demonstrate the concept of behavior-based insider threat detection.", s_bullet))
    story.append(Paragraph("• Create normal, suspicious and exfiltration-like synthetic scenarios.", s_bullet))
    story.append(Paragraph("• Analyze event counts and volume metrics using transparent heuristic rules.", s_bullet))
    story.append(Paragraph("• Display a risk score, risk category and detection reasons.", s_bullet))
    story.append(Paragraph("• Provide a simple web interface connected to a high-performance backend.", s_bullet))

    story.append(Paragraph("4. Tools and Technologies", s_h1))
    story.append(Paragraph(
        "Frontend: HTML, CSS, JavaScript, and React 19. Backend: Java Spring Boot 3.3.4. Data: predefined synthetic "
        "JSON-style event records and CSV audit logs. Browser communication: HTTP REST requests to a local API. "
        "The project can be run locally with Java 17+ and Maven, or accessed via the hosted web dashboard.",
        s_body
    ))

    story.append(Paragraph("5. System Architecture", s_h1))
    story.append(Paragraph(
        "The user selects one of three scenarios in the frontend or uploads CSV logs. JavaScript sends the selected "
        "scenario to the API endpoint `/api/logs`. The backend loads the corresponding synthetic events, evaluates "
        "behavioral indicators, calculates a score from 0 to 100, assigns LOW, MEDIUM, HIGH or CRITICAL risk, and "
        "returns JSON. The frontend displays the returned result, threat indicators, and event log.",
        s_body
    ))

    story.append(Paragraph("6. Methodology and Detection Logic", s_h1))
    story.append(Paragraph(
        "The detector uses simple explainable rules. It adds 25 points when an off-hours login occurs between 23:00 "
        "and 05:00; 25 points for at least 4 failed login attempts in a 10-minute sliding window; 20 points for at least "
        "10 file downloads; 25 points when total transferred bytes exceed 150 MB; and 35 points when an unauthorized "
        "role change to ROLE_ADMIN is attempted.",
        s_body
    ))
    story.append(PageBreak())

    # ==========================================================
    # PAGE 3: DETECTION LOGIC CONTINUED & CODE BLOCK
    # ==========================================================
    story.append(Paragraph(
        "The final score is capped at 100. Scores below 30 are LOW, 30–64 are MEDIUM, 65–84 are HIGH, and 85 or above "
        "are CRITICAL. These thresholds are illustrative and provide clear, transparent detection reasoning.",
        s_body
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Code:", s_h1))
    story.append(Spacer(1, 6))

    code_lines = [
        "if off_hours_login and (hour >= 23 or hour < 5):",
        "    score += 25",
        "    reasons.append(\"Off-hours access detected outside operating schedule\")",
        "",
        "if failed_login_count >= 4:",
        "    score += 25",
        "    reasons.append(\"Repeated failed login attempts in 10-min window\")",
        "",
        "if download_count >= 10:",
        "    score += 20",
        "    reasons.append(\"High volume of file downloads detected\")",
        "",
        "if total_bytes_transferred >= 150 * 1024 * 1024:",
        "    score += 25",
        "    reasons.append(\"Rapid mass data exfiltration volume detected (>150MB)\")",
        "",
        "if role_change and new_role == \"ROLE_ADMIN\":",
        "    score += 35",
        "    reasons.append(\"Unauthorized administrative privilege escalation attempted\")",
        "",
        "score = min(score, 100)",
        "",
        "if score >= 85:",
        "    level = \"CRITICAL\"",
        "    message = \"Critical insider threat detected. Revoke session and escalate immediately.\"",
        "elif score >= 65:",
        "    level = \"HIGH\"",
        "    message = \"Insider-like behavior detected. Isolate the simulated account and investigate.\"",
        "elif score >= 30:",
        "    level = \"MEDIUM\"",
        "    message = \"Suspicious activity. Continue monitoring and review the event details.\"",
        "else:",
        "    level = \"LOW\"",
        "    message = \"No strong insider threat indicators in this synthetic event set.\""
    ]
    for line in code_lines:
        display_line = line.replace(" ", "&nbsp;") if line else "&nbsp;"
        story.append(Paragraph(display_line, s_code))

    story.append(PageBreak())

    # ==========================================================
    # PAGE 4: SECTIONS 7, 8 & DEMO SCREENSHOT 1
    # ==========================================================
    story.append(Paragraph("7. Implementation", s_h1))
    story.append(Paragraph(
        "The backend exposes `/api/logs`, `/api/logs/upload`, `/api/threats` and `/api/threats/resolve`. The frontend "
        "provides three scenario buttons and an Analyze / Simulator button. It uses Fetch API to send a POST request "
        "and renders the response without reloading the page. The custom CSV upload endpoint accepts enterprise audit "
        "logs for further experimentation.",
        s_body
    ))

    story.append(Paragraph("8. Testing and Expected Results", s_h1))
    story.append(Paragraph(
        "Normal scenario: low activity and routine daytime views; expected risk is LOW. Suspicious scenario: off-hours "
        "access combined with repeated downloads; expected risk is MEDIUM or HIGH depending on the combined score. "
        "Threat scenario: high-volume writes, mass file downloads, and privilege escalation; expected risk is HIGH or "
        "CRITICAL. The exact score is calculated by the backend rules. Test each scenario and compare displayed metrics.",
        s_body
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Demo &amp; Example", s_h1))
    story.append(Paragraph("Live URL: https://codewithpriyam.github.io/insider-threat-detection/", s_body))
    story.append(Spacer(1, 6))
    story.append(Paragraph("1.", s_body))
    story.append(Spacer(1, 4))

    img1_path = "documents/extracted_assets/demo_screenshot_1.png"
    if os.path.exists(img1_path):
        story.append(RLImage(img1_path, width=432, height=200))

    story.append(PageBreak())

    # ==========================================================
    # PAGE 5: DEMO SCREENSHOTS 2 & 3
    # ==========================================================
    story.append(Paragraph("2.", s_body))
    story.append(Spacer(1, 4))
    img2_path = "documents/extracted_assets/demo_screenshot_2.png"
    if os.path.exists(img2_path):
        story.append(RLImage(img2_path, width=432, height=225))

    story.append(Spacer(1, 10))
    story.append(Paragraph("3.", s_body))
    story.append(Spacer(1, 4))
    img3_path = "documents/extracted_assets/demo_screenshot_3.png"
    if os.path.exists(img3_path):
        story.append(RLImage(img3_path, width=432, height=225))

    story.append(PageBreak())

    # ==========================================================
    # PAGE 6: SECTIONS 9, 10, 11 & REFERENCES
    # ==========================================================
    story.append(Paragraph("9. Advantages", s_h1))
    story.append(Paragraph("• Simple and easy to demonstrate.", s_bullet))
    story.append(Paragraph("• Explainable rules make the result understandable.", s_bullet))
    story.append(Paragraph("• Separates frontend and backend responsibilities.", s_bullet))
    story.append(Paragraph("• Uses synthetic data, so it is safe for classroom use.", s_bullet))
    story.append(Paragraph("• Can be extended with real endpoint telemetry in a controlled research environment.", s_bullet))

    story.append(Paragraph("10. Limitations and Future Scope", s_h1))
    story.append(Paragraph(
        "This is a rule-based prototype and does not inspect real OS kernel system calls. It may produce false "
        "positives and false negatives. Future work could include collecting benign activity baselines, adding "
        "machine-learning classifiers on vetted datasets, adding alert history, and evaluating precision, recall "
        "and F1-score. Any real-world monitoring should be authorized, privacy-aware and tested in an isolated environment.",
        s_body
    ))

    story.append(Paragraph("11. Conclusion", s_h1))
    story.append(Paragraph(
        "The project demonstrates the fundamental idea that insider-threat-like behavior can be identified through "
        "combinations of unusual user file operations and access events. A lightweight Spring Boot backend evaluates "
        "synthetic events and a web dashboard communicates the result clearly. The simulator is intended for learning "
        "and demonstration, not for production security protection.",
        s_body
    ))

    story.append(Paragraph("References", s_h1))
    story.append(Paragraph("1. CISA, Insider Threat Mitigation Guidance: https://www.cisa.gov/insider-threat-mitigation", s_ref))
    story.append(Paragraph("2. NIST Cybersecurity Framework: https://www.nist.gov/cyberframework", s_ref))
    story.append(Paragraph("3. Spring Boot documentation: https://spring.io/projects/spring-boot", s_ref))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated clean report PDF at: {output_pdf}")

if __name__ == '__main__':
    build_pdf()
