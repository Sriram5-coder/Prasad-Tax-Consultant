import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Filter,
  Home,
  MessageSquare,
  Phone,
  Receipt,
  Search,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { ServiceCard } from "../components/shared/ServiceCard";
import { ALL_SERVICES, SERVICE_CATEGORIES } from "../data/services";
import type { Service } from "../types";

// Lucide icons for category headers
const CAT_ICON_MAP: Record<string, React.ReactNode> = {
  "income-tax": <FileText size={22} />,
  gst: <Receipt size={22} />,
  registration: <Building2 size={22} />,
  audit: <ClipboardList size={22} />,
  accounting: <BookOpen size={22} />,
  roc: <ClipboardCheck size={22} />,
  licenses: <Award size={22} />,
  advisory: <TrendingUp size={22} />,
};

const CAT_ACCENT: Record<string, string> = {
  "income-tax": "from-blue-600 to-blue-400",
  gst: "from-green-600 to-green-400",
  registration: "from-purple-600 to-purple-500",
  audit: "from-orange-600 to-orange-400",
  accounting: "from-teal-600 to-teal-400",
  roc: "from-indigo-600 to-indigo-400",
  licenses: "from-yellow-500 to-yellow-400",
  advisory: "from-rose-600 to-rose-400",
};

export function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const totalServices = ALL_SERVICES.length;

  const filteredCategories = useMemo(() => {
    return SERVICE_CATEGORIES.map((cat) => ({
      ...cat,
      services: cat.services.filter((s: Service) => {
        const matchesCategory =
          activeCategory === "all" || cat.id === activeCategory;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.benefits.some((b) => b.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
      }),
    })).filter(
      (cat) =>
        cat.services.length > 0 &&
        (activeCategory === "all" || cat.id === activeCategory),
    );
  }, [search, activeCategory]);

  const visibleCount = filteredCategories.reduce(
    (acc, cat) => acc + cat.services.length,
    0,
  );

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="gradient-hero pt-16 pb-14 relative overflow-hidden"
        data-ocid="services-hero"
      >
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(oklch(0.99_0_0)_1px,transparent_1px),linear-gradient(90deg,oklch(0.99_0_0)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-foreground/55 text-sm mb-8"
            aria-label="Breadcrumb"
          >
            <a
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home size={13} />
              Home
            </a>
            <ChevronRight size={13} />
            <span className="text-accent font-medium">Services</span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
                <Star size={10} className="fill-current" />
                {totalServices} Services · 8 Practice Areas
              </span>

              <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
                Our Services
              </h1>
              {/* Gold underline */}
              <div className="w-20 h-1 rounded-full bg-accent mb-6" />

              <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Comprehensive financial and compliance solutions for
                individuals, businesses, and enterprises — all under one trusted
                roof.
              </p>
            </motion.div>

            {/* Search in hero */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-lg"
            >
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Search services… e.g. GST, payroll, audit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 bg-card/95 text-foreground border-border h-12 text-base shadow-elevated"
                data-ocid="services-search"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER BAR ──────────────────────────────── */}
      <div
        className="bg-card border-b border-border sticky top-[64px] z-40 shadow-subtle"
        data-ocid="category-filter-bar"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            <Filter
              size={15}
              className="text-muted-foreground flex-shrink-0 mr-1"
            />
            {/* All button */}
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth flex-shrink-0 border ${
                activeCategory === "all"
                  ? "bg-accent text-accent-foreground border-accent shadow-sm"
                  : "bg-transparent text-primary border-primary/30 hover:bg-primary/8 hover:border-primary"
              }`}
              data-ocid="filter-all"
            >
              All Services ({totalServices})
            </button>

            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth flex-shrink-0 border ${
                  activeCategory === cat.id
                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                    : "bg-transparent text-primary border-primary/30 hover:bg-primary/8 hover:border-primary"
                }`}
                data-ocid={`filter-${cat.id}`}
              >
                {cat.name} ({cat.services.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS COUNT ──────────────────────────────────────── */}
      <div className="bg-muted/40 border-b border-border" ref={gridRef}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {visibleCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {totalServices}
            </span>{" "}
            services
            {search && (
              <span className="ml-1">
                matching{" "}
                <span className="italic text-foreground">"{search}"</span>
              </span>
            )}
          </p>
          {(search || activeCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="text-xs text-accent hover:underline font-medium flex items-center gap-1"
              data-ocid="clear-filters"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── SERVICE GRID ──────────────────────────────────────── */}
      <div className="pb-8">
        <AnimatePresence mode="wait">
          {filteredCategories.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredCategories.map((cat, catIdx) => (
                <section
                  key={cat.id}
                  id={cat.id}
                  className={`py-12 ${catIdx % 2 === 1 ? "section-grey" : "bg-background"}`}
                  data-ocid={`category-section-${cat.id}`}
                >
                  <div className="container mx-auto px-4">
                    {/* Section heading */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="mb-8"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CAT_ACCENT[cat.id] || "from-primary to-primary/70"} flex items-center justify-center text-white shadow-sm`}
                          >
                            {CAT_ICON_MAP[cat.id]}
                          </div>
                          <div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                              {cat.name}
                            </h2>
                            <p className="text-muted-foreground text-sm mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-accent text-accent font-bold text-sm px-3 py-1 flex-shrink-0"
                        >
                          {cat.services.length}{" "}
                          {cat.services.length === 1 ? "service" : "services"}
                        </Badge>
                      </div>
                      {/* Gold separator */}
                      <div className="h-px bg-gradient-to-r from-accent via-accent/40 to-transparent w-full mt-1" />
                    </motion.div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {cat.services.map((service: Service, i: number) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: Math.min(i * 0.06, 0.4),
                            duration: 0.35,
                          }}
                        >
                          <ServiceCard service={service} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
              data-ocid="services-empty"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                No services found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any services matching "{search}". Try different
                keywords or browse all categories.
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="empty-clear-btn"
              >
                View All 54 Services
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
      <section
        className="gradient-hero py-16 relative overflow-hidden"
        data-ocid="services-cta"
      >
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
              <MessageSquare size={12} />
              Not Sure Which Service You Need?
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Let Our Expert CA Guide You
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Not sure where to start? Book a General Guidance Consultation for{" "}
              <span className="font-bold text-accent">₹199</span> — our CA will
              understand your situation and recommend the right path forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/consultation">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-elevated group"
                  data-ocid="cta-book-consultation"
                >
                  Book Consultation — ₹199
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-smooth"
                  />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/30 text-foreground hover:bg-foreground/10 font-semibold"
                  data-ocid="cta-contact"
                >
                  <Phone size={15} className="mr-2" />
                  Talk to Our Tax Consultant
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Users size={15} />
                <span>Trusted by 500+ Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={15} />
                <span>Quick Response Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={15} className="fill-accent text-accent" />
                <span>Qualified Chartered Accountants</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
