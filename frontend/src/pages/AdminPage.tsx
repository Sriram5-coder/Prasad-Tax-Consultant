import type { Booking, ContactLead, Subscriber, Testimonial } from "@/hooks/useQueries";
import { getId } from "@/hooks/useQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle, BookOpen, Calendar, CheckCircle2, ClipboardList,
  LogOut, Mail, MessageSquare, Phone, Settings, Shield, Star,
  Trash2, Users, Search, Filter, StickyNote, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  useAdminApproveTestimonial, useAdminDeleteTestimonial,
  useAdminGetAllTestimonials, useGetContactLeads, useGetBookings,
  useAdminGetSubscribers, useAdminDeleteSubscriber,
  useUpdateBooking, useUpdateContactLead, useAdminLogin,
  getToken, setToken, clearToken, downloadCSV, useSendNewsletter,
} from "../hooks/useQueries";

// ─── Login screen ─────────────────────────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login.mutateAsync({ username, password });
      setToken(res.token);
      toast.success("Welcome back!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield size={26} className="text-accent" />
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">Prasad  Tax Consultant</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel — Sign in to continue</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                disabled={login.isPending}
              >
                {login.isPending ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">Authorised personnel only</p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(val: string | number) {
  return new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(val: string | number) {
  return new Date(val).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new:       "bg-blue-100 text-blue-700 border-blue-200",
    contacted: "bg-amber-100 text-amber-700 border-amber-200",
    resolved:  "bg-green-100 text-green-700 border-green-200",
    done:      "bg-green-100 text-green-700 border-green-200",
    pending:   "bg-slate-100 text-slate-600 border-slate-200",
    confirmed: "bg-teal-100 text-teal-700 border-teal-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
    paid:      "bg-green-100 text-green-700 border-green-200",
    failed:    "bg-red-100 text-red-600 border-red-200",
    na:        "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${map[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={12} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
      ))}
    </div>
  );
}

