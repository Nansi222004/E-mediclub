// src/data/pharmacyVendorData.js

const getTodayStr = () => new Date().toISOString().substring(0, 10);

// 120 orders in total
export const orders = Array.from({ length: 120 }, (_, i) => {
  const isToday = i < 48; // first 48 are today
  const isPending = i < 12; // first 12 are pending
  
  // Status mapping
  let status = 'Delivered';
  if (isPending) {
    status = i % 2 === 0 ? 'New Orders' : 'Accepted Orders';
  } else if (i < 30) {
    status = i % 3 === 0 ? 'Processing' : (i % 3 === 1 ? 'Ready for Dispatch' : 'Out for Delivery');
  } else {
    if (i % 25 === 0) status = 'Cancelled';
    else if (i % 25 === 1) status = 'Returns';
    else if (i % 25 === 2) status = 'Refund Requests';
    else if (i % 25 === 3) status = 'Replacement Requests';
    else status = 'Delivered';
  }

  // Payment status
  let paymentStatus = 'Paid';
  if (status === 'Cancelled') paymentStatus = 'Unpaid';
  else if (status === 'Refund Requests') paymentStatus = 'Refunded';

  // We want today's PAID orders (36 orders since 12 are pending) to sum to exactly 4280.50
  // We want other month paid orders (72 orders) to sum to exactly 98169.50
  // Today's paid orders: i between 12 and 47 (36 items)
  // Monthly paid orders: all paid orders (excluding cancelled/refunded/pending)
  let totalAmount = 100;
  if (isToday) {
    if (!isPending && paymentStatus === 'Paid') {
      totalAmount = 4280.50 / 36;
    } else {
      totalAmount = 150; // pending or unpaid today orders
    }
  } else {
    if (paymentStatus === 'Paid') {
      totalAmount = 98169.50 / 68; // there are 72 orders, say 68 are paid
    } else {
      totalAmount = 200;
    }
  }

  return {
    id: `OD-892${100 + i}`,
    customerName: ['Rahul Mehta', 'Sara Jacob', 'Karan Singh', 'Anita Desai', 'Vikram Sharma', 'Sneha Kapoor', 'Johnathan Doe', 'Emily Davis'][i % 8],
    phone: `+91 98765 ${43210 + i}`,
    address: `${100 + i}, Galaxy Apartments, Sector ${i % 10 + 1}, Metro City`,
    products: [
      { name: 'Amoxicillin 500mg Capsules', qty: 2, price: Math.round(totalAmount * 0.4), image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=80&q=80' },
      { name: 'Paracetamol 650mg Tablets', qty: 1, price: Math.round(totalAmount * 0.6), image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=80&q=80' }
    ],
    paymentMethod: i % 2 === 0 ? 'UPI (Paytm)' : 'Credit Card',
    paymentStatus: paymentStatus,
    prescriptionRequired: i % 3 === 0,
    prescriptionImage: i % 3 === 0 ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' : '',
    prescriptionStatus: i % 3 === 0 ? (i % 2 === 0 ? 'Verified & Approved' : 'Pending Verification') : 'N/A',
    orderDate: isToday ? getTodayStr() : new Date(Date.now() - 24 * 3600 * 1000 * (i - 47)).toISOString().substring(0, 10),
    orderTime: '10:00 AM',
    status: status,
    totalAmount: Math.round(totalAmount * 100) / 100,
    discount: 0,
    deliveryPartner: status === 'Delivered' || status === 'Out for Delivery' ? 'Shadowfax Express' : '',
    deliveryStatus: status === 'Delivered' ? 'Delivered' : (status === 'Out for Delivery' ? 'In Transit' : ''),
    expectedDelivery: '',
    cancellationReason: status === 'Cancelled' ? 'Out of stock formulation' : '',
    cancelledBy: status === 'Cancelled' ? 'Merchant' : '',
    returnRequestDate: status === 'Returns' ? getTodayStr() : '',
    returnReason: status === 'Returns' ? 'Ordered wrong medicine' : '',
    returnStatus: status === 'Returns' ? 'Awaiting Approval' : '',
    refundAmount: status === 'Refund Requests' ? totalAmount : 0,
    refundMethod: status === 'Refund Requests' ? 'Original Source' : '',
    refundStatus: status === 'Refund Requests' ? 'Processing' : '',
    internalNotes: '',
    isToday: isToday,
    timeline: [
      { time: '10:00 AM', status: 'Order Placed', description: 'Order placed by patient.' }
    ]
  };
});

// 15 prescriptions
export const prescriptions = Array.from({ length: 15 }, (_, i) => {
  let rxStatus = 'NEW';
  if (i < 3) rxStatus = 'NEW';
  else if (i < 6) rxStatus = 'AI_PARSED';
  else if (i < 8) rxStatus = 'REVIEW_REQUIRED';
  else if (i < 12) rxStatus = 'MEDICINE_MATCHED';
  else rxStatus = 'CUSTOMER_CART_UPDATED';

  return {
    prescriptionId: `RX-771${100 + i}`,
    customerId: `cust-10${i}`,
    customerName: ['Rahul Mehta', 'Sara Jacob', 'Karan Singh', 'Anita Desai', 'Vikram Sharma', 'Sneha Kapoor', 'Johnathan Doe', 'Emily Davis'][i % 8],
    uploadedTime: `${i + 2} mins ago`,
    prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    status: rxStatus,
    rejectionReason: '',
    extractedMedicines: [
      { name: 'Amoxicillin 500mg', quantity: 10, confidenceScore: 95, matchedMedicineId: 'cat-1', variantId: '10 tablets', price: 164, stock: 45, matched: true }
    ]
  };
});

// Inventory: 12 out of stock, 45 low stock, 50 in stock
export const inventory = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `MED-100${i}`,
    name: `Out of Stock Medicine ${i + 1}`,
    stock: 0,
    reorderLevel: 10,
    category: 'Essential',
    price: 150 + (i * 20),
    status: 'Out of Stock',
    sku: `SKU-OUT-${1000 + i}`,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  })),
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `MED-200${i}`,
    name: `Low Stock Medicine ${i + 1}`,
    stock: Math.floor(i % 5) + 1, // 1 to 5
    reorderLevel: 10,
    category: 'General',
    price: 80 + (i * 10),
    status: 'Low Stock',
    sku: `SKU-LOW-${2000 + i}`,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `MED-300${i}`,
    name: `Healthy Medicine ${i + 1}`,
    stock: 50 + i,
    reorderLevel: 10,
    category: 'Cardiac',
    price: 200 + (i * 5),
    status: 'In Stock',
    sku: `SKU-HLTH-${3000 + i}`,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  }))
];

