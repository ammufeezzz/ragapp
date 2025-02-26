import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Upload, Book, FileText, MessageSquare, History, PlusCircle, X, Settings } from "lucide-react";

export default function BookSageAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Previous Chat", date: "Feb 26, 2025" }
  ]);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    
    setLoading(true);
    
    setTimeout(() => {
      const response = activeDocument 
        ? `I've analyzed "${activeDocument}" and found that ${input} relates to key sections on pages 12-15. The main concept discusses advanced retrieval techniques with context windows.`
        : `You asked: "${input}". To provide specific information, I'll need you to upload a document first.`;
        
      setMessages((prev) => [
        ...prev,
        { text: response, sender: "bot" },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setMessages([
        ...messages,
        { 
          text: `Uploaded file: ${selectedFile.name}`, 
          sender: "user" 
        }
      ]);
      
      setLoading(true);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { 
            text: `I've analyzed "${selectedFile.name}" and indexed its contents. What would you like to know about this document?`, 
            sender: "bot" 
          },
        ]);
        setLoading(false);
        setActiveDocument(selectedFile.name);
        
        // Add to documents list
        if (!documents.some(doc => doc.name === selectedFile.name)) {
          setDocuments([...documents, { name: selectedFile.name, date: new Date().toLocaleDateString() }]);
        }
        
        setSelectedFile(null);
      }, 1500);
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      // Save current chat to history
      const chatTitle = messages[0]?.text.substring(0, 30) + "..." || "New Chat";
      setChatHistory([...chatHistory, { 
        id: chatHistory.length + 1, 
        title: chatTitle, 
        date: new Date().toLocaleDateString() 
      }]);
    }
    
    setMessages([]);
    setActiveDocument(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      {/* Sidebar toggle for mobile */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0 flex flex-col h-full shadow-lg z-40 md:z-auto fixed md:relative`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center">
            <Book className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className="text-xl font-bold">BookSageAI</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={toggleTheme}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <Button 
            className={`w-full mb-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white flex items-center justify-center gap-2`}
            onClick={startNewChat}
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-grow overflow-auto">
          {/* Documents section */}
          <div className="p-4">
            <h2 className={`text-sm uppercase tracking-wider mb-4 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documents
              </div>
            </h2>
            
            <div className="space-y-2 mb-6">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload"
                className={`block w-full px-4 py-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded cursor-pointer transition-colors text-center`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Choose File
              </label>
              
              {selectedFile && (
                <div className="text-sm p-2 bg-blue-100 text-blue-800 rounded flex justify-between items-center dark:bg-blue-900 dark:text-blue-200">
                  <span className="truncate max-w-[180px]">
                    {selectedFile.name}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile}
                className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700' : 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300'} text-white`}
              >
                Upload & Analyze
              </Button>
            </div>
            
            <div className="space-y-1 mt-2">
              {documents.map((doc, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded flex justify-between items-center cursor-pointer ${activeDocument === doc.name ? (darkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}`}
                  onClick={() => setActiveDocument(doc.name)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{doc.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat history section */}
          <div className="p-4">
            <h2 className={`text-sm uppercase tracking-wider mb-4 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Chat History
              </div>
            </h2>
            
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id}
                  className={`p-2 rounded flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <div className="flex items-center gap-2 truncate max-w-[80%]">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{chat.title}</span>
                  </div>
                  <span className="text-xs opacity-70">{chat.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-grow flex flex-col h-full relative">
        {activeDocument && (
          <div className={`p-2 ${darkMode ? 'bg-blue-900/30 text-blue-200 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-100'} border-b flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Active document: {activeDocument}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 rounded-full"
              onClick={() => setActiveDocument(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col h-full">
          {/* Chat messages area */}
          <div className={`flex-grow overflow-auto mb-4 px-4 ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className={`p-12 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-lg mx-auto mb-8`}>
                  <Book className={`w-16 h-16 mb-6 mx-auto ${darkMode ? 'text-blue-400' : 'text-blue-600'} opacity-80`} />
                  <h2 className="text-2xl font-bold mb-4">Welcome to BookSageAI</h2>
                  <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upload any document and ask questions to instantly get insights and answers from its content.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Upload className={`w-5 h-5 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <p className="text-sm font-medium">Upload documents</p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <MessageSquare className={`w-5 h-5 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <p className="text-sm font-medium">Ask any question</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 py-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                        msg.sender === "user"
                          ? `${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white rounded-br-none`
                          : `${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} rounded-bl-none shadow-sm`
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mt-2">
                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-bl-none flex items-center shadow-sm`}>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Analyzing document...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input box */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm p-2 mb-4 rounded-xl`}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                className={`flex-grow ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-gray-50'} rounded-lg`}
                placeholder={activeDocument ? "Ask about your document..." : "Upload a document or start chatting..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                type="submit"
                disabled={!input.trim()}
                className={`${
                  !input.trim() 
                    ? (darkMode ? 'bg-gray-700' : 'bg-gray-300') 
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700')
                } text-white rounded-lg transition-colors`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
          
          <div className="text-center text-xs opacity-50 pb-2">
            BookSageAI © 2025 • Made with ❤️ for knowledge explorers
          </div>
        </div>
      </div>
    </div>
  );
}