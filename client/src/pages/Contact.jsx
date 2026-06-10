import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="static-page container">
      <div className="page-header">
        <h1 className="page-title">Contact <span>Us</span></h1>
        <p className="page-subtitle">We'd love to hear from you</p>
      </div>

      <div className="contact-layout">
        {/* Info */}
        <div className="contact-info">
          <h3>Get in touch</h3>
          <p>Have a question about your order, a product, or just want to say hello? We're here to help.</p>

          <div className="contact-items">
            <div className="contact-item">
              <div className="contact-icon"><Mail size={20}/></div>
              <div>
                <p className="contact-label">Email</p>
                <p className="contact-value">support@shopez.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><Phone size={20}/></div>
              <div>
                <p className="contact-label">Phone</p>
                <p className="contact-value">+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><MapPin size={20}/></div>
              <div>
                <p className="contact-label">Address</p>
                <p className="contact-value">Vijayawada, Andhra Pradesh, India</p>
              </div>
            </div>
          </div>

          <div className="contact-hours">
            <h4>Support Hours</h4>
            <p>Monday – Friday: 9am – 6pm IST</p>
            <p>Saturday: 10am – 4pm IST</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input className="form-input" placeholder="Mani Sagar"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="Order issue, product query..."
                value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows={5} placeholder="Tell us how we can help..."
                value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <Send size={16}/> {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
