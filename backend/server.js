// ─────────────────────────────────────────────────────────────────────────────
//  Prasad CA Works — Backend Server v3
//  Stack: Express + MongoDB Atlas + Nodemailer (Gmail)
// ─────────────────────────────────────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const DATA_FILE = path.join(__dirname, "data.json");

const app = express();
const PORT = process.env.PORT || 3001;
// Security headers for production
app.set("trust proxy", 1); // needed for Render.com / reverse proxies
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
const mongoose = require("mongoose");

const rateLimit = require("express-rate-limit");

// ═══════════════════════════════════════════════════════════════════════════════
//  MONGODB SETUP
// ═══════════════════════════════════════════════════════════════════════════════

let Admin;
const adminSchema = new mongoose.Schema({ username: String, password: String });
Admin = mongoose.model("Admin", adminSchema);

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later.",
});

// ─── Login route ──────────────────────────────────────────────────────────────
app.post("/api/admin/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // find admin in MongoDB
    const admin = await Admin.findOne({ username: username });

    if (!admin) {
      return res.status(401).json({ error: "Invalid username" });
    }

    // 🔑 plain text password match
    if (admin.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // create JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ ok: true, token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let Booking, ContactLead, Testimonial, Subscriber;
let useDB = false;

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.log("INFO: MONGODB_URI not set — using local data.json");
    return false;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅  MongoDB Atlas connected");

    const bookingSchema = new mongoose.Schema({
      bookingRef:       { type: String, unique: true },
      name:             String,
      email:            String,
      phone:            String,
      serviceCategory:  String,
      preferredDate:    String,
      preferredTime:    String,
      consultantName:   String,
      queryDescription: String,
      consultationType: String,
      status:           { type: String, default: "pending" },
      paymentStatus:    { type: String, default: "na", enum: ["na", "pending", "paid", "failed"] },
      contactedStatus:  { type: String, default: "new" },
      adminNotes:       { type: String, default: "" },
      createdAt:        { type: Date, default: Date.now },
    });
    const contactSchema = new mongoose.Schema({
      leadRef:    { type: String, unique: true },
      name:       String, email: String, phone: String,
      subject:    String, message: String,
      status:     { type: String, default: "new" },
      adminNotes: { type: String, default: "" },
      createdAt:  { type: Date, default: Date.now },
    });
    const testimonialSchema = new mongoose.Schema({
      name: String, company: String, industry: String, feedback: String,
      rating: Number, isApproved: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    });
    const subscriberSchema = new mongoose.Schema({
      email:        { type: String, unique: true },
      name:         String,
      active:       { type: Boolean, default: true },
      subscribedAt: { type: Date, default: Date.now },
    });

    Booking     = mongoose.model("Booking",     bookingSchema);
    ContactLead = mongoose.model("ContactLead", contactSchema);
    Testimonial = mongoose.model("Testimonial", testimonialSchema);
    Subscriber  = mongoose.model("Subscriber",  subscriberSchema);
    useDB = true;
    return true;
  } catch (err) {
    console.error("MongoDB failed:", err.message, "— using data.json");
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOCAL JSON FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return {
        bookings:     Array.isArray(parsed.bookings)     ? parsed.bookings     : [],
        contactLeads: Array.isArray(parsed.contactLeads) ? parsed.contactLeads : [],
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
        subscribers:  Array.isArray(parsed.subscribers)  ? parsed.subscribers  : [],
        nextIds: parsed.nextIds || { booking:1, contact:1, testimonial:1, subscriber:1 },
      };
    } catch (e) { console.error("JSON Parse Error", e); }
  }
  return {
    bookings:[], contactLeads:[], testimonials:[], subscribers:[],
    nextIds:{ booking:1, contact:1, testimonial:1, subscriber:1 },
  };
}
function saveData() { fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2)); }
const store = loadData();

function makeRef(prefix, counter) {
  const y = new Date().getFullYear().toString().slice(2);
  return "PCW-" + prefix + "-" + y + String(counter).padStart(4, "0");
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EMAIL
// ═══════════════════════════════════════════════════════════════════════════════
let transporter = null;
async function setupMailer() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("INFO: Email not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD to enable.");
    return;
  }
  try {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transporter.verify();
    console.log("✅  Gmail mailer ready → " + process.env.GMAIL_USER);
  } catch (err) { console.error("Gmail mailer failed:", err.message); }
}

