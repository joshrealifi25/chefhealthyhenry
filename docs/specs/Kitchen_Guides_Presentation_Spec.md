# Kitchen Guides: Presentation Spec

**Status: LOCKED**
**For:** Josh, member area build

## The question

How should a Kitchen Guide relate to the Member Application Lesson it came from: its own page linked from the lesson, or just a "save" button inside the lesson? And should it be presented as a card?

## The decision

**Kitchen Guides get their own page, linked from the lesson via a callout card. Card format applies in both places.**

## Why

Kitchen Guides already have their own section in the locked Tier 1 member library structure (Latest, Recipe Applications, Ingredient Applications, Kitchen Skills, Flavor Builders, Protein Flip™ Foundations, Grocery Decisions, Seasonal Applications, **Kitchen Guides**). That means guides are meant to be browsable as their own collection, not just an appendix buried in whichever lesson produced them.

A guide can also outlive or outgrow its originating lesson: it might get referenced from a future lesson too, or get found by a member browsing the library who never read the original lesson. That only works if the guide is a real, independently addressable page.

## Implementation

**1. Guide page.** Each Kitchen Guide lives at its own URL inside the Kitchen Guides section of the member library. Full page, formatted for scanning and printing (that's the whole point of the format, concise, scannable, printable).

**2. Callout card inside the lesson.** Placed near the top of the lesson, or right after the section it summarizes. Not a plain inline text link. Contains: the guide's title, one line describing what it does (e.g., "A quick-reference table you can keep open while you cook"), and a button, "Open the Kitchen Guide" or "Save this reference," linking to the guide's own page.

**3. Listing tile in the Kitchen Guides collection.** Same card treatment when a member is browsing the Kitchen Guides section directly, not reading a specific lesson.

**4. Cross-linking.** A guide should be able to list more than one "related lesson" if a future lesson also draws on it, so the relationship isn't hard-locked to a single parent lesson.

## Reference example

`Tier1_Kitchen_Guide_What_to_Change_What_to_Protect.md`, companion to `Tier1_Lesson_Whats_Flexible_and_Whats_Protected.md`, is the first Kitchen Guide built under this system, useful as the concrete test case for the page/card build.
