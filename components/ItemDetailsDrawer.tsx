
import React from 'react';
import { StockItem, Transaction, TransactionType } from '../types';

interface ItemDetailsDrawerProps {
  item: StockItem;
  history: Transaction[];
  onClose: () => void;
  onAction: (type: TransactionType) => void;
}

const ItemDetailsDrawer: React.FC<ItemDetailsDrawerProps> = ({ item, history, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-drawer-enter overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-600 rounded flex items-center justify-center shadow-lg ring-1 ring-amber-400">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
               </div>
               <div>
                 <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">{item.name}</h3>
                 <span className="text-xs font-black text-amber-500 uppercase tracking-widest">{item.category}</span>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded transition-colors">
              <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Inventory</p>
              <p className="text-xl font-black text-white">{item.quantity} {item.unit}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Status</p>
              <p className={`text-xl font-black ${item.quantity <= item.minThreshold ? 'text-red-400' : 'text-emerald-400'}`}>
                {item.quantity <= item.minThreshold ? 'CRITICAL' : 'NOMINAL'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8">
          {/* Quick Actions Section */}
          <section>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              त्वरित कार्रवाई (Quick Actions)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onAction('ADD')}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                स्टॉक जोड़ें
              </button>
              <button 
                onClick={() => onAction('WITHDRAW')}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"/></svg>
                निकासी करें
              </button>
            </div>
          </section>

          {/* Audit Trail Section */}
          <section>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Audit Trail (Last 5 Logs)
            </h4>

            {history.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">No prior logs found.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {history.map((tx) => (
                  <div key={tx.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${tx.type === 'ADD' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-black uppercase tracking-widest ${tx.type === 'ADD' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'ADD' ? 'Entry' : 'Removal'}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-800 mb-1">
                      {tx.type === 'ADD' ? '+' : '-'}{tx.amount} {item.unit}
                    </p>
                    <p className="text-sm text-slate-500 italic leading-relaxed">{tx.reason || 'Routine movement'}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white text-sm font-black py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-[0.98] uppercase tracking-widest"
          >
            Acknowledge Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsDrawer;
