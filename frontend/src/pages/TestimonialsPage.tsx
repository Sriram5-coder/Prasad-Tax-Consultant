import type { Testimonial } from "@/hooks/useQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Quote,
  Send,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetTestimonials, useSubmitTestimonial } from "../hooks/useQueries";

const INDUSTRIES = [
  "IT & Software", "Manufacturing", "Retail & E-Commerce", "Real Estate",
  "Healthcare", "Education", "Finance & Banking", "Food & Hospitality",
  "Logistics & Transport", "Other",
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`transition-smooth ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star size={20} className={n <= display ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
        </button>
      ))}
    </div>
  );
}

// ─── Carousel (same style as HomePage) ───────────────────────────────────────

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, total]);

  const t = testimonials[active];
  const ratingNum = t?.rating != null ? Number(t.rating) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl p-8 relative min-h-[260px] bg-card border border-border border-l-4 border-l-accent shadow-elevated">
        <div className="font-display text-7xl font-bold leading-none mb-3 select-none text-accent/25">"</div>
        <p className="text-lg leading-relaxed mb-6 italic text-foreground/80 pl-2">
          {t?.feedback}
        </p>
        {ratingNum > 0 && (
          <div className="flex gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={`star-${active}-${n}`} size={16}
                className={n <= ratingNum ? "text-accent fill-accent" : "text-border"} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg bg-accent/10 text-accent border-2 border-accent/20">
            {t?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-foreground">{t?.name}</div>
            <div className="text-sm text-muted-foreground">
              {[t?.industry, t?.company].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button type="button" onClick={prev} aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth hover:scale-105 bg-card border border-border text-muted-foreground hover:text-accent hover:border-accent/40">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, dotIdx) => (
              <button type="button" key={dotIdx} onClick={() => setActive(dotIdx)}
                aria-label={`Go to testimonial ${dotIdx + 1}`}
                className="rounded-full transition-smooth"
                style={{
                  width: dotIdx === active ? "24px" : "10px",
                  height: "10px",
                  background: dotIdx === active ? "oklch(var(--accent))" : "oklch(var(--border))",
                }} />
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next testimonial"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth hover:scale-105 bg-card border border-border text-muted-foreground hover:text-accent hover:border-accent/40">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Feedback Form ────────────────────────────────────────────────────────────

type FormState = { name: string; company: string; industry: string; feedback: string; rating: number };
const initialForm: FormState = { name: "", company: "", industry: "", feedback: "", rating: 0 };

function FeedbackForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitTestimonial();

  const set = (key: keyof FormState, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.feedback.trim()) {
      toast.error("Name and feedback are required.");
      return;
    }
    try {
      await submit.mutateAsync({ ...form, rating: form.rating || undefined });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  if (submitted) {
    return (
      <Card className="border-accent/30">
        <CardContent className="p-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">Thank you for your feedback!</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your review will appear on this page once verified by our team.
            </p>
          </div>
          <Button variant="outline" size="sm"
            className="border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => { setForm(initialForm); setSubmitted(false); }}>
            Submit another review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/20">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Share Your Experience</h3>
            <p className="text-muted-foreground text-sm">Your feedback helps others find trustworthy CA services.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="t-name">
                Your Name <span className="text-destructive">*</span>
              </label>
              <input id="t-name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Rajesh Kumar" required
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="t-company">Company / Organisation</label>
              <input id="t-company" type="text" value={form.company} onChange={(e) => set("company", e.target.value)}
                placeholder="Your Company"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="t-industry">Industry</label>
            <select id="t-industry" value={form.industry} onChange={(e) => set("industry", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth">
              <option value="">Select your industry (optional)</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm font-medium text-foreground">Rating (optional)</div>
            <StarRating value={form.rating} onChange={(v) => set("rating", v)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="t-feedback">
              Your Feedback <span className="text-destructive">*</span>
            </label>
            <Textarea id="t-feedback" value={form.feedback} onChange={(e) => set("feedback", e.target.value)}
              placeholder="Share how Prasad Tax Consultant helped you…" rows={4} className="resize-none" required />
          </div>
          <Button type="submit" disabled={submit.isPending}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
            {submit.isPending ? "Submitting…" : <><Send size={15} className="mr-2" />Submit Feedback</>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            All feedback is verified before publishing. No fake reviews.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function TestimonialsPage() {
  const { data: testimonials, isLoading } = useGetTestimonials();

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 text-xs uppercase tracking-widest">
              Client Voices
            </Badge>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
              What Our Clients Say
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              Real stories from real clients — shared directly through our platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notice strip */}
      <div className="bg-accent/5 border-b border-accent/10 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 size={15} className="text-accent flex-shrink-0" />
          <span>All testimonials are submitted by real clients and reviewed before publishing. No fake ratings.</span>
        </div>
      </div>

      {/* Testimonials carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <div className="flex gap-2 justify-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ) : !testimonials || testimonials.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">No client reviews yet — be our first!</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Share your experience below and help others find trustworthy CA services.
              </p>
            </div>
          ) : (
            <>
              {/* Stats bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                <div className="text-center">
                  <div className="font-display font-bold text-3xl text-foreground">{testimonials.length}</div>
                  <div className="text-sm text-muted-foreground">Verified Reviews</div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="font-display font-bold text-3xl text-foreground flex items-center justify-center gap-1">
                    {(() => {
                      const rated = testimonials.filter(t => t.rating && Number(t.rating) > 0);
                      if (rated.length === 0) return "—";
                      const avg = rated.reduce((sum, t) => sum + Number(t.rating), 0) / rated.length;
                      return avg.toFixed(1);
                    })()}
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="font-display font-bold text-3xl text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground">Verified Clients</div>
                </div>
              </div>

              {/* Carousel — same as HomePage */}
              <TestimonialsCarousel testimonials={testimonials} />
            </>
          )}
        </div>
      </section>

      {/* Feedback form */}
      <section className="section-grey py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">Worked With Us?</h2>
            <p className="text-muted-foreground">
              Share your experience — it helps others make informed decisions when choosing a CA.
            </p>
          </motion.div>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}
