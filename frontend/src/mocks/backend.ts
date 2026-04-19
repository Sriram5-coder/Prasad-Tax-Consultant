import type { backendInterface, Testimonial, Booking, ContactLead, StripeSession } from "../backend";
import { ConsultationType, PaymentStatus } from "../backend";

const sampleTestimonials: Testimonial[] = [
  {
    id: BigInt(1),
    isApproved: true,
    name: "Ravi Kumar",
    createdAt: BigInt(Date.now()),
    feedback: "Prasad CA Works helped us file our ITR seamlessly. Highly professional and responsive team.",
    company: "Kumar Enterprises",
    rating: BigInt(5),
    industry: "Manufacturing",
  },
  {
    id: BigInt(2),
    isApproved: true,
    name: "Sunita Reddy",
    createdAt: BigInt(Date.now()),
    feedback: "Excellent GST filing support. They explained every step clearly. Would recommend to anyone.",
    company: "Reddy Traders",
    rating: BigInt(5),
    industry: "Retail",
  },
];

const sampleBookings: Booking[] = [
  {
    id: BigInt(1),
    status: "confirmed",
    serviceCategory: "Income Tax",
    paymentStatus: PaymentStatus.paid,
    consultantName: "CA Prasad",
    queryDescription: "ITR filing for FY 2024-25",
    name: "Arjun Sharma",
    createdAt: BigInt(Date.now()),
    email: "arjun@example.com",
    preferredDate: "2026-04-15",
    preferredTime: "10:00 AM",
    phone: "8686457586",
    consultationType: ConsultationType.serviceSpecific,
  },
];

const sampleLeads: ContactLead[] = [
  {
    id: BigInt(1),
    subject: "General Inquiry",
    name: "Priya Nair",
    createdAt: BigInt(Date.now()),
    email: "priya@example.com",
    message: "I need help with my business registration.",
    phone: "9123456789",
  },
];

export const mockBackend: backendInterface = {
  adminApproveTestimonial: async (_id: bigint) => true,
  adminDeleteTestimonial: async (_id: bigint) => true,
  adminGetAllTestimonials: async () => sampleTestimonials,
  createConsultationCheckout: async (_bookingId: bigint) =>
    "https://checkout.stripe.com/pay/cs_test_mock",
  getApprovedTestimonials: async () => sampleTestimonials,
  getBookings: async () => sampleBookings,
  getContactLeads: async () => sampleLeads,
  getPaymentStatus: async (_bookingId: bigint) => PaymentStatus.paid,
  getStripeSession: async (_bookingId: bigint): Promise<StripeSession | null> => ({
    status: PaymentStatus.paid,
    bookingId: BigInt(1),
    createdAt: BigInt(Date.now()),
    currency: "inr",
    checkoutUrl: "https://checkout.stripe.com/pay/cs_test_mock",
    sessionId: "cs_test_mock_session_id",
    amount: BigInt(14900),
  }),
  setAdminPrincipal: async (_newAdmin: string) => undefined,
  submitBooking: async (
    _name, _email, _phone, _serviceCategory, _preferredDate, _preferredTime, _consultantName, _queryDescription
  ) => BigInt(2),
  submitContactLead: async (_name, _email, _phone, _subject, _message) => BigInt(2),
  submitGeneralGuidanceBooking: async (_name, _email, _phone, _preferredDate, _preferredTime, _queryDescription) =>
    BigInt(2),
  submitTestimonial: async (_name, _company, _industry, _feedback, _rating) => BigInt(3),
  updateStripeSession: async (_sessionId, _paid) => true,
  verifyConsultationPayment: async (_sessionId) => PaymentStatus.paid,
};
