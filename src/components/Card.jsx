import React from 'react';
import { Card as UICard } from './ui/Card';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
    return (
        <UICard className={twMerge("p-6", className)} {...props}>
            {children}
        </UICard>
    );
};
