"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

const privacyContent = {
    collection: { title: "Information We Collect", content: ["Personal information like name, email, phone when you register or place orders", "Payment information processed securely through encrypted channels", "Browsing data and preferences to improve your shopping experience", "Device information and IP address for security purposes"] },
    usage: { title: "How We Use Your Information", content: ["Process and fulfill your clothing orders efficiently", "Send order confirmations and shipping updates", "Provide customer support and respond to inquiries", "Improve our website and personalize your experience"] },
    sharing: { title: "Information Sharing", content: ["We never sell your personal information to third parties", "Share with trusted payment processors for secure transactions", "Provide shipping details to delivery partners only", "May disclose if required by law or to protect our rights"] },
    security: { title: "Data Security", content: ["Use industry-standard SSL encryption for all transactions", "Secure servers with regular security updates and monitoring", "Limited access to personal data by authorized personnel only", "Regular security audits to protect your information"] },
    cookies: { title: "Cookies and Tracking", content: ["Essential cookies for website functionality and shopping cart", "Analytics cookies to understand how you use our site", "Marketing cookies for personalized product recommendations", "You can manage cookie preferences in your browser settings"] },
    rights: { title: "Your Privacy Rights", content: ["Access and review your personal information anytime", "Request correction of inaccurate information", "Delete your account and associated data", "Opt-out of marketing communications at any time"] },
    retention: { title: "Data Retention", content: ["Keep account information while your account is active", "Retain order history for 3 years for warranty and returns", "Delete inactive accounts after 2 years of no activity", "Some data may be kept longer if required by law"] },
    contact: { title: "Contact Us", content: ["Email us at Dressenmanager@gmail.com for privacy questions", "Call +8801909008004 during business hours", "Write to us at Kazla, Dhaka, Bangladesh", "We respond to privacy inquiries within 48 hours"] },
}

type SectionKey = keyof typeof privacyContent

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState<SectionKey>("collection")
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
        <div className="min-h-screen bg-accent flex flex-col border-b-2 mb-4 pb-6">
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="text-center py-8 px-4 sm:px-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-secondary mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-secondary-600 text-sm sm:text-base">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                        <br className="hidden sm:block" />
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Sidebar + Main Content (same wrapper) */}
                <div className="flex flex-1 flex-col lg:flex-row gap-6 lg:gap-12 px-4 sm:px-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 mb-6">
                        <nav className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible">
                            {Object.entries(privacyContent).map(([key, section]) => {
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
                            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">
                                {privacyContent[activeSection].title}
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                                {privacyContent[activeSection].content.map((item, index) => (
                                    <div
                                        key={index}
                                        className=""

                                    >
                                        <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">• {item}</p>
                                    </div>
                                ))}
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
                    <h2 className="text-lg sm:text-xl font-medium text-primary">
                        Have privacy questions?
                    </h2>

                    <p className="text-sm sm:text-base text-secondary-600">
                        Contact us at Dressenmanager@gmail.com for any privacy concerns.
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
                            className="flex-1 bg-neutral/50 border-primary/50 text-sm sm:text-base transition-all duration-200 focus:bg-white rounded-full focus:border-primary focus:ring-2 focus:ring-primary/15 mb-3"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full bg-primary hover:bg-primary-600 text-secondary px-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/30 mb-2"
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
    )
}
