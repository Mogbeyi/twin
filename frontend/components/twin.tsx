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
    <div className="flex flex-col h-full rounded-2xl shadow-2xl backdrop-blur-xl bg-white/70 border border-white/20 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-blue-600 text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            AI Digital Twin
          </h2>
          <p className="text-sm text-white/90 mt-2 ml-13 font-medium">
            Your AI course companion
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/50 to-gray-50/50">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-16 animate-fade-in">
            {hasAvatar ? (
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400 via-blue-400 to-slate-500 rounded-2xl blur-md opacity-40"></div>
                <Image
                  src="/avatar.png"
                  alt="Digital Twin Avatar"
                  width={80}
                  height={80}
                  className="relative rounded-2xl shadow-xl transform hover:scale-110 transition-transform border-2 border-white/50"
                />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            )}
            <p className="text-xl font-semibold mb-2">
              Emmy&apos;s Digital Twin
            </p>
            <p className="text-sm text-gray-500">
              Ask about my professional career
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-slide-in ${
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
                    width={40}
                    height={40}
                    className="rounded-xl shadow-lg transform hover:scale-110 transition-transform border-2 border-white/50"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-2xl p-4 shadow-lg transform hover:scale-[1.02] transition-all ${
                message.role === "user"
                  ? "bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 text-white"
                  : "bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-800"
              }`}
            >
              <div className="prose prose-sm max-w-none leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-4 mb-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-4 mb-2 space-y-1">
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
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <p
                className={`text-xs mt-2 font-medium ${
                  message.role === "user" ? "text-white/70" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-slide-in">
            <div className="flex-shrink-0">
              {hasAvatar ? (
                <Image
                  src="/avatar.png"
                  alt="Digital Twin Avatar"
                  width={40}
                  height={40}
                  className="rounded-xl shadow-lg border-2 border-white/50"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-slate-500 to-blue-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input with glassmorphism */}
      <div className="border-t border-white/20 p-6 bg-white/50 backdrop-blur-md">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-800 bg-white/80 backdrop-blur-sm placeholder-gray-400 shadow-sm"
            disabled={isLoading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 text-white rounded-xl hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
