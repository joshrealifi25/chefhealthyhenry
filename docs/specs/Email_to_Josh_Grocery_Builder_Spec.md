Josh,

Attaching a UX spec for the Grocery Combo Builder. Can you drop it into docs/specs/ in the repo?

Went through the builder from a user perspective and put together 10 improvements. A few notes before you dig in:

Items 3, 7, and 9 are all related to session state and are probably best tackled together.

Item 6 is just background logging with no UI changes, so that one should be lightweight.

Item 10 (ingredient aggregation) needs a quick conversation before you start. The question is how ingredients are currently tagged in the recipe data and what the cleanest way to roll up variations like "chicken," "chicken breast," and "chicken thighs" into a single count would be. Let me know your thinking on that one.

Everything else should be self-explanatory from the spec. Let me know if you have questions.

Henry