async function sendMail(to, subject, html) {
  if (!transporter) return;
  try {
    await transporter.sendMail({ from: '"Prasad CA Works" <' + process.env.GMAIL_USER + ">", to, subject, html });
    console.log("Mail sent →", to);
  } catch (err) { console.error("Mail error:", err.message); }
}

// Sent for regular service bookings (no payment required)
function emailBookingConfirm(b) {
  return {
    subject: "Booking Confirmed — " + b.bookingRef + " | Prasad CA Works",
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">'
      + '<div style="background:#0d2137;padding:28px 32px"><h1 style="color:#fff;margin:0;font-size:22px">Prasad CA Works</h1>'
      + '<p style="color:#5eead4;margin:4px 0 0;font-size:13px">Trusted Financial Advisor · Hyderabad</p></div>'
      + '<div style="padding:32px">'
      + '<h2 style="color:#0d2137;margin:0 0 8px">Booking Confirmed ✅</h2>'
      + '<p style="color:#6b7280;font-size:14px">Hi ' + b.name + ', your consultation request has been received.</p>'
      + '<div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
      + '<tr><td style="color:#6b7280;padding:6px 0;width:140px">Booking ID</td><td style="font-weight:bold;color:#0d6b55">' + b.bookingRef + '</td></tr>'
      + '<tr><td style="color:#6b7280;padding:6px 0">Service</td><td>' + (b.serviceCategory || "Consultation") + '</td></tr>'
      + (b.preferredDate ? '<tr><td style="color:#6b7280;padding:6px 0">Date</td><td>' + b.preferredDate + '</td></tr>' : "")
      + (b.preferredTime ? '<tr><td style="color:#6b7280;padding:6px 0">Time</td><td>' + b.preferredTime + '</td></tr>' : "")
      + '</table></div>'
      + '<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;border-radius:4px">'
      + '<p style="margin:0;color:#065f46;font-size:14px">Our Tax Consultant will contact you within <strong>7 business days</strong>.</p>'
      + '</div>'
      + '<p style="color:#6b7280;font-size:13px;margin-top:20px">Keep your Booking ID <strong>' + b.bookingRef + '</strong> handy.</p>'
      + '</div>'
      + '<div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">'
      + '<p style="margin:0;color:#9ca3af;font-size:12px">Prasad CA Works · Hyderabad · Automated email</p>'
      + '</div></div>',
  };
}

// Sent ONLY after Razorpay confirms payment for General Guidance
function emailPaymentConfirm(b) {
  return {
    subject: "Payment Confirmed & Session Booked — " + b.bookingRef + " | Prasad CA Works",
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">'
      + '<div style="background:#0d2137;padding:28px 32px"><h1 style="color:#fff;margin:0;font-size:22px">Prasad CA Works</h1>'
      + '<p style="color:#5eead4;margin:4px 0 0;font-size:13px">Trusted Financial Advisor · Hyderabad</p></div>'
      + '<div style="padding:32px">'
      + '<h2 style="color:#0d2137;margin:0 0 8px">Payment Confirmed ✅</h2>'
      + '<p style="color:#6b7280;font-size:14px">Hi ' + b.name + ', your ₹199 payment was successful and your General Guidance session is confirmed.</p>'
      + '<div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
      + '<tr><td style="color:#6b7280;padding:6px 0;width:140px">Booking ID</td><td style="font-weight:bold;color:#0d6b55">' + b.bookingRef + '</td></tr>'
      + '<tr><td style="color:#6b7280;padding:6px 0">Service</td><td>General Guidance Call</td></tr>'
      + '<tr><td style="color:#6b7280;padding:6px 0">Amount Paid</td><td style="font-weight:bold;color:#0d6b55">₹199</td></tr>'
      + '</table></div>'
      + '<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;border-radius:4px">'
      + '<p style="margin:0;color:#065f46;font-size:14px">Our CA will <strong>call you within 3 hours</strong> to understand your situation and guide you to the right service.</p>'
      + '</div>'
      + '<p style="color:#6b7280;font-size:13px;margin-top:20px">Keep your Booking ID <strong>' + b.bookingRef + '</strong> handy for any queries.</p>'
      + '</div>'
      + '<div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">'
      + '<p style="margin:0;color:#9ca3af;font-size:12px">Prasad CA Works · Hyderabad · Automated email</p>'
      + '</div></div>',
  };
}

