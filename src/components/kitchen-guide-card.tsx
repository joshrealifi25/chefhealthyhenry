import Link from "next/link";
import Image from "next/image";
import type { KitchenGuide } from "@/lib/kitchen-guides";

export function KitchenGuideCard({ guide }: { guide: KitchenGuide }) {
  return (
    <Link href={`/kitchen/${guide.slug}`} className="group block">
      {guide.hero && (
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          <Image
            src={guide.hero}
            alt={guide.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Kitchen Guide
      </p>
      <h2 className="mt-2 font-heading text-xl font-semibold leading-snug tracking-tight group-hover:text-primary">
        {guide.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {guide.excerpt}
      </p>
    </Link>
  );
}
