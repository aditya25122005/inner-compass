import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex space-x-3 max-w-3xl ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'order-1' : 'order-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}>
            {isBot ? (
              <Bot className="h-5 w-5 text-white" />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isBot ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-lg px-4 py-3 shadow-sm ${
            isBot 
              ? 'bg-white border border-gray-200' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}>
            {isBot ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-800 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-800">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-700 my-2">
                        {children}
                      </blockquote>
                    )
                  }}
                >
                  {message.message}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
            {isBot ? 'InnerCompass AI' : 'You'} • {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
