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

import { resources } from '../data/blogData';


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
            <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                {(() => {
                    const currentIndex = resources.findIndex(r => r.id === resource.id);
                    const prevResource = currentIndex > 0 ? resources[currentIndex - 1] : null;
                    const nextResource = currentIndex < resources.length - 1 ? resources[currentIndex + 1] : null;

                    return (
                        <>
                            {prevResource ? (
                                <button
                                    onClick={() => {
                                        setSelectedResource(prevResource);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="flex flex-col items-start gap-1 p-4 rounded-2xl hover:bg-gray-50 transition-colors group max-w-[45%]"
                                >
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <ArrowLeft size={14} /> Previous Post
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                                        {prevResource.title}
                                    </span>
                                </button>
                            ) : <div />}

                            {nextResource ? (
                                <button
                                    onClick={() => {
                                        setSelectedResource(nextResource);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="flex flex-col items-end gap-1 p-4 rounded-2xl hover:bg-gray-50 transition-colors group text-right max-w-[45%]"
                                >
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Next Post <ChevronRight size={14} />
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                                        {nextResource.title}
                                    </span>
                                </button>
                            ) : <div />}
                        </>
                    );
                })()}
            </div>

        </div>
    );

    return (
        <div className="p-4 md:p-8">
            {selectedResource ? renderResourceDetail(selectedResource) : renderResourceList()}
        </div>
    );
};
