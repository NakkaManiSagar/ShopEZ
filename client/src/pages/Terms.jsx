const Terms = () => (
  <div className="static-page container">
    <div className="page-header">
      <h1 className="page-title">Terms of <span>Service</span></h1>
      <p className="page-subtitle">Last updated: June 2026</p>
    </div>
    <div className="legal-content">
      {[
        { title: "1. Acceptance of Terms", body: "By accessing and using ShopEZ, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service." },
        { title: "2. Use of Service", body: "You must be at least 18 years old to use ShopEZ. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
        { title: "3. Products and Pricing", body: "We reserve the right to modify product prices at any time without notice. All prices are listed in Indian Rupees (INR). We strive to provide accurate product descriptions and images, but we do not warrant that product descriptions are accurate or complete." },
        { title: "4. Orders and Payment", body: "By placing an order, you offer to purchase a product at the stated price. We reserve the right to refuse or cancel any order for any reason. Payment must be received before order processing begins." },
        { title: "5. Shipping and Delivery", body: "We aim to ship all orders within 24 hours of payment confirmation. Delivery times vary by location. We are not responsible for delays caused by courier services or circumstances beyond our control." },
        { title: "6. Returns and Refunds", body: "We offer a 7-day return policy for most items. Products must be returned in their original condition and packaging. Refunds are processed within 5-7 business days of receiving the returned item." },
        { title: "7. Intellectual Property", body: "All content on ShopEZ, including text, graphics, logos, and images, is the property of ShopEZ and is protected by intellectual property laws. You may not reproduce or distribute any content without our written permission." },
        { title: "8. Limitation of Liability", body: "ShopEZ shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our service or products purchased through our platform." },
        { title: "9. Contact", body: "For questions about these Terms of Service, please contact us at legal@shopez.com." },
      ].map((s, i) => (
        <div key={i} className="legal-section">
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Terms;