import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const EmailOutput = ({ generatedReply }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!generatedReply) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white/50">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 className="text-slate-500 font-medium">No reply generated yet</h3>
        <p className="text-slate-400 text-sm mt-1">Submit the form to see the AI suggestion.</p>
      </div>
    );
  }

  return (
    <section className="bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100 min-h-[400px] flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Suggested Reply</h2>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
        >
          {copied ? 'Copied!' : 'Copy Reply'}
        </button>
      </div>
      
      <textarea
        readOnly
        className="flex-grow w-full bg-transparent border-none focus:ring-0 text-slate-300 leading-relaxed resize-none text-lg overflow-y-auto"
        value={generatedReply}
      />
      
      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-semibold">
        AI Generated • Review before sending
      </div>
    </section>
  );
};

export default EmailOutput;