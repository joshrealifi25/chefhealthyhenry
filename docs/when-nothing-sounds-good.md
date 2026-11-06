# When Nothing Sounds Good: launch plan

Last updated: October 2026. For Henry and Josh.

This is the plan for a new paid guide, the free sample that sells it, the ads, the emails, and the checkout follow-up. Download this file and keep it. Nothing here is live yet.

## The decision

Make one new digital guide:

**When Nothing Sounds Good: Protein Flip™ meals for a small appetite.**

Price: **$19**. Delivery: instant PDF, the same way the other digital books are delivered.

Give away a short free sample first:

**3 Meals for When Nothing Sounds Good.**

The first ad test spends at most **$500** total. Stop any lead ad that costs more than **$3** per new email subscriber.

This fits the site. The recipes stay free. The guide teaches a way to cook when a full plate feels like too much. It is culinary education, not medical advice. It does not give dosing, side-effect advice, or weight-loss promises.

The Deluxe Edition stays the full method. Membership stays the place someone practices it. This guide is the thing a new visitor can buy this month.

## What has to be true before ads run

The current site cannot run the abandoned-checkout emails yet.

- Digital books are sold with Stripe Payment Links. After someone pays, the site emails the download. If someone leaves before paying, the site does not learn their email and cannot send them back to that checkout.
- Membership checkout is different. The site creates that checkout itself, and it already offers the digital Deluxe Edition as an optional $20 add-on.
- The welcome emails in `docs/emails/` are pasted into Resend by hand. They are not an automatic sequence that starts the moment someone joins.

So the order is: build the guide and the page, make checkout something the site can see, turn on the emails, then turn on ads. Do not buy traffic while a buyer can pay and fail to get the file.

## The guide

About 40 pages. Use recipes already on the site wherever they fit. Photograph three finished plates. Make the PDF easy to read on a phone.

| Section | What it gives the reader |
| --- | --- |
| 1. Start where appetite is | A way to choose food by texture and effort: warm, cold, soft, crisp, mild, bright, or five minutes. |
| 2. The small-plate formula | One easy protein, one plant, one flavor anchor, with pictures. |
| 3. Twenty meal ideas | Breakfast, soups, bowls, snack plates, portable meals, and family dinners. |
| 4. One dinner, two appetites | Five base dinners plated small for one person and full for everyone else. |
| 5. The low-hunger grocery map | Short lists for the refrigerator, freezer, pantry, and a convenience store. |
| 6. When hunger returns | The same method at a normal portion, so the reader is not starting over. |
| 7. Where cooking advice stops | A clear note to talk with a clinician about medication. No dosing. No promises. |

### The free sample

Six to eight pages:

- one cold breakfast
- one five-minute savory plate
- one family dinner served two ways
- a seven-item refrigerator list

The sample is the ad offer. The $19 guide is the sale.

## What to offer, and when

| Moment | Offer | Price | Next step |
| --- | --- | --- | --- |
| New visitor | 3-meal sampler | Free | Join the email sequence |
| Email subscriber | When Nothing Sounds Good | $19 | Buy the guide |
| Guide checkout | Dining Out Guide or Starter Guide, one test only | $7 add-on | Add one related guide |
| Guide buyer | The Protein Flip™ Method and Cookbook, Deluxe Edition | $27.99 | Learn the full method |
| Engaged buyer | Protein Flip™ Kitchen | $10 founding, or $12 a month | Ongoing help from Sous and the lessons |
| Member checkout | Digital Deluxe Edition | $20 optional item | Already built |

Show one offer at a time.

- The landing page has one button above the fold, the cover, three outcomes, Henry's photo, a few sample pages, a short FAQ, and the disclaimer.
- The exit popup offers the free sampler only on pages about small appetite, GLP-1, or matching recipes. Everywhere else, keep the free Grocery Store Test.
- Do not show both popups in the same visit.
- Checkout gets one add-on, not a row of books.
- The thank-you page tells the buyer which page to open first, then shows the Deluxe Edition once.
- Hide sales popups from people who already bought and from active members.
- Use the founding membership price only while it is actually available. No fake countdown.

## Ads

Keep both current Google Performance Max campaigns paused. They are aimed at sales, and the account recorded no conversions from them.

Spend the first $500 like this:

| Campaign | Budget | Who sees it | Pass mark |
| --- | --- | --- | --- |
| Meta lead ad | $240 | Broad US adults 35 and older. Then one interest test around healthy cooking and GLP-1. | $3 or less per confirmed email |
| Meta sales ad | $140 | People who visited, watched the video, or opened the sampler | First real guide sales at a cost that still leaves margin |
| Google Search | $90 | People searching for small-appetite meals | Proof that this search demand exists |
| Spare creative | $30 | The audience that is already winning | Replace a weak ad |

Google Search uses exact and phrase match only. No Performance Max. No Display. Starter keywords:

- meals for small appetite
- what to eat when nothing sounds good
- easy high protein small meals

Count two different conversions. A sampler signup is a lead. A paid guide is a purchase. The lead campaign optimizes for leads. The sales campaign optimizes for purchases. Put the source on every link so the weekly report can say where each subscriber came from.

Stop a lead ad after about 50 real clicks if it is over $3 per subscriber. If the sales page converts under about 1.5% of cold visitors, send those ads to the free sample instead. If fewer than about 3% of sampler readers buy within 14 days, change the promise or the proof before discounting the guide.

### Creative

Four ads. Change one thing at a time: first the opening line, then the picture, then the audience. Do not let the ad platform rewrite claims.

**Video 1, The fridge test.** Henry opens the fridge and pulls out yogurt, eggs, beans, herbs, and a bright sauce. Close shots of three small plates.

