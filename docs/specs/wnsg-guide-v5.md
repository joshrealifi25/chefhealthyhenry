# Spec: When Nothing Sounds Good — Guide v5

## Overview

Rebuild `build_wnsg_v4.py` into `build_wnsg_v5.py`. All 20 meal cards have been revised. Three ingredient changes cascade into the Appetite Compass and grocery map. Recipe 3 now has two variations and needs a custom card format. Output the finished PDF to the same location as v4 but named `When_Nothing_Sounds_Good_v5.pdf`.

Do not change: cover, welcome, from the chef, the method, the why, one dinner two appetites (pages 12–13), when hunger returns, keep cooking, or the closing page. Those pages remain exactly as they are in v4.

---

## Changes Required

### 1. All 20 Meal Cards (pages 8–11)

Replace every `meal_card(...)` call with the updated versions below. Title, recipe summary, PF note, and chef tip all change.

**Page 8 — section header:** Keep `'20 MEALS  •  1-5'` and title `'Cold breakfasts and soft starts.'` and lead paragraph unchanged.

---

**Meal 1**
- Title: `Raspberry, Orange & Pistachio Yogurt Oats`
- Recipe: `Stir 1/4 cup rolled oats into 3/4 cup plain Greek yogurt with 1 tsp orange zest and a little honey. Top with 1/4 cup fresh raspberries and 1 tbsp chopped toasted pistachios.`
- PF note: `Protein Flip™: Primary: Greek yogurt. Supporting: oats and pistachios. Fiber: oats, raspberries, and pistachios.`
- Chef tip: `Toast the pistachios briefly before serving; it draws out their flavor and makes the bowl taste more considered.`

---

**Meal 2**
- Title: `Savory White Bean and Cottage Cheese Cup`
- Recipe: `Mash half of 1/2 cup cannellini beans with 1/2 cup cottage cheese until partly smooth. Fold in remaining beans, 2 tbsp diced cucumber, 2 tbsp diced roasted red pepper (patted dry), 1 tbsp scallion, 1 tsp dill, 1/4 tsp lemon zest, and 1 tsp lemon juice. Season and drizzle with olive oil.`
- PF note: `Protein Flip™: Shared anchor: white beans and cottage cheese. Fiber: beans and cucumber.`
- Chef tip: `Pat the roasted peppers dry before folding in; excess moisture softens the beans quickly.`

---

**Meal 3 — DUAL VARIATION (special format, see Section 2 below)**

---

**Meal 4**
- Title: `Blueberry, Vanilla & Pecan Overnight Oats`
- Recipe: `Combine 1/3 cup rolled oats, 1/2 cup milk, 1/3 cup plain Greek yogurt, 1/2 tsp vanilla, and 1 tsp chia seeds. Refrigerate overnight. Top with 1/4 cup blueberries and 1 tbsp chopped pecans before eating.`
- PF note: `Protein Flip™: Primary: Greek yogurt. Supporting: oats and chia. Fiber: oats, chia, blueberries, and pecans.`
- Chef tip: `Stir once after 10 minutes so the chia stays evenly distributed throughout the jar.`

---

**Meal 5**
- Title: `Egg, Pinto Bean & Avocado Lettuce Bites with Lime Yogurt`
- Recipe: `Mash 1/3 cup pinto beans with lime juice, cumin, and salt. Fold in 1 chopped hard-boiled egg and 2 tbsp diced avocado. Spoon into small romaine or butter lettuce cups. Add a little plain Greek yogurt mixed with lime juice alongside.`
- PF note: `Protein Flip™: Shared protein: egg and pinto beans. Fiber: beans, avocado, and tomato.`
- Chef tip: `Season the mashed beans first; they carry the flavor for the entire bite.`

---

**Page 9 — section header:** Keep `'20 MEALS  •  6-10'` and title `'Five-minute savory plates.'` unchanged.

---

**Meal 6**
- Title: `Lemony White Bean & Egg Toast with Salted Tomatoes`
- Recipe: `Mash 1/3 cup cannellini beans with 1 tbsp Greek yogurt, lemon zest, and salt. Spread on 1 slice toasted whole-grain bread. Top with 1 chopped cooked egg. Spoon over 1/4 cup halved cherry tomatoes tossed with salt and olive oil. Finish with fresh parsley.`
- PF note: `Protein Flip™: Primary: beans. Supporting: egg and yogurt. Fiber: beans, toast, and tomatoes.`
- Chef tip: `Toast the bread well; the soft bean spread needs a crisp base beneath it.`

---

