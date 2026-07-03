# Chef Healthy Henry: Marketing Plan

Last updated: July 2026. Owner: Josh (growth/tech) + Henry (content/voice).
This document is read by Claude sessions for context. Keep it current when
strategy changes.

## The one-line strategy

Recipes earn the traffic, the free Grocery Store Test earns the email, and
the email list sells the cookbooks. Everything we build should strengthen
one of those three links.

## Business model

| Asset | Role |
|---|---|
| 196+ recipe pages | SEO traffic engine, top of funnel |
| Blog essays (/post) | Authority + GLP-1/satiety search terms |
| Free Grocery Store Test ($8.99 value) | Lead magnet, email capture |
| Email list (Resend "General" audience) | The owned channel, sells everything |
| 9 paid products ($8.99 to $34.99) | Revenue. Flagship: The Protein Flip™ Method and Cookbook, Deluxe Edition |
| YouTube videos | Discovery channel, embedded on recipe pages |

Target customers: home cooks who want to eat healthier without dieting, and
the GLP-1/bariatric audience (high intent, actively spending, underserved
by chef-quality content). Henry's credibility: trained chef, own
transformation, 1.3M monthly reach.

## Funnel (live as of July 2026)

1. Visitor lands on a recipe (SEO, social, YouTube).
2. Captures: hero CTA, post-recipe capture card, footer form, exit-intent
   popup. All offer the free Grocery Store Test.
3. `/api/subscribe` adds them to the Resend audience and delivers the guide.
4. Welcome sequence (docs/emails/) warms them toward the Deluxe Edition.
5. Recipe pages cross-sell the cookbook; Stripe checkout; PDF auto-delivery.

## Priorities (in order)

1. **Welcome sequence live.** Send emails 1 to 4 (docs/emails/) as Resend
   Broadcasts on the cadence below, or automate later with a cron route.
2. **Google Search Console** submitted and reviewed monthly: fix titles on
   pages with impressions but no clicks.
3. **GLP-1 content lane.** 2 to 4 essays per month targeting GLP-1/satiety
   searches ("what to eat on Ozempic when nothing sounds good"), each
   linking the GLP-1 guide. Henry's chef credential is the differentiator.
4. **Bundle**: "The Complete Protein Flip™ Library" around $59 (vs ~$97
   separately) to raise average order value. One Stripe Payment Link.
5. **GLP-1 guide landing page** with testimonial, FAQ, what's inside.
6. **Collection pages** (8 to 12, hand-curated): "High-Protein Dinners Under
   30 Minutes", "GLP-1 Friendly Meals", built from existing recipe tags.
7. **Seasonal rotation**: promote the in-season cookbook (Spring/Summer vs
   Fall/Winter) on the homepage twice a year.

## Explicitly not doing yet

- Paid ads (wait until email conversion is proven; ads into a leaky funnel
  burn money)
- Ad networks/interstitials (kills the clean brand that differentiates us)
- Memberships/subscriptions (revisit when the list is in the thousands)

## Email rules

- Sender: Chef Healthy Henry <henry@chefhealthyhenry.com> (domain verified)
- Every marketing email needs an unsubscribe link. Resend Broadcasts add
  this automatically when sending to the Audience; keep the
  {{{RESEND_UNSUBSCRIBE_URL}}} footer in custom HTML.
- Voice: Henry's. Warm, specific, no hype. House style applies: no em
  dashes, no exclamation points.
- Cadence after the welcome sequence: one recipe email per week. Sell
  softly in most emails, directly about once a month.

## Welcome sequence (docs/emails/)

| # | File | When | Job |
|---|---|---|---|
| 1 | 01-welcome.html | Day 0 (after guide delivery) | Set expectations, one quick win |
| 2 | 02-henrys-story.html | Day 2 | Trust: the transformation story |
| 3 | 03-three-recipes.html | Day 4 | Value: three best recipes |
| 4 | 04-deluxe-offer.html | Day 6 | Pitch the Deluxe Edition |

## Measurement

- Vercel Analytics: traffic, top pages (watch which recipes pull).
- Resend: list growth, open/click rates per broadcast.
- Stripe: revenue per product; watch what the welcome sequence converts.
- Search Console: impressions, clicks, position for recipe + GLP-1 terms.
