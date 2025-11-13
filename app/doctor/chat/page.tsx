"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"
import { chatService, type ChatMessage } from "@/lib/chat-service"
import { authService } from "@/lib/auth-service"

interface Message extends ChatMessage { senderName: string }

export default function DoctorChatPage() {
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")

  const [messages, setMessages] = useState<Message[]>([])

  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const init = async () => {
      const user = await authService.getUser()
      try {
        await chatService.connect(childId || undefined, user?.id)
        setConnected(true)
        chatService.onMessage((message: ChatMessage) => {
          setMessages((prev) => [
            ...prev,
            { ...message, senderName: message.sender === "doctor" ? "You" : "Caretaker" },
          ])
        })
        chatService.onConnectionChange((isConnected) => setConnected(isConnected))
      } catch (e) {
        // ignore for now
      }
    }
    init()
    return () => chatService.disconnect()
  }, [childId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)

    chatService.sendMessage(newMessage)
    setNewMessage("")
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chat with Caretaker</h1>
        <p className="text-slate-600">{childId ? `Child ID: ${childId}` : "Global chat"}</p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden mb-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === "doctor"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-slate-100 text-slate-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-2 ${msg.sender === "doctor" ? "text-white/70" : "text-slate-600"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Button type="button" size="icon" variant="outline" className="bg-transparent">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
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
          <strong>Note:</strong> All messages are encrypted and securely stored. Maintain professional communication
          standards.
        </p>
      </Card>
    </div>
  )
}
