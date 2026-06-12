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
  buyUrl: "https://chefhealthyhenry.com/product/protein-flip-deluxe-pdf",
  badge: "Bestseller",
  formats: [
    {
      name: "Digital PDF",
      price: "$27.99",
      buyUrl: "https://chefhealthyhenry.com/product/protein-flip-deluxe-pdf",
    },
    {
      name: "Signed Softcover",
      price: "$34.99",
      buyUrl:
        "https://chefhealthyhenry.com/product/protein-flip-deluxe-edition-signed-softcopy",
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
    buyUrl:
      "https://chefhealthyhenry.com/product/glp-1-bariatric-success-guide-protein-flip-tm-edition",
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
    buyUrl: "https://chefhealthyhenry.com/product/2025-spring-cookbook",
  },
  {
    slug: "confident-cook-fall-winter",
    title: "The Confident Cook: Fall/Winter",
    tagline: "Cozy & nourishing cold-weather meals",
    description:
      "Warm, nourishing meals built around protein, plants, and deep flavor, designed to keep you satisfied and grounded when the days get shorter, without heaviness.",
    price: "$13.99",
    image: "/images/books/confident-cook.png",
    buyUrl:
      "https://chefhealthyhenry.com/product/confident-cooking-the-simple-start-guide",
  },
  {
    slug: "family-flip",
    title: "The Family Flip™",
    tagline: "A Protein Flip™ companion for parents",
    description:
      "The method Henry used with his own daughter, written out for parents: how small moments in the kitchen turn into lifelong healthy habits, no nutrition lectures required.",
    price: "$8.99",
    image: "/images/books/family-flip.png",
    buyUrl:
      "https://chefhealthyhenry.com/product/the-family-flip-tm-a-protein-flip-tm-companion",
  },
  {
    slug: "dining-out-guide",
    title: "The Protein Flip™ Dining Out Guide",
    tagline: "Read any menu in thirty seconds",
    description:
      "Smart orders for the cuisines you eat most: Italian, Mexican, Japanese, Thai, steakhouses, brunch, fast casual. No restriction, no shame, just better defaults built for real life.",
    price: "$8.99",
    image: "/images/books/dining-out.jpg",
    buyUrl:
      "https://chefhealthyhenry.com/product/the-protein-flip-tm-dining-out-guide",
  },
];
