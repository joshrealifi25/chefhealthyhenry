import { escapeHtml } from "@/lib/notify";

/**
 * Reading copy for the When Nothing Sounds Good sequences.
 * Subjects and button labels are the ones in the launch plan.
 * This file does not send mail.
 */

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Public image of one real guide page. Empty until that page exists. */
export const GUIDE_PREVIEW_IMAGE_URL = "";

/**
 * First page a buyer is pointed at. The plan says "which page to open
 * for today" and does not name it. Section 1 is the start of the guide.
 */
export const GUIDE_FIRST_PAGE = "section 1, Start where appetite is";

/**
 * A real reader note for the day 11 sample email. Leave empty until
 * Henry has one. Do not invent a quote.
 */
export const READER_NOTE = "";

export interface SequenceMessage {
  step: string;
  subject: string;
  /** Wait after the sequence starts. Recovery delays are applied by the sender. */
  delayMs: number;
  /** Kitchen pitch. stopMembershipPitches cancels this step only. */
  membershipPitch?: boolean;
  html: string;
  text: string;
}

export type RecoveryStep = "one-hour" | "look-inside" | "keep-free-map";

interface BuildInput {
  step: string;
  subject: string;
  delayMs: number;
  heading: string;
  paragraphs: string[];
  list?: string[];
  closing?: string[];
  buttonLabel: string;
  buttonUrl: string;
  unsubscribeUrl: string;
  reason: string;
  greeting: string | null;
  membershipPitch?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

function escAttr(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function greetingName(name: string | null | undefined): string | null {
  if (!name) return null;
  const first = name.trim().split(/\s+/)[0] ?? "";
  if (!first || first.length > 40 || first.includes("@")) return null;
  return first;
}

export function greetingFrom(name: string | null | undefined): string | null {
  return greetingName(name);
}

function build(input: BuildInput): SequenceMessage {
  const blocks: string[] = [];
  const textBlocks: string[] = [];

  if (input.greeting) {
    const hello = `Hello ${input.greeting},`;
    blocks.push(`<p style="margin:0 0 16px;">${escapeHtml(hello)}</p>`);
    textBlocks.push(hello);
  }

  for (const paragraph of input.paragraphs) {
    blocks.push(`<p style="margin:0 0 16px;">${escapeHtml(paragraph)}</p>`);
    textBlocks.push(paragraph);
  }

  if (input.list && input.list.length > 0) {
    const items = input.list
      .map(
        (item) =>
          `<p style="margin:0 0 8px;">&#8226; ${escapeHtml(item)}</p>`,
      )
      .join("");
    blocks.push(`<div style="margin:0 0 16px;">${items}</div>`);
    for (const item of input.list) textBlocks.push(`- ${item}`);
  }

  for (const paragraph of input.closing ?? []) {
    blocks.push(`<p style="margin:0 0 16px;">${escapeHtml(paragraph)}</p>`);
    textBlocks.push(paragraph);
  }

  if (input.imageUrl) {
    blocks.push(
      `<p style="margin:0 0 16px;"><img src="${escAttr(input.imageUrl)}" alt="${escAttr(input.imageAlt ?? "A page from the guide")}" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:12px;"></p>`,
    );
  }

  const preheader = input.paragraphs[0] ?? input.heading;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(input.subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f1e7;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e7;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
  <tr><td align="center" style="padding:32px 40px 0;">
    <a href="https://chefhealthyhenry.com"><img src="https://chefhealthyhenry.com/images/logo.png" alt="Healthy Henry logo" width="72" style="display:block;border:0;"></a>
    <div style="padding-top:10px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:3px;color:#4f6b54;">CHEF HEALTHY HENRY</div>
  </td></tr>
  <tr><td style="padding:24px 40px 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:#34433a;">
    ${escapeHtml(input.heading)}
  </td></tr>
  <tr><td style="padding:8px 40px 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#4a564c;">
    ${blocks.join("\n    ")}
  </td></tr>
  <tr><td align="center" style="padding:8px 40px 8px;">
    <a href="${escAttr(input.buttonUrl)}" style="display:inline-block;background:#4f6b54;color:#ffffff;text-decoration:none;padding:13px 30px;border-radius:9999px;font-family:Helvetica,Arial,sans-serif;font-size:15px;">${escapeHtml(input.buttonLabel)}</a>
  </td></tr>
  <tr><td style="padding:12px 40px 28px;">
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td width="68"><img src="https://chefhealthyhenry.com/images/email/henry-face.jpg" alt="Chef Henry" width="56" height="56" style="display:block;border:0;border-radius:50%;"></td>
        <td style="padding-left:14px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#4a564c;vertical-align:middle;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;color:#4a564c;">Talk soon,</span><br>
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#34433a;">Henry</span><br>
          <span style="font-size:13px;color:#8a938b;">Chef and creator of the Protein Flip&#8482;</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="padding:20px 40px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a938b;text-align:center;">
    Chef Healthy Henry LLC · <a href="https://chefhealthyhenry.com" style="color:#8a938b;">chefhealthyhenry.com</a><br>
    ${escapeHtml(input.reason)}
    <a href="${escAttr(input.unsubscribeUrl)}" style="color:#8a938b;">Unsubscribe</a>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    input.heading,
    "",
    ...textBlocks,
    "",
    `${input.buttonLabel}: ${input.buttonUrl}`,
    "",
    "Talk soon,",
    "Henry",
    "Chef and creator of the Protein Flip™",
    "",
    input.reason,
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return {
    step: input.step,
    subject: input.subject,
    delayMs: input.delayMs,
    membershipPitch: input.membershipPitch,
    html,
    text,
  };
}

interface SampleInput {
  name: string | null;
  samplerUrl: string;
  guideUrl: string;
  unsubscribeUrl: string;
}

interface BuyerInput {
  name: string | null;
  downloadUrl: string;
  membershipUrl: string;
  deluxeUrl: string;
  replyUrl: string;
  unsubscribeUrl: string;
  mentionFoundingPrice: boolean;
}

interface RecoveryInput {
  name: string | null;
  checkoutUrl: string;
  insideUrl: string;
  samplerUrl: string;
  unsubscribeUrl: string;
  hasSampler: boolean;
  previewImageUrl: string;
}

const SAMPLE_REASON =
  "You are receiving this because you asked for the free small-appetite meal map. ";
const BUYER_REASON =
  "You are receiving this because you bought When Nothing Sounds Good. ";
const RECOVERY_REASON =
  "You are receiving this because you started checkout for When Nothing Sounds Good. ";

export function renderSampleSequence(input: SampleInput): SequenceMessage[] {
  const greeting = greetingName(input.name);
  const shared = {
    greeting,
    unsubscribeUrl: input.unsubscribeUrl,
    reason: SAMPLE_REASON,
  };
  const readerNote = READER_NOTE.trim();
  const day11 = [
    "People ask me what to cook when nothing sounds good. I do not start by cutting foods out.",
    "I start with flavor. Nothing is forbidden. Nutrition gets added around food that is worth eating. A few bites of something you can imagine eating will beat a perfect plate you cannot face.",
    "That is the idea inside When Nothing Sounds Good: Protein Flip™ meals for a small appetite. Real food, small plates, and no calorie math.",
  ];
  if (readerNote) day11.push(readerNote);

  return [
    build({
      ...shared,
      step: "sample-d0",
      subject: "Your small-appetite meal map",
      delayMs: 0,
      heading: "Your meal map is ready.",
      paragraphs: [
        "Here is 3 Meals for When Nothing Sounds Good. It is a short sample: one cold breakfast, one five-minute savory plate, one family dinner served two ways, and a seven-item refrigerator list.",
        "Open it when you have a quiet minute. Then tell me what is hardest right now: breakfast, dinner, or getting enough protein. Reply with one of those.",
      ],
      buttonLabel: "Open the sampler",
      buttonUrl: input.samplerUrl,
    }),
    build({
      ...shared,
      step: "sample-d1",
      subject: "When a full plate feels like too much",
      delayMs: DAY_MS,
      heading: "A full plate is not the goal.",
      paragraphs: [
        "Eating well does not have to mean finishing a large plate.",
        "The small-plate formula has three parts. One easy protein. One plant. One flavor anchor, such as herbs or a bright sauce.",
        "Build one plate that way. Small is the plan.",
      ],
      buttonLabel: "Try the small-plate formula",
      buttonUrl: input.samplerUrl,
    }),
    build({
      ...shared,
      step: "sample-d3",
      subject: "The family does not need a second dinner",
      delayMs: 3 * DAY_MS,
      heading: "One base meal, two plates.",
      paragraphs: [
        "A small appetite should not mean cooking a second dinner.",
        "Cook one base meal. Plate a small soft portion for the person who wants a few bites, and a full bowl for everyone else. Same pan.",
        "The sampler includes one family dinner served two ways. Start there.",
      ],
      buttonLabel: "See the two-way dinner",
      buttonUrl: input.samplerUrl,
    }),
    build({
      ...shared,
      step: "sample-d5",
      subject: "Protein without another shake",
      delayMs: 5 * DAY_MS,
      heading: "Five savory ideas.",
      paragraphs: [
        "Protein does not have to mean another shake. Here are five food-first ideas for a day when nothing sounds good. No gram targets. This is cooking help, not medical advice.",
      ],
      list: [
        "Warm and soft: eggs with herbs.",
        "Beans, warm or cold, with a bright sauce.",
        "Five minutes: one easy protein, one plant, one flavor anchor.",
        "Something mild and soft, when a bright flavor does not appeal.",
        "Something crisp beside a soft bite, so a few bites are enough.",
      ],
      closing: ["Pick one and leave the rest."],
      buttonLabel: "Get the five ideas",
      buttonUrl: input.samplerUrl,
    }),
    build({
      ...shared,
      step: "sample-d7",
      subject: "What to keep in the fridge for low-hunger days",
      delayMs: 7 * DAY_MS,
      heading: "A short list, then one plate.",
      paragraphs: [
        "The sampler has a seven-item refrigerator list. Those foods are there so a low-hunger day does not start with a long decision.",
        "One assembly meal from that list: one easy protein, one plant, one flavor anchor. Put them on a small plate. Stop when you have had enough.",
        "The guide has the fuller grocery map: refrigerator, freezer, pantry, and a convenience store list. When Nothing Sounds Good is $19.",
      ],
      buttonLabel: "See the complete guide",
      buttonUrl: input.guideUrl,
    }),
    build({
      ...shared,
      step: "sample-d9",
      subject: "What happens when hunger comes back",
      delayMs: 9 * DAY_MS,
      heading: "You are not starting over.",
      paragraphs: [
        "Hunger comes back. The same plate still works: one easy protein, one plant, one flavor anchor.",
        "On a small day the plate is a few bites. On a normal day it is a full meal. The method does not change.",
        "The guide has a chapter for this, When hunger returns. It is the same method at a normal portion.",
      ],
      buttonLabel: "Build a method that lasts",
      buttonUrl: input.guideUrl,
    }),
    build({
      ...shared,
      step: "sample-d11",
      subject: 'A chef\'s answer to "nothing sounds good"',
      delayMs: 11 * DAY_MS,
      heading: "Flavor first.",
      paragraphs: day11,
      buttonLabel: "Read what is inside",
      buttonUrl: input.guideUrl,
    }),
    build({
      ...shared,
      step: "sample-d13",
      subject: "Keep the sampler, or get the whole plan",
      delayMs: 13 * DAY_MS,
      heading: "The sampler is yours either way.",
      paragraphs: [
        "Keep the sampler. If you want the whole plan, When Nothing Sounds Good is $19.",
      ],
      list: [
        "Twenty meal ideas, from breakfast to family dinners",
        "The grocery map",
        "Family plates: one dinner, two appetites",
        "The chapter for when hunger returns",
      ],
      buttonLabel: "Get When Nothing Sounds Good for $19",
      buttonUrl: input.guideUrl,
    }),
  ];
}

export function renderBuyerSequence(input: BuyerInput): SequenceMessage[] {
  const greeting = greetingName(input.name);
  const shared = {
    greeting,
    unsubscribeUrl: input.unsubscribeUrl,
    reason: BUYER_REASON,
  };
  const kitchen = [
    "Protein Flip™ Kitchen is ongoing help after the guide. Sous is the cooking assistant. You can ask what to do with what is already in the kitchen. A new lesson arrives each month.",
    "The guide is the plan for hard days. Kitchen is the practice for ordinary ones.",
  ];
  if (input.mentionFoundingPrice) {
    kitchen.push(
      "The founding price is $10 a month while it is still available. The regular price is $12 a month.",
    );
  } else {
    kitchen.push("The membership page has the current price.");
  }

  return [
    build({
      ...shared,
      step: "buyer-d2",
      subject: "Start with one plate, not the whole plan",
      delayMs: 2 * DAY_MS,
      heading: "One plate is enough.",
      paragraphs: [
        "Do not try to cook the whole guide this week. Cook one plate.",
        `Open ${GUIDE_FIRST_PAGE}. Then use the small-plate formula: one easy protein, one plant, one flavor anchor.`,
        "The link in your download email works for 7 days if you have not saved the file yet. Reply and tell me what you made.",
      ],
      buttonLabel: "Choose tonight's plate",
      buttonUrl: input.downloadUrl,
    }),
    build({
      ...shared,
      step: "buyer-d5",
      subject: "Want Henry's help with what is already in your kitchen?",
      delayMs: 5 * DAY_MS,
      heading: "Help with the food you already have.",
      paragraphs: kitchen,
      buttonLabel: "Explore Protein Flip™ Kitchen",
      buttonUrl: input.membershipUrl,
      membershipPitch: true,
    }),
    build({
      ...shared,
      step: "buyer-d10",
      subject: "The complete method behind the guide",
      delayMs: 10 * DAY_MS,
      heading: "Hard days and ordinary weeks.",
      paragraphs: [
        "When Nothing Sounds Good is the plan for hard days. The Protein Flip™ Method and Cookbook, Deluxe Edition is the system for ordinary weeks.",
        "The digital Deluxe Edition is $27.99. This guide stays the one you open when a full plate feels like too much.",
      ],
      buttonLabel: "See the Deluxe Edition",
      buttonUrl: input.deluxeUrl,
    }),
    build({
      ...shared,
      step: "buyer-d21",
      subject: "What should Henry make next?",
      delayMs: 21 * DAY_MS,
      heading: "One question.",
      paragraphs: [
        "What should I make next: breakfast, portable lunch, family dinner, or snack plate?",
        "Reply with one of those. If you have cooked from the guide and want to say what worked, add that after you answer. A review can wait until you have used it.",
      ],
      buttonLabel: "Share what you need",
      buttonUrl: input.replyUrl,
    }),
  ];
}

export function renderRecoveryMessage(
  step: RecoveryStep,
  input: RecoveryInput,
): SequenceMessage {
  const greeting = greetingName(input.name);
  const shared = {
    greeting,
    unsubscribeUrl: input.unsubscribeUrl,
    reason: RECOVERY_REASON,
    delayMs: 0,
  };

  if (step === "one-hour") {
    return build({
      ...shared,
      step: "recovery-1h",
      subject: "Still deciding what sounds good?",
      heading: "Your checkout is still open.",
      paragraphs: [
        "You started When Nothing Sounds Good and did not finish.",
        "The guide is about 40 pages: a way to choose food by texture and effort, the small-plate formula, twenty meal ideas, one dinner plated two ways, the low-hunger grocery map, and what to do when hunger returns.",
        "It is $19. This is cooking help, not medical advice.",
      ],
      buttonLabel: "Return to checkout",
      buttonUrl: input.checkoutUrl,
    });
  }

  if (step === "look-inside") {
    return build({
      ...shared,
      step: "recovery-24h",
      subject: "A look inside the guide",
      heading: "The small-plate formula.",
      paragraphs: [
        "One page of the guide is the small-plate formula. One easy protein. One plant. One flavor anchor. The pictures show the size of the plate before you cook.",
        "This is cooking help, not medical advice. It does not say what to do about medication. Talk with your clinician about that.",
      ],
      buttonLabel: "See inside",
      buttonUrl: input.insideUrl,
      imageUrl: input.previewImageUrl || undefined,
      imageAlt: "A page from When Nothing Sounds Good",
    });
  }

  if (input.hasSampler) {
    return build({
      ...shared,
      step: "recovery-72h",
      subject: "Keep the free meal map",
      heading: "The last note about this checkout.",
      paragraphs: [
        "You already have the free meal map. Keep it. The guide is there if you want the whole plan. It is $19.",
      ],
      buttonLabel: "Return to checkout",
      buttonUrl: input.checkoutUrl,
    });
  }

  return build({
    ...shared,
    step: "recovery-72h",
    subject: "Keep the free meal map",
    heading: "The last note about this checkout.",
    paragraphs: [
      "If the guide is not the right next step, keep the free meal map. 3 Meals for When Nothing Sounds Good is a cold breakfast, a five-minute savory plate, a family dinner served two ways, and a seven-item refrigerator list.",
    ],
    buttonLabel: "Get the free sampler",
    buttonUrl: input.samplerUrl,
  });
}
