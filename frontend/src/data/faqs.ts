import type { FAQItem } from "../types";

export const FAQS: FAQItem[] = [
  // Income Tax (8)
  {
    id: "it1",
    question: "What is the last date for ITR filing for salaried individuals?",
    answer:
      "The due date for filing ITR for salaried individuals is typically July 31st of the assessment year. For FY 2024-25, this would be July 31, 2025. Late filing attracts a penalty of up to ₹5,000 under Section 234F.",
    category: "income-tax",
  },
  {
    id: "it2",
    question: "What documents are required for ITR filing?",
    answer:
      "Key documents include Form 16 from employer, bank statements, Form 26AS/AIS, investment proofs (80C, 80D), HRA receipts, and capital gains statements. We provide a detailed checklist specific to your income profile.",
    category: "income-tax",
  },
  {
    id: "it3",
    question: "What is the new tax regime and should I opt for it?",
    answer:
      "The new tax regime offers lower slab rates but without most deductions like 80C, HRA, etc. Whether it benefits you depends on your deductions. We analyze both regimes and recommend the one that minimizes your tax liability.",
    category: "income-tax",
  },
  {
    id: "it4",
    question: "How is capital gains tax calculated on property sale?",
    answer:
      "LTCG on property sold after 2 years is taxed at 20% with indexation benefit. STCG (within 2 years) is added to income and taxed at slab rates. After Budget 2024, LTCG is 12.5% without indexation for properties purchased after July 23, 2024.",
    category: "income-tax",
  },
  {
    id: "it5",
    question: "What happens if I receive an income tax notice?",
    answer:
      "Don't panic — most notices are routine. Common notices include 143(1) for processing discrepancies, 139(9) for defective returns, or 148 for reassessment. We analyze the notice, prepare a detailed response, and represent you before the assessing officer.",
    category: "income-tax",
  },
  {
    id: "it6",
    question: "Can I file ITR for previous years?",
    answer:
      "You can file belated returns for 2 previous financial years. For example, in FY 2024-25, you can file returns for FY 2023-24 and FY 2022-23. Belated returns attract late fees, and you cannot carry forward certain losses.",
    category: "income-tax",
  },
  {
    id: "it7",
    question: "What is TDS and who is required to deduct it?",
    answer:
      "TDS (Tax Deducted at Source) is advance tax deducted by the payer on payments like salary, rent, professional fees. Individuals/HUF with turnover above ₹1 crore (business) or ₹50 lakh (profession) must deduct TDS. Employers must deduct TDS on all salary payments.",
    category: "income-tax",
  },
  {
    id: "it8",
    question: "How can NRIs file their Indian income tax returns?",
    answer:
      "NRIs must file ITR if their Indian income exceeds the basic exemption limit. We handle NRI ITR filing remotely with complete DTAA analysis, FEMA compliance, and guidance on optimizing NRE/NRO account taxation.",
    category: "income-tax",
  },

  // GST (8)
  {
    id: "gst1",
    question: "What is the GST registration threshold?",
    answer:
      "Businesses with annual turnover exceeding ₹40 lakh (goods) or ₹20 lakh (services) in most states must register for GST. For special category states (NE states, Uttarakhand, etc.), the threshold is ₹10 lakh.",
    category: "gst",
  },
  {
    id: "gst2",
    question: "What documents are needed for GST registration?",
    answer:
      "Required documents include PAN card, Aadhaar, business address proof, bank statement, and photograph. For companies/LLPs, additionally need COI, MOA/AOA, and board resolution. We process registration within 2-3 working days.",
    category: "gst",
  },
  {
    id: "gst3",
    question: "What is the due date for GSTR-1 and GSTR-3B?",
    answer:
      "GSTR-1 (outward supplies) is due on 11th of the following month (monthly) or quarterly. GSTR-3B (summary return with tax payment) is due on 20th of the following month for monthly filers. Late filing attracts penalties of ₹50/day (₹20/day for nil returns).",
    category: "gst",
  },
  {
    id: "gst4",
    question: "Can I claim Input Tax Credit (ITC) on all purchases?",
    answer:
      "ITC is available on goods and services used for business purposes, but not on personal expenses, food & beverages, outdoor catering, beauty treatment, and club membership fees. Proper reconciliation of 2B with books is essential for maximizing genuine ITC.",
    category: "gst",
  },
  {
    id: "gst5",
    question: "What is the GST Composition Scheme?",
    answer:
      "The Composition Scheme is for small businesses with turnover up to ₹1.5 crore. They pay a fixed lower tax rate (1% for manufacturers, 2.5% for restaurants, 0.5% for traders) but cannot collect GST from customers or claim ITC.",
    category: "gst",
  },
  {
    id: "gst6",
    question: "How do I apply for GST refund on exports?",
    answer:
      "Exporters can claim GST refund through RFD-01 on the GST portal. The process involves filing GSTR-1 with export details, GSTR-3B, and providing shipping bills/FIRC. Refunds are typically processed within 60 days of complete application.",
    category: "gst",
  },
  {
    id: "gst7",
    question: "What is E-invoice and who needs to generate it?",
    answer:
      "E-invoicing is mandatory for businesses with turnover above ₹5 crore. It involves generating invoices on the IRP (Invoice Registration Portal) which assigns a unique IRN. This auto-populates GSTR-1 and prevents fake invoicing.",
    category: "gst",
  },
  {
    id: "gst8",
    question: "What happens if I miss filing GST returns?",
    answer:
      "Late GSTR-3B filing attracts ₹50/day penalty (₹20 for nil returns), capped at ₹10,000. Additionally, 18% interest applies on unpaid tax. Consistent non-filers risk GST registration cancellation and loss of ITC for buyers.",
    category: "gst",
  },

  // Company Registration (6)
  {
    id: "cr1",
    question: "What is the difference between Pvt Ltd, LLP, and OPC?",
    answer:
      "Private Limited Companies have 2-200 shareholders with limited liability and are best for fundraising. LLPs combine partnership flexibility with limited liability, ideal for professionals. OPCs allow solo entrepreneurs with limited liability — minimum 1 director/shareholder.",
    category: "registration",
  },
  {
    id: "cr2",
    question: "How long does it take to register a Private Limited Company?",
    answer:
      "With all documents in order, we complete Pvt Ltd incorporation in 10-15 working days. This includes name approval, DIN/DSC procurement, MOA/AOA drafting, and filing with MCA. We keep you updated at every step.",
    category: "registration",
  },
  {
    id: "cr3",
    question: "What is the minimum capital required to start a company?",
    answer:
      "There is no minimum paid-up capital requirement for Private Limited Companies in India after the 2013 Companies Act amendment. You can incorporate with even ₹1. However, authorized capital determines government fees, so we advise a practical starting amount.",
    category: "registration",
  },
  {
    id: "cr4",
    question:
      "What are the annual compliance requirements for a Pvt Ltd company?",
    answer:
      "Annual compliances include ROC filings (AOC-4 for financial statements, MGT-7 for annual return), statutory audit, income tax return, GST returns, Director KYC, and board/general meeting minutes. We offer a comprehensive annual compliance package.",
    category: "registration",
  },
  {
    id: "cr5",
    question: "What is MSME / Udyam registration and its benefits?",
    answer:
      "Udyam registration is for micro, small, and medium enterprises. Benefits include priority sector lending at lower rates, protection against delayed payments, government procurement preference, and various state/central subsidies for machinery and technology.",
    category: "registration",
  },
  {
    id: "cr6",
    question: "Can an NRI or foreign national start a company in India?",
    answer:
      "Yes, NRIs and foreign nationals can incorporate Indian companies. Foreign nationals can be directors (with DIN) and shareholders subject to FDI policy and FEMA regulations. We assist with all FEMA compliances for foreign-owned Indian companies.",
    category: "registration",
  },

  // Audit (5)
  {
    id: "au1",
    question: "Is statutory audit mandatory for all companies?",
    answer:
      "Yes, all companies registered under the Companies Act 2013 must get their accounts audited by a Chartered Accountant. The audit must be completed and financial statements filed with ROC within 6 months of the financial year end.",
    category: "audit",
  },
  {
    id: "au2",
    question: "When is tax audit under Section 44AB required?",
    answer:
      "Tax audit is mandatory if business turnover exceeds ₹1 crore (₹10 crore if 95%+ transactions are digital) or professional receipts exceed ₹50 lakh. The audit report in Form 3CA/3CB with 3CD must be filed before September 30 of the assessment year.",
    category: "audit",
  },
  {
    id: "au3",
    question: "What is the difference between internal and statutory audit?",
    answer:
      "Statutory audit is mandated by law to verify financial statements for shareholders, while internal audit is voluntary and focuses on operational efficiency, risk management, and internal controls. Internal audits happen throughout the year, while statutory audit is annual.",
    category: "audit",
  },
  {
    id: "au4",
    question: "What is due diligence and when is it needed?",
    answer:
      "Due diligence is an independent investigation of a business before a major transaction — merger, acquisition, or investment. It assesses financial health, legal compliance, liabilities, and risks. It's essential for any deal to protect investor interests.",
    category: "audit",
  },
  {
    id: "au5",
    question: "How long does a statutory audit take?",
    answer:
      "Statutory audit typically takes 2-4 weeks depending on company size and records quality. For timely completion, we recommend finalizing books by April 30th. We work with your accounts team to ensure minimal disruption to operations.",
    category: "audit",
  },

  // Accounting (4)
  {
    id: "acc1",
    question: "What accounting software do you work with?",
    answer:
      "We work with all major accounting software — Tally Prime, QuickBooks, Zoho Books, SAP, and Excel-based systems. We can also set up and migrate your data to the most suitable software for your business type and size.",
    category: "accounting",
  },
  {
    id: "acc2",
    question: "What is Virtual CFO service and who needs it?",
    answer:
      "Virtual CFO provides strategic financial leadership on a part-time, cost-effective basis. It's ideal for startups and SMEs that need expert financial guidance — fundraising, investor reporting, cash flow management — without the overhead of a full-time CFO.",
    category: "accounting",
  },
  {
    id: "acc3",
    question: "How often will I receive MIS reports?",
    answer:
      "We provide monthly MIS reports by the 10th of the following month. Reports include P&L, balance sheet, cash flow statement, budget vs actual analysis, and key business ratios. We customize report formats to match your management's requirements.",
    category: "accounting",
  },
  {
    id: "acc4",
    question: "What is included in your payroll processing service?",
    answer:
      "Our payroll service covers monthly salary computation, statutory deductions (PF, ESI, PT, TDS), payslip generation, bank transfer advice, monthly PF/ESI/PT returns, and annual Form 16 issuance for all employees.",
    category: "accounting",
  },

  // General (5)
  {
    id: "gen1",
    question: "How can I book a consultation with Prasad CA Works?",
    answer:
      "You can book a consultation through our website's 'Book Consultation' page. If you have a specific service in mind (income tax, GST, audit, etc.), select it directly. If you're unsure what you need and want a general financial guidance session, you can book a ₹199 General Guidance Consultation — our CA will understand your situation and guide you to the right services. You can also call us at +91 8686457586 or WhatsApp for quick queries.",
    category: "general",
  },
  {
    id: "gen2",
    question: "Do you serve clients outside Hyderabad?",
    answer:
      "Yes, we serve clients pan-India. Most services are handled digitally through our secure document portal. For services requiring physical presence, we coordinate remotely with all required documentation. NRI clients are served fully online.",
    category: "general",
  },
  {
    id: "gen3",
    question: "How do you protect my financial data and documents?",
    answer:
      "We take data security seriously. All documents are stored in encrypted, password-protected systems. We sign NDAs with all clients, maintain strict confidentiality policies, and our team undergoes regular security training. Data is never shared with third parties without consent.",
    category: "general",
  },
  {
    id: "gen4",
    question: "What are your fee structures?",
    answer:
      "Our fees are transparent and value-based, not just time-based. We offer fixed-fee packages for standard services (ITR filing, GST returns, company registration) and retainer arrangements for ongoing work. We share a detailed fee proposal before starting any engagement.",
    category: "general",
  },
  {
    id: "gen5",
    question: "Are you ICAI registered Chartered Accountants?",
    answer:
      "Yes, all our partners and senior team members are fully qualified Chartered Accountants registered with the Institute of Chartered Accountants of India (ICAI). We maintain all required professional certifications and follow the ICAI Code of Ethics strictly.",
    category: "general",
  },
];
