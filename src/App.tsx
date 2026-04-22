import React, { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { ResultSection } from './components/ResultSection';
import { HowItWorks } from './components/HowItWorks';
import { analyzeCV, CVAnalysisResult } from './lib/gemini';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    try {
      const res = await analyzeCV(text);
      setResult(res);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze. The AI might be too busy replacing other jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600/30 font-sans overflow-x-hidden p-6 md:p-12 flex flex-col relative">
      <header className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-zinc-800 pb-8 gap-4">
        <div>
          <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-2">Analysis Status: Standby</p>
          <h2 className="text-3xl font-bold tracking-tighter">AI REPLACEMENT INDEX v.2.4</h2>
        </div>
        <div className="flex flex-col items-start md:items-end font-mono text-xs gap-3">
          <div className="text-left md:text-right">
            <p className="text-red-500">PROBABILITY: COMPUTING</p>
            <p className="text-zinc-500 uppercase">TIMESTAMP: {new Date().toISOString().slice(0, 16).replace('T', '_')}</p>
          </div>
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="px-3 py-1 border border-zinc-800 hover:bg-zinc-900 transition-colors uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            Cơ chế hoạt động ?
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {!result ? (
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <ResultSection result={result} onReset={() => setResult(null)} />
        )}
      </main>

      <footer className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
        <p className="text-xs font-mono text-zinc-600 uppercase">CAUTION: This data is predictive based on AI training trajectories.</p>
        <div className="flex gap-4">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-800"></div>
          <div className="h-2 w-2 rounded-full bg-zinc-800"></div>
        </div>
      </footer>

      <AnimatePresence>
        {showHowItWorks && (
          <HowItWorks onClose={() => setShowHowItWorks(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
