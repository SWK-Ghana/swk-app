import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Reports", href: "/reports" },
  { label: "Blog", href: "/blog" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Contact", href: "/contact" },
  { label: "Get Involved", href: "/get-involved", cta: true },
  { label: "Donate", href: "/donate", cta: true },
];

const Navbar = ({ logoSrc = "https://res.cloudinary.com/dwgj3lovn/image/upload/v1760294682/SWK_LOGO_es585y.png", logoAlt = "SWK Ghana Logo" }) => {
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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex h-16 xs:h-18 sm:h-20 md:h-24 items-center justify-between">
          {/* Logo — larger */}
          <Link to="/" className="flex items-center gap-2 group" aria-label={logoAlt}>
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-12 xs:h-14 sm:h-16 md:h-20 lg:h-22 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            {desktopLinks}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition focus:outline-none"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[700px]" : "max-h-0"}`}>
          <ul className="py-3 space-y-1 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {link.cta ? (
                  <Link
                    to={link.href}
                    className="block w-full text-center font-bold py-3 mx-1 rounded-xl text-white"
                    style={{ backgroundColor: '#78C31E' }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                      isActive(link.href)
                        ? "text-white font-bold"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                    style={isActive(link.href) ? { backgroundColor: '#78C31E' } : {}}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

const NavItem = ({ label, href, active, cta }) => {
  if (cta) {
    return (
      <li>
        <Link
          to={href}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#78C31E' }}
        >
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
        className="relative px-2 py-2 text-sm font-medium transition-colors"
        style={{ color: active ? '#78C31E' : '#1A1A1A' }}
      >
        <span>{label}</span>
        <span
          className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full transition-all"
          style={{ backgroundColor: active ? '#78C31E' : 'transparent' }}
        />
      </Link>
    </li>
  );
};

export default Navbar;