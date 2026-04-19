import type { Testimonial as BackendTestimonial } from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  Globe,
  HandshakeIcon,
  Headphones,
  IndianRupee,
  Landmark,
  MessageSquare,
  Phone,
  Receipt,
  RefreshCw,
  Scale,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetTestimonials } from "../hooks/useQueries";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Static Data                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

const SERVICE_CATEGORIES = [
  {
    id: "income-tax",
    icon: FileText,
    name: "Income Tax",
    desc: "ITR filing, notices & appeals",
  },
  {
    id: "gst",
    icon: Receipt,
    name: "GST Services",
    desc: "Registration, returns & audits",
  },
  {
    id: "registration",
    icon: Building2,
    name: "Business Registration",
    desc: "Pvt Ltd, LLP, OPC & more",
  },
  {
    id: "audit",
    icon: ClipboardList,
    name: "Audit Services",
    desc: "Statutory, tax & due diligence",
  },
  {
    id: "accounting",
    icon: BookOpen,
    name: "Accounting & CFO",
    desc: "Bookkeeping & virtual CFO",
  },
  {
    id: "roc",
    icon: Scale,
    name: "ROC & Company Law",
    desc: "ROC filings & compliance",
  },
  {
    id: "licenses",
    icon: BadgeCheck,
    name: "Licenses & Registrations",
    desc: "FSSAI, IEC, ESI, PF & more",
  },
  {
    id: "advisory",
    icon: TrendingUp,
    name: "Advisory Services",
    desc: "Valuation, M&A & investment",
  },
];

const WHY_US = [
  {
    icon: Briefcase,
    title: "Expert Tax Consultant Team",
    desc: "Professionals with deep expertise across all financial and legal domains.",
  },
  {
    icon: Zap,
    title: "Quick Turnaround",
    desc: "Average 3-day TAT — we never miss a deadline, ever. Your timeline is our priority.",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "Fixed quotes upfront — no hidden charges, no surprise invoices, ever.",
  },
  {
    icon: Globe,
    title: "Digital-First Process",
    desc: "Paperless workflow, e-signatures & real-time status updates from anywhere in India.",
  },
  {
    icon: FileCheck,
    title: "100% Compliance",
    desc: "Zero-penalty record maintained — we know the rules so you never have to worry.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Your own Tax Consultant as a single point of contact — always reachable, always accountable.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Reach Out",
    desc: "Fill our consultation form or call/WhatsApp us directly — no waiting, no gatekeeping.",
  },
  {
    num: "02",
    icon: Users,
    title: "Book Consultation",
    desc: "Service-specific guidance, or ₹199 general deep-dive for complex questions.",
  },
  {
    num: "03",
    icon: FileText,
    title: "Get Proposal",
    desc: "Transparent fixed-fee proposal within 24 hours — no surprises.",
  },
  {
    num: "04",
    icon: HandshakeIcon,
    title: "We Handle It",
    desc: "Sit back while we manage everything end-to-end, completely digitally.",
  },
];

const TRUST_BADGES = [
  // { icon: Shield, text: "ICAI Registered Firm" },
  { icon: Award, text: "9+ Years Experience" },
  { icon: Clock, text: "3-Day Average TAT" },
  { icon: Users, text: "100+ Clients Served" },
  { icon: Landmark, text: "Pan India Coverage" },
  { icon: BarChart3, text: "54 Services Offered" },
  { icon: RefreshCw, text: "Zero Penalty Record" },
];

const CALC_TOOLS = [
  { name: "Income Tax", hash: "#income-tax-calc", emoji: "📊" },
  { name: "GST Calculator", hash: "#gst-calc", emoji: "🧾" },
  { name: "EMI Calculator", hash: "#emi-calc", emoji: "🏦" },
  { name: "HRA Calculator", hash: "#hra-calc", emoji: "🏠" },
  { name: "TDS Calculator", hash: "#tds-calc", emoji: "📋" },
  { name: "Advance Tax", hash: "#advance-tax-calc", emoji: "📅" },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* AnimatedCounter                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function useCountUp(target: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, enabled]);
  return count;
}

