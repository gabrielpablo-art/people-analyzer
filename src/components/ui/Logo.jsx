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

export const Logo = ({ showText = true, className = "flex items-center gap-2", iconSize = "w-8 h-8", textSize = "text-xl", customLogoUrl }) => {
    if (customLogoUrl) {
        return (
            <div className={className}>
                <div className={`${iconSize} flex items-center justify-center overflow-hidden`}>
                    <img src={customLogoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                </div>
                {showText && (
                    <span className={`${textSize} font-bold tracking-tight text-gray-900 dark:text-white truncate`}>
                        {/* Optionally you could switch this to company name if passed, but for now we keep the layout consistent or just rely on the logo image if it contains text? 
                            The requirement is just to show the logo instead of the PeopleAnalyzer logo. 
                            Often company logos include the name. If not, we might want to still show "People Analyzer" or the company name? 
                            The prompt says "En lugar de mostrar acá el logo de PeopleAnalyzer, debería mostrarse el logo de la compañía".
                            It likely implies replacing the Icon+Text or just the Icon. 
                            If I assume it replaces the whole block, I should probably hide "People Analyzer" text if logo is present. 
                            However, the Sidebar design has an icon and then text. 
                            Let's support replacing just the icon part if 'showText' is true, OR replacing the whole thing. 
                            
                            Actually, looking at Sidebar.jsx:
                            <Logo iconSize="w-8 h-8" textSize="text-lg" />
                            
                            It expects both icon and text normally. 
                            Let's try to preserve the layout structure. 
                            If customLogoUrl is present, let's substitute the LogoIcon.
                        */}
                    </span>
                )}
            </div>
        );
    }

    // Improved implementation to handle "Replace the People Analyzer logo"
    // If a custom logo is provided, we probably want to display ONLY the custom logo image if it's wide (like a full banner), 
    // or just the icon if it's a square symbol? 
    // Given the "company logo" context, it's safer to show the image.

    if (customLogoUrl) {
        return (
            <div className={className}>
                <img
                    src={customLogoUrl}
                    alt="Company Logo"
                    className={`object-contain max-h-12 max-w-[180px]`}
                // Note: Sidebar container is strict, might need adjustment.
                // The Sidebar wraps Logo in: <div className="flex items-center gap-3 mb-10 px-2">
                // Logo default classes: className="flex items-center gap-2"
                />
            </div>
        );
    }

    // Let's go with a cleaner integration that respects the props
    return (
        <div className={className}>
            {customLogoUrl ? (
                <div className={`${iconSize} relative`}>
                    <img src={customLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
            ) : (
                <div className={`${iconSize} text-brand-blue dark:text-blue-400`}>
                    <LogoIcon />
                </div>
            )}

            {showText && !customLogoUrl && (
                <span className={`${textSize} font-bold tracking-tight text-gray-900 dark:text-white`}>
                    People <span className="text-gray-900 dark:text-white">Analyzer</span>
                </span>
            )}
            {/* If we have a custom logo, we usually don't want to show "People Analyzer" text next to it, unless it's just an icon. 
                 But often uploaded logos are full wordmarks. 
                 Let's assume if customLogoUrl is present, we hide the default text because the logo likely contains the brand. 
                 OR, if the user uploads just a symbol... 
                 Let's check the requirement: "En lugar de mostrar acá el logo de PeopleAnalyzer, debería mostrarse el logo de la compañía".
                 This implies replacing the whole entity.
              */}
            {showText && customLogoUrl && (
                // If they want to keep the text layout structure but use their logo as the icon:
                // But usually "Company Logo" replaces "App Name". 
                // Let's try hiding the text if custom logo is present, OR verify if the user wants the company NAME text?
                // The prompt says "show the company logo". 
                // Let's hide "People Analyzer" text if custom logo is present.
                null
            )}
        </div>
    );
};

export default Logo;