**Meal 7**
- Title: `Ginger, Edamame & Silken Tofu Egg Drop Cup`
- Recipe: `Bring 3/4 cup low-sodium broth to a gentle simmer with 1/2 tsp grated ginger and a few drops of tamari. Add 1/2 cup cooked edamame and 1/3 cup silken tofu in pieces. Slowly pour in 1 beaten egg while stirring to create soft ribbons. Garnish with scallions.`
- PF note: `Protein Flip™: Shared protein: tofu, edamame, and egg. Fiber: edamame.`
- Chef tip: `Keep the broth just below a boil when adding the egg; a full boil breaks the ribbons apart.`

---

**Meal 8**
- Title: `Mediterranean Lentils with Lemon Yogurt, Roasted Peppers & Feta`
- Recipe: `Toss 3/4 cup cooked lentils with 1 tsp olive oil, 1 tsp lemon juice, and 1/4 tsp oregano. Spread lemon yogurt (1/3 cup Greek yogurt + lemon juice + pinch garlic powder) in a shallow bowl. Spoon lentils over; top with 1/4 cup diced roasted red peppers, 2 tbsp crumbled feta, and chopped parsley.`
- PF note: `Protein Flip™: Primary: lentils. Supporting: yogurt and feta. Fiber: lentils and peppers.`
- Chef tip: `Dress the lentils with lemon and olive oil before plating; they carry more flavor that way.`

---

**Meal 9**
- Title: `Mediterranean Tuna & White Bean Cup with Lemon-Dijon Yogurt`
- Recipe: `Whisk 2 tbsp Greek yogurt with 1 tsp lemon juice, 1/2 tsp Dijon mustard, and lemon zest. Toss 1/2 cup cannellini beans with half the dressing. Fold in 1/4 cup diced cucumber, 2 tbsp diced radish, 1 tsp chopped capers, and parsley. Fold in 2 oz flaked canned tuna last.`
- PF note: `Protein Flip™: Primary: tuna. Supporting: beans and yogurt. Fiber: beans, cucumber, and radishes.`
- Chef tip: `Add tuna last and fold gently; keeping the flakes intact improves both texture and presentation.`

---

**Meal 10**
- Title: `Tomato, Hummus & Cottage Cheese Plate with Basil-Marinated Tomatoes`
- Recipe: `Toss 1/2 cup halved cherry tomatoes with 1 tsp sherry vinegar, 1 tsp olive oil, fresh basil, and a pinch of salt. Let stand 3 to 5 minutes. Spread 1/2 cup hummus and 1/2 cup cottage cheese in a shallow bowl. Spoon tomatoes over. Top with 1 tbsp toasted pine nuts and fresh basil.`
- PF note: `Protein Flip™: Primary: chickpeas in hummus and cottage cheese. Fiber: chickpeas, tomatoes, and pine nuts.`
- Chef tip: `Salt the tomatoes and let them rest first; even a few minutes creates a flavorful, natural dressing.`

---

**Page 10 — section header:** Keep `'20 MEALS  •  11-15'` and title `'Warm, soft and spoonable.'` unchanged.

---

**Meal 11**
- Title: `Ginger Lemon Red Lentil & Chicken Soup with Bok Choy`
- Recipe: `Heat 1 tsp olive oil; cook 1/2 tsp grated ginger and 1/4 tsp cumin 30 seconds. Add 3/4 cup cooked red lentils, 1/2 cup chicken broth, and 1/2 cup chopped bok choy stems. Simmer 2 to 3 minutes; add leaves and 1 oz shredded cooked chicken. Finish with lemon juice and fresh cilantro.`
- PF note: `Protein Flip™: Primary: red lentils. Supporting: chicken. Fiber: lentils and bok choy.`
- Chef tip: `Stir gently so some lentils break down into the broth; this creates natural creaminess without blending.`

---

**Meal 12**
- Title: `Creamy Edamame, Pea & Spinach Soup with Lemon Dill Yogurt`
- Recipe: `Cook 1 grated garlic clove in olive oil 30 seconds. Add 1 cup frozen edamame, 1/4 cup frozen peas, and 3/4 cup vegetable broth; simmer 4 to 5 minutes. Add 1 cup fresh spinach; cook 1 minute. Blend with 2 tbsp Greek yogurt until smooth. Swirl with lemon dill yogurt (3 tbsp Greek yogurt + lemon juice + fresh dill) to serve.`
- PF note: `Protein Flip™: Primary: edamame. Supporting: Greek yogurt and peas. Fiber: edamame, peas, and spinach.`
- Chef tip: `Blend until fully smooth; edamame takes longer than white beans, so give the blender enough time.`

---

