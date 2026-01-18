import { Header } from "../Header";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Bot, User, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useTranslation } from 'react-i18next';

interface AiPlannerProps {
  onNavigate: (page: string, id?: number) => void;
  isAdmin?: boolean;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  recommendations?: any[];
}

export function AiPlanner({ onNavigate, isAdmin }: AiPlannerProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  
  // Инициализируем сообщения. 
  // Текст первого сообщения берем через t()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: t('ai_welcome_message')
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/ai/ask/', {
        message: userMsg.text
      });

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.data.reply,
        recommendations: response.data.recommendations
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: t('ai_error_connection') 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isLoggedIn={true} isAdmin={isAdmin} onNavigate={onNavigate} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col h-[calc(100vh-80px)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-3">
            <Sparkles className="w-6 h-6 text-[#0A4B78]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('ai_planner_title')}</h1>
          <p className="text-gray-500">{t('ai_planner_subtitle')}</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'ai' ? 'bg-[#0A4B78] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                
                <div className={`max-w-[80%] space-y-3`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'ai' 
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                      : 'bg-[#0A4B78] text-white rounded-tr-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Recommendations Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 mt-2">
                      {msg.recommendations.map((item: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onNavigate(
                            item.type === 'attraction' ? 'attraction-details' : 'route-details', 
                            item.id
                          )}
                        >
                           <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                             {item.image && <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-semibold text-sm truncate text-[#0A4B78]">{item.title}</h4>
                             <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                             <div className="flex items-center text-xs text-[#0A4B78] font-medium">
                               {t('view_details')} <ArrowRight className="w-3 h-3 ml-1" />
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#0A4B78] text-white flex items-center justify-center">
                   <Bot className="w-6 h-6" />
                 </div>
                 <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-2">
              <Input 
                placeholder={t('ai_input_placeholder')} 
                className="bg-white"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <Button 
                className="bg-[#0A4B78] hover:bg-[#083A5E]" 
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}