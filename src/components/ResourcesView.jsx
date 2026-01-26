import React, { useState } from 'react';
import {
    BookOpen,
    ChevronRight,
    ArrowLeft,
    Clock,
    User,
    Calendar,
    Share2,
    Bookmark
} from 'lucide-react';
import { Card } from './Card';

const resources = [
    {
        id: 'accountability-charts-not-job-descriptions',
        title: 'Why Accountability Charts Are Not Job Descriptions',
        excerpt: 'Organizations often mix up tools that look similar but serve very different purposes. One of the most common confusions is between an EOS Accountability Chart and a job description.',
        author: 'EOS Expert',
        date: 'Jan 26, 2026',
        readTime: '6 min read',
        category: 'Organization Design',
        content: `
Organizations often mix up tools that look similar but serve very different purposes. One of the most common confusions is between an EOS Accountability Chart and a job description (also called a job specification). They might both be about “roles,” but they solve distinctly different problems in how a company organizes and operates.

An Accountability Chart (from the Entrepreneurial Operating System, or EOS) is a leadership and organizational design tool. Its purpose is to clarify who owns what outcomes in your business — what results must be delivered, who is accountable for those results, and how the major functions in the organization fit together. By contrast, a job description is an HR tool: it focuses on how a person performs work day to day — listing tasks, skills, qualifications, and expectations for performance.

The root of the confusion is that both talk about “roles,” but they define “roles” differently. In an Accountability Chart, a “role” (often called a seat) groups together the most important outcomes the business needs owned. Each seat has one owner and around five major accountabilities that must be achieved — not a checklist of every possible task or duty. Job descriptions usually list tasks, skills, competencies, years of experience, and sometimes personality or culture fit requirements. These help HR with hiring, performance reviews, and legal compliance, but they don’t necessarily show how the organization actually functions or who is responsible for what high-level results.

### Here’s how to think about it with an example:

**Accountability Chart:**
*   **Seat:** Director of Customer Success
*   **Accountabilities:** Ensure customer retention >90%, lead customer onboarding improvements, align CSM strategy with Product and Sales, manage quarterly business reviews, drive escalations to resolution.
*   **Focus:** If these outcomes aren’t achieved, who owns the problem?

**Job Description:**
*   **Title:** Director of Customer Success
*   **Tasks & Skills:** Manage CSM team, coach staff, use CRM tools (Salesforce, Gainsight), prepare reports, conduct meetings, 8+ years experience, degree in business.
*   **Focus:** What the person does and what skills they need to do it.

**Notice:** The Accountability Chart does not dictate tools or tasks (like CRM usage). It focuses on results. The Job Description is full of how those results might be achieved — but doesn’t help leadership design the org or assign ownership of outcomes.

This distinction matters because when leaders confuse the two, the Accountability Chart becomes long and bloated (because it slowly accumulates tasks from job descriptions) and stops clearly defining ownership. Instead of outcomes, it ends up listing tasks — defeating the whole purpose of accountability.

In the context of EOS, the Accountability Chart should be relatively lean: only major responsibilities, each owned by one seat. Job descriptions can — and usually should — be more detailed, but only after the Accountability Chart has been established. Otherwise, you risk designing your organization around activities rather than outcomes.

### Why this matters in practice:
*   **Clarity of ownership:** Teams know exactly who is responsible for what outcomes.
*   **Decision making:** When outcomes (not tasks) are laid out, it’s easier to see gaps and make structural changes.
*   **Hiring efficiency:** Job descriptions become easier to write once you know the outcomes a seat must own.
*   **Performance alignment:** Scorecards and quarterly conversations can focus on outcomes, not simply completing tasks.

### Next steps:
*   Map your current Accountability Chart and highlight whether each line is an outcome or a task.
*   Limit each seat’s accountabilities to around five outcome-focused items.
*   Separate job descriptions from your chart; let HR create them based on the Accountability Chart.

**TL;DR:** An Accountability Chart defines who owns what outcomes in the organization; job descriptions define how work gets done — mixing them creates confusion and weak accountability.
        `
    },
    {
        id: 'seats-not-people',
        title: 'Seats, Not People: The EOS Way to Design an Organization',
        excerpt: 'In many companies, org charts are built around titles or people. EOS challenges that by designing an organization around seats, not people.',
        author: 'EOS Expert',
        date: 'Jan 26, 2026',
        readTime: '5 min read',
        category: 'Leadership',
        content: `
In many companies, org charts are built around titles or people: CFO, Head of Marketing, Customer Support Lead, etc. That approach seems intuitive — until business priorities change, and suddenly titles don’t reflect reality, responsibilities overlap, or outcomes aren’t owned clearly. The EOS (Entrepreneurial Operating System) Accountability Chart challenges that by designing an organization around seats, not people.

A seat in EOS is a group of outcomes the business needs owned — it is not a job description tied to one person’s daily grind. Think of it as a strategic bundle of responsibilities: the things that must be achieved for the company to thrive. A seat has three key properties:
1.  **Defined accountabilities** — major outcomes that must be achieved.
2.  **One owner** — no shared accountability; if something fails, it’s clear who is responsible.
3.  **Reporting lines** — clarity on who the seat answers to and who answers to it.

This differs from job descriptions because titles often bundle too many tasks or include activities that aren’t strategically crucial. For example, a “Head of Growth” title might include marketing campaigns, data analysis, hiring, budgeting, vendor management, and CRM configuration — a mix that might be too broad or disconnected from true accountability if not defined as outcomes.

Designing around seats requires a mindset shift:
*   Instead of asking “What does this person do?” you ask “What must be true for this area of the business to succeed?”
*   Instead of building around current people’s skills, you build around business needs today — regardless of who fills the seats tomorrow.

### Why this matters:
*   **Agility:** When business priorities shift (e.g., moving from acquisition to retention focus), you can redefine seats without re-imagining titles.
*   **Clarity:** Teams see exactly what outcomes each seat owns — fewer gray areas, fewer duplicated efforts.
*   **Scalability:** As you grow, adding new seats for new functions becomes more systematic.
*   **Talent fit:** You put people into seats based on skills and alignment with outcomes, not just matching a title.

### Let’s walk through how you might rewire an org:
1.  **Start with major functions:** Revenue, Marketing, Delivery, Operations, Finance.
2.  **Define outcomes for each:** e.g., Marketing — increase lead quality; Sales — improve close rates; Delivery — reduce churn.
3.  **Group outcomes into seats:** Some outcomes may combine logically; others need their own seat.
4.  **Assign one owner per seat:** That person becomes accountable — period.
5.  **Draw reporting lines:** Clear hierarchy or peer relationships.

Once seats are defined, job descriptions can follow as a translation of seats into tasks and skills needed — but this should be second, not the starting point. If you write job descriptions first, you risk codifying outdated tasks and burdening roles with non-strategic work.

### This approach helps avoid common pitfalls:
*   **Responsibility overlap:** One seat owns a result. Siloed tasks that aren’t linked to outcomes don’t confuse ownership.
*   **Task creep:** Without seat accountabilities, roles accumulate tasks over time.
*   **Title inflation:** People get fancier titles with little impact on outcomes — but seats stay focused on results.

### Next steps:
*   Redesign your org by outcomes: list strategic results, group them into seats.
*   Review current titles and match them to seats — retire or rename where misaligned.
*   Ensure each seat has only one owner — no shared accountability.

**TL;DR:** Design your organization around seats (outcome bundles) rather than people or titles to ensure clarity, scalability, and accountability.
        `
    },
    {
        id: 'accountability-charts-job-specs-together',
        title: 'How EOS Accountability Charts and Job Specs Work Best Together',
        excerpt: 'EOS doesn’t discard job descriptions — it reframes when and how they are used for maximum clarity and impact.',
        author: 'EOS Expert',
        date: 'Jan 26, 2026',
        readTime: '7 min read',
        category: 'HR Management',
        content: `
EOS doesn’t discard job descriptions — it reframes when and how they are used for maximum clarity and impact. If you’ve ever felt frustrated because your org chart, job descriptions, and performance evaluations don’t align, that often traces back to order of operations: many companies write job specs first, then try to fit the org structure around them. EOS flips that.

### Here’s the simple, powerful sequence:

**1. Build the Accountability Chart first**
Start with outcomes your business needs owned. These are strategic — not task lists. Each seat reflects a cluster of outcomes that together make a function successful. This chart becomes the backbone of your org.

**2. Translate each seat into a job specification**
Once you know what outcomes a seat must own, HR can write job specs that describe how someone can achieve those outcomes — tasks, skills, qualifications, competencies. The job spec serves hiring, performance evaluation, and compliance needs.

**3. Manage performance with EOS operating tools**
Tools like the Scorecard (weekly metrics), Rocks (90-day priorities), and regular conversations ensure accountability focuses on outcomes first, with job specs supporting clarity for individuals.

This sequence matters because job specs written before alignment on outcomes tend to:
*   Inflate roles with tasks that don’t tie to business priorities.
*   Lock people into activities that may change with strategy.
*   Create confusion when performance measures don’t match expectations.

By contrast, when job specs flow from the Accountability Chart:
*   **Hiring becomes easier:** you know exactly what outcomes the person must deliver.
*   **Onboarding is clearer:** the person understands strategic priorities before tasks.
*   **Performance conversations align:** metrics and tasks all tie back to outcomes owned.

Think of Accountability Charts as architectural design and job specs as interior design. You want the structure (load-bearing walls and layout) correct before choosing furniture and finishes. If you pick furniture first (job specs) and then try to design the structure (Accountability Chart), you end up with mismatches and inefficiencies.

### A practical test companies can use is:
*   If your Accountability Chart is as long as your job descriptions (i.e., full of tasks), it’s not an Accountability Chart — it’s a job spec disguised as one.
*   If job specs contain strategic outcomes rather than tasks alone, they are mixing levels of abstraction — which dilutes clarity.

Integrating the two effectively means leadership and HR work together:
*   Leadership defines outcomes and seats.
*   HR translates those into recruitment and development frameworks.
*   Both use common language so hiring, performance, and strategy are aligned.

This approach also makes your organization more adaptable. When priorities shift (e.g., entering new markets, pivoting offerings), you update the Accountability Chart first. Job specs then follow — ensuring what you ask people to do always supports the outcomes that matter most.

### Next steps:
*   Audit your current Accountability Chart and job specs for alignment.
*   Rewrite job specs based on seats, not the other way around.
*   Train leadership and HR on outcome-based role design.

**TL;DR:** Build outcomes and structure first (Accountability Chart), then translate seats into job specs — aligning hiring and performance with strategy.
        `
    }
];

