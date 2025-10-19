"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCartCount } from "@/redux/featured/customer/customerSlice";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useLogoutMutation } from "@/redux/featured/auth/authApi";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function MainMenu() {
  // 🔢 কার্ট কাউন্ট (ডায়নামিক ব্যাজ)
  const cartCount = useAppSelector(selectCartCount);
  // 👤 বর্তমান ইউজার
  const currentUser = useAppSelector(selectCurrentUser);
  // 🔐 লগআউট মিউটেশন
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const router = useRouter();
  
  // NextAuth session
  const { data: session } = useSession();

  // Use NextAuth session if available, fallback to Redux
  const user = session?.user || currentUser;
  const isLoggedIn = Boolean(user?.id || session?.user);
  const displayName = user?.name || user?.email?.split("@")[0];
  const userImage = user?.image || "/banner.png";

  const handleLogout = async () => {
    try {
      if (session) {
        await signOut({ redirect: false });
      }
      if (currentUser?.id) {
        await logoutMutation(currentUser.id).unwrap();
      }
      const keys = ["accessToken", "refreshToken", "token", "auth", "user"];
      for (const k of keys) {
        try {
          localStorage.removeItem(k);
        } catch {}
        try {
          sessionStorage.removeItem(k);
        } catch {}
      }
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      router.replace("/auth/login");
    }
  };

  return (
    <div className="relative hidden lg:block left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-primary">
      <div className="container mx-auto w-full px-3 md:px-6 lg:px-36">
        <div className="flex items-center justify-between py-2 h-10">
          {/* Left menu */}
          <nav className="flex items-center gap-5 text-sm font-medium text-secondary pl-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/product-listing" className="hover:underline">Product</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact-us" className="hover:underline">Contact</Link>
          </nav>

          {/* Right: Account + Cart */}
          <div className="flex items-center gap-4 text-secondary">
            {!isLoggedIn ? (
              // 🔓 লগইন না থাকলে - Login/Register link
              <Link href="/auth/login" className="text-sm hover:underline">
                Login / Register
              </Link>
            ) : (
              // 🔒 লগইন থাকলে: ড্যাশবোর্ড + ইউজার ইমেজ + নাম + Logout
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 text-sm hover:underline group"
                >
                  {/* User Image - Always show image, fallback to avatar icon if image fails */}
                  <div className="relative">
                    <Image
                      src={userImage}
                      alt={displayName || "User avatar"}
                      width={28}
                      height={28}
                      className="rounded-full object-cover border-2 border-accent/30 group-hover:border-accent/60 transition-colors"
                      sizes="28px"
                      priority
                      onError={(e) => {
                        // যদি image load না হয়, তাহলে fallback হিসেবে avatar icon show করবে
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                
                    
                  </div>
                  <span className="max-w-24 truncate">{displayName ?? "Account"}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-secondary text-red-600 px-2 py-1 text-sm hover:bg-red-50 hover:border-red-400 disabled:opacity-60 transition-colors"
                  disabled={isLogoutLoading}
                >
                  <LogOut size={16} />
                  {isLogoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}

            {/* Cart with count */}
            <Link 
              href="/dashboard/checkout" 
              className="relative inline-flex p-2 rounded-md hover:bg-accent/20 transition-colors" 
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-xs bg-accent text-primary flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}