function emailContactConfirm(lead) {
  return {
    subject: "We received your enquiry — " + lead.leadRef + " | Prasad CA Works",
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">'
      + '<div style="background:#0d2137;padding:28px 32px"><h1 style="color:#fff;margin:0;font-size:22px">Prasad CA Works</h1></div>'
      + '<div style="padding:32px">'
      + '<h2 style="color:#0d2137;margin:0 0 8px">We got your message 👍</h2>'
      + '<p style="color:#6b7280;font-size:14px">Hi ' + lead.name + ', we will respond within 4–6 business hours.</p>'
      + '<div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px">'
      + '<tr><td style="color:#6b7280;padding:6px 0;width:140px">Reference ID</td><td style="font-weight:bold;color:#0d6b55">' + lead.leadRef + '</td></tr>'
      + '<tr><td style="color:#6b7280;padding:6px 0">Subject</td><td>' + lead.subject + '</td></tr>'
      + '</table></div>'
      + '<p style="color:#6b7280;font-size:13px">For urgent queries call <strong>+91 8686457586</strong></p>'
      + '</div>'
      + '<div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">'
      + '<p style="margin:0;color:#9ca3af;font-size:12px">Prasad CA Works · Automated email</p>'
      + '</div></div>',
  };
}

function emailNewsletterWelcome() {
  return {
    subject: "You're subscribed! Tax & Compliance Updates — Prasad CA Works",
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">'
      + '<div style="background:#0d2137;padding:28px 32px"><h1 style="color:#fff;margin:0;font-size:22px">Prasad CA Works</h1>'
      + '<p style="color:#5eead4;margin:4px 0 0">Tax & Compliance Newsletter</p></div>'
      + '<div style="padding:32px">'
      + '<h2 style="color:#0d2137;margin:0 0 8px">Welcome aboard! 🎉</h2>'
      + '<p style="color:#6b7280;font-size:14px">You are now subscribed to monthly updates:</p>'
      + '<ul style="color:#374151;font-size:14px;line-height:2.2">'
      + '<li>📅 Key tax & compliance <strong>deadlines</strong></li>'
      + '<li>📊 Budget updates & analysis</li>'
      + '<li>💡 Expert tips on tax savings</li>'
      + '<li>🏢 GST, ITR & company law updates</li>'
      + '</ul></div></div>',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── BOOKINGS ──────────────────────────────────────────────────────────────────

app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, phone, serviceCategory, preferredDate, preferredTime,
      consultantName, queryDescription, consultationType } = req.body;
    let booking;
    if (useDB) {
      const count = await Booking.countDocuments();
      booking = await Booking.create({
        bookingRef: makeRef("BK", count + 1), name, email, phone,
        serviceCategory: serviceCategory || "", preferredDate: preferredDate || "",
        preferredTime: preferredTime || "", consultantName: consultantName || "",
        queryDescription: queryDescription || "", consultationType: consultationType || "serviceSpecific",
      });
    } else {
      booking = { id: store.nextIds.booking, bookingRef: makeRef("BK", store.nextIds.booking), name, email, phone, serviceCategory: serviceCategory||"", preferredDate: preferredDate||"", preferredTime: preferredTime||"", consultantName: consultantName||"", queryDescription: queryDescription||"", consultationType: consultationType||"serviceSpecific", status:"pending", paymentStatus:"na", contactedStatus:"new", adminNotes:"", createdAt: Date.now() };
      store.nextIds.booking++; store.bookings.push(booking); saveData();
    }
    // Regular service: email immediately (no payment required)
    if (email) { const t = emailBookingConfirm(booking); sendMail(email, t.subject, t.html); }
    res.json({ id: useDB ? booking._id : booking.id, bookingRef: booking.bookingRef });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.post("/api/bookings/general-guidance", async (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, queryDescription } = req.body;
    let booking;
    if (useDB) {
      const count = await Booking.countDocuments();
      booking = await Booking.create({
        bookingRef: makeRef("BK", count + 1), name, email, phone,
        serviceCategory: "General Guidance", preferredDate: preferredDate||"",
        preferredTime: preferredTime||"", consultantName: "", queryDescription: queryDescription||"",
        consultationType: "generalGuidance", status:"pending", paymentStatus:"pending", contactedStatus:"new",
      });
    } else {
      booking = { id: store.nextIds.booking, bookingRef: makeRef("BK", store.nextIds.booking), name, email, phone, serviceCategory:"General Guidance", preferredDate:"", preferredTime:"", consultantName:"", queryDescription: queryDescription||"", consultationType:"generalGuidance", status:"pending", paymentStatus:"pending", contactedStatus:"new", adminNotes:"", createdAt: Date.now() };
      store.nextIds.booking++; store.bookings.push(booking); saveData();
    }
    // ✅ NO EMAIL HERE — payment still pending.
    // Email is sent only after payment is verified in /api/payment/verify
    res.json({ id: useDB ? booking._id : booking.id, bookingRef: booking.bookingRef });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

// Protected: only admin can view/edit bookings
app.get("/api/bookings", verifyAdmin, async (req, res) => {
  try {
    if (useDB) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json(bookings);
    }
    res.json(store.bookings.slice().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch("/api/bookings/:id", verifyAdmin, async (req, res) => {
  try {
    const { status, contactedStatus, adminNotes, paymentStatus } = req.body;
    if (useDB) {
      const u = {};
      if (status!==undefined) u.status=status;
      if (contactedStatus!==undefined) u.contactedStatus=contactedStatus;
      if (adminNotes!==undefined) u.adminNotes=adminNotes;
      if (paymentStatus!==undefined) u.paymentStatus=paymentStatus;
      return res.json(await Booking.findByIdAndUpdate(req.params.id, u, {new:true}));
    }
    const b = store.bookings.find(b=>String(b.id)===req.params.id);
    if (!b) return res.status(404).json({error:"Not found"});
    if (status!==undefined) b.status=status;
    if (contactedStatus!==undefined) b.contactedStatus=contactedStatus;
    if (adminNotes!==undefined) b.adminNotes=adminNotes;
    if (paymentStatus!==undefined) b.paymentStatus=paymentStatus;
    saveData(); res.json(b);
  } catch (err) { res.status(500).json({error:err.message}); }
});

// ── CONTACT LEADS ─────────────────────────────────────────────────────────────

app.post("/api/contact-leads", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    let lead;
    if (useDB) {
      const count = await ContactLead.countDocuments();
      lead = await ContactLead.create({ leadRef: makeRef("CL", count+1), name, email, phone:phone||"", subject:subject||"", message:message||"", status:"new" });
    } else {
      lead = { id:store.nextIds.contact, leadRef:makeRef("CL",store.nextIds.contact), name, email, phone:phone||"", subject:subject||"", message:message||"", status:"new", adminNotes:"", createdAt:Date.now() };
      store.nextIds.contact++; store.contactLeads.push(lead); saveData();
    }
    if (email) { const t = emailContactConfirm(lead); sendMail(email, t.subject, t.html); }
    res.json({ id: useDB ? lead._id : lead.id, leadRef: lead.leadRef });
  } catch (err) { console.error(err); res.status(500).json({error:err.message}); }
});

app.get("/api/contact-leads", verifyAdmin, async (req, res) => {
  if (useDB) return res.json(await ContactLead.find().sort({createdAt:-1}));
  res.json(store.contactLeads.slice().sort((a,b)=>b.createdAt-a.createdAt));
});

app.patch("/api/contact-leads/:id", verifyAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (useDB) {
      const u = {};
      if (status!==undefined) u.status=status;
      if (adminNotes!==undefined) u.adminNotes=adminNotes;
      return res.json(await ContactLead.findByIdAndUpdate(req.params.id, u, {new:true}));
    }
    const l = store.contactLeads.find(l=>String(l.id)===req.params.id);
    if (!l) return res.status(404).json({error:"Not found"});
    if (status!==undefined) l.status=status;
    if (adminNotes!==undefined) l.adminNotes=adminNotes;
    saveData(); res.json(l);
  } catch (err) { res.status(500).json({error:err.message}); }
});

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────

app.post("/api/testimonials", async (req, res) => {
  try {
    const { name, company, industry, feedback, rating } = req.body;
    if (useDB) { const t=await Testimonial.create({name,company,industry,feedback,rating:rating??null}); return res.json({id:t._id}); }
    const t={id:store.nextIds.testimonial++,name,feedback,company:company||"",industry:industry||"",rating:rating??null,isApproved:false,createdAt:Date.now()};
    store.testimonials.push(t); saveData(); res.json({id:t.id});
  } catch(err){res.status(500).json({error:err.message});}
});

app.get("/api/testimonials", async (req, res) => {
  if (useDB) return res.json(await Testimonial.find({isApproved:true}));
  res.json(store.testimonials.filter(t=>t.isApproved));
});

app.get("/api/admin/testimonials", verifyAdmin, async (req, res) => {
  if (useDB) return res.json(await Testimonial.find().sort({createdAt:-1}));
  res.json(store.testimonials.slice().sort((a,b)=>b.createdAt-a.createdAt));
});

app.post("/api/admin/testimonials/:id/approve", verifyAdmin, async (req, res) => {
  if (useDB) { await Testimonial.findByIdAndUpdate(req.params.id,{isApproved:true}); return res.json({ok:true}); }
  const t=store.testimonials.find(t=>t.id===parseInt(req.params.id));
  if (!t) return res.status(404).json({error:"Not found"});
  t.isApproved=true; saveData(); res.json({ok:true});
});

app.delete("/api/admin/testimonials/:id", verifyAdmin, async (req, res) => {
  if (useDB) { await Testimonial.findByIdAndDelete(req.params.id); return res.json({ok:true}); }
  const idx=store.testimonials.findIndex(t=>t.id===parseInt(req.params.id));
  if (idx===-1) return res.status(404).json({error:"Not found"});
  store.testimonials.splice(idx,1); saveData(); res.json({ok:true});
});

// ── NEWSLETTER ────────────────────────────────────────────────────────────────

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({error:"Valid email required"});
  try {
    if (useDB) {
      if (await Subscriber.findOne({email:email.toLowerCase()})) return res.json({ok:true,message:"Already subscribed!"});
      await Subscriber.create({email:email.toLowerCase().trim(),name:name||""});
    } else {
      if (store.subscribers.find(s=>s.email===email.toLowerCase())) return res.json({ok:true,message:"Already subscribed!"});
      store.subscribers.push({id:store.nextIds.subscriber++,email:email.toLowerCase().trim(),name:name||"",active:true,subscribedAt:Date.now()});
      saveData();
    }
    const t=emailNewsletterWelcome(); sendMail(email, t.subject, t.html);
    res.json({ok:true,message:"Subscribed successfully!"});
  } catch(err){res.status(500).json({error:err.message});}
});

