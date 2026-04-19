import { useSubscribeNewsletter } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Calculators", href: "/calculators" },
  { label: "FAQ", href: "/faq" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact Us", href: "/contact" },
];

const TOP_SERVICES = [
  { label: "ITR Filing – Salaried", href: "/services#income-tax" },
  { label: "GST Return Filing", href: "/services#gst" },
  { label: "Pvt Ltd Registration", href: "/services#registration" },
  { label: "Statutory Audit", href: "/services#audit" },
  { label: "Virtual CFO Services", href: "/services#accounting" },
  { label: "Tax Planning", href: "/services#income-tax" },
  { label: "MSME Registration", href: "/services#registration" },
  { label: "ROC Annual Filing", href: "/services#roc" },
  { label: "Business Valuation", href: "/services#advisory" },
];

const SOCIAL_LINKS = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = useSubscribeNewsletter();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await subscribe.mutateAsync({ email: email.trim() });
      setSubscribed(true);
      setEmail("");
    } catch {
      // silently ignore
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground" data-ocid="footer">
      {/* Newsletter Bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-primary-foreground">
                Stay Updated — Tax &amp; Compliance News
              </h3>
              <p className="text-primary-foreground/50 text-sm mt-0.5">
                Monthly newsletter — deadlines, budget updates, and expert
                insights.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <CheckCircle2 size={18} />
                You're subscribed! Thank you.
              </div>
            ) : (
              <form
                className="flex gap-2 w-full md:w-auto"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/35 text-sm focus:outline-none focus:ring-2 focus:ring-accent w-full md:w-64 transition-smooth"
                  data-ocid="footer-email-input"
                />
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-smooth whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 disabled:opacity-70"
                  data-ocid="footer-subscribe-btn"
                >
                  {subscribe.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-accent-foreground font-display font-extrabold text-lg leading-none">
                  P
                </span>
              </div>
              <div>
                <div className="font-display font-bold text-base text-primary-foreground leading-tight">
                  Prasad Tax Consultant
                </div>
                <div className="text-accent text-[10px] tracking-widest uppercase opacity-80">
                  Trusted Advisor
                </div>
              </div>
            </div>
            <p className="text-primary-foreground/50 text-sm leading-relaxed mb-5">
              A trusted Tax Consultant firm delivering precision-driven financial solutions.
              Professionals, serving clients pan-India with integrity and
              expertise.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/50 hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-smooth"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-accent mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-primary-foreground/55 hover:text-accent transition-smooth group"
                  >
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1 transition-smooth text-accent/60 flex-shrink-0"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-accent mb-4">
              Our Services
            </h4>
            <ul className="space-y-2">
              {TOP_SERVICES.map((svc) => (
                <li key={svc.label}>
                  <a
                    href={svc.href}
                    className="flex items-center gap-2 text-sm text-primary-foreground/55 hover:text-accent transition-smooth group"
                  >
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1 transition-smooth text-accent/60 flex-shrink-0"
                    />
                    {svc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-accent mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+918686457586"
                  className="flex items-start gap-3 text-sm text-primary-foreground/55 hover:text-accent transition-smooth group"
                >
                  <Phone
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <span>+91 86864 57586</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@prasadcaworks.in"
                  className="flex items-start gap-3 text-sm text-primary-foreground/55 hover:text-accent transition-smooth"
                >
                  <Mail
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <span>prasadnagulakonda25@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-primary-foreground/55">
                  <MapPin
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <span>
                    Kukatpally, Hyderabad, Telangana
                    <br />
                    India — 500 072
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-primary-foreground/55">
                  <Clock
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-accent"
                  />
                  <div>
                    <div>Mon–Sat: 9:30 AM – 7:00 PM</div>
                    <div>Sunday: By Appointment</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/40">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span>© {currentYear} Prasad Tax Consultant. All Rights Reserved.</span>
            <span className="hidden md:block">•</span>
            {/* <span className="text-accent/60">ICAI Registered</span> */}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-accent transition-smooth">
              Privacy Policy
            </Link>
            <span>•</span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-smooth"
            >
              Built with caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
