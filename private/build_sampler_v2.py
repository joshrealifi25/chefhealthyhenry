"""
When Nothing Sounds Good - Free Sampler v2
3 chef-built meals for low appetite and changing hunger.

Changes from v1:
  - Recipe 1 updated: Raspberry, Orange & Pistachio Yogurt Oats
  - Recipe 1 page includes food photo
  - Shopping list reflects updated ingredients
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
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

ASSETS       = '/sessions/loving-optimistic-einstein/mnt/chefhealthyhenry/private/assets'
LOGO_COVER    = f'{ASSETS}/cover_logo_rgba.png'
LOGO_INTERIOR = f'{ASSETS}/interior_logo_rgba.png'
YOGURT_PHOTO  = f'{ASSETS}/sampler-yogurt-oats.jpg'

SAMPLER_URL = 'https://chefhealthyhenry.com/sampler'
GUIDE_URL   = 'https://chefhealthyhenry.com/guides/when-nothing-sounds-good'
HOME_URL    = 'https://chefhealthyhenry.com'

LM = 61; RM = 61; TM = 71; BM = 57
UW = W - LM - RM   # 490 pt usable width

OUT = '/sessions/loving-optimistic-einstein/mnt/chefhealthyhenry/private/sampler/3-meals-for-when-nothing-sounds-good.pdf'


def lnk(url, text, color='#196641'):
    return f'<a href="{url}" color="{color}">{text}</a>'


# ─────────────────────────── CANVAS CALLBACKS

def draw_cover(c, doc):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Header bar
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

    # Tag line above photo
    logo_bottom = H - 79 - 12 - 75
    c.setFont('DJSb', 8.5); c.setFillColor(MD_GREEN)
    c.drawCentredString(W/2, logo_bottom - 14,
        'F R E E  S A M P L E R :  3  M E A L S  T O  S T A R T  T O D A Y')

    # Photo band
    photo_h = 220
    photo_y = logo_bottom - 30 - photo_h
    try:
        from PIL import Image as PILImage
        _img = PILImage.open(YOGURT_PHOTO)
        _pw, _ph = _img.size
        _scale = W / _pw
        _draw_w = W
        _draw_h = _ph * _scale
        if _draw_h < photo_h:
            _scale = photo_h / _ph
            _draw_h = photo_h
            _draw_w = _pw * _scale
        _x_off = (W - _draw_w) / 2
        _y_off = photo_y - (_draw_h - photo_h) / 2
        c.saveState()
        p = c.beginPath()
        p.rect(0, photo_y, W, photo_h)
        c.clipPath(p, stroke=0)
        c.drawImage(YOGURT_PHOTO, _x_off, _y_off, width=_draw_w, height=_draw_h, mask='auto')
        c.restoreState()
    except Exception:
        pass
    c.setStrokeColor(MD_GREEN); c.setLineWidth(0.75)
    c.line(0, photo_y + photo_h, W, photo_y + photo_h)
    c.line(0, photo_y,           W, photo_y)

    # Title block
    G = 22
    c.setStrokeColor(MD_GREEN); c.setLineWidth(1.5)
    c.line(W/2 - 36, photo_y - G, W/2 + 36, photo_y - G)
    c.setFont('DJRb', 38); c.setFillColor(DK_GREEN)
    c.drawCentredString(W/2, photo_y - G - 48, 'When Nothing')
    c.drawCentredString(W/2, photo_y - G - 92, 'Sounds Good')
    c.setFont('DJRi', 13); c.setFillColor(BODY_COL)
    c.drawCentredString(W/2, photo_y - G - 112, 'Three chef-built meals for low appetite and changing hunger.')
    c.setFont('DJSb', 9.5); c.setFillColor(MD_GREEN)
    c.drawCentredString(W/2, photo_y - G - 136, 'PROTEIN.  FIBER.  SATISFACTION.')
    c.setFont('DJRi', 9); c.setFillColor(MUTED_COL)
    c.drawCentredString(W/2, photo_y - G - 155,
        f'A free sample from the full When Nothing Sounds Good guide at {HOME_URL}')
    # Footer bar
    c.setFillColor(DK_GREEN)
    c.rect(0, 0, W, 55, fill=1, stroke=0)


def draw_interior(c, doc):
    # Header rule
    c.setStrokeColor(TAN_RULE); c.setLineWidth(0.5)
    c.line(LM, H - 46, W - RM, H - 46)
    c.setFont('DJS', 8.5); c.setFillColor(MUTED_COL)
    c.drawString(LM, H - 54, 'When Nothing Sounds Good  •  Free Sampler')
    try:
        c.drawImage(LOGO_INTERIOR, W - RM - 94, H - 42, width=94, height=27, mask='auto')
    except Exception:
        pass
    # Footer rule + page number
    c.setStrokeColor(MD_GREEN); c.setLineWidth(1.5)
    c.line(LM, BM - 11, W - RM, BM - 11)
    c.setFont('DJS', 8.5); c.setFillColor(MUTED_COL)
    c.drawString(LM, BM - 25, 'Chef Healthy Henry')
    c.drawRightString(W - RM, BM - 25, str(doc.page))
    c.setFillColor(MD_GREEN)
    c.rect(LM, H - 71, 48, 3, fill=1, stroke=0)


# ─────────────────────────── STYLES

def styles():
    s = {}
    s['body']      = ParagraphStyle('body',    fontName='DJS', fontSize=10, leading=15,
                                     textColor=BODY_COL, spaceAfter=6)
    s['body_j']    = ParagraphStyle('body_j',  fontName='DJS', fontSize=10, leading=15,
                                     textColor=BODY_COL, spaceAfter=6, alignment=TA_JUSTIFY)
    s['small']     = ParagraphStyle('small',   fontName='DJS', fontSize=8.5, leading=13,
                                     textColor=MUTED_COL, spaceAfter=4)
    s['small_b']   = ParagraphStyle('small_b', fontName='DJSb', fontSize=8.5, leading=13,
                                     textColor=BODY_COL, spaceAfter=4)
    s['label']     = ParagraphStyle('label',   fontName='DJSb', fontSize=8, leading=12,
                                     textColor=MD_GREEN, spaceAfter=4)
    s['h1']        = ParagraphStyle('h1',      fontName='DJRb', fontSize=28, leading=34,
                                     textColor=DK_GREEN, spaceAfter=6)
    s['h2']        = ParagraphStyle('h2',      fontName='DJRb', fontSize=18, leading=24,
                                     textColor=DK_GREEN, spaceAfter=4)
    s['h3']        = ParagraphStyle('h3',      fontName='DJSb', fontSize=10, leading=15,
                                     textColor=DK_GREEN, spaceAfter=4)
    s['eyebrow']   = ParagraphStyle('eyebrow', fontName='DJSb', fontSize=8,
                                     textColor=MD_GREEN, spaceAfter=4)
    s['italic']    = ParagraphStyle('italic',  fontName='DJRi', fontSize=10.5, leading=16,
                                     textColor=BODY_COL, spaceAfter=6)
    s['tip']       = ParagraphStyle('tip',     fontName='DJSi', fontSize=9.5, leading=14,
                                     textColor=MUTED_COL, spaceAfter=6,
                                     leftIndent=12, rightIndent=12)
    s['center']    = ParagraphStyle('center',  fontName='DJS', fontSize=10, leading=15,
                                     textColor=BODY_COL, spaceAfter=6, alignment=TA_CENTER)
    s['center_b']  = ParagraphStyle('center_b', fontName='DJSb', fontSize=10, leading=15,
                                     textColor=DK_GREEN, spaceAfter=4, alignment=TA_CENTER)
    s['cta_head']  = ParagraphStyle('cta_head', fontName='DJRb', fontSize=24, leading=30,
                                     textColor=DK_GREEN, spaceAfter=8, alignment=TA_CENTER)
    s['bullet']    = ParagraphStyle('bullet',  fontName='DJS', fontSize=10, leading=15,
                                     textColor=BODY_COL, spaceAfter=4,
                                     leftIndent=14, firstLineIndent=-14)
    return s


# ─────────────────────────── TABLE HELPERS

def ingr_table(S, rows):
    """rows = list of (ingredient, amount, note)"""
    header = [
        Paragraph('INGREDIENT', S['label']),
        Paragraph('AMOUNT',     S['label']),
        Paragraph('NOTE',       S['label']),
    ]
    data = [header]
    for ing, amt, note in rows:
        data.append([
            Paragraph(ing,  S['small_b']),
            Paragraph(amt,  S['small']),
            Paragraph(note, S['small']),
        ])
    col_w = [UW * 0.30, UW * 0.18, UW * 0.52]
    tbl = Table(data, colWidths=col_w, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, 0),  LIGHT_BG),
        ('LINEBELOW',   (0, 0), (-1, 0),  0.75, TAN_RULE),
        ('LINEBELOW',   (0, 1), (-1, -1), 0.4,  TAN_RULE),
        ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',  (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    return tbl


def pf_table(S, primary, supporting, fiber):
    """Protein Flip structure table"""
    header = [Paragraph('PROTEIN FLIP™ STRUCTURE', S['label']), Paragraph('', S['label'])]
    data = [header,
            [Paragraph('PRIMARY PROTEIN',    S['small_b']), Paragraph(primary,    S['small'])],
            [Paragraph('SUPPORTING PROTEIN', S['small_b']), Paragraph(supporting, S['small'])],
            [Paragraph('FIBER',              S['small_b']), Paragraph(fiber,      S['small'])],
           ]
    col_w = [UW * 0.32, UW * 0.68]
    tbl = Table(data, colWidths=col_w, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, 0),  LIGHT_BG),
        ('LINEBELOW',   (0, 0), (-1, 0),  0.75, TAN_RULE),
        ('LINEBELOW',   (0, 1), (-1, -1), 0.4,  TAN_RULE),
        ('SPAN',        (0, 0), (-1, 0)),
        ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',  (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    return tbl


def rule(color=TAN_RULE, thickness=0.5, spaceB=8, spaceA=8):
    return HRFlowable(width='100%', thickness=thickness, color=color,
                      spaceAfter=spaceA, spaceBefore=spaceB)


# ─────────────────────────── PAGE BUILDERS

def cover_page(S, story):
    # Cover is drawn entirely by draw_cover callback; just provide a minimal spacer
    # and then switch to interior for subsequent pages.
    story.append(Spacer(1, 1))
    story.append(NextPageTemplate('interior'))
    story.append(PageBreak())


def welcome_page(S, story):
    story.append(Paragraph('WELCOME', S['eyebrow']))
    story.append(Paragraph('Three meals for right now.', S['h1']))
    story.append(rule())

    story.append(Paragraph(
        'This sampler gives you three complete Protein Flip™ meals to make this week. One '
        'cold breakfast you can assemble in minutes. One five-minute savory plate with no '
        'stove required. One dinner that works for the whole table, plated two ways so every '
        'appetite is covered.',
        S['body_j']))

    story.append(Spacer(1, 6))
    story.append(Paragraph('How the Protein Flip™ method works.', S['h3']))
    story.append(Paragraph(
        'Every meal in this sampler builds from multiple protein sources rather than stacking '
        'everything into one. A primary protein anchors the plate. One or more supporting proteins '
        'contribute alongside it, usually with a different texture or flavor. Fiber-rich ingredients do '
        'two jobs at once: they add structure and make the meal more satisfying without adding effort.',
        S['body_j']))
    story.append(Paragraph(
        'The result is a plate that feels complete even when appetite is low. No single ingredient has '
        'to carry everything.',
        S['body_j']))

    story.append(Spacer(1, 6))
    story.append(Paragraph('How to use this sampler.', S['h3']))

    steps = [
        ('<b>Pick one meal.</b> Start with whichever of the three sounds most appealing right now. That is the right answer.'),
        ('<b>Check the ingredients.</b> Each meal uses familiar ingredients, with a complete shopping list on page 7.'),
        ('<b>Use the chef tip.</b> One small technique makes each meal taste finished, not just assembled. It takes ten seconds.'),
        ('<b>Try the next one.</b> Once you have made all three, you will have a working sense of how the method feels. The full 20-meal guide builds from there.'),
    ]
    for i, step in enumerate(steps, 1):
        story.append(Paragraph(f'{i}. {step}', S['bullet']))

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        '“The right meal is the one that sounds good enough to make and complete enough to satisfy.”',
        S['italic']))


def meal1_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('MEAL ONE • COLD BREAKFAST', S['eyebrow']))
    story.append(Paragraph('Raspberry, Orange &amp; Pistachio\nYogurt Oats.', S['h1']))
    story.append(rule())
    story.append(Paragraph(
        'No stove. No cooking. Assembles in under five minutes. Bright, creamy, and satisfying '
        'even when appetite is low.',
        S['body']))

    # Photo
    try:
        from PIL import Image as PILImage
        _img = PILImage.open(YOGURT_PHOTO)
        _pw, _ph = _img.size
        # 16:9ish band, full usable width
        band_h = 170
        band_w = UW
        _scale = band_w / _pw
        _draw_w = band_w
        _draw_h = _ph * _scale
        if _draw_h < band_h:
            _scale = band_h / _ph
            _draw_h = band_h
            _draw_w = _pw * _scale
        # Crop to band using ReportLab clipping (via RLImage with height constraint)
        # Easier: use RLImage and let it scale, then clip with canvas —
        # For platypus, just embed a fixed-height image object (auto-scales to fit width)
        img_obj = RLImage(YOGURT_PHOTO, width=band_w, height=band_h, kind='proportional')
    except Exception:
        img_obj = None

    if img_obj:
        story.append(Spacer(1, 4))
        story.append(img_obj)
        story.append(Spacer(1, 8))

    story.append(Paragraph(
        '<b>1 | Raspberry, Orange &amp; Pistachio Yogurt Oats</b>',
        S['body']))
    story.append(Paragraph(
        'Stir 1/2 cup plain Greek yogurt with 1/4 cup cooked cooled oats. '
        'Spoon into a bowl and top with 1/4 cup fresh raspberries, '
        'the zest and a few segments of 1/2 orange, '
        'and 1 tbsp roughly chopped pistachios.',
        S['body_j']))

    story.append(Paragraph(
        '<i>Protein Flip™: Primary: yogurt. Supporting: oats and pistachios. '
        'Fiber: oats, raspberries, pistachios.</i>',
        S['small']))

    story.append(Paragraph(
        '<i>Chef tip: Add the orange zest last, directly over the top — '
        'it lifts the whole bowl and makes it taste like you built it on purpose.</i>',
        S['tip']))

    story.append(Spacer(1, 6))
    story.append(Paragraph('What you need.', S['h3']))
    story.append(ingr_table(S, [
        ('Plain Greek yogurt',          '1/2 cup',   'Low-fat. Thick and high in protein without the extra fat.'),
        ('Rolled oats, cooked\nand cooled', '1/4 cup', 'Cook a batch the night before and refrigerate. Ready to use cold all week.'),
        ('Fresh raspberries',            '1/4 cup',   'Frozen raspberries thawed overnight also work.'),
        ('Orange',                       '1/2',       'Zest the half and add a few segments. Use the other half another day.'),
        ('Pistachios, roughly\nchopped', '1 tbsp',    'Adds crunch and a second protein source alongside the yogurt.'),
    ]))

    story.append(Spacer(1, 8))
    story.append(Paragraph('Why this works.', S['h3']))
    story.append(Paragraph(
        'Yogurt and oats each bring protein; pistachios add a third source with crunch. '
        'Oats, raspberries, and pistachios each contribute fiber. The orange zest brightens '
        'every element without adding effort. It is a complete meal in a bowl that takes '
        'less time than deciding what else to eat.',
        S['body_j']))


def meal2_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('MEAL TWO • FIVE-MINUTE SAVORY PLATE', S['eyebrow']))
    story.append(Paragraph('Mediterranean Lentil, Feta\nand Yogurt Plate.', S['h1']))
    story.append(rule())
    story.append(Paragraph(
        'No stove. No heat required. Every ingredient is ready to use. This is the plate for '
        'midday when appetite is low and decisions feel hard.',
        S['body']))

    story.append(Paragraph(
        '<b>8 | Mediterranean Lentil, Feta and Yogurt Plate</b>',
        S['body']))
    story.append(Paragraph(
        'Combine 1/2 cup cooked lentils, 1 tbsp feta, 2 tbsp chopped roasted pepper, '
        '2 tbsp Greek yogurt, and a pinch of dried oregano. Finish with a small drizzle '
        'of olive oil.',
        S['body_j']))

    story.append(Paragraph(
        '<i>Protein Flip™: Primary: lentils. Supporting: feta and yogurt. '
        'Fiber: lentils and pepper.</i>',
        S['small']))

    story.append(Paragraph(
        '<i>Chef tip: Toss the lentils with oregano and a drizzle of olive oil first. '
        'Spoon the yogurt on last so it stays creamy against the lentils rather than '
        'mixing in.</i>',
        S['tip']))

    story.append(Spacer(1, 6))
    story.append(Paragraph('What you need.', S['h3']))
    story.append(ingr_table(S, [
        ('Cooked lentils',                '1/2 cup',  'Green or brown lentils from a can or cooked in advance. Rinse and drain.'),
        ('Crumbled feta',                 '1 tbsp',   'A small amount goes far. It is salty, so taste before adding more.'),
        ('Roasted red peppers,\nchopped', '2 tbsp',   'Jarred is fine. Pat dry before using so the plate does not get watery.'),
        ('Plain Greek yogurt',            '2 tbsp',   'Low-fat. Spooned on last. Acts as a sauce, not a topping.'),
        ('Dried oregano',                 'Pinch',    'Toss with the lentils first so the flavor distributes.'),
        ('Olive oil',                     'Drizzle',  'A small amount finishes the lentils and brings everything together.'),
    ]))

    story.append(Spacer(1, 8))
    story.append(Paragraph('Why this works.', S['h3']))
    story.append(Paragraph(
        'Lentils anchor the plate with both protein and fiber. Feta and yogurt each contribute '
        'additional protein alongside it, one crumbled and one creamy. The roasted pepper brings '
        'sweetness and color. Nothing needs to be cooked, and the whole plate comes together in '
        'the time it takes to find a menu.',
        S['body_j']))


def meal3_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('MEAL THREE • FAMILY DINNER', S['eyebrow']))
    story.append(Paragraph('Lemon Chicken, White Beans\nand Carrots.', S['h1']))
    story.append(rule())
    story.append(Paragraph(
        'One connected dinner plated two ways. The Portion Smart plate and the family '
        'portion use the same ingredients. Only the amounts differ.',
        S['body']))

    story.append(Paragraph('The recipe.', S['h3']))
    story.append(Paragraph(
        'Roast chicken thighs, sliced carrots, dried oregano, and lemon at 400°F until the '
        'chicken reaches 165°F, about 35 minutes. Warm cannellini beans in the pan juices '
        'for the last five minutes. Finish with a spoonful of parsley yogurt: plain Greek yogurt '
        'mixed with chopped parsley and a pinch of salt.',
        S['body_j']))

    story.append(Paragraph(
        '<i>Chef tip: Dress the beans with the chicken pan juices so the ingredients feel like '
        'one dish rather than separate components.</i>',
        S['tip']))

    story.append(Spacer(1, 6))
    story.append(pf_table(S,
        primary='Chicken thighs. The anchor. Roasted until juicy.',
        supporting='Cannellini beans + parsley yogurt. Two supporting sources, each with a different texture.',
        fiber='Cannellini beans and carrots. The beans do double duty on protein and fiber.',
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph(
        '<b>FINISH</b>  Lemon, parsley yogurt, oregano. Brightens the whole plate with one spoonful.',
        S['small']))


def plated_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('MEAL THREE • PLATED TWO WAYS', S['eyebrow']))
    story.append(Paragraph('Cook once. Plate for every appetite.', S['h2']))
    story.append(rule())
    story.append(Paragraph(
        'The Portion Smart plate and the family portion come from the same pan. Each '
        'receives the chicken, beans, carrots, and yogurt. The amounts differ. The method does not.',
        S['body']))

    # Two-column layout
    col_w = [(UW - 12) / 2, (UW - 12) / 2]
    left = [
        Paragraph('PORTION SMART', S['center_b']),
        Spacer(1, 4),
        Paragraph(
            'Chicken, white beans, carrots, and parsley yogurt, thoughtfully distributed '
            'so every meaningful ingredient contributes to the plate.',
            S['small']),
    ]
    right = [
        Paragraph('FAMILY PORTION', S['center_b']),
        Spacer(1, 4),
        Paragraph(
            'A larger serving of the same chicken, beans, carrots, and yogurt. '
            'Add whole-grain bread if desired. No second dinner required.',
            S['small']),
    ]
    tbl = Table([[left, right]], colWidths=col_w, hAlign='LEFT')
    tbl.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (0, 0), LIGHT_BG),
        ('BACKGROUND',  (1, 0), (1, 0), CREAM),
        ('LINEAFTER',   (0, 0), (0, 0), 0.5, TAN_RULE),
        ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',  (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 10))
    story.append(Paragraph('The repeatable question.', S['h3']))
    story.append(Paragraph(
        'Does each plate still have dispersed protein and fiber, no matter its size? '
        'Did the Portion Smart plate get a little of each meaningful part?',
        S['body_j']))

    story.append(Spacer(1, 6))
    story.append(Paragraph('What to keep on hand for this dinner.', S['h3']))
    story.append(ingr_table(S, [
        ('Bone-in chicken thighs',        '4 pieces',    'Bone-in stays juicier through roasting.'),
        ('Cannellini beans, canned',      '1 can (15 oz)', 'Rinse and drain. Add to the pan in the last five minutes.'),
        ('Carrots',                       '3 medium',    'Sliced on the diagonal. They cook at the same rate as the chicken.'),
        ('Plain Greek yogurt',            '1/4 cup',     'Low-fat. Mixed with parsley for the finish. Same yogurt as Meals 1 and 2.'),
        ('Fresh parsley',                 'Small bunch', 'Chopped and stirred into the yogurt. Brightens the whole plate.'),
        ('Lemon',                         '1',           'Sliced and roasted alongside the chicken.'),
        ('Dried oregano and olive oil',   'To season',   'Rub on the chicken before roasting.'),
    ]))


def shopping_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('YOUR SHOPPING LIST', S['eyebrow']))
    story.append(Paragraph('Everything you need for all three meals.', S['h2']))
    story.append(rule())
    story.append(Paragraph(
        'This list covers every ingredient in the sampler. Items marked with an asterisk (*) '
        'are staples that carry over into the full guide.',
        S['small']))

    story.append(Spacer(1, 6))
    # Three-column shopping list
    meal1_items = [
        '□ Plain low-fat Greek yogurt (small container)',
        '□ Rolled oats (1/4 cup cooked and cooled)',
        '□ Fresh raspberries (1/4 cup)',
        '□ Orange (1/2)',
        '□ Pistachios, roughly chopped (1 tbsp)',
    ]
    meal2_items = [
        '□ Cooked lentils * (1/2 cup)',
        '□ Crumbled feta (1 tbsp)',
        '□ Jarred roasted red peppers * (2 tbsp)',
        '□ Dried oregano * (pinch)',
        '□ Olive oil * (drizzle)',
    ]
    dinner_items = [
        '□ Bone-in chicken thighs (4 pieces)',
        '□ Carrots (3 medium)',
        '□ Cannellini beans, canned * (1 can/15 oz)',
        '□ Lemon (1)',
        '□ Fresh parsley * (small bunch)',
        '□ Dried oregano * (to season)',
        '□ Olive oil * (to season)',
        '□ Salt (pinch)',
        '□ Plain low-fat Greek yogurt * (1/4 cup)',
    ]

    def list_cell(title, items):
        paras = [Paragraph(title, S['label'])]
        for it in items:
            paras.append(Paragraph(it, S['small']))
        return paras

    col_w = [UW / 3, UW / 3, UW / 3]
    tbl = Table(
        [[list_cell('MEAL 1', meal1_items),
          list_cell('MEAL 2', meal2_items),
          list_cell('DINNER', dinner_items)]],
        colWidths=col_w, hAlign='LEFT'
    )
    tbl.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, -1), LIGHT_BG),
        ('LINEAFTER',   (0, 0), (1, 0),   0.5, TAN_RULE),
        ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',  (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 12))
    story.append(Paragraph('Seven staples that make your next meal easier.', S['h3']))
    story.append(Paragraph(
        'Keep these items stocked beyond this sampler and you will always have a '
        'Protein Flip™ meal within reach.',
        S['small']))
    story.append(Spacer(1, 4))
    story.append(ingr_table(S, [
        ('Plain low-fat Greek yogurt',  'All three meals',  'One container covers breakfast, the savory plate, and dinner.'),
        ('Cooked or canned lentils',    'Meal 2',           'Cook a batch on Sunday and use it all week cold or warm.'),
        ('Canned cannellini beans',     'Dinner',           'One can covers the dinner and extends into soups and toasts.'),
        ('Jarred roasted red peppers',  'Meal 2',           'Refrigerate after opening; follow the package’s storage instructions.'),
        ('Plain rolled oats',           'Meal 1',           'Cook once, refrigerate, and use cold for Meal 1 all week.'),
        ('Fresh parsley',               'Dinner',           'Wrap in a damp paper towel to keep it fresh.'),
        ('Olive oil and dried oregano', 'Meals 2 + dinner', 'Used in both. One small bottle and one jar covers both.'),
    ]))


def cta_page(S, story):
    story.append(PageBreak())
    story.append(Paragraph('READY FOR THE FULL GUIDE?', S['eyebrow']))
    story.append(Paragraph('The complete system for when nothing sounds good.', S['h2']))
    story.append(rule())

    story.append(Paragraph(
        'You have just seen how the Protein Flip™ method works in real life.',
        S['body']))
    story.append(Paragraph('Not with a complicated recipe.', S['italic']))
    story.append(Paragraph('Not with a perfect plate.', S['italic']))
    story.append(Paragraph(
        'With practical meals you can actually make when appetite is low and deciding what to eat '
        'feels harder than it should.',
        S['body_j']))
    story.append(Paragraph(
        'The full <i>When Nothing Sounds Good</i> guide gives you the rest of the system, so you '
        'do not have to keep starting from scratch.',
        S['body_j']))

    story.append(Spacer(1, 8))
    story.append(Paragraph('Inside the full guide.', S['h3']))

    what_rows = [
        [Paragraph('WHAT YOU GET', S['label']), Paragraph('HOW IT HELPS', S['label'])],
        [Paragraph('The complete Appetite Compass', S['small_b']),
         Paragraph('Find a meal by temperature, texture, effort, and flavor so you can start with what sounds possible right now.', S['small'])],
        [Paragraph('20 chef-built Protein Flip™ meals', S['small_b']),
         Paragraph('Cold breakfasts, five-minute savory plates, warm soft meals, portable meals, and flexible options.', S['small'])],
        [Paragraph('Five family dinners plated two ways', S['small_b']),
         Paragraph('Cook once and plate for a Portion Smart appetite and a family portion without making a second dinner.', S['small'])],
        [Paragraph('A grocery map that works smarter', S['small_b']),
         Paragraph('Shop connected ingredients that turn into multiple meals instead of random items that don’t come together.', S['small'])],
        [Paragraph('The When Hunger Returns method', S['small_b']),
         Paragraph('Use the same Protein Flip™ structure as appetite changes so the plate grows without losing balance or satisfaction.', S['small'])],
    ]
    col_w = [UW * 0.38, UW * 0.62]
    tbl = Table(what_rows, colWidths=col_w, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND',  (0, 0), (-1, 0),  LIGHT_BG),
        ('LINEBELOW',   (0, 0), (-1, 0),  0.75, TAN_RULE),
        ('LINEBELOW',   (0, 1), (-1, -1), 0.4,  TAN_RULE),
        ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',  (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 12))
    story.append(Paragraph(
        f'Get the complete When Nothing Sounds Good guide for $19 at\n'
        f'{lnk(GUIDE_URL, "chefhealthyhenry.com/guides/when-nothing-sounds-good")}',
        S['center']))


# ─────────────────────────── BUILD

def build():
    S = styles()
    story = []

    # Cover (first page drawn via callback, story starts with an interior page)
    cover_page(S, story)
    welcome_page(S, story)
    meal1_page(S, story)
    meal2_page(S, story)
    meal3_page(S, story)
    plated_page(S, story)
    shopping_page(S, story)
    cta_page(S, story)

    cover_frame    = Frame(0, 0, W, H, leftPadding=0, rightPadding=0,
                           topPadding=0, bottomPadding=0, id='cover')
    interior_frame = Frame(LM, BM, UW, H - TM - BM, id='interior')

    cover_tpl    = PageTemplate(id='cover',    frames=[cover_frame],    onPage=draw_cover)
    interior_tpl = PageTemplate(id='interior', frames=[interior_frame], onPage=draw_interior)

    doc = BaseDocTemplate(OUT, pagesize=letter,
                          leftMargin=LM, rightMargin=RM,
                          topMargin=TM, bottomMargin=BM)
    doc.addPageTemplates([cover_tpl, interior_tpl])
    doc.build(story)
    print(f'Built: {OUT}')


if __name__ == '__main__':
    build()
