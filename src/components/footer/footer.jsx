"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Instagram } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";

export default function Footer() {
  const appStoreUrl =
    "https://res.cloudinary.com/dtges64tg/image/upload/w_120,h_40,f_auto,q_auto/v1759399126/appstore_waa00a.png";
  const googlePlayUrl =
    "https://res.cloudinary.com/dtges64tg/image/upload/w_120,h_40,f_auto,q_auto/v1759399057/googleplay_kxh8bu.png";

  const currentUser = useAppSelector(selectCurrentUser);
  const isLoggedIn = Boolean(currentUser?.id);
  const sellerHref = "https://Dressen-admin-panel.vercel.app/auth/register";

  return (
    <footer className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#795548] mb-1">Dressen</h2>
              <p className="text-sm text-gray-600 mb-6">
                Connect with our social media platforms
              </p>

              {/* Social Media Icons */}
              <div className="space-y-3 mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Follow Us: 
                <div className="flex gap-2 items-center">
                  <a
                    href="https://www.facebook.com/share/1B8o3BFkr5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Facebook className="w-3 h-3 text-white" />
                    </div>
                    Dressen Facebook Page
                  </a>
                </div>
                 
                  
                </div>
              </div>

              {/* App Store Buttons */}
              <div className="flex gap-3">
                <Image
                  src={appStoreUrl}
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="rounded"
                />
                <Image
                  src={googlePlayUrl}
                  alt="Get it on Google Play"
                  width={120}
                  height={40}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold text-black mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/faqs-page" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-black mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="mailto:dressenbd@gmail.com"
                  className="hover:text-black transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  dressenbd@gmail.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  +8801909008004
                </div>
              </li>
              <li className="text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-gray-500">
                    Kazla, Dhaka, Bangladesh
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-semibold text-black mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {/* <li>
                <Link
                  href={sellerHref}
                  className="hover:text-black transition-colors"
                >
                  Become a Seller
                </Link>
              </li> */}
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Return & Exchange
                </a>
              </li>
            </ul>
          </div>

          {/* Our Information Section */}
          <div>
            <h3 className="font-semibold text-black mb-4">Our Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Privacy Policy Update
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-4">
            © {new Date().getFullYear()} Dressen. All rights reserved - Design & Developed by <span className="text-md">WebQ Team</span> 
          </p>
        </div>
      </div>
    </footer>
  );
}