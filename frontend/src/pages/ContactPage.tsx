import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactLead } from "@/hooks/useQueries";
import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ContactFormData } from "../types";

const SUBJECTS = [
  "Income Tax Query",
  "GST Query",
  "Business Registration",
  "Audit Services",
  "Accounting",
  "General Inquiry",
  "Other",
];

const OFFICE_HOURS = [
  { day: "Monday", hours: "9:00 AM – 6:00 PM" },
  { day: "Tuesday", hours: "9:00 AM – 6:00 PM" },
  { day: "Wednesday", hours: "9:00 AM – 6:00 PM" },
  { day: "Thursday", hours: "9:00 AM – 6:00 PM" },
  { day: "Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 2:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: "#", color: "bg-[#0077B5]" },
  { icon: Facebook, label: "Facebook", href: "#", color: "bg-[#1877F2]" },
  { icon: Twitter, label: "Twitter / X", href: "#", color: "bg-[#1DA1F2]" },
  {
    icon: Instagram,
    label: "Instagram",
    href: "#",
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
  },
];

const todayIndex = new Date().getDay();
const hoursHighlightIndex = todayIndex === 0 ? 6 : todayIndex - 1;

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const submitLead = useSubmitContactLead();

  const update = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 20)
      newErrors.message = "Message must be at least 20 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitLead.mutateAsync(form);
      setSubmitted(true);
      toast.success("Message sent! We'll respond within 24 hours.");
    } catch {
      toast.error(
        "Failed to send message. Please try again or call us directly.",
      );
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="gradient-hero py-24 relative overflow-hidden"
        data-ocid="contact-hero"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-1/4 w-64 h-64 rounded-full border border-accent/40" />
          <div className="absolute bottom-4 left-1/3 w-40 h-40 rounded-full border border-accent/30" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 mb-5">
              <Mail size={14} className="text-accent" />
              <span className="text-accent text-sm font-medium">
                Contact Us
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Get in Touch
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              Reach out with any query — our team at Prasad Tax Consultant is ready to
              help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Two-Column Section */}
      <section className="py-16 bg-background" data-ocid="contact-main">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* LEFT: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div
                  className="bg-card rounded-2xl border border-border p-12 text-center h-full flex flex-col items-center justify-center shadow-subtle"
                  data-ocid="contact-success"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 size={40} className="text-accent" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    Thank You!
                  </h3>
                  <p className="text-foreground/65 text-base max-w-sm mb-2">
                    We'll get back to you within{" "}
                    <strong className="text-foreground">24 hours</strong>.
                  </p>
                  <p className="text-foreground/50 text-sm mb-8">
                    We'll respond to{" "}
                    <span className="text-accent font-medium">
                      {form.email}
                    </span>
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(EMPTY_FORM);
                    }}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10"
                    data-ocid="send-another-btn"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl border border-border p-8 shadow-subtle"
                  data-ocid="contact-form"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    Send Us a Message
                  </h2>
                  <p className="text-foreground/55 text-sm mb-6">
                    Fill out the form and our team will get back to you within
                    one business day.
                  </p>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-name" className="text-foreground/80">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-name"
                        placeholder="Rajesh Kumar"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${errors.name ? "border-destructive" : ""}`}
                        data-ocid="contact-name"
                      />
                      {errors.name && (
                        <p className="text-destructive text-xs">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-phone" className="text-foreground/80">
                        Phone Number
                      </Label>
                      <Input
                        id="c-phone"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        data-ocid="contact-phone"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="c-email" className="text-foreground/80">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-email"
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
                        data-ocid="contact-email"
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="c-subject" className="text-foreground/80">
                        Subject
                      </Label>
                      <Select onValueChange={(v) => update("subject", v)}>
                        <SelectTrigger
                          id="c-subject"
                          className="bg-background border-border text-foreground"
                          data-ocid="contact-subject"
                        >
                          <SelectValue placeholder="What is this regarding?" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {SUBJECTS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-foreground hover:bg-accent/10 focus:bg-accent/10"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="c-msg" className="text-foreground/80">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="c-msg"
                        placeholder="Describe your query in detail (minimum 20 characters)..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={`bg-background border-border text-foreground placeholder:text-muted-foreground resize-none ${errors.message ? "border-destructive" : ""}`}
                        data-ocid="contact-message"
                      />
                      <div className="flex justify-between items-center">
                        {errors.message ? (
                          <p className="text-destructive text-xs">
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {form.message.length} chars
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-subtle transition-smooth"
                    disabled={submitLead.isPending}
                    data-ocid="contact-submit"
                  >
                    {submitLead.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-foreground/40 mt-3">
                    We respect your privacy. Your information will never be
                    shared.
                  </p>
                </form>
              )}
            </motion.div>

            {/* RIGHT: Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Address */}
              <div
                className="bg-card border border-border rounded-xl p-5 hover-lift"
                data-ocid="contact-card-address"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                      Office
                    </p>
                    <p className="text-foreground text-sm font-medium leading-relaxed">
                      Prasad Tax Consultant
                      <br />
                      Kukatpally, Hyderabad, Telangana
                    </p>
                    <p className="text-xs text-accent font-medium mt-1">
                      By appointment only
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div
                className="bg-card border border-border rounded-xl p-5 hover-lift"
                data-ocid="contact-card-phone"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+918686457586"
                      className="block text-foreground text-sm font-medium hover:text-accent transition-smooth"
                    >
                      +91 86864 57586
                    </a>
                    <p className="text-xs text-foreground/40 mt-1.5">
                      Mon–Sat: 9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                className="bg-card border border-border rounded-xl p-5 hover-lift"
                data-ocid="contact-card-email"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:prasadnagulakonda25@gmail.com"
                      className="block text-foreground text-sm font-medium hover:text-accent transition-smooth truncate"
                    >
                      prasadnagulakonda25@gmail.com
                    </a>
                    <p className="text-xs text-foreground/40 mt-1.5">
                      Usually within 4 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div
                className="bg-card border border-border rounded-xl p-5 hover-lift"
                data-ocid="contact-card-whatsapp"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">
                      WhatsApp
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      Chat with us on WhatsApp
                    </p>
                    <p className="text-foreground/60 text-sm">
                      +91 86864 57586
                    </p>
                    <a
                      href="https://wa.me/918686457586"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="whatsapp-open-btn"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2.5 border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] transition-smooth"
                      >
                        <MessageCircle size={14} className="mr-1.5" />
                        Open WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section-grey py-12" data-ocid="contact-map">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-subtle"
          >
            <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-accent/5 via-background to-card relative">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(0.65 0.22 170 / 0.4) 1px,transparent 1px),linear-gradient(90deg,oklch(0.65 0.22 170 / 0.4) 1px,transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={26} className="text-accent" />
                </div>
                <p className="font-display text-xl font-bold text-foreground">
                  Hyderabad, Telangana
                </p>
                <p className="text-foreground/55 text-sm mb-4">
                  Prasad Tax Consultant — serving clients across Hyderabad &amp;
                  pan-India
                </p>
                <a
                  href="https://maps.google.com/?q=Hyderabad+Telangana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:underline transition-smooth"
                  data-ocid="view-map-link"
                >
                  <ExternalLink size={14} />
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social + Office Hours */}
      <section className="py-14 bg-background" data-ocid="contact-social-hours">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-2 heading-accent">
                Follow Us
              </h3>
              <p className="text-foreground/55 text-sm mb-6 mt-3">
                Stay updated with the latest tax news, regulatory changes, and
                financial insights.
              </p>
              <div className="flex flex-wrap gap-4">
                {SOCIALS.map(({ icon: Icon, label, href, color }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-ocid={`social-${label.toLowerCase().replace(/[^a-z]/g, "")}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.12, y: -3 }}
                    className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-subtle cursor-pointer transition-smooth`}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
              <div className="mt-6 p-4 bg-card border border-border/60 rounded-xl">
                <p className="text-sm text-foreground/60">
                  <span className="font-medium text-foreground">
                    @prasadcaworks
                  </span>{" "}
                  — Follow us for daily tax tips, deadline reminders, and
                  compliance updates.
                </p>
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-2 heading-accent">
                Office Hours
              </h3>
              <p className="text-foreground/55 text-sm mb-5 mt-3">
                Walk-ins by appointment only. Call or WhatsApp to schedule a
                visit.
              </p>
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-subtle">
                {OFFICE_HOURS.map(({ day, hours }, i) => {
                  const isToday = i === hoursHighlightIndex;
                  const isClosed = hours === "Closed";
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between px-5 py-3 text-sm ${
                        isToday
                          ? "bg-accent/10 border-l-4 border-accent"
                          : "border-l-4 border-transparent"
                      } ${i < OFFICE_HOURS.length - 1 ? "border-b border-border/40" : ""}`}
                      data-ocid={`hours-row-${day.toLowerCase()}`}
                    >
                      <span
                        className={`font-medium ${isToday ? "text-accent" : "text-foreground"}`}
                      >
                        {day}
                        {isToday && (
                          <span className="ml-2 text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-semibold">
                            Today
                          </span>
                        )}
                      </span>
                      <span
                        className={
                          isClosed
                            ? "text-foreground/40 italic"
                            : isToday
                              ? "text-accent font-semibold"
                              : "text-foreground/60"
                        }
                      >
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="gradient-hero py-12" data-ocid="contact-cta-banner">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Need Immediate Assistance?
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              For urgent tax or compliance matters, call us directly or WhatsApp
              for a quick response.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+918686457586">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-elevated transition-smooth"
                  data-ocid="cta-call-btn"
                >
                  <Phone size={16} className="mr-2" />
                  Call Now
                </Button>
              </a>
              <a
                href="https://wa.me/918686457586"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-foreground/30 text-foreground hover:bg-foreground/10 font-semibold transition-smooth"
                  data-ocid="cta-whatsapp-btn"
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        {/* <div className="border-t border-border/20 mt-10 mb-6" /> */}
        {/* <p className="text-center text-foreground/40 text-xs">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground/60 transition-smooth"
          >
            caffeine.ai
          </a>
        </p> */}
      </section>
    </div>
  );
}
