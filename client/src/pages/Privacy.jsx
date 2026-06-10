const Privacy = () => (
  <div className="static-page container">
    <div className="page-header">
      <h1 className="page-title">Privacy <span>Policy</span></h1>
      <p className="page-subtitle">Last updated: June 2026</p>
    </div>
    <div className="legal-content">
      {[
        { title: "1. Information We Collect", body: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, shipping address, phone number, and payment information." },
        { title: "2. How We Use Your Information", body: "We use the information we collect to process your orders, send order confirmations and updates, provide customer support, send promotional communications (with your consent), improve our services, and comply with legal obligations." },
        { title: "3. Information Sharing", body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements." },
        { title: "4. Data Security", body: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payments are processed through secure, encrypted connections." },
        { title: "5. Cookies", body: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent." },
        { title: "6. Your Rights", body: "You have the right to access, update, or delete the information we have on you. You may also object to processing of your personal data and request data portability. To exercise these rights, please contact us." },
        { title: "7. Contact Us", body: "If you have any questions about this Privacy Policy, please contact us at privacy@shopez.com or through our Contact page." },
      ].map((s, i) => (
        <div key={i} className="legal-section">
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Privacy;