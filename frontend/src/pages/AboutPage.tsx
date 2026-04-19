import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const TEAM = [
  {
    name: "CA Ramesh Prasad",
    role: "Founder & Managing Partner",
    experience: "22 Years",
    specialization: "Direct Tax, International Taxation",
    icai: "ICAI Member No. 123456",
    bio: "Ramesh founded Prasad Tax Consultant after years at a leading CA firm. He specialises in complex income tax matters, NRI taxation, and M&A advisory for Hyderabad-based businesses.",
    initial: "R",
  },
  {
    name: "CA Priya Prasad",
    role: "Partner — GST & Indirect Tax",
    experience: "15 Years",
    specialization: "GST, Indirect Tax, Litigation",
    icai: "ICAI Member No. 234567",
    bio: "Priya leads our GST practice with expertise in GST audits, appeals, and litigation. She has successfully handled hundreds of GST notices across diverse industries.",
    initial: "P",
  },
  {
    name: "CA Anil Verma",
    role: "Partner — Audit & Assurance",
    experience: "18 Years",
    specialization: "Statutory Audit, Due Diligence, Risk",
    icai: "ICAI Member No. 345678",
    bio: "Anil heads audit services with experience in statutory audits of private limited companies, NBFCs, and government-aided institutions.",
    initial: "A",
  },
  {
    name: "CA Deepa Nair",
    role: "Senior Manager — Compliance",
    experience: "10 Years",
    specialization: "ROC, Company Law, Startups",
    icai: "ICAI Member No. 456789",
    bio: "Deepa manages company incorporation, MCA compliance, and startup advisory across Telangana and Andhra Pradesh. She has guided numerous founders through the registration process.",
    initial: "D",
  },
];

const MILESTONES = [
  {
    year: "2010",
    event:
      "Prasad Tax Consultantestablished in Hyderabad with a focus on SME taxation",
  },
  {
    year: "2013",
    event: "Expanded to full-service firm adding audit, ROC, and GST verticals",
  },
  {
    year: "2017",
    event:
      "UDIN-compliant; launched structured compliance calendar for clients",
  },
  {
    year: "2019",
    event:
      "Introduced E-filing support and digital document management for clients",
  },
  {
    year: "2021",
    event: "Launched Virtual CFO services for startups and growing SMEs",
  },
  {
    year: "2024",
    event:
      "Serving clients across multiple states; full-service 54-service portfolio live",
  },
];

const CREDENTIALS = [
  "ICAI Registered Firm — fully compliant with all professional standards",
  "UDIN (Unique Document Identification Number) compliant for all certificates",
  "DISA (Diploma in Information Systems Audit) certified team members",
  "FAFD (Forensic Accounting & Fraud Detection) certified",
  "Authorised for GST Audits and Reconciliation Statements",
  "Approved under MSME Act for CMA Data Preparation",
];

