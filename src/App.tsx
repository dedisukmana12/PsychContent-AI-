/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Brain, 
  PenTool, 
  Palette, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  ChevronRight,
  Hash,
  MessageSquare,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for the structured response
interface ContentOutput {
  ideMaster: {
    titles: string[];
    description: string;
    metaPrompt: string;
  };
  scriptWriter: {
    hook: string;
    script: string;
    hashtags: string[];
  };
  desainPrompter: {
    imagePrompt: string;
    styleGuide: string;
    transitions: string;
  };
}

const API_KEY = process.env.GEMINI_API_KEY;

export default function App() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateContent = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const genAI = new GoogleGenAI({ apiKey: API_KEY });
      const model = "gemini-3.1-pro-preview";

      const prompt = `
        Kamu adalah bos tim konten psikologi profesional. Niche: dark psychology, tips & tricks dark psychology, psychology, self-help, self-awareness, self-improvement, self-development, motivasi, how-to.
        
        Tugas kamu adalah memproses topik berikut: "${topic}" menggunakan 3 agen spesialis:
        
        1. Agen 1: IdeMaster – Spesialis ide & riset: Buat 5 judul viral (clickbait tapi edukatif), deskripsi singkat topik, dan meta prompt super detail.
        2. Agen 2: ScriptWriter – Spesialis copywriting: Dari ide Agen 1, buat hook pembuka menarik (3-5 kalimat), script teks edukasi pendek (150-300 kata, bahasa Indonesia santai tapi informatif), dan 8-12 hashtag relevan.
        3. Agen 3: DesainPrompter – Spesialis visual: Buat prompt gambar/infografis detail (tema dark misterius, warna hitam/navy/merah tua, gaya minimalis, teks overlay besar bold, ikon psikologi, layout vertikal), dan saran transisi.
        
        Output harus dalam format JSON sesuai schema yang ditentukan.
      `;

      const response = await genAI.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideMaster: {
                type: Type.OBJECT,
                properties: {
                  titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  metaPrompt: { type: Type.STRING }
                },
                required: ["titles", "description", "metaPrompt"]
              },
              scriptWriter: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  script: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["hook", "script", "hashtags"]
              },
              desainPrompter: {
                type: Type.OBJECT,
                properties: {
                  imagePrompt: { type: Type.STRING },
                  styleGuide: { type: Type.STRING },
                  transitions: { type: Type.STRING }
                },
                required: ["imagePrompt", "styleGuide", "transitions"]
              }
            },
            required: ["ideMaster", "scriptWriter", "desainPrompter"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}") as ContentOutput;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Gagal menghasilkan konten. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 font-sans selection:bg-red-900/30">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-navy-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-red-900/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4"
          >
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium tracking-wider uppercase text-slate-400">Psychology Content Engine</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 italic"
          >
            PsychContent <span className="text-red-600">AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-xl mx-auto text-lg"
          >
            Asisten profesional untuk konten Dark Psychology & Self-Improvement.
          </motion.p>
        </header>

        {/* Input Section */}
        <section className="mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 to-navy-900/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0a0d14] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Masukkan topik (misal: trik manipulasi positif...)"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-900/50 transition-all placeholder:text-slate-600 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && generateContent()}
                  />
                </div>
                <button
                  onClick={generateContent}
                  disabled={isLoading || !topic.trim()}
                  className="bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-red-500 text-sm text-center font-medium">{error}</p>
          )}
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Agent 1: IdeMaster */}
              <div className="bg-[#0a0d14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/5 px-6 py-4 border-bottom border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Agen 1: IdeMaster</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Ide & Riset</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(result.ideMaster, null, 2), 'ide')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                  >
                    {copiedSection === 'ide' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">5 Judul Viral</h4>
                    <ul className="space-y-2">
                      {result.ideMaster.titles.map((title, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300 group">
                          <span className="text-red-500 font-mono text-sm mt-0.5">{i + 1}.</span>
                          <span className="group-hover:text-white transition-colors">{title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Deskripsi Topik</h4>
                    <p className="text-slate-400 leading-relaxed">{result.ideMaster.description}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Meta Prompt</h4>
                    <p className="text-xs font-mono text-slate-500 leading-relaxed italic">{result.ideMaster.metaPrompt}</p>
                  </div>
                </div>
              </div>

              {/* Agent 2: ScriptWriter */}
              <div className="bg-[#0a0d14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/5 px-6 py-4 border-bottom border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <PenTool className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Agen 2: ScriptWriter</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Copywriting</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`${result.scriptWriter.hook}\n\n${result.scriptWriter.script}\n\n${result.scriptWriter.hashtags.join(' ')}`, 'script')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                  >
                    {copiedSection === 'script' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-red-900/5 border-l-2 border-red-900 p-4 rounded-r-xl">
                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> Hook Pembuka
                    </h4>
                    <p className="text-white font-medium italic leading-relaxed">"{result.scriptWriter.hook}"</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Script Edukasi
                    </h4>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-black/20 p-5 rounded-xl border border-white/5">
                      {result.scriptWriter.script}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Hash className="w-3 h-3" /> Hashtag Relevan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.scriptWriter.hashtags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent 3: DesainPrompter */}
              <div className="bg-[#0a0d14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/5 px-6 py-4 border-bottom border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Palette className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Agen 3: DesainPrompter</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Visual Specialist</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(result.desainPrompter.imagePrompt, 'design')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                  >
                    {copiedSection === 'design' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Prompt Visual (Midjourney/Canva)
                    </h4>
                    <p className="text-slate-300 text-sm font-mono leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
                      {result.desainPrompter.imagePrompt}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Style Guide</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{result.desainPrompter.styleGuide}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Saran Transisi</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{result.desainPrompter.transitions}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
                      Unlock Your Mind • PsychContent AI
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-24 text-center text-slate-600 text-sm">
          <p>© 2024 PsychContent AI. Professional Content Team.</p>
        </footer>
      </main>
    </div>
  );
}
