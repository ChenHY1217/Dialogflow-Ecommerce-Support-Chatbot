import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import database utility functions
import { 
  getOrderStatus, 
  getOrderDetails, 
  getTrackingInfo,
  getShippingInfo, 
  getReturnPolicy, 
  searchProducts,
  getRecommendedProducts,
  getFAQs
} from './databaseUtils.js';

const app = express();
app.use(cors());
app.use(express.json());

const keyFile = 'service-account.json'; // Path to your service account key file
const projectId = process.env.DIALOGFLOW_PROJECT_ID; // Your Dialogflow project ID
const languageCode = 'en-US';

async function getAccessToken() {
    const auth = new GoogleAuth({ keyFile, scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
}

// Endpoint to handle chat messages
// User sends a message from the frontend to this endpoint
// The server then forwards the message to Dialogflow and returns the response
app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;

    try {
        const token = await getAccessToken();

        const response = await axios.post(
            `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`,
            {
                queryInput: {
                    text: {
                        text: message,
                        languageCode
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const fulfillmentText = response.data.queryResult.fulfillmentText;
        res.json({ reply: fulfillmentText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Dialogflow API call failed' });
    }
});

// Endpoint to handle webhook requests from Dialogflow
// This is where Dialogflow sends the intent and parameters
// The server processes the intent and sends a response back to Dialogflow
// This is useful for handling custom logic, like checking order status
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Extract intent and parameters
    const intentName = body.queryResult.intent.displayName;
    const parameters = body.queryResult.parameters;
    
    console.log("Received intent:", intentName);
    console.log("With parameters:", parameters);

    let responseText = '';
    let fulfillmentMessages = [];

    try {
        switch (intentName) {
            case 'Check Order Status':
                const orderNumber = parameters.order_number;
                const status = await getOrderStatus(orderNumber);
                
                if (status === "not found") {
                    responseText = `I couldn't find an order with number #${orderNumber}. Please check the number and try again.`;
                } else {
                    responseText = `Your order #${orderNumber} is currently ${status}.`;
                    
                    // If order is shipped or delivered, add tracking info
                    if (status === "shipped" || status === "delivered") {
                        const trackingInfo = await getTrackingInfo(orderNumber);
                        if (trackingInfo.found) {
                            responseText += ` Tracking number: ${trackingInfo.trackingNumber}. ${trackingInfo.lastUpdate}.`;
                        }
                    }
                }
                break;
                
            case 'Order Details':
                const orderDetailsNumber = parameters.order_number;
                const orderDetails = await getOrderDetails(orderDetailsNumber);
                
                if (!orderDetails) {
                    responseText = `I couldn't find an order with number #${orderDetailsNumber}. Please check the number and try again.`;
                } else {
                    responseText = `Order #${orderDetailsNumber} placed on ${orderDetails.orderDate}:\n`;
                    
                    // Add product information
                    if (orderDetails.products && orderDetails.products.length > 0) {
                        responseText += "Items:\n";
                        orderDetails.products.forEach(product => {
                            responseText += `- ${product.name}: $${product.price}\n`;
                        });
                    }
                    
                    // Add status information
                    responseText += `\nStatus: ${orderDetails.status}`;
                    if (orderDetails.trackingNumber) {
                        responseText += `\nTracking Number: ${orderDetails.trackingNumber}`;
                    }
                }
                break;
                
            case 'Shipping Information':
                const shippingType = parameters.shipping_type;
                const shippingDetails = await getShippingInfo(shippingType);
                
                if (shippingType && shippingDetails.type) {
                    responseText = `${shippingDetails.name} costs $${shippingDetails.cost} and takes ${shippingDetails.estimatedDays}.`;
                } else {
                    responseText = "We offer the following shipping options:\n";
                    shippingDetails.types.forEach(option => {
                        responseText += `- ${option.name}: $${option.cost} (${option.estimatedDays})\n`;
                    });
                    responseText += `\nOrders over $${shippingDetails.freeThreshold} qualify for free standard shipping.`;
                }
                break;
                
            case 'Return Policy':
                const category = parameters.product_category;
                const returnPolicyInfo = await getReturnPolicy(category);
                
                if (category && returnPolicyInfo.category) {
                    responseText = `Return policy for ${category} products: ${returnPolicyInfo.policy}`;
                } else {
                    responseText = returnPolicyInfo.general + "\n\n";
                    
                    if (returnPolicyInfo.electronics) {
                        responseText += `Electronics: ${returnPolicyInfo.electronics}\n`;
                    }
                    
                    if (returnPolicyInfo.clothing) {
                        responseText += `Clothing: ${returnPolicyInfo.clothing}\n`;
                    }
                    
                    responseText += `\n${returnPolicyInfo.process}`;
                }
                break;
                
            case 'Product Recommendations':
                const productId = parameters.product_id;
                const productCategory = parameters.product_category;
                const recommendations = await getRecommendedProducts(productId, productCategory);
                
                if (recommendations.length === 0) {
                    responseText = "Sorry, I don't have any recommendations at the moment.";
                } else {
                    responseText = productCategory 
                        ? `Here are some popular products in the ${productCategory} category:\n` 
                        : "Here are some products you might like:\n";
                    
                    recommendations.forEach(product => {
                        responseText += `- ${product.name}: $${product.price} - ${product.description}\n`;
                    });
                }
                break;
                
            case 'FAQs':
                const topic = parameters.faq_topic;
                const faqs = await getFAQs(topic);
                
                if (faqs.length === 0) {
                    responseText = `I don't have information about "${topic}" in our FAQs.`;
                } else {
                    responseText = topic ? `Here are FAQs about "${topic}":\n\n` : "Here are our most frequently asked questions:\n\n";
                    
                    // Limit to first 3 FAQs to avoid very long messages
                    const limitedFaqs = faqs.slice(0, 3);
                    limitedFaqs.forEach((faq, index) => {
                        responseText += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
                    });
                    
                    if (faqs.length > 3) {
                        responseText += "You can ask me about any of these topics specifically if you need more information.";
                    }
                }
                break;
                
            default:
                responseText = "Sorry, I didn't understand that request.";
        }
    } catch (error) {
        console.error("Error handling webhook request:", error);
        responseText = "I'm sorry, but I encountered an error processing your request.";
    }

    // Respond in Dialogflow webhook format
    res.json({
        fulfillmentText: responseText,
        fulfillmentMessages: fulfillmentMessages.length > 0 ? fulfillmentMessages : undefined
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
