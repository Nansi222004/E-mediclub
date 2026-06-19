// pharmacyVendorMockData.js
// Backwards compatibility layer mapping legacy exports to the new single source of truth

export { 
  orders as mockOrders, 
  prescriptions as mockPrescriptions, 
  inventory as mockInventory, 
  customers, 
  reviews, 
  dashboardStats, 
  getTodayRevenue, 
  getMonthlyRevenue, 
  getTodayOrders, 
  getPendingOrders, 
  getPrescriptionOrders, 
  getOutOfStockItems, 
  getLowStockItems, 
  getAverageRating, 
  getTotalCustomers,
  getOrderSummary
} from '../../../data/pharmacyVendorData';
