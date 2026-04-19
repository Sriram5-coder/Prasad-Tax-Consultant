export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  benefits: string[];
  icon: string;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: Service[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  industry: string;
  feedback: string;
  rating?: number;
  createdAt?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  preferredDate: string;
  preferredTime: string;
  queryDescription: string;
  consultationType: "serviceSpecific" | "generalGuidance";
  consultantName?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CalculatorResult {
  label: string;
  value: number;
  isTotal?: boolean;
  highlight?: boolean;
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface StripeSession {
  id: string;
  bookingId: bigint;
  status: "pending" | "paid" | "failed";
  url?: string;
}

export interface TestimonialFormData {
  name: string;
  company: string;
  industry: string;
  feedback: string;
  rating?: number;
}
