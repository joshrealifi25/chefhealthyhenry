import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // 301 redirects from the old Webflow URL structure to the new site.
  // Recipes, /about, /contact, and /post/[slug] keep identical paths and
  // need no redirect. Order matters: specific rules precede catch-alls.
  async redirects() {
    return [
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
