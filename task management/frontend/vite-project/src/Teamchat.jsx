import React, { useContext, useState } from "react";
import { Send, Users, MessageCircle, Crown, User, Smile, Heart, ThumbsUp, Coffee, Zap, Star } from "lucide-react";
import Notecontext from "./Notecontext.jsx";

export default function Teamchat() {
  const { messages, sendMessage, LogedInUser } = useContext(Notecontext);
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const emojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
    '🤔', '🤗', '🤭', '🤫', '🤐', '😐', '😑', '😶', '😏', '😒',
    '👍', '👎', '👏', '🙌', '👊', '✊', '🤝', '🙏', '💪', '👌',
    '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔',
    '🔥', '⭐', '✨', '💫', '⚡', '💥', '💯', '✅', '❌', '⚠️',
    '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🎯', '🚀', '💎', '🌟'
  ];

  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojis(false);
  };

  const getRoleIcon = (role) => {
    if (role?.toLowerCase().includes('admin') || role?.toLowerCase().includes('manager')) {
      return <Crown className="w-3 h-3 text-amber-500" />;
    }
    return <User className="w-3 h-3 text-gray-400" />;
  };

  const getRoleColor = (role) => {
    if (role?.toLowerCase().includes('admin') || role?.toLowerCase().includes('manager')) {
      return 'text-amber-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{ marginTop: "70px" }}>
      
      <div className="fixed top-20 left-4 animate-bounce delay-1000">
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-full p-3 shadow-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="fixed top-32 right-8 animate-pulse">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="fixed top-96 left-8 animate-bounce delay-500">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-2 shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 py-8 relative">
        {/* Cute Character Corner */}
        <div className="absolute -top-4 -right-2 z-10">
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full p-4 shadow-2xl animate-pulse">
              <div className="text-3xl">🤖</div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-ping">
              <div className="bg-green-400 rounded-full w-3 h-3"></div>
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 shadow-lg">
              <div className="text-xs font-semibold text-gray-700">AI Assistant</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative">
         
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-green-500"></div>
          
          
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-6 py-8 relative overflow-hidden">
         
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 left-20 w-12 h-12 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Team Chat</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-200" />
                      <span className="text-blue-200 text-sm">Active as {LogedInUser?.role}</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm">Online</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
                  <div className="text-2xl font-bold text-white">
                    {messages.length}
                  </div>
                  <div className="text-blue-200 text-xs font-medium">
                    message{messages.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="p-8">
           
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-slate-200/50 h-[500px] overflow-y-auto p-6 mb-6 scroll-smooth shadow-inner relative">
              
              <div className="absolute top-4 right-4 opacity-5">
                <div className="text-6xl">💬</div>
              </div>
              
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-8 mb-6 shadow-xl">
                    <div className="text-4xl mb-2">🚀</div>
                    <MessageCircle className="w-12 h-12 text-white mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    No messages yet
                  </h3>
                  <p className="text-slate-500 text-lg">Start the conversation with your amazing team!</p>
                  <div className="flex gap-2 mt-4">
                    <div className="animate-bounce">👋</div>
                    <div className="animate-bounce delay-100">✨</div>
                    <div className="animate-bounce delay-200">🎉</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === LogedInUser?.username ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md relative ${
                          msg.sender === LogedInUser?.username
                            ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-white border-2 border-slate-200 text-slate-800 shadow-md"
                        } rounded-3xl px-6 py-4 transform hover:scale-105 transition-all duration-200`}
                      >
                        {msg.sender !== LogedInUser?.username && (
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {msg.sender?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(msg.role)}
                              <span className={`text-sm font-bold ${getRoleColor(msg.role)}`}>
                                {msg.sender}
                              </span>
                            </div>
                          </div>
                        )}
                        <p className={`text-sm leading-relaxed font-medium ${
                          msg.sender === LogedInUser?.username ? "text-white" : "text-slate-700"
                        }`}>
                          {msg.text}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className={`text-xs ${
                            msg.sender === LogedInUser?.username 
                              ? "text-blue-100" 
                              : "text-slate-500"
                          }`}>
                            {msg.time}
                          </span>
                          {msg.sender === LogedInUser?.username && (
                            <div className="text-blue-100 text-xs">✓</div>
                          )}
                        </div>
                        
                       
                        <div className={`absolute bottom-0 ${
                          msg.sender === LogedInUser?.username 
                            ? "-right-2" 
                            : "-left-2"
                        } w-0 h-0 ${
                          msg.sender === LogedInUser?.username
                            ? "border-l-8 border-t-8 border-transparent border-t-blue-500"
                            : "border-r-8 border-t-8 border-transparent border-t-white"
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emoji Picker */}
            {showEmojis && (
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-4 shadow-xl max-h-48 overflow-y-auto">
                <div className="grid grid-cols-10 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl hover:bg-slate-100 rounded-lg p-2 transition-all duration-200 hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your amazing message here... ✨"
                    className="w-full px-6 py-4 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300 text-sm font-medium shadow-sm"
                  />
                </div>
                
               
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={input.trim() === ""}
                  className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                  <Send className="w-5 h-5 relative z-10" />
                </button>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Press Enter to send • Chatting as <span className="font-bold text-blue-600">{LogedInUser?.username}</span></span>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Keep it positive!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-8 bg-gradient-to-r from-white/70 via-blue-50/70 to-purple-50/70 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-xl">
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-3 bg-white/50 rounded-full px-4 py-2 shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Online & Active</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-full px-4 py-2 shadow-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Team Collaboration</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-full px-4 py-2 shadow-sm">
              <Coffee className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Powered by Coffee</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-full px-4 py-2 shadow-sm">
              <MessageCircle className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Real-time Magic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}