app.get("/api/admin/subscribers", verifyAdmin, async (req, res) => {
  if (useDB) return res.json(await Subscriber.find().sort({subscribedAt:-1}));
  res.json(store.subscribers.slice().sort((a,b)=>b.subscribedAt-a.subscribedAt));
});

app.delete("/api/admin/subscribers/:id", verifyAdmin, async (req, res) => {
  if (useDB) { await Subscriber.findByIdAndDelete(req.params.id); return res.json({ok:true}); }
  const idx=store.subscribers.findIndex(s=>s.id===parseInt(req.params.id));
  if(idx===-1) return res.status(404).json({error:"Not found"});
  store.subscribers.splice(idx,1); saveData(); res.json({ok:true});
});

// ── RAZORPAY ──────────────────────────────────────────────────────────────────

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try { const Razorpay=require("razorpay"); razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET}); console.log("✅  Razorpay ready"); } catch {}
}

app.get("/api/payment/config", (req, res) =>
  res.json({keyId:process.env.RAZORPAY_KEY_ID||"",currency:"INR",amount:19900,isLive:!!razorpay})
);

app.post("/api/payment/create-order", async (req, res) => {
  if (!razorpay) return res.json({id:"order_stub_"+Date.now(),amount:19900,currency:"INR",stub:true});
  try { const o=await razorpay.orders.create({amount:req.body.amount||19900,currency:"INR",receipt:"bk_"+req.body.bookingId}); res.json(o); }
  catch(err){res.status(500).json({error:err.message});}
});

