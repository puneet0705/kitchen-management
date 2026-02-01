
import { StockItem, Category, Transaction } from './types';

export const INITIAL_STOCK: StockItem[] = [
  // GRAINS & FLOURS
  { id: '1', name: 'Premium Basmati Rice', category: 'Grains', quantity: 200, unit: 'kg', minThreshold: 50, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Whole Wheat Atta (Chakki)', category: 'Grains', quantity: 250, unit: 'kg', minThreshold: 60, lastUpdated: new Date().toISOString() },
  { id: '14', name: 'Sona Masuri Rice', category: 'Grains', quantity: 150, unit: 'kg', minThreshold: 40, lastUpdated: new Date().toISOString() },
  { id: '15', name: 'Maida (Refined Flour)', category: 'Grains', quantity: 45, unit: 'kg', minThreshold: 15, lastUpdated: new Date().toISOString() },
  { id: '16', name: 'Besan (Gram Flour)', category: 'Grains', quantity: 30, unit: 'kg', minThreshold: 10, lastUpdated: new Date().toISOString() },
  { id: '17', name: 'Suji (Semolina)', category: 'Grains', quantity: 25, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString() },
  
  // PULSES (DALS)
  { id: '4', name: 'Tur Dal (Arhar)', category: 'Grains', quantity: 40, unit: 'kg', minThreshold: 15, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Moong Dal (Yellow)', category: 'Grains', quantity: 30, unit: 'kg', minThreshold: 10, lastUpdated: new Date().toISOString() },
  { id: '18', name: 'Urad Dal (White)', category: 'Grains', quantity: 20, unit: 'kg', minThreshold: 8, lastUpdated: new Date().toISOString() },
  { id: '19', name: 'Chana Dal', category: 'Grains', quantity: 35, unit: 'kg', minThreshold: 12, lastUpdated: new Date().toISOString() },
  { id: '20', name: 'Masoor Dal (Red)', category: 'Grains', quantity: 15, unit: 'kg', minThreshold: 5, lastUpdated: new Date().toISOString() },
  { id: '21', name: 'Kabuli Chana', category: 'Grains', quantity: 25, unit: 'kg', minThreshold: 10, lastUpdated: new Date().toISOString() },
  { id: '22', name: 'Rajma (Chitra)', category: 'Grains', quantity: 18, unit: 'kg', minThreshold: 5, lastUpdated: new Date().toISOString() },

  // OILS & GHEE
  { id: '6', name: 'Pure Desi Ghee', category: 'Oil & Ghee', quantity: 35, unit: 'Liters', minThreshold: 12, lastUpdated: new Date().toISOString() },
  { id: '7', name: 'Refined Sunflower Oil', category: 'Oil & Ghee', quantity: 50, unit: 'Liters', minThreshold: 15, lastUpdated: new Date().toISOString() },
  { id: '23', name: 'Mustard Oil (Kacchi Ghani)', category: 'Oil & Ghee', quantity: 20, unit: 'Liters', minThreshold: 8, lastUpdated: new Date().toISOString() },
  { id: '24', name: 'Groundnut Oil', category: 'Oil & Ghee', quantity: 15, unit: 'Liters', minThreshold: 5, lastUpdated: new Date().toISOString() },

  // SPICES (MASALA)
  { id: '11', name: 'Turmeric Powder', category: 'Spices', quantity: 8, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString() },
  { id: '12', name: 'Kashmiri Red Chili Powder', category: 'Spices', quantity: 10, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString() },
  { id: '13', name: 'Cumin Seeds (Jeera)', category: 'Spices', quantity: 4, unit: 'kg', minThreshold: 1.5, lastUpdated: new Date().toISOString() },
  { id: '8', name: 'Common Iodized Salt', category: 'Spices', quantity: 15, unit: 'kg', minThreshold: 5, lastUpdated: new Date().toISOString() },
  { id: '25', name: 'Coriander Powder (Dhania)', category: 'Spices', quantity: 6, unit: 'kg', minThreshold: 2, lastUpdated: new Date().toISOString() },
  { id: '26', name: 'Black Pepper Whole', category: 'Spices', quantity: 2, unit: 'kg', minThreshold: 0.5, lastUpdated: new Date().toISOString() },
  { id: '27', name: 'Cardamom (Green)', category: 'Spices', quantity: 1, unit: 'kg', minThreshold: 0.2, lastUpdated: new Date().toISOString() },
  { id: '28', name: 'Cinnamon Sticks', category: 'Spices', quantity: 1.5, unit: 'kg', minThreshold: 0.3, lastUpdated: new Date().toISOString() },
  { id: '29', name: 'Cloves (Laung)', category: 'Spices', quantity: 0.8, unit: 'kg', minThreshold: 0.2, lastUpdated: new Date().toISOString() },
  { id: '30', name: 'Garam Masala (Special)', category: 'Spices', quantity: 3, unit: 'kg', minThreshold: 1, lastUpdated: new Date().toISOString() },

  // BEVERAGES & SWEETENERS
  { id: '3', name: 'Refined White Sugar', category: 'Miscellaneous', quantity: 100, unit: 'kg', minThreshold: 30, lastUpdated: new Date().toISOString() },
  { id: '9', name: 'Premium Tea Leaves', category: 'Miscellaneous', quantity: 12, unit: 'kg', minThreshold: 4, lastUpdated: new Date().toISOString() },
  { id: '10', name: 'Instant Coffee Powder', category: 'Miscellaneous', quantity: 5, unit: 'kg', minThreshold: 2, lastUpdated: new Date().toISOString() },
  { id: '31', name: 'Jaggery Powder', category: 'Miscellaneous', quantity: 10, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString() },
  { id: '32', name: 'Green Tea Bags', category: 'Miscellaneous', quantity: 500, unit: 'units', minThreshold: 100, lastUpdated: new Date().toISOString() },

  // DRY FRUITS
  { id: '33', name: 'Cashew Nuts (W240)', category: 'Fruits', quantity: 10, unit: 'kg', minThreshold: 3, lastUpdated: new Date().toISOString() },
  { id: '34', name: 'Almonds (California)', category: 'Fruits', quantity: 8, unit: 'kg', minThreshold: 2, lastUpdated: new Date().toISOString() },
  { id: '35', name: 'Raisins (Kishmish)', category: 'Fruits', quantity: 5, unit: 'kg', minThreshold: 1, lastUpdated: new Date().toISOString() },
  { id: '36', name: 'Walnuts (Shelled)', category: 'Fruits', quantity: 4, unit: 'kg', minThreshold: 1, lastUpdated: new Date().toISOString() },

  // CLEANING SUPPLIES (ADMIN CATEGORY)
  { id: '37', name: 'Dishwash Liquid', category: 'Miscellaneous', quantity: 25, unit: 'Liters', minThreshold: 10, lastUpdated: new Date().toISOString() },
  { id: '38', name: 'Floor Cleaner (Phenyl)', category: 'Miscellaneous', quantity: 40, unit: 'Liters', minThreshold: 10, lastUpdated: new Date().toISOString() },
  { id: '39', name: 'Kitchen Napkins', category: 'Miscellaneous', quantity: 100, unit: 'units', minThreshold: 20, lastUpdated: new Date().toISOString() },
  { id: '40', name: 'Liquid Handwash', category: 'Miscellaneous', quantity: 15, unit: 'Liters', minThreshold: 5, lastUpdated: new Date().toISOString() },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', itemId: '1', itemName: 'Premium Basmati Rice', type: 'ADD', amount: 50, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), reason: 'Quarterly Procurement' },
  { id: 't2', itemId: '1', itemName: 'Premium Basmati Rice', type: 'WITHDRAW', amount: 15, timestamp: new Date(Date.now() - 86400000).toISOString(), reason: 'State Guest Luncheon' },
  { id: 't3', itemId: '6', itemName: 'Pure Desi Ghee', type: 'ADD', amount: 10, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), reason: 'Regular Restock' },
];

export const CATEGORIES: Category[] = [
  'Grains', 'Spices', 'Vegetables', 'Dairy', 'Meat', 'Oil & Ghee', 'Fruits', 'Miscellaneous'
];
