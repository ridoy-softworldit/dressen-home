import React from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

const NavbarLogo = () => {
  return (
    <div>
      <MobileMenu />
      <Link href="/" className="text-xl font-bold">
        Dressen
      </Link>
    </div>
  );
};

export default NavbarLogo;
