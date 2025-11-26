"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Twin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            session_id: sessionId || undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refocus the input after message is sent
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check if avatar exists
  const [hasAvatar, setHasAvatar] = useState(false);
  useEffect(() => {
    // Check if avatar.png exists
    fetch("/avatar.png", { method: "HEAD" })
      .then((res) => setHasAvatar(res.ok))
      .catch(() => setHasAvatar(false));
  }, []);

  return (
    <div className="flex flex-col h-full rounded-lg sm:rounded-2xl shadow-2xl backdrop-blur-xl bg-white/70 border border-white/20 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-blue-600 text-white p-3 sm:p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="truncate">AI Digital Twin</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1 sm:mt-2 ml-10 sm:ml-12 md:ml-13 font-medium">
            Your AI course companion
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 bg-gradient-to-b from-white/50 to-gray-50/50">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-8 sm:mt-12 md:mt-16 animate-fade-in">
            {hasAvatar ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400 via-blue-400 to-slate-500 rounded-xl sm:rounded-2xl blur-md opacity-40"></div>
                <Image
                  src="/avatar.png"
                  alt="Digital Twin Avatar"
                  width={80}
                  height={80}
                  className="relative rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-110 transition-transform border-2 border-white/50"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
            <p className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              Emmy&apos;s Digital Twin
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Ask about my professional career
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-2 sm:gap-3 md:gap-4 animate-slide-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                {hasAvatar ? (
                  <Image
                    src="/avatar.png"
                    alt="Digital Twin Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-110 transition-transform border-2 border-white/50"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                )}
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg transform hover:scale-[1.02] transition-all ${
                message.role === "user"
                  ? "bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 text-white"
                  : "bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-800"
              }`}
            >
              <div className="prose prose-sm max-w-none leading-relaxed text-sm sm:text-base">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1.5 sm:mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-3 sm:ml-4 mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-3 sm:ml-4 mb-1.5 sm:mb-2 space-y-0.5 sm:space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs sm:text-sm">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <p
                className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium ${
                  message.role === "user" ? "text-white/70" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-start animate-slide-in">
            <div className="flex-shrink-0">
              {hasAvatar ? (
                <Image
                  src="/avatar.png"
                  alt="Digital Twin Avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl shadow-lg border-2 border-white/50"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
              <div className="flex space-x-1.5 sm:space-x-2">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-slate-500 to-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input with glassmorphism */}
      <div className="border-t border-white/20 p-3 sm:p-4 md:p-6 bg-white/50 backdrop-blur-md">
        <div className="flex gap-2 sm:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 sm:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-sm sm:text-base text-gray-800 bg-white/80 backdrop-blur-sm placeholder-gray-400 shadow-sm"
            disabled={isLoading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 text-white rounded-lg sm:rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 sm:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
