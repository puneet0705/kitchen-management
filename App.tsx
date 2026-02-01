
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StockItem, Transaction, IntelligenceTip, TransactionType, Category } from './types';
import { INITIAL_STOCK, INITIAL_TRANSACTIONS, CATEGORIES } from './constants';
import StockForm from './components/StockForm';
import GeminiChat from './components/GeminiChat';
import ImportModal from './components/ImportModal';
import ItemDetailsDrawer from './components/ItemDetailsDrawer';
import { getIntelligenceTips } from './services/geminiService';

const App: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [tips, setTips] = useState<IntelligenceTip[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<TransactionType>('ADD');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshingTips, setIsRefreshingTips] = useState(false);

  const fetchTips = useCallback(async (currentStock: StockItem[]) => {
    setIsRefreshingTips(true);
    // For large datasets, we only send critical items to AI to avoid token limits
    const criticalItems = currentStock.filter(i => i.quantity <= i.minThreshold).slice(0, 50);
    const result = await getIntelligenceTips(criticalItems.length > 0 ? criticalItems : currentStock.slice(0, 50));
    setTips(result);
    setIsRefreshingTips(false);
  }, []);

  useEffect(() => {
    fetchTips(stock);
  }, []);

  const handleTransaction = (data: { itemId: string; amount: number; type: TransactionType; reason: string }) => {
    const item = stock.find(i => i.id === data.itemId);
    if (!item) return;

    if (data.type === 'WITHDRAW' && item.quantity < data.amount) {
      alert("Error: Withdrawal exceeds current available stock for " + item.name);
      return;
    }

    const newQuantity = data.type === 'ADD' 
      ? item.quantity + data.amount 
      : item.quantity - data.amount;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: data.itemId,
      itemName: item.name,
      type: data.type,
      amount: data.amount,
      timestamp: new Date().toISOString(),
      reason: data.reason
    };

    const updatedStock = stock.map(i => i.id === data.itemId ? { ...i, quantity: newQuantity, lastUpdated: new Date().toISOString() } : i);
    setStock(updatedStock);
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (selectedItem?.id === data.itemId) {
        setSelectedItem(updatedStock.find(i => i.id === data.itemId) || null);
    }

    // Refresh tips periodically
    if (transactions.length % 5 === 0) {
      fetchTips(updatedStock);
    }
  };

  const handleQuickAction = (type: TransactionType) => {
    setFormType(type);
    setIsFormOpen(true);
  };

  const handleBulkImport = (data: any[]) => {
    const findKey = (row: any, patterns: string[]) => {
      const keys = Object.keys(row);
      return keys.find(k => patterns.some(p => k.toLowerCase().includes(p.toLowerCase())));
    };

    const importedItems: StockItem[] = data.map((row, index) => {
      const nameKey = findKey(row, ['name', 'nomenclature', 'particulars', 'item', 'description', 'label']);
      const catKey = findKey(row, ['category', 'group', 'type', 'class', 'department']);
      const qtyKey = findKey(row, ['qty', 'quantity', 'balance', 'stock', 'opening', 'available', 'amount']);
      const unitKey = findKey(row, ['unit', 'uom', 'measure', 'packaging']);
      const minKey = findKey(row, ['min', 'threshold', 'buffer', 'reorder', 'limit']);

      const name = nameKey ? String(row[nameKey]) : 'Unknown Item';
      const catRaw = catKey ? String(row[catKey]) : 'Miscellaneous';
      const qty = qtyKey ? parseFloat(String(row[qtyKey]).replace(/[^0-9.]/g, '')) : 0;
      const unit = unitKey ? String(row[unitKey]) : 'kg';
      const min = minKey ? parseFloat(String(row[minKey]).replace(/[^0-9.]/g, '')) : 10;

      const category = (CATEGORIES.find(c => catRaw.toLowerCase().includes(c.toLowerCase())) || 'Miscellaneous') as Category;

      return {
        id: `import-${index}-${Date.now()}`,
        name: name.trim(),
        category,
        quantity: isNaN(qty) ? 0 : qty,
        unit: unit.trim() || 'kg',
        minThreshold: isNaN(min) ? 10 : min,
        lastUpdated: new Date().toISOString()
      };
    }).filter(item => item.name !== 'Unknown Item');

    if (importedItems.length > 0) {
      setStock(importedItems);
      fetchTips(importedItems);
      alert(`Success: ${importedItems.length} records processed and ledger updated.`);
    } else {
      alert("Format Error: System could not identify 'Name' or 'Quantity' columns in the uploaded file.");
    }
  };

  const filteredStock = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return stock
      .filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aCritical = a.quantity <= a.minThreshold;
        const bCritical = b.quantity <= b.minThreshold;
        if (aCritical && !bCritical) return -1;
        if (!aCritical && bCritical) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [stock, searchQuery]);

  const lowStockCount = useMemo(() => stock.filter(i => i.quantity <= i.minThreshold).length, [stock]);

  const selectedItemHistory = useMemo(() => {
    if (!selectedItem) return [];
    return transactions
      .filter(tx => tx.itemId === selectedItem.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [selectedItem, transactions]);

  return (
    <div className="min-h-screen bg-slate-100/50">
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-[100] border-b border-amber-600">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight leading-none uppercase">RAJBHAVAN <span className="text-amber-500 font-bold ml-1">KITCHEN LOGISTICS</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Government of India • Inventory Division</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsImportOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-4 py-2 rounded font-black transition-all border border-slate-700 uppercase tracking-widest hidden sm:block"
            >
              Sync Data
            </button>
            <button 
              onClick={() => {
                  setSelectedItem(null);
                  setFormType('ADD');
                  setIsFormOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-xs text-white px-5 py-2 rounded font-black transition-all shadow-sm border-b-2 border-amber-800 uppercase tracking-widest"
            >
              New Entry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total SKU</p>
                <h4 className="text-2xl lg:text-3xl font-black text-slate-900">{stock.length}</h4>
              </div>
              <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm ring-1 ring-red-50">
                <p className="text-xs font-black text-red-400 uppercase tracking-widest leading-none mb-2">Low Stock</p>
                <h4 className="text-2xl lg:text-3xl font-black text-red-600">{lowStockCount}</h4>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Logs</p>
                <h4 className="text-2xl lg:text-3xl font-black text-slate-900">{transactions.length}</h4>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50/50 gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded font-black text-xs tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >INVENTORY</button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded font-black text-xs tracking-widest transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >HISTORY</button>
                </div>

                <div className="relative w-full md:w-auto">
                  <input 
                    type="text"
                    placeholder="Search nomenclature..."
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-amber-500/20 w-full md:w-72 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
              </div>

              <div className="overflow-x-auto h-[550px] border-b border-slate-100">
                {activeTab === 'inventory' ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest font-black sticky top-0 z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Nomenclature</th>
                        <th className="px-6 py-4 text-center">Balance</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Last Movement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStock.map(item => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedItem(item)}
                          className={`group cursor-pointer hover:bg-slate-50 transition-all ${item.quantity <= item.minThreshold ? 'bg-red-50/30' : ''}`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-base">{item.name}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="font-mono font-bold text-slate-700 text-sm bg-slate-100 px-3 py-1 rounded border border-slate-200">
                              {item.quantity} {item.unit}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            {item.quantity <= item.minThreshold ? (
                              <span className="inline-flex px-3 py-1 bg-red-600 text-white rounded text-xs font-black uppercase tracking-widest shadow-sm">
                                ALERT
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-black uppercase tracking-widest border border-slate-200">
                                NOMINAL
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right text-xs text-slate-400 font-bold uppercase">
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest font-black sticky top-0 z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Item Name</th>
                        <th className="px-6 py-4 text-center">Type</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5 text-slate-500 whitespace-nowrap">
                            {new Date(tx.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-800">{tx.itemName}</td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${tx.type === 'ADD' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center font-mono font-bold text-slate-700">{tx.amount}</td>
                          <td className="px-6 py-5 text-slate-500 italic max-w-xs truncate">{tx.reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-slate-900 border-b border-amber-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <h3 className="font-black text-white uppercase tracking-widest text-xs">इन्वेंट्री इंटेलिजेंस (AI)</h3>
                </div>
                <button onClick={() => fetchTips(stock)} disabled={isRefreshingTips} className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white">
                  <svg className={`w-4 h-4 ${isRefreshingTips ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
              </div>
              <div className="p-4 space-y-3">
                {tips.length === 0 ? (
                  <div className="py-6 text-center animate-pulse text-slate-300 font-bold text-xs uppercase tracking-widest">विश्लेषण हो रहा है...</div>
                ) : (
                  tips.map((tip, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                      tip.type === 'WARNING' ? 'bg-red-50 border-l-red-500 text-red-900 ring-1 ring-red-100' : 
                      tip.type === 'SUCCESS' ? 'bg-emerald-50 border-l-emerald-500 text-emerald-900 ring-1 ring-emerald-100' : 
                      'bg-slate-50 border-l-amber-600 text-slate-900 ring-1 ring-slate-200'
                    }`}>
                      <h4 className="text-sm font-black uppercase tracking-wide mb-1.5">{tip.title}</h4>
                      <p className="text-sm leading-relaxed font-medium opacity-90">{tip.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <GeminiChat stock={stock} transactions={transactions} />
          </div>
        </div>
      </main>

      {isFormOpen && (
        <StockForm 
          items={stock} 
          initialItemId={selectedItem?.id} 
          defaultType={formType}
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleTransaction} 
        />
      )}
      {isImportOpen && <ImportModal onClose={() => setIsImportOpen(false)} onImport={handleBulkImport} />}
      {selectedItem && (
        <ItemDetailsDrawer 
          item={selectedItem} 
          history={selectedItemHistory} 
          onClose={() => setSelectedItem(null)} 
          onAction={handleQuickAction}
        />
      )}
    </div>
  );
};

export default App;
