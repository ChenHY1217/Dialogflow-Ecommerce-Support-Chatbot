// Database utility functions for e-commerce chatbot
import { orders, products, shippingInfo, returnPolicy, faqs, customers } from './mockDatabase.js';

/**
 * Get order status by order number
 * @param {string} orderNumber - The order number to check
 * @returns {string} The status of the order
 */
export async function getOrderStatus(orderNumber) {
  // Simulate async database call
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders[orderNumber];
      if (order) {
        resolve(order.status);
      } else {
        resolve("not found");
      }
    }, 100);
  });
}

/**
 * Get detailed order information by order number
 * @param {string} orderNumber - The order number to check
 * @returns {object|null} The order information or null if not found
 */
export async function getOrderDetails(orderNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders[orderNumber];
      if (!order) {
        resolve(null);
        return;
      }
      
      // Add product details to the order
      const orderWithProducts = {
        ...order,
        products: order.items ? order.items.map(itemId => products[itemId]) : []
      };
      
      resolve(orderWithProducts);
    }, 100);
  });
}

/**
 * Get tracking information for an order
 * @param {string} orderNumber - The order number
 * @returns {object} Tracking information
 */
export async function getTrackingInfo(orderNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders[orderNumber];
      if (!order || !order.trackingNumber) {
        resolve({
          found: false,
          message: order ? "This order has not shipped yet." : "Order not found."
        });
        return;
      }
      
      resolve({
        found: true,
        trackingNumber: order.trackingNumber,
        carrier: "FastShip Logistics",
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        lastUpdate: order.status === "delivered" ? 
          `Delivered on ${order.deliveredDate}` : 
          "In transit"
      });
    }, 100);
  });
}

/**
 * Get shipping information
 * @param {string} shippingType - Type of shipping (optional)
 * @returns {object} Shipping information
 */
export async function getShippingInfo(shippingType = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shippingType && shippingInfo[shippingType]) {
        resolve({
          type: shippingType,
          ...shippingInfo[shippingType]
        });
      } else {
        resolve({
          types: Object.keys(shippingInfo)
            .filter(key => key !== 'freeThreshold')
            .map(key => ({ type: key, ...shippingInfo[key] })),
          freeThreshold: shippingInfo.freeThreshold
        });
      }
    }, 100);
  });
}

/**
 * Get return policy information
 * @param {string} category - Product category (optional)
 * @returns {object} Return policy information
 */
export async function getReturnPolicy(category = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category && returnPolicy[category]) {
        resolve({
          category,
          policy: returnPolicy[category]
        });
      } else {
        resolve(returnPolicy);
      }
    }, 100);
  });
}

/**
 * Search for products by query
 * @param {string} query - Search query
 * @returns {array} Matching products
 */
export async function searchProducts(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchTerms = query.toLowerCase().split(' ');
      
      const results = Object.values(products).filter(product => {
        const searchText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      });
      
      resolve(results);
    }, 100);
  });
}

/**
 * Get recommended products
 * @param {string} productId - Product ID to get recommendations for (optional)
 * @param {string} category - Product category for recommendations (optional)
 * @returns {array} Recommended products
 */
export async function getRecommendedProducts(productId = null, category = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (productId && products[productId]) {
        // Get related products for specific product
        const relatedProductIds = products[productId].relatedProducts || [];
        const recommendations = relatedProductIds
          .map(id => products[id])
          .filter(product => product && product.inStock);
        
        resolve(recommendations);
      } else if (category) {
        // Get popular products in category
        const categoryProducts = Object.values(products)
          .filter(product => product.category === category && product.inStock)
          .slice(0, 3);
        
        resolve(categoryProducts);
      } else {
        // Get random in-stock products as recommendations
        const randomProducts = Object.values(products)
          .filter(product => product.inStock)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        
        resolve(randomProducts);
      }
    }, 100);
  });
}

/**
 * Get frequently asked questions
 * @param {string} topic - FAQ topic to filter by (optional)
 * @returns {array} FAQs matching the topic or all FAQs
 */
export async function getFAQs(topic = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!topic) {
        resolve(faqs);
        return;
      }
      
      const topicLower = topic.toLowerCase();
      const filteredFaqs = faqs.filter(faq => {
        return faq.question.toLowerCase().includes(topicLower) || 
               faq.answer.toLowerCase().includes(topicLower);
      });
      
      resolve(filteredFaqs);
    }, 100);
  });
}

/**
 * Get customer information by customer ID
 * @param {string} customerId - Customer ID
 * @returns {object|null} Customer information or null if not found
 */
export async function getCustomerInfo(customerId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(customers[customerId] || null);
    }, 100);
  });
}

/**
 * Find customer by email
 * @param {string} email - Customer email
 * @returns {object|null} Customer information or null if not found
 */
export async function findCustomerByEmail(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customer = Object.values(customers).find(cust => 
        cust.email.toLowerCase() === email.toLowerCase()
      );
      
      if (customer) {
        const customerWithOrders = {
          ...customer,
          orders: Object.entries(orders)
            .filter(([_, order]) => order.customerId === customer.id)
            .map(([orderId, order]) => ({ orderId, ...order }))
        };
        resolve(customerWithOrders);
      } else {
        resolve(null);
      }
    }, 100);
  });
}
