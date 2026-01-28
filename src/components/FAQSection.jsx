import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        question: "What is People Analyzer?",
        answer: "People Analyzer is a tool based on the EOS® methodology that helps you evaluate your team members against your Core Values (cultural fit) and GWC™ (Get it, Want it, Capacity to do it)."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! We offer a 5-day free trial on our Starter plan so you can experience the full power of People Analyzer before committing."
    },
    {
        question: "How do I get started?",
        answer: "Simply click on the 'Start Analyzing Free' button, create your account, define your Core Values, and invite your team members to potentialize your organization."
    },
    {
        question: "Can I export the reports?",
        answer: "Yes, you can export your analysis results and coaching plans. Higher tier plans offer more advanced reporting and historical data access."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500 text-lg">
                        Everything you need to know about People Analyzer.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-brand-blue/30 bg-blue-50/10' : 'hover:border-gray-300'}`}
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-blue' : 'text-gray-900'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-brand-blue flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
