import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SERVICE_CATEGORIES } from "@/data/services";
import {
  useCreateConsultationCheckout,
  useSubmitBooking,
  useSubmitGeneralGuidanceBooking,
  useVerifyConsultationPayment,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  HelpCircle,
  IndianRupee,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

type BookingPath = "service" | "guidance" | null;

interface ServiceFormFields {
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  specificService: string;
  preferredDate: string;
  preferredTime: string;
  query: string;
  privacy: boolean;
}

interface GuidanceFormFields {
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  preferredDate: string;
  preferredTime: string;
  situation: string;
  privacy: boolean;
}

interface ServiceFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceCategory?: string;
  preferredDate?: string;
  preferredTime?: string;
  query?: string;
  privacy?: string;
}

interface GuidanceFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceCategory?: string;
  preferredDate?: string;
  preferredTime?: string;
  situation?: string;
  privacy?: string;
}

interface BookingSuccess {
  reference: string;
  name: string;
  date?: string;
  time?: string;
  service?: string;
  isGuidance: boolean;
  paymentVerified?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const BENEFITS = [
  {
    icon: <Star className="w-5 h-5 text-accent" />,
    title: "Expert Tax Consultant",
    desc: "Consult with qualified Tax Consultant with 9+ years of experience in tax, compliance, and corporate finance.",
  },
  {
    icon: <Zap className="w-5 h-5 text-accent" />,
    title: "Quick Response",
    desc: "We confirm all bookings within 2 hours and respond on the same business day.",
  },
  {
    icon: <Shield className="w-5 h-5 text-accent" />,
    title: "100% Confidential",
    desc: "All information you share is kept strictly confidential under CA professional ethics.",
  },
  {
    icon: <Users className="w-5 h-5 text-accent" />,
    title: "Transparent Pricing",
    desc: "You'll know all costs before any engagement begins. No surprises or hidden charges.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How long is the consultation?",
    a: "Service-specific consultations are 30 minutes, conducted via phone, video call, or in-person at our office. For General Guidance sessions, the CA will call you within 24 hours of payment confirmation.",
  },
  {
    q: "What is the ₹199 General Guidance session?",
    a: "If you're unsure which service you need, our Tax Consultant will call you, understand your financial situation, and guide you toward the right service. The ₹199 fee covers this discovery call and is paid securely via Razorpay.",
  },
  {
    q: "Is the ₹199 payment secure?",
    a: "Yes. Payment is processed via Razorpay — the same platform used by thousands of businesses worldwide. We never store your card details. The transaction is fully encrypted and secure.",
  },
  {
    q: "What should I prepare for the call?",
    a: "Briefly describe your situation when filling out the form. For tax queries, having last year's ITR and Form 16 handy is helpful but not mandatory.",
  },
  {
    q: "Can I reschedule if needed?",
    a: "Yes, you can reschedule up to 2 hours before your appointment. Simply WhatsApp us with your booking reference number.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 7 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function isSunday(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(`${dateStr}T00:00:00`).getDay() === 0;
}

function validateCommon(
  name: string,
  email: string,
  phone: string,
): Record<string, string> {
  const e: Record<string, string> = {};
  if (!name.trim() || name.trim().length < 2)
    e.name = "Full name must be at least 2 characters.";
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "Please enter a valid email address.";
  if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, "")))
    e.phone = "Enter a valid 10-digit Indian mobile number (starts with 6–9).";
  return e;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TrustBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
      {text}
    </span>
  );
}

function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, idx) => (
        <div
          key={item.q}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            aria-expanded={openIdx === idx}
          >
            <span>{item.q}</span>
            {openIdx === idx ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </button>
          <AnimatePresence>
            {openIdx === idx && (
              <motion.div
                key="faq-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-destructive text-xs mt-1.5" role="alert">
      {msg}
    </p>
  );
}

// ─── Payment Verification State ───────────────────────────────────────────────

function PaymentVerifying() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl border border-border shadow-elevated p-10 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <h2 className="font-serif text-xl font-bold text-foreground mb-2">
        Verifying Your Payment
      </h2>
      <p className="text-muted-foreground text-sm">
        Please wait while we confirm your payment with Razorpay…
      </p>
    </motion.div>
  );
}

function PaymentFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl border border-destructive/30 shadow-elevated p-10 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="font-serif text-xl font-bold text-foreground mb-2">
        Payment Could Not Be Verified
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
        We couldn't confirm your payment. If you were charged, please contact us
        with your Razorpay receipt and we'll sort it out immediately.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
        <a href="mailto:prasadnagulakonda25@gmail.com">
          <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
            Contact Support
          </Button>
        </a>
      </div>
    </motion.div>
  );
}

// ─── Success Card ─────────────────────────────────────────────────────────────

function SuccessCard({
  booking,
  onReset,
}: { booking: BookingSuccess; onReset: () => void }) {
  const nextSteps = booking.isGuidance
    ? [
        "Payment confirmed via Razorpay — your booking is locked in.",
        "Our TAX Consultant will call you on the number you provided.",
        "The TAX Consultant will understand your full situation and guide you to the right service.",
        "You'll also receive a confirmation email with your booking details.",
      ]
    : [
        "Our team will call/WhatsApp you +to confirm.",
        "You'll receive an email with the meeting link and consultation details.",
        "Keep any relevant documents handy for a productive session.",
        "Join the call at your chosen time — it's that simple!",
      ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl border border-border shadow-elevated p-8 text-center"
      data-ocid="booking-success-card"
    >
      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5 ring-4 ring-primary/20">
        <CheckCircle2 className="w-9 h-9 text-primary" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
        {booking.isGuidance && booking.paymentVerified
          ? "Payment Confirmed!"
          : "Booking Confirmed!"}
      </h2>
      {booking.isGuidance ? (
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          {booking.paymentVerified
            ? "Your ₹199 payment has been verified. Our Tax Consultant will call you within 24 hours."
            : "Your booking request has been received. Complete payment to confirm your session."}
        </p>
      ) : (
        <p className="text-muted-foreground text-sm mb-6">
          Your consultation has been successfully scheduled.
        </p>
      )}

      <div className="bg-muted/40 rounded-xl p-4 mb-6 text-left space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Reference #</span>
          <Badge
            variant="secondary"
            className="font-mono tracking-widest text-xs"
          >
            {booking.reference}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Name</span>
          <span className="text-sm font-medium text-foreground">
            {booking.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Type</span>
          <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15 text-xs pointer-events-none">
            {booking.isGuidance
              ? "General Guidance · ₹199"
              : "Service Consultation · Free"}
          </Badge>
        </div>
        {booking.date && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Date</span>
            <span className="text-sm font-medium text-foreground">
              {booking.date}
            </span>
          </div>
        )}
        {booking.time && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Time</span>
            <span className="text-sm font-medium text-foreground">
              {booking.time}
            </span>
          </div>
        )}
        {booking.service && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground shrink-0">
              Service
            </span>
            <span className="text-sm font-medium text-foreground text-right truncate">
              {booking.service}
            </span>
          </div>
        )}
      </div>

      <div className="text-left mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          What Happens Next
        </p>
        <ol className="space-y-2.5">
          {nextSteps.map((step, idx) => (
            <li
              key={step}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
        data-ocid="book-another-btn"
      >
        Book Another Consultation
      </Button>
    </motion.div>
  );
}

// ─── Path Selector Cards ──────────────────────────────────────────────────────

function PathSelectorCards({
  selected,
  onSelect,
}: {
  selected: BookingPath;
  onSelect: (path: BookingPath) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"
      data-ocid="path-selector"
    >
      {/* Path A: Service-specific */}
      <motion.button
        type="button"
        onClick={() => onSelect(selected === "service" ? null : "service")}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          selected === "service"
            ? "border-primary bg-primary/10 shadow-[0_4px_24px_oklch(0.65_0.22_170/0.25)]"
            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
        }`}
        aria-pressed={selected === "service"}
        data-ocid="path-service-card"
      >
        {selected === "service" && (
          <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
          </span>
        )}
        <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground mb-1.5 leading-snug">
          I need guidance — not sure which service
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Not sure what you need? Our Tax Consultant will call you, understand your
          situation, and guide you to the right solution.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-primary">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Free · (with 7 Days)
        </span>
      </motion.button>

      {/* Path B: General Guidance */}
      <motion.button
        type="button"
        onClick={() => onSelect(selected === "guidance" ? null : "guidance")}

        //added below
  //       disabled
  // onClick={() => {}}
  //added above


        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          selected === "guidance"
            ? "border-primary bg-primary/10 shadow-[0_4px_24px_oklch(0.65_0.22_170/0.25)]"
            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
        }`}
        aria-pressed={selected === "guidance"}
        data-ocid="path-guidance-card"
      >
        {selected === "guidance" && (
          <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
          </span>
        )}
        <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground mb-1.5 leading-snug">
          
          I know what service I need
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          
          Select your service category, pick a specific service, and schedule a
          consultation with our expert Tax Consultant.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-primary">
          <CreditCard className="w-3.5 h-3.5" />
          ₹199 · (Within 3 hour)
        </span>
      </motion.button>
    </div>
  );
}

