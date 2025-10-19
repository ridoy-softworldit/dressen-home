"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { IProduct, ProductData } from "@/types/product";
import { toUIList, type UIProduct } from "@/types/ui";

// 🔒 Props: API shape বা UI shape – দুইটাই সাপোর্ট
type Props = {
  data?: Array<IProduct | ProductData>;
  loading?: boolean;
  error?: boolean;
  title?: string;
  limit?: number;
};

const formatBDT = (n: number) =>
  `৳${Math.max(0, Number.isFinite(n) ? Math.round(n) : 0)}`;

const FALLBACK: UIProduct[] = [
  {
    id: "fb-1",
    title: "Portable Chair",
    image: "/new-arrival-1.png",
    price: 1800,
    salePrice: 1620,
    categories: ["All"],
    tags: ["10% Discount"],
  },
  {
    id: "fb-2",
    title: "Summer T-Shirt",
    image: "/new-arrival-2.png",
    price: 900,
    salePrice: 810,
    categories: ["All"],
    tags: ["10% Discount"],
  },
  {
    id: "fb-3",
    title: "Casual Pants",
    image: "/new-arrival-3.png",
    price: 1450,
    salePrice: 1305,
    categories: ["All"],
    tags: ["10% Discount"],
  },
  {
    id: "fb-4",
    title: "Analog Watch",
    image: "/new-arrival-4.png",
    price: 2200,
    salePrice: 1980,
    categories: ["All"],
    tags: ["10% Discount"],
  },
  {
    id: "fb-5",
    title: "Smart Watch",
    image: "/man-model.png",
    price: 2800,
    salePrice: 2520,
    categories: ["All"],
    tags: ["10% Discount"],
  },
  {
    id: "fb-6",
    title: "Sneakers",
    image: "/mens.png",
    price: 3200,
    salePrice: 2880,
    categories: ["All"],
    tags: ["10% Discount"],
  },
];

export default function Discount({
  data = [],
  loading,
  
  title = "Up to 10% Discount",
  limit = 6,
}: Props) {
  // সবসময় UIProduct লিস্ট বানিয়ে নেই (API/ProductData → UI)
  const items: UIProduct[] = useMemo(() => {
    const list = toUIList(Array.isArray(data) ? data : []);
    return list.slice(0, limit);
  }, [data, limit]);

  // Loader
  if (loading) {
    return (
      <section className="w-full py-12 bg-secondary">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl text-primary">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-[320px] w-full rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Error হলে subtle fallback
  const dataset = items.length ? items : FALLBACK;

  return (
    <section className="w-full py-12 bg-secondary">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl text-primary">{title}</h2>
        <Button
          asChild
          variant="outline"
          className="rounded-[12px] border border-neutral px-4 py-2 text-sm hover:bg-accent/50 md:px-6 md:py-3 md:text-base"
        >
          <Link href="/discounts">
            View All <ChevronRight className="ml-1 inline h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
        {dataset.slice(0, limit).map((p) => {
          const href = `/product-details?id=${encodeURIComponent(p.id)}`;
          const showSale = p.salePrice != null && p.salePrice < (p.price ?? 0);
          const discountPct = showSale ? Math.round(((p.price ?? 0) - (p.salePrice ?? 0)) / (p.price ?? 1) * 100) : 0;
          return (
            <Link key={p.id} href={href} className="group">
              <Card className="relative w-full cursor-pointer rounded-2xl border-none bg-card shadow-sm transition-all duration-300 hover:shadow-md">
                <CardContent className="flex flex-col p-4">
                  <div className="relative mb-4 grid h-28 w-full place-items-center sm:h-32 lg:h-40">
                    {showSale && discountPct > 0 && (
                      <div className="absolute left-0 top-0 z-10">
                        <span className="inline-block bg-red-600 text-white text-[10px] px-2 py-1 font-semibold">
                          {discountPct}% OFF
                        </span>
                      </div>
                    )}
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
                      className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-95"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="line-clamp-1 text-sm font-semibold md:text-base text-primary">
                      {p.title}
                    </h3>
                  </div>

                  <div className="mt-3">
                    {showSale ? (
                      <>
                        <div className="text-xs text-muted-foreground line-through">
                          {formatBDT(p.price ?? 0)}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {formatBDT(p.salePrice ?? 0)}
                        </div>
                      </>
                    ) : (
                      <div className="text-lg font-bold text-primary">
                        {formatBDT(p.price ?? 0)}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full bg-accent transition-colors hover:bg-accent/80"
                    >
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
