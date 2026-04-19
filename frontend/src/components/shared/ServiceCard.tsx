import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownCircle,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  Coffee,
  CreditCard,
  Edit3,
  FileBarChart,
  FileCheck,
  FileSearch,
  FileText,
  GitMerge,
  Globe,
  Globe2,
  Handshake,
  Heart,
  Landmark,
  LineChart,
  type LucideIcon,
  Monitor,
  Package,
  PiggyBank,
  Receipt,
  Rocket,
  Scale,
  Search,
  Shield,
  ShoppingBag,
  Stamp,
  Star,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import type { Service } from "../../types";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  FileCheck,
  Calendar,
  AlertCircle,
  Scale,
  TrendingDown,
  LineChart,
  Globe,
  Receipt,
  Search,
  ArrowDownCircle,
  AlertTriangle,
  Truck,
  ClipboardCheck,
  Building2,
  Users,
  User,
  Handshake,
  Store,
  Heart,
  Rocket,
  Award,
  ClipboardList,
  Shield,
  FileSearch,
  Package,
  Activity,
  Landmark,
  BookOpen,
  CreditCard,
  BarChart,
  Monitor,
  TrendingUp,
  UserCheck,
  FileBarChart,
  UserPlus,
  ArrowUp,
  XCircle,
  CheckSquare,
  Coffee,
  Building,
  Globe2,
  ShoppingBag,
  PiggyBank,
  GitMerge,
  Edit3,
  Stamp,
};

const CATEGORY_LABELS: Record<string, string> = {
  "income-tax": "Income Tax",
  gst: "GST",
  registration: "Registration",
  audit: "Audit",
  accounting: "Accounting",
  roc: "ROC",
  licenses: "Licenses",
  advisory: "Advisory",
};

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
}

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const IconComponent = ICON_MAP[service.icon] ?? FileText;
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <div
      className="bg-card rounded-xl flex flex-col h-full group transition-smooth hover:-translate-y-1 border border-border border-l-4 border-l-transparent hover:border-l-accent hover:shadow-elevated"
      data-ocid="service-card"
    >
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 transition-smooth group-hover:bg-accent/20">
            <IconComponent size={20} className="text-accent" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              {categoryLabel}
            </span>
            {service.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                <Star size={10} className="fill-current" />
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base leading-snug mb-2 text-foreground">
          {service.title}
        </h3>

        {/* Description */}
        {!compact && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-muted-foreground">
            {service.description}
          </p>
        )}

        {/* Benefits */}
        {!compact && service.benefits.length > 0 && (
          <ul className="space-y-1.5">
            {service.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={13} className="flex-shrink-0 text-accent" />
                <span className="truncate text-muted-foreground">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-2">
        <Link to="/consultation">
          <Button
            variant="outline"
            size="sm"
            className="w-full font-semibold transition-smooth group/btn border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent"
            data-ocid="service-card-cta"
          >
            Get Started
            <ArrowRight
              size={14}
              className="ml-2 group-hover/btn:translate-x-1 transition-smooth"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}
