import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingFormData, ContactFormData, TestimonialFormData } from "../types";

const API_BASE = "/api";

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const TOKEN_KEY = "admin_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function apiFetch(path: string, opts?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearToken();
      window.location.href = "/admin";
    }
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.json();
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Booking {
  _id?: string;
  id?: number;
  bookingRef: string;
  name: string; email: string; phone: string;
  serviceCategory: string; preferredDate: string; preferredTime: string;
  consultantName: string; queryDescription: string; consultationType: string;
  status: string;
  paymentStatus: string;
  contactedStatus: string;
  adminNotes: string;
  createdAt: string | number;
}

export interface ContactLead {
  _id?: string;
  id?: number;
  leadRef: string;
  name: string; email: string; phone: string; subject: string; message: string;
  status: string;
  adminNotes: string;
  createdAt: string | number;
}

export interface Testimonial {
  _id?: string; id?: number;
  name: string; company: string; industry: string; feedback: string;
  rating: number | null; isApproved: boolean;
  createdAt: string | number;
}

export interface Subscriber {
  _id?: string; id?: number;
  email: string; name: string; active: boolean;
  subscribedAt: string | number;
}

export function getId(item: { _id?: string; id?: number }) {
  return item._id || String(item.id ?? "");
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export function useSubmitBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: BookingFormData) => {
      return apiFetch("/bookings", { method: "POST", body: JSON.stringify({
        name: data.name, email: data.email, phone: data.phone,
        serviceCategory: data.serviceCategory, preferredDate: data.preferredDate,
        preferredTime: data.preferredTime, consultantName: data.consultantName ?? "",
        queryDescription: data.queryDescription, consultationType: "serviceSpecific",
      })});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useSubmitGeneralGuidanceBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: BookingFormData) => {
      return apiFetch("/bookings/general-guidance", { method: "POST", body: JSON.stringify({
        name: data.name, email: data.email, phone: data.phone,
        preferredDate: data.preferredDate, preferredTime: data.preferredTime,
        queryDescription: data.queryDescription,
      })});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// No pagination — returns all bookings
export function useGetBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await apiFetch("/bookings");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
    enabled: !!getToken(),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: string; contactedStatus?: string; adminNotes?: string; paymentStatus?: string }) => {
      return apiFetch(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// ─── Payment ───────────────────────────────────────────────────────────────────

export function useCreateConsultationCheckout() {
  return useMutation({ mutationFn: async (_id: any) => "" });
}
export function useGetPaymentStatus(_id: any) {
  return useQuery({ queryKey: ["ps", _id], queryFn: async () => null, enabled: false });
}
export function useVerifyConsultationPayment() {
  return useMutation({ mutationFn: async (_s: string) => "na" as const });
}
export function useGetPaymentConfig() {
  return useQuery({ queryKey: ["payment-config"], queryFn: () => apiFetch("/payment/config") });
}
export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: async (data: { bookingId: any; amount?: number }) =>
      apiFetch("/payment/create-order", { method: "POST", body: JSON.stringify(data) }),
  });
}
export function useVerifyRazorpayPayment() {
  return useMutation({
    mutationFn: async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; bookingId: any }) =>
      apiFetch("/payment/verify", { method: "POST", body: JSON.stringify(data) }),
  });
}

// ─── Contact Leads ─────────────────────────────────────────────────────────────

export function useSubmitContactLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContactFormData) =>
      apiFetch("/contact-leads", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-leads"] }),
  });
}

export function useGetContactLeads() {
  return useQuery<ContactLead[]>({
    queryKey: ["contact-leads"],
    queryFn: async () => {
      const res = await apiFetch("/contact-leads");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
    enabled: !!getToken(),
  });
}

export function useUpdateContactLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: string; adminNotes?: string }) =>
      apiFetch(`/contact-leads/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-leads"] }),
  });
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

export function useGetTestimonials() {
  return useQuery<Testimonial[]>({ queryKey: ["testimonials"], queryFn: () => apiFetch("/testimonials") });
}

export function useSubmitTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: TestimonialFormData) =>
      apiFetch("/testimonials", { method: "POST", body: JSON.stringify({
        name: data.name, company: data.company, industry: data.industry,
        feedback: data.feedback, rating: data.rating ?? null,
      })}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useAdminGetAllTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await apiFetch("/admin/testimonials");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.testimonials)) return res.testimonials;
      return [];
    },
    enabled: !!getToken(),
  });
}

export function useAdminApproveTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => apiFetch(`/admin/testimonials/${id}/approve`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useAdminDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => apiFetch(`/admin/testimonials/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (data: { email: string; name?: string }) =>
      apiFetch("/newsletter/subscribe", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useAdminGetSubscribers() {
  return useQuery<Subscriber[]>({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const res = await apiFetch("/admin/subscribers");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.subscribers)) return res.subscribers;
      return [];
    },
    enabled: !!getToken(),
  });
}

export function useAdminDeleteSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => apiFetch(`/admin/subscribers/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export function useAdminLogin() {
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const t = await res.json().catch(() => ({ error: "Login failed" }));
        throw new Error(t.error || "Invalid credentials");
      }
      return res.json() as Promise<{ ok: boolean; token: string }>;
    },
  });
}

// ─── Admin export ──────────────────────────────────────────────────────────────

export function downloadCSV(type: "bookings" | "contacts" | "subscribers") {
  const token = getToken();
  const link = document.createElement("a");
  link.href = `/api/admin/export/${type}`;
  // Fetch with auth header
  fetch(`/api/admin/export/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${type}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
}

// ─── Admin newsletter broadcast ───────────────────────────────────────────────

export function useSendNewsletter() {
  return useMutation({
    mutationFn: async (data: { subject: string; message: string }) => {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const t = await res.json(); throw new Error(t.error || "Failed"); }
      return res.json() as Promise<{ ok: boolean; sent: number; total: number }>;
    },
  });
}
