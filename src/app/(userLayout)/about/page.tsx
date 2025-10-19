// src/app/(userLayout)/about/page.tsx
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  Users,
  Store,
  Leaf,
  Shield,
  Rocket,
  Smile,
} from "lucide-react";

export const metadata = {
  title: "About — Dressen",
  description:
    "Learn about Dressen — our story, values, team, and what we’re building for shoppers and sellers.",
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg grid place-items-center bg-gray-50">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-extrabold tracking-tight">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-gray-200 h-full">
      <CardContent className="p-5">
        <div className="w-10 h-10 rounded-lg grid place-items-center bg-gray-50 mb-3">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{text}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFF3E9] via-white to-[#FFE4D6]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-xs tracking-widest text-[#795548] font-semibold">
                ABOUT Dressen
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1F2937]">
                We make shopping simple, social & fair.
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl">
                Dressen is a modern marketplace experience where brands, creators,
                and local sellers bring you great products in one place. Fast
                delivery, trusted reviews, and smart deals—without friction.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/more">
                  <Button className="w-full sm:w-auto">Explore Featured</Button>
                </Link>
                <Link href="/sr">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-white">
              <Image
                src="/new-arrival-4.png"
                alt="Dressen marketplace preview"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Stat
            icon={<Store className="w-5 h-5 text-[#795548]" />}
            label="Active Sellers"
            value="1,200+"
          />
          <Stat
            icon={<Package className="w-5 h-5 text-[#795548]" />}
            label="Products"
            value="38,000+"
          />
          <Stat
            icon={<Users className="w-5 h-5 text-[#795548]" />}
            label="Happy Customers"
            value="210K+"
          />
          <Stat
            icon={<ShoppingBag className="w-5 h-5 text-[#795548]" />}
            label="Orders Delivered"
            value="1.9M+"
          />
        </div>
      </section>

      {/* STORY */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              Our Story
            </h2>
            <p className="mt-3 text-gray-600">
              Dressen started with a simple question:{" "}
              <span className="font-semibold text-[#1F2937]">
                “Why is online shopping still complex?”
              </span>{" "}
              Choosing the right product, validating quality, and getting a fair
              price shouldn’t be hard. We built a platform where discovery,
              reviews, deals, and delivery come together—beautifully.
            </p>
            <p className="mt-3 text-gray-600">
              Today, Dressen offers curated collections, category-first
              navigation, top-reviewed listings, and Today’s Deals. Next up:
              more automation and AI-powered recommendations to personalize
              shopping for you.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-white">
              <Image
                src="/new-arrival-1.png"
                alt="Dressen team and culture"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          Our Values
        </h2>
        <p className="text-gray-600 mt-2">
          Four principles guide every decision we make.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <ValueCard
            icon={<Shield className="w-5 h-5 text-[#795548]" />}
            title="Trust & Safety"
            text="Verified sellers, secure payments, and responsive support."
          />
          <ValueCard
            icon={<Leaf className="w-5 h-5 text-[#795548]" />}
            title="Simplicity"
            text="Fewer clicks, more done—frictionless shopping."
          />
          <ValueCard
            icon={<Rocket className="w-5 h-5 text-[#795548]" />}
            title="Speed"
            text="Fast-loading pages, quick checkout, and smart search."
          />
          <ValueCard
            icon={<Smile className="w-5 h-5 text-[#795548]" />}
            title="Delight"
            text="UX-first design—clean, helpful, and joyful."
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          Milestones
        </h2>
        <ul className="mt-4 space-y-4">
          <li className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-[#FEC007]" />
            <p className="text-gray-700">
              <b>2023:</b> MVP launched—Featured, Discounts, and Deals sections.
            </p>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-[#FEC007]" />
            <p className="text-gray-700">
              <b>2024:</b> Seller portal, order tracking, top-reviewed listings.
            </p>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-[#FEC007]" />
            <p className="text-gray-700">
              <b>2025:</b> AI recommendations, smart search & personalized deals
              (ongoing).
            </p>
          </li>
        </ul>
      </section>

      {/* TEAM (static/dummy) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          Team
        </h2>
        <p className="text-gray-600 mt-2">
          A small, dedicated group across product, engineering, and design.
        </p>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: "Ayesha Rahman", role: "Product Lead" },
            { name: "Arif Hossain", role: "Engineering" },
            { name: "Nadia Islam", role: "Design" },
            { name: "Rehan Ahmed", role: "Ops" },
          ].map((m) => (
            <Card key={m.name} className="border-gray-200">
              <CardContent className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  <Image
                    src="/mens.png"
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    className="object-contain"
                  />
                </div>
                <div className="mt-3">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          FAQs
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              q: "How fast is delivery?",
              a: "Typically 24–72 hours depending on location and item. Order tracking is always available.",
            },
            {
              q: "What do I need to become a seller?",
              a: "Basic KYC, product listings, and pricing. Go live after approval.",
            },
            {
              q: "What is your return policy?",
              a: "Easy returns/exchanges for eligible items—details are shown on product pages.",
            },
            {
              q: "Are payments secure?",
              a: "Yes—secure payment gateways and strong protection for sensitive data.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="rounded-xl border border-gray-200 bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer font-semibold text-gray-800">
                {item.q}
              </summary>
              <p className="text-sm text-gray-600 mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <Card className="border-gray-200 overflow-hidden">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                Ready to explore more?
              </h3>
              <p className="text-gray-600 mt-1">
                Top-reviewed, discounted, and today’s best deals—discover
                everything in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/deals">
                <Button>See Deals</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline">Join Dressen</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
