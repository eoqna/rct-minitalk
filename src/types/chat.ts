export type MessageType = 'text'
export type MessageStatus = 'sending' | 'sent' | 'failed'

export interface Message {
  id: string
  content: string
  type: MessageType
  createdAt: Date
  isMine: boolean
  status?: MessageStatus
  isRead?: boolean
}

export interface ChatRoom {
  id: string
  pin: string
  createdAt: Date
} 