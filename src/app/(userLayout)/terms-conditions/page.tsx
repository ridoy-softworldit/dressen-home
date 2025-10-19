"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const termsContent = {
    acceptance: { title: "Acceptance of Terms", content: ["By accessing and using Dressen website (www.Dressen.com), you accept and agree to be bound by these terms and conditions", "If you do not agree to these terms, please discontinue use of our website and services immediately", "These terms constitute the entire legal agreement between you and Dressen regarding your use of our platform", "Any modifications to these terms must be agreed upon in writing by Dressen management and will be posted on this page", "Your continued use of the website after changes indicates acceptance of the modified terms", "Users must be at least 18 years old or have parental consent to use our services"] },
    shipping: { title: "Shipping and Delivery", content: ["Standard shipping within Bangladesh: 3-5 business days via courier service", "Express shipping available in Dhaka metropolitan area: 1-2 business days with additional charges", "International shipping available to selected countries: 7-14 business days depending on customs clearance", "Shipping costs calculated at checkout based on delivery location, package weight, and selected service", "Free shipping available on orders above 2000 BDT within Bangladesh", "Delivery attempts made during business hours; customer responsible for providing accurate address", "Risk of loss transfers to customer upon delivery to the provided address"] },
    product: { title: "Product Information", content: ["We strive to provide accurate product descriptions, specifications, and high-quality images", "Product colors may vary slightly due to monitor settings, lighting conditions, and photography", "Clothing sizes follow standard international measurements provided in our detailed size charts", "Products are subject to availability and may be discontinued without prior notice", "Material composition and care instructions are provided for each garment", "We reserve the right to limit quantities purchased per customer", "Product reviews and ratings are from verified customers only"] },
    order: { title: "Order Process", content: ["Orders processed within 1-2 business days after payment confirmation and fraud verification", "Confirmation email with order details and tracking information sent after shipping", "We reserve the right to refuse, cancel, or limit orders for any reason including suspected fraud", "Order modifications or cancellations possible within 2 hours of placement before processing begins", "Bulk orders (10+ items) may require additional processing time and verification", "Payment authorization may be required for high-value orders", "Order status can be tracked through your account dashboard or tracking link"] },
    pricing: { title: "Pricing and Payment", content: ["All prices listed in Bangladeshi Taka (BDT) unless otherwise clearly stated", "We accept bKash, Nagad, Rocket, Visa, Mastercard, and cash on delivery (COD)", "Payment must be received in full before order processing and shipment", "Taxes, VAT, and delivery charges calculated and displayed at checkout", "Promotional prices and discounts are valid for limited time periods as specified", "Price matching not available; all sales final at listed prices", "COD orders may require advance payment for high-value items"] },
    returns: { title: "Returns and Refunds", content: ["STRICT POLICY: Items may be returned within 3 days of delivery in original, unworn condition only", "Return shipping costs are customer responsibility unless item is defective or incorrect", "Refunds processed within 10-15 business days after item inspection and approval", "25% restocking fee applies to all approved returns", "Custom, personalized, intimate apparel, and sale items are not eligible for return", "All returns require prior authorization via email to Dressenmanager@gmail.com", "Items must include all original tags, packaging, and accessories for return eligibility"] },
    intellectual: { title: "Intellectual Property", content: ["All content on Dressen website including text, images, logos, and designs are protected by copyright and trademark laws", "No reproduction, distribution, modification, or commercial use without express written permission from Dressen", "Dressen logo, brand name, and associated marks are registered trademarks of Dressen", "User-generated content (reviews, photos) remains property of users but grants Dressen usage rights for marketing", "Violation of intellectual property rights may result in legal action and account termination", "Third-party brand names and logos are property of their respective owners", "DMCA takedown requests should be sent to Dressenmanager@gmail.com"] },
    changes: { title: "Changes to Terms", content: ["Dressen reserves the right to modify these terms at any time without prior notice to users", "Changes become effective immediately upon posting on our website", "Continued use of our services after changes constitutes acceptance of modified terms", "Users are responsible for regularly reviewing terms for updates and changes", "Significant changes may be communicated via email to registered users", "Previous versions of terms are not maintained; current version supersedes all previous versions", "If you disagree with changes, discontinue use of the website immediately"] },
    contact: { title: "Contact Information", content: ["For questions about terms and conditions, contact Dressenmanager@gmail.com", "Customer service available during business hours (9 AM - 6 PM) at +8801909008004", "Legal notices and formal communications should be sent via email with 'Legal Notice' in subject line", "We respond to inquiries within 24-48 hours on business days (Saturday-Thursday)", "Emergency order issues can be reported via phone during business hours", "Social media messages are not considered official communication channels", "All communications should be in English or Bengali for faster processing"] },
}

