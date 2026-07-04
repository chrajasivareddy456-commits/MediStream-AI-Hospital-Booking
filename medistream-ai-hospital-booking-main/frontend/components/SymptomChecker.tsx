
import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/gemini';
import { SymptomAnalysis, UrgencyLevel } from '../types';

interface SymptomCheckerProps {
  onRecommendation: (analysis: SymptomAnalysis) => void;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onRecommendation }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeSymptoms(symptoms);
      // Attach the original symptoms to the analysis object
      const enrichedAnalysis = { ...analysis, userSymptoms: symptoms };
      setResult(enrichedAnalysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyColor = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.EMERGENCY: return 'bg-red-100 text-red-700 border-red-200';
      case UrgencyLevel.PRIORITY: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">AI Triage</h2>
              <p className="text-slate-500 font-medium">Explain your symptoms for specialist routing.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
              <textarea
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none h-40 resize-none text-slate-700 font-medium"
                placeholder="Describe your symptoms in detail (e.g. duration, severity, location)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
            
            <div className="flex items-center bg-amber-50 p-4 rounded-xl text-amber-700 text-xs font-bold border border-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Disclaimer: This AI analysis is for routing and informational purposes only and is not a clinical diagnosis.</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !symptoms.trim()}
              className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all ${
                isAnalyzing ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-95 shadow-blue-200'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Symptoms...
                </span>
              ) : 'Run AI Analysis'}
            </button>
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold animate-in shake duration-300">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-10 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] animate-in zoom-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Analysis Complete</h3>
                <span className={`px-5 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest ${getUrgencyColor(result.urgency)}`}>
                  {result.urgency} Urgency
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Recommended Specialist</p>
                  <p className="text-2xl font-black text-blue-600 leading-none">{result.suggestedDepartment}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Triage Logic</p>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{result.reasoning}</p>
                </div>
              </div>

              <button
                onClick={() => onRecommendation(result)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all hover:shadow-xl shadow-slate-200"
              >
                Book with {result.suggestedDepartment}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
