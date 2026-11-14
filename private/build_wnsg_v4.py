"""
When Nothing Sounds Good - PDF Guide v4
Incorporates all editorial improvements from the Reimagined PDF:
  - Lane-based Appetite Compass (2 pages)
  - Chef tips on all 20 meals
  - Fixed fiber/why section (no unsupported claims)
  - New grocery map (5 ready-to-shop groups)
  - Stronger When Hunger Returns (3 plate examples)
  - Clean closing without medical disclaimers
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether,
    HRFlowable, NextPageTemplate, Image as RLImage)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Fonts
FONT_DIR = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('DJS',  FONT_DIR + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DJSb', FONT_DIR + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DJSi', FONT_DIR + 'DejaVuSans-Oblique.ttf'))
pdfmetrics.registerFont(TTFont('DJRb', FONT_DIR + 'DejaVuSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DJRi', FONT_DIR + 'DejaVuSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('DJR',  FONT_DIR + 'DejaVuSerif.ttf'))

# ── Colors
CREAM     = HexColor('#F5ECE0')
DK_GREEN  = HexColor('#1F453B')
MD_GREEN  = HexColor('#196641')
BODY_COL  = HexColor('#2B2B2B')
MUTED_COL = HexColor('#5A5A5A')
TAN_RULE  = HexColor('#D6CDB8')
LIGHT_BG  = HexColor('#EEF5EB')

W, H = letter  # 612 x 792 pt

LOGO_COVER    = '/sessions/loving-optimistic-einstein/mnt/outputs/cover_logo_rgba.png'
LOGO_INTERIOR = '/sessions/loving-optimistic-einstein/mnt/outputs/interior_logo_rgba.png'
COVER_PHOTO   = '/sessions/loving-optimistic-einstein/mnt/uploads/IMG_0622.jpg'

PF_URL   = 'https://chefhealthyhenry.com/cookbook'
HOME_URL = 'https://chefhealthyhenry.com'

# ── Page geometry
LM = 61; RM = 61; TM = 71; BM = 57
UW = W - LM - RM   # 490 pt usable width


def lnk(url, text, color='#196641'):
    return f'<a href="{url}" color="{color}">{text}</a>'


# ─────────────────────────── CANVAS CALLBACKS

def draw_cover(c, doc):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(MD_GREEN)
    c.rect(0, H - 79, W, 79, fill=1, stroke=0)
    c.setFillColor(white); c.setFont('DJRb', 12)
    c.drawString(LM, H - 49, 'CHEF HEALTHY HENRY')
    c.setFont('DJS', 9.5)
    c.drawRightString(W - RM, H - 49, 'chefhealthyhenry.com')
    # Logo
    try:
        lw, lh = 75, 75
        c.drawImage(LOGO_COVER, (W - lw) / 2, H - 79 - 12 - lh,
                    width=lw, height=lh, mask='auto')
    except Exception:
        pass

    # Photo — full bleed, 270pt tall, scale-to-fill with center crop
    logo_bottom = H - 79 - 12 - 75
    photo_h = 270
    photo_y = logo_bottom - 10 - photo_h
    try:
        from PIL import Image as PILImage
        _img = PILImage.open(COVER_PHOTO)
        _pw, _ph = _img.size
        # scale so image fills width; if that makes it taller than band, crop vertically
        _scale = W / _pw
        _draw_w = W
        _draw_h = _ph * _scale
        if _draw_h < photo_h:          # photo too short — scale to height instead
            _scale = photo_h / _ph
            _draw_h = photo_h
            _draw_w = _pw * _scale
        _x_off = (W - _draw_w) / 2    # center horizontally
        _y_off = photo_y - (_draw_h - photo_h) / 2   # center vertically within band
        c.saveState()
        p = c.beginPath()
        p.rect(0, photo_y, W, photo_h)
        c.clipPath(p, stroke=0)
        c.drawImage(COVER_PHOTO, _x_off, _y_off, width=_draw_w, height=_draw_h, mask='auto')
        c.restoreState()
    except Exception:
        pass
    c.setStrokeColor(MD_GREEN); c.setLineWidth(0.75)
    c.line(0, photo_y + photo_h, W, photo_y + photo_h)
    c.line(0, photo_y,           W, photo_y)

    # Title block
    G = 28
    c.setStrokeColor(MD_GREEN); c.setLineWidth(1.5)
    c.line(W/2 - 36, photo_y - G, W/2 + 36, photo_y - G)
    c.setFont('DJSb', 8.5); c.setFillColor(MD_GREEN)
    c.drawCentredString(W/2, photo_y - G - 18,
        'A  C O M P A N I O N  G U I D E  F R O M  C H E F  H E A L T H Y  H E N R Y')
    c.setFont('DJRb', 38); c.setFillColor(DK_GREEN)
    c.drawCentredString(W/2, photo_y - G - 58, 'When Nothing')
    c.drawCentredString(W/2, photo_y - G - 102, 'Sounds Good')
    c.setFont('DJRi', 13); c.setFillColor(BODY_COL)
    c.drawCentredString(W/2, photo_y - G - 120, 'Chef-built meals for low appetite,')
    c.drawCentredString(W/2, photo_y - G - 137, 'changing hunger, and real life.')
    c.setFont('DJSb', 9.5); c.setFillColor(MD_GREEN)
    c.drawCentredString(W/2, photo_y - G - 161, 'PROTEIN.  FIBER.  SATISFACTION.')
    c.setFont('DJRb', 10); c.setFillColor(BODY_COL)
    c.drawCentredString(W/2, photo_y - G - 180, 'by Chef Healthy Henry')
    c.setFont('DJS', 8); c.setFillColor(MUTED_COL)
    c.drawCentredString(W/2, photo_y - G - 195,
        'Classically trained chef.  Former bariatric patient.  Creator of the Protein Flip™ method.')
    c.setFillColor(DK_GREEN)
    c.rect(0, 0, W, 65, fill=1, stroke=0)


def draw_interior(c, doc):
    c.setStrokeColor(TAN_RULE); c.setLineWidth(0.5)
    c.line(LM, H - 46, W - RM, H - 46)
    c.setFont('DJS', 8.5); c.setFillColor(MUTED_COL)
    c.drawString(LM, H - 54, 'When Nothing Sounds Good')
    try:
        c.drawImage(LOGO_INTERIOR, W - RM - 94, H - 42, width=94, height=27, mask='auto')
    except Exception:
        pass
    c.setStrokeColor(MD_GREEN); c.setLineWidth(1.5)
    c.line(LM, BM - 11, W - RM, BM - 11)
    c.setFont('DJS', 8.5); c.setFillColor(MUTED_COL)
    c.drawString(LM, BM - 25, 'Chef Healthy Henry')
    c.drawRightString(W - RM, BM - 25, str(doc.page))
    c.setFillColor(MD_GREEN)
    c.rect(LM, H - 71, 48, 3, fill=1, stroke=0)


# ─────────────────────────── STYLES

def make_styles():
    s = {}
    s['chapter_label'] = ParagraphStyle('cl', fontName='DJSb', fontSize=9,
        leading=13, textColor=MD_GREEN, spaceBefore=10, spaceAfter=4)
    s['page_title'] = ParagraphStyle('pt', fontName='DJRb', fontSize=22,
        leading=27, textColor=DK_GREEN, spaceAfter=12)
    s['callout'] = ParagraphStyle('cq', fontName='DJRi', fontSize=16,
        leading=22, textColor=DK_GREEN, spaceBefore=4, spaceAfter=4, leftIndent=4)
    s['lead'] = ParagraphStyle('lead', fontName='DJS', fontSize=12,
        leading=17, textColor=BODY_COL, spaceAfter=7)
    s['body'] = ParagraphStyle('body', fontName='DJS', fontSize=10.5,
        leading=15, textColor=BODY_COL, spaceAfter=6, alignment=TA_JUSTIFY)
    s['small'] = ParagraphStyle('sm', fontName='DJS', fontSize=9,
        leading=13, textColor=MUTED_COL, spaceAfter=4)
    s['h2'] = ParagraphStyle('h2', fontName='DJSb', fontSize=12,
        leading=16, textColor=BODY_COL, spaceBefore=10, spaceAfter=5)
    s['num_label'] = ParagraphStyle('nl', fontName='DJSb', fontSize=10,
        leading=14, textColor=MD_GREEN, spaceAfter=2)
    s['meal_title'] = ParagraphStyle('mt', fontName='DJSb', fontSize=10.5,
        leading=15, textColor=DK_GREEN, spaceAfter=4)
    s['meal_body'] = ParagraphStyle('mb', fontName='DJS', fontSize=9.5,
        leading=14, textColor=BODY_COL, spaceAfter=2, alignment=TA_JUSTIFY)
    s['meal_pf'] = ParagraphStyle('mpf', fontName='DJS', fontSize=8.5,
        leading=12, textColor=MD_GREEN, spaceAfter=1)
    s['meal_tip'] = ParagraphStyle('mtp', fontName='DJSi', fontSize=8.5,
        leading=12, textColor=MUTED_COL, spaceAfter=2)
    s['tbl_label'] = ParagraphStyle('tl', fontName='DJSb', fontSize=8.5,
        leading=12, textColor=MD_GREEN, spaceAfter=2)
    s['footer'] = ParagraphStyle('ft', fontName='DJS', fontSize=8.5,
        leading=11, textColor=MUTED_COL, alignment=TA_CENTER)
    s['caption_bold'] = ParagraphStyle('cb', fontName='DJSb', fontSize=9,
        leading=13, textColor=DK_GREEN)
    s['body_left'] = ParagraphStyle('bl', fontName='DJS', fontSize=10.5,
        leading=15, textColor=BODY_COL, spaceAfter=6, alignment=TA_LEFT)
    s['lane_title'] = ParagraphStyle('lt', fontName='DJSb', fontSize=10,
        leading=14, textColor=DK_GREEN, spaceAfter=1)
    s['lane_body'] = ParagraphStyle('lb', fontName='DJS', fontSize=9.5,
        leading=14, textColor=BODY_COL, spaceAfter=0)
    return s


# ─────────────────────────── HELPERS

def callout_box(text, s):
    inner = Table([[Paragraph(text, s['callout'])]], colWidths=[UW - 20])
    inner.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))
    t = Table([[Table([['']], colWidths=[5], rowHeights=[None]), inner]],
              colWidths=[5, UW - 5])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), MD_GREEN),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
    ]))
    return t


def lane_block(lane_title, meal_list_text, s):
    """A lane card for the Appetite Compass."""
    rows = [
        [Paragraph(lane_title, s['lane_title'])],
        [Paragraph(meal_list_text, s['lane_body'])],
    ]
    t = Table(rows, colWidths=[UW])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), CREAM),
        ('TOPPADDING',    (0,0), (-1,0),  6),
        ('TOPPADDING',    (0,1), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-2), 2),
        ('BOTTOMPADDING', (0,-1),(-1,-1), 7),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('LINEBELOW',     (0,-1),(-1,-1), 0.4, TAN_RULE),
    ]))
    return t


def meal_card(number, title, recipe, pf_note, chef_tip, s):
    rows = [
        [Paragraph(f'{number} | {title}', s['meal_title'])],
        [Paragraph(recipe, s['meal_body'])],
        [Paragraph(pf_note, s['meal_pf'])],
        [Paragraph(f'Chef tip: {chef_tip}', s['meal_tip'])],
    ]
    t = Table(rows, colWidths=[UW])
    t.setStyle(TableStyle([
        ('TOPPADDING',    (0,0),  (-1,0),  5),
        ('TOPPADDING',    (0,1),  (-1,-1), 2),
        ('BOTTOMPADDING', (0,0),  (-1,-2), 2),
        ('BOTTOMPADDING', (0,-1), (-1,-1), 5),
        ('LEFTPADDING',   (0,0),  (-1,-1), 10),
        ('RIGHTPADDING',  (0,0),  (-1,-1), 10),
        ('BACKGROUND',    (0,0),  (-1,-1), CREAM),
        ('LINEBELOW',     (0,-1), (-1,-1), 0.3, TAN_RULE),
    ]))
    return KeepTogether([t, Spacer(1, 3)])


def two_col(left_label, left_text, right_label, right_text, s):
    t = Table([
        [Paragraph(left_label,  s['tbl_label']), Paragraph(right_label,  s['tbl_label'])],
        [Paragraph(left_text,   s['body_left']), Paragraph(right_text,   s['body_left'])],
    ], colWidths=[UW/2 - 4, UW/2 - 4])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), CREAM),
        ('BACKGROUND',    (1,0), (1,-1), LIGHT_BG),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LINEAFTER',     (0,0), (0,-1),  0.5, TAN_RULE),
        ('LINEBELOW',     (0,0), (-1,0),  0.4, TAN_RULE),
    ]))
    return t


def chapter_start(story, label, title, s):
    story.append(Spacer(1, 5))
    story.append(Paragraph(label, s['chapter_label']))
    story.append(Paragraph(title, s['page_title']))


def sec_sep(story):
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width='100%', thickness=0.5, color=TAN_RULE,
                             spaceBefore=0, spaceAfter=10))


# ─────────────────────────── BUILD

def build():
    OUT = '/sessions/loving-optimistic-einstein/mnt/outputs/When_Nothing_Sounds_Good.pdf'
    s = make_styles()

    interior_frame = Frame(LM, BM, UW, H - TM - BM,
                           leftPadding=0, rightPadding=0,
                           topPadding=0, bottomPadding=0, id='interior')
    cover_frame = Frame(LM, 65, UW, H - 79 - 65,
                        leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0, id='cover')

    cover_tmpl    = PageTemplate(id='cover',    frames=[cover_frame],    onPage=draw_cover)
    interior_tmpl = PageTemplate(id='interior', frames=[interior_frame], onPage=draw_interior)

    doc = BaseDocTemplate(OUT, pagesize=letter,
                          leftMargin=LM, rightMargin=RM,
                          topMargin=TM,  bottomMargin=BM,
                          title='When Nothing Sounds Good',
                          author='Chef Healthy Henry')
    doc.addPageTemplates([cover_tmpl, interior_tmpl])

    story = []

    # ══════════════════════════════════════════════════════
    # PAGE 1 — COVER
    # ══════════════════════════════════════════════════════
    story.append(Spacer(1, 1))
    story.append(NextPageTemplate('interior'))
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════
    # PAGE 2 — WELCOME
    # ══════════════════════════════════════════════════════
    chapter_start(story, 'WELCOME', 'A real answer for that refrigerator moment.', s)
    story.append(Paragraph(
        'You open the refrigerator. You know you should eat something, but nothing jumps out. '
        'You may want something cold, warm, creamy, crisp, familiar, or completely different '
        'from yesterday. The problem is not a lack of recipes. The problem is choosing one that '
        'sounds good right now.', s['lead']))
    story.append(Paragraph(
        'This guide starts where your appetite is. You will make four decisions: temperature, '
        'texture, effort, and flavor. Then you will find a specific meal rather than another '
        'long list of ideas.', s['body']))
    story.append(callout_box(
        'Knowing what you should eat is not the problem. '
        'Having a real answer for when nothing sounds good is.', s))
    story.append(Paragraph('How to use this guide.', s['h2']))
    story.append(Paragraph(
        'Use the Appetite Compass on the next two pages. Go to the meal number. '
        'Assemble the listed ingredients. Use the chef tip to make it taste like a meal, '
        'not a collection of food.', s['body']))
    story.append(Paragraph(
        'Every combination follows Protein Flip™: a portion-smart primary protein, '
        'a supporting protein, fiber-rich ingredients, and a flavor finish. '
        'Either protein role can be filled by plants or animal foods. '
        'The meal is a team.', s['body']))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        'You do not need a new cooking project. You need a few dependable plates '
        'you actually want to eat.', s['callout']))

    # ══════════════════════════════════════════════════════
    # PAGE 3 — FROM THE CHEF
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'FROM THE CHEF', 'Food can be simple and still feel complete.', s)
    story.append(Paragraph(
        'I created the Protein Flip™ Method because what matters is not one giant protein '
        'serving or one "perfect" food. It is how the whole plate works together. '
        'Beans can carry protein and fiber. Eggs can bridge ingredients. '
        'Yogurt can add a second source of protein and a sauce. '
        'Herbs, acidity, and texture make the result worth returning to.', s['body']))
    story.append(Paragraph(
        'That matters even more when hunger changes. A Portion Smart plate is not a '
        'stripped-down plate. It still receives each meaningful part of the dish.', s['body']))
    story.append(callout_box(
        'Build the plate. Keep the method. Let everything else be flexible.', s))
    story.append(Spacer(1, 12))
    story.append(Paragraph('MAKE YOUR FALLBACK PLAN BEFORE YOU NEED IT', s['num_label']))
    story.append(Paragraph(
        'Choose three meals in this guide that already sound appealing. '
        'Keep those ingredients in reach. Your fallback plan should be familiar enough '
        'to use without making another decision.', s['body']))
    ac = Table([
        [Paragraph('My best temperature: _____________________  My easiest texture: _____________________', s['body'])],
        [Paragraph('Two ready protein partners I keep: _____________________ + _____________________', s['body'])],
        [Paragraph('My three meal numbers: __________ / __________ / __________', s['body'])],
        [Paragraph('My favorite five-minute finish: _________________________________________________', s['body'])],
    ], colWidths=[UW])
    ac.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), CREAM),
        ('TOPPADDING',    (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
        ('LINEBELOW',     (0,0), (-1,-2), 0.3, TAN_RULE),
        ('LINEABOVE',     (0,0), (-1,0),  1.5, MD_GREEN),
        ('LINEBELOW',     (0,-1),(-1,-1), 1.5, MD_GREEN),
    ]))
    story.append(ac)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        '<b>Portion Smart means distributing the meal thoughtfully, not simply eating less.</b>',
        s['small']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'Keep cooking. Stay nourished. I will see you on the next plate.',
        s['callout']))
    story.append(Paragraph('Chef Healthy Henry', s['num_label']))

    # ══════════════════════════════════════════════════════
    # PAGE 4 — APPETITE COMPASS (lane-based)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'THE DECISION TOOL', 'The Appetite Compass.', s)
    story.append(Paragraph(
        'Begin with what sounds appealing, not with a food rule. '
        'Pick one lane. Then choose any meal number in that lane.',
        s['lead']))
    story.append(Spacer(1, 6))

    story.append(lane_block(
        'Cold and creamy  •  no stove',
        'Try 1 Berry-Oat Yogurt, 2 White Bean Cottage Cheese, 3 Peach Tofu Cream, '
        '4 Overnight Oats, or 10 Hummus Cottage Cheese. These are chilled and spoonable.', s))
    story.append(Spacer(1, 4))
    story.append(lane_block(
        'Fresh and savory  •  assemble only',
        'Try 8 Lentil-Feta Yogurt, 9 Tuna White Bean, 16 Chicken Chickpea Pita, '
        '17 Egg-Hummus Box, 19 Lentil-Edamame Feta, or 20 White Bean Salmon. '
        'These use ready-cooked ingredients.', s))
    story.append(Spacer(1, 4))
    story.append(lane_block(
        'Warm and soft  •  spoon or fork',
        'Try 7 Edamame Tofu Ginger, 11 Red Lentil Chicken Soup, 12 White Bean Spinach Soup, '
        '13 Tofu Edamame Miso, 14 Salmon Lentil Zucchini, or 15 Egg White Bean Tomato.', s))
    story.append(Spacer(1, 4))
    story.append(lane_block(
        'Crisp or handheld  •  some bite',
        'Try 5 Egg Pinto Bean Bites, 6 White Bean Egg Toast, 16 Chicken Chickpea Pita, '
        '17 Egg-Hummus Box, or 18 Turkey Black Bean Quesadilla.', s))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        'Some meal numbers appear in more than one lane. That is intentional. '
        'A meal that works cold can also work crisp or handheld. The lanes are starting points, not strict boundaries.',
        s['small']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        '<b>Cannot decide?</b> Pick your three fallback meals on the previous page. '
        'Familiar is a useful choice.',
        s['body']))

    # ══════════════════════════════════════════════════════
    # PAGE 5 — MAKE THE CHOICE IN UNDER A MINUTE
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'THE DECISION TOOL', 'Make the choice in under a minute.', s)
    story.append(Paragraph('Ask these four questions.', s['h2']))

    q_rows = [
        [Paragraph('1. TEMPERATURE', s['tbl_label']),
         Paragraph('cold, room temperature, or warm?', s['body'])],
        [Paragraph('2. TEXTURE', s['tbl_label']),
         Paragraph('smooth, soft, crisp, or handheld?', s['body'])],
        [Paragraph('3. EFFORT', s['tbl_label']),
         Paragraph('assemble, five minutes, or about fifteen minutes?', s['body'])],
        [Paragraph('4. FLAVOR', s['tbl_label']),
         Paragraph('mild, savory, bright, or herb-forward?', s['body'])],
    ]
    qtbl = Table(q_rows, colWidths=[1.4*inch, UW - 1.4*inch])
    qtbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), LIGHT_BG),
        ('BACKGROUND',    (1,0), (1,-1), white),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
        ('LINEBELOW',     (0,0), (-1,-2), 0.3, TAN_RULE),
        ('LINEAFTER',     (0,0), (0,-1),  0.5, MD_GREEN),
    ]))
    story.append(qtbl)
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        'Now match the answers to a meal. If you want cold, creamy, and no cooking, '
        'choose Meal 3. If you want warm, soft, and mild, choose Meal 12. '
        'If you want savory without turning on the stove, choose Meal 8 or 20. '
        'If you want something you can hold, choose Meal 16 or 18.',
        s['body']))

    story.append(Paragraph('Change one thing, not the whole meal.', s['h2']))
    story.append(Paragraph(
        'If you like the ingredients but not the eating experience, change one variable. '
        'Chill the bean cup. Warm the lentils. Mash the chickpeas. Serve the sauce on the side. '
        'Use lemon zest rather than lemon juice. These are chef choices that change the feel '
        'of a meal without changing its Protein Flip™ foundation.',
        s['body']))
    story.append(Spacer(1, 10))

    story.append(Paragraph('YOUR PERSONAL SHORT LIST', s['num_label']))
    psl = Table([
        [Paragraph('Cold favorite: ________________  Warm favorite: ________________  Fastest savory choice: ________________', s['body'])],
    ], colWidths=[UW])
    psl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), CREAM),
        ('TOPPADDING',    (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
        ('LINEABOVE',     (0,0), (-1,0),  1.5, MD_GREEN),
        ('LINEBELOW',     (0,-1),(-1,-1), 1.5, MD_GREEN),
    ]))
    story.append(psl)
    story.append(Spacer(1, 12))
    story.append(callout_box(
        'The right meal is the one that sounds good enough to make '
        'and complete enough to satisfy.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 6 — THE METHOD: PORTION SMART PLATE
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'THE METHOD', 'The Portion Smart Plate.', s)
    story.append(Paragraph(
        'A Protein Flip™ meal works because ingredients share the work. '
        'Primary and secondary protein describe roles on the plate, not whether '
        'a food comes from an animal or a plant.', s['lead']))

    plate_rows = [
        [Paragraph('PRIMARY PROTEIN', s['tbl_label']),
         Paragraph('<b>The anchor.</b> This can be lentils, beans, tofu, eggs, chicken, or fish. '
                   'The anchor gives the meal its identity. It is present without crowding out the rest.', s['body'])],
        [Paragraph('SECONDARY PROTEIN', s['tbl_label']),
         Paragraph('<b>The teammate.</b> This could be yogurt with lentils, edamame alongside tofu, '
                   'an egg with beans, or white beans beside fish. '
                   'It adds protein while also bringing a different flavor or texture.', s['body'])],
        [Paragraph('FIBER-RICH INGREDIENTS', s['tbl_label']),
         Paragraph('<b>Part of the structure.</b> Beans, lentils, vegetables, fruit, oats, and whole grains '
                   'bring fiber. Many also add protein. White beans are not just "the vegetable side" '
                   'when served with salmon; they do two jobs at once.', s['body'])],
        [Paragraph('FLAVOR + TEXTURE', s['tbl_label']),
         Paragraph('<b>The reason to return.</b> One useful finish is often enough: lemon and dill, '
                   'yogurt and parsley, toasted pepitas, olive oil and oregano, or a little fresh tomato.', s['body'])],
    ]
    ptbl = Table(plate_rows, colWidths=[1.4*inch, UW - 1.4*inch])
    ptbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), LIGHT_BG),
        ('BACKGROUND',    (1,0), (1,-1), white),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW',     (0,0), (-1,-2), 0.4, TAN_RULE),
        ('LINEAFTER',     (0,0), (0,-1),  0.5, MD_GREEN),
    ]))
    story.append(ptbl)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        '<b>The quick check:</b> Is protein dispersed? Is fiber meaningfully present? '
        'Does the finish make the ingredients taste connected? '
        'Did the Portion Smart plate receive each meaningful component?',
        s['small']))
    story.append(Spacer(1, 8))
    story.append(callout_box(
        'One plate. Several contributors. No ingredient has to do everything.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 7 — THE WHY: PROTEIN AND FIBER
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'THE WHY', 'How protein and fiber work together.', s)
    story.append(Paragraph(
        'Protein contributes to normal body functions, including muscle maintenance. '
        'Fiber-rich foods add structure and can help meals feel satisfying. '
        'Together, these ingredients give a meal more than one source of nourishment. '
        'They also create more interesting textures and flavors.',
        s['lead']))

    story.append(Paragraph('Three practical examples.', s['h2']))

    ex_rows = [
        [Paragraph('Lentils + Greek yogurt + roasted peppers', s['tbl_label']),
         Paragraph('Lentils provide plant protein and fiber; yogurt adds a second protein '
                   'and a creamy finish; peppers bring sweetness and color.', s['body'])],
        [Paragraph('Salmon + white beans + zucchini', s['tbl_label']),
         Paragraph('Salmon is the anchor; beans carry supporting protein and fiber; '
                   'zucchini brings a tender vegetable layer; dill joins everything.', s['body'])],
        [Paragraph('Egg + pinto beans + avocado + tomato', s['tbl_label']),
         Paragraph('Egg acts as a bridge protein; beans bring protein and fiber; '
                   'avocado contributes richness; tomato and lime brighten the bites.', s['body'])],
    ]
    extbl = Table(ex_rows, colWidths=[1.8*inch, UW - 1.8*inch])
    extbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), LIGHT_BG),
        ('BACKGROUND',    (1,0), (1,-1), white),
        ('ROWBACKGROUNDS',(0,0), (0,-1), [LIGHT_BG]),
        ('ROWBACKGROUNDS',(1,0), (1,-1), [CREAM, white, CREAM]),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW',     (0,0), (-1,-2), 0.4, TAN_RULE),
        ('LINEAFTER',     (0,0), (0,-1),  0.5, MD_GREEN),
    ]))
    story.append(extbl)
    story.append(Spacer(1, 12))

    story.append(Paragraph('Satisfaction is more than fullness.', s['h2']))
    story.append(Paragraph(
        'A meal can be physically filling yet still feel unfinished. '
        'Food is more enjoyable when it has a clear flavor, an appealing temperature, '
        'and a useful contrast such as creamy with crisp or warm with bright. '
        'Protein and fiber are important parts of the plate, but taste matters too.',
        s['body']))
    story.append(Paragraph(
        'Different meals and appetites feel different. '
        'Use how a meal tastes and how you feel afterward as information for the next plate.',
        s['body']))
    story.append(Spacer(1, 8))
    story.append(callout_box(
        'Build for nourishment and satisfaction, not a contest to eat the most protein.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 8 — MEALS 1-5: Cold Breakfasts
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, '20 MEALS  •  1-5', 'Cold breakfasts and soft starts.', s)
    story.append(Paragraph(
        'No stove, no complicated preparation, and very little effort. '
        'Built for mornings when warmth and time are both off the table. '
        'Each assembles in minutes and pairs protein with fiber.',
        s['lead']))
    story.append(Spacer(1, 4))

    story.append(meal_card('1', 'Berry, Oat and Greek Yogurt Spoon Bowl',
        'Mix 1/2 cup plain Greek yogurt, 1/4 cup cooked cooled oats, 1/4 cup berries, '
        'and 1 tsp ground flax. Finish with cinnamon.',
        'Protein Flip™: Primary: yogurt. Supporting: oats and flax. Fiber: oats, berries, flax.',
        'Layer the berries on top; their fresh taste cuts through the creamy base.', s))
    story.append(meal_card('2', 'Savory White Bean and Cottage Cheese Cup with Roasted Red Pepper',
        'Mash half of 1/2 cup cannellini beans with 1/2 cup cottage cheese until partly smooth. '
        'Fold in the remaining beans, 2 tbsp finely diced cucumber, 2 tbsp finely diced roasted red pepper '
        '(patted dry), 1 tbsp thinly sliced scallion, 1 tsp chopped fresh dill, 1/4 tsp lemon zest, and '
        '1 tsp fresh lemon juice. Season with salt and pepper. Spoon into a bowl and drizzle with '
        '1 tsp olive oil. Garnish with a little roasted red pepper and dill.',
        'Protein Flip™: Shared anchor: beans and cottage cheese. Fiber: beans and cucumber.',
        'Creamy white beans and cottage cheese with crisp cucumber, sweet roasted red pepper, '
        'fresh dill, and lemon. 5 minutes, no stove.', s))
    story.append(meal_card('3', 'Peach, Tofu and Almond Cream',
        'Blend 1/2 cup silken tofu, 1/4 cup plain Greek yogurt, 1/2 ripe peach, '
        'and 1 tsp almond butter until smooth.',
        'Protein Flip™: Primary: tofu. Supporting: yogurt and almond. Fiber: peach.',
        'Chill before serving. A tiny pinch of cinnamon brings out the peach.', s))
    story.append(meal_card('4', 'Overnight Oat, Chia and Yogurt Jar',
        'Stir 1/4 cup rolled oats, 1/2 cup milk, 1/3 cup Greek yogurt, and 1 tsp chia. '
        'Refrigerate overnight; add 1/4 cup raspberries before eating.',
        'Protein Flip™: Primary: yogurt. Supporting: milk, oats and chia. Fiber: oats, chia and berries.',
        'Stir once after ten minutes to keep the chia evenly dispersed.', s))
    story.append(meal_card('5', 'Egg, Pinto Bean and Avocado Bites',
        'Combine 1 chopped hard-boiled egg, 1/3 cup mashed pinto beans, '
        '2 tbsp avocado, diced tomato, and lime.',
        'Protein Flip™: Shared protein: egg and pinto beans. Fiber: beans, avocado and tomato.',
        'Season the mashed beans first, then fold in egg so every bite tastes finished.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 9 — MEALS 6-10: Five-Minute Savory
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, '20 MEALS  •  6-10', 'Five-minute savory plates.', s)
    story.append(Paragraph(
        'Every option is a named combination. No browsing. No ingredient decisions. '
        'Each assembles from ingredients already cooked, canned, or ready to warm.',
        s['lead']))
    story.append(Spacer(1, 4))

    story.append(meal_card('6', 'Lemony White Bean and Egg Toast',
        'Mash 1/3 cup cannellini beans with 1 tbsp yogurt and lemon zest. '
        'Spread over 1/2 slice whole-grain toast. Add 1 chopped cooked egg and parsley.',
        'Protein Flip™: Primary: beans. Supporting: egg and yogurt. Fiber: beans and toast.',
        'Toast well so the soft topping has a crisp contrast.', s))
    story.append(meal_card('7', 'Edamame, Tofu and Ginger Cup',
        'Warm 1/2 cup shelled cooked edamame, 1/3 cup silken tofu, and 1/4 cup pre-cooked '
        'carrot in 2 tbsp broth. Add ginger and a few drops of tamari.',
        'Protein Flip™: Shared protein: tofu and edamame. Fiber: edamame and carrot.',
        'Warm gently rather than boiling so tofu stays silky.', s))
    story.append(meal_card('8', 'Mediterranean Lentil, Feta and Yogurt Plate',
        'Combine 1/2 cup cooked lentils, 1 tbsp feta, 2 tbsp chopped roasted pepper, '
        '2 tbsp Greek yogurt, and oregano.',
        'Protein Flip™: Primary: lentils. Supporting: feta and yogurt. Fiber: lentils and pepper.',
        'Toss lentils with oregano and olive oil first. Add yogurt last for creamy contrast.', s))
    story.append(meal_card('9', 'Tuna and White Bean Herb Cup',
        'Fold 2 oz canned tuna into 1/3 cup cannellini beans, 1/4 cup diced cucumber, '
        'parsley, 1 tsp olive oil, and lemon.',
        'Protein Flip™: Primary: tuna. Supporting: beans. Fiber: beans and cucumber.',
        'Keep tuna in flakes; overmixing makes this combination pasty.', s))
    story.append(meal_card('10', 'Tomato, Hummus and Cottage Cheese Plate',
        'Serve 1/3 cup hummus with 1/3 cup cottage cheese and 1/2 cup ripe or roasted tomatoes. '
        'Add basil and olive oil.',
        'Protein Flip™: Primary: chickpeas in hummus. Supporting: cottage cheese. Fiber: chickpeas and tomato.',
        'A few torn basil leaves make familiar ingredients taste freshly prepared.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 10 — MEALS 11-15: Warm and Soft
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, '20 MEALS  •  11-15', 'Warm, soft and spoonable.', s)
    story.append(Paragraph(
        'Warm, soft, and spoonable meals bring comfort through tender ingredients, '
        'creamy textures, and balanced flavor. Beans and lentils can be mashed or blended '
        'into soups, while eggs, tofu, and fish provide other soft textures. '
        'Each meal keeps the Protein Flip™ structure intact.',
        s['lead']))
    story.append(Spacer(1, 4))

    story.append(meal_card('11', 'Red Lentil, Chicken and Bok Choy Soup',
        'Warm 3/4 cup prepared red lentil soup with 1 oz finely shredded cooked chicken '
        'and 1/4 cup chopped cooked bok choy. Finish with ginger.',
        'Protein Flip™: Primary: lentils. Supporting: chicken. Fiber: lentils and bok choy.',
        'Cook lentils until they soften into the broth for natural creaminess.', s))
    story.append(meal_card('12', 'Creamy White Bean and Spinach Soup',
        'Blend 1/2 cup cannellini beans with 3/4 cup warm broth. Add 1/4 cup cooked spinach. '
        'Off heat, stir in 2 tbsp Greek yogurt and dill.',
        'Protein Flip™: Primary: beans. Supporting: yogurt. Fiber: beans and spinach.',
        'Blend beans with broth before warming; the texture becomes smooth without cream.', s))
    story.append(meal_card('13', 'Silken Tofu, Edamame and Carrot Miso Bowl',
        'Gently warm 1/2 cup silken tofu, 1/3 cup cooked edamame, and 1/4 cup cooked carrot '
        'in 1/2 cup broth. Stir in 1/2 tsp white miso off heat.',
        'Protein Flip™: Primary: tofu. Supporting: edamame. Fiber: edamame and carrot.',
        'Dissolve miso in a spoonful of warm broth before stirring it into the bowl.', s))
    story.append(meal_card('14', 'Salmon, Lentil and Soft Zucchini Bowl',
        'Combine 2 oz cooked flaked salmon, 1/3 cup cooked lentils, and 1/4 cup steamed '
        'zucchini. Finish with 1 tbsp dill yogurt.',
        'Protein Flip™: Primary: salmon. Supporting: lentils and yogurt. Fiber: lentils and zucchini.',
        'Fold salmon in at the end to keep the flakes whole and tender.', s))
    story.append(meal_card('15', 'Egg, White Bean and Tomato Skillet',
        'Warm 1/3 cup mashed white beans, 1/4 cup diced tomatoes, and a handful of spinach. '
        'Add one beaten egg and stir gently until fully cooked.',
        'Protein Flip™: Shared protein: egg and beans. Fiber: beans, tomatoes and spinach.',
        'Use low heat for tender curds and a cohesive, saucy skillet.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 11 — MEALS 16-20: Portable and Shareable
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, '20 MEALS  •  16-20', 'Portable and shareable.', s)
    story.append(Paragraph(
        'Complete plates that work away from home, at the family table, and for everyone. '
        'Each packs securely for a car, bag, or office.',
        s['lead']))
    story.append(Spacer(1, 4))

    story.append(meal_card('16', 'Chicken, Chickpea and Herb Pita',
        'Mix 1 oz cooked shredded chicken, 1/3 cup mashed chickpeas, diced cucumber, '
        '1 tbsp Greek yogurt, and parsley. Fill 1/2 whole-grain pita.',
        'Protein Flip™: Primary: chickpeas. Supporting: chicken and yogurt. Fiber: chickpeas, cucumber and pita.',
        'Mash chickpeas lightly so they hold the filling together.', s))
    story.append(meal_card('17', 'Egg, Hummus and Roasted Carrot Box',
        'Pack 1 hard-boiled egg, 1/3 cup hummus, 1/4 cup roasted carrot, '
        'and 4 whole-grain crackers.',
        'Protein Flip™: Primary: chickpeas in hummus. Supporting: egg. Fiber: chickpeas, carrot and crackers.',
        'Pack crackers separately to preserve their snap.', s))
    story.append(meal_card('18', 'Turkey, Black Bean and Spinach Quesadilla',
        'Fill one small whole-grain tortilla with 1 oz cooked turkey, 1/3 cup mashed black beans, '
        '2 tbsp cooked spinach, and 1 tbsp cheese. Toast until hot.',
        'Protein Flip™: Primary: black beans. Supporting: turkey and cheese. Fiber: beans, spinach and tortilla.',
        'Spread beans edge to edge: they hold the filling together without extra sauce.', s))
    story.append(meal_card('19', 'Lentil, Edamame and Feta Salad Cup',
        'Toss 1/3 cup cooked lentils, 1/3 cup cooked edamame, 1 tbsp feta, '
        '1/4 cup cucumber, oregano, and a little olive oil.',
        'Protein Flip™: Shared protein: lentils and edamame. Fiber: lentils, edamame and cucumber.',
        'Chill the lentils before combining so the cucumber stays crisp.', s))
    story.append(meal_card('20', 'Mediterranean White Bean and Salmon Cup',
        'Combine 1/3 cup cannellini beans, 2 oz canned salmon, 1/4 cup roasted red pepper, '
        '1 tbsp Greek yogurt, parsley, and lemon zest.',
        'Protein Flip™: Primary: salmon. Supporting: beans and yogurt. Fiber: beans and peppers.',
        'Flake salmon first, then fold in beans gently so both textures remain distinct.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 12 — ONE DINNER, TWO APPETITES (A + B)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'ONE DINNER, TWO APPETITES', 'Cook once. Plate two ways.', s)
    story.append(Paragraph(
        'Prepare one connected Protein Flip™ dinner. Each plate receives its primary protein, '
        'supporting protein, meaningful fiber, and finishing flavor. '
        'The portions can differ without changing what makes the meal complete.',
        s['lead']))
    story.append(Spacer(1, 6))

    def dinner_card(letter_label, din_title, din_base, din_ps, din_fp, chef_tip, s):
        t = Table([
            [Paragraph(f'{letter_label} | {din_title}', s['meal_title']), ''],
            [Paragraph(din_base, s['meal_body']), ''],
            [Paragraph('PORTION SMART', s['tbl_label']),
             Paragraph('FAMILY PORTION', s['tbl_label'])],
            [Paragraph(din_ps, s['meal_pf']), Paragraph(din_fp, s['meal_pf'])],
            [Paragraph(f'Chef tip: {chef_tip}', s['meal_tip']), ''],
        ], colWidths=[UW/2 - 4, UW/2 - 4], spaceBefore=0)
        t.setStyle(TableStyle([
            ('SPAN',          (0,0), (1,0)),
            ('SPAN',          (0,1), (1,1)),
            ('SPAN',          (0,4), (1,4)),
            ('BACKGROUND',    (0,0), (1,1),  CREAM),
            ('BACKGROUND',    (0,2), (0,3),  LIGHT_BG),
            ('BACKGROUND',    (1,2), (1,3),  white),
            ('BACKGROUND',    (0,4), (1,4),  CREAM),
            ('TOPPADDING',    (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING',   (0,0), (-1,-1), 9),
            ('RIGHTPADDING',  (0,0), (-1,-1), 9),
            ('VALIGN',        (0,0), (-1,-1), 'TOP'),
            ('LINEAFTER',     (0,2), (0,3),  0.5, TAN_RULE),
            ('LINEBELOW',     (0,1), (1,1),  0.4, TAN_RULE),
            ('LINEBELOW',     (0,-1),(1,-1),  0.3, TAN_RULE),
        ]))
        return KeepTogether([t, Spacer(1, 6)])

    story.append(dinner_card('A', 'Lemon Chicken, White Beans and Carrots',
        'Roast chicken thighs, sliced carrots, oregano, and lemon. Warm cannellini beans in the pan juices. Finish with parsley yogurt.',
        'Chicken + beans + carrots + parsley yogurt, distributed across a Portion Smart plate.',
        'A larger serving of the same chicken, beans, carrots, and yogurt; add whole-grain bread if desired.',
        'Dress the beans with the chicken juices so the ingredients feel like one dish.', s))
    story.append(dinner_card('B', 'Turkey-Lentil Meatballs and Spinach Tomato Sauce',
        'Combine 1 lb ground turkey, 1/2 cup cooked lentils, 1 egg, and seasoning. Form 16 meatballs; bake to 165°F. Simmer in tomato sauce and spinach.',
        'Two or three meatballs + a meaningful serving of cooked lentils alongside + spinach-tomato sauce + a sprinkle of cheese.',
        'Additional meatballs, a generous share of the same sauce and lentils, and whole-grain pasta or bread.',
        'Use cooked lentils in the meatball mixture for a tender bite, then serve extra lentils alongside to carry the meal\'s fiber responsibility.', s))
    story.append(Paragraph(
        '<b>The repeatable question:</b> Does each plate still have dispersed protein and fiber, '
        'no matter its size? Did the Portion Smart plate get a little of each meaningful part?',
        s['small']))

    # ══════════════════════════════════════════════════════
    # PAGE 13 — THREE MORE DINNERS (C + D + E)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'ONE DINNER, TWO APPETITES', 'Three more dinners from one kitchen.', s)
    story.append(Spacer(1, 6))

    story.append(dinner_card('C', 'Rosemary Salmon, Fennel and Edamame',
        'Roast salmon with mustard and rosemary. Saute sliced fennel and leeks, add shelled edamame, and finish with fresh herbs.',
        'Salmon + fennel-edamame mixture + herb finish.',
        'A larger share of salmon and edamame-fennel, with roasted potatoes as an optional companion.',
        'Saute fennel until sweet before adding edamame; each contributes a distinct bite.', s))
    story.append(dinner_card('D', 'Black Bean, Egg and Pepper Tacos',
        'Warm black beans with cumin. Scramble eggs. Saute sweet peppers and set out corn tortillas, tomato, yogurt, and avocado.',
        'A tortilla with beans, egg, peppers, and yogurt or avocado.',
        'More tortillas filled with the same protein-and-fiber mixture.',
        'Mash a few beans to anchor the filling and prevent ingredients from falling out.', s))
    story.append(dinner_card('E', 'Ginger Chicken and Red Lentil Soup',
        'Simmer chicken, red lentils, carrots, bok choy, ginger, garlic, and broth until chicken reaches 165°F and lentils soften. Shred chicken.',
        'A complete bowl with chicken, red lentils, vegetables, and the same flavorful broth.',
        'A larger bowl of the same mixture with whole-grain bread if desired.',
        'Let the lentils soften into the soup; this creates body without needing a separate thickener.', s))
    story.append(Paragraph(
        '<b>The repeatable question:</b> Does each plate still have dispersed protein and fiber, '
        'no matter its size? Did the Portion Smart plate get a little of each meaningful part?',
        s['small']))

    # ══════════════════════════════════════════════════════
    # PAGE 14 — GROCERY MAP (5 ready-to-shop groups)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'SHOP CONNECTED INGREDIENTS', 'The low-hunger grocery map.', s)
    story.append(Paragraph(
        'Shop in combinations, not isolated categories. When one group of ingredients '
        'makes several appealing meals, the refrigerator becomes easier to use.',
        s['lead']))
    story.append(Spacer(1, 4))

    story.append(Paragraph('FIVE READY-TO-SHOP GROUPS', s['num_label']))
    group_rows = [
        [Paragraph('<font color="white"><b>WHAT TO BUY</b></font>', s['meal_body']),
         Paragraph('<font color="white"><b>MEALS</b></font>', s['meal_body']),
         Paragraph('<font color="white"><b>CARRY-OVER TIP</b></font>', s['meal_body'])],
        [Paragraph('White beans · eggs · yogurt · spinach · lemon · whole-grain bread · broth · tomatoes · dill · parsley', s['meal_body']),
         Paragraph('6, 12, 15', s['small']),
         Paragraph('Keep beans drained and ready. Use yogurt as a finish, not an afterthought.', s['meal_tip'])],
        [Paragraph('Lentils · feta · roasted peppers · yogurt · edamame · cucumber · oregano · olive oil', s['meal_body']),
         Paragraph('8, 19', s['small']),
         Paragraph('Make lentils once, serve cold or warm. Edamame and cucumber complete Meal 19.', s['meal_tip'])],
        [Paragraph('Silken tofu · edamame · carrots · ginger · white miso · broth · tamari', s['meal_body']),
         Paragraph('7, 13', s['small']),
         Paragraph('A few prepared ingredients become a warm cup or a miso bowl.', s['meal_tip'])],
        [Paragraph('Canned salmon · white beans · lentils · zucchini · roasted peppers · yogurt · lemon · dill · parsley', s['meal_body']),
         Paragraph('14, 20', s['small']),
         Paragraph('Lentils and zucchini go with Meal 14; roasted peppers, parsley and yogurt finish Meal 20.', s['meal_tip'])],
        [Paragraph('Hummus · cooked chicken · chickpeas · cucumber · yogurt · eggs · carrots · crackers · whole-grain pita · parsley', s['meal_body']),
         Paragraph('16, 17', s['small']),
         Paragraph('Chickpeas and chicken fill the pita for Meal 16; hummus, egg, carrots and crackers complete the box for Meal 17.', s['meal_tip'])],
    ]
    gtbl = Table(group_rows, colWidths=[UW * 0.40, UW * 0.17, UW * 0.43])
    gtbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,0),  MD_GREEN),
        ('TEXTCOLOR',     (0,0), (-1,0),  white),
        ('ROWBACKGROUNDS',(0,1), (-1,-1), [CREAM, white, CREAM, white, CREAM]),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW',     (0,0), (-1,-1), 0.3, TAN_RULE),
        ('LINEAFTER',     (0,0), (1,-1),  0.3, TAN_RULE),
        ('LINEAFTER',     (1,0), (1,-1),  0.3, TAN_RULE),
    ]))
    story.append(gtbl)
    story.append(Spacer(1, 10))

    story.append(Paragraph('15-MINUTE RESET', s['num_label']))
    reset_rows = [
        [Paragraph('MIN 0-5',   s['tbl_label']),
         Paragraph('Choose two meal numbers from this guide.', s['body'])],
        [Paragraph('MIN 5-10',  s['tbl_label']),
         Paragraph('Rinse beans or prepare a ready vegetable.', s['body'])],
        [Paragraph('MIN 10-13', s['tbl_label']),
         Paragraph('Stir together a yogurt-herb finish: yogurt + dill or parsley + pinch of salt.', s['body'])],
        [Paragraph('MIN 13-15', s['tbl_label']),
         Paragraph('Write the two meal names where you will see them first, not inside the refrigerator.', s['body'])],
    ]
    rtbl = Table(reset_rows, colWidths=[1.1*inch, UW - 1.1*inch])
    rtbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (0,-1), LIGHT_BG),
        ('BACKGROUND',    (1,0), (1,-1), CREAM),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 9),
        ('RIGHTPADDING',  (0,0), (-1,-1), 9),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW',     (0,0), (-1,-2), 0.3, TAN_RULE),
        ('LINEAFTER',     (0,0), (0,-1),  0.5, MD_GREEN),
    ]))
    story.append(rtbl)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        '<b>Kitchen safety:</b> refrigerate perishable foods promptly, within two hours of preparation; '
        'use refrigerated cooked leftovers within three to four days or freeze them. '
        'Reheat leftovers to 165°F.',
        s['small']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        'A useful grocery list is a collection of possible meals.',
        s['callout']))

    # ══════════════════════════════════════════════════════
    # PAGE 15 — WHEN HUNGER RETURNS
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'WHEN HUNGER RETURNS', 'Keep the balance. Let the plate grow.', s)
    story.append(Paragraph(
        'As hunger changes, the Protein Flip™ method stays the same. '
        'You are not moving from a "special" plate back to an ordinary one. '
        'You are using the same connected structure and adjusting how much of each '
        'meaningful ingredient belongs on the plate.',
        s['lead']))
    story.append(Spacer(1, 8))

    for anchor_label, port_smart, more_hungry in [
        ('A PLANT-PROTEIN ANCHOR',
         'Lentils with yogurt, roasted peppers, cucumber, and seeds.',
         'More lentils and vegetables, a fuller yogurt finish, and whole-grain bread if it suits the meal. '
         'The protein and fiber are still shared.'),
        ('AN ANIMAL-PROTEIN ANCHOR',
         'Salmon with cannellini beans, zucchini, and dill yogurt.',
         'A larger serving of the same salmon-bean-vegetable combination, with farro or roasted potatoes alongside. '
         'The added grain is part of a complete dinner, not a replacement for the beans.'),
        ('AN EGG-CENTERED PLATE',
         'Egg, pinto beans, tomato, avocado, and pepitas.',
         'More of the same connected filling with an additional tortilla or extra beans and vegetables. '
         'Eggs remain a bridge protein, not the only part doing the work.'),
    ]:
        story.append(two_col(
            anchor_label, port_smart,
            'MORE HUNGRY', more_hungry, s))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 4))
    story.append(Paragraph('What helps satisfaction last.', s['h2']))
    story.append(Paragraph(
        'A meal is more complete when protein, fiber, flavor, and texture work together. '
        'Beans and lentils contribute both protein and fiber; yogurt, eggs, tofu, or fish '
        'can add another protein; fats and finishers bring richness and interest. '
        'Build a meal you enjoy, then use your hunger and satisfaction as feedback.',
        s['body']))
    story.append(Spacer(1, 6))
    story.append(callout_box('Portion Smart is distribution, not reduction.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 16 — KEEP COOKING (closing)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'KEEP COOKING', 'Your next plate is already in this guide.', s)
    story.append(Paragraph(
        'When nothing sounds good, choose the temperature, texture, and effort level that fit today. '
        'Find a meal. Let several ingredients share the protein and fiber responsibility. '
        'Finish it like a chef. That is the system.',
        s['lead']))
    story.append(Spacer(1, 10))

    story.append(Paragraph('YOUR REPEATABLE ROUTINE', s['num_label']))
    routine = Table([
        [Paragraph('Choose three fallback meals: ________ / ________ / ________', s['body'])],
        [Paragraph('Shop for two connected ingredient groups: _________________________________', s['body'])],
        [Paragraph('Prepare one sauce or finish: _____________________________________________', s['body'])],
        [Paragraph('Choose one family dinner to plate two ways: _____________________________', s['body'])],
    ], colWidths=[UW])
    routine.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), CREAM),
        ('TOPPADDING',    (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
        ('LINEBELOW',     (0,0), (-1,-2), 0.3, TAN_RULE),
        ('LINEABOVE',     (0,0), (-1,0),  1.5, MD_GREEN),
        ('LINEBELOW',     (0,-1),(-1,-1), 1.5, MD_GREEN),
    ]))
    story.append(routine)
    story.append(Spacer(1, 14))

    story.append(Paragraph('What this guide does.', s['h2']))
    story.append(Paragraph(
        'It helps you select appealing meals, distribute primary and secondary protein across '
        'the plate, build a meaningful fiber layer, reduce cooking effort, use leftovers well, '
        'and eat with the household without a second dinner.',
        s['body']))
    story.append(Spacer(1, 12))

    story.append(HRFlowable(width='100%', thickness=0.5, color=TAN_RULE,
                             spaceBefore=4, spaceAfter=10))
    story.append(Paragraph('More from Chef Healthy Henry.', s['h2']))
    story.append(Paragraph(
        'Explore The Protein Flip™ Method and Cookbook, Deluxe Edition, the Journal, recipes, '
        'Kitchen Guides, and membership at ' +
        lnk(HOME_URL, 'chefhealthyhenry.com') + '.',
        s['body']))
    story.append(Spacer(1, 16))
    story.append(callout_box(
        'Stay nourished. Keep cooking. One connected plate at a time.', s))

    # ══════════════════════════════════════════════════════
    # PAGE 17 — A NOTE BEFORE YOU GO (safety boundary + closer)
    # ══════════════════════════════════════════════════════
    story.append(PageBreak())
    chapter_start(story, 'A NOTE BEFORE YOU GO', 'Thank you for cooking with me.', s)

    story.append(Paragraph(
        'You picked up this guide because something changed. Your hunger, your energy, '
        'your relationship with food. That takes honesty. I hope what\'s in these pages '
        'gave you a few plates worth returning to and a method that makes sense even on '
        'the days when nothing sounds good.',
        s['lead']))
    story.append(Spacer(1, 16))

    story.append(Paragraph('What this guide is.', s['h2']))
    story.append(Paragraph(
        'This is a culinary guide built by a classically trained chef and former bariatric '
        'patient. Every meal follows the Protein Flip™ method: dispersed protein, meaningful '
        'fiber, and a finish that makes the ingredients taste connected. The goal is food '
        'that is nourishing, real, and worth eating.',
        s['body']))
    story.append(Spacer(1, 12))

    story.append(Paragraph('What this guide is not.', s['h2']))
    story.append(Paragraph(
        'This guide does not provide medical advice, clinical nutrition recommendations, '
        'or guidance on medications, supplements, or post-surgical protocols. '
        'It does not replace your care team.',
        s['body']))
    story.append(Spacer(1, 20))

    story.append(callout_box('Now go make something good.', s))
    story.append(Spacer(1, 16))

    story.append(Paragraph('Chef Healthy Henry', s['h2']))

    # ══════════════════════════════════════════════════════
    doc.build(story)
    print(f'Built: {OUT}')
    import pdfplumber
    with pdfplumber.open(OUT) as pdf:
        print(f'Pages: {len(pdf.pages)}')
        for i, pg in enumerate(pdf.pages):
            text = pg.extract_text() or ''
            words = text.split()
            print(f'  P{i+1} ({len(words)} words): {" ".join(words[:12])}')


build()
