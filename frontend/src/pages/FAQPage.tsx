import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { FAQS } from "../data/faqs";
import type { FAQItem } from "../types";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "income-tax", label: "Income Tax" },
  { id: "gst", label: "GST" },
  { id: "registration", label: "Company Registration" },
  { id: "audit", label: "Audit" },
  { id: "accounting", label: "Accounting" },
  { id: "general", label: "General" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "income-tax": "Income Tax",
  gst: "GST",
  registration: "Company Registration",
  audit: "Audit",
  accounting: "Accounting",
  general: "General",
};

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => {
        const key = `${part.slice(0, 8)}-${i}`;
        if (part.toLowerCase() === query.toLowerCase()) {
          return (
            <mark
              key={key}
              className="bg-accent/25 text-accent font-semibold rounded-sm px-0.5 not-italic"
            >
              {part}
            </mark>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </span>
  );
}

function FAQGroup({
  category,
  faqs,
  search,
  index,
}: {
  category: string;
  faqs: FAQItem[];
  search: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-1 w-8 rounded-full bg-accent" />
        <h2 className="font-display text-lg font-bold text-accent tracking-wide uppercase">
          {CATEGORY_LABELS[category] ?? category}
        </h2>
        <Badge
          variant="secondary"
          className="ml-auto text-xs bg-accent/15 text-accent border border-accent/20"
        >
          {faqs.length} {faqs.length === 1 ? "question" : "questions"}
        </Badge>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 + index * 0.06 }}
          >
            <AccordionItem
              value={faq.id}
              className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-subtle hover:border-accent/30 transition-smooth data-[state=open]:border-accent/40"
              data-ocid={`faq-item-${faq.id}`}
            >
              <AccordionTrigger
                className="px-5 py-4 text-left font-medium text-foreground hover:text-accent hover:no-underline data-[state=open]:text-accent data-[state=open]:font-semibold transition-smooth"
                data-ocid={`faq-trigger-${faq.id}`}
              >
                <HighlightedText text={faq.question} query={search} />
              </AccordionTrigger>
              <AccordionContent
                className="px-5 pb-5 pt-0 text-foreground/65 text-sm leading-relaxed border-t border-border/40"
                data-ocid={`faq-content-${faq.id}`}
              >
                <div className="pt-4">
                  <HighlightedText text={faq.answer} query={search} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleClear = useCallback(() => {
    setSearch("");
    setActiveCategory("all");
  }, []);

  const filteredFAQs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQS.filter((f) => {
      const matchCat =
        activeCategory === "all" || f.category === activeCategory;
      const matchSearch =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const grouped = useMemo(() => {
    const order = [
      "income-tax",
      "gst",
      "registration",
      "audit",
      "accounting",
      "general",
    ];
    const map = new Map<string, FAQItem[]>();
    for (const faq of filteredFAQs) {
      const list = map.get(faq.category) ?? [];
      list.push(faq);
      map.set(faq.category, list);
    }
    return order
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, faqs: map.get(cat)! }));
  }, [filteredFAQs]);

  const hasResults = filteredFAQs.length > 0;
  const isFiltered = search.trim() !== "" || activeCategory !== "all";

  return (
    <div>
      {/* Hero */}
      <section
        className="gradient-hero py-20 md:py-28 relative overflow-hidden"
        data-ocid="faq-hero"
      >
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-accent/5 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-accent/8 pointer-events-none"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-6">
              <HelpCircle size={14} />
              Knowledge Base
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Frequently Asked
              <span className="block text-accent">Questions</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Find instant answers to {FAQS.length}+ common questions about
              taxes, GST, company registration, audits, and more.
            </p>
            <div
              className="max-w-xl mx-auto relative"
              data-ocid="faq-search-wrapper"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
              />
              <Input
                placeholder="Search questions — try 'capital gains' or 'GST registration'…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-10 h-12 bg-card text-foreground rounded-xl border-border/60 shadow-elevated text-base focus-visible:ring-2 focus-visible:ring-accent placeholder:text-muted-foreground"
                data-ocid="faq-search"
                aria-label="Search FAQs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Clear search"
                  data-ocid="faq-search-clear"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {isFiltered && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-foreground/50 text-sm"
                data-ocid="faq-result-count"
              >
                {hasResults
                  ? `${filteredFAQs.length} result${filteredFAQs.length !== 1 ? "s" : ""} found`
                  : "No results found"}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 bg-background" data-ocid="faq-content">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Category Tabs */}
          <div
            className="flex flex-wrap gap-2 mb-10"
            role="tablist"
            aria-label="FAQ categories"
            data-ocid="faq-filters"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={[
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-card text-foreground/65 border border-border hover:border-accent/40 hover:text-accent hover:bg-accent/8",
                  ].join(" ")}
                  data-ocid={`faq-filter-${cat.id}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Result summary */}
          {isFiltered && hasResults && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-accent/8 border border-accent/20 rounded-lg px-4 py-2.5 mb-8"
              data-ocid="faq-summary"
            >
              <span className="text-sm text-accent font-medium">
                Showing <strong>{filteredFAQs.length}</strong>{" "}
                {filteredFAQs.length === 1 ? "result" : "results"}
                {search && (
                  <>
                    {" "}
                    for <em>"{search}"</em>
                  </>
                )}
                {activeCategory !== "all" && (
                  <>
                    {" "}
                    in <em>{CATEGORY_LABELS[activeCategory]}</em>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-foreground/50 hover:text-accent underline underline-offset-2 transition-colors"
                data-ocid="faq-reset"
              >
                Clear filters
              </button>
            </motion.div>
          )}

          {/* FAQ list or empty state */}
          {hasResults ? (
            grouped.map(({ category, faqs }, i) => (
              <FAQGroup
                key={category}
                category={category}
                faqs={faqs}
                search={search}
                index={i}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
              data-ocid="faq-empty"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-card border border-border rounded-full mb-6">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No questions found
              </h3>
              <p className="text-foreground/60 mb-2 max-w-sm mx-auto">
                We couldn't find anything matching{" "}
                {search && <strong>"{search}"</strong>}. Try different keywords
                or browse all categories.
              </p>
              <p className="text-foreground/40 text-sm mb-6">
                Still can't find your answer?{" "}
                <a
                  href="/contact"
                  className="text-accent underline underline-offset-2"
                >
                  Contact our experts directly.
                </a>
              </p>
              <Button
                onClick={handleClear}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid="faq-empty-reset"
              >
                View All Questions
              </Button>
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl overflow-hidden"
            data-ocid="faq-cta"
          >
            <div className="gradient-hero px-8 py-10 text-center border border-border/40 rounded-2xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 border border-accent/30 mb-5">
                <HelpCircle size={26} className="text-accent" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                Still have questions?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Our Chartered Accountants are ready to answer your specific
                queries. Book a consultation or reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+918686457586"
                  className="inline-flex items-center gap-2.5 bg-card text-foreground hover:bg-card/80 border border-border transition-smooth font-semibold px-6 py-3 rounded-xl"
                  data-ocid="faq-cta-phone"
                >
                  <Phone size={18} className="text-accent" />
                  +91 86864 57586
                </a>
                <a
                  href="https://wa.me/8686457586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-smooth font-semibold px-6 py-3 rounded-xl"
                  data-ocid="faq-cta-whatsapp"
                >
                  <MessageCircle size={18} />
                  WhatsApp Us
                </a>
                <a
                  href="/consultation"
                  className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold px-6 py-3 rounded-xl"
                  data-ocid="faq-cta-consult"
                >
                  <CalendarCheck size={18} />
                  Book Consultation
                </a>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 divide-x divide-border/40 text-center bg-card/40 rounded-xl border border-border/40">
                {[
                  { value: "54+", label: "Services Offered" },
                  { value: "24 hrs", label: "Response Time" },
                  { value: "Hyderabad", label: "Based In" },
                ].map((stat) => (
                  <div key={stat.label} className="py-5 px-4">
                    <div className="font-display text-xl font-bold text-accent">
                      {stat.value}
                    </div>
                    <div className="text-white/80 text-xs mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
