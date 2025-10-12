import { useState, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved", cta: true },
  { label: "Contact", href: "/contact" },
];

const Navbar = ({ logoSrc = "/logo.svg", logoAlt = "SWK Ghana Logo" }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href) => {
    if (!currentPath) return false;
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  const desktopLinks = useMemo(
    () => NAV_LINKS.map((link) => (
      <NavItem key={link.href} {...link} active={isActive(link.href)} />
    )),
    [currentPath]
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label={logoAlt}>
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-9 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <span className="sr-only">{logoAlt}</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            {desktopLinks}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
          <ul className="py-3 space-y-1 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {link.cta ? (
                  <Link
                    to={link.href}
                    className="btn-gradient block w-full text-center"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive(link.href)
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Gradient Styles */}
      <style>{`
        .btn-gradient {
          @apply inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60;
          background-image: linear-gradient(90deg, #059669 0%, #10B981 50%, #22C55E 100%);
        }
        .btn-gradient:hover { filter: brightness(1.03); }
      `}</style>
    </header>
  );
};

const NavItem = ({ label, href, active, cta }) => {
  if (cta) {
    return (
      <li>
        <Link to={href} className="btn-gradient">
          {label}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <Link
        to={href}
        aria-current={active ? "page" : undefined}
        className={`relative px-1.5 py-2 text-sm font-medium transition-colors ${
          active ? "text-emerald-700" : "text-gray-700 hover:text-emerald-700"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          {label}
          {active && <span className="sr-only">(current)</span>}
        </span>
        <span
          className={`absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full ${
            active ? "bg-emerald-600" : "bg-transparent group-hover:bg-emerald-200"
          }`}
        />
      </Link>
    </li>
  );
};

export default Navbar;
