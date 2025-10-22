import io, { type Socket } from "socket.io-client"

export interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  room: string
}

export class ChatService {
  private socket: Socket | null = null
  private room = ""
  private messageHandlers: ((message: ChatMessage) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  connect(childId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"

      try {
        this.socket = io(socketUrl, {
          auth: {
            token: localStorage.getItem("token"),
          },
        })

        this.room = `child_${childId}`

        this.socket.on("connect", () => {
          console.log("[v0] Socket.io connected")
          this.socket?.emit("join_room", { room: this.room })
          this.connectionHandlers.forEach((handler) => handler(true))
          resolve()
        })

        this.socket.on("chat_message", (message: ChatMessage) => {
          this.messageHandlers.forEach((handler) => handler(message))
        })

        this.socket.on("error", (error) => {
          console.error("[v0] Socket.io error:", error)
          reject(error)
        })

        this.socket.on("disconnect", () => {
          console.log("[v0] Socket.io disconnected")
          this.connectionHandlers.forEach((handler) => handler(false))
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.connected) {
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
      this.socket.emit("chat_message", {
        room: this.room,
        message,
        sender: user?.name || "Unknown",
      })
    }
  }

  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler)
  }

  onConnectionChange(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler)
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const chatService = new ChatService()
