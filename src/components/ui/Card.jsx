import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(clsx(
                'bg-white rounded-xl shadow-darwin border border-gray-100 overflow-hidden',
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(clsx('p-6 pb-2', className))}
            {...props}
        >
            {children}
        </div>
    );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <h3
            ref={ref}
            className={twMerge(clsx('text-xl font-bold text-gray-900', className))}
            {...props}
        >
            {children}
        </h3>
    );
});

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(clsx('p-6 pt-2', className))}
            {...props}
        >
            {children}
        </div>
    );
});

CardContent.displayName = 'CardContent';
