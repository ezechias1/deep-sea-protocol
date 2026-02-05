'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultTileProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function ResultTile({ title, icon: Icon, children, className, delay = 0 }: ResultTileProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className={cn("glass-panel p-8 rounded-3xl flex flex-col h-full overflow-hidden relative", className)}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2.5 rounded-xl bg-white/5 text-deep-accent">
                    <Icon size={18} />
                </div>
                <h3 className="font-medium uppercase tracking-widest text-xs text-deep-light">{title}</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </motion.div>
    );
}
