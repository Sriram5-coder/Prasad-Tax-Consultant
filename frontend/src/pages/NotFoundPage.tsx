import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={40} className="text-accent" />
        </div>
        <h1 className="font-display font-bold text-6xl text-foreground mb-2">404</h1>
        <h2 className="font-display font-bold text-xl text-foreground mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: "Services", to: "/services" },
            { label: "Calculators", to: "/calculators" },
            { label: "Consultation", to: "/consultation" },
            { label: "FAQ", to: "/faq" },
          ].map(({ label, to }) => (
            <Link key={to} to={to}
              className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-smooth text-center">
              {label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
