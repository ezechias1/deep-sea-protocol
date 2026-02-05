'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(0,1fr)] max-w-7xl mx-auto w-full", // Increased w-full and made standard grid
                className
            )}
        >
            {children}
        </div>
    );
}
