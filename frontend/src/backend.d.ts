import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactLead {
    id: bigint;
    subject: string;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface Booking {
    id: bigint;
    status: string;
    serviceCategory: string;
    paymentStatus: PaymentStatus;
    consultantName: string;
    queryDescription: string;
    name: string;
    createdAt: bigint;
    email: string;
    preferredDate: string;
    preferredTime: string;
    phone: string;
    consultationType: ConsultationType;
}
export interface StripeSession {
    status: PaymentStatus;
    bookingId: bigint;
    createdAt: bigint;
    currency: string;
    checkoutUrl: string;
    sessionId: string;
    amount: bigint;
}
export interface Testimonial {
    id: bigint;
    isApproved: boolean;
    name: string;
    createdAt: bigint;
    feedback: string;
    company: string;
    rating?: bigint;
    industry: string;
}
export enum ConsultationType {
    generalGuidance = "generalGuidance",
    serviceSpecific = "serviceSpecific"
}
export enum PaymentStatus {
    na = "na",
    pending = "pending",
    paid = "paid"
}
export interface backendInterface {
    adminApproveTestimonial(id: bigint): Promise<boolean>;
    adminDeleteTestimonial(id: bigint): Promise<boolean>;
    adminGetAllTestimonials(): Promise<Array<Testimonial>>;
    createConsultationCheckout(bookingId: bigint): Promise<string>;
    getApprovedTestimonials(): Promise<Array<Testimonial>>;
    getBookings(): Promise<Array<Booking>>;
    getContactLeads(): Promise<Array<ContactLead>>;
    getPaymentStatus(bookingId: bigint): Promise<PaymentStatus | null>;
    getStripeSession(bookingId: bigint): Promise<StripeSession | null>;
    setAdminPrincipal(newAdmin: string): Promise<void>;
    submitBooking(name: string, email: string, phone: string, serviceCategory: string, preferredDate: string, preferredTime: string, consultantName: string, queryDescription: string): Promise<bigint>;
    submitContactLead(name: string, email: string, phone: string, subject: string, message: string): Promise<bigint>;
    submitGeneralGuidanceBooking(name: string, email: string, phone: string, preferredDate: string, preferredTime: string, queryDescription: string): Promise<bigint>;
    submitTestimonial(name: string, company: string, industry: string, feedback: string, rating: bigint | null): Promise<bigint>;
    updateStripeSession(sessionId: string, paid: boolean): Promise<boolean>;
    verifyConsultationPayment(sessionId: string): Promise<PaymentStatus>;
}
