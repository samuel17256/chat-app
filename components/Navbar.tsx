"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed w-full border-b border-[#e8e3da] z-50 bg-white/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-[#201f1e] shrink-0">
          Gist<span className="text-[#9e6915]">Me</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="nav-link text-sm">
            Home
          </Link>
          <Link href="#about" className="nav-link text-sm">
            About
          </Link>
          <Link href="/gist" className="nav-link text-sm">
            Gist
          </Link>
          <Link href="#contact" className="nav-link text-sm">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="border border-[#c8c6c0] px-4 py-1.5 text-sm rounded-lg hover:bg-[#9e6915] hover:text-white hover:border-[#9e6915] transition-all duration-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-sm bg-[#9e6915] rounded-lg text-white hover:bg-[#cc830e] transition-colors duration-200"
          >
            Get Started Free
          </Link>
        </div>

        <button
          type="button"
          className={`hamburger md:hidden flex flex-col gap-1.5 p-1 cursor-pointer ${menuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu md:hidden bg-white border-t border-[#e8e3da] ${menuOpen ? "open" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
          <Link href="/" onClick={closeMenu} className="text-sm py-2 border-b border-[#f0ece4] hover:text-[#9e6915] transition-colors">
            Home
          </Link>
          <Link href="#about" onClick={closeMenu} className="text-sm py-2 border-b border-[#f0ece4] hover:text-[#9e6915] transition-colors">
            About
          </Link>
          <Link href="/gist" onClick={closeMenu} className="text-sm py-2 border-b border-[#f0ece4] hover:text-[#9e6915] transition-colors">
            Gist
          </Link>
          <Link href="#contact" onClick={closeMenu} className="text-sm py-2 border-b border-[#f0ece4] hover:text-[#9e6915] transition-colors">
            Contact
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login"
              onClick={closeMenu}
              className="w-full text-center border border-[#c8c6c0] px-4 py-2 text-sm rounded-lg hover:bg-[#9e6915] hover:text-white hover:border-[#9e6915] transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 text-sm bg-[#9e6915] rounded-lg text-white hover:bg-[#cc830e] transition-colors duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
