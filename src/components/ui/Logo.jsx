import React from 'react';

export const LogoIcon = ({ className = "w-8 h-8" }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Magnifying Glass */}
        <circle
            cx="55"
            cy="45"
            r="32"
            stroke="currentColor"
            strokeWidth="8"
        />
        <line
            x1="32"
            y1="68"
            x2="12"
            y2="88"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
        />
        {/* Person Head */}
        <circle
            cx="55"
            cy="38"
            r="9"
            stroke="currentColor"
            strokeWidth="6"
        />
        {/* Person Shoulders */}
        <path
            d="M38 58C38 52 45 48 55 48C65 48 72 52 72 58"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
        />
    </svg>
);

export const Logo = ({ showText = true, className = "flex items-center gap-2", iconSize = "w-8 h-8", textSize = "text-xl" }) => {
    return (
        <div className={className}>
            <div className={`${iconSize} text-brand-blue dark:text-blue-400`}>
                <LogoIcon />
            </div>
            {showText && (
                <span className={`${textSize} font-bold tracking-tight text-gray-900 dark:text-white`}>
                    People <span className="text-gray-900 dark:text-white">Analyzer</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