- Opening line: "When nothing sounds good, do not start with a recipe. Start with the kind of bite you can imagine eating."
- Middle: "I made a free three-meal map for low-appetite days. Real food, small plates, and no calorie math."
- Button: Get the free meal map.

**Video 2, One dinner, two plates.** One pan becomes a small soft plate and a full family bowl.

- Opening line: "A small appetite should not mean cooking a second dinner."
- Middle: "The Protein Flip lets one meal flex for the person who can manage a few bites and everyone else at the table."
- Button: See three meals free.

**Still image.** Four real small plates on a cream background. No supplement bottle. No before-and-after photo.

- Headline: When nothing sounds good.
- Text: Three chef-built meals for low-appetite days. Free from Chef Healthy Henry.

**Google search ad.**

- Headlines: Meals for a Small Appetite. When Nothing Sounds Good. Chef-Built Meal Ideas. Free 3-Meal Map. Real Food in a Few Bites.
- Description: Get three flexible, flavor-first meals for low-appetite days. Culinary guidance from Chef Healthy Henry.

## Emails

Every marketing email needs an unsubscribe link. Sender: Chef Healthy Henry <henry@chefhealthyhenry.com>. Voice: warm, specific, no hype. No exclamation points.

If someone buys, stop selling them the guide. If someone unsubscribes, stop every marketing email immediately. A receipt and a download link are the only mail that continues.

### After they take the free sample

| When | Subject | What to say | Button |
| --- | --- | --- | --- |
| Right away | Your small-appetite meal map | Send the sample. Ask what is hardest right now: breakfast, dinner, or getting enough protein. | Open the sampler |
| Day 1 | When a full plate feels like too much | Eating well does not have to mean finishing a large plate. Teach the three-part plate. | Try the small-plate formula |
| Day 3 | The family does not need a second dinner | One base meal, two plates. | See the two-way dinner |
| Day 5 | Protein without another shake | Five savory, food-first ideas. No gram targets. No medical claims. | Get the five ideas |
| Day 7 | What to keep in the fridge for low-hunger days | Seven foods and one assembly meal. Point to the fuller grocery map in the guide. | See the complete guide |
| Day 9 | What happens when hunger comes back | The same method works for a small appetite and a normal one. | Build a method that lasts |
| Day 11 | A chef's answer to "nothing sounds good" | Henry's short story: flavor first, nothing forbidden, nutrition added around food worth eating. Add one real reader note when one exists. | Read what is inside |
| Day 13 | Keep the sampler, or get the whole plan | Twenty meal ideas, the grocery map, the family plates, and the chapter for when hunger returns. No fake deadline. | Get When Nothing Sounds Good for $19 |

### After they buy

| When | Subject | What to say | Button |
| --- | --- | --- | --- |
| Right away | Your guide is ready | Download link, how to get a receipt, and which page to open for today. | Download the guide |
| Day 2 | Start with one plate, not the whole plan | Ask them to cook one formula and reply with what they made. | Choose tonight's plate |
| Day 5 | Want Henry's help with what is already in your kitchen? | Introduce Sous and Protein Flip™ Kitchen as ongoing help. Mention the founding price only while it is real. | Explore Protein Flip™ Kitchen |
| Day 10 | The complete method behind the guide | The Deluxe Edition is the system for ordinary weeks. This guide is the plan for hard days. | See the Deluxe Edition |
| Day 21 | What should Henry make next? | One question: breakfast, portable lunch, family dinner, or snack plate. Ask for a review only after that. | Share what you need |

### If they start checkout and do not pay

Send these only after checkout is built so the site has their email and a real link back. No discount in the first test.

| When | Subject | What to say | Button |
| --- | --- | --- | --- |
| 1 hour | Still deciding what sounds good? | Remind them what is included and send them back to the same checkout. | Return to checkout |
| 24 hours | A look inside the guide | One real page from the guide, plus the note that this is cooking help, not medical advice. | See inside |
| 72 hours | Keep the free meal map | Last note. Offer the free sample if they do not already have it. | Get the free sampler |

### When a sequence stops

| If this happens | Stop | Continue |
| --- | --- | --- |
| They buy the guide | The sample sales emails and the checkout reminders | The buyer emails |
| They join a membership | Membership pitches | Member onboarding and useful notes |
| They unsubscribe | All marketing | The download email only, if they bought |
| The email bounces or they mark it as spam | All mail | Nothing until a person looks at it |
| No opens for 90 days | The weekly recipe note | One "still want these?" email, then stop |

## How to know it is working

Check these once a week:

- ad spend
- confirmed new subscribers, by source
- cost per subscriber
- guide orders and revenue
- cost to acquire one buyer
- share of sampler readers who buy within 14 days
- checkout starts, finished checkouts, and money recovered from reminders
- how often the checkout add-on is taken
- share of buyers who join Kitchen within 30 days

Clicks and impressions are not the decision.

## Build order

1. **Measure.** Record where each subscriber came from, whether they bought, and when they agreed to email. A test signup and a test purchase should each show up once.
2. **Make the offer.** Sample PDF, $19 guide, product page, checkout, thank-you page. Buy it on a phone and confirm the download arrives.
3. **Turn on the main emails.** Sample sequence and buyer sequence. A buyer must leave the sales sequence.
4. **Add checkout recovery.** The site creates the checkout, stores a return link, and sends the three reminders. A test abandon sends one set of emails, not two.
5. **Launch the ads.** Two Meta videos, one still image, one Google search ad. Spend and sales should match the next morning.
6. **Add the extra offers.** One checkout add-on, one note on the thank-you page, and the matching popup. Keep them only if they add revenue without hurting the main sale.

Before any ad dollar: one real test on a phone, from the ad link to signup, email, purchase, download, unsubscribe, and refund.