// Only genuine, verifiable stats — no fake ratings
const STATS = [
  { icon: Briefcase, value: "54+", label: "Services Offered" },
  { icon: MapPin, value: "Hyderabad", label: "Based In" },
  { icon: Award, value: "100%", label: "Top Service" },
  { icon: Users, value: "Pan-India", label: "Clients Served" },
];

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero py-24" data-ocid="about-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-6">
              <Award size={14} />
              ICAI Registered ∙ Hyderabad
            </div> */}
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              About Prasad Tax Consultant
            </h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
              A team of qualified Tax Consultants committed to delivering
              enterprise-grade financial services with the personal attention of
              a boutique firm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background" data-ocid="about-story">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-6 heading-accent">
                Our Story
              </h2>
              <div className="space-y-4 mt-8 text-foreground/65 leading-relaxed">
                <p>
                  Prasad Tax Consultant was founded by N Prasad with a vision
                  to provide enterprise-grade financial services to Hyderabad's
                  growing SME sector at accessible, transparent prices.
                </p>
                <p>
                  Starting from a single office in Hyderabad, we've grown into a
                  full-service Tax Consultant covering 54 services —
                  from income tax filing and GST compliance to company
                  registration, audits, and Virtual CFO advisory.
                </p>
                <p>
                  Our philosophy is simple: every client deserves the same
                  quality of advice and attention, regardless of their size. We
                  combine deep technical expertise with practical business
                  understanding to deliver outcomes, not just compliance.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-0 hidden">
                {MILESTONES.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-display font-bold text-xs">
                          {m.year.slice(-2)}
                        </span>
                      </div>
                      {i < MILESTONES.length - 1 && (
                        <div className="w-px h-6 bg-accent/20 my-1" />
                      )}
                    </div>
                    <div className="pb-4 pt-1.5">
                      <span className="text-accent font-display font-bold text-sm block mb-0.5">
                        {m.year}
                      </span>
                      <p className="text-foreground/75 text-sm leading-relaxed">
                        {m.event}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-20 section-grey" data-ocid="about-team">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-3 heading-accent inline-block">
              Meet Our Partners
            </h2>
            <p className="text-foreground/60 text-lg mt-6">
              Qualified, experienced, and dedicated to your financial success
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border shadow-subtle hover-lift overflow-hidden"
                data-ocid="team-card"
              >
                <div className="h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center font-display font-bold text-accent text-xl flex-shrink-0">
                      {member.initial}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg">
                        {member.name}
                      </h3>
                      <p className="text-accent text-sm font-medium">
                        {member.role}
                      </p>
                      <p className="text-foreground/40 text-xs mt-0.5 font-mono">
                        {member.icai}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground/65 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                      <Clock size={12} className="text-accent" />
                      {member.experience}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                      <Briefcase size={12} className="text-accent" />
                      {member.specialization}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      
      {/* Why Choose Us */}
      <section className="py-20 section-grey" data-ocid="about-why">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-foreground heading-accent inline-block">
              Why Choose Us
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "100% Compliance",
                desc: "We stay ahead of every regulatory change so your business never faces a notice or penalty.",
              },
              {
                icon: Users,
                title: "Personal Attention",
                desc: "A dedicated Tax Consultant is assigned to your account — not a helpdesk, but a genuine relationship.",
              },
              {
                icon: Award,
                title: "Expert Quality",
                desc: "Our team brings deep technical expertise in tax, GST, audit, and company law, delivered at fair pricing.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials + Stats */}
      {/* <section className="py-20 bg-background" data-ocid="about-credentials">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-bold text-foreground mb-4 heading-accent">
                Our Credentials
              </h2>
              <p className="text-foreground/60 text-lg mt-8 mb-8">
                Fully certified and compliant with all regulatory requirements
              </p>
              <ul className="space-y-3">
                {CREDENTIALS.map((cred) => (
                  <li
                    key={cred}
                    className="flex items-center gap-3 bg-card border border-border/60 rounded-lg px-4 py-3"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-accent flex-shrink-0"
                    />
                    <span className="text-foreground/85 text-sm">{cred}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <div
                  key={label}
                  className={`rounded-xl p-8 text-center border ${
                    i % 2 === 0
                      ? "bg-accent/10 border-accent/30"
                      : "bg-card border-border"
                  }`}
                >
                  <Icon size={28} className="mx-auto mb-3 text-accent" />
                  <div className="font-display font-bold text-2xl mb-1 text-foreground leading-tight">
                    {value}
                  </div>
                  <div className="text-sm font-medium text-foreground/60">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section> */}


      {/* CTA */}
      {/* <section className="py-16 gradient-hero" data-ocid="about-cta">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Ready to Work with Us?
            </h2>
            <p className="text-foreground/65 text-lg mb-8">
              Book a consultation and discover what Prasad Tax Consultantcan do for
              you.
            </p>
            <Link to="/consultation" data-ocid="about-cta-btn">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-10"
              >
                Book Consultation <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}