**Meal 13**
- Title: `Silken Tofu, Edamame & Shiitake Miso Bowl`
- Recipe: `Cook 1/4 cup sliced shiitake mushrooms in sesame oil 2 to 3 minutes. Add 3/4 cup vegetable broth, 1/4 cup carrot ribbons, and 3/4 cup cooked edamame; simmer 2 to 3 minutes. Slide in 3/4 cup silken tofu cubes and warm gently on low. Off heat, stir in 1 tsp white miso dissolved in warm broth and a splash of rice vinegar. Garnish with scallions and sesame seeds.`
- PF note: `Protein Flip™: Shared protein: tofu and edamame. Fiber: edamame, mushrooms, and carrots.`
- Chef tip: `Dissolve miso in a spoonful of warm broth before adding it to the bowl; it distributes evenly without clumping.`

---

**Meal 14**
- Title: `Lemony Salmon & Lentil Bowl with Zucchini and Dill Yogurt`
- Recipe: `Season 3 oz salmon and sear in olive oil 3 to 5 minutes per side to 145°F. In the same pan, saute 1/2 cup sliced zucchini; add 2/3 cup cooked lentils, lemon juice, lemon zest, and fresh dill. Spoon into a bowl; place salmon over. Add lemon dill yogurt (2 tbsp Greek yogurt + lemon juice + Dijon + dill) and scatter 1 tsp drained capers.`
- PF note: `Protein Flip™: Primary: salmon. Secondary: lentils. Supporting: yogurt. Fiber: lentils and zucchini.`
- Chef tip: `Use the same pan for the zucchini and lentils after the salmon; the residual flavor makes the whole bowl more cohesive.`

---

**Meal 15**
- Title: `Smoky Black Bean, Tomato & Egg Skillet with Lime Paprika Yogurt`
- Recipe: `Bloom minced garlic, cumin, and smoked paprika in olive oil 30 seconds. Add 1/2 cup diced tomatoes; cook 2 minutes. Add 2/3 cup black beans; lightly mash a quarter. Fold in 1 cup baby spinach. Make a well, crack in 1 egg, cover, and cook on low 4 to 6 minutes until white is set. Spoon lime paprika yogurt (1/4 cup Greek yogurt + lime juice + sweet paprika) around the egg. Crumble 1 tbsp cotija over the top.`
- PF note: `Protein Flip™: Primary: black beans. Secondary: egg. Supporting: yogurt and cotija. Fiber: black beans, tomatoes, and spinach.`
- Chef tip: `Mash about a quarter of the beans into the tomato base; this thickens the sauce without any other ingredient.`

---

**Page 11 — section header:** Keep `'20 MEALS  •  16-20'` and title `'Portable and shareable.'` unchanged.

---

**Meal 16**
- Title: `Lemon Herb Chicken & Chickpea Pita with Cucumber Yogurt and Sumac`
- Recipe: `Lightly mash half of 2/3 cup chickpeas with olive oil, lemon juice, cumin, garlic powder, and 2 tbsp diced roasted red pepper. Season 1 oz cooked shredded chicken with lemon juice. Make cucumber yogurt (1/4 cup Greek yogurt + 1/4 cup finely diced cucumber + lemon zest + parsley). Fill a halved whole-grain pita with chickpeas, chicken, and cucumber yogurt. Dust with sumac.`
- PF note: `Protein Flip™: Primary: chickpeas. Secondary: chicken. Supporting: yogurt. Fiber: chickpeas, pita, and cucumber.`
- Chef tip: `Mash only half the chickpeas; the mix of creamy and whole keeps the filling from turning into a paste.`

---

**Meal 17**
- Title: `Egg, Hummus & Cumin-Roasted Carrot Lunch Box with Lemon Za'atar Yogurt`
- Recipe: `Toss 3/4 cup carrot sticks with olive oil, cumin, coriander, salt, and pepper. Roast at 425°F for 20 to 25 minutes until tender and golden. Pack with 1 halved hard-boiled egg, 1/2 cup hummus, lemon za'atar yogurt (1/4 cup Greek yogurt + lemon juice + lemon zest + za'atar), and 4 whole-grain crackers in a separate compartment.`
- PF note: `Protein Flip™: Primary: chickpeas in hummus. Secondary: egg. Supporting: yogurt. Fiber: chickpeas, carrots, and crackers.`
- Chef tip: `Roast the carrots until they develop lightly caramelized edges; that sweetness is what makes this box worth returning to.`

---