export const ResourcesView = () => {
    const [selectedResource, setSelectedResource] = useState(null);

    const renderResourceList = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resources & Learning</h1>
                <p className="text-gray-500">Master the EOS methodology and optimize your organization's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card
                        key={resource.id}
                        className="group flex flex-col h-full hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 border-gray-100 hover:border-brand-blue/20 cursor-pointer overflow-hidden"
                        onClick={() => setSelectedResource(resource)}
                    >
                        <div className="p-6 flex flex-col h-full bg-white relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2.5 py-1 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] font-bold uppercase tracking-wider">
                                    {resource.category}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1.5 ml-auto">
                                    <Clock size={12} />
                                    {resource.readTime}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-3 leading-tight">
                                {resource.title}
                            </h3>

                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {resource.excerpt}
                            </p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-blue">
                                        <User size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-900">{resource.author}</span>
                                        <span className="text-[10px] text-gray-400">{resource.date}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Newsletter or CTA Section */}
            <div className="relative mt-12 rounded-3xl overflow-hidden bg-brand-blue p-8 md:p-12 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Want more EOS insights?</h2>
                    <p className="text-brand-blue-light/80 mb-8 text-lg">
                        Stay updated with the latest organizational design strategies and leadership tips.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 flex-1"
                        />
                        <button className="bg-white text-brand-blue px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderResourceDetail = (resource) => (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <button
                onClick={() => setSelectedResource(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-8 transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-blue/10">
                    <ArrowLeft size={16} />
                </div>
                <span className="font-medium">Back to Resources</span>
            </button>

            <article className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                <div className="h-4 bg-gradient-to-r from-brand-blue to-teal-400" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="px-3 py-1 rounded-full bg-brand-blue/5 text-brand-blue text-xs font-bold uppercase tracking-wider">
                            {resource.category}
                        </span>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {resource.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {resource.readTime}
                            </span>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors">
                                <Bookmark size={18} />
                            </button>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-[1.1]">
                        {resource.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-12 p-4 bg-gray-50 rounded-2xl w-fit">
                        <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                            <User size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{resource.author}</span>
                            <span className="text-xs text-gray-500">Expert on Organizational Design</span>
                        </div>
                    </div>

                    <div className="prose prose-blue max-w-none">
                        {resource.content.trim().split('\n\n').map((paragraph, idx) => {
                            if (paragraph.startsWith('###')) {
                                return (
                                    <h3 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-brand-blue rounded-full" />
                                        {paragraph.replace('### ', '')}
                                    </h3>
                                );
                            }
                            if (paragraph.startsWith('**')) {
                                return (
                                    <div key={idx} className="bg-brand-blue/5 p-6 rounded-2xl border-l-4 border-brand-blue my-8">
                                        <p className="text-gray-800 font-medium leading-relaxed m-0">
                                            {paragraph.replace(/\*\*/g, '')}
                                        </p>
                                    </div>
                                );
                            }
                            if (paragraph.startsWith('* ')) {
                                return (
                                    <ul key={idx} className="my-6 space-y-3">
                                        {paragraph.split('\n').map((line, lIdx) => (
                                            <li key={lIdx} className="flex items-start gap-3 text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-2 shrink-0" />
                                                <span className="leading-relaxed">
                                                    {line.replace('* ', '').split(': ').map((part, pIdx) => (
                                                        pIdx === 0 ? <strong key={pIdx} className="text-gray-900">{part}: </strong> : part
                                                    ))}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            if (paragraph.match(/^\d\./)) {
                                return (
                                    <ol key={idx} className="my-6 space-y-4">
                                        {paragraph.split('\n').map((line, lIdx) => (
                                            <li key={lIdx} className="flex gap-4 text-gray-600">
                                                <span className="flex-none flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue text-white text-[12px] font-bold mt-0.5">
                                                    {line.split('. ')[0]}
                                                </span>
                                                <span className="leading-relaxed pt-0.5">
                                                    {line.split('. ').slice(1).join('. ').split(': ').map((part, pIdx) => (
                                                        pIdx === 0 ? <strong key={pIdx} className="text-gray-900">{part}: </strong> : part
                                                    ))}
                                                </span>
                                            </li>
                                        ))}
                                    </ol>
                                );
                            }
                            return <p key={idx} className="text-gray-600 leading-[1.8] text-lg mb-6">{paragraph}</p>;
                        })}
                    </div>
                </div>
            </article>

            {/* Bottom Navigation */}
            <div className="mt-12 flex items-center justify-between">
                <button
                    onClick={() => setSelectedResource(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold">Next Post</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8">
            {selectedResource ? renderResourceDetail(selectedResource) : renderResourceList()}
        </div>
    );
};
