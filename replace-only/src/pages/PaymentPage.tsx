import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateRazorpayOrder, useVerifyRazorpayPayment, useGetPaymentConfig, useMarkPaymentFailed } from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Lock,
  Phone,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Load Razorpay checkout script ────────────────────────────────────────────
function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if ((window as any).Razorpay) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, []);
  return loaded;
}

// ─── Typing coming from URL params ────────────────────────────────────────────
function getParams() {
  const p = new URLSearchParams(window.location.search);
  const rawId = p.get("bookingId");
  return {
    bookingId: rawId && rawId !== "null" && rawId !== "[object Object]" ? rawId : null,
    bookingRef: p.get("bookingRef") || "",
    name: p.get("name") || "",
    email: p.get("email") || "",
    phone: p.get("phone") || "",
  };
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function PaymentSuccess({ name }: { name: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardContent className="p-10 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you{name ? `, ${name}` : ""}! Your ₹199 General Guidance session is booked.
              <br /><br />
              Our CA will call you within <strong>24 hours</strong> to understand your financial situation and guide you.
            </p>
          </div>
          <div className="w-full rounded-xl bg-accent/10 border border-accent/20 p-4 text-sm text-foreground/80">
            <div className="flex items-center gap-2 font-semibold text-accent mb-1">
              <Phone size={14} /> What happens next?
            </div>
            <ol className="list-decimal list-inside space-y-1 text-left text-xs">
              <li>You'll receive a confirmation SMS/email</li>
              <li>Our CA reviews your query details</li>
              <li>CA calls you within 24 hours</li>
              <li>You get clear guidance on the right service</li>
            </ol>
          </div>
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Failed Screen ────────────────────────────────────────────────────────────
function PaymentFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardContent className="p-10 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">Payment Failed</h2>
            <p className="text-muted-foreground text-sm">
              We couldn't process your payment. You were not charged. Please try again or contact us.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/consultation"}>
              Go Back
            </Button>
            <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Payment Page ────────────────────────────────────────────────────────
export function PaymentPage() {
  const params = getParams();
  const razorpayLoaded = useRazorpayScript();
  const { data: config } = useGetPaymentConfig();
  const createOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();
  const markFailed = useMarkPaymentFailed();   // ← public endpoint, no admin auth

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [bookingId] = useState<string | null>(params.bookingId);
  const isInitiated = useRef(false);

  // If no bookingId in URL params (direct visit), show info card
  if (!bookingId && status === "idle") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elevated">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <IndianRupee size={26} className="text-accent" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground">General Guidance Session</h2>
            <p className="text-sm text-muted-foreground">
              Please book a consultation first from the{" "}
              <a href="/consultation" className="text-accent underline">Consultation page</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePay = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment system loading, please wait…");
      return;
    }
    if (isInitiated.current) return;
    isInitiated.current = true;
    setStatus("loading");

    try {
      const order = await createOrder.mutateAsync({ bookingId: bookingId! });

      // Stub mode (no Razorpay keys configured) — mark success directly
      if (order.stub) {
        await verifyPayment.mutateAsync({
          razorpay_order_id: order.id,
          razorpay_payment_id: "stub_payment",
          razorpay_signature: "stub_sig",
          bookingId: bookingId!,
        });
        setStatus("success");
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: config?.keyId || "",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Prasad CA Works",
        description: "General Guidance Session — ₹199",
        order_id: order.id,
        prefill: {
          name: params.name,
          email: params.email,
          contact: params.phone,
        },
        theme: { color: "#0d6b55" },
        handler: async (response: any) => {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId!,
            });
            setStatus("success");
          } catch {
            setStatus("failed");
          }
        },
        modal: {
          ondismiss: () => {
            // User closed/cancelled the Razorpay modal
            isInitiated.current = false;
            setStatus("idle");
            // Use the public endpoint — no admin token needed
            if (bookingId) {
              markFailed.mutate(bookingId);
            }
          },
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      isInitiated.current = false;
      // Use the public endpoint — no admin token needed
      if (bookingId) {
        markFailed.mutate(bookingId);
      }
      setStatus("failed");
    }
  };

  if (status === "success") return <PaymentSuccess name={params.name} />;
  if (status === "failed") return <PaymentFailed onRetry={() => { isInitiated.current = false; setStatus("idle"); }} />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        {/* Main payment card */}
        <Card className="shadow-elevated">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <IndianRupee size={24} className="text-accent" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">
                  Complete Your Booking
                </h1>
                <p className="text-sm text-muted-foreground">General Guidance Session</p>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-muted p-4 space-y-2">
              {params.bookingRef && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking ID</span>
                  <code className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">{params.bookingRef}</code>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">General Guidance Call</span>
              </div>
              {params.name && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{params.name}</span>
                </div>
              )}
              {params.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{params.email}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-accent">₹199</span>
              </div>
            </div>

            {/* Pay button */}
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base h-12"
              onClick={handlePay}
              disabled={status === "loading" || !razorpayLoaded}
            >
              {status === "loading" ? (
                <><Loader2 size={18} className="mr-2 animate-spin" /> Processing…</>
              ) : (
                <><Lock size={16} className="mr-2" /> Pay ₹199 Securely</>
              )}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Shield size={12} /> SSL Secured</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Instant Confirmation</span>
              <span className="flex items-center gap-1"><Lock size={12} /> Razorpay Protected</span>
            </div>
          </CardContent>
        </Card>

        {/* What you get */}
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">What you get</p>
            <ul className="space-y-2">
              {[
                "CA calls you within 24 hours",
                "30-min situation analysis",
                "Clear guidance on which service fits",
                "No hidden charges",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
