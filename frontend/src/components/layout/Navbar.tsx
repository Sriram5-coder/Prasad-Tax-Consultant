import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Menu,
  MessageSquare,
  Phone,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Calculators", href: "/calculators", hasDropdown: true },
  { label: "FAQ", href: "/faq" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const SERVICE_DROPDOWN = [
  { label: "Income Tax", icon: FileText, href: "/services#income-tax" },
  { label: "GST Services", icon: ClipboardList, href: "/services#gst" },
  {
    label: "Business Registration",
    icon: Building2,
    href: "/services#registration",
  },
  { label: "Audit Services", icon: ClipboardCheck, href: "/services#audit" },
  { label: "Accounting & CFO", icon: BookOpen, href: "/services#accounting" },
  { label: "ROC & Company Law", icon: ClipboardCheck, href: "/services#roc" },
  {
    label: "Licenses & Registrations",
    icon: Award,
    href: "/services#licenses",
  },
  { label: "Advisory Services", icon: TrendingUp, href: "/services#advisory" },
];

const CALCULATOR_DROPDOWN = [
  { label: "Income Tax Calculator", href: "/calculators#income-tax-calc" },
  { label: "GST Calculator", href: "/calculators#gst-calc" },
  { label: "EMI Calculator", href: "/calculators#emi-calc" },
  { label: "HRA Calculator", href: "/calculators#hra-calc" },
  { label: "TDS Calculator", href: "/calculators#tds-calc" },
  { label: "Advance Tax Calculator", href: "/calculators#advance-tax-calc" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const currentPath = router.state.location.pathname;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        scrolled
          ? "bg-primary shadow-elevated border-b border-primary/30"
          : "bg-primary"
      }`}
      data-ocid="navbar"
    >
      {/* Main nav bar */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-[68px]">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-3 group flex-shrink-0"
          data-ocid="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-accent/90 transition-smooth">
            <span className="text-accent-foreground font-display font-extrabold text-lg leading-none">
              P
            </span>
          </div>
          <div>
  <div className="text-white font-display font-bold text-base leading-tight tracking-tight">
    Prasad Tax Consultant
  </div>
  <div className="text-teal-400 text-[10px] font-body tracking-widest uppercase opacity-80">
    Trusted Advisor
  </div>
</div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative">
              {link.hasDropdown ? (
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    currentPath.startsWith(link.href)
                      ? "text-accent"
                      : "text-white hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                  type="button"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  data-ocid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <ChevronDown
                    size={13}
                    className={`transition-smooth ${activeDropdown === link.label ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-smooth block ${
                    (link.href === "/" ? currentPath === "/" : currentPath === link.href)
                      ? "text-accent"
                      : "text-white hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                  data-ocid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Link>
              )}

              {/* Services dropdown */}
              {link.label === "Services" && activeDropdown === "Services" && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-card rounded-xl shadow-elevated border border-border p-2 z-50"
                  onMouseEnter={() => setActiveDropdown("Services")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {SERVICE_DROPDOWN.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted hover:text-accent transition-smooth"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <item.icon
                        size={14}
                        className="text-accent flex-shrink-0"
                      />
                      {item.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Calculators dropdown */}
              {link.label === "Calculators" &&
                activeDropdown === "Calculators" && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-card rounded-xl shadow-elevated border border-border p-2 z-50"
                    onMouseEnter={() => setActiveDropdown("Calculators")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {CALCULATOR_DROPDOWN.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted hover:text-accent transition-smooth"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Calculator
                          size={13}
                          className="text-accent flex-shrink-0"
                        />
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* ── CTA + phone + hamburger ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="tel:+918686457586"
            className="hidden xl:flex items-center gap-1.5 text-primary-foreground/70 hover:text-accent transition-smooth text-sm"
            data-ocid="nav-phone"
          >
            <Phone size={14} />
            <span>+91 8686457586</span>
          </a>
          <Link
            to="/consultation"
            data-ocid="nav-cta"
            className="hidden md:block"
          >
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm text-xs px-4"
            >
              Book Consultation
            </Button>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-md text-primary-foreground hover:bg-primary-foreground/10 transition-smooth focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            type="button"
            data-ocid="nav-hamburger"
          >
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        data-ocid="nav-mobile-menu"
      >
        <div className="bg-primary border-t border-primary-foreground/10 px-4 pb-6 pt-3 overflow-y-auto max-h-[80vh]">
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-3.5 text-base font-medium rounded-lg transition-smooth min-h-[44px] ${
                (link.href === "/" ? currentPath === "/" : currentPath === link.href)
                  ? "text-accent bg-primary-foreground/10"
                  : "text-white hover:text-accent hover:bg-primary-foreground/10"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTA row */}
          <div className="mt-4 pt-4 border-t border-primary-foreground/10 flex flex-col gap-3">
            <Link to="/consultation" onClick={() => setMobileOpen(false)}>
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-12 text-base"
                data-ocid="nav-mobile-cta"
              >
                Book Consultation
              </Button>
            </Link>
            <a
              href="tel:+918686457586"
              className="flex items-center justify-center gap-2 text-primary-foreground/70 hover:text-accent transition-smooth text-sm min-h-[44px]"
            >
              <Phone size={15} />
              <span>+91 8686457586</span>
            </a>
            <a
              href="https://wa.me/918686457586"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-primary-foreground/70 hover:text-accent transition-smooth text-sm min-h-[44px]"
              onClick={() => setMobileOpen(false)}
            >
              <MessageSquare size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
