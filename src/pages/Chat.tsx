import { useState, useRef, useEffect } from 'react'
import type { Message } from '../types/chat'
import ChatMessage from '../components/ChatMessage'

// 테스트용 메시지 데이터
const initialMessages: Message[] = [
  {
    id: '1',
    content: '안녕하세요! 😊',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 5),
    isMine: false,
    isRead: true,
    status: 'sent',
  },
  {
    id: '2',
    content: '안녕하세요~',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 4),
    isMine: true,
    isRead: true,
    status: 'sent',
  },
  {
    id: '3',
    content: '😍',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 3),
    isMine: false,
    isRead: true,
    status: 'sent',
  },
]

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateMessageStatus = (messageId: string) => {
    // 메시지 전송 상태 시뮬레이션
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      )
      // 상대방이 읽음 표시하는 것을 시뮬레이션
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, isRead: true }
              : msg
          )
        )
      }, 2000)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        type: 'text',
        createdAt: new Date(),
        isMine: true,
        status: 'sending',
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      simulateMessageStatus(newMessage.id)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-semibold">미니톡</h1>
      </header>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            전송
          </button>
        </div>
      </form>
    </div>
  )
} 