"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

const partners = [
  { id: 1, name: "Nike", logo: "/nike.png" },
  { id: 2, name: "Adidas", logo: "/adidas.png" },
  { id: 3, name: "Puma", logo: "/puma.png" },
  { id: 4, name: "New Balance", logo: "/newbalance.png" },
  { id: 5, name: "Zara", logo: "/zara.png" },
  { id: 6, name: "Polo", logo: "/polo.png" },
];

export function PartnersList() {
  return (
    <div className="w-full space-y-6 px-5">
      <h2 className="mb-4 text-lg font-semibold">Marcas Parceiras</h2>

      <div
        className="flex gap-6 overflow-x-auto scroll-smooth md:grid md:grid-cols-6 md:gap-8 md:overflow-x-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {partners.map((partner) => (
          <Card
            key={partner.id}
            className="flex min-w-[120px] flex-shrink-0 flex-col items-center justify-center rounded-2xl border p-6 md:min-w-0"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={60}
              height={60}
              className="object-contain"
            />

            <span className="mt-2 w-full text-center text-sm font-medium capitalize">
              {partner.name}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