app.post("/api/payment/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const markPaid = async () => {
    let booking;
    if (useDB) {
      booking = await Booking.findByIdAndUpdate(bookingId, { paymentStatus:"paid", status:"confirmed" }, { new:true });
    } else {
      booking = store.bookings.find(b => String(b.id) === String(bookingId));
      if (booking) { booking.paymentStatus = "paid"; booking.status = "confirmed"; saveData(); }
    }
    // ✅ Payment confirmation email — ONLY sent here, after Razorpay verifies
    if (booking && booking.email) {
      const t = emailPaymentConfirm(booking);
      sendMail(booking.email, t.subject, t.html);
    }
  };

  if (!razorpay) { await markPaid(); return res.json({ ok:true, verified:true }); }

  const exp = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (exp === razorpay_signature) { await markPaid(); return res.json({ ok:true, verified:true }); }
  res.status(400).json({ ok:false, error:"Signature mismatch" });
});


// ── NEWSLETTER BROADCAST (admin sends email to all subscribers) ───────────────
app.post("/api/admin/newsletter/broadcast", verifyAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: "Subject and message required" });

    let subs = [];
    if (useDB) {
      subs = await Subscriber.find({ active: true });
    } else {
      subs = store.subscribers.filter(s => s.active !== false);
    }

    if (subs.length === 0) return res.json({ ok: true, sent: 0, message: "No subscribers" });

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#0d2137;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">Prasad CA Works</h1>
    <p style="color:#5eead4;margin:4px 0 0;font-size:12px">Tax & Compliance Newsletter</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#0d2137;margin:0 0 16px;font-size:18px">${subject}</h2>
    <div style="color:#374151;font-size:14px;line-height:1.8;white-space:pre-wrap">${message}</div>
  </div>
  <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
    <p style="margin:0;color:#9ca3af;font-size:11px">Prasad CA Works · Hyderabad · Reply to unsubscribe</p>
  </div>
