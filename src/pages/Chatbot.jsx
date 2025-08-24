import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react"; // Import the Send icon
import { useSendMessageMutation } from "@/app/chatbotApi";

const Chatbot = () => {
  // State to store chat messages
  const [messages, setMessages] = useState([]);
  // State to store current user input
  const [input, setInput] = useState("");
  // State for loading indicator while fetching from Gemini
  const [loading, setLoading] = useState(false);
  // Ref for scrolling to the latest message
  const messagesEndRef = useRef(null);

  const [sendMessage] = useSendMessageMutation();

  // Disclaimer message content (will be displayed at the bottom)
  const medicalDisclaimerContent =
    "Medical Disclaimer: This chatbot provides general information about menstrual health and should not replace professional medical advice. Always consult with a healthcare provider for personalized medical guidance.";

  // Initial greeting message for the chatbot
  const initialChatbotGreeting = {
    sender: "gemini", // This message is from the chatbot
    text: "Hi User! I'm Luna. I can help answer questions about menstrual cycles, symptoms, and tracking. What would you like to know?",
  };

  // Predefined quick questions
  const quickQuestions = [
    "What are the phases of menstrual cycle?",
    "How can I track ovulation?",
    "What causes period cramps?",
    "Is it normal to have irregular periods?",
    "What are signs of ovulation?",
    "How to manage PMS symptoms?",
  ];

  // Effect to add initial greeting and scroll to bottom on mount
  useEffect(() => {
    // Add the initial greeting message when the component mounts
    setMessages([initialChatbotGreeting]);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for scrolling to the bottom of the chat window when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simple Markdown parser for bold text, lists, and newlines
  const renderMarkdown = (markdownText) => {
    // Convert bold text **text** to <strong>text</strong>
    let htmlText = markdownText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Handle list items starting with *
    const lines = htmlText.split("\n");
    let inList = false;
    let processedLines = [];

    lines.forEach((line) => {
      if (line.trim().startsWith("* ")) {
        if (!inList) {
          processedLines.push("<ul>");
          inList = true;
        }
        processedLines.push(`<li>${line.trim().substring(2).trim()}</li>`);
      } else {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        if (line.trim().length > 0) {
          processedLines.push(`<p>${line.trim()}</p>`);
        }
      }
    });

    if (inList) {
      processedLines.push("</ul>");
    }
    htmlText = processedLines.join("");

    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };

  // Removed generateAffirmation function as requested

  // Handle sending message when the Send button is clicked or Enter is pressed
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessageToGemini(input.trim());
  };

  // Handle Enter key press event in the input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Function to send message to NestJS backend (which calls Gemini securely)
  const sendMessageToGemini = async (userMessage) => {
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userMessage },
    ]);
    setInput("");

    try {
      const sendMsg = await sendMessage( messages ).unwrap();
      console.log(sendMsg, "sendMsg");
      

      if (result.reply) {
        // Backend sends cleaned reply
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "gemini", text: result.reply },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "system", text: "Sorry, I couldn’t get a valid reply." },
        ]);
      }
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "system",
          text: "An error occurred while connecting to the chatbot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f1] to-[#fca9ad] flex flex-col items-center justify-center p-4 font-sans antialiased">
      {/* Quick Questions Section */}
      <div className="w-full max-w-6xl bg-white border border-gray-400 rounded-xl shadow-lg p-4 mb-8">
        <h2 className="text-2xl font-bold text-[#6b5b6b] mb-4">
          Quick Questions
        </h2>
        <p className="text-sm text-[#a998a9] mb-4">
          Click on any question to get started
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              className="bg-[#fff1f1] text-[#6b5b6b] border border-[#fca9ad] rounded-full py-2 px-4 text-sm font-medium shadow-sm
                                       hover:bg-[#fca9ad] hover:text-[#453b45] transition-colors duration-200
                                       focus:outline-none focus:ring-2 focus:ring-[#ff6f76]"
              onClick={() => sendMessageToGemini(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>
        {/* LLM-powered features - now empty as affirmation button is removed */}
        {/* This div can be removed if no more LLM-powered feature buttons are intended here */}
        {/* <div className="mt-6 text-center"></div> */}
      </div>

      {/* Chatbot Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[80vh] md:h-[70vh]">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#ff6f76] to-[#d5596f] text-white p-4 text-center rounded-t-xl shadow-md">
          <h1 className="text-2xl font-bold">Luna Chatbot</h1>
          <p className="text-sm opacity-90 mt-1">
            Ask me anything about your period!
          </p>
        </div>

        {/* Chat Messages Area - scrollable content */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {/* Render dynamic chat messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-[85%] shadow-md ${
                  msg.sender === "user"
                    ? "bg-[#d5596f] text-white"
                    : msg.sender === "gemini"
                    ? "bg-[#fff1f1] text-[#6b5b6b]"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {renderMarkdown(msg.text)}
              </div>
            </div>
          ))}
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#a998a9] text-[#453b45] rounded-lg p-3 max-w-[85%] shadow-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-[#a998a9] flex items-center gap-3">
          <input
            type="text"
            className="flex-grow p-3 border border-[#a998a9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff6f76] text-[#6b5b6b]"
            placeholder="Ask me about periods, symptoms, tracking..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            className="bg-gradient-to-r from-[#ff6f76] to-[#d5596f] text-white rounded-full p-3 px-5 shadow-lg hover:from-[#d5596f] hover:to-[#8a2e32] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={loading || input.trim() === ""}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Medical Disclaimer Section - Moved to the very bottom */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 mt-8 text-sm text-center text-[#6b5b6b] italic border border-[#a998a9]">
        {medicalDisclaimerContent}
      </div>
    </div>
  );
};

export default Chatbot;
