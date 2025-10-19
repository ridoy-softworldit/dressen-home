"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetHeroSlidesQuery } from "@/redux/featured/slide/slideApi";
import type { ISlide } from "@/types/slide";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// Type-safe slide interface
type Slide = ISlide;

const boisakhi_banner = "https://res.cloudinary.com/dtges64tg/image/upload/w_1200,h_400,f_auto,q_auto/v1759399963/b1_ognlhc.png";
const frame_banner = "https://res.cloudinary.com/dtges64tg/image/upload/w_1200,h_400,f_auto,q_auto/v1759399970/Frame_224_s3tmrd.png";

const FALLBACK: Slide[] = [
  { 
    _id: "f1", 
    imageUrl: boisakhi_banner, // ✅ Cloudinary URL
    alt: "Footwear Promo", 
    href: "/products/footwear" 
  },
  { 
    _id: "f4", 
    imageUrl: frame_banner, // ✅ Cloudinary URL
    alt: "New Arrival", 
    href: "/products/new" 
  },
];


export default function BannerSlider() {
  // Fetch slides from backend
  const { data, isLoading, isError, error } = useGetHeroSlidesQuery();

  
  // Normalize slides to use fetched data or fallback
  const slides: Slide[] = useMemo(() => {
    const result = Array.isArray(data) && data.length ? data : FALLBACK;
    return result;
  }, [data]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animationState, setAnimationState] = useState<"in" | "out" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [prefersReducedMotion, setPRM] = useState(false);

  // Handle prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPRM(mq.matches);

    const onChange = () => setPRM(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(onChange);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", onChange);
      } else if (typeof mq.removeListener === "function") {
        mq.removeListener(onChange);
      }
    };
  }, []);

  // Auto-rotate slides with flip animation
  useEffect(() => {
    if (prefersReducedMotion || paused || slides.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setAnimationState("out");
      setTimeout(() => {
        setIdx((p) => (p + 1) % slides.length);
        setAnimationState("in");
      }, 500); // Match CSS animation duration
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion, paused, slides.length]);

  // Pause on blur, resume on focus
  useEffect(() => {
    const onBlur = () => setPaused(true);
    const onFocus = () => setPaused(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const err = error as FetchBaseQueryError | SerializedError | undefined;

  return (
    <div
      className="relative mx-auto w-full lg:w-[1000px] h-44 sm:h-56 md:h-64 lg:h-80 xl:h-96 rounded-lg overflow-hidden border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style jsx>{`
        @keyframes flipIn {
          0% {
            transform: translateX(100%) rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
        }
        @keyframes flipOut {
          0% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%) rotateY(-90deg);
            opacity: 0;
          }
        }
        .slide-in {
          animation: flipIn 0.5s ease-out forwards;
        }
        .slide-out {
          animation: flipOut 0.5s ease-out forwards;
        }
      `}</style>

      {isLoading && <div className="absolute inset-0 animate-pulse bg-gray-100" />}

      {slides.map((s, i) => {
        const isActive = i === idx;
        const animationClass =
          isActive && !prefersReducedMotion
            ? animationState === "in"
              ? "slide-in"
              : animationState === "out"
              ? "slide-out"
              : ""
            : isActive
            ? "opacity-100"
            : "opacity-0";

        const imgEl = (
          <Image
            key={s._id}
            src={s.imageUrl}
            alt={s.alt || "Banner"}
            fill
            priority={i === 0}
            className={`object-cover absolute inset-0 transition-opacity duration-500 ${animationClass}`}
            sizes="(min-width:1280px) 1000px, 100vw"
          />
        );

        return s.href ? (
          <Link key={s._id} href={s.href} aria-label={s.alt || "banner"}>
            {imgEl}
          </Link>
        ) : (
          imgEl
        );
      })}

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s._id}
            onClick={() => {
              setAnimationState("out");
              setTimeout(() => {
                setIdx(i);
                setAnimationState("in");
              }, 500);
            }}
            aria-label={`slide ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-white" : "bg-white/60"}`}
          />
        ))}
      </div>

      {isError && (
        <span className="sr-only">
          Failed to load slides. {(err && "status" in err && err.status) || ""}
        </span>
      )}
    </div>
  );
}