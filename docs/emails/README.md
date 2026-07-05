# Welcome sequence: how to send

These four emails go out via **Resend Broadcasts** (resend.com → Broadcasts
→ New broadcast → paste HTML). Audience: "General". Sender:
`Chef Healthy Henry <henry@chefhealthyhenry.com>`.

Each file has its **subject line and send day in an HTML comment at the
top**. Cadence: Day 0, 2, 4, 6 after signup.

**00-welcome-back.html is special**: a one-off broadcast for the 109
subscribers imported from Henry's old list (July 2026). Send it once,
before they receive anything else; new site signups should NOT get it.
All templates share the site-style branding: logo header, food
photography, and a footer cross-selling the Deluxe Edition plus a
"200+ recipes" thumbnail strip. Images load from chefhealthyhenry.com,
so they must stay deployed at /images/.

Notes
- The `{{{RESEND_UNSUBSCRIBE_URL}}}` token in each footer is replaced by
  Resend automatically. Do not remove it (CAN-SPAM).
- Send a test to yourself first (Broadcast → send test) and check it in
  Gmail before sending to the audience.
- Manual sending means new subscribers only get broadcasts sent after they
  joined. Fine while the list is small; when it grows, we automate the
  sequence with a scheduled route so every subscriber gets all four.
- Editing: keep styles inline, tables for layout (email clients ignore
  modern CSS). House style applies: no em dashes, no exclamation points.
