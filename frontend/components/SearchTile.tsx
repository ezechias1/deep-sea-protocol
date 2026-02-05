'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SearchTileProps {
    onSearch: (url: string) => void;
    isLoading: boolean;
    className?: string;
}

export function SearchTile({ onSearch, isLoading, className }: SearchTileProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("glass-panel p-10 rounded-3xl flex flex-col justify-center items-center text-center h-full relative overflow-hidden group", className)}
        >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
                <h2 className="text-4xl font-light mb-3 text-white tracking-tight">Deep Sea Scout</h2>
                <p className="text-deep-light mb-10 text-lg">Enter a business URL to deploy the agent swarm.</p>

                <form onSubmit={handleSubmit} className="w-full relative">
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                        className="glass-input w-full py-5 pl-8 pr-16 rounded-2xl text-lg transition-all focus:ring-4 focus:ring-deep-teal/20 placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-deep-teal hover:bg-teal-400 text-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)]"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
