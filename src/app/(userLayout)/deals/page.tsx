"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  FilterX,
  ShoppingCart,
  Star,
  Flame,
} from "lucide-react";

type DealCategory = "Electronics" | "Fashion" | "Home" | "Sports";

type DealItem = {
  id: string;
  title: string;
  category: DealCategory;
  image: string;
  price: number;
  oldPrice: number;
  createdAt: string; // ISO string
  rating?: number;
  reviews?: number;
  sold?: number;
  badge?: "SALE" | "HOT" | "NEW";
};

const DEALS: DealItem[] = [
  {
    id: "t1",
    title: "Noise Cancelling Headphone",
    category: "Electronics",
    image: "/new-arrival-3.png",
    price: 4990,
    oldPrice: 7990,
    createdAt: "2025-10-09T09:00:00Z",
    rating: 4.6,
    reviews: 120,
    sold: 930,
    badge: "SALE",
  },
  {
    id: "t2",
    title: "Smartwatch AMOLED",
    category: "Electronics",
    image: "/man-model.png",
    price: 6490,
    oldPrice: 8990,
    createdAt: "2025-10-08T12:00:00Z",
    rating: 4.5,
    reviews: 96,
    sold: 700,
  },
  {
    id: "t3",
    title: "Premium Hoodie",
    category: "Fashion",
    image: "/new-arrival-1.png",
    price: 1490,
    oldPrice: 2190,
    createdAt: "2025-10-09T03:00:00Z",
    rating: 4.4,
    reviews: 80,
    sold: 450,
    badge: "NEW",
  },
  {
    id: "t4",
    title: "Leather Sneakers",
    category: "Fashion",
    image: "/mens.png",
    price: 2790,
    oldPrice: 3490,
    createdAt: "2025-10-07T09:00:00Z",
    rating: 4.3,
    reviews: 61,
    sold: 380,
  },
  {
    id: "t5",
    title: "Cordless Vacuum Cleaner",
    category: "Home",
    image: "/new-arrival-4.png",
    price: 6990,
    oldPrice: 9990,
    createdAt: "2025-10-09T01:30:00Z",
    rating: 4.5,
    reviews: 140,
    sold: 1020,
    badge: "HOT",
  },
  {
    id: "t6",
    title: "Air Purifier HEPA",
    category: "Home",
    image: "/new-arrival-2.png",
    price: 8890,
    oldPrice: 11990,
    createdAt: "2025-10-06T10:00:00Z",
    rating: 4.6,
    reviews: 75,
    sold: 310,
  },
  {
    id: "t7",
    title: "Adjustable Dumbbells (Pair)",
    category: "Sports",
    image: "/new-arrival-3.png",
    price: 3990,
    oldPrice: 5490,
    createdAt: "2025-10-09T04:30:00Z",
    rating: 4.4,
    reviews: 64,
    sold: 270,
  },
  {
    id: "t8",
    title: "Pro Football",
    category: "Sports",
    image: "/mens.png",
    price: 1290,
    oldPrice: 1690,
    createdAt: "2025-10-05T19:00:00Z",
    rating: 4.2,
    reviews: 30,
    sold: 210,
  },
];

const categories = ["All", "Electronics", "Fashion", "Home", "Sports"] as const;
type Category = (typeof categories)[number];

function formatBDT(n: number) {
  return `৳${Math.round(n)}`;
}
function discountPct(price: number, oldPrice: number) {
  const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
  return Math.max(1, Math.min(90, pct));
}

