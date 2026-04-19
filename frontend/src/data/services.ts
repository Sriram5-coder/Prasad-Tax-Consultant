import type { Service, ServiceCategory } from "../types";

export const ALL_SERVICES: Service[] = [
  // ── Income Tax (9) ──────────────────────────────────────
  {
    id: "itr-individuals",
    title: "ITR Filing – Individuals & Salaried",
    description:
      "Accurate and timely income tax return filing for salaried employees, pensioners, and individuals with multiple income sources.",
    category: "income-tax",
    benefits: [
      "Form 16 processing",
      "Deduction optimization",
      "E-filing with acknowledgement",
      "Refund tracking",
    ],
    icon: "FileText",
    popular: true,
  },
  {
    id: "itr-business",
    title: "ITR Filing – Business & Professionals",
    description:
      "Comprehensive ITR filing for businesses, freelancers, and professionals including balance sheet preparation and P&L accounts.",
    category: "income-tax",
    benefits: [
      "Business income computation",
      "Expense optimization",
      "P&L and balance sheet",
      "Audit compliance",
    ],
    icon: "Briefcase",
    popular: true,
  },
  {
    id: "tds-return",
    title: "TDS Return Filing",
    description:
      "Timely filing of quarterly TDS returns (24Q, 26Q, 27Q) with reconciliation of TDS deducted and deposited.",
    category: "income-tax",
    benefits: [
      "Quarterly 24Q/26Q/27Q filing",
      "TDS reconciliation",
      "Default notices resolution",
      "Form 16/16A generation",
    ],
    icon: "FileCheck",
  },
  {
    id: "advance-tax",
    title: "Advance Tax Planning",
    description:
      "Strategic advance tax computation and timely payment guidance to avoid interest under Sections 234B and 234C.",
    category: "income-tax",
    benefits: [
      "Quarterly tax computation",
      "Interest avoidance strategy",
      "Challan preparation",
      "Year-round advisory",
    ],
    icon: "Calendar",
  },
  {
    id: "it-notice",
    title: "Income Tax Notice Handling",
    description:
      "Expert response drafting and representation for income tax notices including scrutiny assessments and demand notices.",
    category: "income-tax",
    benefits: [
      "Notice analysis",
      "Response drafting",
      "Assessment representation",
      "Penalty mitigation",
    ],
    icon: "AlertCircle",
  },
  {
    id: "it-appeals",
    title: "Income Tax Appeals",
    description:
      "Professional appeal filing and representation before CIT(A), ITAT, and higher courts for disputed tax demands.",
    category: "income-tax",
    benefits: [
      "CIT(A) appeals",
      "ITAT representation",
      "Grounds preparation",
      "Stay of demand",
    ],
    icon: "Scale",
  },
  {
    id: "tax-planning",
    title: "Tax Planning & Optimization",
    description:
      "Proactive tax planning strategies leveraging all eligible deductions, exemptions, and investments to minimize tax liability.",
    category: "income-tax",
    benefits: [
      "80C/80D optimization",
      "HRA/LTA planning",
      "Investment guidance",
      "Year-end review",
    ],
    icon: "TrendingDown",
    popular: true,
  },
  {
    id: "capital-gains",
    title: "Capital Gains Tax Advisory",
    description:
      "Expert advisory on capital gains arising from sale of property, shares, mutual funds, and other capital assets.",
    category: "income-tax",
    benefits: [
      "LTCG/STCG computation",
      "Indexation benefit",
      "Reinvestment planning",
      "54/54EC exemptions",
    ],
    icon: "LineChart",
  },
  {
    id: "nri-taxation",
    title: "NRI Taxation Services",
    description:
      "Specialized tax services for Non-Resident Indians including FEMA compliance, repatriation planning, and NRE/NRO advisory.",
    category: "income-tax",
    benefits: [
      "NRI ITR filing",
      "DTAA benefits",
      "Repatriation guidance",
      "FEMA compliance",
    ],
    icon: "Globe",
  },

  // ── GST (7) ─────────────────────────────────────────────
  {
    id: "gst-registration",
    title: "GST Registration",
    description:
      "Complete GST registration assistance for businesses, including threshold advisory, composition scheme, and document preparation.",
    category: "gst",
    benefits: [
      "Online registration filing",
      "GSTIN in 3–5 days",
      "Composition scheme advice",
      "Multi-state registration",
    ],
    icon: "FileText",
    popular: true,
  },
  {
    id: "gst-returns",
    title: "GST Return Filing (GSTR-1, 3B, 9)",
    description:
      "Accurate and timely filing of all GST returns including GSTR-1, GSTR-3B, GSTR-9, with ITC reconciliation.",
    category: "gst",
    benefits: [
      "Monthly/quarterly filing",
      "ITC reconciliation",
      "Late fee avoidance",
      "2A/2B matching",
    ],
    icon: "FileCheck",
    popular: true,
  },
  {
    id: "gst-audit",
    title: "GST Audit",
    description:
      "Thorough GST audit under Section 65 and 66 of CGST Act, ensuring compliance and identifying ITC optimization opportunities.",
    category: "gst",
    benefits: [
      "Annual audit under Sec 65",
      "ITC verification",
      "Compliance review",
      "Risk assessment",
    ],
    icon: "Search",
  },
  {
    id: "gst-refund",
    title: "GST Refund Claims",
    description:
      "Efficient processing of GST refund applications for exporters, SEZ units, and businesses with inverted duty structures.",
    category: "gst",
    benefits: [
      "Export refund processing",
      "Inverted duty claims",
      "RFD-01 filing",
      "Track refund status",
    ],
    icon: "ArrowDownCircle",
  },
  {
    id: "gst-notice",
    title: "GST Notice & Litigation Support",
    description:
      "Expert handling of GST show cause notices, departmental audits, and representation before GST authorities.",
    category: "gst",
    benefits: [
      "SCN response drafting",
      "Hearing representation",
      "Appeal filing",
      "Settlement assistance",
    ],
    icon: "AlertTriangle",
  },
  {
    id: "eway-bill",
    title: "E-way Bill Assistance",
    description:
      "Generation, management, and compliance support for E-way bills for movement of goods exceeding ₹50,000.",
    category: "gst",
    benefits: [
      "E-way bill generation",
      "Extension assistance",
      "Cancellation support",
      "Compliance training",
    ],
    icon: "Truck",
  },
  {
    id: "gstr-9c",
    title: "GST Annual Return (GSTR-9C)",
    description:
      "Preparation and filing of GSTR-9 annual return and GSTR-9C reconciliation statement with auditor certification.",
    category: "gst",
    benefits: [
      "GSTR-9 preparation",
      "9C reconciliation",
      "Auditor certification",
      "Difference resolution",
    ],
    icon: "ClipboardCheck",
  },

  // ── Business Registration (7) ────────────────────────────
  {
    id: "pvt-ltd",
    title: "Private Limited Company Registration",
    description:
      "End-to-end incorporation of Private Limited Company including DIN, DSC, MOA/AOA drafting, and Certificate of Incorporation.",
    category: "registration",
    benefits: [
      "MCA filing & GSTIN",
      "DIN & DSC procurement",
      "MOA/AOA drafting",
      "Post-incorporation compliance",
    ],
    icon: "Building2",
    popular: true,
  },
  {
    id: "llp",
    title: "LLP Registration",
    description:
      "Complete LLP formation including partner designation, LLP Agreement drafting, and all MCA filings.",
    category: "registration",
    benefits: [
      "LLP Agreement drafting",
      "DPIN procurement",
      "MCA21 filing",
      "PAN/TAN/GST",
    ],
    icon: "Users",
  },
  {
    id: "opc",
    title: "One Person Company (OPC)",
    description:
      "Incorporation of OPC for solo entrepreneurs, with nominee director arrangement and all statutory filings.",
    category: "registration",
    benefits: [
      "Sole proprietor upgrade",
      "Nominee director",
      "Certificate of Incorporation",
      "Bank account guidance",
    ],
    icon: "User",
  },
  {
    id: "partnership",
    title: "Partnership Firm Registration",
    description:
      "Registration of partnership firms under the Indian Partnership Act with deed drafting and all formalities.",
    category: "registration",
    benefits: [
      "Partnership deed drafting",
      "Firm registration",
      "PAN/TAN application",
      "GST registration",
    ],
    icon: "Handshake",
  },
  {
    id: "proprietorship",
    title: "Proprietorship Registration",
    description:
      "Quick registration of sole proprietorship with GST, MSME, and trade license to start operations.",
    category: "registration",
    benefits: [
      "GST registration",
      "MSME/Udyam",
      "Trade license",
      "Bank account opening",
    ],
    icon: "Store",
  },
  {
    id: "section-8",
    title: "Section 8 / NGO / Trust Registration",
    description:
      "Registration of non-profit entities under Section 8 of Companies Act, Trust Act, or Societies Registration Act.",
    category: "registration",
    benefits: [
      "Section 8 incorporation",
      "12A/80G registration",
      "FCRA compliance",
      "CSR eligibility",
    ],
    icon: "Heart",
  },
  {
    id: "startup-india",
    title: "Startup India Registration",
    description:
      "DPIIT Startup India recognition to avail tax benefits, funding, and regulatory relaxations.",
    category: "registration",
    benefits: [
      "DPIIT recognition",
      "Tax exemption u/s 80-IAC",
      "IPR fast-track",
      "Fund access guidance",
    ],
    icon: "Rocket",
  },

  // ── Audit (6) ───────────────────────────────────────────
  {
    id: "statutory-audit",
    title: "Statutory Audit",
    description:
      "Independent statutory audit of financial statements as required under the Companies Act, 2013 and other applicable laws.",
    category: "audit",
    benefits: [
      "True & fair view opinion",
      "Internal control review",
      "Auditor's report",
      "Board presentation",
    ],
    icon: "ClipboardList",
    popular: true,
  },
  {
    id: "internal-audit",
    title: "Internal Audit",
    description:
      "Risk-based internal audit to evaluate the effectiveness of internal controls, risk management, and governance processes.",
    category: "audit",
    benefits: [
      "Risk assessment",
      "Process audit",
      "Control testing",
      "Management report",
    ],
    icon: "Shield",
  },
  {
    id: "tax-audit",
    title: "Tax Audit (3CA/3CB)",
    description:
      "Mandatory tax audit under Section 44AB of the Income Tax Act with Form 3CA/3CB and 3CD report.",
    category: "audit",
    benefits: [
      "Form 3CA/3CB/3CD",
      "Tax compliance review",
      "Disallowance identification",
      "Filing within deadline",
    ],
    icon: "FileSearch",
  },
  {
    id: "stock-audit",
    title: "Stock Audit",
    description:
      "Physical verification and valuation of inventory for banks, NBFCs, and corporate clients.",
    category: "audit",
    benefits: [
      "Physical verification",
      "Stock valuation",
      "Shortage identification",
      "Bank audit report",
    ],
    icon: "Package",
  },
  {
    id: "concurrent-audit",
    title: "Concurrent Audit",
    description:
      "Real-time concurrent audit of bank branches and financial institutions to ensure ongoing compliance.",
    category: "audit",
    benefits: [
      "Real-time monitoring",
      "Daily/weekly reports",
      "Irregularity detection",
      "RBI compliance",
    ],
    icon: "Activity",
  },
  {
    id: "due-diligence",
    title: "Due Diligence Audit",
    description:
      "Comprehensive financial and legal due diligence for mergers, acquisitions, investments, and business transactions.",
    category: "audit",
    benefits: [
      "Financial DD",
      "Legal DD support",
      "Risk identification",
      "Investment report",
    ],
    icon: "Search",
  },

  // ── Accounting & CFO (6) ─────────────────────────────────
  {
    id: "bookkeeping",
    title: "Monthly Bookkeeping & Accounting",
    description:
      "Systematic monthly bookkeeping, journal entries, ledger maintenance, and finalization of accounts.",
    category: "accounting",
    benefits: [
      "Monthly reconciliation",
      "P&L statement",
      "Balance sheet",
      "Bank reconciliation",
    ],
    icon: "BookOpen",
    popular: true,
  },
  {
    id: "payroll",
    title: "Payroll Processing",
    description:
      "End-to-end payroll processing including salary computation, PF/ESI/PT deductions, and Form 16 issuance.",
    category: "accounting",
    benefits: [
      "Monthly salary processing",
      "PF/ESI compliance",
      "Form 16 generation",
      "Payroll software",
    ],
    icon: "CreditCard",
  },
  {
    id: "mis-reports",
    title: "MIS Reports & Financial Statements",
    description:
      "Preparation of detailed MIS reports, financial analysis, and management accounts for informed decision-making.",
    category: "accounting",
    benefits: [
      "Monthly MIS packs",
      "KPI dashboards",
      "Variance analysis",
      "Board presentations",
    ],
    icon: "BarChart",
  },
  {
    id: "tally-setup",
    title: "Tally / QuickBooks / Zoho Setup",
    description:
      "Professional setup, customization, and training for Tally, QuickBooks, and Zoho Books accounting software.",
    category: "accounting",
    benefits: [
      "Software installation",
      "Chart of accounts setup",
      "Staff training",
      "Data migration",
    ],
    icon: "Monitor",
  },
  {
    id: "virtual-cfo",
    title: "Virtual CFO Services",
    description:
      "Part-time CFO support including financial strategy, investor relations, board reporting, and growth planning.",
    category: "accounting",
    benefits: [
      "Strategic financial advice",
      "Investor reporting",
      "Fundraising support",
      "Cost optimization",
    ],
    icon: "UserCheck",
    popular: true,
  },
  {
    id: "financial-statements",
    title: "Annual Financial Statement Preparation",
    description:
      "Preparation of complete financial statements including notes to accounts complying with accounting standards.",
    category: "accounting",
    benefits: [
      "P&L, Balance Sheet",
      "Cash flow statement",
      "Notes to accounts",
      "AS/IndAS compliance",
    ],
    icon: "FileBarChart",
  },

  // ── ROC & Company Law (6) ────────────────────────────────
  {
    id: "roc-filing",
    title: "Annual ROC Filing (AOC-4, MGT-7)",
    description:
      "Timely filing of all annual ROC compliances including AOC-4, MGT-7, and maintaining statutory registers.",
    category: "roc",
    benefits: [
      "AOC-4 filing",
      "MGT-7/7A filing",
      "Statutory registers",
      "Board meeting minutes",
    ],
    icon: "ClipboardCheck",
    popular: true,
  },
  {
    id: "dir-kyc",
    title: "Director KYC (DIN KYC)",
    description:
      "Annual Director KYC (DIR-3 KYC) filing before the due date to keep DIN active.",
    category: "roc",
    benefits: [
      "DIR-3 KYC filing",
      "DIN deactivation prevention",
      "Bulk DIN KYC",
      "OTP/DSC based filing",
    ],
    icon: "UserCheck",
  },
  {
    id: "name-change",
    title: "Company Name Change",
    description:
      "Complete assistance for changing company name including board resolution, special resolution, and MCA filings.",
    category: "roc",
    benefits: [
      "Board & special resolution",
      "INC-24 filing",
      "New COI",
      "Trademark check",
    ],
    icon: "Edit3",
  },
  {
    id: "directors",
    title: "Adding / Removing Directors",
    description:
      "Legal formalities for appointment, removal, or resignation of directors including all ROC filings.",
    category: "roc",
    benefits: [
      "DIN allotment",
      "DIR-12 filing",
      "Board resolution",
      "Statutory notice",
    ],
    icon: "UserPlus",
  },
  {
    id: "auth-capital",
    title: "Increase in Authorized Capital",
    description:
      "Procedures for increasing authorized share capital including special resolution and SH-7 filing.",
    category: "roc",
    benefits: [
      "Special resolution",
      "SH-7 filing",
      "MOA amendment",
      "Stamp duty guidance",
    ],
    icon: "ArrowUp",
  },
  {
    id: "winding-up",
    title: "Winding Up / Strike Off",
    description:
      "Closure of company or LLP through voluntary winding up, fast-track or NCLT route.",
    category: "roc",
    benefits: [
      "STK-2 filing",
      "Fast track closure",
      "NCLT winding up",
      "Final accounts",
    ],
    icon: "XCircle",
  },

  // ── Licenses & Registrations (5) ────────────────────────
  {
    id: "fssai",
    title: "FSSAI / Food License",
    description:
      "FSSAI registration and license for food businesses including restaurants, manufacturers, and traders.",
    category: "licenses",
    benefits: [
      "FSSAI registration/license",
      "Product categorization",
      "Annual renewal",
      "Compliance advisory",
    ],
    icon: "Coffee",
  },
  {
    id: "trade-license",
    title: "Trade License",
    description:
      "Obtaining trade license from municipal authorities for conducting business within a specific locality.",
    category: "licenses",
    benefits: [
      "Application assistance",
      "Document preparation",
      "Municipal liaison",
      "Annual renewal",
    ],
    icon: "Building",
  },
  {
    id: "iec",
    title: "Import Export Code (IEC)",
    description:
      "IEC registration from DGFT for businesses engaged in import and export of goods and services.",
    category: "licenses",
    benefits: [
      "IEC certificate in 2–3 days",
      "DGFT portal filing",
      "Modification assistance",
      "Export incentives guidance",
    ],
    icon: "Globe2",
  },
  {
    id: "shop-est",
    title: "Shop & Establishment Act",
    description:
      "Registration under the Shops and Establishments Act with state labour departments for all commercial entities.",
    category: "licenses",
    benefits: [
      "State labour registration",
      "Employee count compliance",
      "Annual renewal",
      "Inspection support",
    ],
    icon: "ShoppingBag",
  },
  {
    id: "esi-pf",
    title: "ESI & PF Registration",
    description:
      "Registration and monthly compliance for Employees' Provident Fund and Employees' State Insurance.",
    category: "licenses",
    benefits: [
      "EPFO/ESIC registration",
      "Monthly return filing",
      "UAN generation",
      "Inspection support",
    ],
    icon: "Shield",
  },

  // ── Advisory Services (8) ────────────────────────────────
  {
    id: "business-valuation",
    title: "Business Valuation",
    description:
      "Professional valuation of businesses, shares, and intangible assets for transactions, fundraising, and statutory purposes.",
    category: "advisory",
    benefits: [
      "DCF/NAV/Market approach",
      "SEBI compliant reports",
      "Fairness opinion",
      "Pitch deck support",
    ],
    icon: "TrendingUp",
  },
  {
    id: "cma-data",
    title: "Project Report / CMA Data for Loans",
    description:
      "Preparation of detailed project reports and CMA data for term loans, working capital, and MSME loans.",
    category: "advisory",
    benefits: [
      "Bank-ready project reports",
      "CMA data preparation",
      "Ratio analysis",
      "Loan presentation",
    ],
    icon: "FileText",
  },
  {
    id: "investment-planning",
    title: "Investment Planning",
    description:
      "Holistic investment advisory covering mutual funds, insurance, real estate, and tax-efficient wealth building.",
    category: "advisory",
    benefits: [
      "Goal-based planning",
      "Tax-efficient investments",
      "Portfolio review",
      "Risk assessment",
    ],
    icon: "PiggyBank",
  },
  {
    id: "ma-advisory",
    title: "Mergers & Acquisitions Advisory",
    description:
      "End-to-end M&A advisory including deal structuring, due diligence coordination, and regulatory compliance.",
    category: "advisory",
    benefits: [
      "Deal structuring",
      "Due diligence",
      "NCLT/CCI filings",
      "Post-merger integration",
    ],
    icon: "GitMerge",
  },
  {
    id: "succession-planning",
    title: "Succession Planning",
    description:
      "Structured family wealth and business succession planning to ensure smooth transfer with minimal tax impact.",
    category: "advisory",
    benefits: [
      "Family settlement deeds",
      "Will drafting guidance",
      "Tax-efficient transfer",
      "HUF structuring",
    ],
    icon: "Users",
  },
  // {
  //   id: "fema-compliance",
  //   title: "FEMA & RBI Compliance",
  //   description:
  //     "Advisory and filing support for FEMA regulations, ODI/FDI reporting, and RBI compliance for cross-border transactions.",
  //   category: "advisory",
  //   benefits: [
  //     "FDI/ODI reporting",
  //     "FEMA advisory",
  //     "RBI compounding",
  //     "LRS compliance",
  //   ],
  //   icon: "Globe",
  // },
  {
    id: "startup-advisory",
    title: "Startup Advisory & Fundraising",
    description:
      "End-to-end support for startups — from structuring to funding rounds, ESOP design, and investor readiness.",
    category: "advisory",
    benefits: [
      "Term sheet review",
      "ESOP structuring",
      "Cap table management",
      "Investor documentation",
    ],
    icon: "Rocket",
  },
  // {
  //   id: "insurance-advisory",
  //   title: "Insurance Advisory",
  //   description:
  //     "Comprehensive insurance planning covering life, health, term, ULIP, and business insurance for complete protection.",
  //   category: "advisory",
  //   benefits: [
  //     "Coverage gap analysis",
  //     "Premium comparison",
  //     "Claim assistance",
  //     "Business insurance",
  //   ],
  //   icon: "Shield",
  // },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "income-tax",
    name: "Income Tax",
    icon: "FileText",
    description:
      "Complete income tax solutions for individuals, businesses, and NRIs",
    services: ALL_SERVICES.filter((s) => s.category === "income-tax"),
  },
  {
    id: "gst",
    name: "GST Services",
    icon: "Receipt",
    description:
      "End-to-end GST registration, filing, audit, and litigation support",
    services: ALL_SERVICES.filter((s) => s.category === "gst"),
  },
  {
    id: "registration",
    name: "Business Registration",
    icon: "Building2",
    description: "Incorporation and registration for all business structures",
    services: ALL_SERVICES.filter((s) => s.category === "registration"),
  },
  {
    id: "audit",
    name: "Audit Services",
    icon: "ClipboardList",
    description: "Statutory, internal, tax, and specialized audit services",
    services: ALL_SERVICES.filter((s) => s.category === "audit"),
  },
  {
    id: "accounting",
    name: "Accounting & CFO",
    icon: "BookOpen",
    description: "Bookkeeping, payroll, MIS, and virtual CFO services",
    services: ALL_SERVICES.filter((s) => s.category === "accounting"),
  },
  {
    id: "roc",
    name: "ROC & Company Law",
    icon: "ClipboardCheck",
    description: "Annual filings, director KYC, and corporate law compliance",
    services: ALL_SERVICES.filter((s) => s.category === "roc"),
  },
  {
    id: "licenses",
    name: "Licenses & Registrations",
    icon: "Award",
    description: "FSSAI, trade license, IEC, ESI, PF and other registrations",
    services: ALL_SERVICES.filter((s) => s.category === "licenses"),
  },
  {
    id: "advisory",
    name: "Advisory Services",
    icon: "TrendingUp",
    description:
      "Valuation, project reports, M&A, investment, and startup advisory",
    services: ALL_SERVICES.filter((s) => s.category === "advisory"),
  },
];
