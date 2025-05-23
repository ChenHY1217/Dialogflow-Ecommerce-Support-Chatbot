// Mock database for e-commerce chatbot
// Contains order information, shipping details, return policies, and product data

export const orders = {
  "123456": {
    customerId: "cust001",
    status: "shipped",
    orderDate: "2025-05-10",
    estimatedDelivery: "2025-05-25",
    items: ["prod001", "prod003"],
    shippingAddress: "123 Main St, Anytown, USA",
    trackingNumber: "TRK789012345"
  },
  "234567": {
    customerId: "cust002",
    status: "processing",
    orderDate: "2025-05-19",
    estimatedDelivery: "2025-05-30",
    items: ["prod002", "prod005"],
    shippingAddress: "456 Oak Ave, Somewhere, USA",
    trackingNumber: null
  },
  "345678": {
    customerId: "cust003",
    status: "delivered",
    orderDate: "2025-05-01",
    estimatedDelivery: "2025-05-15",
    items: ["prod004", "prod006", "prod007"],
    shippingAddress: "789 Pine Blvd, Nowhere, USA",
    trackingNumber: "TRK123456789",
    deliveredDate: "2025-05-14"
  },
  "456789": {
    customerId: "cust001",
    status: "cancelled",
    orderDate: "2025-04-28",
    items: ["prod001", "prod008"],
    cancellationReason: "Customer request"
  },
  "567890": {
    customerId: "cust004",
    status: "returned",
    orderDate: "2025-04-15",
    items: ["prod003"],
    returnReason: "Wrong size",
    returnStatus: "refund processed"
  }
};

export const customers = {
  "cust001": {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA"
  },
  "cust002": {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-234-5678",
    address: "456 Oak Ave, Somewhere, USA"
  },
  "cust003": {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "555-345-6789",
    address: "789 Pine Blvd, Nowhere, USA"
  },
  "cust004": {
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "555-456-7890",
    address: "101 Elm St, Elsewhere, USA"
  }
};

export const products = {
  "prod001": {
    name: "Premium Wireless Headphones",
    price: 129.99,
    category: "electronics",
    inStock: true,
    description: "High-quality wireless headphones with noise cancellation",
    relatedProducts: ["prod002", "prod008"]
  },
  "prod002": {
    name: "Bluetooth Speaker",
    price: 79.99,
    category: "electronics",
    inStock: true,
    description: "Portable wireless speaker with 20-hour battery life",
    relatedProducts: ["prod001", "prod003"]
  },
  "prod003": {
    name: "Smart Watch",
    price: 199.99,
    category: "electronics",
    inStock: false,
    description: "Fitness tracker and smartwatch with heart rate monitoring",
    relatedProducts: ["prod001", "prod007"]
  },
  "prod004": {
    name: "Cotton T-Shirt",
    price: 24.99,
    category: "clothing",
    inStock: true,
    description: "Comfortable 100% cotton t-shirt",
    availableSizes: ["S", "M", "L", "XL"],
    relatedProducts: ["prod005", "prod006"]
  },
  "prod005": {
    name: "Denim Jeans",
    price: 59.99,
    category: "clothing",
    inStock: true,
    description: "Classic fit denim jeans",
    availableSizes: ["28", "30", "32", "34", "36"],
    relatedProducts: ["prod004", "prod006"]
  },
  "prod006": {
    name: "Hooded Sweatshirt",
    price: 49.99,
    category: "clothing",
    inStock: true,
    description: "Warm hooded sweatshirt for cold weather",
    availableSizes: ["S", "M", "L", "XL"],
    relatedProducts: ["prod004", "prod005"]
  },
  "prod007": {
    name: "Fitness Tracker Band",
    price: 89.99,
    category: "electronics",
    inStock: true,
    description: "Waterproof fitness band with sleep tracking",
    relatedProducts: ["prod003", "prod008"]
  },
  "prod008": {
    name: "Wireless Earbuds",
    price: 99.99,
    category: "electronics",
    inStock: true,
    description: "Compact wireless earbuds with charging case",
    relatedProducts: ["prod001", "prod007"]
  }
};

export const shippingInfo = {
  standard: {
    name: "Standard Shipping",
    cost: 5.99,
    estimatedDays: "5-7 business days"
  },
  express: {
    name: "Express Shipping",
    cost: 12.99,
    estimatedDays: "2-3 business days"
  },
  overnight: {
    name: "Overnight Shipping",
    cost: 24.99,
    estimatedDays: "1 business day"
  },
  international: {
    name: "International Shipping",
    cost: 29.99,
    estimatedDays: "7-14 business days"
  },
  freeThreshold: 75.00
};

export const returnPolicy = {
  general: "We offer a 30-day return policy for most items in new and unused condition.",
  electronics: "Electronics can be returned within 15 days of delivery for a full refund.",
  clothing: "Clothing items can be returned within 45 days if unworn with tags attached.",
  excludedItems: ["Gift cards", "Downloadable software", "Personal hygiene products"],
  process: "To initiate a return, log into your account or contact customer support with your order number.",
  shippingFee: "Return shipping fees are covered by the customer unless the item arrived damaged or incorrect."
};

export const faqs = [
  {
    question: "How can I track my order?",
    answer: "You can track your order by entering your order number and email on our website's Order Tracking page, or by contacting customer service."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay."
  },
  {
    question: "How do I change or cancel my order?",
    answer: "You can change or cancel your order within 1 hour of placing it by contacting our customer service team. After this window, we may not be able to modify orders that are being processed."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location."
  },
  {
    question: "How do I request a refund?",
    answer: "To request a refund, contact our customer service with your order number. Refunds are typically processed within 3-5 business days after the returned item is received."
  }
];