export default function DealsMorePage() {
  const [activeCat, setActiveCat] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<
    "newest" | "discount" | "price_asc" | "price_desc"
  >("newest");
  const [q, setQ] = useState("");
  const [minOff, setMinOff] = useState<0 | 10 | 20 | 30>(0);

  const filtered: DealItem[] = useMemo(() => {
    let arr = DEALS.filter((p) =>
      activeCat === "All" ? true : p.category === activeCat
    );

    if (q.trim()) {
      const t = q.toLowerCase();
      arr = arr.filter((p) => p.title.toLowerCase().includes(t));
    }

    if (minOff > 0) {
      arr = arr.filter((p) => discountPct(p.price, p.oldPrice) >= minOff);
    }

    switch (sortBy) {
      case "price_asc":
        arr = arr.slice().sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        arr = arr.slice().sort((a, b) => b.price - a.price);
        break;
      case "discount":
        arr = arr
          .slice()
          .sort(
            (a, b) =>
              discountPct(b.price, b.oldPrice) -
              discountPct(a.price, a.oldPrice)
          );
        break;
      default: // newest
        arr = arr
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
    }

    return arr;
  }, [activeCat, sortBy, q, minOff]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF3E9] via-white to-[#FFD7C4]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] flex items-center gap-2">
                <Flame className="w-7 h-7 text-black" />
                More Deals
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Today’s fresh deals—sorted your way.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-[380px]">
              <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search deals…"
                  className="w-full bg-transparent outline-none text-sm"
                />
                {q && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQ("")}
                    className="text-gray-500"
                  >
                    <FilterX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={[
                  "h-9 rounded-full border px-4 text-sm transition",
                  activeCat === c
                    ? "bg-primary text-white border-[#795548]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                ].join(" ")}
                aria-pressed={activeCat === c}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort & Min Discount */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                Showing <b>{filtered.length}</b> item
                {filtered.length !== 1 ? "s" : ""}
              </span>

              {/* Quick Min %OFF */}
              <div className="ml-3 flex items-center gap-1">
                {[0, 10, 20, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setMinOff(d as 0 | 10 | 20 | 30)}
                    className={[
                      "h-7 rounded-full border px-3 text-xs transition",
                      minOff === d
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                    ].join(" ")}
                    aria-pressed={minOff === d}
                  >
                    {d === 0 ? "Any" : `≥ ${d}% OFF`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "newest"
                        | "discount"
                        | "price_asc"
                        | "price_desc"
                    )
                  }
                  className="appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No deals found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((p: DealItem) => {
              const pct = discountPct(p.price, p.oldPrice);
              const isNew =
                (Date.now() - new Date(p.createdAt).getTime()) / 36e5 < 48; // <48h

              return (
                <Card
                  key={p.id}
                  className="group relative rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Badges */}
                  <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
                    <span className="inline-block rounded-full bg-red-600 text-white text-[10px] px-2 py-0.5 font-semibold">
                      {pct}% OFF
                    </span>
                    {(p.badge || isNew) && (
                      <span className="inline-block rounded-full bg-primary text-white text-[10px] px-2 py-0.5 font-semibold">
                        {p.badge ?? "NEW"}
                      </span>
                    )}
                  </div>

                  <div className="relative w-full h-36 sm:h-40 md:h-44">
                    <Image
                      src={p.image || "/mens.png"}
                      alt={p.title}
                      fill
                      sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-95"
                    />
                  </div>

                  <CardContent className="p-3">
                    <div className="min-h-[40px] text-sm font-medium text-gray-900 line-clamp-2">
                      {p.title}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                      {typeof p.rating === "number" ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-yellow-500" />
                          <span>{p.rating.toFixed(1)}</span>
                        </>
                      ) : null}
                      {typeof p.reviews === "number" && (
                        <span>• {p.reviews} reviews</span>
                      )}
                      {typeof p.sold === "number" && (
                        <span>• {p.sold} sold</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        {formatBDT(p.oldPrice)}
                      </span>
                      <span className="text-base font-semibold text-black">
                        {formatBDT(p.price)}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/product-details?id=${encodeURIComponent(p.id)}`}
                        className="flex-1"
                        aria-label={`View details of ${p.title}`}
                      >
                        <Button className="w-full">View</Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-10 px-0"
                        aria-label="Add to cart (static)"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
