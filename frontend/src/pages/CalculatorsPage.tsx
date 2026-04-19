import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  HelpCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Light-mode-safe chart colors aligned with charcoal/teal system
const CHART_TEAL = "oklch(0.53 0.1 182)"; // --accent (teal)
const CHART_CHARCOAL = "oklch(0.35 0.06 264)"; // muted charcoal
const CHART_AMBER = "oklch(0.65 0.14 60)"; // amber — legible on white
const CHART_GRID = "oklch(0.88 0.01 264)"; // light grey grid line
const CHART_TEXT = { fill: "oklch(0.45 0.03 264)", fontSize: 11 };

// Tooltip style — white card look for light mode
const TOOLTIP_STYLE = {
  background: "oklch(1.0 0.0 0)",
  border: "1px solid oklch(0.88 0.01 264)",
  color: "oklch(0.23 0.05 264)",
  borderRadius: "8px",
  fontSize: "12px",
};

function fmtINR(n: number, decimals = 0): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}`;
}

function fmtINRShort(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return fmtINR(n);
}

function InfoTip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle
            size={13}
            className="inline ml-1 text-muted-foreground cursor-help"
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs bg-card border-border text-foreground">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
  highlight?: boolean;
  isRate?: boolean;
  subtext?: string;
}

function ResultRow({
  label,
  value,
  isTotal,
  highlight,
  isRate,
  subtext,
}: ResultRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
        isTotal
          ? "bg-accent/10 border border-accent/25 font-bold"
          : highlight
            ? "bg-accent/5 border border-accent/15"
            : "border-b border-border/50"
      }`}
    >
      <div>
        <span
          className={`text-sm ${isTotal ? "text-foreground" : "text-foreground/75"}`}
        >
          {label}
        </span>
        {subtext && (
          <div className="text-xs text-muted-foreground">{subtext}</div>
        )}
      </div>
      <span
        className={`text-sm font-mono font-semibold ${
          isTotal
            ? "text-accent text-base"
            : highlight
              ? "text-accent"
              : isRate
                ? "text-foreground"
                : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionToggle({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
      >
        {label}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-muted/20 text-sm text-foreground/70 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── INCOME TAX CALCULATOR ───────────────────────────────────────────────────

function calcOldTax(taxable: number): number {
  if (taxable <= 250000) return 0;
  if (taxable <= 500000) return (taxable - 250000) * 0.05;
  if (taxable <= 1000000) return 12500 + (taxable - 500000) * 0.2;
  return 112500 + (taxable - 1000000) * 0.3;
}

function calcNewTax(taxable: number): number {
  if (taxable <= 300000) return 0;
  if (taxable <= 700000) return (taxable - 300000) * 0.05;
  if (taxable <= 1000000) return 20000 + (taxable - 700000) * 0.1;
  if (taxable <= 1200000) return 50000 + (taxable - 1000000) * 0.15;
  if (taxable <= 1500000) return 80000 + (taxable - 1200000) * 0.2;
  return 140000 + (taxable - 1500000) * 0.3;
}

function withCessAndRebate(
  tax: number,
  taxable: number,
  regime: "old" | "new",
): number {
  const rebateLimit = regime === "new" ? 700000 : 500000;
  if (taxable <= rebateLimit) return 0;
  const surcharge = taxable > 5000000 ? tax * 0.1 : 0;
  return Math.round((tax + surcharge) * 1.04);
}

function IncomeTaxCalc() {
  const [gross, setGross] = useState(1200000);
  const [empType, setEmpType] = useState<"salaried" | "business">("salaried");
  const [sec80C, setSec80C] = useState(150000);
  const [sec80D, setSec80D] = useState(25000);
  const [sec80E, setSec80E] = useState(0);
  const [hraExempt, setHraExempt] = useState(0);
  const [otherDed, setOtherDed] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const result = useMemo(() => {
    const stdDed = empType === "salaried" ? 50000 : 0;
    const totalOldDed =
      Math.min(sec80C, 150000) +
      Math.min(sec80D, 75000) +
      sec80E +
      hraExempt +
      otherDed +
      stdDed;
    const oldTaxable = Math.max(0, gross - totalOldDed);
    const oldBaseTax = calcOldTax(oldTaxable);
    const oldTotal = withCessAndRebate(oldBaseTax, oldTaxable, "old");

    const newTaxable = Math.max(
      0,
      gross - (empType === "salaried" ? 75000 : 0),
    );
    const newBaseTax = calcNewTax(newTaxable);
    const newTotal = withCessAndRebate(newBaseTax, newTaxable, "new");

    const saves = oldTotal - newTotal;
    return {
      old: {
        taxable: oldTaxable,
        deductions: totalOldDed,
        baseTax: Math.round(oldBaseTax),
        cess: Math.round(oldBaseTax * 0.04),
        total: oldTotal,
        effectiveRate: gross > 0 ? ((oldTotal / gross) * 100).toFixed(2) : "0",
        monthlyTakeHome: Math.round((gross - oldTotal) / 12),
      },
      new: {
        taxable: newTaxable,
        deductions: gross - newTaxable,
        baseTax: Math.round(newBaseTax),
        cess: Math.round(newBaseTax * 0.04),
        total: newTotal,
        effectiveRate: gross > 0 ? ((newTotal / gross) * 100).toFixed(2) : "0",
        monthlyTakeHome: Math.round((gross - newTotal) / 12),
      },
      betterRegime: saves > 0 ? ("new" as const) : ("old" as const),
      saves: Math.abs(saves),
    };
  }, [gross, empType, sec80C, sec80D, sec80E, hraExempt, otherDed]);

  const chartData = [
    { name: "Old Regime", tax: result.old.total },
    { name: "New Regime", tax: result.new.total },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Annual Gross Income{" "}
            <InfoTip text="Total CTC / annual income before any deductions or taxes." />
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-mono">₹</span>
            <Input
              type="number"
              value={gross}
              onChange={(e) => setGross(Number(e.target.value) || 0)}
              className="bg-background border-input text-foreground"
              data-ocid="it-income-input"
            />
          </div>
          <Slider
            value={[gross]}
            onValueChange={([v]) => setGross(v)}
            min={0}
            max={10000000}
            step={50000}
          />
          <div className="text-xs text-muted-foreground">
            {fmtINRShort(gross)}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">Employment Type</Label>
          <div className="flex gap-2">
            {(["salaried", "business"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEmpType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-smooth ${
                  empType === t
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-input text-foreground/65 hover:border-accent/50 hover:text-accent"
                }`}
              >
                {t === "salaried" ? "Salaried" : "Business / Professional"}
              </button>
            ))}
          </div>
          {empType === "salaried" && (
            <p className="text-xs text-muted-foreground">
              Standard deduction ₹50,000 (Old) / ₹75,000 (New) applied
              automatically.
            </p>
          )}
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-4">
        <h4 className="font-semibold text-sm text-foreground">
          Deductions (Old Regime)
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-foreground/70">
              Section 80C{" "}
              <InfoTip text="PPF, ELSS, LIC, home loan principal, tuition fees etc. Max ₹1,50,000." />
            </Label>
            <Input
              type="number"
              value={sec80C}
              max={150000}
              onChange={(e) =>
                setSec80C(Math.min(150000, Number(e.target.value) || 0))
              }
              className="bg-background border-input text-foreground"
            />
            <Slider
              value={[sec80C]}
              onValueChange={([v]) => setSec80C(v)}
              min={0}
              max={150000}
              step={5000}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-foreground/70">
              Section 80D Health Insurance{" "}
              <InfoTip text="Premium for self/family. Max ₹25,000 (₹50,000 if senior citizen). With parents ₹75,000." />
            </Label>
            <Input
              type="number"
              value={sec80D}
              max={75000}
              onChange={(e) =>
                setSec80D(Math.min(75000, Number(e.target.value) || 0))
              }
              className="bg-background border-input text-foreground"
            />
            <Slider
              value={[sec80D]}
              onValueChange={([v]) => setSec80D(v)}
              min={0}
              max={75000}
              step={1000}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-foreground/70">
              Section 80E Education Loan Interest{" "}
              <InfoTip text="Interest on loan for higher education. No limit, available for 8 years." />
            </Label>
            <Input
              type="number"
              value={sec80E}
              onChange={(e) => setSec80E(Number(e.target.value) || 0)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-foreground/70">
              HRA Exemption (Sec 10(13A)){" "}
              <InfoTip text="Use the HRA calculator tab to compute this value, then enter here." />
            </Label>
            <Input
              type="number"
              value={hraExempt}
              onChange={(e) => setHraExempt(Number(e.target.value) || 0)}
              className="bg-background border-input text-foreground"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs text-foreground/70">
              Other Deductions (80G, 80TTA, etc.)
            </Label>
            <Input
              type="number"
              value={otherDed}
              onChange={(e) => setOtherDed(Number(e.target.value) || 0)}
              className="bg-background border-input text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="rounded-xl p-4 flex items-center gap-4 border bg-accent/8 border-accent/25">
        {result.betterRegime === "new" ? (
          <TrendingDown size={20} className="text-accent shrink-0" />
        ) : (
          <TrendingUp size={20} className="text-accent shrink-0" />
        )}
        <div>
          <div className="font-semibold text-sm text-foreground">
            <span className="text-accent">
              {result.betterRegime === "new" ? "New Regime" : "Old Regime"}
            </span>{" "}
            saves you{" "}
            <span className="text-accent font-bold">
              {fmtINR(result.saves)}
            </span>{" "}
            more tax this year
          </div>
          <div className="text-xs text-muted-foreground">
            Based on deductions entered above. Consult a CA for personalised
            advice.
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {(["old", "new"] as const).map((regime) => {
          const r = result[regime];
          const isBetter = result.betterRegime === regime;
          return (
            <div
              key={regime}
              className={`rounded-xl p-4 border ${isBetter ? "border-accent/40 bg-accent/5" : "border-border bg-card"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-bold text-base text-foreground">
                  {regime === "old"
                    ? "Old Regime"
                    : "New Regime (Default FY 2024-25)"}
                </h4>
                {isBetter && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    Recommended ✓
                  </Badge>
                )}
              </div>
              <div className="space-y-1.5">
                <ResultRow label="Gross Income" value={fmtINR(gross)} />
                <ResultRow
                  label="Total Deductions"
                  value={fmtINR(r.deductions)}
                />
                <ResultRow
                  label="Taxable Income"
                  value={fmtINR(r.taxable)}
                  highlight
                />
                <ResultRow label="Income Tax" value={fmtINR(r.baseTax)} />
                <ResultRow
                  label="Health & Edu. Cess (4%)"
                  value={fmtINR(r.cess)}
                />
                <ResultRow
                  label="Total Tax Payable"
                  value={fmtINR(r.total)}
                  isTotal
                />
                <ResultRow
                  label="Effective Rate"
                  value={`${r.effectiveRate}%`}
                  isRate
                />
                <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
                  <span>Est. Monthly Take-Home</span>
                  <span className="font-semibold text-foreground font-mono">
                    {fmtINR(r.monthlyTakeHome)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-4 text-foreground">
          Tax Comparison: Old vs New Regime
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={56}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
            <XAxis dataKey="name" tick={CHART_TEXT} />
            <YAxis
              tickFormatter={(v: number) => fmtINRShort(v)}
              tick={CHART_TEXT}
            />
            <RechartTooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [fmtINR(v), "Tax Payable"]}
            />
            <Bar dataKey="tax" radius={[6, 6, 0, 0]}>
              <Cell fill={CHART_CHARCOAL} />
              <Cell fill={CHART_TEAL} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SectionToggle label="📘 How is this calculated?">
        <p>
          <strong className="text-foreground">Old Regime slabs:</strong> 0–2.5L:
          0% | 2.5–5L: 5% | 5–10L: 20% | Above 10L: 30%
        </p>
        <p>
          <strong className="text-foreground">New Regime slabs:</strong> 0–3L:
          0% | 3–7L: 5% | 7–10L: 10% | 10–12L: 15% | 12–15L: 20% | Above 15L:
          30%
        </p>
        <p>
          <strong className="text-foreground">Rebate 87A:</strong> If taxable
          income ≤ ₹5L (Old) or ≤ ₹7L (New), full tax rebate applies.
        </p>
        <p>
          <strong className="text-foreground">Cess:</strong> 4% Health &
          Education Cess on income tax + surcharge.
        </p>
        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="text-accent underline text-xs mt-1"
        >
          {showSteps ? "Hide" : "Show"} step-by-step working
        </button>
        {showSteps && (
          <div className="mt-2 space-y-1 font-mono text-xs bg-muted/40 p-3 rounded-lg border border-border text-foreground/80">
            <div>Gross = {fmtINR(gross)}</div>
            <div>
              Old deductions = {fmtINR(result.old.deductions)} | New deductions
              = {fmtINR(result.new.deductions)}
            </div>
            <div>
              Old taxable = {fmtINR(result.old.taxable)} | New taxable ={" "}
              {fmtINR(result.new.taxable)}
            </div>
            <div>
              Old base tax = {fmtINR(result.old.baseTax)} | New base tax ={" "}
              {fmtINR(result.new.baseTax)}
            </div>
            <div>
              Old total (with cess) = {fmtINR(result.old.total)} | New total ={" "}
              {fmtINR(result.new.total)}
            </div>
          </div>
        )}
      </SectionToggle>
    </div>
  );
}

// ─── GST CALCULATOR ──────────────────────────────────────────────────────────

function GSTCalc() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState("18");
  const [type, setType] = useState<"exclusive" | "inclusive">("exclusive");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = Number(rate) / 100;
    let base: number;
    let gst: number;
    let total: number;
    if (type === "exclusive") {
      base = amount;
      gst = amount * r;
      total = amount + gst;
    } else {
      total = amount;
      base = amount / (1 + r);
      gst = amount - base;
    }
    const cgst = gst / 2;
    const sgst = gst / 2;
    return {
      base: Math.round(base),
      gst: Math.round(gst),
      cgst: Math.round(cgst),
      sgst: Math.round(sgst),
      total: Math.round(total),
    };
  }, [amount, rate, type]);

  const pieData = [
    { name: "Base Amount", value: result.base, fill: CHART_CHARCOAL },
    {
      name: `CGST (${Number(rate) / 2}%)`,
      value: result.cgst,
      fill: CHART_TEAL,
    },
    {
      name: `SGST (${Number(rate) / 2}%)`,
      value: result.sgst,
      fill: CHART_AMBER,
    },
  ];

  const handleCopy = () => {
    const text = `Base: ${fmtINR(result.base)}\nCGST: ${fmtINR(result.cgst)}\nSGST: ${fmtINR(result.sgst)}\nTotal GST: ${fmtINR(result.gst)}\nTotal: ${fmtINR(result.total)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/80">Amount (₹)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="gst-amount-input"
          />
          <Slider
            value={[amount]}
            onValueChange={([v]) => setAmount(v)}
            min={100}
            max={1000000}
            step={100}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">GST Rate</Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {["0", "3", "5", "12", "18", "28"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-smooth ${rate === r ? "bg-accent text-accent-foreground border-accent" : "border-input text-foreground/65 hover:border-accent/50 hover:text-accent"}`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Calculation Type{" "}
            <InfoTip text="Exclusive: Add GST on top of base price. Inclusive: Extract GST from the total amount." />
          </Label>
          <div className="flex gap-2 pt-1">
            {(["exclusive", "inclusive"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-smooth ${type === t ? "bg-accent text-accent-foreground border-accent" : "border-input text-foreground/65 hover:border-accent/50 hover:text-accent"}`}
              >
                {t === "exclusive" ? "Add GST" : "Remove GST"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-1.5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-bold text-base text-foreground">
              GST Breakdown
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-accent"
            >
              <Copy size={12} />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <ResultRow
            label="Base Amount (excl. GST)"
            value={fmtINR(result.base)}
          />
          <ResultRow
            label={`CGST (${Number(rate) / 2}%)`}
            value={fmtINR(result.cgst)}
          />
          <ResultRow
            label={`SGST (${Number(rate) / 2}%)`}
            value={fmtINR(result.sgst)}
          />
          <ResultRow
            label={`Total GST (${rate}%)`}
            value={fmtINR(result.gst)}
            highlight
          />
          <ResultRow
            label="Total Amount (incl. GST)"
            value={fmtINR(result.total)}
            isTotal
          />
          <p className="text-xs text-muted-foreground pt-2">
            For inter-state transactions, SGST is replaced by IGST ({rate}%).
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2 text-foreground">
            Tax Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <RechartTooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => fmtINR(v)}
              />
              <Legend
                iconSize={10}
                iconType="circle"
                wrapperStyle={{
                  color: "oklch(0.45 0.03 264)",
                  fontSize: "11px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <SectionToggle label="📘 How is GST calculated?">
        <p>
          <strong className="text-foreground">Exclusive (Add GST):</strong> GST
          Amount = Base × Rate%. Total = Base + GST.
        </p>
        <p>
          <strong className="text-foreground">Inclusive (Remove GST):</strong>{" "}
          Base = Total ÷ (1 + Rate%). GST = Total − Base.
        </p>
        <p>
          <strong className="text-foreground">CGST & SGST:</strong> For
          intra-state supplies, GST is split equally. For inter-state, IGST =
          full rate.
        </p>
      </SectionToggle>
    </div>
  );
}

// ─── EMI CALCULATOR ──────────────────────────────────────────────────────────

function EMICalc() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(240);
  const [showAmort, setShowAmort] = useState(false);
  const [amortPage, setAmortPage] = useState(12);

  const result = useMemo(() => {
    if (!principal || !rate || !tenure) return null;
    const r = rate / 1200;
    const n = tenure;
    const emi = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;
    const schedule: {
      month: number;
      emi: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    let balance = principal;
    for (let m = 1; m <= n; m++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({
        month: m,
        emi: Math.round(emi),
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.round(balance),
      });
    }
    const balanceData: { year: string; balance: number }[] = [];
    for (let y = 0; y * 12 <= n; y++) {
      const idx = Math.min(y * 12, n - 1);
      balanceData.push({
        year: `Yr ${y}`,
        balance: y === 0 ? principal : (schedule[idx]?.balance ?? 0),
      });
    }
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      interestPct: ((totalInterest / principal) * 100).toFixed(1),
      schedule,
      balanceData,
    };
  }, [principal, rate, tenure]);

  const donutData = result
    ? [
        { name: "Principal", value: principal, fill: CHART_TEAL },
        {
          name: "Total Interest",
          value: result.totalInterest,
          fill: CHART_CHARCOAL,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="space-y-1">
          <Label className="text-foreground/80">
            Loan Amount <InfoTip text="Total loan amount you wish to borrow." />
          </Label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="emi-principal-input"
          />
          <Slider
            value={[principal]}
            onValueChange={([v]) => setPrincipal(v)}
            min={10000}
            max={10000000}
            step={10000}
          />
          <div className="text-xs text-muted-foreground">
            {fmtINRShort(principal)}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-foreground/80">Annual Interest Rate (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="emi-rate-input"
          />
          <Slider
            value={[rate]}
            onValueChange={([v]) => setRate(v)}
            min={1}
            max={30}
            step={0.1}
          />
          <div className="text-xs text-muted-foreground">{rate}% per annum</div>
        </div>
        <div className="space-y-1">
          <Label className="text-foreground/80">
            Tenure{" "}
            <InfoTip text="Loan repayment period in months. 240 months = 20 years." />
          </Label>
          <Input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="emi-tenure-input"
          />
          <Slider
            value={[tenure]}
            onValueChange={([v]) => setTenure(v)}
            min={6}
            max={360}
            step={6}
          />
          <div className="text-xs text-muted-foreground">
            {tenure} months ({(tenure / 12).toFixed(1)} yrs)
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 text-center">
            <div className="text-sm text-foreground/60 mb-1">Monthly EMI</div>
            <div className="font-display text-5xl font-bold text-accent">
              {fmtINR(result.emi)}
            </div>
            <div className="text-xs text-foreground/50 mt-1">
              for {tenure} months
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Principal",
                value: fmtINRShort(principal),
                sub: "Loan amount",
              },
              {
                label: "Total Interest",
                value: fmtINRShort(result.totalInterest),
                sub: `${result.interestPct}% of loan`,
              },
              {
                label: "Total Payment",
                value: fmtINRShort(result.totalPayment),
                sub: "Principal + Interest",
              },
              {
                label: "Monthly EMI",
                value: fmtINR(result.emi),
                sub: "Fixed installment",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card border border-border rounded-xl p-3 text-center"
              >
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div className="font-bold text-foreground mt-1 text-sm">
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">
                Principal vs Interest
              </h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartTooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => fmtINRShort(v)}
                  />
                  <Legend
                    iconSize={10}
                    iconType="circle"
                    wrapperStyle={{
                      color: "oklch(0.45 0.03 264)",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">
                Outstanding Balance Over Time
              </h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={result.balanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="year" tick={CHART_TEXT} />
                  <YAxis
                    tickFormatter={(v: number) => fmtINRShort(v)}
                    tick={CHART_TEXT}
                  />
                  <RechartTooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [fmtINRShort(v), "Balance"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={CHART_TEAL}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amortization */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAmort(!showAmort)}
              className="w-full flex items-center justify-between px-4 py-3 font-semibold text-sm text-foreground hover:bg-muted/40 transition-smooth"
              data-ocid="emi-amort-toggle"
            >
              <span>Amortization Schedule ({tenure} months)</span>
              {showAmort ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {showAmort && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr>
                      {["Month", "EMI", "Principal", "Interest", "Balance"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-semibold text-foreground/60"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, amortPage).map((row) => (
                      <tr
                        key={row.month}
                        className="border-t border-border/40 hover:bg-accent/5"
                      >
                        <td className="px-3 py-2 font-mono text-foreground/70">
                          {row.month}
                        </td>
                        <td className="px-3 py-2 font-mono text-foreground">
                          {fmtINR(row.emi)}
                        </td>
                        <td className="px-3 py-2 font-mono text-accent font-semibold">
                          {fmtINR(row.principal)}
                        </td>
                        <td className="px-3 py-2 font-mono text-foreground/70">
                          {fmtINR(row.interest)}
                        </td>
                        <td className="px-3 py-2 font-mono text-foreground/60">
                          {fmtINR(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {amortPage < tenure && (
                  <div className="flex justify-center p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setAmortPage((p) => Math.min(p + 12, tenure))
                      }
                      className="text-accent hover:bg-accent/10"
                      data-ocid="emi-load-more"
                    >
                      Load more ({Math.min(12, tenure - amortPage)} rows)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <SectionToggle label="📘 How is EMI calculated?">
        <p>
          <strong className="text-foreground">Formula:</strong> EMI = P × r ×
          (1+r)ⁿ / ((1+r)ⁿ - 1)
        </p>
        <p>
          Where P = Principal, r = monthly rate (annual rate/12/100), n = number
          of months.
        </p>
      </SectionToggle>
    </div>
  );
}

// ─── HRA CALCULATOR ──────────────────────────────────────────────────────────

function HRACalc() {
  const [basic, setBasic] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraRec, setHraRec] = useState(20000);
  const [rent, setRent] = useState(18000);
  const [city, setCity] = useState<"metro" | "nonmetro">("metro");

  const result = useMemo(() => {
    const basicDA = basic + da;
    const rule1 = hraRec;
    const rule2 = basicDA * (city === "metro" ? 0.5 : 0.4);
    const rule3 = Math.max(0, rent - basicDA * 0.1);
    const exempt = Math.min(rule1, rule2, rule3);
    const taxableHRA = hraRec - exempt;
    const annualExempt = exempt * 12;
    const taxSaving = Math.round(annualExempt * 0.3);
    const applicableRule =
      rule1 <= rule2 && rule1 <= rule3 ? 1 : rule2 <= rule3 ? 2 : 3;
    return {
      rule1: Math.round(rule1),
      rule2: Math.round(rule2),
      rule3: Math.round(rule3),
      exempt: Math.round(exempt),
      taxableHRA: Math.round(taxableHRA),
      annualExempt: Math.round(annualExempt),
      taxSaving,
      applicableRule,
    };
  }, [basic, da, hraRec, rent, city]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Monthly Basic Salary (₹){" "}
            <InfoTip text="Basic component of your monthly salary, before allowances." />
          </Label>
          <Input
            type="number"
            value={basic}
            onChange={(e) => setBasic(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="hra-basic-input"
          />
          <Slider
            value={[basic]}
            onValueChange={([v]) => setBasic(v)}
            min={5000}
            max={500000}
            step={1000}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Dearness Allowance (DA) per month (₹){" "}
            <InfoTip text="DA is usually 0 for private sector employees." />
          </Label>
          <Input
            type="number"
            value={da}
            onChange={(e) => setDa(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="hra-da-input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            HRA Received per month (₹)
          </Label>
          <Input
            type="number"
            value={hraRec}
            onChange={(e) => setHraRec(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="hra-received-input"
          />
          <Slider
            value={[hraRec]}
            onValueChange={([v]) => setHraRec(v)}
            min={0}
            max={200000}
            step={500}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Actual Rent Paid per month (₹){" "}
            <InfoTip text="Monthly rent you actually pay to the landlord." />
          </Label>
          <Input
            type="number"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="hra-rent-input"
          />
          <Slider
            value={[rent]}
            onValueChange={([v]) => setRent(v)}
            min={0}
            max={200000}
            step={500}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground/80">
            City Type{" "}
            <InfoTip text="Metro cities: Mumbai, Delhi, Kolkata, Chennai (50% of Basic+DA). Others get 40%." />
          </Label>
          <div className="flex gap-3">
            {(
              [
                ["metro", "Metro (Mumbai, Delhi, Chennai, Kolkata) — 50%"],
                ["nonmetro", "Non-Metro — 40%"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setCity(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-smooth ${city === v ? "bg-accent text-accent-foreground border-accent" : "border-input text-foreground/65 hover:border-accent/50 hover:text-accent"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-foreground">
          HRA Exemption — Three Rules (Minimum applies)
        </h4>
        {[
          {
            num: 1,
            label: "Actual HRA Received",
            value: result.rule1,
            rule: "As received from employer",
          },
          {
            num: 2,
            label: `${city === "metro" ? "50%" : "40%"} of (Basic + DA)`,
            value: result.rule2,
            rule: `${city === "metro" ? "50" : "40"}% × ₹${(basic + da).toLocaleString("en-IN")}`,
          },
          {
            num: 3,
            label: "Rent Paid – 10% of (Basic + DA)",
            value: result.rule3,
            rule: `₹${rent.toLocaleString("en-IN")} − 10% × ₹${(basic + da).toLocaleString("en-IN")}`,
          },
        ].map((rule) => (
          <div
            key={rule.num}
            className={`flex items-center justify-between p-3 rounded-xl border ${result.applicableRule === rule.num ? "border-accent/50 bg-accent/8" : "border-border bg-card"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${result.applicableRule === rule.num ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {rule.num}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {rule.label}
                </div>
                <div className="text-xs text-muted-foreground">{rule.rule}</div>
              </div>
            </div>
            <div
              className={`font-mono font-bold text-sm ${result.applicableRule === rule.num ? "text-accent" : "text-foreground"}`}
            >
              {fmtINR(rule.value)}
              {result.applicableRule === rule.num && (
                <Badge className="ml-2 text-xs bg-accent text-accent-foreground">
                  Applicable ✓
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 space-y-2">
          <div className="text-sm text-foreground/60">
            Monthly HRA Exemption
          </div>
          <div className="font-display text-3xl font-bold text-accent">
            {fmtINR(result.exempt)}
          </div>
          <Separator className="bg-border/40" />
          <div className="text-xs text-foreground/60">
            Taxable HRA: {fmtINR(result.taxableHRA)}/month
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="text-sm text-muted-foreground">Annual Exemption</div>
          <div className="font-bold text-xl text-foreground">
            {fmtINR(result.annualExempt)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Estimated tax saving (30% slab)
          </div>
          <div className="font-bold text-lg text-accent">
            {fmtINR(result.taxSaving)}
          </div>
          <p className="text-xs text-muted-foreground">
            Actual saving depends on your tax slab.
          </p>
        </div>
      </div>

      <SectionToggle label="📘 How is HRA exemption calculated?">
        <p>
          HRA Exemption = <strong className="text-foreground">Minimum</strong>{" "}
          of the following 3 rules:
        </p>
        <p>Rule 1: Actual HRA received</p>
        <p>Rule 2: 50% of (Basic + DA) for Metro / 40% for Non-Metro</p>
        <p>Rule 3: Rent Paid – 10% of (Basic + DA)</p>
        <p>
          Note: If Rule 3 is negative (rent paid &lt; 10% of Basic+DA),
          exemption is NIL.
        </p>
      </SectionToggle>
    </div>
  );
}

// ─── TDS CALCULATOR ──────────────────────────────────────────────────────────

const TDS_SECTIONS_DATA = [
  {
    key: "194A-bank",
    label: "194A — Interest on Bank Deposits",
    rateWith: 10,
    rateWithout: 20,
    threshold: 40000,
    note: "Senior citizens: ₹50,000 threshold",
  },
  {
    key: "194A-other",
    label: "194A — Interest (Other than Bank)",
    rateWith: 10,
    rateWithout: 20,
    threshold: 5000,
    note: "Threshold ₹5,000",
  },
  {
    key: "194C-ind",
    label: "194C — Contractor (Individual/HUF)",
    rateWith: 1,
    rateWithout: 20,
    threshold: 30000,
    note: "Single contract; ₹1L aggregate",
  },
  {
    key: "194C-comp",
    label: "194C — Contractor (Company)",
    rateWith: 2,
    rateWithout: 20,
    threshold: 30000,
    note: "Single contract; ₹1L aggregate",
  },
  {
    key: "194D",
    label: "194D — Insurance Commission",
    rateWith: 5,
    rateWithout: 20,
    threshold: 15000,
    note: "",
  },
  {
    key: "194H",
    label: "194H — Commission / Brokerage",
    rateWith: 5,
    rateWithout: 20,
    threshold: 15000,
    note: "",
  },
  {
    key: "194I-land",
    label: "194I — Rent (Land/Building/Furniture)",
    rateWith: 10,
    rateWithout: 20,
    threshold: 240000,
    note: "Annual threshold ₹2,40,000",
  },
  {
    key: "194I-plant",
    label: "194I — Rent (Plant & Machinery)",
    rateWith: 2,
    rateWithout: 20,
    threshold: 240000,
    note: "Annual threshold ₹2,40,000",
  },
  {
    key: "194J-prof",
    label: "194J — Professional / Technical Fees",
    rateWith: 10,
    rateWithout: 20,
    threshold: 30000,
    note: "",
  },
  {
    key: "194J-dir",
    label: "194J — Director's Remuneration",
    rateWith: 10,
    rateWithout: 20,
    threshold: 0,
    note: "No threshold limit",
  },
  {
    key: "194Q",
    label: "194Q — Purchase of Goods",
    rateWith: 0.1,
    rateWithout: 5,
    threshold: 5000000,
    note: "Threshold ₹50L purchase from one seller",
  },
];

function TDSCalc() {
  const [amount, setAmount] = useState(100000);
  const [section, setSection] = useState("194J-prof");
  const [hasPan, setHasPan] = useState(true);

  const sectionData = TDS_SECTIONS_DATA.find((s) => s.key === section)!;

  const result = useMemo(() => {
    const rate = hasPan
      ? sectionData.rateWith
      : Math.max(sectionData.rateWithout, sectionData.rateWith * 2);
    const tds = (amount * rate) / 100;
    const net = amount - tds;
    return {
      rate,
      tds: Math.round(tds),
      net: Math.round(net),
      grossRate: sectionData.rateWith,
      noPanRate: Math.max(sectionData.rateWithout, sectionData.rateWith * 2),
    };
  }, [amount, sectionData, hasPan]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/80">Payment Amount (₹)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="tds-amount-input"
          />
          <Slider
            value={[amount]}
            onValueChange={([v]) => setAmount(v)}
            min={1000}
            max={5000000}
            step={1000}
          />
          <div className="text-xs text-muted-foreground">
            {fmtINRShort(amount)}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            TDS Section{" "}
            <InfoTip text="Select the appropriate TDS section based on the nature of payment." />
          </Label>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger
              className="bg-background border-input text-foreground"
              data-ocid="tds-section-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {TDS_SECTIONS_DATA.map((s) => (
                <SelectItem
                  key={s.key}
                  value={s.key}
                  className="text-foreground hover:bg-accent/10 focus:bg-accent/10"
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {sectionData.note && (
            <p className="text-xs text-muted-foreground">{sectionData.note}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground/80">
            PAN Available?{" "}
            <InfoTip text="If PAN is not available, TDS is deducted at 20% or twice the applicable rate, whichever is higher (Section 206AA)." />
          </Label>
          <div className="flex gap-3">
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setHasPan(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-smooth ${hasPan === v ? "bg-accent text-accent-foreground border-accent" : "border-input text-foreground/65 hover:border-accent/50 hover:text-accent"}`}
              >
                {v
                  ? `Yes — Normal Rate (${sectionData.rateWith}%)`
                  : `No — Higher Rate (${result.noPanRate}%)`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[
          {
            label: "Gross Payment",
            value: fmtINR(amount),
            sub: "Amount before TDS",
            accent: false,
          },
          {
            label: `TDS @ ${result.rate}%`,
            value: fmtINR(result.tds),
            sub: "Amount to deduct",
            accent: true,
          },
          {
            label: "Net to Payee",
            value: fmtINR(result.net),
            sub: "After TDS deduction",
            accent: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-4 border text-center ${item.accent ? "border-accent/40 bg-accent/8" : "border-border bg-card"}`}
          >
            <div className="text-xs text-muted-foreground mb-1">
              {item.label}
            </div>
            <div
              className={`font-display font-bold text-xl ${item.accent ? "text-accent" : "text-foreground"}`}
            >
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-1.5">
        <h4 className="font-semibold text-sm mb-3 text-foreground">
          TDS Comparison — All Common Sections
        </h4>
        {TDS_SECTIONS_DATA.slice(0, 6).map((s) => {
          const tds = Math.round((amount * s.rateWith) / 100);
          return (
            <div
              key={s.key}
              className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${section === s.key ? "bg-accent/10 border border-accent/25" : "border-b border-border/40"}`}
            >
              <span className="text-foreground/65">{s.label}</span>
              <span className="font-mono font-semibold text-foreground">
                {s.rateWith}% = {fmtINR(tds)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Warning box — semantic tokens */}
      <div className="bg-secondary border border-border rounded-xl p-4 text-xs">
        <strong className="text-foreground font-semibold">
          TDS Deposit Due Date:
        </strong>{" "}
        <span className="text-foreground/75">
          7th of the following month (except March — due 30th April). Late
          deposit attracts interest @ 1.5% per month u/s 201(1A).
        </span>
      </div>

      <SectionToggle label="📘 TDS Rules Summary">
        <p>
          <strong className="text-foreground">Section 206AA:</strong> If PAN not
          furnished, TDS at higher of 20% or twice the applicable rate.
        </p>
        <p>
          <strong className="text-foreground">Lower deduction:</strong> Payee
          can apply for certificate u/s 197 for Nil/Lower TDS.
        </p>
        <p>
          <strong className="text-foreground">Challan:</strong> ITNS 281. Quote
          correct section code while depositing.
        </p>
      </SectionToggle>
    </div>
  );
}

// ─── ADVANCE TAX CALCULATOR ──────────────────────────────────────────────────

function AdvanceTaxCalc() {
  const [income, setIncome] = useState(1500000);
  const [tds, setTds] = useState(80000);
  const [alreadyPaid, setAlreadyPaid] = useState(0);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentQuarter =
    currentMonth <= 6 ? 1 : currentMonth <= 9 ? 2 : currentMonth <= 12 ? 3 : 4;

  const result = useMemo(() => {
    let tax = calcNewTax(income);
    if (income <= 700000) tax = 0;
    const cess = tax * 0.04;
    const totalTax = Math.round(tax + cess);
    const balance = Math.max(0, totalTax - tds - alreadyPaid);
    const quarters = [
      { q: "Q1", due: "15 Jun 2025", cumPct: 15, instPct: 15 },
      { q: "Q2", due: "15 Sep 2025", cumPct: 45, instPct: 30 },
      { q: "Q3", due: "15 Dec 2025", cumPct: 75, instPct: 30 },
      { q: "Q4", due: "15 Mar 2026", cumPct: 100, instPct: 25 },
    ];
    return {
      totalTax,
      balance,
      quarters: quarters.map((q, i) => ({
        ...q,
        instAmount: Math.round((balance * q.instPct) / 100),
        cumAmount: Math.round((balance * q.cumPct) / 100),
        isCurrent: i + 1 === currentQuarter,
      })),
    };
  }, [income, tds, alreadyPaid, currentQuarter]);

  const chartData = result.quarters.map((q) => ({
    name: q.q,
    amount: q.instAmount,
  }));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Estimated Annual Income (₹){" "}
            <InfoTip text="Your estimated total income for FY 2025-26 from all sources." />
          </Label>
          <Input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="adv-income-input"
          />
          <Slider
            value={[income]}
            onValueChange={([v]) => setIncome(v)}
            min={500000}
            max={20000000}
            step={100000}
          />
          <div className="text-xs text-muted-foreground">
            {fmtINRShort(income)}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            TDS Deducted at Source (₹){" "}
            <InfoTip text="Total TDS deducted by employer/bank/payer during the year. Check Form 26AS." />
          </Label>
          <Input
            type="number"
            value={tds}
            onChange={(e) => setTds(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="adv-tds-input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">
            Advance Tax Already Paid (₹){" "}
            <InfoTip text="Total advance tax you have already paid in earlier installments this FY." />
          </Label>
          <Input
            type="number"
            value={alreadyPaid}
            onChange={(e) => setAlreadyPaid(Number(e.target.value) || 0)}
            className="bg-background border-input text-foreground"
            data-ocid="adv-paid-input"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[
          {
            label: "Total Tax Liability",
            value: fmtINR(result.totalTax),
            sub: "Incl. 4% cess, New Regime",
            highlight: false,
          },
          {
            label: "Less: TDS + Paid",
            value: fmtINR(tds + alreadyPaid),
            sub: "Already covered",
            highlight: false,
          },
          {
            label: "Net Advance Tax Due",
            value: fmtINR(result.balance),
            sub: "Balance to be paid",
            highlight: true,
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-4 text-center border ${item.highlight ? "border-accent/40 bg-accent/8" : "border-border bg-card"}`}
          >
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div
              className={`font-display font-bold text-xl mt-1 ${item.highlight ? "text-accent" : "text-foreground"}`}
            >
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Quarterly Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border font-semibold text-sm text-foreground">
          Quarterly Installment Schedule — FY 2025-26
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/40">
              <tr>
                {[
                  "Quarter",
                  "Due Date",
                  "% of Tax",
                  "Installment",
                  "Cumulative",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-foreground/50"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.quarters.map((q) => (
                <tr
                  key={q.q}
                  className={`border-b border-border/40 ${q.isCurrent ? "bg-accent/8 border-l-2 border-l-accent" : "hover:bg-muted/30"}`}
                  data-ocid={`adv-quarter-${q.q.toLowerCase()}`}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {q.q}
                    {q.isCurrent && (
                      <Badge className="ml-2 text-xs bg-accent text-accent-foreground">
                        Current
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/70">
                    {q.due}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">{q.instPct}%</td>
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">
                    {fmtINR(q.instAmount)}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {fmtINR(q.cumAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.isCurrent ? "bg-accent/15 text-accent border border-accent/30" : "bg-muted text-muted-foreground"}`}
                    >
                      {q.isCurrent ? "Due Soon" : "Upcoming"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-3 text-foreground">
          Quarterly Installments (₹)
        </h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
            <XAxis dataKey="name" tick={CHART_TEXT} />
            <YAxis
              tickFormatter={(v: number) => fmtINRShort(v)}
              tick={CHART_TEXT}
            />
            <RechartTooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [fmtINR(v), "Installment"]}
            />
            <Bar dataKey="amount" fill={CHART_TEAL} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interest implications — semantic tokens */}
      <div className="bg-destructive/8 border border-destructive/25 rounded-xl p-4 text-sm space-y-1.5">
        <div className="font-semibold mb-1 text-destructive">
          ⚠️ Interest Implications for Default
        </div>
        <div className="text-foreground/75">
          <strong className="text-foreground">Section 234B:</strong> 1% per
          month if advance tax paid &lt; 90% of assessed tax.
        </div>
        <div className="text-foreground/75">
          <strong className="text-foreground">Section 234C:</strong> 1% per
          month for shortfall in each quarterly installment.
        </div>
        <div className="text-foreground/75">
          <strong className="text-foreground">Section 234A:</strong> 1% per
          month for delay in filing ITR beyond due date.
        </div>
      </div>

      <SectionToggle label="📘 Who must pay Advance Tax?">
        <p>
          If your tax liability after TDS is{" "}
          <strong className="text-foreground">₹10,000 or more</strong>, you must
          pay advance tax.
        </p>
        <p>
          Salaried employees with only salary income are exempt — TDS by
          employer covers it.
        </p>
        <p>
          Business income taxpayers (presumptive u/s 44AD): can pay entire
          advance tax by 15th March.
        </p>
      </SectionToggle>
    </div>
  );
}

// ─── MAIN CALCULATORS PAGE ────────────────────────────────────────────────────

const CALCULATORS = [
  {
    id: "income-tax",
    title: "Income Tax",
    subtitle: "Old vs New Regime",
    icon: "📊",
    badge: "FY 2024-25",
    component: IncomeTaxCalc,
  },
  {
    id: "gst",
    title: "GST",
    subtitle: "Inclusive & Exclusive",
    icon: "🧾",
    badge: "CGST + SGST",
    component: GSTCalc,
  },
  {
    id: "emi",
    title: "EMI",
    subtitle: "Loan & Amortization",
    icon: "🏦",
    badge: "With Chart",
    component: EMICalc,
  },
  {
    id: "hra",
    title: "HRA Exemption",
    subtitle: "Sec 10(13A) Calculation",
    icon: "🏠",
    badge: "3-Rule Method",
    component: HRACalc,
  },
  {
    id: "tds",
    title: "TDS",
    subtitle: "Section-wise Deduction",
    icon: "📋",
    badge: "All Sections",
    component: TDSCalc,
  },
  {
    id: "advance-tax",
    title: "Advance Tax",
    subtitle: "Quarterly Schedule",
    icon: "📅",
    badge: "FY 2025-26",
    component: AdvanceTaxCalc,
  },
];

export function CalculatorsPage() {
  const [active, setActive] = useState("income-tax");
  const current = CALCULATORS.find((c) => c.id === active)!;
  const CurrentComponent = current.component;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* Hero — charcoal gradient with white text (strong contrast) */}
      <section className="gradient-hero py-16" data-ocid="calc-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-5">
              <Calculator size={14} />6 Free Professional Tools
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Tax &amp; Finance Calculators
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Accurate, real-time calculators for Indian tax planning — Income
              Tax, GST, EMI, HRA, TDS &amp; Advance Tax
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {CALCULATORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${
                    active === c.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-white/30 text-white/70 hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  {c.icon} {c.title}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content — white background */}
      <section className="py-12 bg-background" data-ocid="calc-section">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0 w-full">
              <div
                className="lg:sticky lg:top-24 space-y-1.5"
                data-ocid="calc-sidebar"
              >
                {CALCULATORS.map((calc) => (
                  <button
                    key={calc.id}
                    type="button"
                    onClick={() => setActive(calc.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-smooth ${
                      active === calc.id
                        ? "bg-accent/10 border border-accent/40 text-foreground shadow-subtle"
                        : "bg-card border border-border text-foreground hover:border-accent/30 hover:bg-accent/5"
                    }`}
                    data-ocid={`calc-tab-${calc.id}`}
                  >
                    <span className="text-xl shrink-0">{calc.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-semibold text-sm ${active === calc.id ? "text-accent" : "text-foreground"}`}
                      >
                        {calc.title}
                      </div>
                      <div className="text-xs mt-0.5 text-muted-foreground">
                        {calc.subtitle}
                      </div>
                    </div>
                    <Badge
                      className={`text-xs shrink-0 ${active === calc.id ? "bg-accent/20 text-accent border-0" : "bg-muted text-muted-foreground border-0"}`}
                    >
                      {calc.badge}
                    </Badge>
                  </button>
                ))}

                {/* CTA card */}
                <div className="mt-4 bg-accent/8 border border-accent/20 rounded-xl p-4 text-center">
                  <div className="text-sm font-semibold text-foreground mb-1">
                    Need expert advice?
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Our CA team will optimise your tax legally.
                  </p>
                  <a
                    href="/consultation"
                    className="block w-full py-2 bg-accent text-accent-foreground rounded-lg text-xs font-semibold hover:bg-accent/90 transition-smooth"
                    data-ocid="calc-cta-consultation"
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>

            {/* Calculator Panel */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-subtle"
                  data-ocid="calc-panel"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0">
                        {current.icon}
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {current.title} Calculator
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {current.subtitle} · {current.badge}
                        </p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setActive(active)}
                            aria-label="Reset calculator"
                            className="p-2 rounded-lg hover:bg-muted/50 transition-smooth text-muted-foreground hover:text-accent"
                            data-ocid="calc-reset"
                          >
                            <RefreshCw size={15} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-card border-border text-foreground">
                          Reset to defaults
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CurrentComponent />
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  These calculators provide estimates for financial planning
                  purposes only. For accurate computation and tax advice,
                  consult our qualified CA team.{" "}
                  <a
                    href="/consultation"
                    className="text-accent hover:underline"
                  >
                    Book a consultation →
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