**Meal 18**
- Title: `Smoky Turkey & Black Bean Quesadilla with Lime Cabbage Slaw`
- Recipe: `Lightly mash half of 1/2 cup black beans with cumin, smoked paprika, lime juice, and salt. Briefly wilt 1/2 cup baby spinach. Spread beans over half a whole-grain tortilla; add 1 oz shredded turkey, spinach, and 2 tbsp shredded pepper jack. Fold and toast in a dry skillet 3 to 4 minutes per side until golden. Rest 1 minute; slice. Serve with quick lime cabbage slaw (1/4 cup shredded red cabbage + lime juice + cilantro).`
- PF note: `Protein Flip™: Primary: black beans. Secondary: turkey. Supporting: pepper jack. Fiber: black beans, tortilla, spinach, and cabbage.`
- Chef tip: `Toast in a dry skillet on medium-low; the tortilla crisps without additional oil and the cheese has time to melt.`

---

**Meal 19**
- Title: `Lemon Dill Lentil & Edamame Salad with Feta and Radish`
- Recipe: `Whisk 1 tsp olive oil, 2 tsp lemon juice, 1/4 tsp Dijon mustard, dried oregano, and lemon zest. Toss 1/2 cup cooked lentils and 1/2 cup cooked edamame with dressing; rest 2 to 3 minutes. Fold in 1/3 cup diced cucumber, 2 thinly sliced radishes, fresh dill, and half the feta. Top with remaining 2 tbsp crumbled feta and fresh dill.`
- PF note: `Protein Flip™: Shared protein: lentils and edamame. Supporting: feta. Fiber: lentils, edamame, cucumber, and radishes.`
- Chef tip: `Dress the lentils and edamame first and let them rest; they absorb the lemon and seasonings before the vegetables go in.`

---

**Meal 20**
- Title: `Mediterranean Salmon & Chickpea Cup with Lemon Caper Yogurt`
- Recipe: `Lightly mash about a quarter of 3/4 cup chickpeas with olive oil. Make lemon caper yogurt (1/4 cup Greek yogurt + 2 tsp lemon juice + lemon zest + 1 tsp finely chopped capers + 1/4 tsp Dijon). Toss chickpeas with two-thirds of the dressing; fold in 1/4 cup diced roasted red pepper, 1/4 cup diced cucumber, and parsley. Fold in 2 oz gently flaked canned salmon. Top with remaining yogurt, lemon zest, and black pepper.`
- PF note: `Protein Flip™: Primary: salmon. Secondary: chickpeas. Supporting: yogurt. Fiber: chickpeas, peppers, and cucumber.`
- Chef tip: `Fold the salmon in last and handle it gently; visible flakes make this look and eat better than a paste.`

---

### 2. Recipe 3 — Dual Variation Card

Recipe 3 is now two flavor variations of the same base recipe. Replace the standard `meal_card('3', ...)` call with a custom two-row card using the same CREAM background, TAN_RULE dividers, and styling as the other meal cards.

The card should contain:

**Row 1 (full width, CREAM):** `3 | Almond Cream Smoothie Bowl — Two Ways`

**Row 2 (two columns):**
- Left column (LIGHT_BG label): `PEACH, TOFU & CARDAMOM`
- Left column text: `Blend 1/2 cup silken tofu, 1/4 cup plain Greek yogurt, 1 tbsp almond butter, 1/2 ripe peach, and a pinch of cardamom until smooth. Chill before serving; top with peach slices and chopped almonds.`
- Right column (white label): `MIXED BERRY & VANILLA`
- Right column text: `Use 1/2 cup mixed berries and a drop of vanilla extract in place of the peach and cardamom. Top with fresh berries.`

**Row 3 (full width, CREAM):**
- PF note: `Protein Flip™: Primary: tofu. Supporting: yogurt and almond butter. Fiber: fruit.`
- Chef tip: `Chill the blend for at least 10 minutes; the cardamom version develops more depth as it rests.`

Build this using the same KeepTogether + Table approach as the other cards. Use the two_col() helper as a reference for the variation row layout. Keep LINEBELOW on the last row using TAN_RULE at 0.3 thickness.

---

### 3. Appetite Compass (page 4)

Replace all four `lane_block(...)` calls with the updated text below.

**Lane 1:**
```
lane_block(
    'Cold and creamy  •  no stove',
    'Try 1 Raspberry Oat Yogurt, 2 Savory White Bean Cup, 3 Almond Cream Bowl, '
    '4 Overnight Oats, or 10 Hummus Cottage Cheese. These are chilled and spoonable.', s)
```

**Lane 2:**
```
lane_block(
    'Fresh and savory  •  assemble only',
    'Try 8 Mediterranean Lentils, 9 Tuna White Bean, 16 Chicken Chickpea Pita, '
    '17 Egg Hummus Box, 19 Lentil Edamame Salad, or 20 Salmon Chickpea Cup. '
    'These use ready-cooked ingredients.', s)
```

