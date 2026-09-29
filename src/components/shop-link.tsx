import { AFFILIATE_DISCLOSURE } from "@/lib/shop";

export function ShopLink({ href }: { href: string }) {
  const dest = href.includes("getjustbetter.com") ? " at Just Better" : " on Amazon";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="print:hidden text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    >
      Shop
      <span className="sr-only">{dest} (opens in a new window)</span>
    </a>
  );
}

export function AffiliateNote() {
  return (
    <p className="mt-4 text-xs text-muted-foreground print:hidden">
      Shop links go to Just Better or Amazon. {AFFILIATE_DISCLOSURE}
    </p>
  );
}
