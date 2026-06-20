export interface Cookbook {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
  buyUrl: string;
  badge?: string;
  formats?: { name: string; price: string; buyUrl: string }[];
}

export const flagship: Cookbook = {
  slug: "protein-flip-deluxe",
  title: "The Protein Flip™ Method and Cookbook, Deluxe Edition",
  tagline: "The complete system. Start here.",
  description:
    "You don't have to give up meat. You don't need to count every gram. This is the full Protein Flip™ framework: redistribute your plate to keep the flavors you love while prioritizing satiety and blood sugar stability.",
  price: "$27.99",
  image: "/images/cookbook-cover.jpg",
  buyUrl: "https://buy.stripe.com/aFa6oI2JB4Ar3t0dIt4Vy00",
  badge: "Bestseller",
  formats: [
    {
      name: "Digital PDF",
      price: "$27.99",
      buyUrl: "https://buy.stripe.com/aFa6oI2JB4Ar3t0dIt4Vy00",
    },
    {
      name: "Signed Softcover",
      price: "$34.99",
      buyUrl: "https://buy.stripe.com/bJe5kE2JB1ofe7E8o94Vy01",
    },
  ],
};

export const cookbooks: Cookbook[] = [
  {
    slug: "glp-1-bariatric-success-guide",
    title: "GLP-1 & Bariatric Success Guide",
    tagline: "Protein Flip™ Edition",
    description:
      "A chef's playbook for eating well on Tirzepatide, Ozempic, Wegovy, Zepbound, or Mounjaro: protein targets that fit a smaller appetite, meal frameworks for low-hunger days, and food that still tastes like food.",
    price: "$13.99",
    image: "/images/books/glp1-guide.png",
    buyUrl: "https://buy.stripe.com/14A6oI83VaYPbZw33P4Vy02",
    badge: "New",
  },
  {
    slug: "spring-summer-cookbook",
    title: "Fresh & Fearless: Spring/Summer",
    tagline: "Seasonal cooking, lighter and brighter",
    description:
      "The recipes Henry returns to in warmer months: meals that feel lighter, fresher, and more energizing without sacrificing satisfaction or flavor.",
    price: "$13.99",
    image: "/images/books/spring-summer.png",
    buyUrl: "https://buy.stripe.com/dRmbJ22JB2sj8NkgUF4Vy03",
  },
  {
    slug: "confident-cook-fall-winter",
    title: "The Confident Cook: Fall/Winter",
    tagline: "Cozy & nourishing cold-weather meals",
    description:
      "Warm, nourishing meals built around protein, plants, and deep flavor, designed to keep you satisfied and grounded when the days get shorter, without heaviness.",
    price: "$13.99",
    image: "/images/books/confident-cook.png",
    buyUrl: "https://buy.stripe.com/bJeaEYckb8QH6Fc5bX4Vy04",
  },
  {
    slug: "family-flip",
    title: "The Family Flip™",
    tagline: "A Protein Flip™ companion for parents",
    description:
      "The method Henry used with his own daughter, written out for parents: how small moments in the kitchen turn into lifelong healthy habits, no nutrition lectures required.",
    price: "$8.99",
    image: "/images/books/family-flip.png",
    buyUrl: "https://buy.stripe.com/cNi7sM3NFeb1e7E47T4Vy05",
  },
  {
    slug: "dining-out-guide",
    title: "The Protein Flip™ Dining Out Guide",
    tagline: "Read any menu in thirty seconds",
    description:
      "Smart orders for the cuisines you eat most: Italian, Mexican, Japanese, Thai, steakhouses, brunch, fast casual. No restriction, no shame, just better defaults built for real life.",
    price: "$8.99",
    image: "/images/books/dining-out.jpg",
    buyUrl: "https://buy.stripe.com/bJe7sM97Zc2T3t0bAl4Vy06",
  },
  {
    slug: "protein-flip-starter-guide",
    title: "The Protein Flip™ Starter Guide",
    tagline: "Your first steps to a balanced plate",
    description:
      "New to the Protein Flip™? Start here. A short, no-pressure introduction to building balanced plates one meal at a time, with the core ideas and a few easy wins to get going.",
    price: "$8.99",
    image: "/images/books/starter-guide.png",
    buyUrl: "https://buy.stripe.com/00w5kEfwneb1e7E0VH4Vy07",
  },
  {
    slug: "grocery-store-test",
    title: "The Protein Flip™ Grocery Store Test",
    tagline: "Shop smart in any aisle",
    description:
      "A quick field guide to filling your cart the Protein Flip™ way: what to reach for, what to skip, and how to read a label in seconds so good choices start before you cook.",
    price: "$8.99",
    image: "/images/books/grocery-store-test.png",
    buyUrl: "https://buy.stripe.com/7sY5kEfwn4Ar2oW47T4Vy08",
  },
];
