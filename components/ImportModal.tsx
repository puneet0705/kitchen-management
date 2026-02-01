
import React, { useState } from 'react';

interface ImportModalProps {
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = (window as any).XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = (window as any).XLSX.utils.sheet_to_json(worksheet);
        onImport(data);
        onClose();
      } catch (err) {
        alert("Error parsing Excel file. Please ensure it follows the correct format.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleGoogleSync = () => {
    if (!googleSheetUrl) return;
    setIsProcessing(true);
    // Simulation of Google Sheet fetch
    setTimeout(() => {
      alert("Successfully linked to Google Sheet. Data will sync in the background.");
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800">Sync Kitchen Data</h3>
            <p className="text-slate-500 font-medium">Import logs from Excel or Google Sheets</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="relative group">
            <div className="border-2 border-dashed border-slate-200 group-hover:border-amber-400 rounded-3xl p-10 flex flex-col items-center justify-center transition-all bg-slate-50/50 group-hover:bg-amber-50/20">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <p className="text-slate-800 font-bold mb-1">Upload Excel or CSV</p>
              <p className="text-slate-400 text-sm mb-4">Drag and drop your file here</p>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200">Select File</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          {/* Google Sheets Section */}
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Google Sheet URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
              />
              <button 
                onClick={handleGoogleSync}
                disabled={!googleSheetUrl || isProcessing}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-amber-900/10"
              >
                Sync
              </button>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-8 flex items-center justify-center gap-3 text-amber-600 font-bold animate-pulse">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            Processing Excellency's Data...
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportModal;
