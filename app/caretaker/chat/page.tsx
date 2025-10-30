"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, AlertCircle } from "lucide-react"
import { chatService, type ChatMessage } from "@/lib/chat-service"
import { authService } from "@/lib/auth-service"

interface Message extends ChatMessage {
  senderName: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const childIdParam = searchParams?.get("childId") || ""
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await authService.getUser()
        if (!user) {
          setError("User not authenticated")
          return
        }
        setCurrentUser(user)

        // Try to obtain childId from URL search params
        const searchParams = useSearchParams()
        const childId = childIdParam
        if (!childId) {
          setError("No child selected")
          return
        }

        await chatService.connect(childId, user.id)
        setConnected(true)

        // Listen for incoming messages
        chatService.onMessage((message: ChatMessage) => {
          setMessages((prev) => [
            ...prev,
            {
              ...message,
              senderName: message.sender === "doctor" ? "Dr. Maya Patel" : "You",
            },
          ])
        })

        // Listen for connection changes
        chatService.onConnectionChange((isConnected: boolean) => {
          setConnected(isConnected)
        })
      } catch (err) {
        setError("Failed to connect to chat")
        console.error("[v0] Chat connection error:", err)
      }
    }

  initializeChat()

    return () => {
      chatService.disconnect()
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !connected) return

    setLoading(true)

    // Add user message to UI
    const userName = currentUser?.name || (await authService.getUser())?.name || "You"
    const userMessage: Message = {
      id: `M${Date.now()}`,
      sender: "caretaker",
      senderName: userName,
      message: newMessage,
      timestamp: new Date().toISOString(),
      room: `child_${childIdParam}`,
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    chatService.sendMessage(newMessage)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chat with Doctor</h1>
        <p className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}>
          {connected ? "✓ Connected" : "✗ Disconnected"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden mb-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "caretaker" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === "caretaker"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-slate-100 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-2 ${msg.sender === "caretaker" ? "text-white/70" : "text-slate-600"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Button type="button" size="icon" variant="outline" className="bg-transparent" disabled={!connected}>
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder={connected ? "Type your message..." : "Connecting..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading || !connected}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !newMessage.trim() || !connected}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All messages are encrypted and securely stored. Response times may vary based on the
          doctor's availability.
        </p>
      </Card>
    </div>
  )
}
