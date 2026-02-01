
import React, { useState, useEffect } from 'react';
import { StockItem, TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants';

interface StockFormProps {
  items: StockItem[];
  onSubmit: (data: { itemId: string; amount: number; type: TransactionType; reason: string }) => void;
  onClose: () => void;
  defaultType?: TransactionType;
  initialItemId?: string;
}

const StockForm: React.FC<StockFormProps> = ({ items, onSubmit, onClose, defaultType = 'ADD', initialItemId }) => {
  const [selectedItemId, setSelectedItemId] = useState(initialItemId || items[0]?.id || '');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>(defaultType);
  const [reason, setReason] = useState('');

  // Sync state if initial props change
  useEffect(() => {
    if (initialItemId) {
        setSelectedItemId(initialItemId);
    }
    setType(defaultType);
  }, [initialItemId, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || amount <= 0) return;
    onSubmit({ itemId: selectedItemId, amount, type, reason });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {type === 'ADD' ? 'Restock Item (प्रविष्टि)' : 'Withdraw Stock (निकासी)'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">वस्तु चुनें (Select Item)</label>
            <select 
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              disabled={!!initialItemId} // Disable if we came from item drawer
              className={`w-full rounded-xl border-slate-200 p-4 text-base font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none border shadow-sm ${!!initialItemId ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-slate-50'}`}
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name} ({item.quantity} {item.unit} available)</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">मात्रा (Amount)</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-base font-bold focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none border shadow-sm"
                required
                min="0.1"
                step="0.1"
                autoFocus
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">प्रकार (Type)</label>
              <div className="flex p-1.5 bg-slate-100 rounded-xl h-[60px]">
                <button
                  type="button"
                  onClick={() => setType('ADD')}
                  className={`flex-1 py-1 px-4 rounded-lg text-sm font-black transition-all ${type === 'ADD' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >प्रविष्टि</button>
                <button
                  type="button"
                  onClick={() => setType('WITHDRAW')}
                  className={`flex-1 py-1 px-4 rounded-lg text-sm font-black transition-all ${type === 'WITHDRAW' ? 'bg-white shadow-md text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >निकासी</button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-2">विवरण (Reason / Note)</label>
            <input 
              type="text"
              placeholder="उदा: वीआईपी डिनर, मासिक आपूर्ति"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-base font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none border shadow-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-5 rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-200 mt-6 text-base uppercase tracking-widest"
          >
            लेनदेन की पुष्टि करें (Confirm)
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
