import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faTimes,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBotReady, setIsBotReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Wake up the bot on mount
  useEffect(() => {
    const wakeUpBot = async () => {
      try {
        // Sending a dummy request to wake up the server
        await fetch("https://aziyan-my-n8n-bot.hf.space/webhook/pixy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatInput: "wake up" }),
        });
        setIsBotReady(true);
      } catch (error) {
        console.error("Error waking up bot:", error);
        // Even if it fails, we might want to let the user try or keep it disabled.
        // For now, let's enable it so they can see the error message if they try to chat.
        setIsBotReady(true);
      }
    };

    wakeUpBot();
  }, []);

  const toggleChat = () => {
    if (!isBotReady) return;
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    if (hasError) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Bot is currently not available you can directly contact the support team by clicking the btn",
          sender: "bot",
          isFallback: true,
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://aziyan-my-n8n-bot.hf.space/webhook/pixy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatInput: userMessage.text }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage = {
        text: data.reply || "Sorry, I didn't get that.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setHasError(true);
      setMessages((prev) => [
        ...prev,
        {
          text: "Bot is currently not available you can directly contact the support team by clicking the btn",
          sender: "bot",
          isFallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={toggleChat}
        disabled={!isBotReady}
        className={`fixed bottom-5 right-5 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50 hover:scale-110 transition-transform cursor-pointer hover:bg-blue-700 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } ${!isBotReady ? "opacity-70 cursor-wait" : ""}`}
        style={{
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        aria-label="Open Chat"
      >
        {!isBotReady ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <FontAwesomeIcon icon={faComment} />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-5 w-80 sm:w-96 h-[500px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-90 opacity-0 pointer-events-none translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Support AI</span>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700"
            aria-label="Close Chat"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-900 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`px-4 py-2 max-w-[85%] break-words text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white self-end rounded-2xl rounded-tr-sm"
                  : msg.isError
                  ? "bg-red-900/50 text-red-200 border border-red-800 self-start rounded-2xl rounded-tl-sm"
                  : "bg-zinc-800 text-gray-200 self-start rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.text}
              {msg.isFallback && (
                <a
                  href="https://wa.me/9188802136"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#128C7E] transition-colors w-fit text-xs font-bold no-underline"
                >
                  <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                  Contact Support
                </a>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-zinc-800 text-gray-400 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-800 text-white rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-zinc-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            aria-label="Send Message"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-sm translate-x-[-1px] translate-y-[1px]"
            />
          </button>
        </div>
      </div>

      {/* Re-open button when chat is open (optional, but good for UX if they want to minimize without closing completely, though here close button does the job. 
          The main button hides when open to avoid clutter, but we can keep it if preferred. 
          Current logic: button hides when open.
      */}
    </>
  );
}
