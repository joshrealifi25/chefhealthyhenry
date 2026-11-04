# When Nothing Sounds Good sequences

Reading copies of the mail in `src/lib/email-sequences.ts`. The HTML
files are generated from that module. Edit the module, then render
again. Sending these files by hand as broadcasts will not keep a buyer
out of the sales sequence.

Sender: Chef Healthy Henry <henry@chefhealthyhenry.com>.
Every file has an unsubscribe link.

Nothing here has been sent. Resend scheduling, contact properties, and
the henry@ address were not exercised in production.

## Who calls what

`startSampleSequence` after a sampler signup. The first message is the
sampler itself. Pass a stable `signupId` (the email is safe) so a retry
does not send the set twice.

`startBuyerSequence({ email, name, sessionId, downloadUrl })` after
`checkout.session.completed`, and only after the download email has
already been sent. It stops the sample sales notes and any checkout
reminders, then schedules day 2, day 5, day 10, and day 21. It does not
send a second download email. `sessionId` is the idempotency key.

`startCheckoutRecovery({ email, name, sessionId, checkoutUrl })` from
`checkout.session.expired` when the session has an email. `checkoutUrl`
is a fresh site checkout path. `sessionId` is the idempotency key.

## Sample sequence

| File | When | Subject |
| --- | --- | --- |
| sample-d0.html | Right away | Your small-appetite meal map |
| sample-d1.html | Day 1 | When a full plate feels like too much |
| sample-d3.html | Day 3 | The family does not need a second dinner |
| sample-d5.html | Day 5 | Protein without another shake |
| sample-d7.html | Day 7 | What to keep in the fridge for low-hunger days |
| sample-d9.html | Day 9 | What happens when hunger comes back |
| sample-d11.html | Day 11 | A chef's answer to "nothing sounds good" |
| sample-d13.html | Day 13 | Keep the sampler, or get the whole plan |

## Buyer sequence

The download note, subject "Your guide is ready", is the checkout
agent's delivery email. It is not in this folder.

| File | When | Subject |
| --- | --- | --- |
| buyer-d2.html | Day 2 | Start with one plate, not the whole plan |
| buyer-d5.html | Day 5 | Want Henry's help with what is already in your kitchen? |
| buyer-d5-founding.html | Day 5, only if the founding flag is on | Same subject, quotes the $10 founding price |
| buyer-d10.html | Day 10 | The complete method behind the guide |
| buyer-d21.html | Day 21 | What should Henry make next? |

`MENTION_FOUNDING_PRICE` in `src/lib/email-sequences.ts` is false.
buyer-d5-founding.html is the alternate, not the message that sends.

## Checkout recovery

Stripe expires an unpaid session about 24 hours after it starts. This
module only hears about the abandon at that moment, so it cannot send
a reminder 1 hour after checkout starts.

`CHECKOUT_RECOVERY_SCHEDULE` is the only clock. Delays are measured
from the expiry call. The 1-hour note is written (`recovery-1h.html`)
and is not in the schedule.

Default until Henry picks a clock: treat the expiry call as the
24-hour mark. "A look inside the guide" sends on that call. "Keep the
free meal map" sends 48 hours later, about 72 hours after checkout
started.

| File | Schedule step | Subject |
| --- | --- | --- |
| recovery-1h.html | Not scheduled | Still deciding what sounds good? |
| recovery-24h.html | look-inside | A look inside the guide |
| recovery-72h.html | keep-free-map, no sampler yet | Keep the free meal map |
| recovery-72h-has-sampler.html | keep-free-map, already has the sampler | Keep the free meal map |

No discount in any of these.

## When a sequence stops

| What happened | What the module does |
| --- | --- |
| They buy the guide | Cancels sample notes and checkout reminders, then starts buyer notes |
| They unsubscribe | Cancels sample, recovery, and buyer notes, and marks the Resend contact unsubscribed |
| They join a membership | `stopMembershipPitches` cancels the day 5 Kitchen note. Nothing calls it yet |

A second call with the same signup or session id does not send a second set.

Scheduled ids are stored on the Resend contact (`wnsg_sample_ids`,
`wnsg_recovery_ids`, `wnsg_buyer_ids`). The module creates those contact
properties on the first send. If the API key cannot create properties,
cancellation cannot find the scheduled mail.

`WNSG_LANDING_PATH` is `/when-nothing-sounds-good`. "See inside" and
"Get the free sampler" use it. Change it if the landing page slug differs.
