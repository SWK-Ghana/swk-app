import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Our Work",
    href: "/our-work",
    children: [
      { label: "Overview", href: "/our-work" },
      { label: "Taka Kipawa", href: "/taka-kipawa" },
      { label: "Marketplace", href: "/marketplace" },
    ],
  },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Get Involved", href: "/get-involved", cta: true },
  { label: "Donate", href: "/donate", cta: true },
];

const Chevron = ({ open }) => (
  <svg
    className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Navbar = ({ logoSrc = "https://res.cloudinary.com/dwgj3lovn/image/upload/v1760294682/SWK_LOGO_es585y.png", logoAlt = "SWK Ghana Logo" }) => {
  const [open, setOpen] = useState(false);          // mobile menu
  const [openMenu, setOpenMenu] = useState(null);   // desktop dropdown (by label)
  const [mobileSub, setMobileSub] = useState(null); // mobile expanded submenu (by label)
  const location = useLocation();
  const currentPath = location.pathname;
  const navRef = useRef(null);

  const isActive = (href) => {
    if (!currentPath) return false;
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  // A grouped item is "active" when the current route matches it or any child.
  const isGroupActive = (link) =>
    link.children
      ? isActive(link.href) || link.children.some((c) => isActive(c.href))
      : isActive(link.href);

  // Close all menus whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setMobileSub(null);
  }, [currentPath]);

  // Close the desktop dropdown on outside click or Escape.
  useEffect(() => {
    const onDoc = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null); };
    const onKey = (e) => { if (e.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  // Computed inline every render so active state always reflects the current
  // route (a useMemo here can go stale on client-side navigation).
  const desktopLinks = NAV_LINKS.map((link) =>
    link.children ? (
      <DropdownItem
        key={link.label}
        link={link}
        open={openMenu === link.label}
        active={isGroupActive(link)}
        isChildActive={isActive}
        onOpen={() => setOpenMenu(link.label)}
        onClose={() => setOpenMenu(null)}
        onToggle={() => setOpenMenu((v) => (v === link.label ? null : link.label))}
      />
    ) : (
      <NavItem key={link.href} {...link} active={isActive(link.href)} />
    )
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav ref={navRef} className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex h-16 xs:h-18 sm:h-20 md:h-24 items-center justify-between">
          {/* Logo */}
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
        <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[900px]" : "max-h-0"}`}>
          <ul className="py-3 space-y-1 border-t border-gray-100">
            {NAV_LINKS.map((link) => {
              // Grouped item → accordion
              if (link.children) {
                const expanded = mobileSub === link.label;
                return (
                  <li key={link.label}>
                    <button
                      onClick={() => setMobileSub((v) => (v === link.label ? null : link.label))}
                      aria-expanded={expanded}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                        isGroupActive(link) ? "text-[#78C31E] font-bold" : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      <Chevron open={expanded} />
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ${expanded ? "max-h-72" : "max-h-0"}`}>
                      <ul className="mt-1 ml-3 pl-3 border-l border-gray-100 space-y-1">
                        {link.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              to={c.href}
                              onClick={() => setOpen(false)}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                isActive(c.href) ? "text-[#78C31E] font-bold bg-[#F2FAE8]" : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              // CTA
              if (link.cta) {
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="block w-full text-center font-bold py-3 mx-1 rounded-xl text-white"
                      style={{ backgroundColor: "#78C31E" }}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }

              // Regular
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                      isActive(link.href) ? "text-white font-bold" : "text-gray-800 hover:bg-gray-50"
                    }`}
                    style={isActive(link.href) ? { backgroundColor: "#78C31E" } : {}}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

// ── Desktop dropdown ──────────────────────────────────────────────────────────
const DropdownItem = ({ link, open, active, isChildActive, onOpen, onClose, onToggle }) => {
  const closeTimer = useRef(null);
  const openNow = () => { clearTimeout(closeTimer.current); onOpen(); };
  // Small delay on leave so a diagonal cursor path to the menu doesn't close it.
  const closeSoon = () => { closeTimer.current = setTimeout(onClose, 120); };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <li className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={onToggle}
        onFocus={openNow}
        className="relative px-2 py-2 text-sm font-medium transition-colors flex items-center gap-1"
        style={{ color: active ? "#78C31E" : "#1A1A1A" }}
      >
        <span>{link.label}</span>
        <Chevron open={open} />
        <span
          className="absolute left-0 right-6 -bottom-0.5 h-0.5 rounded-full transition-all"
          style={{ backgroundColor: active ? "#78C31E" : "transparent" }}
        />
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={link.label}
          className="animate-dropdown absolute left-0 top-full min-w-[210px] rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-50"
        >
          {link.children.map((c) => (
            <li key={c.href} role="none">
              <Link
                role="menuitem"
                to={c.href}
                onClick={onClose}
                aria-current={isChildActive(c.href) ? "page" : undefined}
                className="block px-4 py-2.5 text-sm font-medium hover:bg-[#F2FAE8] transition-colors"
                style={{ color: isChildActive(c.href) ? "#78C31E" : "#1A1A1A" }}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// ── Desktop simple / CTA item ─────────────────────────────────────────────────
const NavItem = ({ label, href, active, cta }) => {
  if (cta) {
    return (
      <li>
        <Link
          to={href}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#78C31E" }}
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
        style={{ color: active ? "#78C31E" : "#1A1A1A" }}
      >
        <span>{label}</span>
        <span
          className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full transition-all"
          style={{ backgroundColor: active ? "#78C31E" : "transparent" }}
        />
      </Link>
    </li>
  );
};

export default Navbar;