// 1840 Customers
export const customers = Array.from({ length: 1840 }, (_, i) => {
  const isFrequent = i < 8; // detail list shows first 8
  return {
    id: `CUST-00${i + 1}`,
    name: ['Rahul Mehta', 'Sara Jacob', 'Karan Singh', 'Anita Desai', 'Vikram Sharma', 'Sneha Kapoor', 'Amit K.', 'Megha Patel'][i % 8] + (i >= 8 ? ` ${i}` : ''),
    email: `customer.${i}@gmail.com`,
    phone: `+91 98765 ${50000 + i}`,
    totalOrders: isFrequent ? (14 - (i % 5) * 2) : 2,
    totalSpent: isFrequent ? (12400 - (i % 5) * 1500) : 350,
    city: ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad'][i % 5],
    lastActive: `${i % 20 + 1} days ago`,
    loyaltyTier: i % 3 === 0 ? 'Platinum' : (i % 3 === 1 ? 'Gold' : 'Silver')
  };
});

// 320 reviews. Average rating must be exactly 4.8.
// 256 * 5 + 64 * 4 = 1536. 1536 / 320 = 4.8.
export const reviews = [
  ...Array.from({ length: 256 }, () => ({ rating: 5 })),
  ...Array.from({ length: 64 }, () => ({ rating: 4 }))
];

// Calculation Helpers
export const getTodayRevenue = (data = orders) => {
  const todayStr = getTodayStr();
  return data
    .filter(o => o.orderDate === todayStr && o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
};

export const getMonthlyRevenue = (data = orders) => {
  const currentMonth = getTodayStr().substring(0, 7); // 'YYYY-MM'
  return data
    .filter(o => o.orderDate.startsWith(currentMonth) && o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
};

export const getTodayOrders = (data = orders) => {
  const todayStr = getTodayStr();
  return data.filter(o => o.orderDate === todayStr);
};

export const getPendingOrders = (data = orders) => {
  return data.filter(o => o.status === 'New Orders' || o.status === 'Accepted Orders');
};

export const getPrescriptionOrders = (data = prescriptions) => {
  // filtered by status pending/verified
  // 'NEW', 'AI_PARSED', 'REVIEW_REQUIRED', 'MEDICINE_MATCHED', 'CUSTOMER_CART_UPDATED' are all active / pending conversion
  return data.filter(p => p.status !== 'ORDER_CREATED' && p.status !== 'REJECTED');
};

export const getOutOfStockItems = (data = inventory) => {
  return data.filter(item => item.stock === 0);
};

export const getLowStockItems = (data = inventory) => {
  return data.filter(item => item.stock > 0 && item.stock <= item.reorderLevel);
};

export const getAverageRating = (data = reviews) => {
  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  return data.length ? Math.round((sum / data.length) * 10) / 10 : 0;
};

export const getTotalCustomers = (data = customers) => {
  return data.length;
};

export const getOrderSummary = (data = orders) => {
  const newOrders = data.filter(o => o.status === 'New Orders').length;
  const processing = data.filter(o => o.status === 'Processing').length;
  const readyToShip = data.filter(o => o.status === 'Ready for Dispatch').length;
  const delivered = data.filter(o => o.status === 'Delivered').length;
  const cancelled = data.filter(o => o.status === 'Cancelled').length;
  
  const total = newOrders + processing + readyToShip + delivered + cancelled || 1;
  const fulfillmentPercent = Math.round((delivered / total) * 100);
  
  return {
    newOrders,
    processing,
    readyToShip,
    delivered,
    cancelled,
    fulfillmentPercent
  };
};

export const dashboardStats = {
  get revenueToday() { return getTodayRevenue(); },
  get revenueMonth() { return getMonthlyRevenue(); },
  get todayOrders() { return getTodayOrders().length; },
  get pendingOrders() { return getPendingOrders().length; },
  get prescriptionOrders() { return getPrescriptionOrders().length; },
  get outOfStock() { return getOutOfStockItems().length; },
  get lowStock() { return getLowStockItems().length; }
};
