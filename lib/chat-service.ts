export interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  child_id: string
}

export class ChatService {
  private socket: WebSocket | null = null
  private childId = ""
  private messageHandlers: ((message: ChatMessage) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []

  connect(childId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat/${childId}/?user_id=${userId}`

      try {
        this.socket = new WebSocket(wsUrl)
        this.childId = childId

        this.socket.onopen = () => {
          console.log("[v0] WebSocket connected")
          this.connectionHandlers.forEach((handler) => handler(true))
          resolve()
        }

        this.socket.onmessage = (event) => {
          const message: ChatMessage = JSON.parse(event.data)
          this.messageHandlers.forEach((handler) => handler(message))
        }

        this.socket.onerror = (error) => {
          console.error("[v0] WebSocket error:", error)
          reject(error)
        }

        this.socket.onclose = () => {
          console.log("[v0] WebSocket disconnected")
          this.connectionHandlers.forEach((handler) => handler(false))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message, child_id: this.childId }))
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
      this.socket.close()
      this.socket = null
    }
  }
}

export const chatService = new ChatService()
