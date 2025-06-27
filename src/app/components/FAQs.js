'use client';

import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

function FAQs() {
  const faqData = [
  {
    question: "What is CardNest and how does it work?",
    answer: "CardNest is an AI-powered fraud prevention platform that secures online credit and debit card transactions in real-time. It uses machine learning, behavioral analytics, and advanced fraud modeling to detect and stop suspicious transactions before they are authorized—ensuring only legitimate payments are processed."
  },
  {
    question: "How does CardNest prevent online fraud before a transaction is completed?",
    answer: "CardNest's Card-At-Present engine scans, detects, and analyzes user behavior, device identity, geolocation, and thousands of transaction data points in milliseconds. It builds a risk profile for each transaction and prevents potential fraud attempts instantly—unlike traditional systems that act only after a chargeback."
  },
  {
    question: "Does CardNest store any customer or cardholder data?",
    answer: "No. CardNest operates on a zero-data storage model. It does not retain card numbers, CVV, or any personally identifiable information. All fraud detection happens in real-time, helping your business remain PCI DSS–compliant and privacy-focused, and data is encrypted and processed on the client's infrastructure."
  },
  {
    question: "Can CardNest be integrated with any payment gateway or e-commerce platform?",
    answer: "Yes. CardNest is designed with API-first architecture and supports easy integration with most payment gateways, merchant systems, business systems, custom checkout flows, and more."
  },
  {
    question: "How accurate is CardNest in detecting fraud?",
    answer: "CardNest delivers up to 98% or more reduction in chargebacks, with highly accurate fraud detection and minimal false positives. Its AI constantly learns from new transaction data to improve accuracy and adapt to new fraud tactics."
  },
  {
    question: "What happens if a legitimate credit or debit card is blocked?",
    answer: "CardNest minimizes false positives through smart behavioral analytics and custom risk thresholds and confidence scores. Businesses can adjust settings or route flagged transactions to a manual review queue, ensuring genuine customers aren't unintentionally blocked."
  },
  {
    question: "Is CardNest suitable for small businesses or only for enterprises?",
    answer: "CardNest is scalable for all business sizes. Whether you process hundreds or millions of transactions monthly, CardNest adapts to your transaction volume and grows with your business."
  },
  {
    question: "How much does CardNest cost?",
    answer: "CardNest offers flexible billing options based on transaction volume and features needed. Pricing plans typically include pay-as-you-go (per Security API Scan), monthly subscription tiers, and enterprise packages with volume-based discounts. Custom pricing is available for high-volume clients. Contact support at support@cardnest.io for a tailored quote."
  },
  {
    question: "Do I need a developer to set up CardNest?",
    answer: "For most businesses, integration is simple and well-documented. However, a developer may be needed to plug the API into your payment flow. CardNest provides full onboarding support, technical documentation, and developer tools to streamline setup."
  },
  {
    question: "How do I get started with CardNest?",
    answer: "Visit www.cardnest.io to request a free demo or sign up. After onboarding, you'll receive API credentials, integration support, and access to the CardNest dashboard to monitor security performance and fraud analytics."
  }
];

  return (
<section className="my-5 sm:my-5 relative min-h-screen">
  {/* Background video at bottom */}
  <div className="absolute bottom-0 left-0 w-full h-[400px] lg:[500px] xl:h-auto z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="/videos/fliped_video.mp4" type="video/mp4" />
    </video>
  </div>

  <div className="text-center pb-5 relative z-10">
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
      Frequently Asked Questions
    </h2>
    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
      Everything you need to know about our pricing and plans
    </p>
  </div>

  <div className="max-w-3xl mx-auto space-y-6 mb-8 py-10 relative z-10">
    {faqData.map((faq, index) => (
      <FAQItem
        key={index}
        question={faq.question}
        answer={faq.answer}
      />
    ))}
  </div>
</section>
  );
}

export default FAQs;