</div>`;

    let sent = 0;
    for (const sub of subs) {
      await sendMail(sub.email, subject, html);
      sent++;
    }
    res.json({ ok: true, sent, total: subs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CSV EXPORT ────────────────────────────────────────────────────────────────
function toCSV(rows, cols) {
  const escape = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = cols.map(c => escape(c.label)).join(",");
  const lines = rows.map(r => cols.map(c => escape(r[c.key] ?? "")).join(","));
  return [header, ...lines].join("\n");
}

app.get("/api/admin/export/bookings", verifyAdmin, async (req, res) => {
  try {
    const data = useDB
      ? await Booking.find().sort({ createdAt: -1 }).lean()
      : store.bookings.slice().sort((a,b) => b.createdAt - a.createdAt);

    const cols = [
      { key:"bookingRef", label:"Booking ID" },
      { key:"name",       label:"Name" },
      { key:"email",      label:"Email" },
      { key:"phone",      label:"Phone" },
      { key:"serviceCategory", label:"Service" },
      { key:"consultationType", label:"Type" },
      { key:"status",     label:"Status" },
      { key:"paymentStatus", label:"Payment" },
      { key:"contactedStatus", label:"Contacted" },
      { key:"preferredDate", label:"Date" },
      { key:"preferredTime", label:"Time" },
      { key:"queryDescription", label:"Query" },
      { key:"adminNotes", label:"Notes" },
      { key:"createdAt",  label:"Submitted At" },
    ];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=bookings.csv");
    res.send(toCSV(data, cols));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/admin/export/contacts", verifyAdmin, async (req, res) => {
  try {
    const data = useDB
      ? await ContactLead.find().sort({ createdAt: -1 }).lean()
      : store.contactLeads.slice().sort((a,b) => b.createdAt - a.createdAt);

    const cols = [
      { key:"leadRef",  label:"Reference ID" },
      { key:"name",     label:"Name" },
      { key:"email",    label:"Email" },
      { key:"phone",    label:"Phone" },
      { key:"subject",  label:"Subject" },
      { key:"message",  label:"Message" },
      { key:"status",   label:"Status" },
      { key:"adminNotes", label:"Notes" },
      { key:"createdAt", label:"Submitted At" },
    ];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
    res.send(toCSV(data, cols));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/admin/export/subscribers", verifyAdmin, async (req, res) => {
  try {
    const data = useDB
      ? await Subscriber.find().sort({ subscribedAt: -1 }).lean()
      : store.subscribers.slice().sort((a,b) => b.subscribedAt - a.subscribedAt);

    const cols = [
      { key:"email",  label:"Email" },
      { key:"name",   label:"Name" },
      { key:"subscribedAt", label:"Subscribed At" },
    ];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
    res.send(toCSV(data, cols));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── STATIC FRONTEND ───────────────────────────────────────────────────────────
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));
app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));

// ── START ─────────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();
  await setupMailer();
  app.listen(PORT, () => {
    console.log("\n✅  Prasad CA Works → http://localhost:" + PORT);
    console.log("    Admin panel  → http://localhost:" + PORT + "/admin");
    console.log("    Data mode    → " + (useDB ? "MongoDB Atlas" : "Local data.json") + "\n");
  });
  // Create or update admin — always syncs password from .env
  const adminPass = process.env.ADMIN_PASSWORD || "prasad@admin2024";
  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (!existingAdmin) {
    await Admin.create({ username: "admin", password: adminPass });
    console.log("✅ Admin created → admin / " + adminPass);
  } else if (existingAdmin.password !== adminPass) {
    await Admin.updateOne({ username: "admin" }, { password: adminPass });
    console.log("✅ Admin password updated from .env");
  }
})();
