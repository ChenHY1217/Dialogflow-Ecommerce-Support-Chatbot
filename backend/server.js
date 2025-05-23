import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

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
    const orderNumber = parameters.order_number;

    console.log("Received intent:", intentName);
    console.log("With parameters:", parameters);

    let responseText = '';

    if (intentName === 'Check Order Status') {
        // Simulate a DB/API call
        const status = await getOrderStatus(orderNumber); // Replace with real DB logic
        responseText = `Your order #${orderNumber} is ${status}.`;
    } else {
        responseText = "Sorry, I didn't understand that request.";
    }

    // Respond in Dialogflow webhook format
    res.json({
        fulfillmentText: responseText
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
