"use client"

import * as React from "react"
import { CakeIcon, SendIcon } from "lucide-react"
import axios from "axios"

interface Message {
  text: string
  isUser: boolean
  timestamp: string
}

export default function App() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isThinking, setIsThinking] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) 

  React.useEffect(() => {
    const welcomeMessage: Message = {
      text: "Welcome to BakeBot! 🧁 I'm here to help you with all your baking needs. Ask me about any recipes or baking tips!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, userMessage]
      setTimeout(() => scrollToBottom(), 100)
      return newMessages
    })
    setInput("")
    setIsThinking(true)

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        user_query: input,
      })

      const aiMessage: Message = {
        text: response.data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, aiMessage]
        setTimeout(() => scrollToBottom(), 100)
        return newMessages
      })
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        text: "Sorry, I had trouble processing that request. Could you try again?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, errorMessage]
        setTimeout(() => scrollToBottom(), 100)
        return newMessages
      })
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-pink-50">
      <header className="bg-pink-400 text-white shadow-lg p-4 flex items-center gap-2">
        <CakeIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">BakeBot</h1>
      </header>

      <main className="flex-1 overflow-auto p-4 pb-24" ref={chatContainerRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-pink-700 mt-8">
              <CakeIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Ask me about any baking recipe!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`p-4 rounded-lg max-w-[80%] ${
                    message.isUser ? "bg-pink-400 text-white" : "bg-white shadow-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-2 ${message.isUser ? "text-pink-100" : "text-pink-500"}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
          {isThinking && (
            <div className="flex items-center space-x-2 text-pink-500">
              <div className="w-2 h-2 rounded-full animate-bounce bg-pink-500"></div>
              <div className="w-2 h-2 rounded-full animate-bounce bg-pink-500" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce bg-pink-500" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-pink-200 p-4 fixed bottom-0 w-full z-10 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a recipe..."
            className="flex-1 p-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="bg-pink-400 text-white p-2 rounded-lg hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  )
}