**Lane 3:**
```
lane_block(
    'Warm and soft  •  spoon or fork',
    'Try 7 Edamame Tofu Egg Drop, 11 Red Lentil Chicken Soup, 12 Edamame Pea Spinach Soup, '
    '13 Tofu Edamame Miso, 14 Salmon Lentil Zucchini, or 15 Black Bean Egg Skillet.', s)
```

**Lane 4:**
```
lane_block(
    'Crisp or handheld  •  some bite',
    'Try 5 Egg Pinto Bean Lettuce Bites, 6 White Bean Egg Toast, 16 Chicken Chickpea Pita, '
    '17 Egg Hummus Box, or 18 Turkey Black Bean Quesadilla.', s)
```

Also update the matching paragraph on page 5 to:
```
'Now match the answers to a meal. If you want cold, creamy, and no cooking, '
'choose Meal 3. If you want warm, soft, and mild, choose Meal 12. '
'If you want savory without turning on the stove, choose Meal 8 or 20. '
'If you want something you can hold, choose Meal 16 or 18.'
```

---

### 4. Grocery Map (page 14)

Replace all five data rows in `group_rows`. Keep the header row, table structure, column widths, and styling unchanged.

New five rows:

```python
[Paragraph('Greek yogurt · rolled oats · silken tofu · almond butter · raspberries · blueberries · mixed berries · pistachios · pecans · chia seeds · cottage cheese · orange · vanilla', s['meal_body']),
 Paragraph('1, 2, 3, 4', s['small']),
 Paragraph('Keep yogurt and oats stocked together. The tofu and almond butter extend the same shop into Meals 3 and 4.', s['meal_tip'])],

[Paragraph('White beans · eggs · cherry tomatoes · avocado · pinto beans · whole-grain bread · parsley · lemon · olive oil · hummus · pine nuts', s['meal_body']),
 Paragraph('5, 6, 10', s['small']),
 Paragraph('A single shop covers three formats: lettuce bites, toast, and a no-cook plate.', s['meal_tip'])],

[Paragraph('Frozen edamame · frozen peas · silken tofu · shiitake mushrooms · vegetable broth · white miso · sesame oil · rice vinegar · carrots · ginger · tamari · scallions', s['meal_body']),
 Paragraph('7, 12, 13', s['small']),
 Paragraph('Keep frozen edamame on hand; it appears in three recipes and covers two cooking styles.', s['meal_tip'])],

[Paragraph('Green or brown lentils · red lentils · canned tuna · canned salmon · chickpeas · feta · roasted red peppers · cucumber · radishes · whole-grain pita · crackers · capers · dill · Dijon mustard · sumac · za\'atar', s['meal_body']),
 Paragraph('8, 9, 11, 14, 16, 17, 19, 20', s['small']),
 Paragraph('Lentils go with seven of these eight meals. Cook a large batch once and use across the week.', s['meal_tip'])],

[Paragraph('Black beans · cooked turkey or chicken · whole-grain tortilla · pepper jack cheese · red cabbage · baby spinach · cotija · cumin · smoked paprika · lime · cilantro · Greek yogurt', s['meal_body']),
 Paragraph('15, 18', s['small']),
 Paragraph('These two meals share most of their ingredients. Making both in one week is efficient.', s['meal_tip'])],
```

---

### 5. Output File

Change:
```python
OUT = '/sessions/.../outputs/When_Nothing_Sounds_Good.pdf'
```
to:
```python
OUT = '/sessions/.../outputs/When_Nothing_Sounds_Good_v5.pdf'
```
Keep the full directory path unchanged; only the filename changes.

---

## What Does Not Change

- Cover page and all canvas callbacks
- Welcome page (page 2)
- From the Chef page (page 3)
- Make the Choice page (page 5)
- The Method page (page 6)
- The Why page (page 7)
- One Dinner Two Appetites pages (pages 12 and 13)
- When Hunger Returns page (page 15)
- Keep Cooking page (page 16)
- A Note Before You Go page (page 17)
- 15-Minute Reset table on the grocery map page
- Kitchen safety note at the bottom of the grocery map page
- All styles, colors, fonts, and page geometry
- All helper functions except the new dual-variation card for Recipe 3

---

## Verification

After running the script, confirm:
1. PDF renders without errors
2. Page count is 17 (Recipe 3 dual card fits on the same page as Meals 1 to 5)
3. All 20 meal numbers appear in the PDF text
4. No em dashes anywhere in the output text
5. Every instance of "Protein Flip" includes the TM symbol