type SectionKey = keyof typeof termsContent

export default function TermsAndConditions() {
    const [activeSection, setActiveSection] = useState<SectionKey>("acceptance")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState("")

    const handleSectionClick = (sectionId: SectionKey) => setActiveSection(sectionId)

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes("@")) {
            setSubmitMessage("Please enter a valid email address")
            return
        }
        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsSubmitting(false)
        setSubmitMessage("Thank you! We'll get back to you soon.")
        setEmail("")
    }

    useEffect(() => {
        if (submitMessage) {
            const timer = setTimeout(() => setSubmitMessage(""), 3000)
            return () => clearTimeout(timer)
        }
    }, [submitMessage])

  return (
    <div className="min-h-screen bg-accent flex flex-col">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center py-8 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-secondary mb-2">
            Terms and Conditions
          </h1>
          <p className="text-secondary-600 text-sm sm:text-base">
            By using our site, you agree to comply with and be bound by these Terms and Conditions.
            <br className="hidden sm:block" />
            If you do not agree, please do not use our website.
          </p>
        </div>

        {/* Sidebar + Main Content (same wrapper) */}
        <div className="flex flex-1 flex-col lg:flex-row gap-6 lg:gap-12 px-4 sm:px-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 mb-6">
            <nav className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible">
              {Object.entries(termsContent).map(([key, section]) => {
                const active = activeSection === (key as SectionKey)
                return (
                  <button
                    key={key}
                    onClick={() => handleSectionClick(key as SectionKey)}
                    title={section.title}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block w-auto lg:w-full flex-shrink-0 text-left px-5 py-3 text-sm sm:text-base rounded-full transition-all duration-200 border truncate",
                      active
                        ? "font-medium text-secondary bg-primary border-primary shadow-sm"
                        : "text-secondary-700 bg-white/60 border-neutral hover:bg-primary hover:text-secondary hover:border-primary",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30",
                    ].join(" ")}
                  >
                    {section.title}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0 ">
            <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-neutral p-6 sm:p-8 overflow-auto transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4 sm:mb-6">
                {termsContent[activeSection]?.title || 'Loading...'}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {termsContent[activeSection]?.content?.map((item, index) => (
                  <div key={index}>
                    <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">• {item}</p>
                  </div>
                )) || <p>No content available</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Email Section */}
        <div
          className="
    mt-12 sm:mt-16
    mx-auto text-center
    flex flex-col items-center
    w-full max-w-[439px] h-[314.4px]
    gap-[15.4px]
    pt-12 pr-8 pb-8 pl-8
    rounded-[16px]
    opacity-100
    rotate-0
    bg-white/70 border border-neutral backdrop-blur
  "
        >
          <h2 className="text-lg sm:text-xl font-medium text-secondary">
            Have questions about our terms?
          </h2>

          <p className="text-sm sm:text-base text-secondary-600">
            Contact us at Dressenmanager@gmail.com for any terms-related questions.
          </p>

          {/* form pinned to bottom */}
          <form
            onSubmit={handleEmailSubmit}
            className="w-full mt-auto flex flex-col justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-neutral/50 border-neutral text-sm sm:text-base transition-all duration-200 focus:bg-white rounded-full focus:border-primary focus:ring-2 focus:ring-primary/15 mb-3"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary hover:bg-primary-600 text-white px-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/30 mb-2"
            >
              {isSubmitting ? "SENDING..." : "SEND"}
            </Button>
          </form>

          {submitMessage && (
            <p
              className={`text-sm sm:text-base transition-all duration-300 ${submitMessage.includes("Thank you") ? "text-green-600" : "text-red-600"
                }`}
            >
              {submitMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
