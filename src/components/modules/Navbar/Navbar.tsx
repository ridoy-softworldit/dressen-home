"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import {
  Menu,
  Phone,
  Search,
  Headphones,
  ShoppingCart,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import {
  useGetAllCategoryQuery,
  type RemoteCategory,
} from "@/redux/featured/category/categoryApi";

// 🔐 auth + cart selectors & logout
import { useAppSelector } from "@/redux/hooks";
import { selectCartCount } from "@/redux/featured/customer/customerSlice";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import SmartSearch from "@/components/search/SmartSearch";
import { selectCartItems } from "@/redux/featured/cart/cartSlice";

type UICategory = { id: string; slug?: string; label: string; image?: string };

// ----- safe helpers -----
function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}
function getProp(o: unknown, k: string): unknown {
  return isRecord(o) && k in o ? (o as Record<string, unknown>)[k] : undefined;
}
function getStr(o: unknown, k: string): string | undefined {
  const v = getProp(o, k);
  return typeof v === "string" ? v : undefined;
}

type CartItem = {
  productId: string;
  quantity: number;
  totalAmount: number;
  productName: string;
  productImage: string;
  unitPrice: number;
};

const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cartStr = localStorage.getItem("guestCart");
  if (!cartStr) return [];
  try {
    const cart = JSON.parse(cartStr);
    return cart.productInfo || [];
  } catch {
    return [];
  }
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [guestCartCount, setGuestCartCount] = useState(0);

  const router = useRouter();
  const cartCount = useAppSelector(selectCartCount);
  const currentUser = useAppSelector(selectCurrentUser);
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const isLoggedIn = Boolean(currentUser?.id);

  useEffect(() => {
    if (!isLoggedIn) {
      const cart = getLocalCart();
      setGuestCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }
  }, [isLoggedIn]);

  const effectiveCartCount = isLoggedIn ? cartCount : guestCartCount;

  const cartItems = useAppSelector(selectCartItems);
  // Fetch categories from API
  const { data } = useGetAllCategoryQuery();

  // Transform categories for UI
  const categories = useMemo<UICategory[]>(() => {
    const raw: RemoteCategory[] = Array.isArray(data) ? data : [];
    return raw.map((c) => {
      const id = String((c._id ?? c.id ?? c.slug ?? "") || "");
      const slug = typeof c.slug === "string" ? c.slug : undefined;
      const label = String(
        getStr(c, "name") ?? getStr(c, "label") ?? "Category"
      );
      const icon = getProp(c, "icon");
      const iconUrl = isRecord(icon) ? getStr(icon, "url") : undefined;
      const image = iconUrl ?? getStr(c, "image") ?? undefined;
      return { id, slug, label, image };
    });
  }, [data]);

  const handleLogout = async () => {
    try {
      const userId = currentUser?.id ?? "";
      if (userId) {
        await logoutMutation(userId).unwrap();
      }
    } catch {
      // Handle error silently
    } finally {
      router.replace("/auth/login");
    }
  };

  return (
    <>
      {/* ===== Desktop/Large Screen ===== */}
      <div className="hidden lg:block w-full bg-accent border-b border-neutral shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full md:px-6 lg:px-36">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* <Image
                src="/logo.svg"
                alt="Dressen Home"
                width={36}
                height={36}
                className="rounded"
              /> */}
              <Link
                href="/"
                className="font-extrabold text-3xl text-[#785706] cursor-pointer hover:text-secondary/80 transition-colors"
                aria-label="Go to homepage"
              >
                Dressen
              </Link>
            </div>

            {/* Search Area */}
            <div className="flex-1 flex justify-center lg:ml-30">
              <div className="flex items-center gap-2 w-full max-w-2xl">
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-2xl">
                    <SmartSearch />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center text-secondary gap-2 px-3 py-2 rounded-md border border-neutral hover:bg-highlight/90 bg-highlight transition-all duration-200"
                aria-label="contact"
              >
                <Headphones size={18} />
              </Link>

              <Link
                href="/dashboard/checkout"
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-md border border-neutral hover:bg-accent/50 text-secondary"
                aria-label="cart"
              >
                <ShoppingCart size={18} />
                {typeof window !== 'undefined' && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full text-xs bg-orange-500 text-white flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* {!isLoggedIn ? (
                <Link
                  href="/auth/login"
                  className="text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                >
                  Login / Register
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Logout"
                    disabled={isLogoutLoading}
                    className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {isLogoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile/Small Screen ===== */}
      <div className="lg:hidden bg-primary text-secondary w-full">
        <div className="container mx-auto px-4 py-3">
          {/* Normal State */}
          {!isSearchActive && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu size={20} />
                </button>
                <Link href="/" className="font-bold text-xl text-secondary">
                  Dressen
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                  aria-label="Search"
                  onClick={() => setIsSearchActive(true)}
                >
                  <Search size={18} />
                </button>

                <Link
                  href="/contact-us"
                  className="p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                  aria-label="Contact"
                >
                  <Phone size={18} />
                </Link>

                <Link
                  href="/dashboard/checkout"
                  className="relative p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  {effectiveCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-xs bg-orange-500 text-white flex items-center justify-center">
                      {effectiveCartCount}
                    </span>
                  )}
                </Link>

                {!isLoggedIn ? (
                  <Link
                    href="/auth/login"
                    className="p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                    aria-label="Login/Register"
                  >
                    <UserIcon size={18} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Logout"
                    disabled={isLogoutLoading}
                    className="p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-60"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Active State */}
          {isSearchActive && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchActive(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Close search"
              >
                <Menu size={20} />
              </button>

              <div className="flex-1">
                <SmartSearch
                  placeholder="Search Product..."
                  className="w-full"
                  onSearch={(q) => {
                    // ডিফল্ট রাউটিং
                    router.push(
                      `/product-listing?search=${encodeURIComponent(q)}`
                    );
                    setIsSearchActive(false);
                  }}
                />
              </div>

              {/* ডানপাশে আলাদা বোতাম লাগবে না—SmartSearch নিজেই সার্চ করতে পারে */}
            </div>
          )}

          {/* Categories Menu */}
          {isMenuOpen && !isSearchActive && (
            <div className="mt-3 bg-white/10 rounded-lg p-3">
              <nav className="space-y-2">
                <Link
                  href="/product-listing"
                  className="block py-2 px-3 hover:bg-white/10 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Categories
                </Link>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug ?? category.id}`}
                    className="block py-2 px-3 hover:bg-white/10 rounded transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
