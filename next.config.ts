import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // 301 redirects from the old Webflow URL structure to the new site.
  // /about, /contact, and /post/[slug] keep identical paths and need no
  // redirect. Order matters: specific rules precede catch-alls.
  async redirects() {
    return [
      // Recipes whose Webflow slugs carried a random import suffix
      // (e.g. -ef6c3) that was cleaned up in the new site. Google still has
      // the old suffixed URLs indexed with real search traffic, so these
      // preserve that ranking/click history instead of 404ing.
      { source: "/recipes/mediterranean-herb-crusted-tilapia-ef6c3", destination: "/recipes/mediterranean-herb-crusted-tilapia", statusCode: 301 },
      { source: "/recipes/savory-corn-and-mushroom-saute-with-pancetta-zc2pw", destination: "/recipes/savory-corn-and-mushroom-saute-with-pancetta", statusCode: 301 },
      { source: "/recipes/mediterranean-baked-tilapia-with-cherry-tomatoes-and-capers-c8dqa", destination: "/recipes/mediterranean-baked-tilapia-with-cherry-tomatoes-and-capers", statusCode: 301 },
      { source: "/recipes/healthy-homemade-nutella-recipe-qxyt3", destination: "/recipes/healthy-homemade-nutella-recipe", statusCode: 301 },
      { source: "/recipes/gourmet-mushroom-medley-with-spinach-and-bean-puree-49ppv", destination: "/recipes/gourmet-mushroom-medley-with-spinach-and-bean-puree", statusCode: 301 },
      { source: "/recipes/savory-vegetable-clafoutis-with-french-herb-beans-9in2f", destination: "/recipes/savory-vegetable-clafoutis-with-french-herb-beans", statusCode: 301 },
      { source: "/recipes/healthy-matcha-moringa-almond-butter-cookies-a12ii", destination: "/recipes/healthy-matcha-moringa-almond-butter-cookies", statusCode: 301 },
      { source: "/recipes/pork-tenderloin-with-chickpeas-qpgf3", destination: "/recipes/pork-tenderloin-with-chickpeas", statusCode: 301 },
      { source: "/recipes/mediterranean-branzino-with-zucchini-and-tomatoes-32we6", destination: "/recipes/mediterranean-branzino-with-zucchini-and-tomatoes", statusCode: 301 },
      { source: "/recipes/crispy-air-fryer-tilapia-with-brussels-sprouts-n6tk6", destination: "/recipes/crispy-air-fryer-tilapia-with-brussels-sprouts", statusCode: 301 },
      { source: "/recipes/mediterranean-salmon-and-lentil-salad-r8wfz", destination: "/recipes/mediterranean-salmon-and-lentil-salad", statusCode: 301 },
      { source: "/recipes/hearty-veggie-burger-with-sweet-potato-and-tofu-294n5", destination: "/recipes/hearty-veggie-burger-with-sweet-potato-and-tofu", statusCode: 301 },
      { source: "/recipes/healthy-french-carrot-salad-with-chickpeas-1mahm", destination: "/recipes/healthy-french-carrot-salad-with-chickpeas", statusCode: 301 },
      { source: "/recipes/roasted-cauliflower-and-crispy-harissa-chickpeas-fx2ch", destination: "/recipes/roasted-cauliflower-and-crispy-harissa-chickpeas", statusCode: 301 },
      { source: "/recipes/citrus-supreme-tutorial-perfect-orange-segments-for-salads-desserts-qk7rj", destination: "/recipes/citrus-supreme-tutorial-perfect-orange-segments-for-salads-desserts", statusCode: 301 },
      { source: "/recipes/lotus-root-stir-fry-with-carrots-and-snow-peas-9mtw6", destination: "/recipes/lotus-root-stir-fry-with-carrots-and-snow-peas", statusCode: 301 },
      { source: "/recipes/roasted-stuffed-squash-blossoms-gor8c", destination: "/recipes/roasted-stuffed-squash-blossoms", statusCode: 301 },
      { source: "/recipes/healthy-baked-peaches-recipe-fn3h5", destination: "/recipes/healthy-baked-peaches-recipe", statusCode: 301 },
      { source: "/recipes/sheet-pan-fish-tacos-with-creamy-avocado-sauce-807no", destination: "/recipes/sheet-pan-fish-tacos-with-creamy-avocado-sauce", statusCode: 301 },
      { source: "/recipes/lemongrass-salmon-fish-cakes-a2n0s", destination: "/recipes/lemongrass-salmon-fish-cakes", statusCode: 301 },
      { source: "/recipes/protein-flip-blueberry-peach-quinoa-bake-8tt2y", destination: "/recipes/protein-flip-blueberry-peach-quinoa-bake", statusCode: 301 },
      { source: "/recipes/grilled-peach-salad-with-marinated-chicken-blakc-rice-75hzb", destination: "/recipes/grilled-peach-salad-with-marinated-chicken-blakc-rice", statusCode: 301 },
      { source: "/recipes/roasted-branzino-with-greek-ladolemono-n6g8y", destination: "/recipes/roasted-branzino-with-greek-ladolemono", statusCode: 301 },
      { source: "/recipes/grilled-branzino-with-tomato-salad-h95sx", destination: "/recipes/grilled-branzino-with-tomato-salad", statusCode: 301 },
      { source: "/recipes/healthy-asian-salad-with-gochujang-dressing-and-black-rice-j119r", destination: "/recipes/healthy-asian-salad-with-gochujang-dressing-and-black-rice", statusCode: 301 },
      { source: "/recipes/roasted-beet-carrot-salad-92j3p", destination: "/recipes/roasted-beet-carrot-salad", statusCode: 301 },
      { source: "/recipes/mediterranean-sweet-potato-salad-with-basil-and-pine-nuts-xmw03", destination: "/recipes/mediterranean-sweet-potato-salad-with-basil-and-pine-nuts", statusCode: 301 },
      { source: "/recipes/salmon-salad-with-crispy-white-beans-xg482", destination: "/recipes/salmon-salad-with-crispy-white-beans", statusCode: 301 },
      { source: "/recipes/mediterranean-lentil-bowl-with-zesty-sun-dried-tomato-dressing-qrx0p", destination: "/recipes/mediterranean-lentil-bowl-with-zesty-sun-dried-tomato-dressing", statusCode: 301 },
      { source: "/recipes/chicken-fajita-bowl-quick-and-flavorful-dinner-idea-3l291", destination: "/recipes/chicken-fajita-bowl-quick-and-flavorful-dinner-idea", statusCode: 301 },
      { source: "/recipes/tuna-chickpea-salad-ux9zw", destination: "/recipes/tuna-chickpea-salad", statusCode: 301 },
      { source: "/recipes/air-fryer-tempura-artichokes-lemon-dill-dressing-v7bwm", destination: "/recipes/air-fryer-tempura-artichokes-lemon-dill-dressing", statusCode: 301 },
      { source: "/recipes/healthy-summer-plate-tofu-veggies-pesto-unjury-flavorless-protein-kal9i", destination: "/recipes/healthy-summer-plate-tofu-veggies-pesto-unjury-flavorless-protein", statusCode: 301 },
      { source: "/recipes/arugula-and-persimmon-salad-lp523", destination: "/recipes/arugula-and-persimmon-salad", statusCode: 301 },
      { source: "/recipes/marry-me-chickpea-soup-with-kale-zptq5", destination: "/recipes/marry-me-chickpea-soup-with-kale", statusCode: 301 },
      { source: "/recipes/roasted-chestnut-and-arugula-salad-x0dca", destination: "/recipes/roasted-chestnut-and-arugula-salad", statusCode: 301 },
      { source: "/recipes/baked-halibut-with-brussel-sprouts-and-quinoa-wg3pq", destination: "/recipes/baked-halibut-with-brussel-sprouts-and-quinoa", statusCode: 301 },
      { source: "/recipes/quick-and-healthy-tuna-quinoa-bowl-vcbt9", destination: "/recipes/quick-and-healthy-tuna-quinoa-bowl", statusCode: 301 },
      { source: "/recipes/crispy-air-fry-falafel-with-fresh-herbs-k3lfh", destination: "/recipes/crispy-air-fry-falafel-with-fresh-herbs", statusCode: 301 },
      { source: "/recipes/fish-and-long-bean-stir-fry-x3qqa", destination: "/recipes/fish-and-long-bean-stir-fry", statusCode: 301 },
      { source: "/recipes/halibut-in-corn-husks-with-fresh-vegetable-saute-7smvk", destination: "/recipes/halibut-in-corn-husks-with-fresh-vegetable-saute", statusCode: 301 },
      { source: "/recipes/korean-inspired-gochujang-glazed-salmon-with-garlic-spinach-5ay5k", destination: "/recipes/korean-inspired-gochujang-glazed-salmon-with-garlic-spinach", statusCode: 301 },
      { source: "/recipes/the-secret-to-easy-to-peel-hard-boiled-eggs-vs1fq", destination: "/recipes/the-secret-to-easy-to-peel-hard-boiled-eggs", statusCode: 301 },
      { source: "/recipes/asian-inspired-ginger-soy-cod-high-protein-delicious-fy73o", destination: "/recipes/asian-inspired-ginger-soy-cod-high-protein-delicious", statusCode: 301 },
      { source: "/recipes/artichokes-with-saffron-tofu-sauce-and-olive-tapenade-tk755", destination: "/recipes/artichokes-with-saffron-tofu-sauce-and-olive-tapenade", statusCode: 301 },
      { source: "/recipes/matcha-moringa-pesto-mushroom-zoodles-healthy-flavorful-pasta-wy79z", destination: "/recipes/matcha-moringa-pesto-mushroom-zoodles-healthy-flavorful-pasta", statusCode: 301 },
      { source: "/recipes/salsa-verde-molcajete-ep09y", destination: "/recipes/salsa-verde-molcajete", statusCode: 301 },
      { source: "/recipes/dragon-fruit-salad-zn21m", destination: "/recipes/dragon-fruit-salad", statusCode: 301 },
      { source: "/recipes/traditional-crepes-1zciv", destination: "/recipes/traditional-crepes", statusCode: 301 },
      { source: "/recipes/daal-palak-recipe-ilb6x", destination: "/recipes/daal-palak-recipe", statusCode: 301 },
      { source: "/recipes/refreshing-jicama-citrus-salad-with-perfect-citrus-segments-summer-salad-idea-gbz0q", destination: "/recipes/refreshing-jicama-citrus-salad-with-perfect-citrus-segments-summer-salad-idea", statusCode: 301 },
      { source: "/recipes/authentic-tortilla-soup-with-pasilla-chiles-n5nin", destination: "/recipes/authentic-tortilla-soup-with-pasilla-chiles", statusCode: 301 },
      { source: "/recipes/spicy-grilled-eggplant-fresh-tomatoes-easy-mediterranean-e1y51", destination: "/recipes/spicy-grilled-eggplant-fresh-tomatoes-easy-mediterranean", statusCode: 301 },
      { source: "/recipes/simple-frittata-b9tmo", destination: "/recipes/simple-frittata", statusCode: 301 },
      { source: "/recipes/vegetarian-chili-recipe-with-sweet-potatoes-beans-4ffhu", destination: "/recipes/vegetarian-chili-recipe-with-sweet-potatoes-beans", statusCode: 301 },
      { source: "/recipes/air-fryer-garlic-and-herb-baby-potatoes-4262b", destination: "/recipes/air-fryer-garlic-and-herb-baby-potatoes", statusCode: 301 },
      { source: "/recipes/delicious-tofu-saag-with-garam-masala-and-spinach-42lkj", destination: "/recipes/delicious-tofu-saag-with-garam-masala-and-spinach", statusCode: 301 },
      { source: "/recipes/fresh-pistachio-crusted-chicken-and-barley-salad-r0fqz", destination: "/recipes/fresh-pistachio-crusted-chicken-and-barley-salad", statusCode: 301 },

      // Old product + shop pages -> the single cookbook page
      { source: "/product/:path*", destination: "/cookbook", statusCode: 301 },
      { source: "/category/cookbooks", destination: "/cookbook", statusCode: 301 },
      { source: "/shop-essentials", destination: "/cookbook", statusCode: 301 },

      // Blog category pages -> blog index
      { source: "/blog-categories/:path*", destination: "/blog", statusCode: 301 },

      // Webflow theme/template pages -> closest real page
      { source: "/theme/contact", destination: "/contact", statusCode: 301 },
      { source: "/theme/recipes", destination: "/recipes", statusCode: 301 },
      { source: "/theme/menu", destination: "/recipes", statusCode: 301 },
      { source: "/theme/blog", destination: "/blog", statusCode: 301 },
      { source: "/theme/team", destination: "/about", statusCode: 301 },
      { source: "/theme/services", destination: "/about", statusCode: 301 },
      { source: "/theme/:path*", destination: "/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
