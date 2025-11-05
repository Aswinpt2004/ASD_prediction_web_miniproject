"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, AlertCircle, ArrowLeft } from "lucide-react"
import { chatService, type ChatMessage } from "@/lib/chat-service"
import { authService } from "@/lib/auth-service"
import { childService, type Child } from "@/lib/child-service"

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
  const [childIdParam, setChildIdParam] = useState("")
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showChildSelector, setShowChildSelector] = useState(false)

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

        // Load children list
        const childrenResponse = await childService.getChildren()
        if (childrenResponse.success && childrenResponse.data) {
          setChildren(childrenResponse.data)
        }

        // Try to obtain childId from URL search params (client-only)
        let childId = childIdParam
        try {
          if (!childId && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search)
            childId = params.get("childId") || ""
            setChildIdParam(childId)
          }
        } catch (err) {
          // ignore
        }

        if (!childId || childId === 'null' || childId === 'undefined') {
          setShowChildSelector(true)
          return
        }

        // Find selected child
        if (childrenResponse.success && childrenResponse.data) {
          const child = childrenResponse.data.find((c: Child) => c._id === childId)
          if (child) {
            setSelectedChild(child)
          }
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

  const handleSelectChild = (child: Child) => {
    // Update URL and reload
    window.location.href = `/caretaker/chat?childId=${child._id}`
  }

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
        {selectedChild && (
          <p className="text-slate-600 mb-2">
            Chatting about: <span className="font-semibold">{selectedChild.name}</span>
          </p>
        )}
        <p className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}>
          {connected ? "✓ Connected" : "✗ Disconnected"}
        </p>
      </div>

      {/* Child Selector */}
      {showChildSelector && (
        <Card className="p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select a Child to Chat About</h2>
          <p className="text-slate-600 mb-6">Choose which child you want to discuss with the doctor.</p>
          
          {children.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">You haven't added any children yet.</p>
              <Link href="/caretaker/add-child">
                <Button>Add Child</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {children.map((child) => (
                <Card 
                  key={child._id} 
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleSelectChild(child)}
                >
                  <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                  <p className="text-sm text-slate-600">
                    DOB: {new Date(child.dob).toLocaleDateString()} • {child.gender}
                  </p>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <Link href="/caretaker/dashboard">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {error && !showChildSelector && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Chat Container - Only show if child is selected */}
      {!showChildSelector && (
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
      )}

      {/* Info Box */}
      {!showChildSelector && (
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All messages are encrypted and securely stored. Response times may vary based on the
          doctor's availability.
        </p>
      </Card>
      )}
    </div>
  )
}
