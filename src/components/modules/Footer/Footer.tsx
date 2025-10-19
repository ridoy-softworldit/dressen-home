import Image from "next/image";
import React from "react";
import { Facebook, Youtube, Instagram } from "lucide-react";
const footerLinks = [
  {
    title: "About",
    links: [
      { label: "FAQ", href: "/faqs-page" },
      { label: "Privacy Policy", href: "/privacy-trust" },

      "Search",
      "Shop",
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "contact@dressen.com", href: "mailto:contact@dressen.com" },
      { label: "+1 (555) 123-4567", href: "tel:+15551234567" },
      "123 Fashion Street, Style District",
      "New York, NY 10001, USA",
    ],
  },
  {
    title: "Shop",
    links: ["Product Single", "Women", "Return & Exchange"],
  },
  {
    title: "Our Information",
    links: ["Privacy Policy Update", "Single Post", "Sports"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Logo & Social */}
          <div className="col-span-2">
            <div className="relative w-40 h-16">
              <Image src={"/logo.png"} alt="logo" fill />
            </div>
            <p className="mt-4">
              Connect with our social <br /> Media Platform
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>

            {/* Store Buttons */}
            <div className="flex space-x-3 mt-6">
              <Image
                src="/appstore.png"
                alt="App Store"
                width={130}
                height={40}
              />
              <Image
                src="/googleplay.png"
                alt="Google Play"
                width={130}
                height={40}
              />
            </div>
          </div>

          {/* Footer Sections */}
          {footerLinks.map(({ title, links }, i) => (
            <div key={i}>
              <h3 className="font-semibold xl:font-bold mb-3">{title}</h3>
              <ul className="space-y-2 text-sm">
                {links.map((link, j) =>
                  typeof link === "string" ? (
                    <li key={j}>
                      <a href="#">{link}</a>
                    </li>
                  ) : (
                    <li key={j}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center opacity-60">
          © {new Date().getFullYear()} Dressen. All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
