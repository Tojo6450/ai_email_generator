import { useState } from 'react';
import axios from 'axios';
import EmailInput from './components/EmailInput';
import EmailOutput from './components/EmailOutput';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to generate Email Reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-12">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-600 to-violet-700 -z-10 shadow-lg"></div>

      <main className="max-w-6xl mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Smart Reply AI</h1>
          <p className="text-indigo-300 text-lg">Turn messy emails into professional responses in seconds.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <EmailInput 
            emailContent={emailContent}
            setEmailContent={setEmailContent}
            tone={tone}
            setTone={setTone}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
          
          <EmailOutput 
            generatedReply={generatedReply} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;