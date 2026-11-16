"""
3 Meals for When Nothing Sounds Good: the free sampler.

The three meals stay the ones the site already describes: the cold breakfast,
guide meal 8, and the lemon chicken dinner plated two ways. Meal 8 uses the
v5 recipe, tip, and Primary / Secondary line. It does not add dill or lemon zest.
Guide meals 2 and 5 are not part of this sampler.
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, PageBreak, KeepTogether, NextPageTemplate,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_DIR = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('DJS', FONT_DIR + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DJSb', FONT_DIR + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DJSi', FONT_DIR + 'DejaVuSans-Oblique.ttf'))
pdfmetrics.registerFont(TTFont('DJRb', FONT_DIR + 'DejaVuSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DJRi', FONT_DIR + 'DejaVuSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('DJR', FONT_DIR + 'DejaVuSerif.ttf'))

CREAM = HexColor('#F5ECE0')
DK_GREEN = HexColor('#1F453B')
MD_GREEN = HexColor('#196641')
BODY_COL = HexColor('#2B2B2B')
MUTED_COL = HexColor('#5A5A5A')
TAN_RULE = HexColor('#D6CDB8')
LIGHT_BG = HexColor('#EEF5EB')

W, H = letter
LM = 61
RM = 61
TM = 71
BM = 57
UW = W - LM - RM

LOGO_COVER = 'private/assets/cover_logo_rgba.png'
LOGO_INTERIOR = 'private/assets/interior_logo_rgba.png'
COVER_PHOTO = 'private/assets/IMG_0622.jpg'
OUT = 'private/sampler/3-meals-for-when-nothing-sounds-good.pdf'


def draw_cover(c, doc):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(MD_GREEN)
    c.rect(0, H - 79, W, 79, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('DJRb', 12)
    c.drawString(LM, H - 49, 'CHEF HEALTHY HENRY')
    c.setFont('DJS', 9.5)
    c.drawRightString(W - RM, H - 49, 'chefhealthyhenry.com')
    try:
        lw, lh = 75, 75
        c.drawImage(LOGO_COVER, (W - lw) / 2, H - 79 - 12 - lh,
                    width=lw, height=lh, mask='auto')
    except Exception:
        pass
    logo_bottom = H - 79 - 12 - 75
    photo_h = 270
    photo_y = logo_bottom - 10 - photo_h
    try:
        from PIL import Image as PILImage
        img = PILImage.open(COVER_PHOTO)
        pw, ph = img.size
        scale = W / pw
        draw_w, draw_h = W, ph * scale
        if draw_h < photo_h:
            scale = photo_h / ph
            draw_h = photo_h
            draw_w = pw * scale
        x_off = (W - draw_w) / 2
        y_off = photo_y - (draw_h - photo_h) / 2
        c.saveState()
        path = c.beginPath()
        path.rect(0, photo_y, W, photo_h)
        c.clipPath(path, stroke=0)
        c.drawImage(COVER_PHOTO, x_off, y_off, width=draw_w, height=draw_h, mask='auto')
        c.restoreState()
    except Exception:
        pass
    c.setStrokeColor(MD_GREEN)
    c.setLineWidth(0.75)
    c.line(0, photo_y + photo_h, W, photo_y + photo_h)
    c.line(0, photo_y, W, photo_y)
    c.setFont('DJSb', 9)
    c.setFillColor(MD_GREEN)
    c.drawCentredString(W / 2, photo_y - 28, 'FREE SAMPLER: 3 MEALS TO START TODAY')
    c.setFont('DJRb', 30)
    c.setFillColor(DK_GREEN)
    c.drawCentredString(W / 2, photo_y - 64, 'When Nothing')
    c.drawCentredString(W / 2, photo_y - 98, 'Sounds Good')
    c.setFont('DJR', 11)
    c.setFillColor(BODY_COL)
    c.drawCentredString(W / 2, photo_y - 122, 'Three chef-built meals for low appetite and changing hunger.')
    c.setFont('DJSb', 9.5)
    c.setFillColor(MD_GREEN)
    c.drawCentredString(W / 2, photo_y - 144, 'PROTEIN.  FIBER.  SATISFACTION.')
    c.setFillColor(DK_GREEN)
    c.rect(0, 0, W, 57, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('DJS', 8.5)
    c.drawCentredString(
        W / 2, 24,
        'A free sample from the full When Nothing Sounds Good guide at chefhealthyhenry.com',
    )


def draw_interior(c, doc):
    c.setStrokeColor(TAN_RULE)
    c.setLineWidth(0.5)
    c.line(LM, H - 46, W - RM, H - 46)
    c.setFont('DJS', 8.5)
    c.setFillColor(MUTED_COL)
    c.drawString(LM, H - 54, 'When Nothing Sounds Good  •  Free Sampler')
    try:
        c.drawImage(LOGO_INTERIOR, W - RM - 94, H - 42, width=94, height=27, mask='auto')
    except Exception:
        pass
    c.setStrokeColor(MD_GREEN)
    c.setLineWidth(1.5)
    c.line(LM, BM - 11, W - RM, BM - 11)
    c.setFont('DJS', 8.5)
    c.setFillColor(MUTED_COL)
    c.drawString(LM, BM - 25, 'Chef Healthy Henry')
    c.drawRightString(W - RM, BM - 25, str(doc.page))
    c.setFillColor(MD_GREEN)
    c.rect(LM, H - 71, 48, 3, fill=1, stroke=0)


def styles():
    s = {}
    s['label'] = ParagraphStyle('label', fontName='DJSb', fontSize=8, leading=11,
                                 textColor=MD_GREEN, spaceBefore=6, spaceAfter=2)
    s['title'] = ParagraphStyle('title', fontName='DJRb', fontSize=22, leading=26,
                                 textColor=DK_GREEN, spaceAfter=8)
    s['title_sm'] = ParagraphStyle('title_sm', fontName='DJRb', fontSize=20, leading=24,
                                    textColor=DK_GREEN, spaceAfter=6)
    s['title_fit'] = ParagraphStyle('title_fit', fontName='DJRb', fontSize=17, leading=21,
                                     textColor=DK_GREEN, spaceAfter=6)
    s['lead'] = ParagraphStyle('lead', fontName='DJS', fontSize=11.5, leading=16,
                                textColor=BODY_COL, spaceAfter=6)
    s['body'] = ParagraphStyle('body', fontName='DJS', fontSize=10.5, leading=15,
                                textColor=BODY_COL, spaceAfter=6)
    s['h2'] = ParagraphStyle('h2', fontName='DJSb', fontSize=11, leading=14,
                              textColor=BODY_COL, spaceBefore=8, spaceAfter=4)
    s['card_title'] = ParagraphStyle('ct', fontName='DJSb', fontSize=11, leading=14,
                                      textColor=DK_GREEN, spaceAfter=0)
    s['card_body'] = ParagraphStyle('cb', fontName='DJS', fontSize=10, leading=13,
                                     textColor=BODY_COL, spaceAfter=0)
    s['card_pf'] = ParagraphStyle('cpf', fontName='DJS', fontSize=8.5, leading=11,
                                   textColor=MD_GREEN, spaceAfter=0)
    s['card_tip'] = ParagraphStyle('ctip', fontName='DJSi', fontSize=8.5, leading=11,
                                    textColor=MUTED_COL, spaceAfter=0)
    s['th'] = ParagraphStyle('th', fontName='DJSb', fontSize=8.5, leading=11,
                              textColor=white, spaceAfter=0)
    s['td'] = ParagraphStyle('td', fontName='DJS', fontSize=9, leading=12,
                              textColor=BODY_COL, spaceAfter=0)
    s['td_note'] = ParagraphStyle('tdn', fontName='DJS', fontSize=8.5, leading=11,
                                   textColor=MUTED_COL, spaceAfter=0)
    s['small'] = ParagraphStyle('sm', fontName='DJS', fontSize=9, leading=12,
                                 textColor=MUTED_COL, spaceAfter=3)
    s['check'] = ParagraphStyle('chk', fontName='DJS', fontSize=9, leading=12,
                                 textColor=BODY_COL, spaceAfter=1)
    s['callout'] = ParagraphStyle('cq', fontName='DJRi', fontSize=13, leading=17,
                                   textColor=DK_GREEN)
    s['center'] = ParagraphStyle('cen', fontName='DJSb', fontSize=11, leading=15,
                                  textColor=DK_GREEN, alignment=TA_CENTER)
    return s


def chapter(story, label, title, s, small=False, fit=False):
    story.append(Paragraph(label, s['label']))
    key = 'title_fit' if fit else ('title_sm' if small else 'title')
    story.append(Paragraph(title, s[key]))


def cream_card(rows, s):
    t = Table(rows, colWidths=[UW])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CREAM),
        ('TOPPADDING', (0, 0), (-1, 0), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -2), 2),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, -1), (-1, -1), 0.3, TAN_RULE),
    ]))
    return t


def ingredient_table(rows, s, headers=('INGREDIENT', 'AMOUNT', 'NOTE'), widths=(0.34, 0.16, 0.50)):
    header = [Paragraph(label, s['th']) for label in headers]
    data = [header]
    for name, amount, note in rows:
        data.append([
            Paragraph(name, s['td']),
            Paragraph(amount, s['td']),
            Paragraph(note, s['td_note']),
        ])
    t = Table(data, colWidths=[UW * widths[0], UW * widths[1], UW * widths[2]])
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), MD_GREEN),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 1), (-1, -1), 0.3, TAN_RULE),
    ]
    for i in range(1, len(data)):
        style.append(('BACKGROUND', (0, i), (-1, i), CREAM if i % 2 else white))
    t.setStyle(TableStyle(style))
    return t


def build():
    s = styles()
    frame = Frame(LM, BM, UW, H - TM - BM, leftPadding=0, rightPadding=0,
                  topPadding=0, bottomPadding=0, id='interior')
    cover_frame = Frame(LM, 57, UW, H - 79 - 57, leftPadding=0, rightPadding=0,
                         topPadding=0, bottomPadding=0, id='cover')
    doc = BaseDocTemplate(
        OUT, pagesize=letter, leftMargin=LM, rightMargin=RM,
        topMargin=TM, bottomMargin=BM,
        title='3 Meals for When Nothing Sounds Good',
        author='Chef Healthy Henry',
    )
    doc.addPageTemplates([
        PageTemplate(id='cover', frames=[cover_frame], onPage=draw_cover),
        PageTemplate(id='interior', frames=[frame], onPage=draw_interior),
    ])
    story = [Spacer(1, 1), NextPageTemplate('interior'), PageBreak()]

    chapter(story, 'WELCOME', 'Three meals for right now.', s)
    story.append(Paragraph(
        'This sampler gives you three complete Protein Flip™ meals to make this week. '
        'One cold breakfast you can assemble in minutes. One five-minute savory plate with no '
        'stove required. One dinner that works for the whole table, plated two ways so every '
        'appetite is covered.',
        s['lead']))
    story.append(Paragraph('How the Protein Flip™ Method works.', s['h2']))
    story.append(Paragraph(
        'Every meal in this sampler builds from multiple protein sources rather than stacking '
        'everything into one. A primary protein anchors the plate. A secondary protein contributes '
        'alongside it, usually with a different texture or flavor. Fiber-rich ingredients do '
        'two jobs at once: they add structure and make the meal more satisfying without adding '
        'effort.',
        s['body']))
    story.append(Paragraph(
        'The result is a plate that feels complete even when appetite is low. No single ingredient has '
        'to carry everything.',
        s['body']))
    story.append(Paragraph('How to use this sampler.', s['h2']))
    for n, text in [
        ('1. Pick one meal.', ' Start with whichever of the three sounds most appealing right now. That is the right answer.'),
        ('2. Check the ingredients.', ' Each meal uses familiar ingredients, with a complete shopping list on page 7.'),
        ('3. Use the chef tip.', ' One small technique makes each meal taste finished, not just assembled. It takes ten seconds.'),
        ('4. Try the next one.', ' Once you have made all three, you will have a working sense of how the method feels. The full 20-meal guide builds from there.'),
    ]:
        story.append(Paragraph(f'<b>{n}</b>{text}', s['body']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'The right meal is the one that sounds good enough to make and complete enough to satisfy.',
        s['callout']))

    story.append(PageBreak())
    chapter(story, 'BREAKFAST  •  MEAL 1', 'Raspberry, Orange and Pistachio Yogurt Oats.', s, fit=True)
    story.append(Paragraph(
        'No stove. Ten minutes of resting does the work. Built for mornings when '
        'warmth and time are both off the table.',
        s['lead']))
    story.append(cream_card([
        [Paragraph('1 | Raspberry, Orange and Pistachio Yogurt Oats', s['card_title'])],
        [Paragraph(
            'Stir 1/4 cup rolled oats into 3/4 cup plain Greek yogurt with 1 tsp orange zest and a little honey. '
            'Let stand 10 minutes, or prepare the night before. '
            'Top with 1/4 cup fresh raspberries and 1 tbsp chopped toasted pistachios.',
            s['card_body'])],
        [Paragraph(
            'Protein Flip™: Primary: Greek yogurt. Secondary: oats and pistachios. Fiber: oats, raspberries, and pistachios.',
            s['card_pf'])],
        [Paragraph(
            'Chef tip: Toast the pistachios briefly before serving; it draws out their flavor and makes the bowl taste more considered.',
            s['card_tip'])],
    ], s))
    story.append(Spacer(1, 8))
    story.append(Paragraph('What you need.', s['h2']))
    story.append(ingredient_table([
        ('Plain Greek yogurt', '3/4 cup', 'Thick and high in protein. The base of the bowl.'),
        ('Rolled oats', '1/4 cup', 'Stir in uncooked. They soften in 10 minutes, or overnight.'),
        ('Orange zest', '1 tsp', 'Zest the orange first. It brightens the whole bowl.'),
        ('Honey', 'A little', 'Just enough to round out the orange.'),
        ('Fresh raspberries', '1/4 cup', 'Add right before eating so they stay bright.'),
        ('Pistachios, toasted and chopped', '1 tbsp', 'One minute in a dry pan brings out their flavor.'),
    ], s))
    story.append(Spacer(1, 8))
    story.append(Paragraph('Why this works.', s['h2']))
    story.append(Paragraph(
        'Greek yogurt anchors the bowl. Oats and pistachios add a second layer of protein. '
        'Oats, raspberries, and pistachios bring the fiber. Orange zest and toasted pistachios make it taste finished. '
        'It is a complete meal in a cup that takes less effort than opening an app.',
        s['body']))

    story.append(PageBreak())
    chapter(story, 'SAVORY PLATE  •  MEAL 8',
            'Mediterranean Lentils with Lemon Yogurt, Roasted Peppers and Feta.', s, small=True)
    story.append(Paragraph(
        'No stove. No heat required if the lentils are already cooked. This is the plate for '
        'midday when appetite is low and decisions feel hard.',
        s['lead']))
    story.append(cream_card([
        [Paragraph('8 | Mediterranean Lentils with Lemon Yogurt, Roasted Peppers and Feta', s['card_title'])],
        [Paragraph(
            'Toss 3/4 cup cooked lentils with 1 tsp olive oil, 1 tsp lemon juice, and 1/4 tsp oregano. '
            'Spread lemon yogurt (1/3 cup Greek yogurt + lemon juice + pinch garlic powder) in a shallow bowl. '
            'Spoon lentils over; top with 1/4 cup diced roasted red peppers, 2 tbsp crumbled feta, and chopped parsley.',
            s['card_body'])],
        [Paragraph(
            'Protein Flip™: Primary: lentils. Secondary: yogurt and feta. Fiber: lentils and peppers.',
            s['card_pf'])],
        [Paragraph(
            'Chef tip: Dress the lentils with lemon and olive oil before plating; they carry more flavor that way.',
            s['card_tip'])],
    ], s))
    story.append(Spacer(1, 6))
    story.append(Paragraph('What you need.', s['h2']))
    story.append(ingredient_table([
        ('Cooked lentils', '3/4 cup', 'Green or brown. Toss with 1 tsp olive oil, 1 tsp lemon juice, and 1/4 tsp oregano.'),
        ('Plain Greek yogurt', '1/3 cup', 'Spread in the bowl. Stir in lemon juice and a pinch of garlic powder.'),
        ('Roasted red peppers', '1/4 cup', 'Jarred is fine. Dice and pat dry so the plate does not get watery.'),
        ('Crumbled feta', '2 tbsp', 'Salty, so taste before adding more.'),
        ('Fresh parsley', 'Chopped', 'Finish the plate.'),
        ('Lemon juice, garlic powder, oil, oregano', 'As above', 'Lemon juice goes in the lentils and the yogurt.'),
    ], s))
    story.append(Spacer(1, 6))
    story.append(Paragraph('Why this works.', s['h2']))
    story.append(Paragraph(
        'Lentils anchor the plate with both protein and fiber. Yogurt and feta are the secondary protein, '
        'one creamy and one crumbled. Lemon juice and oregano dress the lentils before they are plated. '
        'Roasted peppers and parsley bring sweetness and color. Nothing needs the stove if the lentils are already cooked.',
        s['body']))

    story.append(PageBreak())
    chapter(story, 'FAMILY DINNER  •  DINNER A', 'Lemon Chicken, White Beans and Carrots.', s, small=True)
    story.append(Paragraph(
        'One connected dinner plated two ways. The Portion Smart plate and the family '
        'portion use the same ingredients. Only the amounts differ.',
        s['lead']))
    story.append(Paragraph('The recipe.', s['h2']))
    story.append(Paragraph(
        'Roast chicken thighs, sliced carrots, oregano, and lemon at 400°F until the chicken reaches '
        '165°F, about 35 minutes. Warm cannellini beans in the pan juices for the last five minutes. '
        'Finish with a spoonful of parsley yogurt: plain Greek yogurt mixed with chopped parsley and '
        'a pinch of salt.',
        s['body']))
    story.append(Paragraph(
        'Chef tip: Dress the beans with the chicken pan juices so the ingredients feel like one dish rather than separate components.',
        s['card_tip']))
    story.append(Spacer(1, 8))
    story.append(Paragraph('Protein Flip™ structure.', s['h2']))
    story.append(ingredient_table([
        ('PRIMARY PROTEIN', 'Chicken thighs', 'The anchor. Roasted until juicy.'),
        ('SECONDARY PROTEIN', 'Beans and yogurt', 'Cannellini beans and parsley yogurt. Each brings a different texture.'),
        ('FIBER', 'Beans and carrots', 'The beans do double duty on protein and fiber.'),
        ('FINISH', 'Lemon and herbs', 'Lemon, parsley yogurt, and oregano brighten the plate.'),
    ], s, headers=('ROLE', 'INGREDIENT', 'WHAT IT DOES'), widths=(0.32, 0.26, 0.42)))

    story.append(PageBreak())
    chapter(story, 'DINNER A  •  PLATED TWO WAYS', 'Cook once. Plate for every appetite.', s)
    story.append(Paragraph(
        'The Portion Smart plate and the family portion come from the same pan. Each '
        'receives the chicken, beans, carrots, and yogurt. The amounts differ. The method '
        'does not.',
        s['lead']))
    two = Table([
        [Paragraph('PORTION SMART', s['th']), Paragraph('FAMILY PORTION', s['th'])],
        [Paragraph(
            'Chicken, white beans, carrots, and parsley yogurt, thoughtfully distributed so every meaningful ingredient contributes to the plate.',
            s['td']),
         Paragraph(
            'A larger serving of the same chicken, beans, carrots, and yogurt. Add whole-grain bread if desired. No second dinner required.',
            s['td'])],
    ], colWidths=[UW / 2, UW / 2])
    two.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), MD_GREEN),
        ('BACKGROUND', (1, 0), (1, 0), MD_GREEN),
        ('BACKGROUND', (0, 1), (0, 1), LIGHT_BG),
        ('BACKGROUND', (1, 1), (1, 1), white),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEAFTER', (0, 0), (0, -1), 0.4, TAN_RULE),
    ]))
    story.append(two)
    story.append(Spacer(1, 8))
    story.append(Paragraph('The repeatable question.', s['h2']))
    story.append(Paragraph(
        'Does each plate still have dispersed protein and fiber, no matter its size? Did the Portion '
        'Smart plate get a little of each meaningful part?',
        s['body']))
    story.append(Paragraph('What to keep on hand for this dinner.', s['h2']))
    story.append(ingredient_table([
        ('Bone-in chicken thighs', '4 pieces', 'Bone-in stays juicier through roasting.'),
        ('Cannellini beans, canned', '1 can (15 oz)', 'Rinse and drain. Add to the pan in the last five minutes.'),
        ('Carrots', '3 medium', 'Sliced on the diagonal. They cook at the same rate as the chicken.'),
        ('Plain Greek yogurt', '1/4 cup', 'Low-fat. Mixed with parsley for the finish. Same yogurt as Meals 1 and 8.'),
        ('Fresh parsley', 'Small bunch', 'Chopped and stirred into the yogurt. Brightens the whole plate.'),
        ('Lemon', '1', 'Sliced and roasted alongside the chicken.'),
        ('Dried oregano and olive oil', 'To season', 'Rub on the chicken before roasting.'),
    ], s))

    story.append(PageBreak())
    chapter(story, 'YOUR SHOPPING LIST', 'Everything you need for all three meals.', s, small=True)
    story.append(Paragraph(
        'This list covers every ingredient in the sampler. Items marked with an asterisk (*) are staples that carry over into the full guide.',
        s['small']))
    left = [
        Paragraph('<b>MEAL 1</b>', s['label']),
        Paragraph('☐  Plain low-fat Greek yogurt (small container)', s['check']),
        Paragraph('☐  Rolled oats * (1/4 cup)', s['check']),
        Paragraph('☐  Orange (1, for zest)', s['check']),
        Paragraph('☐  Honey (a little)', s['check']),
        Paragraph('☐  Fresh raspberries (1/4 cup)', s['check']),
        Paragraph('☐  Pistachios (1 tbsp)', s['check']),
        Paragraph('<b>MEAL 8</b>', s['label']),
        Paragraph('☐  Cooked lentils * (3/4 cup)', s['check']),
        Paragraph('☐  Crumbled feta (2 tbsp)', s['check']),
        Paragraph('☐  Jarred roasted red peppers * (1/4 cup)', s['check']),
        Paragraph('☐  Plain low-fat Greek yogurt * (1/3 cup)', s['check']),
        Paragraph('☐  Lemon juice, garlic powder, oregano *, olive oil *, parsley *', s['check']),
    ]
    right = [
        Paragraph('<b>DINNER A</b>', s['label']),
        Paragraph('☐  Bone-in chicken thighs (4 pieces)', s['check']),
        Paragraph('☐  Carrots (3 medium)', s['check']),
        Paragraph('☐  Cannellini beans, canned * (1 can, 15 oz)', s['check']),
        Paragraph('☐  Lemon (1)', s['check']),
        Paragraph('☐  Fresh parsley * (small bunch)', s['check']),
        Paragraph('☐  Dried oregano * (to season)', s['check']),
        Paragraph('☐  Olive oil * (to season)', s['check']),
        Paragraph('☐  Plain low-fat Greek yogurt * (1/4 cup)', s['check']),
        Paragraph('☐  Salt (pinch)', s['check']),
    ]
    def stack(items, width):
        inner = Table([[item] for item in items], colWidths=[width])
        inner.setStyle(TableStyle([
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        return inner

    cols = Table([[stack(left, UW / 2 - 8), stack(right, UW / 2 - 8)]], colWidths=[UW / 2, UW / 2])
    cols.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(cols)
    story.append(Spacer(1, 6))
    story.append(Paragraph('Seven staples that make your next meal easier.', s['h2']))
    story.append(Paragraph(
        'Keep these items stocked beyond this sampler and you will always have a Protein Flip™ meal within reach.',
        s['small']))
    story.append(ingredient_table([
        ('Plain low-fat Greek yogurt', 'All three meals', 'One container covers breakfast, the savory plate, and dinner.'),
        ('Cooked or canned lentils', 'Meal 8', 'Ready cold. Cook a batch once and use it through the week.'),
        ('Canned cannellini beans', 'Dinner A', 'One can covers Dinner A and extends into soups and toasts.'),
        ('Jarred roasted red peppers', 'Meal 8', 'Refrigerate after opening. Follow the package storage instructions.'),
        ('Plain rolled oats', 'Meal 1', 'Stir into yogurt the night before for a ready breakfast.'),
        ('Fresh parsley', 'Meal 8 and Dinner A', 'Finishes the lentil plate and the chicken.'),
        ('Olive oil and dried oregano', 'Meal 8 and Dinner A', 'Used in both. Meal 8 also uses lemon juice.'),
    ], s))

    story.append(PageBreak())
    chapter(story, 'READY FOR THE FULL GUIDE?', 'The complete system for when nothing sounds good.', s, small=True)
    story.append(Paragraph(
        'You have just seen how the Protein Flip™ Method works in real life: practical meals you can make when appetite is low and deciding what to eat feels harder than it should.',
        s['lead']))
    story.append(Paragraph(
        'The full When Nothing Sounds Good guide gives you the rest of the system, ready whenever you need it.',
        s['body']))
    story.append(Paragraph('Inside the full guide.', s['h2']))
    story.append(ingredient_table([
        ('The complete Appetite Compass', 'Start where you are', 'Find a meal by temperature, texture, effort, and flavor.'),
        ('20 chef-built Protein Flip™ meals', 'A full week and more', 'Cold breakfasts, five-minute plates, warm meals, and portable meals.'),
        ('Five family dinners, two ways', 'Cook once.', 'Cook once and plate for a Portion Smart appetite and a family portion.'),
        ('A grocery map', 'Shop connected foods', 'Buy ingredients that turn into several meals.'),
        ('When Hunger Returns', 'The same Method', 'The plate can grow without losing balance, flavor, or satisfaction.'),
    ], s, headers=("WHAT'S INSIDE", 'AT A GLANCE', 'WHAT IT DOES'), widths=(0.36, 0.24, 0.40)))
    story.append(Spacer(1, 6))
    story.append(Paragraph('Why people want the full guide.', s['h2']))
    story.append(Paragraph(
        'Because the hard part is usually not knowing that you should eat. The hard part is knowing what '
        'actually sounds good right now and how to make it feel complete in a few bites.',
        s['body']))
    story.append(Paragraph(
        'This guide helps you make faster food decisions, keep protein dispersed across the plate, '
        'build in meaningful fiber, use ingredients that work together, reduce effort without losing satisfaction, '
        'and stay at the same table with the rest of the household.',
        s['body']))
    story.append(Paragraph(
        'If this sampler helped, the full guide will help even more. It is the same approach, expanded into a '
        'practical kitchen tool you can return to again and again.',
        s['body']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        'Get the complete When Nothing Sounds Good guide for $19 at chefhealthyhenry.com',
        s['center']))

    doc.build(story)
    print(f'Built: {OUT}')


if __name__ == '__main__':
    build()
