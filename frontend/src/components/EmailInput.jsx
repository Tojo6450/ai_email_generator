// eslint-disable-next-line react/prop-types
const EmailInput = ({ emailContent, setEmailContent, tone, setTone, onSubmit, loading, error }) => {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-slate-800">Compose</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Original Email
          </label>
          <textarea
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none min-h-[200px]"
            placeholder="Paste the email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2">Desired Tone</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="">Default (Auto)</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <button
            onClick={onSubmit}
            disabled={!emailContent || loading}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Generate"}
          </button>
        </div>

        {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      </div>
    </section>
  );
};

export default EmailInput;