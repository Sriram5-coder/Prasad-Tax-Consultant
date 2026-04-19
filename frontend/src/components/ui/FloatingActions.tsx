import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50" data-ocid="whatsapp-btn">
      <a
        href="https://wa.me/918686457586?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Prasad%20CA%20Works%20services."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-elevated hover:shadow-hover transition-smooth hover:scale-110 animate-bounce-gentle"
        style={{ backgroundColor: "#25D366" }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MessageCircle size={26} fill="white" className="text-white" />
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-elevated pointer-events-none">
            Chat on WhatsApp
            <div className="absolute top-full right-4 border-4 border-transparent border-t-foreground" />
          </div>
        )}
      </a>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 transition-smooth ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      data-ocid="back-to-top"
    >
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        type="button"
        className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-elevated hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-smooth"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>Arrow up</title>
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
