# E-commerce Chatbot Backend - Mock Database

This document explains the structure of the mock database and utility functions created for the Dialogflow E-commerce Support Chatbot.

## Database Structure

The mock database in `mockDatabase.js` contains the following collections:

### Orders
- Contains order information with status, dates, items, shipping details
- Key fields: status, orderDate, items, trackingNumber, shippingAddress

### Customers
- Customer profiles with contact information
- Key fields: name, email, phone, address

### Products
- Product catalog with pricing, availability, and related products
- Key fields: name, price, category, inStock, description, relatedProducts

### Shipping Information
- Shipping options, costs, and delivery timeframes
- Includes standard, express, overnight, and international shipping

### Return Policy
- Return policies by product category
- General return rules and exceptions

### FAQs
- Frequently asked questions and their answers

## Utility Functions (databaseUtils.js)

The following functions are available to access the mock database:

### Order Functions
- `getOrderStatus(orderNumber)`: Get the status of an order
- `getOrderDetails(orderNumber)`: Get detailed information about an order
- `getTrackingInfo(orderNumber)`: Get tracking information for a shipped order

### Shipping and Returns
- `getShippingInfo(shippingType)`: Get information about shipping options
- `getReturnPolicy(category)`: Get return policy information, optionally filtered by product category

### Product Functions
- `searchProducts(query)`: Search for products by keywords
- `getRecommendedProducts(productId, category)`: Get product recommendations based on a product ID or category

### Customer Support
- `getFAQs(topic)`: Get frequently asked questions, optionally filtered by topic
- `getCustomerInfo(customerId)`: Get customer information by ID
- `findCustomerByEmail(email)`: Find a customer by their email address

## Usage in Webhook

The updated webhook in `server.js` handles the following intents:

1. **Check Order Status** - Returns the current status of an order
2. **Order Details** - Returns detailed information about an order
3. **Shipping Information** - Returns information about shipping options
4. **Return Policy** - Explains the return policy, optionally for a specific product category
5. **Product Recommendations** - Suggests products based on product ID or category
6. **FAQs** - Returns frequently asked questions, optionally filtered by topic

Each intent handler uses the database utility functions to retrieve the necessary information and format a response appropriate for the Dialogflow webhook format.
