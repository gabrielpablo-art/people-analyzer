import React, { useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';

export default function TermsOfUse() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PublicLayout>
            <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Use</h1>
                <p className="text-gray-500 mb-8">Last Updated: January 2026</p>

                <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p>
                            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and People Analyzer ("we," "us" or "our"),
                            concerning your access to and use of our website and application (collectively, the "Service").
                        </p>
                        <p className="mt-2">
                            You agree that by accessing the Service, you have read, understood, and accept to be bound by all of these Terms of Use. If you do not agree with all of these Terms of Use,
                            then you are expressly prohibited from using the Service and you must discontinue use immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property</h2>
                        <p>
                            Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs,
                            and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us,
                            and are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Representations</h2>
                        <p>By using the Service, you represent and warrant that:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                            <li>You will not access the Service through automated or non-human means, whether through a bot, script, or otherwise.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
                        <p>
                            You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages,
                            including lost profit, lost revenue, loss of data, or other damages arising from your use of the Service, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                        <p>
                            If you have questions or comments about these terms, you may email us at: support@peopleanalyzer.ai
                        </p>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