function NotesEditor({ currentNotes, onSave, isPending }: { currentNotes: string; onSave: (n: string) => void; isPending: boolean }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(currentNotes);
  useEffect(() => { setNotes(currentNotes); }, [currentNotes]);

  return (
    <div className="mt-2">
      <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <StickyNote size={11} />
        {currentNotes ? "Edit notes" : "Add notes"}
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="Internal notes (not visible to customer)"
            className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button size="sm" className="h-7 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => { onSave(notes); setOpen(false); }} disabled={isPending}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function BookingCard({ b }: { b: Booking }) {
  const update = useUpdateBooking();
  const id = getId(b);
  const set = (field: string, val: string) =>
    update.mutateAsync({ id, [field]: val } as any)
      .then(() => toast.success("Updated"))
      .catch((err: any) => toast.error(err.message || "Failed"));

  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">{b.name}</span>
              <code className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 font-mono">{b.bookingRef}</code>
              <StatusBadge status={b.contactedStatus || "new"} />
              <StatusBadge status={b.status} />
              {b.paymentStatus !== "na" && <StatusBadge status={b.paymentStatus} />}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {b.consultationType === "generalGuidance" ? "General Guidance" : b.serviceCategory || "—"}
              {" · "}{fmtDate(b.createdAt)} at {fmtTime(b.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Mail size={11} />{b.email}</span>
          {b.phone && <span className="flex items-center gap-1"><Phone size={11} />{b.phone}</span>}
          {b.preferredDate && <span className="flex items-center gap-1"><Calendar size={11} />{b.preferredDate}{b.preferredTime ? ` at ${b.preferredTime}` : ""}</span>}
        </div>
        {b.queryDescription && (
          <p className="text-xs text-foreground/70 bg-muted rounded-lg p-3 leading-relaxed">{b.queryDescription}</p>
        )}
        {b.adminNotes && (
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
            <span className="font-semibold">Note: </span>{b.adminNotes}
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <select value={b.contactedStatus || "new"} onChange={e => set("contactedStatus", e.target.value)}
            className="text-xs border border-input rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="new">🔵 New</option>
            <option value="contacted">🟡 Contacted</option>
            <option value="done">🟢 Done</option>
          </select>
          <select value={b.status} onChange={e => set("status", e.target.value)}
            className="text-xs border border-input rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <NotesEditor currentNotes={b.adminNotes || ""} onSave={n => set("adminNotes", n)} isPending={update.isPending} />
      </CardContent>
    </Card>
  );
}

function ContactLeadCard({ lead }: { lead: ContactLead }) {
  const update = useUpdateContactLead();
  const id = getId(lead);
  const set = (field: string, val: string) =>
    update.mutateAsync({ id, [field]: val } as any)
      .then(() => toast.success("Updated"))
      .catch((err: any) => toast.error(err.message || "Failed"));

  return (
    <Card className="border-l-4 border-l-teal-400">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">{lead.name}</span>
              <code className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 rounded px-1.5 py-0.5 font-mono">{lead.leadRef}</code>
              <StatusBadge status={lead.status || "new"} />
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lead.subject || "—"} · {fmtDate(lead.createdAt)} at {fmtTime(lead.createdAt)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Mail size={11} />{lead.email}</span>
          {lead.phone && <span className="flex items-center gap-1"><Phone size={11} />{lead.phone}</span>}
        </div>
        {lead.message && (
          <p className="text-xs text-foreground/70 bg-muted rounded-lg p-3 leading-relaxed">{lead.message}</p>
        )}
        {lead.adminNotes && (
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
            <span className="font-semibold">Note: </span>{lead.adminNotes}
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <select value={lead.status || "new"} onChange={e => set("status", e.target.value)}
            className="text-xs border border-input rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="new">🔵 New</option>
            <option value="contacted">🟡 Contacted</option>
            <option value="resolved">🟢 Resolved</option>
          </select>
        </div>
        <NotesEditor currentNotes={lead.adminNotes || ""} onSave={n => set("adminNotes", n)} isPending={update.isPending} />
      </CardContent>
    </Card>
  );
}

function TestimonialAdminCard({ t }: { t: Testimonial }) {
  const approve = useAdminApproveTestimonial();
  const del = useAdminDeleteTestimonial();
  const rating = t.rating != null ? Number(t.rating) : 0;
  const id = getId(t);
  return (
    <Card className={`border-l-4 ${t.isApproved ? "border-l-accent" : "border-l-amber-400"}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{t.name}</span>
              <Badge variant="outline" className={`text-[10px] ${t.isApproved ? "border-accent/40 text-accent" : "border-amber-400/50 text-amber-600"}`}>
                {t.isApproved ? "Published" : "Pending"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.company}{t.industry ? ` · ${t.industry}` : ""}</div>
          </div>
          {rating > 0 && <StarDisplay rating={rating} />}
        </div>
        <p className="text-sm text-foreground/75 italic">&ldquo;{t.feedback}&rdquo;</p>
        <div className="flex gap-2 flex-wrap">
          {!t.isApproved && (
            <Button size="sm" variant="outline" className="border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground text-xs h-8"
              onClick={() => approve.mutateAsync(id).then(() => toast.success("Approved")).catch(() => toast.error("Failed"))} disabled={approve.isPending}>
              <CheckCircle2 size={13} className="mr-1.5" />Approve
            </Button>
          )}
          <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs h-8 ml-auto"
            onClick={() => { if (!confirm("Delete this testimonial?")) return; del.mutateAsync(id).then(() => toast.success("Deleted")).catch(() => toast.error("Failed")); }}
            disabled={del.isPending}>
            <Trash2 size={13} className="mr-1.5" />Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriberCard({ sub }: { sub: Subscriber }) {
  const del = useAdminDeleteSubscriber();
  return (
    <Card className="border-l-4 border-l-green-400">
      <CardContent className="p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Mail size={13} className="text-green-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{sub.email}</div>
            {sub.name && <div className="text-xs text-muted-foreground">{sub.name}</div>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{fmtDate(sub.subscribedAt)}</span>
          <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs h-7"
            onClick={() => del.mutateAsync(getId(sub)).catch(() => toast.error("Failed"))} disabled={del.isPending}>
            <Trash2 size={12} className="mr-1" />Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


// ─── Newsletter Broadcast ──────────────────────────────────────────────────────
function NewsletterBroadcast({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const send = useSendNewsletter();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    if (!confirm(`Send to ${count} subscriber${count > 1 ? "s" : ""}?`)) return;
    try {
      const res = await send.mutateAsync({ subject, message });
      toast.success(`Sent to ${res.sent} subscriber${res.sent > 1 ? "s" : ""}!`);
      setSubject(""); setMessage(""); setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send");
    }
  };

  return (
    <div className="mt-6 border-t border-border pt-6">
      <button type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
        <Mail size={15} />
        Send Newsletter to all {count} subscribers
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-4 space-y-3 p-4 bg-muted/50 rounded-xl border border-border">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. ITR Filing Deadline — 31st July Reminder"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              rows={5} placeholder="Write your newsletter content here..."
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSend} disabled={send.isPending}>
              {send.isPending ? "Sending…" : `Send to ${count} subscribers`}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
          <p className="text-xs text-muted-foreground">This will send an email to all active subscribers immediately.</p>
        </div>
      )}
    </div>
  );
}

function FilterBar({ search, onSearch, statusFilter, onStatus, statuses }:
  { search: string; onSearch: (s: string) => void; statusFilter: string; onStatus: (s: string) => void; statuses: string[] }) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search by name, email, ID…"
          className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="flex items-center gap-1">
        <Filter size={13} className="text-muted-foreground" />
        <select value={statusFilter} onChange={e => onStatus(e.target.value)}
          className="text-sm border border-input rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type AdminTab = "consultations" | "contacts" | "testimonials" | "subscribers" | "setup";
const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "consultations", label: "Consultations",  icon: Users },
  { id: "contacts",      label: "Contact Leads",  icon: ClipboardList },
  { id: "testimonials",  label: "Testimonials",   icon: MessageSquare },
  { id: "subscribers",   label: "Subscribers",    icon: Mail },
  { id: "setup",         label: "Setup",          icon: Settings },
];

// ─── Main AdminPage ───────────────────────────────────────────────────────────

export function AdminPage() {
  // ALL hooks must be called unconditionally at the top
  const [authed, setAuthed] = useState(!!getToken());
  const [activeTab, setActiveTab] = useState<AdminTab>("consultations");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatus, setContactStatus] = useState("all");

  const { data: rawBookings, isLoading: bLoading } = useGetBookings();
  const { data: rawContacts, isLoading: cLoading } = useGetContactLeads();
  const { data: testimonials, isLoading: tLoading } = useAdminGetAllTestimonials();
  const { data: subscribers, isLoading: sLoading } = useAdminGetSubscribers();

  // Safe normalize — always arrays
  const bookings: Booking[] = useMemo(() => Array.isArray(rawBookings) ? rawBookings : [], [rawBookings]);
  const contacts: ContactLead[] = useMemo(() => Array.isArray(rawContacts) ? rawContacts : [], [rawContacts]);
  const pending = useMemo(() => Array.isArray(testimonials) ? testimonials.filter(t => !t.isApproved) : [], [testimonials]);
  const approved = useMemo(() => Array.isArray(testimonials) ? testimonials.filter(t => t.isApproved) : [], [testimonials]);

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      list = list.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.bookingRef?.toLowerCase().includes(q) ||
        b.phone?.includes(q)
      );
    }
    if (bookingStatus !== "all") list = list.filter(b => b.contactedStatus === bookingStatus);
    if (paymentFilter !== "all") list = list.filter(b => b.paymentStatus === paymentFilter);
    return list;
  }, [bookings, bookingSearch, bookingStatus, paymentFilter]);

  const filteredContacts = useMemo(() => {
    let list = [...contacts];
    if (contactSearch) {
      const q = contactSearch.toLowerCase();
      list = list.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.leadRef?.toLowerCase().includes(q)
      );
    }
    if (contactStatus !== "all") list = list.filter(l => l.status === contactStatus);
    return list;
  }, [contacts, contactSearch, contactStatus]);

  const newBookings = bookings.filter(b => (b.contactedStatus || "new") === "new").length;
  const newContacts = contacts.filter(c => (c.status || "new") === "new").length;

  // Show login screen — hooks already called above so React rule is satisfied
  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-primary-foreground">Prasad CA Works</h1>
          </div>
          <Button variant="outline" size="sm"
            className="border-primary-foreground/30 text-accent hover:bg-primary-foreground/10"
            onClick={() => { clearToken(); setAuthed(false); toast.info("Signed out"); }}>
            <LogOut size={14} className="mr-2 text-accent" />Sign Out
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "New Consultations", value: newBookings,            icon: Users,         color: "text-blue-500" },
            { label: "New Leads",         value: newContacts,            icon: ClipboardList, color: "text-teal-500" },
            { label: "Total Bookings",    value: bookings.length,        icon: BookOpen,      color: "text-accent" },
            { label: "Reviews Pending",   value: pending.length,         icon: MessageSquare, color: "text-amber-500" },
            { label: "Subscribers",       value: subscribers?.length ?? 0, icon: Mail,        color: "text-green-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className={color} />
                </div>
                <div>
                  <div className="font-display font-bold text-xl">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit mb-8 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${activeTab === id ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} />{label}
              {id === "consultations" && newBookings > 0 && <span className="ml-1 bg-blue-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{newBookings}</span>}
              {id === "contacts"      && newContacts > 0  && <span className="ml-1 bg-teal-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{newContacts}</span>}
              {id === "testimonials"  && pending.length > 0 && <span className="ml-1 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{pending.length}</span>}
            </button>
          ))}
        </div>

        {/* ── CONSULTATIONS ── */}
        {activeTab === "consultations" && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Users size={17} className="text-blue-500" />
                Consultation Bookings ({bookings.length})
              </h2>
              <button type="button" className="text-xs border border-input rounded-lg px-3 py-1.5 hover:bg-muted transition-smooth flex items-center gap-1"
                onClick={() => downloadCSV("bookings")}>
                ⬇ Export CSV
              </button>
            </div>
            <FilterBar search={bookingSearch} onSearch={setBookingSearch}
              statusFilter={bookingStatus} onStatus={setBookingStatus}
              statuses={["new", "contacted", "done"]} />
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Payment:</span>
              {["all", "na", "pending", "paid"].map(p => (
                <button key={p} type="button" onClick={() => setPaymentFilter(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-smooth ${paymentFilter === p ? "bg-accent text-accent-foreground border-accent" : "border-input text-muted-foreground hover:text-foreground"}`}>
                  {p === "all" ? "All" : p === "na" ? "Free" : p === "pending" ? "⏳ Unpaid" : "✅ Paid"}
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                · {bookings.filter(b => b.paymentStatus === "paid").length} paid,{" "}
                {bookings.filter(b => b.paymentStatus === "pending").length} unpaid
              </span>
            </div>
            {bLoading ? (
              <div className="space-y-3">{["a", "b", "c"].map(k => <Skeleton key={k} className="h-32 rounded-xl" />)}</div>
            ) : filteredBookings.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No bookings found.</CardContent></Card>
            ) : (
              <div className="space-y-3">{filteredBookings.map(b => <BookingCard key={getId(b)} b={b} />)}</div>
            )}
          </div>
        )}

        {/* ── CONTACTS ── */}
        {activeTab === "contacts" && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <ClipboardList size={17} className="text-teal-500" />
                Contact Enquiries ({contacts.length})
              </h2>
              <button type="button" className="text-xs border border-input rounded-lg px-3 py-1.5 hover:bg-muted transition-smooth flex items-center gap-1"
                onClick={() => downloadCSV("contacts")}>
                ⬇ Export CSV
              </button>
            </div>
            <FilterBar search={contactSearch} onSearch={setContactSearch}
              statusFilter={contactStatus} onStatus={setContactStatus}
              statuses={["new", "contacted", "resolved"]} />
            {cLoading ? (
              <div className="space-y-3">{["a", "b", "c"].map(k => <Skeleton key={k} className="h-28 rounded-xl" />)}</div>
            ) : filteredContacts.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No enquiries found.</CardContent></Card>
            ) : (
              <div className="space-y-3">{filteredContacts.map(l => <ContactLeadCard key={getId(l)} lead={l} />)}</div>
            )}
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {activeTab === "testimonials" && (
          <div className="space-y-8">
            {tLoading ? (
              <div className="space-y-3">{["a", "b", "c"].map(k => <Skeleton key={k} className="h-32 rounded-xl" />)}</div>
            ) : (
              <>
                {pending.length > 0 && (
                  <div>
                    <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                      <AlertTriangle size={17} className="text-amber-500" />Pending ({pending.length})
                    </h2>
                    <div className="space-y-3">{pending.map(t => <TestimonialAdminCard key={getId(t)} t={t} />)}</div>
                  </div>
                )}
                <div>
                  <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-accent" />Published ({approved.length})
                  </h2>
                  {approved.length === 0
                    ? <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No published testimonials yet.</CardContent></Card>
                    : <div className="space-y-3">{approved.map(t => <TestimonialAdminCard key={getId(t)} t={t} />)}</div>}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SUBSCRIBERS ── */}
        {activeTab === "subscribers" && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Mail size={17} className="text-green-500" />
                Newsletter Subscribers ({subscribers?.length ?? 0})
              </h2>
              <div className="flex gap-2 flex-wrap">
                {(subscribers?.length ?? 0) > 0 && (
                  <button type="button" className="text-xs text-accent hover:underline"
                    onClick={() => { navigator.clipboard.writeText((subscribers ?? []).map(s => s.email).join("\n")); toast.success("All emails copied!"); }}>
                    📋 Copy all emails
                  </button>
                )}
                <button type="button" className="text-xs border border-input rounded-lg px-3 py-1 hover:bg-muted transition-smooth"
                  onClick={() => downloadCSV("subscribers")}>
                  ⬇ Export CSV
                </button>
              </div>
            </div>
            {sLoading ? (
              <div className="space-y-2">{["a", "b", "c"].map(k => <Skeleton key={k} className="h-14 rounded-xl" />)}</div>
            ) : !subscribers?.length ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No subscribers yet.</CardContent></Card>
            ) : (
              <div className="space-y-2">{subscribers.map(s => <SubscriberCard key={getId(s)} sub={s} />)}</div>
            )}

            {/* Newsletter broadcast */}
            {(subscribers?.length ?? 0) > 0 && (
              <NewsletterBroadcast count={subscribers?.length ?? 0} />
            )}
          </div>
        )}

        {/* ── SETUP ── */}
        {activeTab === "setup" && (
          <div className="max-w-xl space-y-4">
            <Card>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-display font-semibold text-sm">Login</h3>
                <p className="text-sm text-muted-foreground">Username: <code className="bg-muted px-1 rounded text-xs">admin</code></p>
                <p className="text-sm text-muted-foreground">Password is set via <code className="bg-muted px-1 rounded text-xs">ADMIN_PASSWORD</code> in your <code className="bg-muted px-1 rounded text-xs">.env</code> file. Default: <code className="bg-muted px-1 rounded text-xs">prasad@admin2024</code></p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-display font-semibold text-sm">Status guide</h3>
                <div className="text-sm text-muted-foreground space-y-1.5">
                  <div><StatusBadge status="new" /> — Just submitted, not yet contacted</div>
                  <div><StatusBadge status="contacted" /> — You've called/emailed the customer</div>
                  <div><StatusBadge status="done" /> — Fully resolved</div>
                  <div><StatusBadge status="resolved" /> — Contact enquiry resolved</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-display font-semibold text-sm">Reference IDs</h3>
                <p className="text-sm text-muted-foreground">
                  Bookings: <code className="bg-muted px-1 rounded text-xs">PCW-BK-XXXXXX</code> · Contacts: <code className="bg-muted px-1 rounded text-xs">PCW-CL-XXXXXX</code><br />
                  Both are emailed to the customer automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
