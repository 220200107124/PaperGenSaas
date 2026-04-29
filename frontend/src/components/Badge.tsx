import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-200 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-orange-100 text-orange-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-brand-blue/10 text-brand-blue',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
