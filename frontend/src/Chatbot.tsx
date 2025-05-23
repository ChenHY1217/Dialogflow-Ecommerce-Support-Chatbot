import React, { useState, useRef, useEffect } from "react";

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! Welcome to ShopSmart support. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { from: "user", text: input };
        setMessages((msgs) => [...msgs, userMessage]);
        setIsLoading(true);

        try {
            const res = await fetch(
                "https://dialogflow.googleapis.com/v2/projects/YOUR_PROJECT_ID/agent/sessions/123456789:detectIntent",
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer YOUR_DIALOGFLOW_ACCESS_TOKEN",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        queryInput: {
                            text: {
                                text: input,
                                languageCode: "en",
                            },
                        },
                    }),
                }
            );

            const data = await res.json();
            const botReply = data.queryResult?.fulfillmentText || "Sorry, I'm having trouble understanding. Could you rephrase that?";

            setMessages((msgs) => [
                ...msgs,
                { from: "bot", text: botReply },
            ]);
        } catch (error) {
            console.error("Error communicating with Dialogflow:", error);
            setMessages((msgs) => [
                ...msgs,
                { from: "bot", text: "Sorry, I'm having technical difficulties right now. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };    // Handle quick replies
    const handleQuickReply = (text: string) => {
        // Create a modified version of sendMessage that uses the provided text directly
        // instead of relying on the input state value
        const sendQuickReply = async () => {
            if (!text.trim()) return;
    
            const userMessage = { from: "user", text: text };
            setMessages((msgs) => [...msgs, userMessage]);
            setIsLoading(true);
    
            try {
                const res = await fetch(
                    "https://dialogflow.googleapis.com/v2/projects/YOUR_PROJECT_ID/agent/sessions/123456789:detectIntent",
                    {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer YOUR_DIALOGFLOW_ACCESS_TOKEN",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            queryInput: {
                                text: {
                                    text: text,
                                    languageCode: "en",
                                },
                            },
                        }),
                    }
                );
    
                const data = await res.json();
                const botReply = data.queryResult?.fulfillmentText || "Sorry, I'm having trouble understanding. Could you rephrase that?";
    
                setMessages((msgs) => [
                    ...msgs,
                    { from: "bot", text: botReply },
                ]);
            } catch (error) {
                console.error("Error communicating with Dialogflow:", error);
                setMessages((msgs) => [
                    ...msgs, 
                    { from: "bot", text: "Sorry, I'm having technical difficulties right now. Please try again later." },
                ]);
            } finally {
                setIsLoading(false);
                setInput("");
            }
        };
        
        // Update the input text for visual feedback
        setInput(text);
        // Send the message directly with the text
        sendQuickReply();
    };

    return (
        <div className="w-80 sm:w-96 h-[450px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200">
            {/* Chat header */}
            <div className="bg-indigo-600 text-white p-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-medium">ShopSmart Support</h3>
                    <p className="text-xs opacity-80">Online</p>
                </div>
            </div>

            {/* Messages area */}
            <div className="messages flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className={`message mb-3 ${msg.from === "user" ? "flex justify-end" : "flex justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.from === "user" 
                                ? "bg-indigo-600 text-white rounded-br-none" 
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                        }`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message mb-3 flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick reply suggestions */}
            <div className="quick-replies px-3 py-2 bg-gray-50 border-t border-gray-200 flex space-x-2 overflow-x-auto">
                {["Order Status", "Return Policy", "Shipping Info", "Product Help"].map((text, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleQuickReply(text)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full whitespace-nowrap hover:bg-gray-100"
                    >
                        {text}
                    </button>
                ))}
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center">
                <input
                    className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                    type="text"
                    placeholder="Type your message..."
                />
                <button 
                    className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                    onClick={sendMessage}
                    disabled={isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
