'use client';

import { useState, useRef } from 'react';
import { BentoGrid } from '@/components/BentoGrid';
import { SearchTile } from '@/components/SearchTile';
import { ResultTile } from '@/components/ResultTile';
import { Globe, Users, Megaphone, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Personnel {
  name?: string;
  role?: string;
  linkedin_url?: string;
  profile_pic_url?: string;
}

interface AdHooks {
  fomo?: string;
  problem_solution?: string;
  authority_gap?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [adHooks, setAdHooks] = useState<AdHooks | null>(null);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setLogs([]);
    setSummary(null);
    setPersonnel(null);
    setAdHooks(null);

    // Optimistic log
    setLogs(prev => [...prev, `Initializing agents for ${url}...`]);

    try {
      const response = await fetch('http://localhost:8000/stream_workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to agent swarm.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Process clear lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          try {
            const update = JSON.parse(line);

            // Handle error
            if (update.error) {
              setLogs(prev => [...prev, `Error: ${update.error}`]);
              continue;
            }

            const step = update.step;
            const data = update.data;

            if (data.logs) {
              if (Array.isArray(data.logs) && data.logs.length > 0) {
                const lastLog = data.logs[data.logs.length - 1];
                setLogs(prev => {
                  if (prev[prev.length - 1] !== lastLog) {
                    return [...prev, lastLog];
                  }
                  return prev;
                });
              }
            }

            if (step === 'scout' && data.business_summary) {
              setSummary(data.business_summary);
            }
            if (step === 'finder' && data.personnel_data) {
              setPersonnel(data.personnel_data);
            }
            if (step === 'director' && data.ad_hooks) {
              setAdHooks(data.ad_hooks);
            }

          } catch (e) {
            console.error("Error parsing JSON chunk", e);
          }
        }

        // Keep the remainder in buffer
        buffer = lines[lines.length - 1];
      }

    } catch (error) {
      setLogs(prev => [...prev, `System Failure: ${error}`]);
    } finally {
      setIsLoading(false);
      setLogs(prev => [...prev, "Workflow Complete."]);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 relative font-sans selection:bg-deep-teal/30 selection:text-white">
      {/* Ambient Backlights */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="max-w-7xl mx-auto mb-16 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-deep-accent shadow-[0_0_10px_var(--color-deep-accent)] animate-pulse" />
          <span className="text-white/40 font-mono text-xs tracking-widest uppercase">Deep Sea Protocol v1.0</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
          SYSTEM ONLINE
        </div>
      </header>

      <BentoGrid className="min-h-[700px] relative z-20 gap-6">

        {/* Search Tile - Center */}
        <div className="md:col-span-3 md:col-start-1 md:row-span-1 min-h-[350px]">
          <SearchTile onSearch={handleSearch} isLoading={isLoading} className={summary ? "min-h-[200px] transition-all duration-700" : "h-full"} />
        </div>

        {/* Live Logs */}
        <div className="md:col-span-1 md:row-span-2">
          <ResultTile title="Mission Log" icon={Terminal} className="font-mono text-xs text-green-400">
            <div className="space-y-4 pt-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs/relaxed">
                  <span className="opacity-30 whitespace-nowrap">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <span className="text-green-400/80">{log}</span>
                </div>
              ))}
              {logs.length === 0 && <span className="opacity-20 italic">Waiting for command...</span>}
            </div>
          </ResultTile>
        </div>

        {/* Scout Results */}
        {summary && (
          <div className="md:col-span-2 md:row-span-1">
            <ResultTile title="Intel Report" icon={Globe} delay={0.2}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>
                  {summary}
                </ReactMarkdown>
              </div>
            </ResultTile>
          </div>
        )}

        {/* Finder Results */}
        {personnel && (
          <div className="md:col-span-1 md:row-span-1">
            <ResultTile title="Target Found" icon={Users} delay={0.4}>
              <div className="flex flex-col items-start gap-4 mt-2">
                <div className="flex items-center gap-4 w-full bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-deep-teal overflow-hidden border-2 border-white/10 shrink-0">
                    {personnel.profile_pic_url && <img src={personnel.profile_pic_url} alt={personnel.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{personnel.name}</h3>
                    <p className="text-deep-light text-xs truncate">{personnel.role}</p>
                  </div>
                </div>

                {personnel.linkedin_url && (
                  <a href={personnel.linkedin_url} target="_blank" className="w-full py-2.5 text-xs text-center font-medium bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                    Open LinkedIn Profile
                  </a>
                )}
              </div>
            </ResultTile>
          </div>
        )}

        {/* Director Results */}
        {adHooks && (
          <div className="md:col-span-2 md:row-span-1">
            <ResultTile title="Strategic Vectors" icon={Megaphone} delay={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                <div className="bg-gradient-to-br from-deep-alert/10 to-transparent p-5 rounded-2xl border border-deep-alert/20 flex flex-col justify-between">
                  <h4 className="text-deep-alert font-bold text-[10px] uppercase tracking-wider mb-3">01 // FOMO</h4>
                  <p className="text-sm font-medium leading-relaxed">"{adHooks.fomo}"</p>
                </div>
                <div className="bg-gradient-to-br from-deep-teal/10 to-transparent p-5 rounded-2xl border border-deep-teal/20 flex flex-col justify-between">
                  <h4 className="text-deep-teal font-bold text-[10px] uppercase tracking-wider mb-3">02 // PROBLEM/SOL</h4>
                  <p className="text-sm font-medium leading-relaxed">"{adHooks.problem_solution}"</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-5 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
                  <h4 className="text-indigo-400 font-bold text-[10px] uppercase tracking-wider mb-3">03 // AUTHORITY</h4>
                  <p className="text-sm font-medium leading-relaxed">"{adHooks.authority_gap}"</p>
                </div>
              </div>
            </ResultTile>
          </div>
        )}

      </BentoGrid>
    </main>
  );
}