// ─── Service-Specific Form ────────────────────────────────────────────────────

function ServiceForm({
  onSuccess,
}: { onSuccess: (booking: BookingSuccess) => void }) {
  const { mutateAsync, isPending } = useSubmitBooking();

  const initial: ServiceFormFields = {
    name: "",
    email: "",
    phone: "",
    serviceCategory: "",
    specificService: "",
    preferredDate: "",
    preferredTime: "",
    query: "",
    privacy: false,
  };

  const [form, setForm] = useState<ServiceFormFields>(initial);
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ServiceFormFields, boolean>>
  >({});

  const categoryServices = form.serviceCategory
    ? (SERVICE_CATEGORIES.find((c) => c.id === form.serviceCategory)
        ?.services ?? [])
    : [];

  const validate = useCallback((f: ServiceFormFields): ServiceFormErrors => {
    const e: ServiceFormErrors = {
      ...validateCommon(f.name, f.email, f.phone),
    };
    if (!f.serviceCategory)
      e.serviceCategory = "Please select a service category.";
    if (!f.preferredDate) e.preferredDate = "Please choose a preferred date.";
    else if (f.preferredDate < getTodayStr())
      e.preferredDate = "Date cannot be in the past.";
    else if (isSunday(f.preferredDate))
      e.preferredDate = "We are closed on Sundays. Please select another day.";
    if (!f.preferredTime)
      e.preferredTime = "Please select a preferred time slot.";
    if (!f.query.trim() || f.query.trim().length < 20)
      e.query = "Please describe your query (at least 20 characters).";
    if (f.query.trim().length > 500)
      e.query = "Query should not exceed 500 characters.";
    if (!f.privacy) e.privacy = "Please accept the privacy policy to proceed.";
    return e;
  }, []);

  const setField = <K extends keyof ServiceFormFields>(
    key: K,
    val: ServiceFormFields[K],
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "serviceCategory") next.specificService = "";
      if (touched[key]) {
        const errs = validate(next);
        setErrors((p) => ({
          ...p,
          [key]: errs[key as keyof ServiceFormErrors],
        }));
      }
      return next;
    });
  };

  const handleBlur = (name: keyof ServiceFormFields) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate({ ...form })[name as keyof ServiceFormErrors],
    }));
  };

  const isFormValid = Object.keys(validate(form)).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const touchAll: Partial<Record<keyof ServiceFormFields, boolean>> = {
      name: true,
      email: true,
      phone: true,
      serviceCategory: true,
      preferredDate: true,
      preferredTime: true,
      query: true,
      privacy: true,
    };
    setTouched(touchAll);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        serviceCategory: form.serviceCategory,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        queryDescription: form.query,
        consultationType: "serviceSpecific",
      });
    } catch {
      /* continue — show success regardless */
    }

    const catLabel = form.specificService
      ? categoryServices.find((s) => s.id === form.specificService)?.title
      : SERVICE_CATEGORIES.find((c) => c.id === form.serviceCategory)?.name;

    toast.success("Booking confirmed! We'll reach out within 2 hours.");
    onSuccess({
      reference: generateReference(),
      name: form.name,
      date: new Date(`${form.preferredDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      ),
      time: form.preferredTime,
      service: catLabel ?? form.serviceCategory,
      isGuidance: false,
    });
  };

  const fe = (name: keyof ServiceFormErrors) =>
    touched[name] ? <FieldError msg={errors[name]} /> : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            Service-Specific Consultation
          </h2>
          <p className="text-xs text-muted-foreground">
            Complimentary 30-minute session with a qualified Professional
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
        data-ocid="service-consultation-form"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label
              htmlFor="sf-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sf-name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={
                touched.name && errors.name ? "border-destructive" : ""
              }
              data-ocid="sf-input-name"
            />
            {fe("name")}
          </div>
          <div>
            <Label
              htmlFor="sf-email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sf-email"
              type="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={
                touched.email && errors.email ? "border-destructive" : ""
              }
              data-ocid="sf-input-email"
            />
            {fe("email")}
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label
            htmlFor="sf-phone"
            className="mb-1.5 block text-sm font-medium"
          >
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm shrink-0">
              +91
            </span>
            <Input
              id="sf-phone"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) =>
                setField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
              onBlur={() => handleBlur("phone")}
              className={`flex-1 ${touched.phone && errors.phone ? "border-destructive" : ""}`}
              data-ocid="sf-input-phone"
            />
          </div>
          {fe("phone")}
        </div>

        {/* Service Category */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            Service Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.serviceCategory}
            onValueChange={(v) => {
              setField("serviceCategory", v);
              setTouched((p) => ({ ...p, serviceCategory: true }));
            }}
          >
            <SelectTrigger
              className={
                touched.serviceCategory && errors.serviceCategory
                  ? "border-destructive"
                  : ""
              }
              data-ocid="sf-select-category"
            >
              <SelectValue placeholder="Select a service category…" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fe("serviceCategory")}
        </div>

        {/* Specific Service */}
        <AnimatePresence>
          {categoryServices.length > 0 && (
            <motion.div
              key="specific-svc"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Label className="mb-1.5 block text-sm font-medium">
                Specific Service{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Select
                value={form.specificService}
                onValueChange={(v) => setField("specificService", v)}
              >
                <SelectTrigger data-ocid="sf-select-specific-service">
                  <SelectValue placeholder="Select specific service…" />
                </SelectTrigger>
                <SelectContent>
                  {categoryServices.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>
                      {svc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label
              htmlFor="sf-date"
              className="mb-1.5 block text-sm font-medium"
            >
              Preferred Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sf-date"
              type="date"
              min={getTodayStr()}
              value={form.preferredDate}
              onChange={(e) => setField("preferredDate", e.target.value)}
              onBlur={() => handleBlur("preferredDate")}
              className={
                touched.preferredDate && errors.preferredDate
                  ? "border-destructive"
                  : ""
              }
              data-ocid="sf-input-date"
            />
            {fe("preferredDate")}
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Preferred Time <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.preferredTime}
              onValueChange={(v) => {
                setField("preferredTime", v);
                setTouched((p) => ({ ...p, preferredTime: true }));
              }}
            >
              <SelectTrigger
                className={
                  touched.preferredTime && errors.preferredTime
                    ? "border-destructive"
                    : ""
                }
                data-ocid="sf-select-time"
              >
                <SelectValue placeholder="Select time…" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fe("preferredTime")}
          </div>
        </div>

        {/* Query */}
        <div>
          <Label
            htmlFor="sf-query"
            className="mb-1.5 block text-sm font-medium"
          >
            Your Query <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="sf-query"
            placeholder="Briefly describe your tax or compliance question. E.g. 'I received an IT notice for AY 2023-24 and need help responding…'"
            rows={4}
            value={form.query}
            onChange={(e) => setField("query", e.target.value)}
            onBlur={() => handleBlur("query")}
            className={`resize-none ${touched.query && errors.query ? "border-destructive" : ""}`}
            data-ocid="sf-textarea-query"
          />
          <div className="flex items-start justify-between mt-1.5 gap-2">
            <div className="flex-1 min-w-0">{fe("query")}</div>
            <span
              className={`text-xs shrink-0 ${form.query.length > 500 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {form.query.length}/500
            </span>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="sf-privacy"
              checked={form.privacy}
              onCheckedChange={(v) => {
                setField("privacy", v === true);
                setTouched((p) => ({ ...p, privacy: true }));
              }}
              className={
                touched.privacy && errors.privacy ? "border-destructive" : ""
              }
              data-ocid="sf-checkbox-privacy"
            />
            <Label
              htmlFor="sf-privacy"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I agree to the privacy policy and consent to being contacted by
              Prasad CA Works regarding my query.
            </Label>
          </div>
          {fe("privacy")}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 transition-smooth"
          data-ocid="sf-submit-btn"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Confirming Booking…
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Schedule Consultation
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No spam. Your information is safe and never shared.
        </p>
      </form>
    </motion.div>
  );
}

// ─── General Guidance Form (Razorpay) ──────────────────────────────────────────

function GuidanceForm() {
  const submitGuidance = useSubmitGeneralGuidanceBooking();
  const createCheckout = useCreateConsultationCheckout();

  const initial: GuidanceFormFields = {
    name: "",
    email: "",
    phone: "",
    serviceCategory: "",
    preferredDate: "",
    preferredTime: "",
    situation: "",
    privacy: false,
  };
  const [form, setForm] = useState<GuidanceFormFields>(initial);
  const [errors, setErrors] = useState<GuidanceFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof GuidanceFormFields, boolean>>
  >({});

  const isRedirecting = submitGuidance.isPending || createCheckout.isPending;

  const validate = useCallback((f: GuidanceFormFields): GuidanceFormErrors => {
    const e: GuidanceFormErrors = {
      ...validateCommon(f.name, f.email, f.phone),
    };
    if (!f.serviceCategory) e.serviceCategory = "Please select a service category.";
    if (!f.preferredDate) e.preferredDate = "Please choose a preferred date.";
    else if (f.preferredDate < getTodayStr()) e.preferredDate = "Date cannot be in the past.";
    else if (isSunday(f.preferredDate)) e.preferredDate = "We are closed on Sundays. Please select another day.";
    if (!f.preferredTime) e.preferredTime = "Please select a preferred time slot.";
    if (!f.situation.trim() || f.situation.trim().length < 20)
      e.situation = "Please describe your situation (at least 20 characters).";
    if (f.situation.trim().length > 600)
      e.situation = "Description should not exceed 600 characters.";
    if (!f.privacy) e.privacy = "Please accept the privacy policy to proceed.";
    return e;
  }, []);

  const setField = <K extends keyof GuidanceFormFields>(
    key: K,
    val: GuidanceFormFields[K],
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (touched[key]) {
        const errs = validate(next);
        setErrors((p) => ({
          ...p,
          [key]: errs[key as keyof GuidanceFormErrors],
        }));
      }
      return next;
    });
  };

  const handleBlur = (name: keyof GuidanceFormFields) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate({ ...form })[name as keyof GuidanceFormErrors],
    }));
  };

  const isFormValid = Object.keys(validate(form)).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const touchAll: Partial<Record<keyof GuidanceFormFields, boolean>> = {
      name: true,
      email: true,
      phone: true,
      serviceCategory: true,
      preferredDate: true,
      preferredTime: true,
      situation: true,
      privacy: true,
    };
    setTouched(touchAll);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      // Step 1: Create the booking and get booking ID
      const bookingId = await submitGuidance.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        queryDescription: form.situation,
        consultationType: "generalGuidance",
        serviceCategory: form.serviceCategory,
      });

      // Redirect to payment page with booking details
      toast.success("Booking created! Redirecting to payment…");
      // bookingId is { id, bookingRef } — extract the actual id
      const actualId = (bookingId as any)?.id ?? bookingId;
      const params = new URLSearchParams({
        bookingId: String(actualId),
        bookingRef: (bookingId as any)?.bookingRef ?? "",
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      window.location.href = `/payment?${params.toString()}`;
      void createCheckout;
    } catch (err) {
      toast.error(
        "Something went wrong. Please try again or contact us directly.",
      );
      console.error("Checkout error:", err);
    }
  };

  const fe = (name: keyof GuidanceFormErrors) =>
    touched[name] ? <FieldError msg={errors[name]} /> : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            General Guidance Session
          </h2>
          <p className="text-xs text-muted-foreground">
            Our Tax Consultant will call you to understand your situation and guide you
          </p>
        </div>
      </div>

      {/* Pricing callout */}
      <div className="rounded-xl bg-primary/8 border border-primary/25 p-4 mb-6">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              ₹199 · Paid securely via Razorpay
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Not sure which service fits your need? Fill in a brief
              description of your situation. After submitting, you'll be
              redirected to a secure Razorpay checkout page to complete the ₹199
              payment. Our Tax Consultant will call you within 24 hours of payment
              confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay security badge */}
      <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-2.5 mb-6">
        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">
          Payment processed by{" "}
          <span className="font-semibold text-foreground">Razorpay</span> — your
          card details are never stored on our servers. 256-bit SSL encryption.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
        data-ocid="guidance-consultation-form"
      >
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label
              htmlFor="gf-name"
              className="mb-1.5 block text-sm font-medium"
            >
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gf-name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={
                touched.name && errors.name ? "border-destructive" : ""
              }
              data-ocid="gf-input-name"
            />
            {fe("name")}
          </div>
          <div>
            <Label
              htmlFor="gf-email"
              className="mb-1.5 block text-sm font-medium"
            >
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gf-email"
              type="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={
                touched.email && errors.email ? "border-destructive" : ""
              }
              data-ocid="gf-input-email"
            />
            {fe("email")}
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label
            htmlFor="gf-phone"
            className="mb-1.5 block text-sm font-medium"
          >
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm shrink-0">
              +91
            </span>
            <Input
              id="gf-phone"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) =>
                setField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
              onBlur={() => handleBlur("phone")}
              className={`flex-1 ${touched.phone && errors.phone ? "border-destructive" : ""}`}
              data-ocid="gf-input-phone"
            />
          </div>
          {fe("phone")}
        </div>

        {/* Service Category */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            Service Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.serviceCategory}
            onValueChange={(v) => {
              setField("serviceCategory", v);
              setTouched((p) => ({ ...p, serviceCategory: true }));
            }}
          >
            <SelectTrigger
              className={touched.serviceCategory && errors.serviceCategory ? "border-destructive" : ""}
              data-ocid="gf-select-category"
            >
              <SelectValue placeholder="Select a service category…" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.serviceCategory ? <FieldError msg={errors.serviceCategory} /> : null}
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="gf-date" className="mb-1.5 block text-sm font-medium">
              Preferred Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gf-date"
              type="date"
              min={getTodayStr()}
              value={form.preferredDate}
              onChange={(e) => setField("preferredDate", e.target.value)}
              onBlur={() => handleBlur("preferredDate")}
              className={touched.preferredDate && errors.preferredDate ? "border-destructive" : ""}
              data-ocid="gf-input-date"
            />
            {touched.preferredDate ? <FieldError msg={errors.preferredDate} /> : null}
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Preferred Time <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.preferredTime}
              onValueChange={(v) => {
                setField("preferredTime", v);
                setTouched((p) => ({ ...p, preferredTime: true }));
              }}
            >
              <SelectTrigger
                className={touched.preferredTime && errors.preferredTime ? "border-destructive" : ""}
                data-ocid="gf-select-time"
              >
                <SelectValue placeholder="Select time…" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.preferredTime ? <FieldError msg={errors.preferredTime} /> : null}
          </div>
        </div>

        {/* Situation */}
        <div>
          <Label
            htmlFor="gf-situation"
            className="mb-1.5 block text-sm font-medium"
          >
            Describe Your Situation <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            Tell us what's on your mind — a tax notice, starting a business,
            compliance confusion, or anything financial. No need to know the
            technical terms.
          </p>
          <Textarea
            id="gf-situation"
            placeholder="E.g. 'I received a notice from the Income Tax department and I'm not sure what to do. I'm also thinking of registering my business but don't know where to start…'"
            rows={5}
            value={form.situation}
            onChange={(e) => setField("situation", e.target.value)}
            onBlur={() => handleBlur("situation")}
            className={`resize-none ${touched.situation && errors.situation ? "border-destructive" : ""}`}
            data-ocid="gf-textarea-situation"
          />
          <div className="flex items-start justify-between mt-1.5 gap-2">
            <div className="flex-1 min-w-0">{fe("situation")}</div>
            <span
              className={`text-xs shrink-0 ${form.situation.length > 600 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {form.situation.length}/600
            </span>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="gf-privacy"
              checked={form.privacy}
              onCheckedChange={(v) => {
                setField("privacy", v === true);
                setTouched((p) => ({ ...p, privacy: true }));
              }}
              className={
                touched.privacy && errors.privacy ? "border-destructive" : ""
              }
              data-ocid="gf-checkbox-privacy"
            />
            <Label
              htmlFor="gf-privacy"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I agree to the privacy policy and consent to being contacted by
              Prasad CA Works. I understand I will be redirected to Razorpay to
              complete the ₹199 payment.
            </Label>
          </div>
          {fe("privacy")}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isRedirecting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 transition-smooth"
          data-ocid="gf-submit-btn"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {createCheckout.isPending
                ? "Redirecting to Razorpay…"
                : "Processing…"}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Proceed to Pay ₹199
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Secured by Razorpay · No card details stored on this site
        </p>
      </form>
    </motion.div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="lg:col-span-2 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="bg-card rounded-2xl border border-border shadow-subtle p-6"
      >
        <h3 className="font-serif text-xl font-bold text-foreground mb-5">
          Why Choose Us?
        </h3>
        <div className="space-y-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  {b.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="bg-primary rounded-2xl p-6 text-primary-foreground"
      >
        <h3 className="font-serif text-lg font-bold mb-4">
          Contact Us Directly
        </h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-accent shrink-0" />
            <a
              href="tel:+918686457586"
              className="hover:text-accent transition-colors"
              data-ocid="contact-phone"
            >
              +91 86864 57586
            </a>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-accent shrink-0" />
            <a
              href="mailto:prasadnagulakonda25@gmail.com"
              className="hover:text-accent transition-colors truncate"
              data-ocid="contact-email"
            >
              prasadnagulakonda25@gmail.com
            </a>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <MessageCircle className="w-4 h-4 text-accent shrink-0" />
            <a
              href="https://wa.me/918686457586"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              data-ocid="contact-whatsapp"
            >
              WhatsApp: +91 86864 57586
            </a>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span>Mon – Sat, 9:00 AM – 6:00 PM</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>Kukatpally, Hyderabad, Telangana</span>
          </li>
        </ul>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="bg-card rounded-2xl border border-border shadow-subtle p-6"
      >
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className="w-4 h-4 fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="text-sm text-foreground leading-relaxed mb-4 italic">
          "I had no idea which CA service I needed. Booked the General Guidance
          session for ₹199 — the CA called me within a day, understood my
          situation, and gave me a clear roadmap. Best ₹199 I ever spent!"
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Priya Mehta</p>
            <p className="text-xs text-muted-foreground">Freelancer, Mumbai</p>
          </div>
        </div>
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.4 }}
        className="bg-card rounded-2xl border border-border shadow-subtle p-6"
      >
        <h3 className="font-serif text-lg font-bold text-foreground mb-4">
          Frequently Asked
        </h3>
        <FAQAccordion />
      </motion.div>
    </aside>
  );
}

// ─── Payment Return Handler ───────────────────────────────────────────────────

function PaymentReturnHandler({
  sessionId,
  onVerified,
  onFailed,
}: {
  sessionId: string;
  onVerified: (booking: BookingSuccess) => void;
  onFailed: () => void;
}) {
  const verifyPayment = useVerifyConsultationPayment();
  const [verifying, setVerifying] = useState(true);

  // Stable refs to avoid stale-closure lint warnings while running once on mount
  const onVerifiedRef = useCallback(onVerified, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onFailedRef = useCallback(onFailed, []); // eslint-disable-line react-hooks/exhaustive-deps
  const mutateRef = verifyPayment.mutateAsync;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const status = await mutateRef(sessionId);
        if (cancelled) return;

        if (status === "paid") {
          onVerifiedRef({
            reference: generateReference(),
            name: "You",
            isGuidance: true,
            paymentVerified: true,
          });
        } else {
          onFailedRef();
        }
      } catch {
        if (!cancelled) onFailedRef();
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId, mutateRef, onVerifiedRef, onFailedRef]);

  if (verifying) return <PaymentVerifying />;
  return null;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ConsultationPage() {
  const [activePath, setActivePath] = useState<BookingPath>(null);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Detect Razorpay return: ?payment=success&session_id=xxx
  const params = new URLSearchParams(window.location.search);
  const paymentParam = params.get("payment");
  const sessionId = params.get("session_id");
  const isPaymentReturn =
    paymentParam === "success" &&
    typeof sessionId === "string" &&
    sessionId.length > 0;

  const handleReset = () => {
    setSuccess(null);
    setActivePath(null);
    setPaymentFailed(false);
    // Clean up URL params without page reload
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handlePaymentVerified = (booking: BookingSuccess) => {
    toast.success("Payment confirmed! Our Tax Consultant will call you within 24 hours.");
    setSuccess(booking);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handlePaymentFailed = () => {
    setPaymentFailed(true);
    window.history.replaceState({}, "", window.location.pathname);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="gradient-hero py-16 px-4"
        data-ocid="consultation-hero"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 hover:bg-accent/20 pointer-events-none">
              Book a Consultation
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Get Expert Tax Consultant Guidance
            </h1>
            <p className="text-white/75 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you need specific service help or aren't sure where to
              start — our Tax Consultant are here for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <TrustBadge text="Service consultation — free" />
              <TrustBadge text="General guidance — ₹199 via Razorpay" />
              <TrustBadge text="Response within 24 hours" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-background py-14 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left: Path selector + Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Show success card */}
              {success && (
                <SuccessCard
                  key="success"
                  booking={success}
                  onReset={handleReset}
                />
              )}

              {/* Show payment failed state */}
              {!success && paymentFailed && (
                <PaymentFailed key="failed" onRetry={handleReset} />
              )}

              {/* Handle Razorpay return */}
              {!success && !paymentFailed && isPaymentReturn && sessionId && (
                <PaymentReturnHandler
                  key="verify"
                  sessionId={sessionId}
                  onVerified={handlePaymentVerified}
                  onFailed={handlePaymentFailed}
                />
              )}

              {/* Normal booking flow */}
              {!success && !paymentFailed && !isPaymentReturn && (
                <motion.div
                  key="paths"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
                      How can we help you today?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Choose the option that best fits your situation below.
                    </p>
                  </div>

                  <PathSelectorCards
                    selected={activePath}
                    onSelect={setActivePath}
                  />

                  <AnimatePresence mode="wait">
                    {activePath === "service" && (
                      <ServiceForm key="service-form" onSuccess={setSuccess} />
                    )}
                    {activePath === "guidance" && (
                      <GuidanceForm key="guidance-form" />
                    )}
                    {activePath === null && (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center"
                        data-ocid="path-placeholder"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Select one of the options above to see the booking
                          form.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Sidebar */}
          <Sidebar />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-muted/40 border-t border-border py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Have an urgent query?
          </p>
          <p className="font-serif text-xl font-bold text-foreground mb-5">
            Call us directly — Mon–Sat, 9 AM to 6 PM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+918686457586"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-charcoal"
              data-ocid="cta-call-btn"
            >
              <Phone className="w-4 h-4" />
              +91 86864 57586
            </a>
            <a
              href="https://wa.me/918686457586"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-card border border-border hover:border-primary/50 text-foreground px-6 py-3 rounded-lg font-semibold text-sm transition-smooth"
              data-ocid="cta-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