function StatCard({
  numericValue,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  numericValue: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(numericValue, 2000, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl p-7 text-center bg-card border border-border group transition-smooth hover:-translate-y-1 hover:shadow-elevated"
      data-ocid="stat-card"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-accent/10 group-hover:scale-105 transition-smooth">
        <Icon size={22} className="text-accent" />
      </div>
      <div className="font-display text-4xl font-bold mb-1 text-accent">
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="text-xs font-bold tracking-widest uppercase mt-1 text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Testimonials                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useGetTestimonials();
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(
    () => setActive((p) => (p - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, total]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="flex gap-2 justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
        data-ocid="testimonials-empty"
      >
        <div className="rounded-2xl p-12 bg-card border border-border border-l-4 border-l-accent">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="font-display font-bold text-2xl text-foreground mb-3">
            Be Our First Reviewer
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We're building our review base — honest, real feedback from real
            clients. If you've worked with us, we'd love to hear your story.
          </p>
          <Link to="/testimonials" data-ocid="leave-review-cta">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6">
              Share Your Experience
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const t = testimonials[active] as BackendTestimonial;
  const ratingNum = t.rating != null ? Number(t.rating) : 0;

  return (
    <div className="max-w-3xl mx-auto" data-ocid="testimonials-carousel">
      <div className="rounded-2xl p-8 relative min-h-[260px] bg-card border border-border border-l-4 border-l-accent shadow-elevated">
        <div className="font-display text-7xl font-bold leading-none mb-3 select-none text-accent/25">
          "
        </div>
        <p className="text-lg leading-relaxed mb-6 italic text-foreground/80 pl-2">
          {t.feedback}
        </p>
        {ratingNum > 0 && (
          <div className="flex gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((starNum) => (
              <Star
                key={`star-${active}-${starNum}`}
                size={16}
                className={
                  starNum <= ratingNum
                    ? "text-accent fill-accent"
                    : "text-border"
                }
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg bg-accent/10 text-accent border-2 border-accent/20">
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-foreground">{t.name}</div>
            <div className="text-sm text-muted-foreground">
              {t.industry} · {t.company}
            </div>
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth hover:scale-105 bg-card border border-border text-muted-foreground hover:text-accent hover:border-accent/40"
            data-ocid="testimonial-prev"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((testimonialItem, dotIdx) => (
              <button
                type="button"
                key={String(testimonialItem.id ?? dotIdx)}
                onClick={() => setActive(dotIdx)}
                aria-label={`Go to testimonial ${dotIdx + 1}`}
                className="rounded-full transition-smooth"
                style={{
                  width: dotIdx === active ? "24px" : "10px",
                  height: "10px",
                  background:
                    dotIdx === active
                      ? "oklch(var(--accent))"
                      : "oklch(var(--border))",
                }}
                data-ocid={`testimonial-dot-${dotIdx}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth hover:scale-105 bg-card border border-border text-muted-foreground hover:text-accent hover:border-accent/40"
            data-ocid="testimonial-next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Section Header helper                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-14"
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-3 text-accent">
        {eyebrow}
      </span>
      <h2
        className="font-display font-bold heading-accent inline-block text-foreground"
        style={{
          fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg mt-8 max-w-2xl mx-auto text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Page                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="bg-background">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center gradient-hero"
        data-ocid="hero-section"
      >
        {/* Radial teal glow */}
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.53 0.1 182 / 0.08) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
            >
              {/* <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-8 bg-accent/15 border border-accent/30 text-accent">
                <Shield size={13} />
                ICAI Registered · Est. 2005 · Hyderabad
              </div> */}

              <h1
                className="font-display font-bold leading-[1.1] mb-6 text-white"
                style={{
                  fontSize: "clamp(2.6rem, 5vw, 4rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Your Trusted Partner
                <br className="hidden sm:block" /> in{" "}
                <span className="relative inline-block">
                  <span className="text-accent">Financial</span>
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] rounded-full bg-accent/50" />
                </span>{" "}
                Excellence
              </h1>

              <p
                className="text-xl font-semibold mb-3"
                style={{ color: "oklch(0.85 0.01 264)" }}
              >
                Prasad Tax Consultant — Trusted Advisor
              </p>
              <p
                className="text-base leading-relaxed mb-10 max-w-xl"
                style={{ color: "oklch(0.68 0.01 264)" }}
              >
                9+ years of precision-driven financial solutions across
                Hyderabad and pan India. From ITR filing to M&amp;A advisory —
                Big 4 quality with boutique personal attention.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/consultation" data-ocid="hero-cta-primary">
                  <Button
                    size="lg"
                    className="font-bold px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-charcoal"
                  >
                    Book a Consultation
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/services" data-ocid="hero-cta-secondary">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 text-base font-semibold border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div
                className="flex flex-wrap items-center gap-5 text-sm font-medium"
                style={{ color: "oklch(0.58 0.01 264)" }}
              >
                {[
                  // { icon: BadgeCheck, label: "ICAI Registered" },
                  { icon: Users, label: "100+ Clients" },
                  { icon: Award, label: "9+ Yrs Experience" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={16} className="text-accent" />
                    <span style={{ color: "oklch(0.72 0.01 264)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Hero image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-charcoal border border-accent/15">
                <div className="w-full h-[500px] bg-gradient-to-br from-primary/80 via-accent/60 to-primary/40 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-card/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-card/30">
                      <Briefcase className="w-10 h-10 text-card" />
                    </div>
                    <p className="text-card/90 font-display text-xl font-semibold">
                      Prasad Tax Consultant Works
                    </p>
                    <p className="text-card/70 text-sm mt-1">
                      Trusted Advisor · Hyderabad
                    </p>
                  </div>
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.23 0.05 264 / 0.6) 0%, transparent 60%)",
                  }}
                />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-5 -left-8 rounded-xl p-4 bg-card border border-border shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/10">
                    <Users size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-foreground">
                      100+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Clients Served
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="absolute -top-4 -right-4 rounded-xl p-3 bg-card border border-border shadow-elevated"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    Newer Missed Deadline
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute top-1/2 -left-10 rounded-xl p-3 bg-card border border-border shadow-elevated -translate-y-1/2"
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-accent" />
                  <span className="text-xs font-bold text-foreground">
                    Zero-Penalty Record
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/40" data-ocid="stats-section">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Proven Track Record"
            title="Our Numbers Speak"
            subtitle="Real impact built over 9+ years of trusted financial service"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard
              numericValue={100}
              suffix="+"
              label="Clients Served"
              icon={Users}
              delay={0}
            />
            <StatCard
              numericValue={9}
              suffix="+"
              label="Years Experience"
              icon={Award}
              delay={0.1}
            />
            <StatCard
              numericValue={54}
              suffix=""
              label="Services Offered"
              icon={FileText}
              delay={0.2}
            />
            <StatCard
              numericValue={0}
              // suffix="+"
              label="Deadlines Missed"
              icon={CheckCircle2}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── TRUST MARQUEE ────────────────────────────────────────────────── */}
      <section
        className="py-8 overflow-hidden bg-card border-y border-border"
        data-ocid="trust-badges"
      >
        <div className="container mx-auto px-4 mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted &amp; Certified
          </p>
        </div>
        <div className="relative">
          <div
            className="flex gap-3 animate-[marquee_28s_linear_infinite]"
            style={{ width: "max-content" }}
          >
            {[...TRUST_BADGES, ...TRUST_BADGES].map(
              ({ icon: Icon, text }, i) => (
                <div
                  key={`badge-${i}-${text}`}
                  className="flex-shrink-0 flex items-center gap-3 rounded-xl px-6 py-3 mx-2 bg-background border border-border border-b-2 border-b-accent/40"
                >
                  <Icon size={17} className="flex-shrink-0 text-accent" />
                  <span className="font-semibold text-sm whitespace-nowrap text-foreground">
                    {text}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
        {/* marquee animation defined in index.css */}
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
      <section className="py-24 bg-background" data-ocid="services-grid">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="54 Services · 8 Practice Areas"
            title="Comprehensive Financial Services"
            subtitle="Everything your business needs — under one trusted roof"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <a
                    href={`/services#${cat.id}`}
                    className="block group"
                    data-ocid={`service-cat-${cat.id}`}
                  >
                    <div className="relative rounded-2xl p-6 overflow-hidden cursor-pointer transition-smooth h-full hover:-translate-y-1 hover:shadow-elevated bg-card border border-border border-l-4 border-l-accent/40 group-hover:border-l-accent">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none rounded-2xl"
                        style={{
                          background:
                            "radial-gradient(ellipse at top left, oklch(0.53 0.1 182 / 0.04) 0%, transparent 70%)",
                        }}
                      />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-smooth group-hover:scale-105 bg-accent/10">
                        <Icon size={23} className="text-accent" />
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug mb-2 text-foreground">
                        {cat.name}
                      </h3>
                      <p className="text-xs leading-relaxed mb-4 text-muted-foreground">
                        {cat.desc}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-bold transition-smooth group-hover:gap-2 text-accent">
                        Explore <ArrowRight size={12} />
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" data-ocid="view-all-services">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold px-8 border-accent/40 text-accent hover:bg-accent/5 hover:border-accent"
              >
                View All 54 Services
                <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/40" data-ocid="why-us">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Why Clients Stay"
            title="Why 100+ Clients Trust Us"
            subtitle="Deep expertise combined with a relentless client-first approach"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl p-6 transition-smooth hover:-translate-y-1 hover:shadow-elevated bg-card border border-border border-l-4 border-l-accent/40 hover:border-l-accent"
                data-ocid={`why-us-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-smooth group-hover:scale-105 bg-accent/10">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background" data-ocid="testimonials-section">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Client Stories"
            title="What Our Clients Say"
            subtitle="Real stories from real clients — shared directly through our platform"
          />
          <TestimonialsSection />
          <div className="text-center mt-10">
            <Link to="/testimonials" data-ocid="share-feedback-cta">
              <Button
                variant="outline"
                className="font-semibold border-accent/40 text-accent hover:bg-accent/5 hover:border-accent"
              >
                Share Your Feedback
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS STEPS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/40" data-ocid="process-section">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Simple Onboarding"
            title="How It Works"
            subtitle="Getting started is effortless — designed entirely for your convenience"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0 bg-accent/20" />
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative z-10 flex flex-col items-center text-center"
                  data-ocid={`process-step-${i + 1}`}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative bg-accent/10 border-2 border-accent/30">
                    <Icon size={28} className="text-accent" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-accent text-accent-foreground">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-[190px] text-muted-foreground">
                    {step.desc}
                  </p>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:flex absolute top-9 -right-3 z-20 w-6 h-6 items-center justify-center text-accent/60">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden gradient-hero"
        data-ocid="cta-section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.53 0.1 182 / 0.1) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-8 bg-accent/15 border border-accent/30 text-accent">
              <Calendar size={14} />
              Limited Slots Available This Week
            </div>

            <h2
              className="font-display font-bold mb-6 max-w-3xl mx-auto leading-tight text-white"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Ready to Get Started?{" "}
              <span className="text-accent">Book a Consultation</span> Today
            </h2>

            {/* Two consultation options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
              <div className="rounded-xl p-5 text-left bg-white/5 border border-white/15 hover:bg-white/10 transition-smooth">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2
                    size={18}
                    className="text-accent flex-shrink-0"
                  />
                  <span className="font-bold text-white text-sm">
                    General Guidance
                  </span>
                  <span className="ml-auto text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.65 0.01 264)" }}
                >
                  Not sure where to start? Our Tax Consultant will guide you — tax,
                  compliance, business setup — all covered.
                </p>
              </div>
              <div className="rounded-xl p-5 text-left bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-smooth">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee
                    size={18}
                    className="text-accent flex-shrink-0"
                  />
                  <span className="font-bold text-white text-sm">
                    Paid Guidance
                  </span>
                  <span className="ml-auto text-xs font-bold text-white bg-accent/60 px-2 py-0.5 rounded-full">
                    ₹199
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.65 0.01 264)" }}
                >
                  You know which service you need — let's get started directly
                  with a brief discussion.
                  
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Link to="/consultation" data-ocid="cta-book-btn">
                <Button
                  size="lg"
                  className="font-bold px-10 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-charcoal"
                >
                  <Calendar size={18} className="mr-2" />
                  Book a Consultation
                </Button>
              </Link>
              <a href="tel:+919876543210" data-ocid="cta-call-btn">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-base font-semibold border-white/30 text-white bg-transparent hover:bg-white/10"
                >
                  <Phone size={16} className="mr-2" />
                  Call Us Directly
                </Button>
              </a>
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
              style={{ color: "oklch(0.55 0.01 264)" }}
            >
              {[
                "Service-Specific Guidance — Free",
                "General Deep-Dive — ₹199",
                "Expert Tax Consultant Team",
                "Quick Response Guaranteed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CALCULATOR TEASER ────────────────────────────────────────────── */}
      <section className="py-20 bg-background" data-ocid="tools-teaser">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Free Tools"
            title="Financial Calculator Suite"
            subtitle="Instant calculations for Income Tax, GST, EMI, HRA, TDS & more"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {CALC_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <a href={`/calculators${tool.hash}`} className="block group">
                  <div
                    className="rounded-xl p-5 text-center transition-smooth group-hover:-translate-y-1 group-hover:shadow-elevated bg-card border border-border hover:border-accent/40"
                    data-ocid={`tool-teaser-${i}`}
                  >
                    <div className="text-3xl mb-3">{tool.emoji}</div>
                    <div className="font-semibold text-sm mb-2 text-foreground">
                      {tool.name}
                    </div>
                    <div className="text-xs flex items-center justify-center gap-1 font-bold transition-smooth group-hover:gap-2 text-accent">
                      Try Now <ArrowRight size={10} />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/calculators" data-ocid="all-tools-link">
              <Button
                variant="outline"
                className="font-semibold border-accent/40 text-accent hover:bg-accent/5 hover:border-accent"
              >
                View All Calculators <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
